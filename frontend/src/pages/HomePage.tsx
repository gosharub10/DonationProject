import PublicDonationsDashboard from '../components/PublicDonationsDashboard';

const HomePage = () => {
    return (
        <div className="container page mx-auto">
            <div className="card space-y-10">

                {/* HERO */}
                <div className="text-center space-y-4">
                    <h1 className="text-4xl font-bold text-white">
                        Сохрани — платформа для поддержки проектов
                    </h1>

                    <p className="text-slate-400 text-lg max-w-2xl mx-auto">
                        Мы помогаем людям находить финансирование для своих идей
                        и реализовывать социально значимые проекты.
                        Присоединяйтесь к сообществу, где каждая идея может стать реальностью.
                    </p>
                </div>

                {/* FEATURES */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-slate-800 p-6 rounded-xl">
                        <h3 className="text-white font-semibold text-lg mb-2">
                            Поддержка проектов
                        </h3>
                        <p className="text-slate-400 text-sm">
                            Создавайте и поддерживайте проекты, которые важны для общества.
                        </p>
                    </div>

                    <div className="bg-slate-800 p-6 rounded-xl">
                        <h3 className="text-white font-semibold text-lg mb-2">
                            Прозрачность
                        </h3>
                        <p className="text-slate-400 text-sm">
                            Полная прозрачность сборов и целей каждого проекта.
                        </p>
                    </div>

                    <div className="bg-slate-800 p-6 rounded-xl">
                        <h3 className="text-white font-semibold text-lg mb-2">
                            Сообщество
                        </h3>
                        <p className="text-slate-400 text-sm">
                            Объединяем людей, которые хотят менять мир к лучшему.
                        </p>
                    </div>
                </div>

                {/* PUBLIC DONATIONS DASHBOARD */}
                <PublicDonationsDashboard />

                {/* CTA */}
                <div className="text-center space-y-4">
                    <h2 className="text-2xl font-semibold text-white">
                        Готов начать?
                    </h2>

                    <p className="text-slate-400">
                        Зарегистрируйся и стань частью платформы уже сегодня.
                    </p>

                    <div className="flex justify-center gap-4">
                        <a
                            href="/register"
                            className="bg-blue-600 hover:bg-blue-700 transition px-6 py-3 rounded-xl text-white font-medium"
                        >
                            Начать
                        </a>

                        <a
                            href="/projects"
                            className="bg-slate-800 hover:bg-slate-700 transition px-6 py-3 rounded-xl text-white font-medium"
                        >
                            Смотреть проекты
                        </a>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default HomePage;