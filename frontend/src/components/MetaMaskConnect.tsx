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
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
                <p className="text-slate-400">Loading wallet...</p>
            </div>
        );
    }

    return (
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">

            <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-white">
                    MetaMask Wallet
                </h2>
                <span className={`text-xs px-3 py-1 rounded-full font-semibold ${
                    wallet ? "bg-green-900/30 text-green-400" : "bg-slate-800 text-slate-400"
                }`}>
                    {wallet ? "Connected" : "Not Connected"}
                </span>
            </div>

            {error && (
                <div className="p-3 bg-red-900/20 border border-red-600 text-red-400 text-sm rounded-lg">
                    {error}
                </div>
            )}

            {wallet ? (
                <div className="space-y-3">
                    <div>
                        <p className="text-slate-400 text-xs uppercase tracking-wide mb-2">
                            Wallet Address
                        </p>
                        <p className="text-slate-200 text-sm bg-slate-800 p-3 rounded-lg break-all font-mono">
                            {wallet.walletAddress}
                        </p>
                    </div>

                    <div>
                        <p className="text-slate-400 text-xs uppercase tracking-wide mb-2">
                            Connected Since
                        </p>
                        <p className="text-slate-300 text-sm">
                            {new Date(wallet.createdAt).toLocaleDateString()}
                        </p>
                    </div>
                </div>
            ) : (
                <p className="text-slate-400 text-sm">
                    Connect your MetaMask wallet to your account
                </p>
            )}

            <button
                onClick={connectWallet}
                disabled={connecting || !!wallet}
                className={`
                    w-full py-2 px-4 rounded-xl font-medium transition-all duration-200 text-white
                    ${wallet
                        ? "bg-slate-700 cursor-not-allowed opacity-50"
                        : connecting
                        ? "bg-purple-700 cursor-wait"
                        : "bg-purple-600 hover:bg-purple-700 active:scale-95"
                    }
                `}
            >
                {connecting ? "Connecting..." : wallet ? "✓ Connected" : "Connect MetaMask"}
            </button>

        </div>
    );
};

// Type declaration for window.ethereum
declare global {
    interface Window {
        ethereum?: any;
    }
}

export default MetaMaskConnect;