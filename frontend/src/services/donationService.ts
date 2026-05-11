/**
 * DonationService - Handles MetaMask transactions for crypto donations
 * Manages network validation, switching, and transaction sending
 */

const SEPOLIA_CHAIN_ID = "11155111"; // Sepolia testnet
const SEPOLIA_CHAIN_ID_HEX = "0xaa36a7";

interface SendTransactionParams {
  recipientAddress: string;
  ethAmount: number;
  hearts: number;
  projectId: string;
}

interface TransactionResult {
  txHash: string;
  from: string;
  to: string;
  hearts: number;
  ethAmount: number;
  projectId: string;
  createdAt: string;
}

/**
 * Validate that the current network is Sepolia
 */
export const validateNetwork = async (): Promise<boolean> => {
  try {
    if (!window.ethereum) {
      throw new Error(
        "MetaMask is not installed. Please install MetaMask extension."
      );
    }

    const chainId = await window.ethereum.request({
      method: "eth_chainId",
    });

    return chainId === SEPOLIA_CHAIN_ID_HEX;
  } catch (error) {
    console.error("Error validating network:", error);
    throw error;
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
  } catch (error) {
    console.error("Error getting chain ID:", error);
    throw error;
  }
};

/**
 * Switch to Sepolia network or add it if not present
 */
export const switchToSepolia = async (): Promise<void> => {
  try {
    if (!window.ethereum) {
      throw new Error("MetaMask is not installed");
    }

    // Try to switch to existing Sepolia network
    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: SEPOLIA_CHAIN_ID_HEX }],
      });
      return;
    } catch (switchError: any) {
      // If Sepolia not added, add it
      if (switchError.code === 4902) {
        await addSepoliaNetwork();
        // Try switching again after adding
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: SEPOLIA_CHAIN_ID_HEX }],
        });
      } else {
        throw switchError;
      }
    }
  } catch (error: any) {
    console.error("Error switching to Sepolia:", error);
    throw new Error(`Failed to switch network: ${error.message}`);
  }
};

/**
 * Add Sepolia network to MetaMask
 */
const addSepoliaNetwork = async (): Promise<void> => {
  try {
    if (!window.ethereum) {
      throw new Error("MetaMask is not installed");
    }

    await window.ethereum.request({
      method: "wallet_addEthereumChain",
      params: [
        {
          chainId: SEPOLIA_CHAIN_ID_HEX,
          chainName: "Sepolia",
          nativeCurrency: {
            name: "Ethereum",
            symbol: "ETH",
            decimals: 18,
          },
          rpcUrls: [
            "https://sepolia.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161",
            "https://1rpc.io/sepolia",
          ],
          blockExplorerUrls: ["https://sepolia.etherscan.io"],
        },
      ],
    });
  } catch (error: any) {
    console.error("Error adding Sepolia network:", error);
    throw new Error(`Failed to add Sepolia network: ${error.message}`);
  }
};

/**
 * Validate Ethereum address format
 */
const isValidAddress = (address: string): boolean => {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
};

/**
 * Convert ETH to Wei
 */
const ethToWei = (eth: number): string => {
  const wei = BigInt(Math.round(eth * 10 ** 18));
  return "0x" + wei.toString(16);
};

/**
 * Get the connected account from MetaMask
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
 * Send a donation transaction via MetaMask
 * Returns transaction hash and logs complete transaction details
 */
export const sendTransaction = async (
  params: SendTransactionParams
): Promise<TransactionResult> => {
  try {
    const { recipientAddress, ethAmount, hearts, projectId } = params;

    // Validate inputs
    if (!window.ethereum) {
      throw new Error(
        "MetaMask is not installed. Please install MetaMask extension."
      );
    }

    if (!isValidAddress(recipientAddress)) {
      throw new Error("Invalid recipient wallet address");
    }

    // Check if wallet is connected
    const fromAddress = await getConnectedAccount();

    // Validate network
    const isCorrectNetwork = await validateNetwork();
    if (!isCorrectNetwork) {
      try {
        await switchToSepolia();
      } catch (switchError) {
        throw new Error(
          "Failed to switch to Sepolia network. Please switch manually in MetaMask."
        );
      }
    }

    // Convert ETH to Wei
    const valueInWei = ethToWei(ethAmount);

    // Create transaction object
    const txObject = {
      from: fromAddress,
      to: recipientAddress,
      value: valueInWei,
      gas: "0x5208", // 21000 - standard gas for ETH transfer
      gasPrice: undefined, // Let MetaMask estimate
    };

    // Send transaction
    const txHash = await window.ethereum.request({
      method: "eth_sendTransaction",
      params: [txObject],
    });

    if (!txHash) {
      throw new Error("No transaction hash returned");
    }

    // Build transaction result
    const result: TransactionResult = {
      txHash,
      from: fromAddress,
      to: recipientAddress,
      hearts,
      ethAmount,
      projectId,
      createdAt: new Date().toISOString(),
    };

    // Log transaction to console
    console.log("🎁 Donation Transaction Sent:", result);

    return result;
  } catch (error: any) {
    // Handle specific error scenarios
    let errorMessage = error.message || "Transaction failed";

    if (error.code === 4001) {
      errorMessage = "You rejected the transaction in MetaMask";
    } else if (error.code === -32602) {
      errorMessage = "Invalid transaction parameters";
    } else if (error.message?.includes("insufficient")) {
      errorMessage = "Insufficient balance for transaction";
    }

    console.error("❌ Transaction Error:", errorMessage, error);
    throw new Error(errorMessage);
  }
};

// Type exports
export type { SendTransactionParams, TransactionResult };

// Type declaration for window.ethereum
declare global {
  interface Window {
    ethereum?: any;
  }
}
