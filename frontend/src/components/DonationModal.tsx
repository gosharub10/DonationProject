import { useState } from "react";
import { sendTransaction } from "../services/donationService";
import { createPayment } from "../services/paymentService";
import type { TransactionResult } from "../services/donationService";
import { Heart, X, ExternalLink, CheckCircle2, Lock, Activity, Wallet, Info } from "lucide-react";

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
    if (hearts < 1000) setHearts((prev) => prev + 1);
    setError(null);
  };

  // Handle heart decrement
  const handleDecreaseHearts = () => {
    if (hearts > 1) setHearts((prev) => prev - 1);
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

      // 2. Save payment to backend
      try {
        await createPayment({
          projectId,
          amount: ethAmount,
          currency: "ETH",
          txHash: result.txHash,
          status: "Pending",
        });
      } catch (backendError: any) {
        console.warn("⚠️ Payment save to backend failed:", backendError.message);
      }

      setSuccessTx(result);

      if (onSuccess) {
        onSuccess();
      }

    } catch (err: any) {
      setError(err.message || "Ошибка при отправке. Проверьте MetaMask.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      onClose();
      setTimeout(() => {
          setHearts(1);
          setError(null);
          setSuccessTx(null);
      }, 300);
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-slate-900/40 backdrop-blur-md z-40 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={handleClose}
      />

      {/* Modal */}
      <div
        className={`fixed inset-0 flex items-center justify-center z-50 p-4 transition-all duration-300 ${
          isOpen ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"
        }`}
      >
        <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden border border-brand-beige relative">
          
          {/* Header */}
          <div className="bg-slate-50 border-b border-brand-beige/50 p-5 flex items-center justify-between relative overflow-hidden">
            <h2 className="text-xl font-black text-slate-800 tracking-tight flex items-center gap-2 relative z-10">
                <Wallet className="text-brand-primary" size={24} /> 
                Поддержать Проект
            </h2>
            <button
              onClick={handleClose}
              disabled={isLoading}
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200/50 rounded-xl transition-all disabled:opacity-50 relative z-10"
            >
              <X size={20} />
            </button>
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-brand-primary/5 rounded-full blur-2xl"></div>
          </div>

          {/* Success State */}
          {successTx && (
            <div className="p-8 pb-10 flex flex-col items-center">
                <div className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center mb-6 animate-bounce shadow-lg shadow-green-100">
                    <CheckCircle2 size={40} />
                </div>
                
                <h3 className="text-2xl font-black text-slate-800 mb-2">Успешно!</h3>
                <p className="text-slate-500 text-center mb-6 max-w-xs leading-relaxed">
                    Транзакция отправлена в блокчейн. Спасибо за вашу поддержку.
                </p>
                
                <div className="w-full bg-slate-50 p-4 rounded-2xl mb-8 flex justify-between items-center border border-slate-100">
                    <span className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Hash</span>
                    <span className="font-mono text-slate-700 text-sm font-semibold">
                      {successTx.txHash.slice(0, 8)}...{successTx.txHash.slice(-6)}
                    </span>
                </div>

                <div className="w-full space-y-3">
                    <a
                        href={`https://sepolia.etherscan.io/tx/${successTx.txHash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 w-full px-4 py-4 rounded-xl bg-brand-primary hover:bg-brand-secondary text-white font-bold transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5"
                    >
                        Посмотреть в Etherscan <ExternalLink size={18} />
                    </a>
                    <button onClick={handleClose} className="w-full py-4 text-slate-500 hover:text-slate-800 font-medium transition-colors">
                        Вернуться к проекту
                    </button>
                </div>
            </div>
          )}

          {/* Form Content */}
          {!successTx && (
            <div className="p-6">
              
              <div className="mb-6 pb-6 border-b border-slate-100 space-y-5">
                  <div className="flex gap-4 items-start bg-slate-50 p-4 rounded-2xl border border-slate-100">
                      <div className="p-2.5 bg-white rounded-xl shadow-sm border border-slate-100 shrink-0">
                          <Info size={20} className="text-brand-secondary" />
                      </div>
                      <div>
                          <p className="text-slate-800 font-bold text-sm mb-1 line-clamp-2 leading-tight">
                              {projectTitle}
                          </p>
                          <div className="flex items-center gap-1.5 text-slate-500 text-xs font-medium">
                              <span>Получатель:</span>
                              <span className="font-mono bg-slate-200/50 px-1.5 py-0.5 rounded text-slate-600">{shortAddress}</span>
                          </div>
                      </div>
                  </div>
              </div>

              {/* Enter Amount */}
              <div className="mb-8">
                <div className="flex justify-between items-end mb-4">
                    <label className="text-slate-700 font-bold">Сумма (Hearts)</label>
                    <div className="text-brand-primary font-black text-xl flex items-center gap-1.5">
                        {ethAmount.toFixed(4)} <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">ETH</span>
                    </div>
                </div>

                <div className="flex items-center gap-4 bg-slate-50 p-2 rounded-2xl border border-slate-200 shadow-inner">
                  <button
                    onClick={handleDecreaseHearts}
                    className="w-12 h-12 flex items-center justify-center text-slate-600 font-bold text-xl hover:bg-white hover:shadow-sm rounded-xl transition-all disabled:opacity-30"
                    disabled={hearts <= 1 || isLoading}
                  >
                    −
                  </button>

                  <div className="flex-1 flex flex-col items-center justify-center relative">
                    <div className="flex items-center justify-center gap-2 mb-1">
                        <Heart size={20} className={hearts > 0 ? "fill-brand-accent text-brand-accent" : "text-slate-300"} />
                        <input
                            type="number"
                            value={hearts}
                            readOnly
                            className="bg-transparent text-center text-2xl font-black text-slate-800 w-20 focus:outline-none pointer-events-none"
                        />
                    </div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">Hearts</span>
                  </div>

                  <button
                    onClick={handleIncreaseHearts}
                    className="w-12 h-12 flex items-center justify-center text-slate-600 font-bold text-xl hover:bg-white hover:shadow-sm rounded-xl transition-all disabled:opacity-30"
                    disabled={hearts >= 1000 || isLoading}
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-2xl border border-red-100 text-sm font-medium flex items-start gap-3">
                  <span className="text-red-500">⚠</span>
                  <span className="leading-snug">{error}</span>
                </div>
              )}

              {/* Action Button */}
              <button
                onClick={handleSendDonation}
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 py-4 px-6 rounded-2xl text-white font-bold text-lg transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 relative overflow-hidden group disabled:opacity-80 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none"
                style={{ backgroundColor: "var(--color-brand-primary)" }}
              >
                  {isLoading ? (
                    <>
                        <Activity className="animate-spin text-white/80" />
                        <span>Подтвердите в MetaMask...</span>
                    </>
                  ) : (
                    <>
                        <Lock size={18} className="text-white/70" />
                        <span>Отправить {ethAmount.toFixed(4)} ETH</span>
                    </>
                  )}
                  {/* Hover effect gradient */}
                  <div className="absolute inset-0 h-full w-full bg-linear-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out"></div>
              </button>

            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default DonationModal;
