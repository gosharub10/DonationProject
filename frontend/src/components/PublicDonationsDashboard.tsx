import { useEffect, useState } from 'react';
import type { PublicDonationDto, PublicDonationsSummary } from '../models/Payment';
import { getPublicDonations } from '../services/donationService';
import { formatTxHash, formatEthAmount, formatRelativeTime } from '../utils/formatUtils';
import PaymentStatusBadge from './PaymentStatusBadge';

/**
 * PublicDonationsDashboard component
 * Displays all donations across all projects in real-time
 * Auto-refreshes every 20 seconds
 * Completely public - no authentication required
 */
const PublicDonationsDashboard = () => {
  const [summary, setSummary] = useState<PublicDonationsSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copiedHash, setCopiedHash] = useState<string | null>(null);

  // Initial fetch
  useEffect(() => {
    const fetchDonations = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getPublicDonations(50);
        setSummary(data);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to load donations';
        setError(message);
        console.error('Error fetching public donations:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDonations();
  }, []);

  // Auto-refresh every 20 seconds
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const data = await getPublicDonations(50);
        setSummary(data);
      } catch (err) {
        console.error('Error auto-refreshing donations:', err);
      }
    }, 20000);

    return () => clearInterval(interval);
  }, []);

  /**
   * Handles copying transaction hash to clipboard
   */
  const handleCopyHash = (txHash: string) => {
    navigator.clipboard.writeText(txHash).then(() => {
      setCopiedHash(txHash);
      setTimeout(() => setCopiedHash(null), 2000);
    });
  };

  // Loading skeleton
  if (loading) {
    return (
      <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-2xl p-8">
        <h2 className="text-2xl font-bold text-white mb-8">Live Donation Feed</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="bg-white/5 border border-white/5 rounded-lg p-4 animate-pulse space-y-3"
            >
              <div className="h-4 bg-white/10 rounded w-3/4" />
              <div className="h-6 bg-white/10 rounded w-1/2" />
              <div className="h-4 bg-white/10 rounded w-full" />
              <div className="h-4 bg-white/10 rounded w-2/3" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-2xl p-8">
        <h2 className="text-2xl font-bold text-white mb-8">Live Donation Feed</h2>
        <div className="text-center py-12">
          <p className="text-red-400 text-sm mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 hover:bg-blue-700 transition px-6 py-2 rounded-lg text-white font-medium text-sm"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Empty state
  if (!summary || summary.recentDonations.length === 0) {
    return (
      <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-2xl p-8">
        <h2 className="text-2xl font-bold text-white mb-8">Live Donation Feed</h2>
        <div className="text-center py-12">
          <p className="text-slate-400 text-sm">No donations yet</p>
          <p className="text-slate-500 text-xs mt-2">Be the first to support a project!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-2xl p-8">
      {/* Header with summary stats */}
      <div className="mb-8 space-y-4">
        <h2 className="text-2xl font-bold text-white">Live Donation Feed</h2>
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white/5 border border-white/10 rounded-lg p-4">
            <p className="text-slate-400 text-xs font-semibold mb-1">Total Donations</p>
            <p className="text-white text-2xl font-bold">{summary.totalDonations}</p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-lg p-4">
            <p className="text-slate-400 text-xs font-semibold mb-1">Total ETH Raised</p>
            <p className="text-white text-2xl font-bold">{formatEthAmount(summary.totalEthRaised)}</p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-lg p-4">
            <p className="text-slate-400 text-xs font-semibold mb-1">Confirmed</p>
            <p className="text-green-400 text-2xl font-bold">{summary.confirmedDonations}</p>
          </div>
        </div>
      </div>

      {/* Donations grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {summary.recentDonations.map((donation) => (
          <DonationCard
            key={donation.txHash}
            donation={donation}
            isCopied={copiedHash === donation.txHash}
            onCopyHash={handleCopyHash}
          />
        ))}
      </div>

      {/* Auto-refresh indicator */}
      <div className="mt-6 text-center text-slate-500 text-xs flex items-center justify-center gap-2">
        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
        Auto-refreshing every 20 seconds
      </div>
    </div>
  );
};

/**
 * Individual donation card component
 */
interface DonationCardProps {
  donation: PublicDonationDto;
  isCopied: boolean;
  onCopyHash: (hash: string) => void;
}

const DonationCard = ({ donation, isCopied, onCopyHash }: DonationCardProps) => {
  return (
    <div className="bg-white/5 border border-white/10 rounded-lg p-5 hover:bg-white/10 transition">
      {/* Project title */}
      <h3 className="text-white font-semibold text-sm mb-3 truncate">
        {donation.projectTitle}
      </h3>

      {/* Amount (prominent) */}
      <div className="mb-4">
        <p className="text-2xl font-bold text-blue-400">
          {formatEthAmount(donation.amount)} {donation.currency}
        </p>
      </div>

      {/* Status badge */}
      <div className="mb-4">
        <PaymentStatusBadge status={donation.status} />
      </div>

      {/* Transaction hash (copyable) */}
      <div className="mb-4 space-y-1">
        <p className="text-slate-400 text-xs">Transaction</p>
        <button
          onClick={() => onCopyHash(donation.txHash)}
          className="w-full text-left bg-white/5 hover:bg-white/10 border border-white/10 rounded px-3 py-2 text-slate-300 text-xs font-mono transition flex items-center justify-between group"
          title={`Click to copy: ${donation.txHash}`}
        >
          <span className="truncate">{formatTxHash(donation.txHash)}</span>
          {isCopied ? (
            <span className="text-green-400 text-xs font-semibold flex-shrink-0">✓</span>
          ) : (
            <span className="text-slate-500 group-hover:text-slate-300 text-xs flex-shrink-0">📋</span>
          )}
        </button>
      </div>

      {/* Time */}
      <div className="text-slate-500 text-xs mb-3">
        {formatRelativeTime(new Date(donation.createdAt))}
      </div>

      {/* Etherscan link */}
      <a
        href={donation.etherscanUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="w-full inline-block text-center bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 rounded text-blue-300 hover:text-blue-200 text-xs py-2 transition font-medium"
      >
        View on Etherscan →
      </a>
    </div>
  );
};

export default PublicDonationsDashboard;
