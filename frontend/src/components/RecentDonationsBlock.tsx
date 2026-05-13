import { useEffect, useState } from 'react';
import type { PaymentHistoryResponse } from '../models/Payment';
import { getProjectPayments } from '../services/paymentService';
import { formatTxHash, formatEthAmount, formatRelativeTime } from '../utils/formatUtils';
import PaymentStatusBadge from './PaymentStatusBadge';

interface RecentDonationsBlockProps {
  projectId: string;
  triggerRefresh?: number;
}

const RecentDonationsBlock = ({ projectId, triggerRefresh = 0 }: RecentDonationsBlockProps) => {
  const [payments, setPayments] = useState<PaymentHistoryResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [autoRefreshEnabled, setAutoRefreshEnabled] = useState(true);

  // Initial fetch
  useEffect(() => {
    const fetchPayments = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getProjectPayments(projectId);
        setPayments(data);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to load donations';
        setError(message);
        console.error('Error fetching payments:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, [projectId, triggerRefresh]);

  // Auto-refresh pending payments every 20 seconds
  useEffect(() => {
    if (!autoRefreshEnabled || payments.length === 0) return;

    const hasPendingPayments = payments.some((p) => p.status === 'pending');
    if (!hasPendingPayments) return;

    const interval = setInterval(async () => {
      try {
        const data = await getProjectPayments(projectId);
        setPayments(data);
      } catch (err) {
        console.error('Error auto-refreshing payments:', err);
      }
    }, 20000); // Refresh every 20 seconds

    return () => clearInterval(interval);
  }, [projectId, payments, autoRefreshEnabled]);

  // Loading skeleton
  if (loading) {
    return (
      <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-2xl p-6">
        <h2 className="text-lg mb-4 text-slate-300 font-semibold">Recent Donations</h2>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-20 bg-white/5 border border-white/5 rounded-lg animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-2xl p-6">
        <h2 className="text-lg mb-4 text-slate-300 font-semibold">Recent Donations</h2>
        <div className="text-center py-8">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  // Empty state
  if (payments.length === 0) {
    return (
      <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-2xl p-6">
        <h2 className="text-lg mb-4 text-slate-300 font-semibold">Recent Donations</h2>
        <div className="text-center py-12">
          <p className="text-slate-400 text-sm mb-2">No donations yet</p>
          <p className="text-slate-500 text-xs">Be the first to support this project!</p>
        </div>
      </div>
    );
  }

  const hasPending = payments.some((p) => p.status === 'pending');

  return (
    <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <h2 className="text-lg text-slate-300 font-semibold">Recent Donations</h2>
          {hasPending && (
            <span className="inline-flex items-center gap-1 text-xs text-amber-400">
              <span className="animate-spin">⟳</span>
              <span>Updating...</span>
            </span>
          )}
        </div>
        <span className="text-xs text-slate-400 bg-white/5 px-3 py-1 rounded-full">
          {payments.length} {payments.length === 1 ? 'donation' : 'donations'}
        </span>
      </div>

      {/* Donations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {payments.map((payment) => (
          <div
            key={payment.id}
            className="group relative bg-linear-to-br from-white/10 to-white/5 border border-white/10 rounded-lg p-4 hover:border-white/20 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/10 hover:-translate-y-1"
          >
            {/* Glow effect on hover */}
            <div className="absolute inset-0 bg-linear-to-br from-purple-500/0 via-transparent to-blue-500/0 group-hover:from-purple-500/10 group-hover:to-blue-500/10 rounded-lg transition-all duration-300" />

            <div className="relative space-y-3">
              {/* Amount + Status Badge */}
              <div className="flex items-start justify-between gap-2">
                <p className="text-2xl font-bold text-white">
                  {formatEthAmount(payment.amount, 4)}
                </p>
                <PaymentStatusBadge
                  status={payment.status}
                  confirmations={payment.confirmationCount}
                  requiredConfirmations={12}
                />
              </div>

              {/* TxHash */}
              <div className="text-xs text-slate-400 font-mono break-all">
                {formatTxHash(payment.txHash)}
              </div>

              {/* Confirmation Progress (if pending) */}
              {payment.status === 'pending' && payment.confirmationCount > 0 && (
                <div className="bg-white/5 rounded px-2 py-1">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs text-slate-400">Confirmations</span>
                    <span className="text-xs font-semibold text-amber-400">
                      {payment.confirmationCount}/12
                    </span>
                  </div>
                  <div className="w-full h-1 bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-linear-to-r from-amber-500 to-yellow-500 transition-all duration-300"
                      style={{
                        width: `${Math.min((payment.confirmationCount / 12) * 100, 100)}%`,
                      }}
                    />
                  </div>
                </div>
              )}

              {/* Date */}
              <p className="text-xs text-slate-500">
                {formatRelativeTime(payment.createdAt)}
              </p>

              {/* Etherscan Link */}
              <a
                href={payment.etherscanUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 transition-colors group/link"
              >
                <span>View on Etherscan</span>
                <span className="group-hover/link:translate-x-0.5 transition-transform">→</span>
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentDonationsBlock;
