import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getProjects } from "../services/projService";

import type { ProjectData } from "../models/ProjectData";

// Get placeholder image based on project ID
const getPlaceholderImage = (projectId: string) => {
    const colors = ["1e3a8a", "0f766e", "7c3aed", "be123c", "0369a1"];
    const colorIndex = projectId.charCodeAt(0) % colors.length;
    const color = colors[colorIndex];
    return `https://via.placeholder.com/500x300/${color}/ffffff?text=Project+Image`;
};

const ProjectsPage = () => {
    const [projects, setProjects] = useState<ProjectData[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [showFilters, setShowFilters] = useState(false);
    
    // 🔧 FILTERS
    const [statusFilter, setStatusFilter] = useState<string>("");
    const [targetMinFilter, setTargetMinFilter] = useState<number | "">("");
    const [targetMaxFilter, setTargetMaxFilter] = useState<number | "">("");
    const [collectedMinFilter, setCollectedMinFilter] = useState<number | "">("");
    const [collectedMaxFilter, setCollectedMaxFilter] = useState<number | "">("");

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            const data = await getProjects();
            setProjects(data);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="w-full">
                <div className="flex justify-center p-20">
                  <div className="animate-pulse flex items-center gap-2 text-brand-primary">
                    <span className="w-3 h-3 bg-brand-primary rounded-full animate-bounce" />
                    <span className="w-3 h-3 bg-brand-primary rounded-full animate-bounce [animation-delay:0.2s]" />
                    <span className="w-3 h-3 bg-brand-primary rounded-full animate-bounce [animation-delay:0.4s]" />
                  </div>
                </div>
            </div>
        );
    }

    // 🔎 SEARCH & FILTERS
    const filteredProjects = projects.filter((p) => {
        // Search by title
        if (search && !p.title.toLowerCase().includes(search.toLowerCase())) {
            return false;
        }

        // Filter by status
        if (statusFilter && p.status !== statusFilter) {
            return false;
        }

        // Filter by target amount
        if (targetMinFilter !== "" && p.targetAmount < targetMinFilter) {
            return false;
        }
        if (targetMaxFilter !== "" && p.targetAmount > targetMaxFilter) {
            return false;
        }

        // Filter by collected amount
        if (collectedMinFilter !== "" && p.collectedAmount < collectedMinFilter) {
            return false;
        }
        if (collectedMaxFilter !== "" && p.collectedAmount > collectedMaxFilter) {
            return false;
        }

        return true;
    });

    return (
        <div className="w-full">

            {/* HEADER */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">

                <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
                    Проекты
                </h1>

                <div className="text-slate-600 bg-white border border-brand-beige/50 px-4 py-2 rounded-full font-medium shadow-sm text-sm">
                    Показано: {filteredProjects.length} / {projects.length}
                </div>

            </div>

            {/* SEARCH */}
            <div className="mb-6 flex gap-3">
                <input
                    type="text"
                    placeholder="Поиск по названию..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full p-4 rounded-xl bg-white border border-brand-beige text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all shadow-sm"
                />

                {/* FILTERS TOGGLE BUTTON */}
                <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="px-6 py-4 bg-white border border-brand-beige hover:border-brand-primary hover:text-brand-primary rounded-xl text-slate-600 font-medium transition-all shadow-sm whitespace-nowrap"
                >
                    {showFilters ? "Скрыть фильтры" : "Фильтры"}
                </button>
            </div>

            {/* FILTERS PANEL */}
            {showFilters && (
                <div className="mb-8 p-8 bg-white border border-brand-beige rounded-2xl shadow-sm animate-fade-in">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-bold text-slate-900">
                            Фильтрация
                        </h3>
                        <button
                            onClick={() => {
                                setStatusFilter("");
                                setTargetMinFilter("");
                                setTargetMaxFilter("");
                                setCollectedMinFilter("");
                                setCollectedMaxFilter("");
                            }}
                            className="text-sm text-brand-secondary hover:text-brand-accent font-medium transition-colors"
                        >
                            Сбросить
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">

                        {/* STATUS FILTER */}
                        <div>
                            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
                                Статус
                            </label>
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="w-full p-3 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
                            >
                                <option value="">Все статусы</option>
                                <option value="Pending">В ожидании</option>
                                <option value="Active">Активные</option>
                                <option value="Completed">Завершенные</option>
                                <option value="Canceled">Отмененные</option>
                            </select>
                        </div>

                        {/* TARGET AMOUNT MIN */}
                        <div>
                            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
                                Цель от (ETH)
                            </label>
                            <input
                                type="number"
                                min="0"
                                placeholder="0"
                                value={targetMinFilter}
                                onChange={(e) => setTargetMinFilter(e.target.value === "" ? "" : parseFloat(e.target.value))}
                                className="w-full p-3 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
                            />
                        </div>

                        {/* TARGET AMOUNT MAX */}
                        <div>
                            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
                                Цель до (ETH)
                            </label>
                            <input
                                type="number"
                                min="0"
                                placeholder="∞"
                                value={targetMaxFilter}
                                onChange={(e) => setTargetMaxFilter(e.target.value === "" ? "" : parseFloat(e.target.value))}
                                className="w-full p-3 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
                            />
                        </div>

                        {/* COLLECTED AMOUNT MIN */}
                        <div>
                            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
                                Собрано от (ETH)
                            </label>
                            <input
                                type="number"
                                min="0"
                                placeholder="0"
                                value={collectedMinFilter}
                                onChange={(e) => setCollectedMinFilter(e.target.value === "" ? "" : parseFloat(e.target.value))}
                                className="w-full p-3 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
                            />
                        </div>

                        {/* COLLECTED AMOUNT MAX */}
                        <div>
                            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
                                Собрано до (ETH)
                            </label>
                            <input
                                type="number"
                                min="0"
                                placeholder="∞"
                                value={collectedMaxFilter}
                                onChange={(e) => setCollectedMaxFilter(e.target.value === "" ? "" : parseFloat(e.target.value))}
                                className="w-full p-3 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
                            />
                        </div>

                    </div>
                </div>
            )}

            {/* GRID */}
            {filteredProjects.length === 0 ? (
                <div className="text-center py-20 premium-card bg-white">
                    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                    </div>
                    <p className="text-slate-900 font-bold text-lg mb-1">
                        Проекты не найдены
                    </p>
                    <p className="text-slate-500 text-sm">
                        Попробуйте изменить параметры фильтрации
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                {filteredProjects.map((p) => {

                    const progress =
                        (p.collectedAmount / p.targetAmount) * 100;

                    // Get first image or placeholder
                    const projectImage = p.photoUrls && p.photoUrls.length > 0 
                        ? p.photoUrls[0] 
                        : getPlaceholderImage(p.id);

                    return (
                        <Link
                            to={`/projects/${p.id}`}
                            key={p.id}
                            className="premium-card group overflow-hidden flex flex-col h-full cursor-pointer"
                        >

                            {/* IMAGE SECTION */}
                            <div className="relative w-full h-52 overflow-hidden bg-slate-100">
                                <img
                                    src={projectImage}
                                    alt={p.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                                {/* Status badge overlay */}
                                <div className="absolute top-4 right-4">
                                    <span className={`px-3 py-1.5 text-[10px] uppercase tracking-wider font-bold rounded-full shadow-sm ${
                                        p.status === "Active" ? "bg-green-100 text-green-700" :
                                        p.status === "Pending" ? "bg-amber-100 text-amber-700" :
                                        p.status === "Completed" ? "bg-brand-primary text-white" :
                                        "bg-red-100 text-red-700"
                                    }`}>
                                        {p.status === "Pending" ? "В ожидании" :
                                         p.status === "Active" ? "Активен" :
                                         p.status === "Completed" ? "Завершен" : "Отменен"}
                                    </span>
                                </div>
                            </div>

                            {/* CONTENT SECTION */}
                            <div className="p-6 flex flex-col flex-1">

                                {/* TITLE */}
                                <h2 className="text-xl font-bold text-slate-900 mb-3 line-clamp-2 group-hover:text-brand-primary transition-colors">
                                    {p.title}
                                </h2>

                                {/* DESCRIPTION - GROWS TO FILL SPACE */}
                                <p className="text-slate-600 text-sm mb-6 wrap-break-word whitespace-normal line-clamp-3 flex-1">
                                    {p.description}
                                </p>

                                {/* BOTTOM SECTION - FIXED TO BOTTOM */}
                                <div className="mt-auto space-y-4">
                                    <div className="flex justify-between items-end mb-2">
                                        <div className="text-sm">
                                            <div className="text-slate-500 text-xs font-semibold uppercase tracking-wide">
                                                Собрано (ETH)
                                            </div>
                                            <div className="text-brand-primary font-black text-lg">
                                                {p.collectedAmount.toLocaleString()} / {p.targetAmount.toLocaleString()}
                                            </div>
                                        </div>
                                        <div className="text-sm font-bold text-brand-secondary">
                                            {Math.min(progress, 100).toFixed(1)}%
                                        </div>
                                    </div>

                                    {/* PROGRESS BAR */}
                                    <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                                        <div
                                            className="progress-bar-fill h-full rounded-full transition-all duration-1000 ease-out"
                                            style={{
                                                width: `${Math.min(progress, 100)}%`,
                                            }}
                                        />
                                    </div>

                                    <div className="flex justify-between items-center text-xs text-slate-400 font-medium pt-3 mt-4 border-t border-slate-100">
                                        <span>Создан {new Date(p.createdAt).toLocaleDateString()}</span>
                                        <span className="text-brand-primary group-hover:text-brand-accent transition-colors flex items-center gap-1">
                                            Подробнее <span>→</span>
                                        </span>
                                    </div>
                                </div>
                            </div>

                        </Link>
                    );
                })}

                </div>
            )}

        </div>
    );
};

export default ProjectsPage;