import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Activity, ArrowUpRight, BarChart3, CheckCircle2, Clock3, Download, Link2, RefreshCw, Send, Wallet } from "lucide-react";
import { financeService } from "../services/financeService";
import type { ProjectData } from "../models/ProjectData";
import type { PaymentHistoryResponse } from "../models/Payment";
import PaymentStatusBadge from "../components/PaymentStatusBadge";

const ProjectFinancialSettings = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [project, setProject] = useState<ProjectData | null>(null);
    const [transactions, setTransactions] = useState<PaymentHistoryResponse[]>([]);
    const [walletAddress, setWalletAddress] = useState("");
    const [targetAmount, setTargetAmount] = useState("");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [exporting, setExporting] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {
        const load = async () => {
            if (!id) {
                setError("Не указан идентификатор проекта");
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError("");

                const data = await financeService.getProjectFinancialInfo(id);
                const orderedTransactions = [...data.transactions].sort((left, right) => {
                    return new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime();
                });

                setProject(data.project);
                setTransactions(orderedTransactions);
                setWalletAddress(data.project.walletAddress || "");
                setTargetAmount(String(data.project.targetAmount ?? 0));
            } catch (err) {
                const message = err instanceof Error ? err.message : "Не удалось загрузить финансовые настройки";
                setError(message);
            } finally {
                setLoading(false);
            }
        };

        load();
    }, [id]);

    const chartDays = useMemo(() => getLastDays(7), []);

    const donationsByDay = useMemo(() => {
        return chartDays.map((day) => {
            const dayTransactions = transactions.filter((transaction) => {
                return isActiveDonationStatus(transaction.status) && sameDay(transaction.createdAt, day.date);
            });

            return {
                label: day.label,
                amount: dayTransactions.reduce((sum, transaction) => sum + transaction.amount, 0),
            };
        });
    }, [chartDays, transactions]);

    const transactionsByDay = useMemo(() => {
        return chartDays.map((day) => {
            const count = transactions.filter((transaction) => sameDay(transaction.createdAt, day.date)).length;
            return {
                label: day.label,
                count,
            };
        });
    }, [chartDays, transactions]);

    const maxDonationAmount = Math.max(...donationsByDay.map((item) => item.amount), 0);
    const maxTxCount = Math.max(...transactionsByDay.map((item) => item.count), 0);

    const progress = project ? getProjectProgress(project) : 0;
    const reachedTarget = project ? project.targetAmount > 0 && project.collectedAmount >= project.targetAmount : false;

    const handleSaveWallet = async () => {
        if (!id) return;

        try {
            setSaving(true);
            setError("");
            setSuccess("");
            const updated = await financeService.setWallet(id, walletAddress.trim());
            setProject(updated);
            setSuccess("Wallet address сохранён");
        } catch (err) {
            setError(err instanceof Error ? err.message : "Не удалось сохранить wallet address");
        } finally {
            setSaving(false);
        }
    };

    const handleSaveTarget = async () => {
        if (!id) return;

        const numericTarget = Number(targetAmount);
        if (!Number.isFinite(numericTarget) || numericTarget <= 0) {
            setError("Целевая сумма должна быть больше 0");
            return;
        }

        try {
            setSaving(true);
            setError("");
            setSuccess("");
            const updated = await financeService.setTargetAmount(id, numericTarget);
            setProject(updated);
            setSuccess("Target amount сохранён");
        } catch (err) {
            setError(err instanceof Error ? err.message : "Не удалось сохранить target amount");
        } finally {
            setSaving(false);
        }
    };

    const handleActivate = async () => {
        if (!id) return;

        try {
            setSaving(true);
            setError("");
            setSuccess("");
            const updated = await financeService.activateProject(id);
            setProject(updated);
            setSuccess("Проект активирован");
        } catch (err) {
            setError(err instanceof Error ? err.message : "Не удалось активировать проект");
        } finally {
            setSaving(false);
        }
    };

    const handleDownloadPdfReport = async () => {
        if (!id) {
            return;
        }

        try {
            setExporting(true);
            setError("");
            setSuccess("");

            const blob = await financeService.exportProjectPdfReport(id);
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = `project-${id}-financial-report.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);

            setSuccess("PDF отчет успешно сформирован и скачан");
        } catch (err) {
            setError(err instanceof Error ? err.message : "Не удалось скачать PDF отчет");
        } finally {
            setExporting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center px-4">
                <div className="premium-card flex items-center gap-3 px-6 py-4 text-brand-primary shadow-sm">
                    <RefreshCw className="h-5 w-5 animate-spin" />
                    <span className="text-sm font-semibold">Загружаем финансовый дашборд проекта...</span>
                </div>
            </div>
        );
    }

    if (!project) {
        return (
            <div className="mx-auto max-w-3xl px-4 py-10">
                <div className="premium-card p-8 text-center">
                    <p className="text-slate-600">Проект не найден</p>
                    <button
                        onClick={() => navigate("/finance/projects")}
                        className="mt-5 inline-flex items-center gap-2 rounded-2xl bg-brand-primary px-5 py-3 text-sm font-bold text-white transition-all hover:bg-brand-secondary"
                    >
                        Вернуться к списку проектов
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="animate-fade-in space-y-8 px-4 py-8 md:px-6">
            <section className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                <div className="flex items-start gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-brand-beige/70 bg-white text-brand-primary shadow-sm">
                        <Wallet size={28} />
                    </div>
                    <div className="space-y-2">
                        <div className="inline-flex items-center gap-2 rounded-full border border-brand-beige/70 bg-white px-3 py-1 text-xs font-bold uppercase tracking-[0.22em] text-brand-secondary shadow-sm">
                            <BarChart3 size={12} />
                            Project finance dashboard
                        </div>
                        <h1 className="text-3xl font-black tracking-tight text-slate-800 md:text-4xl">{project.title}</h1>
                        <p className="max-w-3xl text-sm font-medium leading-6 text-slate-500 md:text-base">
                            Полный финансовый обзор проекта: параметры, графики, транзакции и действия FinanceManager.
                        </p>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <button
                        onClick={() => navigate("/finance/projects")}
                        className="inline-flex items-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-bold text-brand-primary shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lg active:scale-95"
                    >
                        <ArrowUpRight size={18} />
                        К проектам
                    </button>
                    <button
                        onClick={() => navigate("/finance/dashboard")}
                        className="inline-flex items-center gap-2 rounded-2xl bg-brand-primary px-5 py-3 text-sm font-bold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-brand-secondary hover:shadow-lg active:scale-95"
                    >
                        <ArrowUpRight size={18} />
                        Глобальный дашборд
                    </button>
                </div>
            </section>

            {error && <div className="rounded-2xl border border-red-100 bg-red-50 px-5 py-4 text-sm font-semibold text-red-600 shadow-sm">{error}</div>}
            {success && <div className="rounded-2xl border border-green-100 bg-green-50 px-5 py-4 text-sm font-semibold text-green-700 shadow-sm">{success}</div>}

            <section className="premium-card p-5 md:p-6">
                <div className="mb-4">
                    <h2 className="text-xl font-black text-slate-800">Общая информация</h2>
                    <p className="mt-1 text-sm font-medium text-slate-500">Ключевые финансовые поля проекта</p>
                </div>
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
                    <InfoTile title="Статус" value={project.status} />
                    <InfoTile title="Собрано" value={`${formatEthAmountFlexible(project.collectedAmount)} ETH`} />
                    <InfoTile title="Цель" value={`${formatEthAmountFlexible(project.targetAmount)} ETH`} />
                    <InfoTile title="Funding progress" value={`${progress.toFixed(1)}%`} accent="text-brand-primary" />
                    <InfoTile title="Wallet" value={project.walletAddress || "Не задан"} mono />
                </div>

                {project.walletAddress && (
                    <div className="mt-4">
                        <a
                            href={`https://sepolia.etherscan.io/address/${project.walletAddress}`}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-2 text-sm font-bold text-brand-secondary transition-colors hover:text-brand-accent"
                        >
                            <Link2 size={16} />
                            Открыть wallet в Etherscan
                        </a>
                    </div>
                )}
            </section>

            <section className="grid gap-4 xl:grid-cols-3">
                <div className="premium-card p-5 md:p-6">
                    <div className="mb-4 flex items-center justify-between">
                        <h2 className="text-lg font-black text-slate-800">Donations over time</h2>
                        <div className="rounded-xl bg-brand-primary/10 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-brand-primary">ETH</div>
                    </div>

                    <div className="flex h-64 items-end gap-3 rounded-2xl border border-brand-beige/50 bg-brand-light/20 p-4">
                        {donationsByDay.map((item) => {
                            const height = `${Math.max(maxDonationAmount > 0 ? (item.amount / maxDonationAmount) * 100 : 0, item.amount > 0 ? 12 : 4)}%`;
                            return (
                                <div key={item.label} className="flex flex-1 flex-col items-center justify-end gap-2">
                                    <div
                                        className="w-full max-w-10 rounded-t-2xl bg-linear-to-t from-brand-primary via-brand-secondary to-brand-accent"
                                        style={{ height }}
                                        title={`${item.label}: ${formatEthAmountFlexible(item.amount)} ETH`}
                                    />
                                    <div className="text-center text-[11px] font-semibold text-slate-500">
                                        <div className="uppercase tracking-[0.16em]">{item.label}</div>
                                        <div className="mt-1 font-bold text-slate-800">{formatEthAmountFlexible(item.amount)}</div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="premium-card p-5 md:p-6">
                    <div className="mb-4 flex items-center justify-between">
                        <h2 className="text-lg font-black text-slate-800">Transactions over time</h2>
                        <div className="rounded-xl bg-brand-secondary/10 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-brand-secondary">TX</div>
                    </div>

                    <div className="space-y-3">
                        {transactionsByDay.map((item) => {
                            const width = `${Math.max(maxTxCount > 0 ? (item.count / maxTxCount) * 100 : 0, item.count > 0 ? 8 : 0)}%`;
                            return (
                                <div key={item.label} className="rounded-2xl border border-brand-beige/50 bg-brand-light/20 p-3">
                                    <div className="mb-2 flex items-center justify-between text-sm font-semibold text-slate-700">
                                        <span>{item.label}</span>
                                        <span>{item.count} tx</span>
                                    </div>
                                    <div className="h-2.5 overflow-hidden rounded-full bg-white">
                                        <div className="h-full rounded-full bg-brand-secondary transition-all duration-700" style={{ width }} />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="premium-card p-5 md:p-6">
                    <div className="mb-4 flex items-center justify-between">
                        <h2 className="text-lg font-black text-slate-800">Funding progress</h2>
                        <div className="rounded-xl bg-brand-accent/20 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-brand-primary">Progress</div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-end justify-between gap-3">
                            <div>
                                <div className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">Достигнуто</div>
                                <div className="mt-2 text-4xl font-black text-brand-primary">{progress.toFixed(1)}%</div>
                            </div>
                            <PaymentStatusBadge status={project.status} />
                        </div>

                        <div className="h-3 overflow-hidden rounded-full bg-brand-light/40">
                            <div className="progress-bar-fill h-full rounded-full transition-all duration-700" style={{ width: `${Math.min(progress, 100)}%` }} />
                        </div>

                        <div className="rounded-2xl border border-brand-beige/50 bg-brand-light/20 p-4 text-sm font-semibold text-slate-600">
                            <div className="flex items-center justify-between">
                                <span>Собрано</span>
                                <span className="font-black text-brand-primary">{formatEthAmountFlexible(project.collectedAmount)} ETH</span>
                            </div>
                            <div className="mt-2 flex items-center justify-between">
                                <span>Цель</span>
                                <span className="font-black text-slate-800">{formatEthAmountFlexible(project.targetAmount)} ETH</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
                <div className="premium-card p-5 md:p-6">
                    <div className="mb-4">
                        <h2 className="text-xl font-black text-slate-800">Действия FinanceManager</h2>
                        <p className="mt-1 text-sm font-medium text-slate-500">Изменение wallet/target, активация и подготовка вывода средств.</p>
                    </div>

                    <div className="grid gap-5 md:grid-cols-2">
                        <div className="space-y-2">
                            <label className="ml-1 text-sm font-bold text-slate-700">Wallet address</label>
                            <input
                                value={walletAddress}
                                onChange={(event) => setWalletAddress(event.target.value)}
                                placeholder="0x..."
                                className="w-full rounded-xl border border-slate-200 bg-white p-4 font-mono text-sm text-slate-800 shadow-sm outline-none transition-all placeholder:text-slate-400 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/15"
                            />
                            <button
                                onClick={handleSaveWallet}
                                disabled={saving}
                                className="inline-flex items-center gap-2 rounded-xl bg-brand-primary px-4 py-3 text-sm font-bold text-white transition-all hover:bg-brand-secondary disabled:cursor-not-allowed disabled:opacity-70"
                            >
                                <CheckCircle2 size={16} />
                                Set wallet
                            </button>
                        </div>

                        <div className="space-y-2">
                            <label className="ml-1 text-sm font-bold text-slate-700">Target amount</label>
                            <input
                                type="number"
                                min="0"
                                step="0.01"
                                value={targetAmount}
                                onChange={(event) => setTargetAmount(event.target.value)}
                                placeholder="0.00"
                                className="w-full rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-800 shadow-sm outline-none transition-all placeholder:text-slate-400 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/15"
                            />
                            <button
                                onClick={handleSaveTarget}
                                disabled={saving}
                                className="inline-flex items-center gap-2 rounded-xl bg-brand-primary px-4 py-3 text-sm font-bold text-white transition-all hover:bg-brand-secondary disabled:cursor-not-allowed disabled:opacity-70"
                            >
                                <CheckCircle2 size={16} />
                                Set target amount
                            </button>
                        </div>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-3">
                        <button
                            onClick={handleActivate}
                            disabled={saving}
                            className="inline-flex items-center gap-2 rounded-xl bg-brand-secondary px-4 py-3 text-sm font-bold text-white transition-all hover:bg-brand-primary disabled:cursor-not-allowed disabled:opacity-70"
                        >
                            <Clock3 size={16} />
                            Activate project
                        </button>

                        <button
                            disabled
                            title="Скоро доступно после подключения backend-проверки перевода"
                            className="inline-flex items-center gap-2 rounded-xl bg-slate-300 px-4 py-3 text-sm font-bold text-slate-600"
                        >
                            <Send size={16} />
                            Transfer funds
                        </button>
                    </div>
                </div>

                <div className="premium-card p-5 md:p-6">
                    <div className="mb-4 flex items-center gap-2 text-brand-primary">
                        <Activity size={16} />
                        <span className="text-sm font-black uppercase tracking-[0.2em]">Transfer status</span>
                    </div>

                    <div className="space-y-3 rounded-2xl border border-brand-beige/60 bg-brand-light/20 p-4 text-sm font-semibold text-slate-600">
                        <div className="flex items-center justify-between">
                            <span>Цель достигнута</span>
                            <span className={reachedTarget ? "text-green-700" : "text-slate-500"}>{reachedTarget ? "Да" : "Нет"}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span>Текущий backend endpoint</span>
                            <span className="text-slate-500">Недоступен</span>
                        </div>
                        <div className="rounded-xl border border-dashed border-brand-beige/80 bg-white/70 px-3 py-2 text-xs leading-5 text-slate-500">
                            Перевод средств будет доступен после внедрения серверной валидации transfer flow. Кнопка уже подготовлена в интерфейсе.
                        </div>
                    </div>
                </div>
            </section>

            <section className="premium-card p-5 md:p-6">
                <div className="mb-4">
                    <h2 className="text-xl font-black text-slate-800">Отчеты</h2>
                    <p className="mt-1 text-sm font-medium text-slate-500">Экспорт финансового отчета проекта в PDF для внешней отчетности.</p>
                </div>

                <button
                    onClick={handleDownloadPdfReport}
                    disabled={exporting}
                    className="inline-flex items-center gap-2 rounded-xl bg-brand-primary px-5 py-3 text-sm font-bold text-white transition-all hover:bg-brand-secondary disabled:cursor-not-allowed disabled:opacity-70"
                >
                    <Download size={16} />
                    {exporting ? "Формируем PDF..." : "Скачать PDF отчет"}
                </button>
            </section>

            <section className="premium-card p-5 md:p-6">
                <div className="mb-5">
                    <h2 className="text-xl font-black text-slate-800">Транзакции проекта</h2>
                    <p className="mt-1 text-sm font-medium text-slate-500">Прозрачная история по tx hash, статусам и Etherscan-ссылкам</p>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full border-collapse text-left">
                        <thead className="border-b border-brand-beige/60 bg-brand-light/60">
                            <tr>
                                <th className="p-4 text-xs font-bold uppercase tracking-[0.24em] text-slate-500">Tx hash</th>
                                <th className="p-4 text-xs font-bold uppercase tracking-[0.24em] text-slate-500">Amount</th>
                                <th className="p-4 text-xs font-bold uppercase tracking-[0.24em] text-slate-500">Status</th>
                                <th className="p-4 text-xs font-bold uppercase tracking-[0.24em] text-slate-500">Date</th>
                                <th className="p-4 text-xs font-bold uppercase tracking-[0.24em] text-slate-500">Etherscan</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-brand-beige/50">
                            {transactions.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="p-10 text-center text-sm font-medium text-slate-500">
                                        Транзакций пока нет
                                    </td>
                                </tr>
                            ) : (
                                transactions.map((transaction) => (
                                    <tr key={transaction.id} className="transition-colors hover:bg-brand-light/40">
                                        <td className="p-4 font-mono text-xs text-slate-700">{shortTxHash(transaction.txHash)}</td>
                                        <td className="p-4 text-sm font-bold text-brand-primary">{formatEthAmountFlexible(transaction.amount)} {transaction.currency}</td>
                                        <td className="p-4"><PaymentStatusBadge status={transaction.status} /></td>
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

interface InfoTileProps {
    title: string;
    value: string;
    mono?: boolean;
    accent?: string;
}

const InfoTile = ({ title, value, mono = false, accent = "text-slate-800" }: InfoTileProps) => (
    <div className="rounded-2xl border border-brand-beige/50 bg-brand-light/30 p-4">
        <div className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">{title}</div>
        <div className={`mt-2 text-sm font-black ${accent} ${mono ? "font-mono break-all" : ""}`}>{value}</div>
    </div>
);

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

const getProjectProgress = (project: ProjectData) => {
    if (!project.targetAmount || project.targetAmount <= 0) {
        return 0;
    }

    return Math.min((project.collectedAmount / project.targetAmount) * 100, 100);
};

const isActiveDonationStatus = (status: string) => {
    const normalized = status.toLowerCase();
    return normalized === "confirmed" || normalized === "pending";
};

const shortTxHash = (value: string) => {
    if (value.length <= 12) {
        return value;
    }

    return `${value.slice(0, 6)}...${value.slice(-4)}`;
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

export default ProjectFinancialSettings;
