/**
 * Formatting utilities for display
 */

/**
 * Format transaction hash to short version: 0x1234...abcd
 */
export const formatTxHash = (hash: string): string => {
  if (!hash || hash.length < 10) {
    return hash;
  }
  const start = hash.substring(0, 6);
  const end = hash.substring(hash.length - 4);
  return `${start}...${end}`;
};

/**
 * Format ETH amount with specified decimals
 */
export const formatEthAmount = (amount: number, decimals: number = 4): string => {
  if (amount === undefined || amount === null) {
    return '0 ETH';
  }
  return `${amount.toFixed(decimals)}`;
};

/**
 * Format date as relative time (e.g., "2 hours ago")
 * Uses a simple implementation; can be replaced with date-fns if needed
 */
export const formatRelativeTime = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffMs = now.getTime() - dateObj.getTime();
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSeconds < 60) {
    return 'just now';
  }
  if (diffMinutes < 60) {
    return `${diffMinutes} minute${diffMinutes > 1 ? 's' : ''} ago`;
  }
  if (diffHours < 24) {
    return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  }
  if (diffDays < 30) {
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  }

  // Fall back to formatted date
  return dateObj.toLocaleDateString();
};
