import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export interface AOIExplanation {
  id: string;
  entity_type: string;
  entity_id: string;
  explanation_type: string;
  explanation_md: string;
  language: string;
  created_at: string;
  updated_at: string;
}

export function useAOIExplain(entityType: string, entityId: string | undefined, explanationType?: string) {
  const [explanation, setExplanation] = useState<AOIExplanation | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!entityId) {
      setExplanation(null);
      return;
    }

    const fetchExplanation = async () => {
      setLoading(true);
      setError(null);

      try {
        let query = supabase
          .from('aoi_explanations')
          .select('*')
          .eq('entity_type', entityType)
          .eq('entity_id', entityId)
          .order('updated_at', { ascending: false })
          .limit(1);

        if (explanationType) {
          query = query.eq('explanation_type', explanationType);
        }

        const { data, error: fetchError } = await query.maybeSingle();

        if (fetchError) {
          console.error('Error fetching aOi explanation:', fetchError);
          setError(fetchError.message);
          return;
        }

        setExplanation(data);
      } catch (err) {
        console.error('Unexpected error:', err);
        setError('Failed to load explanation');
      } finally {
        setLoading(false);
      }
    };

    fetchExplanation();
  }, [entityType, entityId, explanationType]);

  return { explanation, loading, error };
}
