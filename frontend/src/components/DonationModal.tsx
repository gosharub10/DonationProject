import { useState } from "react";
import { sendTransaction } from "../services/donationService";
import { createPayment } from "../services/paymentService";
import type { TransactionResult } from "../services/donationService";

interface DonationModalProps {
  isOpen: boolean;
  projectId: string;
  projectTitle: string;
  recipientAddress: string;
  onClose: () => void;
  onSuccess?: () => void;
}

const DonationModal = ({
  isOpen,
  projectId,
  projectTitle,
  recipientAddress,
  onClose,
  onSuccess,
}: DonationModalProps) => {
  const [hearts, setHearts] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successTx, setSuccessTx] = useState<TransactionResult | null>(null);

  if (!isOpen) return null;

  // Calculate ETH amount
  const ethAmount = hearts * 0.0001;

  // Shorten address for display
  const shortAddress =
    recipientAddress.slice(0, 6) + "..." + recipientAddress.slice(-4);

  // Handle heart increment
  const handleIncreaseHearts = () => {
    setHearts((prev) => Math.min(prev + 1, 1000));
    setError(null);
  };

  // Handle heart decrement
  const handleDecreaseHearts = () => {
    setHearts((prev) => Math.max(prev - 1, 1));
    setError(null);
  };

  // Handle send donation
  const handleSendDonation = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // 1. Send MetaMask transaction
      const result = await sendTransaction({
        recipientAddress,
        ethAmount,
        hearts,
        projectId,
      });

      // 2. Log to console for debugging (as required)
      console.log("🎁 Donation Transaction Sent:", {
        txHash: result.txHash,
        from: result.from,
        to: result.to,
        hearts: result.hearts,
        ethAmount: result.ethAmount,
        projectId: result.projectId,
        createdAt: result.createdAt,
      });

      // 3. Save payment to backend
      try {
        await createPayment({
          projectId,
          amount: ethAmount,
          currency: "ETH",
          txHash: result.txHash,
          status: "Pending",
        });
        console.log("✓ Payment saved to backend");
      } catch (backendError: any) {
        // Backend save failed, but tx was successful
        // Show warning but keep the success state
        console.warn("⚠️ Payment save to backend failed:", backendError.message);
        console.log("ℹ️ Transaction was successful on blockchain, but backend save failed");
        // Continue with success state anyway
      }

      setSuccessTx(result);

      // Call onSuccess callback if provided
      if (onSuccess) {
        onSuccess();
      }

      // Auto-close after 2 seconds on success
      setTimeout(() => {
        onClose();
        setHearts(1);
        setSuccessTx(null);
      }, 2000);
    } catch (err: any) {
      setError(err.message || "Failed to send donation");
      console.error("❌ Donation Error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle modal close
  const handleClose = () => {
    if (!isLoading) {
      onClose();
      setHearts(1);
      setError(null);
      setSuccessTx(null);
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-200"
        onClick={handleClose}
      />

      {/* Modal */}
      <div
        className={`fixed inset-0 flex items-center justify-center z-50 p-4 transition-all duration-300 ${
          isOpen ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"
        }`}
      >
        <div className="bg-slate-900/95 border border-white/10 backdrop-blur-xl rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-linear-to-r from-blue-600/20 to-purple-600/20 border-b border-white/10 p-6 flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">Send Donation</h2>
            <button
              onClick={handleClose}
              disabled={isLoading}
              className="text-slate-400 hover:text-white transition-colors disabled:opacity-50"
            >
              ✕
            </button>
          </div>

          {/* Success State */}
          {successTx && (
            <div className="p-6 space-y-4">
              <div className="text-center space-y-4">
                <div className="text-4xl animate-bounce">✓</div>
                <div>
                  <h3 className="text-lg font-semibold text-green-400">
                    Donation Sent!
                  </h3>
                  <p className="text-sm text-slate-300 mt-2">
                    Transaction hash:{" "}
                    <span className="font-mono text-xs text-slate-400 break-all">
                      {successTx.txHash.slice(0, 10)}...{successTx.txHash.slice(-4)}
                    </span>
                  </p>
                </div>

                {/* Etherscan Button */}
                <a
                  href={`https://sepolia.etherscan.io/tx/${successTx.txHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-lg bg-green-600/20 hover:bg-green-600/40 border border-green-500/30 hover:border-green-500/50 text-green-400 text-sm font-medium transition-all duration-200 hover:shadow-lg hover:shadow-green-500/20"
                >
                  <span>View on Etherscan</span>
                  <span className="text-xs">↗</span>
                </a>
              </div>
            </div>
          )}

          {/* Main Content */}
          {!successTx && (
            <div className="p-6 space-y-6">
              {/* Project Title */}
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-400 mb-2">
                  Project
                </p>
                <p className="text-white font-semibold line-clamp-2">
                  {projectTitle}
                </p>
              </div>

              {/* Recipient Address */}
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-400 mb-2">
                  Recipient Wallet
                </p>
                <div className="flex items-center justify-between bg-slate-800/50 p-3 rounded-lg">
                  <span className="text-slate-200 font-mono text-sm">
                    {shortAddress}
                  </span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(recipientAddress);
                    }}
                    className="text-slate-400 hover:text-slate-200 transition-colors text-xs"
                  >
                    Copy
                  </button>
                </div>
              </div>

              {/* Heart Selector */}
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-400 mb-3">
                  Donation Amount
                </p>
                <div className="flex items-center justify-center gap-4">
                  <button
                    onClick={handleDecreaseHearts}
                    disabled={isLoading || hearts <= 1}
                    className="w-10 h-10 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
                  >
                    −
                  </button>

                  <div className="text-center">
                    <div className="flex items-center justify-center gap-2">
                      <span className="text-3xl">❤️</span>
                      <span className="text-4xl font-bold text-red-400">
                        {hearts}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">
                      {hearts} heart{hearts !== 1 ? "s" : ""}
                    </p>
                  </div>

                  <button
                    onClick={handleIncreaseHearts}
                    disabled={isLoading || hearts >= 1000}
                    className="w-10 h-10 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* ETH Preview */}
              <div className="bg-linear-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-xl p-4 text-center">
                <p className="text-xs uppercase tracking-wide text-slate-400 mb-2">
                  ETH Amount
                </p>
                <p className="text-2xl font-bold text-white">
                  {ethAmount.toFixed(4)} ETH
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  1 ❤️ = 0.0001 ETH
                </p>
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-900/20 border border-red-600 text-red-400 text-sm p-3 rounded-lg">
                  {error}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  onClick={handleClose}
                  disabled={isLoading}
                  className="flex-1 py-2 px-4 rounded-xl font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSendDonation}
                  disabled={isLoading || !recipientAddress}
                  className={`flex-1 py-2 px-4 rounded-xl font-medium text-white transition-all active:scale-95 ${
                    isLoading || !recipientAddress
                      ? "bg-slate-700 cursor-not-allowed opacity-50"
                      : "bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40"
                  }`}
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="inline-block h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Sending...
                    </span>
                  ) : (
                    `Send ${ethAmount.toFixed(4)} ETH`
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default DonationModal;
