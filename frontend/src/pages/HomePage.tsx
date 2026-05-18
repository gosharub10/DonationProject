import PublicDonationsDashboard from '../components/PublicDonationsDashboard';
import { ArrowRight, Shield, Globe, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

const HomePage = () => {
    return (
        <div className="w-full space-y-20 pb-10">

            {/* HERO SECTION */}
            <section className="relative pt-12 md:pt-20 pb-8 flex flex-col items-center text-center">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-brand-beige/50 text-brand-primary text-sm font-semibold mb-8 shadow-sm">
                    <span className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-accent opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-brand-accent"></span>
                    </span>
                    Web3
                </div>

                <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 tracking-tight leading-tight max-w-4xl mb-6">
                    Финансируй будущее <br />
                    <span className="text-transparent bg-clip-text bg-linear-to-r from-brand-primary to-brand-accent">
                        прозрачно
                    </span>
                </h1>

                <p className="text-slate-600 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
                    Мы объединяем создателей и инвесторов. Поддерживайте социально значимые проекты криптовалютой с полной прозрачностью и отслеживанием каждой транзакции.
                </p>

                <div className="flex flex-col sm:flex-row justify-center gap-4 w-full sm:w-auto">
                    <Link
                        to="/register"
                        className="flex items-center justify-center gap-2 bg-brand-primary hover:bg-brand-secondary transition-all duration-300 px-8 py-4 rounded-full text-white font-medium text-lg shadow-lg hover:shadow-xl hover:-translate-y-1"
                    >
                        Начать проект <ArrowRight size={20} />
                    </Link>

                    <Link
                        to="/projects"
                        className="flex items-center justify-center gap-2 bg-white hover:bg-slate-50 transition-all duration-300 px-8 py-4 rounded-full text-brand-primary font-medium text-lg border border-brand-beige shadow-sm hover:shadow-md hover:-translate-y-1"
                    >
                        Поддержать идеи
                    </Link>
                </div>
            </section>

            {/* FEATURES SECTION */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="premium-card p-8 group">
                    <div className="w-14 h-14 bg-brand-primary/10 rounded-2xl flex items-center justify-center text-brand-primary mb-6 group-hover:scale-110 transition-transform">
                        <Globe size={28} />
                    </div>
                    <h3 className="text-slate-900 font-bold text-xl mb-3">
                        Глобальный доступ
                    </h3>
                    <p className="text-slate-600 leading-relaxed">
                        Принимайте поддержку от людей со всего мира. Инвестируйте в проекты без границ.
                    </p>
                </div>

                <div className="premium-card p-8 group">
                    <div className="w-14 h-14 bg-brand-secondary/10 rounded-2xl flex items-center justify-center text-brand-secondary mb-6 group-hover:scale-110 transition-transform">
                        <Shield size={28} />
                    </div>
                    <h3 className="text-slate-900 font-bold text-xl mb-3">
                        Прозрачность Web3
                    </h3>
                    <p className="text-slate-600 leading-relaxed">
                        Каждая транзакция записывается в блокчейн. Полная история сборов и защита от мошенничества.
                    </p>
                </div>

                <div className="premium-card p-8 group">
                    <div className="w-14 h-14 bg-brand-accent/10 rounded-2xl flex items-center justify-center text-brand-accent mb-6 group-hover:scale-110 transition-transform">
                        <Users size={28} />
                    </div>
                    <h3 className="text-slate-900 font-bold text-xl mb-3">
                        Сильное сообщество
                    </h3>
                    <p className="text-slate-600 leading-relaxed">
                        Объединяем созидателей и меценатов. Каждая идея находит свою аудиторию.
                    </p>
                </div>
            </section>

            {/* PUBLIC DONATIONS DASHBOARD */}
            <section className="space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-3xl font-bold text-slate-900">
                        Live Транзакции
                    </h2>
                </div>
                <PublicDonationsDashboard />
            </section>

        </div>
    );
};

export default HomePage;