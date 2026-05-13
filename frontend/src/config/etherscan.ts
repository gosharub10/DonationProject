/**
 * Etherscan configuration for Sepolia testnet
 */
export const ETHERSCAN_BASE_URL = 'https://sepolia.etherscan.io/tx/';

export const getEtherscanUrl = (txHash: string): string => {
  if (!txHash) {
    throw new Error('Transaction hash cannot be empty');
  }
  return `${ETHERSCAN_BASE_URL}${txHash}`;
};
