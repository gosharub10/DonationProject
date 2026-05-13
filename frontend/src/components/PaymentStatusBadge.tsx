import type { PaymentStatus } from '../models/Payment';

interface PaymentStatusBadgeProps {
  status: PaymentStatus;
  confirmations?: number;
  requiredConfirmations?: number;
}

/**
 * Badge component showing payment status with color coding
 * pending (yellow) → confirmed (green) → failed (red)
 */
export const PaymentStatusBadge = ({
  status,
  confirmations = 0,
  requiredConfirmations = 12,
}: PaymentStatusBadgeProps) => {
  const getStatusStyles = (status: PaymentStatus) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-500/20 text-green-200 border border-green-500/30';
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-200 border border-yellow-500/30';
      case 'failed':
        return 'bg-red-500/20 text-red-200 border border-red-500/30';
      case 'cancelled':
        return 'bg-gray-500/20 text-gray-200 border border-gray-500/30';
      default:
        return 'bg-gray-500/20 text-gray-200 border border-gray-500/30';
    }
  };

  const getStatusLabel = (status: PaymentStatus) => {
    if (status === 'pending' && confirmations > 0) {
      return `${status} (${confirmations}/${requiredConfirmations})`;
    }
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold transition-colors ${getStatusStyles(status)}`}
    >
      {status === 'confirmed' && <span className="mr-1">✓</span>}
      {status === 'failed' && <span className="mr-1">✕</span>}
      {status === 'pending' && <span className="mr-1 animate-spin">⟳</span>}
      {getStatusLabel(status)}
    </span>
  );
};

export default PaymentStatusBadge;
