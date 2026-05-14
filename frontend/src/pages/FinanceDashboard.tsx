import { useEffect, useMemo, useState, type ReactNode } from "react";
import { Activity, BarChart3, CheckCircle2, Clock3, Filter, RefreshCw, Sparkles, TrendingUp } from "lucide-react";
import { financeService, type FinanceDashboardResponse } from "../services/financeService";
import type { PaymentHistoryResponse } from "../models/Payment";
import PaymentStatusBadge from "../components/PaymentStatusBadge";
import { getProjects } from "../services/projService";
import type { ProjectData } from "../models/ProjectData";
import { Link } from "react-router-dom";

const FinanceDashboard = () => {
    const [dashboard, setDashboard] = useState<FinanceDashboardResponse | null>(null);
    const [transactions, setTransactions] = useState<PaymentHistoryResponse[]>([]);
    const [projects, setProjects] = useState<ProjectData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");

    useEffect(() => {
        const load = async () => {
            try {
                setLoading(true);
                setError("");

                const [dashboardData, transactionsData] = await Promise.all([
                    financeService.getDashboard(),
                    financeService.getTransactions(),
                ]);
                const projectData = await getProjects();

                setDashboard(dashboardData);
                setTransactions(transactionsData);
                setProjects(projectData);
            } catch (err) {
                const message = err instanceof Error ? err.message : "Не удалось загрузить finance dashboard";
                setError(message);
            } finally {
                setLoading(false);
            }
        };

        load();
    }, []);

    const filteredTransactions = useMemo(() => {
        if (statusFilter === "all") {
            return transactions;
        }

        return transactions.filter((transaction) => transaction.status.toLowerCase() === statusFilter);
    }, [transactions, statusFilter]);

    const donationTransactions = useMemo(() => {
        return transactions.filter((transaction) => isActiveDonationStatus(transaction.status));
    }, [transactions]);

    const recentTransactions = filteredTransactions.slice(0, 8);
    const chartDays = useMemo(() => getLastDays(7), []);
    const donationsByDay = useMemo(() => {
        return chartDays.map((day) => {
            const dayTransactions = donationTransactions.filter((transaction) => sameDay(transaction.createdAt, day.date));

            return {
                label: day.label,
                count: dayTransactions.length,
                amount: dayTransactions.reduce((sum, transaction) => sum + transaction.amount, 0),
            };
        });
    }, [chartDays, donationTransactions]);

    const maxDailyAmount = Math.max(...donationsByDay.map((item) => item.amount), 0);
    const maxDailyCount = Math.max(...donationsByDay.map((item) => item.count), 0);
    const statusSummary = useMemo(() => {
        const confirmed = transactions.filter((transaction) => transaction.status.toLowerCase() === "confirmed").length;
        const pending = transactions.filter((transaction) => transaction.status.toLowerCase() === "pending").length;
        const failed = transactions.filter((transaction) => transaction.status.toLowerCase() === "failed").length;
        const cancelled = transactions.filter((transaction) => transaction.status.toLowerCase() === "cancelled").length;

        return [
            { label: "Confirmed", value: confirmed, color: "#522157" },
            { label: "Pending", value: pending, color: "#8B4C70" },
            { label: "Failed", value: failed, color: "#C2649A" },
            { label: "Cancelled", value: cancelled, color: "#E4C7B7" },
        ];
    }, [transactions]);

    const totalStatus = Math.max(statusSummary.reduce((sum, item) => sum + item.value, 0), 1);
    const topProjects = useMemo(() => {
        return [...projects]
            .sort((left, right) => getProjectProgress(right) - getProjectProgress(left))
            .slice(0, 5);
    }, [projects]);

    if (loading) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center px-4">
                <div className="premium-card flex items-center gap-3 px-6 py-4 text-brand-primary shadow-sm">
                    <RefreshCw className="h-5 w-5 animate-spin" />
                    <span className="text-sm font-semibold">Загружаем finance dashboard...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="animate-fade-in space-y-8 px-4 py-8 md:px-6">
            <section className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                <div className="flex items-start gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-brand-beige/70 bg-white text-brand-primary shadow-sm">
                        <BarChart3 size={28} />
                    </div>
                    <div className="space-y-2">
                        <div className="inline-flex items-center gap-2 rounded-full border border-brand-beige/70 bg-white px-3 py-1 text-xs font-bold uppercase tracking-[0.22em] text-brand-secondary shadow-sm">
                            <Sparkles size={12} />
                            Finance dashboard
                        </div>
                        <h1 className="text-3xl font-black tracking-tight text-slate-800 md:text-4xl">
                            Финансовый контроль
                        </h1>
                        <p className="max-w-2xl text-sm font-medium leading-6 text-slate-500 md:text-base">
                            KPI по донатам, статусы транзакций и быстрый обзор активности проектов.
                        </p>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <Link
                        to="/finance/projects"
                        className="inline-flex items-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-bold text-brand-primary shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lg active:scale-95"
                    >
                        <TrendingUp size={18} />
                        К финансовым проектам
                    </Link>

                    <button
                        onClick={() => window.location.reload()}
                        className="inline-flex items-center gap-2 rounded-2xl bg-brand-primary px-5 py-3 text-sm font-bold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-brand-secondary hover:shadow-lg active:scale-95"
                    >
                        <RefreshCw size={18} />
                        Обновить данные
                    </button>
                </div>
            </section>

            {error && (
                <div className="rounded-2xl border border-red-100 bg-red-50 px-5 py-4 text-sm font-semibold text-red-600 shadow-sm">
                    {error}
                </div>
            )}

            <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <MetricCard title="Всего донатов" value={dashboard?.totalDonations ?? 0} hint="Общее число подтвержденных и ожидающих платежей" icon={<Activity size={20} />} />
                <MetricCard title="Подтверждено ETH" value={`${Number(dashboard?.totalConfirmedEth ?? 0).toFixed(4)} ETH`} hint="Сумма подтвержденных переводов" icon={<CheckCircle2 size={20} />} />
                <MetricCard title="Транзакций" value={dashboard?.totalTransactions ?? 0} hint="Все транзакции в системе" icon={<TrendingUp size={20} />} />
                <MetricCard title="Ожидают обработки" value={dashboard?.pendingTransactions ?? 0} hint="Транзакции в pending" icon={<Clock3 size={20} />} />
            </section>

            <section className="grid gap-4 md:grid-cols-3">
                <CompactStat label="Активные проекты" value={dashboard?.activeProjects ?? 0} accent="text-brand-primary" />
                <CompactStat label="Завершённые проекты" value={dashboard?.completedProjects ?? 0} accent="text-brand-secondary" />
                <CompactStat label="Неудачные транзакции" value={dashboard?.failedTransactions ?? 0} accent="text-red-600" />
            </section>

            <section className="grid gap-4 lg:grid-cols-2">
                <div className="premium-card p-5 md:p-6">
                    <div className="mb-5 flex items-center justify-between gap-4">
                        <div>
                            <h2 className="text-xl font-black text-slate-800">Донаты по дням</h2>
                            <p className="mt-1 text-sm font-medium text-slate-500">Подтвержденные и ожидающие платежи за последние 7 дней. Шкала настроена для микродонатов.</p>
                        </div>
                        <div className="rounded-2xl bg-brand-primary/10 px-3 py-2 text-xs font-bold uppercase tracking-[0.22em] text-brand-primary">
                            <TrendingUp size={14} className="inline-block -translate-y-px" />
                            Trend
                        </div>
                    </div>

                    <div className="flex h-72 items-end gap-3 rounded-3xl border border-brand-beige/40 bg-brand-light/20 p-4">
                        {donationsByDay.map((item) => {
                            const height = `${getDonationBarHeight(item.amount, item.count, maxDailyAmount, maxDailyCount)}%`;
                            const formattedAmount = formatEthAmountFlexible(item.amount);

                            return (
                                <div key={item.label} className="flex flex-1 flex-col items-center justify-end gap-3">
                                    <div className="flex w-full justify-center">
                                        <div
                                            className="w-full max-w-12 rounded-t-3xl bg-linear-to-t from-brand-primary via-brand-secondary to-brand-accent shadow-[0_10px_30px_rgba(82,33,87,0.25)] transition-all duration-700"
                                            style={{ height }}
                                            title={`${item.label}: ${formattedAmount} ETH (${item.count} tx)`}
                                        />
                                    </div>
                                    <div className="text-center">
                                        <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">{item.label}</div>
                                        <div className="mt-1 text-sm font-black text-slate-800">{formattedAmount} ETH</div>
                                        <div className="text-[11px] font-semibold text-slate-500">{item.count} tx</div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="premium-card p-5 md:p-6">
                    <div className="mb-5">
                        <h2 className="text-xl font-black text-slate-800">Статусы транзакций</h2>
                        <p className="mt-1 text-sm font-medium text-slate-500">Распределение по состояниям платежей</p>
                    </div>

                    <div className="grid gap-5 lg:grid-cols-[220px_1fr] lg:items-center">
                        <DonutChart segments={statusSummary} total={totalStatus} />

                        <div className="space-y-3">
                            {statusSummary.map((item) => {
                                const percent = (item.value / totalStatus) * 100;

                                return (
                                    <div key={item.label} className="space-y-2 rounded-2xl border border-brand-beige/50 bg-brand-light/20 p-3">
                                        <div className="flex items-center justify-between gap-3 text-sm font-semibold text-slate-700">
                                            <span>{item.label}</span>
                                            <span>{item.value} / {totalStatus}</span>
                                        </div>
                                        <div className="h-2.5 overflow-hidden rounded-full bg-white">
                                            <div
                                                className="h-full rounded-full transition-all duration-700"
                                                style={{ width: `${percent}%`, backgroundColor: item.color }}
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </section>

            <section className="premium-card p-5 md:p-6">
                <div className="mb-5 flex items-center justify-between gap-4">
                    <div>
                        <h2 className="text-xl font-black text-slate-800">Funding progress по проектам</h2>
                        <p className="mt-1 text-sm font-medium text-slate-500">Топ проектов по доле собранной суммы к цели</p>
                    </div>
                    <div className="rounded-2xl bg-brand-secondary/10 px-3 py-2 text-xs font-bold uppercase tracking-[0.22em] text-brand-secondary">
                        <Activity size={14} className="inline-block -translate-y-px" />
                        Progress
                    </div>
                </div>

                <div className="grid gap-4">
                    {topProjects.length === 0 ? (
                        <div className="rounded-2xl border border-dashed border-brand-beige/70 bg-brand-light/20 p-6 text-sm font-medium text-slate-500">
                            Пока нет данных для графика проектов.
                        </div>
                    ) : (
                        topProjects.map((project) => {
                            const progress = getProjectProgress(project);

                            return (
                                <div key={project.id} className="rounded-2xl border border-brand-beige/60 bg-brand-light/20 p-4">
                                    <div className="mb-2 flex items-center justify-between gap-3">
                                        <div>
                                            <div className="font-black text-slate-800">{project.title}</div>
                                            <div className="mt-1 text-xs font-medium text-slate-500">{project.collectedAmount} / {project.targetAmount} ETH</div>
                                        </div>
                                        <div className="text-sm font-black text-brand-primary">{progress.toFixed(0)}%</div>
                                    </div>
                                    <div className="h-3 overflow-hidden rounded-full bg-white">
                                        <div
                                            className="progress-bar-fill h-full rounded-full transition-all duration-700 ease-out"
                                            style={{ width: `${Math.min(progress, 100)}%` }}
                                        />
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </section>

            <section className="premium-card p-5 md:p-6">
                <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                        <h2 className="text-xl font-black text-slate-800">Последние транзакции</h2>
                        <p className="mt-1 text-sm font-medium text-slate-500">Список платежей для ручной проверки и сверки</p>
                    </div>

                    <div className="flex items-center gap-2 rounded-2xl border border-brand-beige/60 bg-brand-light/70 px-4 py-3 text-sm font-semibold text-slate-600">
                        <Filter size={16} />
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="bg-transparent outline-none"
                        >
                            <option value="all">Все статусы</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="pending">Pending</option>
                            <option value="failed">Failed</option>
                            <option value="cancelled">Cancelled</option>
                        </select>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full border-collapse text-left">
                        <thead className="border-b border-brand-beige/60 bg-brand-light/60">
                            <tr>
                                <th className="p-4 text-xs font-bold uppercase tracking-[0.24em] text-slate-500">Tx hash</th>
                                <th className="p-4 text-xs font-bold uppercase tracking-[0.24em] text-slate-500">Amount</th>
                                <th className="p-4 text-xs font-bold uppercase tracking-[0.24em] text-slate-500">Currency</th>
                                <th className="p-4 text-xs font-bold uppercase tracking-[0.24em] text-slate-500">Status</th>
                                <th className="p-4 text-xs font-bold uppercase tracking-[0.24em] text-slate-500">Date</th>
                                <th className="p-4 text-xs font-bold uppercase tracking-[0.24em] text-slate-500">Etherscan</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-brand-beige/50">
                            {recentTransactions.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="p-10 text-center text-sm font-medium text-slate-500">
                                        Транзакции не найдены
                                    </td>
                                </tr>
                            ) : (
                                recentTransactions.map((transaction) => (
                                    <tr key={transaction.id} className="transition-colors hover:bg-brand-light/40">
                                        <td className="p-4">
                                            <span className="font-mono text-xs text-slate-700">{shortTxHash(transaction.txHash)}</span>
                                        </td>
                                        <td className="p-4 text-sm font-bold text-brand-primary">{transaction.amount}</td>
                                        <td className="p-4 text-sm font-semibold text-slate-600">{transaction.currency}</td>
                                        <td className="p-4">
                                            <PaymentStatusBadge status={transaction.status} />
                                        </td>
                                        <td className="p-4 text-sm text-slate-500">{new Date(transaction.createdAt).toLocaleString("ru-RU")}</td>
                                        <td className="p-4 text-sm">
                                            <a
                                                href={transaction.etherscanUrl}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="font-semibold text-brand-secondary transition-colors hover:text-brand-accent"
                                            >
                                                Открыть
                                            </a>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    );
};

interface MetricCardProps {
    title: string;
    value: number | string;
    hint: string;
    icon: ReactNode;
}

const MetricCard = ({ title, value, hint, icon }: MetricCardProps) => (
    <div className="premium-card p-5 shadow-sm">
        <div className="flex items-start justify-between gap-4">
            <div>
                <div className="text-xs font-bold uppercase tracking-[0.24em] text-slate-400">{title}</div>
                <div className="mt-3 text-3xl font-black text-slate-800">{value}</div>
            </div>
            <div className="rounded-2xl bg-brand-primary/10 p-3 text-brand-primary">{icon}</div>
        </div>
        <p className="mt-3 text-sm font-medium leading-6 text-slate-500">{hint}</p>
    </div>
);

interface CompactStatProps {
    label: string;
    value: number;
    accent: string;
}

const CompactStat = ({ label, value, accent }: CompactStatProps) => (
    <div className="premium-card p-5">
        <div className="text-xs font-bold uppercase tracking-[0.24em] text-slate-400">{label}</div>
        <div className={`mt-3 text-3xl font-black ${accent}`}>{value}</div>
    </div>
);

const shortTxHash = (value: string) => {
    if (value.length <= 12) {
        return value;
    }

    return `${value.slice(0, 6)}...${value.slice(-4)}`;
};

interface DayBucket {
    label: string;
    date: Date;
}

const getLastDays = (count: number): DayBucket[] => {
    const result: DayBucket[] = [];
    const today = new Date();

    for (let offset = count - 1; offset >= 0; offset -= 1) {
        const date = new Date(today);
        date.setDate(today.getDate() - offset);
        result.push({
            date,
            label: date.toLocaleDateString("ru-RU", { weekday: "short" }),
        });
    }

    return result;
};

const sameDay = (left: string | Date, right: Date) => {
    const leftDate = new Date(left);
    return leftDate.getFullYear() === right.getFullYear() &&
        leftDate.getMonth() === right.getMonth() &&
        leftDate.getDate() === right.getDate();
};

const isActiveDonationStatus = (status: string) => {
    const normalized = status.toLowerCase();
    return normalized === "confirmed" || normalized === "pending";
};

const formatEthAmountFlexible = (amount: number) => {
    if (amount === 0) {
        return "0";
    }

    const decimals = amount < 0.0001 ? 8 : amount < 0.01 ? 6 : 4;
    const formatted = amount.toLocaleString("en-US", {
        minimumFractionDigits: 0,
        maximumFractionDigits: decimals,
    });

    return formatted.replace(/\.0+$/, "").replace(/(\.\d*?[1-9])0+$/, "$1");
};

const getDonationBarHeight = (amount: number, count: number, maxAmount: number, maxCount: number) => {
    if (amount <= 0 && count <= 0) {
        return 4;
    }

    const amountScale = maxAmount > 0
        ? Math.log10(amount * 1000000 + 1) / Math.log10(maxAmount * 1000000 + 1)
        : 0;
    const countScale = maxCount > 0 ? count / maxCount : 0;
    const blendedScale = Math.max(amountScale * 0.85, countScale * 0.15);

    return Math.max(blendedScale * 100, 14);
};

const getProjectProgress = (project: ProjectData) => {
    if (!project.targetAmount || project.targetAmount <= 0) {
        return 0;
    }

    return Math.min((project.collectedAmount / project.targetAmount) * 100, 100);
};

interface DonutChartProps {
    segments: { label: string; value: number; color: string }[];
    total: number;
}

const DonutChart = ({ segments, total }: DonutChartProps) => {
    const size = 220;
    const radius = 74;
    const strokeWidth = 22;
    const circumference = 2 * Math.PI * radius;
    let accumulated = 0;

    return (
        <div className="flex flex-col items-center justify-center rounded-[1.75rem] border border-brand-beige/50 bg-brand-light/20 p-4">
            <svg viewBox={`0 0 ${size} ${size}`} className="h-55 w-55 -rotate-90">
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    stroke="rgba(228, 223, 217, 0.75)"
                    strokeWidth={strokeWidth}
                />
                {segments.map((segment) => {
                    const dash = total > 0 ? (segment.value / total) * circumference : 0;
                    const circle = (
                        <circle
                            key={segment.label}
                            cx={size / 2}
                            cy={size / 2}
                            r={radius}
                            fill="none"
                            stroke={segment.color}
                            strokeWidth={strokeWidth}
                            strokeDasharray={`${dash} ${circumference - dash}`}
                            strokeDashoffset={-accumulated}
                            strokeLinecap="round"
                        />
                    );

                    accumulated += dash;
                    return circle;
                })}
            </svg>

            <div className="-mt-36 flex flex-col items-center text-center">
                <div className="text-xs font-bold uppercase tracking-[0.24em] text-slate-400">Transactions</div>
                <div className="mt-2 text-4xl font-black text-slate-800">{total}</div>
                <div className="mt-2 max-w-44 text-sm font-medium leading-6 text-slate-500">Распределение по статусам в текущем финансовом потоке</div>
            </div>
        </div>
    );
};

export default FinanceDashboard;
