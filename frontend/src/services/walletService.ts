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

/**
 * Get currently connected account from MetaMask
 */
export const getConnectedAccount = async (): Promise<string> => {
    try {
        if (!window.ethereum) {
            throw new Error("MetaMask is not installed");
        }

        const accounts = await window.ethereum.request({
            method: "eth_accounts",
        });

        if (!accounts || accounts.length === 0) {
            throw new Error("No wallet connected");
        }

        return accounts[0];
    } catch (error: any) {
        console.error("Error getting connected account:", error);
        throw new Error(`Failed to get connected account: ${error.message}`);
    }
};

/**
 * Get current chain ID from MetaMask
 */
export const getCurrentChainId = async (): Promise<string> => {
    try {
        if (!window.ethereum) {
            throw new Error("MetaMask is not installed");
        }

        return await window.ethereum.request({
            method: "eth_chainId",
        });
    } catch (error: any) {
        console.error("Error getting chain ID:", error);
        throw new Error(`Failed to get chain ID: ${error.message}`);
    }
};

// Type declaration for window.ethereum
declare global {
    interface Window {
        ethereum?: any;
    }
}
