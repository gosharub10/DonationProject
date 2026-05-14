import PublicDonationsDashboard from "../components/PublicDonationsDashboard";

const PublicDonations = () => {
    return (
        <div className="animate-fade-in px-4 py-8 md:px-6">
            <div className="mb-8 space-y-2">
                <div className="inline-flex items-center rounded-full border border-brand-beige/70 bg-white px-3 py-1 text-xs font-bold uppercase tracking-[0.22em] text-brand-secondary shadow-sm">
                    Public donations
                </div>
                <h1 className="text-3xl font-black tracking-tight text-slate-800 md:text-4xl">
                    Публичные донаты
                </h1>
                <p className="max-w-2xl text-sm font-medium leading-6 text-slate-500 md:text-base">
                    Открытый список пожертвований, транзакций и ссылок на Sepolia Etherscan.
                </p>
            </div>

            <PublicDonationsDashboard />
        </div>
    );
};

export default PublicDonations;
