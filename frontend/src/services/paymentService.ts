import api from "../api/axios.ts";
import type { PaymentCreateRequest, PaymentResponse, PaymentHistoryResponse } from "../models/Payment.ts";

/**
 * Create a new payment/donation
 * Sends transaction information to backend after successful MetaMask tx
 */
export const createPayment = async (request: PaymentCreateRequest): Promise<PaymentResponse> => {
    try {
        const response = await api.post("/payments", {
            projectId: request.projectId,
            amount: request.amount,
            currency: request.currency,
            txHash: request.txHash,
            status: request.status,
        });
        return response.data;
    } catch (error: any) {
        const errorMessage =
            error?.response?.data?.error ||
            error?.response?.data?.message ||
            error.message ||
            "Failed to create payment";
        throw new Error(errorMessage);
    }
};

/**
 * Get payment by transaction hash (for verification)
 */
export const getPaymentByTxHash = async (txHash: string): Promise<PaymentResponse | null> => {
    try {
        const response = await api.get(`/payments/tx/${txHash}`);
        return response.data;
    } catch (error: any) {
        if (error?.response?.status === 404) {
            return null;
        }
        throw error;
    }
};

/**
 * Get all payments for a specific project
 * Returns payments sorted by createdAt descending (newest first)
 */
export const getProjectPayments = async (projectId: string): Promise<PaymentHistoryResponse[]> => {
    try {
        const response = await api.get(`/payments/project/${projectId}`);
        return response.data || [];
    } catch (error: any) {
        const errorMessage =
            error?.response?.data?.error ||
            error?.response?.data?.message ||
            error.message ||
            "Failed to fetch project payments";
        throw new Error(errorMessage);
    }
};

