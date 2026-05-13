export type PaymentStatus = 'pending' | 'confirmed' | 'failed' | 'cancelled';

export interface PaymentCreateRequest {
  projectId: string;
  amount: number;
  currency: string;
  txHash: string;
  status?: string; // Usually "pending" on creation
}

export interface PaymentResponse {
  id: string;
  projectId: string;
  amount: number;
  currency: string;
  txHash: string;
  status: PaymentStatus;
  createdAt: string;
}

export interface PaymentHistoryResponse {
  id: string;
  amount: number;
  currency: string;
  txHash: string;
  status: PaymentStatus;
  createdAt: string;
  etherscanUrl: string;
  userId: string | null;
  blockNumber?: number;
  confirmationCount: number;
  updatedAt?: string;
}

export interface CreatePaymentResponse {
  id: string;
  projectId: string;
  amount: number;
  currency: string;
  txHash: string;
  status: PaymentStatus;
  createdAt: string;
}

export interface PublicDonationDto {
  projectTitle: string;
  amount: number;
  currency: string;
  txHash: string;
  status: PaymentStatus;
  createdAt: string;
  etherscanUrl: string;
}

export interface PublicDonationsSummary {
  totalDonations: number;
  totalEthRaised: number;
  confirmedDonations: number;
  recentDonations: PublicDonationDto[];
}

