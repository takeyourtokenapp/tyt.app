import { createClient } from 'npm:@supabase/supabase-js@2.57.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

interface MaintenanceCalc {
  power_kw: number;
  daily_kwh: number;
  kwh_rate: number;
  elec_usd: number;
  service_usd: number;
  subtotal_usd: number;
  discount_bps: number;
  discount_pct: number;
  discount_amount_usd: number;
  total_usd: number;
  region: string;
  days: number;
}

interface Miner {
  id: string;
  token_id: string;
  owner_id: string;
  hashrate: number;
  efficiency: number;
  farm_id: string | null;
  status: string;
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const cronSecret = Deno.env.get('CRON_SECRET');
    const authHeader = req.headers.get('Authorization');

    if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
      console.warn('Unauthorized: Missing or invalid cron secret');
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    console.log('Starting maintenance invoice generation...');

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];

    const { data: activeMiners, error: minersError } = await supabase
      .from('nft_miners')
      .select('id, token_id, owner_id, hashrate, efficiency, farm_id, status')
      .eq('status', 'active');

    if (minersError) {
      throw new Error(`Failed to fetch miners: ${minersError.message}`);
    }

    if (!activeMiners || activeMiners.length === 0) {
      console.log('No active miners found');
      return new Response(
        JSON.stringify({
          success: true,
          message: 'No active miners to invoice',
          miners_processed: 0
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Processing ${activeMiners.length} active miners...`);

    const { data: totalVetyTData } = await supabase
      .from('vetyt_locks')
      .select('locked_amount')
      .eq('is_active', true);

    const totalVetyt = totalVetyTData?.reduce((sum, lock) => sum + parseFloat(lock.locked_amount), 0) || 1;

    let invoicesCreated = 0;
    let invoicesSkipped = 0;
    const errors: string[] = [];

    for (const miner of activeMiners as Miner[]) {
      try {
        const { data: existingInvoice } = await supabase
          .from('maintenance_invoices')
          .select('id')
          .eq('miner_id', miner.id)
          .gte('period_start', yesterdayStr)
          .lte('period_end', todayStr)
          .maybeSingle();

        if (existingInvoice) {
          invoicesSkipped++;
          continue;
        }

        const { data: vipData } = await supabase
          .from('profiles')
          .select('vip_level')
          .eq('id', miner.owner_id)
          .maybeSingle();

        const { data: vetyTData } = await supabase
          .from('vetyt_locks')
          .select('locked_amount')
          .eq('user_id', miner.owner_id)
          .eq('is_active', true);

        const userVetyt = vetyTData?.reduce((sum, lock) => sum + parseFloat(lock.locked_amount), 0) || 0;

        const { data: serviceButton } = await supabase
          .from('user_activities')
          .select('id')
          .eq('user_id', miner.owner_id)
          .eq('activity_type', 'service_button')
          .gte('created_at', yesterdayStr)
          .maybeSingle();

        const calcResult = await supabase.rpc('calculate_maintenance', {
          p_power_th: miner.hashrate,
          p_efficiency_w_th: miner.efficiency,
          p_region: miner.farm_id || 'Default',
          p_days: 1,
          p_vip_level: vipData?.vip_level || 0,
          p_prepay_days: 0,
          p_vetyt_power: userVetyt,
          p_total_vetyt: totalVetyt,
          p_service_button: !!serviceButton,
        });

        if (calcResult.error) {
          throw new Error(`Calculation failed for miner ${miner.token_id}: ${calcResult.error.message}`);
        }

        const calc = calcResult.data as MaintenanceCalc;

        const { error: insertError } = await supabase
          .from('maintenance_invoices')
          .insert({
            user_id: miner.owner_id,
            miner_id: miner.id,
            invoice_date: yesterdayStr,
            due_date: tomorrowStr,
            period_start: yesterdayStr,
            period_end: todayStr,
            base_cost_usd: calc.subtotal_usd,
            kwh_consumed: calc.daily_kwh,
            kwh_rate: calc.kwh_rate,
            elec_usd: calc.elec_usd,
            service_usd: calc.service_usd,
            total_discount_percent: calc.discount_pct,
            discount_pct: calc.discount_pct,
            final_cost_usd: calc.total_usd,
            status: 'pending',
            metadata: {
              calculation: calc,
              service_button_used: !!serviceButton,
              vip_level: vipData?.vip_level || 0,
              vetyt_balance: userVetyt,
            },
          });

        if (insertError) {
          if (insertError.code === '23505') {
            invoicesSkipped++;
          } else {
            throw insertError;
          }
        } else {
          invoicesCreated++;
        }
      } catch (error) {
        const errorMsg = `Miner ${miner.token_id}: ${error instanceof Error ? error.message : 'Unknown error'}`;
        console.error(errorMsg);
        errors.push(errorMsg);
      }
    }

    await supabase.rpc('mark_overdue_invoices');

    await supabase.from('cron_job_logs').insert({
      job_name: 'cron-maintenance-invoices',
      status: errors.length > 0 ? 'completed_with_errors' : 'completed',
      result: {
        miners_processed: activeMiners.length,
        invoices_created: invoicesCreated,
        invoices_skipped: invoicesSkipped,
        errors: errors.length > 0 ? errors : undefined,
      },
    });

    console.log(`Maintenance invoice generation complete: ${invoicesCreated} created, ${invoicesSkipped} skipped`);

    return new Response(
      JSON.stringify({
        success: true,
        miners_processed: activeMiners.length,
        invoices_created: invoicesCreated,
        invoices_skipped: invoicesSkipped,
        errors: errors.length > 0 ? errors : undefined,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Cron maintenance invoices error:', error);

    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
