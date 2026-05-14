import { useEffect, useState } from 'react';
import type { PublicDonationDto, PublicDonationsSummary } from '../models/Payment';
import { getPublicDonations } from '../services/donationService';
import { formatTxHash, formatEthAmount, formatRelativeTime } from '../utils/formatUtils';
import PaymentStatusBadge from './PaymentStatusBadge';
import { Copy, Check, ExternalLink, Activity } from 'lucide-react';

const PublicDonationsDashboard = () => {
  const [summary, setSummary] = useState<PublicDonationsSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copiedHash, setCopiedHash] = useState<string | null>(null);

  useEffect(() => {
    const fetchDonations = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getPublicDonations(50);
        setSummary(data);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Ошибка при загрузке транзакций';
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    fetchDonations();
  }, []);

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

  const handleCopyHash = (txHash: string) => {
    navigator.clipboard.writeText(txHash).then(() => {
      setCopiedHash(txHash);
      setTimeout(() => setCopiedHash(null), 2000);
    });
  };

  if (loading) {
    return (
      <div className="premium-card p-8 bg-white border border-brand-beige">
        <div className="animate-pulse space-y-8">
          <div className="grid grid-cols-3 gap-4">
            <div className="h-20 bg-slate-100 rounded-xl" />
            <div className="h-20 bg-slate-100 rounded-xl" />
            <div className="h-20 bg-slate-100 rounded-xl" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-40 bg-slate-100 rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="premium-card p-8 text-center bg-white border border-brand-beige">
        <p className="text-red-500 font-medium mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="bg-brand-primary hover:bg-brand-secondary transition-colors px-6 py-2 rounded-xl text-white font-medium"
        >
          Повторить
        </button>
      </div>
    );
  }

  if (!summary || summary.recentDonations.length === 0) {
    return (
      <div className="premium-card p-8 text-center bg-white border border-brand-beige">
        <p className="text-slate-500 font-medium">Пока нет пожертвований</p>
        <p className="text-slate-400 text-sm mt-2">Станьте первым, кто поддержит проекты!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="premium-card p-6 flex flex-col justify-center border-brand-beige">
          <p className="text-slate-500 text-sm font-medium mb-1 uppercase tracking-wide">Всего транзакций</p>
          <p className="text-slate-900 text-3xl font-bold">{summary.totalDonations}</p>
        </div>
        <div className="premium-card p-6 flex flex-col justify-center border-brand-beige">
          <p className="text-slate-500 text-sm font-medium mb-1 uppercase tracking-wide">Собрано ETH</p>
          <p className="text-transparent bg-clip-text bg-linear-to-r from-brand-primary to-brand-accent text-3xl font-bold">
            {formatEthAmount(summary.totalEthRaised)}
          </p>
        </div>
        <div className="premium-card p-6 flex flex-col justify-center border-brand-beige">
          <p className="text-slate-500 text-sm font-medium mb-1 uppercase tracking-wide">Успешных</p>
          <p className="text-green-600 text-3xl font-bold">{summary.confirmedDonations}</p>
        </div>
      </div>

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

      <div className="mt-6 text-center text-slate-400 text-sm flex items-center justify-center gap-2 font-medium">
        <Activity size={16} className="text-green-500 animate-pulse" />
        Живое обновление (каждые 20 сек)
      </div>
    </div>
  );
};

interface DonationCardProps {
  donation: PublicDonationDto;
  isCopied: boolean;
  onCopyHash: (hash: string) => void;
}

const DonationCard = ({ donation, isCopied, onCopyHash }: DonationCardProps) => {
  return (
    <div className="premium-card p-5 group flex flex-col justify-between">
      <div>
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-slate-800 font-bold text-sm truncate pr-2 max-w-[75%]">
            {donation.projectTitle}
          </h3>
          <PaymentStatusBadge status={donation.status} />
        </div>

        <div className="mb-4">
          <p className="text-2xl font-black text-brand-primary">
            {formatEthAmount(donation.amount)} <span className="text-base text-brand-secondary">{donation.currency}</span>
          </p>
        </div>

        <div className="mb-4">
          <p className="text-slate-500 text-xs uppercase tracking-wide font-medium mb-1">Hash транзакции</p>
          <button
            onClick={() => onCopyHash(donation.txHash)}
            className="w-full text-left bg-slate-50 hover:bg-brand-primary/5 border border-slate-200 hover:border-brand-primary/20 rounded-lg px-3 py-2 text-slate-600 text-xs font-mono transition-colors flex items-center justify-between"
            title="Скопировать"
          >
            <span className="truncate">{formatTxHash(donation.txHash)}</span>
            {isCopied ? (
              <Check size={14} className="text-green-500 shrink-0" />
            ) : (
              <Copy size={14} className="text-slate-400 shrink-0" />
            )}
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between mt-2 pt-4 border-t border-slate-100">
        <div className="text-slate-500 text-xs font-medium">
          {formatRelativeTime(new Date(donation.createdAt))}
        </div>
        <a
          href={donation.etherscanUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-brand-secondary hover:text-brand-accent text-xs font-bold transition-colors flex items-center gap-1"
        >
          Etherscan <ExternalLink size={12} />
        </a>
      </div>
    </div>
  );
};

export default PublicDonationsDashboard;
