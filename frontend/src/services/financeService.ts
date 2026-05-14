import api from "../api/axios.ts";
import type { ProjectData } from "../models/ProjectData.ts";
import type { PaymentHistoryResponse, PublicDonationsSummary } from "../models/Payment.ts";

export interface FinanceDashboardResponse {
    totalDonations: number;
    totalConfirmedEth: number;
    totalTransactions: number;
    activeProjects: number;
    completedProjects: number;
    failedTransactions: number;
    pendingTransactions: number;
}

export interface FinanceProjectSettingsResponse {
    project: ProjectData;
    transactions: PaymentHistoryResponse[];
}

export interface FinanceTransactionsFilters {
    projectId?: string;
    from?: string;
    to?: string;
}

export const financeService = {
    getDashboard: async (from?: string, to?: string): Promise<FinanceDashboardResponse> => {
        const { data } = await api.get("/finance/dashboard", {
            params: { from, to },
        });

        return data;
    },

    getProjectFinancialInfo: async (projectId: string): Promise<FinanceProjectSettingsResponse> => {
        const [projectResponse, transactionsResponse] = await Promise.all([
            api.get(`/finance/projects/${projectId}/settings`),
            api.get("/finance/transactions", { params: { projectId } }),
        ]);

        return {
            project: projectResponse.data,
            transactions: transactionsResponse.data || [],
        };
    },

    setWallet: async (projectId: string, walletAddress: string): Promise<ProjectData> => {
        const { data } = await api.put(`/finance/projects/${projectId}/wallet`, {
            projectId,
            walletAddress,
        });

        return data;
    },

    setTargetAmount: async (projectId: string, targetAmount: number): Promise<ProjectData> => {
        const { data } = await api.put(`/finance/projects/${projectId}/target`, {
            projectId,
            targetAmount,
        });

        return data;
    },

    activateProject: async (projectId: string): Promise<ProjectData> => {
        const { data } = await api.put(`/finance/projects/${projectId}/activate`, {
            projectId,
        });

        return data;
    },

    getTransactions: async (filters: FinanceTransactionsFilters = {}): Promise<PaymentHistoryResponse[]> => {
        const { data } = await api.get("/finance/transactions", {
            params: filters,
        });

        return data || [];
    },

    getPublicDonations: async (): Promise<PublicDonationsSummary> => {
        const { data } = await api.get("/payments/public");
        return data;
    },

    exportProjectPdfReport: async (projectId: string): Promise<Blob> => {
        const { data } = await api.get(`/finance/projects/${projectId}/report/pdf`, {
            responseType: "blob",
        });

        return data;
    },
};
