import { useEffect, useState } from "react";
import { User, Wallet, History, Settings, CheckCircle2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";

import { getUserById, updateUser } from "../services/userService";
import type { UserData } from "../models/UserData";
import MetaMaskConnect from "../components/MetaMaskConnect";

type Donation = {
    id: string;
    projectTitle: string;
    amount: number;
    createdAt: string;
};

const UserProfilePage = () => {
    const { user } = useAuth();

    const [profile, setProfile] = useState<UserData | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [donations] = useState<Donation[]>([]);

    useEffect(() => {
        const load = async () => {
            if (!user) return;
            try {
                const data = await getUserById(user.id);
                setProfile(data);
            } catch (err) {
                console.error("Failed to load user profile", err);
            } finally {
                setLoading(false);
            }
        };

        load();
    }, [user]);

    const handleUpdate = async () => {
        if (!profile) return;
        setSaving(true);
        setSaved(false);

        try {
            await updateUser({
                id: profile.id,
                name: profile.name,
                email: profile.email,
                role: profile.role,
            });
            setSaved(true);
            setTimeout(() => setSaved(false), 3000);
        } catch (err) {
            console.error("Update failed", err);
            alert("Ошибка при сохранении профиля");
        } finally {
            setSaving(false);
        }
    };

    if (loading || !profile) {
        return (
            <div className="container mx-auto px-4 py-8 flex justify-center items-center h-[50vh]">
                <div className="animate-spin w-12 h-12 border-4 border-brand-primary/20 border-t-brand-primary rounded-full"></div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-6xl space-y-8 animate-fade-in">

            <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 rounded-xl bg-brand-primary/10 flex items-center justify-center text-brand-primary">
                    <User size={24} />
                </div>
                <div>
                    <h1 className="text-3xl font-black text-slate-800 tracking-tight">Мой профиль</h1>
                    <p className="text-slate-500 font-medium">Управление аккаунтом и кошельком</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* LEFT: PROFILE */}
                <div className="lg:col-span-2">
                    <div className="premium-card p-8 h-full">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold flex items-center gap-2 text-slate-800">
                                <Settings size={20} className="text-brand-primary" />
                                Настройки аккаунта
                            </h2>
                            <span className="px-3 py-1 bg-brand-secondary/10 text-brand-primary rounded-full text-xs font-bold uppercase tracking-wider">
                                Роль: {profile.role}
                            </span>
                        </div>

                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700 ml-1">Имя</label>
                                    <input
                                        className="w-full p-4 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all font-medium"
                                        value={profile.name}
                                        onChange={(e) =>
                                            setProfile({
                                                ...profile,
                                                name: e.target.value,
                                            })
                                        }
                                        placeholder="Ваше имя"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700 ml-1">Email</label>
                                    <input
                                        className="w-full p-4 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all font-medium"
                                        value={profile.email}
                                        onChange={(e) =>
                                            setProfile({
                                                ...profile,
                                                email: e.target.value,
                                            })
                                        }
                                        placeholder="Ваш email"
                                    />
                                </div>
                            </div>

                            <button
                                onClick={handleUpdate}
                                disabled={saving}
                                className="w-full sm:w-auto px-8 py-4 bg-brand-primary hover:bg-brand-secondary text-white rounded-xl font-bold transition-all transform hover:-translate-y-1 hover:shadow-lg disabled:opacity-70 disabled:transform-none flex items-center justify-center gap-2"
                            >
                                {saving ? (
                                    <span className="animate-spin w-5 h-5 border-2 border-white/20 border-t-white rounded-full"></span>
                                ) : saved ? (
                                    <>
                                        <CheckCircle2 size={20} />
                                        Сохранено
                                    </>
                                ) : (
                                    "Сохранить изменения"
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {/* RIGHT: QUICK ACTIONS */}
                <div className="space-y-6">

                    {/* WALLET */}
                    <div className="premium-card p-6 border-t-4 border-t-brand-accent">
                        <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-slate-800">
                            <Wallet size={20} className="text-brand-accent" />
                            Привязка кошелька
                        </h2>
                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 mb-4">
                            <p className="text-sm text-slate-600 font-medium mb-3">Подключите MetaMask для отправки и получения пожертвований.</p>
                            <MetaMaskConnect />
                        </div>
                    </div>

                    {/* STATS CARD */}
                    <div className="premium-card p-6 border-l-4 border-l-brand-secondary">
                        <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-slate-800">
                            <History size={20} className="text-brand-secondary" />
                            Статистика
                        </h2>
                        
                        <div className="flex items-center justify-between p-4 bg-brand-secondary/5 rounded-xl border border-brand-secondary/10">
                            <span className="text-slate-600 font-medium">Сделано пожертвований</span>
                            <span className="text-2xl font-black text-brand-primary">{donations.length}</span>
                        </div>
                    </div>

                </div>

            </div>

            {/* DONATIONS FULL WIDTH */}
            <div className="premium-card p-8">
                <div className="flex items-center gap-2 mb-6">
                    <h2 className="text-xl font-bold flex items-center gap-2 text-slate-800">
                        <History size={20} className="text-slate-500" />
                        История пожертвований
                    </h2>
                </div>

                {donations.length === 0 ? (
                    <div className="text-center py-10 bg-slate-50 rounded-2xl border border-slate-100 border-dashed">
                        <div className="w-16 h-16 bg-slate-100 text-slate-300 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Wallet size={32} />
                        </div>
                        <p className="text-slate-500 font-medium text-lg">Вы еще не делали пожертвований</p>
                        <p className="text-slate-400 mt-1">Здесь будет отображаться история ваших добрых дел</p>
                    </div>
                ) : (
                    <div className="grid gap-3">
                        {donations.map((d) => (
                            <div
                                key={d.id}
                                className="flex justify-between items-center bg-white border border-slate-100 hover:border-brand-primary/30 p-5 rounded-xl transition-all shadow-sm group"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-lg bg-brand-primary/10 text-brand-primary flex items-center justify-center">
                                        <Wallet size={18} />
                                    </div>
                                    <div>
                                        <div className="font-bold text-slate-800 group-hover:text-brand-primary transition-colors">
                                            {d.projectTitle}
                                        </div>
                                        <div className="text-slate-400 text-sm font-medium">
                                            {new Date(d.createdAt).toLocaleDateString("ru-RU", {
                                                day: 'numeric',
                                                month: 'long',
                                                year: 'numeric'
                                            })}
                                        </div>
                                    </div>
                                </div>

                                <div className="text-brand-primary font-black bg-brand-primary/10 px-4 py-2 rounded-lg">
                                    +{d.amount} ETH
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserProfilePage;