import { Calendar, DollarSign, CheckCircle, Clock } from 'lucide-react';

interface MaintenancePayment {
  id: string;
  payment_date: string;
  amount_tyt: number;
  amount_usd: number;
  payment_method: string;
  discount_applied: number;
  status: string;
}

interface MinerMaintenanceHistoryProps {
  payments: MaintenancePayment[];
}

export default function MinerMaintenanceHistory({ payments }: MinerMaintenanceHistoryProps) {
  if (payments.length === 0) {
    return (
      <div className="bg-navy-800 border border-gold-500/20 rounded-xl p-6">
        <h3 className="text-lg font-bold text-white mb-4">Maintenance History</h3>
        <div className="text-center py-8">
          <Clock className="w-12 h-12 text-gray-600 mx-auto mb-3" />
          <p className="text-gray-400">No maintenance payments yet</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-navy-800 border border-gold-500/20 rounded-xl p-6">
      <h3 className="text-lg font-bold text-white mb-4">Maintenance History</h3>
      <div className="space-y-3">
        {payments.map((payment) => (
          <div
            key={payment.id}
            className="bg-navy-700/50 border border-gray-700 rounded-lg p-4 flex items-center justify-between"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <p className="text-sm text-white">
                    {new Date(payment.payment_date).toLocaleDateString()}
                  </p>
                </div>
                <p className="text-xs text-gray-400">
                  Paid via {payment.payment_method}
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-2 justify-end">
                <DollarSign className="w-4 h-4 text-gold-400" />
                <p className="text-lg font-bold text-white">
                  {payment.amount_tyt} TYT
                </p>
              </div>
              {payment.discount_applied > 0 && (
                <p className="text-xs text-green-400">
                  {payment.discount_applied}% discount applied
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
