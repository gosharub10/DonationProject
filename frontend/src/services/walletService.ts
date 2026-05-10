import api from "../api/axios.ts";
import type { Wallet } from "../models/Wallet.ts";

export const connectWallet = async (walletAddress: string): Promise<Wallet> => {
    const response = await api.post("/wallet/connect", {
        walletAddress,
    });
    return response.data;
};

export const getMyWallet = async (): Promise<Wallet> => {
    const response = await api.get("/wallet/my");
    return response.data;
};
