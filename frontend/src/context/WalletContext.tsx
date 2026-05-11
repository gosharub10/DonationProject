import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import { useAuth } from "./AuthContext";
import { connectWallet, getMyWallet } from "../services/walletService";
import type { Wallet } from "../models/Wallet";

interface WalletContextType {
  wallet: Wallet | null;
  connecting: boolean;
  loading: boolean;
  error: string | null;
  connectWallet: () => Promise<void>;
}

const WalletContext = createContext<WalletContextType | null>(null);

export const WalletProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [connecting, setConnecting] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch wallet on mount if user is authenticated
  useEffect(() => {
    if (user) {
      fetchWallet();
    }
  }, [user]);

  const fetchWallet = async () => {
    try {
      setLoading(true);
      const data = await getMyWallet();
      setWallet(data);
      setError(null);
    } catch (err: any) {
      // No wallet yet, that's ok
      setWallet(null);
    } finally {
      setLoading(false);
    }
  };

  const handleConnectWallet = async () => {
    try {
      // Check if MetaMask is installed
      if (!window.ethereum) {
        setError("MetaMask is not installed. Please install MetaMask extension.");
        return;
      }

      setConnecting(true);
      setError(null);

      // Request account access
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      }) as string[];

      if (!accounts || accounts.length === 0) {
        setError("No accounts found in MetaMask");
        return;
      }

      const walletAddress = accounts[0];

      // Save wallet to backend
      const data = await connectWallet(walletAddress);
      setWallet(data);
      setError(null);
    } catch (err: any) {
      setError(
        err?.response?.data?.message || err.message || "Failed to connect wallet"
      );
    } finally {
      setConnecting(false);
    }
  };

  return (
    <WalletContext.Provider
      value={{
        wallet,
        connecting,
        loading,
        error,
        connectWallet: handleConnectWallet,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  const context = useContext(WalletContext);

  if (!context) {
    throw new Error("useWallet must be used inside WalletProvider");
  }

  return context;
};

// Type declaration for window.ethereum
declare global {
  interface Window {
    ethereum?: any;
  }
}
