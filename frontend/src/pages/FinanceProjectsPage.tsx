import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Gem, RefreshCw, Search, ArrowUpRight, Wallet } from "lucide-react";
import type { ProjectData, ProjectStatus } from "../models/ProjectData";
import { getProjects } from "../services/projService";
import PaymentStatusBadge from "../components/PaymentStatusBadge";

const FinanceProjectsPage = () => {
    const [projects, setProjects] = useState<ProjectData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [query, setQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState<"all" | ProjectStatus>("all");

    useEffect(() => {
        const load = async () => {
            try {
                setLoading(true);
                setError("");
                const data = await getProjects();
                setProjects(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : "Не удалось загрузить проекты");
            } finally {
                setLoading(false);
            }
        };

        load();
    }, []);

    const filteredProjects = useMemo(() => {
        const normalizedQuery = query.trim().toLowerCase();

        return projects.filter((project) => {
            const passesStatus = statusFilter === "all" || project.status === statusFilter;
            if (!passesStatus) {
                return false;
            }

            if (!normalizedQuery) {
                return true;
            }

            return project.title.toLowerCase().includes(normalizedQuery) || project.description.toLowerCase().includes(normalizedQuery);
        });
    }, [projects, query, statusFilter]);

    if (loading) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center px-4">
                <div className="premium-card flex items-center gap-3 px-6 py-4 text-brand-primary shadow-sm">
                    <RefreshCw className="h-5 w-5 animate-spin" />
                    <span className="text-sm font-semibold">Загружаем finance projects...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="animate-fade-in space-y-8 px-4 py-8 md:px-6">
            <section className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                <div className="flex items-start gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-brand-beige/70 bg-white text-brand-primary shadow-sm">
                        <Gem size={28} />
                    </div>
                    <div className="space-y-2">
                        <div className="inline-flex items-center gap-2 rounded-full border border-brand-beige/70 bg-white px-3 py-1 text-xs font-bold uppercase tracking-[0.22em] text-brand-secondary shadow-sm">
                            <Wallet size={12} />
                            Finance projects
                        </div>
                        <h1 className="text-3xl font-black tracking-tight text-slate-800 md:text-4xl">Финансовые проекты</h1>
                        <p className="max-w-3xl text-sm font-medium leading-6 text-slate-500 md:text-base">
                            Рабочая очередь FinanceManager: выберите проект и откройте его полный финансовый дашборд.
                        </p>
                    </div>
                </div>

                <Link
                    to="/finance/dashboard"
                    className="inline-flex items-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-bold text-brand-primary shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lg"
                >
                    <ArrowUpRight size={18} />
                    К глобальному дашборду
                </Link>
            </section>

            {error && (
                <div className="rounded-2xl border border-red-100 bg-red-50 px-5 py-4 text-sm font-semibold text-red-600 shadow-sm">
                    {error}
                </div>
            )}

            <section className="premium-card p-5 md:p-6">
                <div className="grid gap-4 lg:grid-cols-[1fr_220px]">
                    <label className="flex items-center gap-3 rounded-2xl border border-brand-beige/60 bg-brand-light/30 px-4 py-3 text-slate-600">
                        <Search size={16} />
                        <input
                            value={query}
                            onChange={(event) => setQuery(event.target.value)}
                            placeholder="Поиск по названию или описанию"
                            className="w-full bg-transparent text-sm font-medium outline-none placeholder:text-slate-400"
                        />
                    </label>

                    <select
                        value={statusFilter}
                        onChange={(event) => setStatusFilter(event.target.value as "all" | ProjectStatus)}
                        className="rounded-2xl border border-brand-beige/60 bg-brand-light/30 px-4 py-3 text-sm font-semibold text-slate-700 outline-none"
                    >
                        <option value="all">Все статусы</option>
                        <option value="Pending">Pending</option>
                        <option value="Active">Active</option>
                        <option value="Completed">Completed</option>
                        <option value="Canceled">Canceled</option>
                    </select>
                </div>
            </section>

            <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {filteredProjects.length === 0 ? (
                    <div className="premium-card col-span-full p-8 text-center text-sm font-medium text-slate-500">
                        Проекты по выбранным фильтрам не найдены.
                    </div>
                ) : (
                    filteredProjects.map((project) => {
                        const progress = getProjectProgress(project);

                        return (
                            <article key={project.id} className="premium-card p-5">
                                <div className="flex items-start justify-between gap-3">
                                    <div>
                                        <h2 className="text-lg font-black text-slate-800">{project.title}</h2>
                                        <p className="mt-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">{project.status}</p>
                                    </div>
                                    <PaymentStatusBadge status={project.status} />
                                </div>

                                <div className="mt-4 space-y-2 text-sm text-slate-600">
                                    <div className="flex items-center justify-between gap-3">
                                        <span>Собрано</span>
                                        <span className="font-bold text-brand-primary">{formatEthAmountFlexible(project.collectedAmount)} ETH</span>
                                    </div>
                                    <div className="flex items-center justify-between gap-3">
                                        <span>Цель</span>
                                        <span className="font-bold text-slate-800">{formatEthAmountFlexible(project.targetAmount)} ETH</span>
                                    </div>
                                    <div className="flex items-center justify-between gap-3">
                                        <span>Wallet</span>
                                        <span className="max-w-40 truncate font-semibold text-slate-700" title={project.walletAddress || "Не задан"}>
                                            {project.walletAddress || "Не задан"}
                                        </span>
                                    </div>
                                </div>

                                <div className="mt-4">
                                    <div className="mb-2 flex items-center justify-between text-xs font-semibold text-slate-500">
                                        <span>Funding progress</span>
                                        <span>{progress.toFixed(0)}%</span>
                                    </div>
                                    <div className="h-2.5 overflow-hidden rounded-full bg-brand-light/60">
                                        <div
                                            className="progress-bar-fill h-full rounded-full transition-all duration-700"
                                            style={{ width: `${Math.min(progress, 100)}%` }}
                                        />
                                    </div>
                                </div>

                                <Link
                                    to={`/finance/projects/${project.id}`}
                                    className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand-primary px-4 py-3 text-sm font-bold text-white transition-all hover:bg-brand-secondary"
                                >
                                    Open Finance Dashboard
                                </Link>
                            </article>
                        );
                    })
                )}
            </section>
        </div>
    );
};

const getProjectProgress = (project: ProjectData) => {
    if (!project.targetAmount || project.targetAmount <= 0) {
        return 0;
    }

    return Math.min((project.collectedAmount / project.targetAmount) * 100, 100);
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

export default FinanceProjectsPage;
