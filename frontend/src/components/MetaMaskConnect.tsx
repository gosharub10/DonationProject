import { Wallet, CheckCircle2, AlertCircle } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useWallet } from "../context/WalletContext";

const MetaMaskConnect = () => {
    const { user } = useAuth();
    const { wallet, loading, error, connecting, connectWallet } = useWallet();

    if (!user) {
        return null;
    }

    if (loading) {
        return (
            <div className="bg-slate-50 border border-slate-100 p-6 rounded-2xl animate-pulse">
                <p className="text-slate-500 font-medium">Загрузка кошелька...</p>
            </div>
        );
    }

    return (
        <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                    <Wallet size={20} className="text-brand-primary" />
                    MetaMask Кошелек
                </h2>
                <span className={`text-xs px-3 py-1 rounded-full font-bold uppercase tracking-wide flex items-center gap-1 self-start sm:self-auto w-fit ${
                    wallet ? "bg-green-50 text-green-600 border border-green-200" : "bg-slate-100 text-slate-500 border border-slate-200"
                }`}>
                    {wallet ? <><CheckCircle2 size={12}/> Подключен</> : "Не подключен"}
                </span>
            </div>

            {error && (
                <div className="p-4 bg-red-50 border border-red-100 text-red-600 text-sm font-medium rounded-xl flex items-start gap-2">
                    <AlertCircle size={18} className="shrink-0 mt-0.5" />
                    <span>{error}</span>
                </div>
            )}

            {wallet ? (
                <div className="space-y-4 bg-slate-50 p-4 rounded-xl border border-slate-100 wrap-break-word">
                    <div>
                        <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">
                            Адрес кошелька
                        </p>
                        <p className="text-slate-700 text-xs sm:text-sm bg-white p-3 rounded-lg border border-slate-200 break-all font-mono shadow-sm">
                            {wallet.walletAddress}
                        </p>
                    </div>

                    <div>
                        <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">
                            Подключен с
                        </p>
                        <p className="text-slate-700 text-sm font-medium">
                            {new Date(wallet.createdAt).toLocaleDateString("ru-RU", {
                                day: 'numeric', month: 'long', year: 'numeric'
                            })}
                        </p>
                    </div>
                </div>
            ) : (
                <p className="text-slate-500 text-sm font-medium">
                    Подключите ваш кошелек MetaMask для работы с платформой и совершения пожертвований.
                </p>
            )}

            <button
                onClick={connectWallet}
                disabled={connecting || !!wallet}
                className={`
                    w-full py-3 px-4 rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-2
                    ${wallet
                        ? "bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200"
                        : connecting
                        ? "bg-brand-secondary/50 text-white cursor-wait"
                        : "bg-brand-primary hover:bg-brand-secondary active:scale-95 text-white shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                    }
                `}
            >
                {connecting ? (
                    <><span className="animate-spin w-4 h-4 border-2 border-white/20 border-t-white rounded-full"></span> Подключение...</>
                ) : wallet ? (
                    "Подключен к MetaMask"
                ) : (
                    <><img src="https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg" alt="MetaMask" className="w-5 h-5"/> Подключить MetaMask</>
                )}
            </button>
        </div>
    );
};

declare global {
    interface Window {
        ethereum?: any;
    }
}

export default MetaMaskConnect;
