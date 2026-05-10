import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getProjects } from "../services/projService";

import type { ProjectData } from "../models/ProjectData";

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
            <div className="container page">
                Loading...
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
        <div className="container page">

            {/* HEADER */}
            <div className="flex justify-between items-center mb-6">

                <h1 className="title">
                    Projects
                </h1>

                <div className="text-slate-300 bg-slate-800 px-4 py-2 rounded-xl">
                    Showing: {filteredProjects.length} / {projects.length}
                </div>

            </div>

            {/* SEARCH */}
            <div className="mb-6">
                <input
                    type="text"
                    placeholder="Search project by title..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full p-3 rounded-xl bg-slate-900 border border-slate-700 text-white mb-3"
                />

                {/* FILTERS TOGGLE BUTTON */}
                <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-sm text-slate-300 transition-colors"
                >
                    {showFilters ? "▼ Hide Filters" : "▶ Show Filters"}
                </button>
            </div>

            {/* FILTERS PANEL */}
            {showFilters && (
                <div className="mb-6 p-6 bg-slate-900 border border-slate-800 rounded-2xl">
                    <h3 className="text-lg font-semibold text-slate-300 mb-6 uppercase tracking-wide">
                        Filters
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">

                        {/* STATUS FILTER */}
                        <div>
                            <label className="block text-xs text-slate-400 uppercase tracking-wide mb-2">
                                Status
                            </label>
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="w-full p-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm"
                            >
                                <option value="">All Statuses</option>
                                <option value="Pending">Pending</option>
                                <option value="Active">Active</option>
                                <option value="Completed">Completed</option>
                                <option value="Canceled">Canceled</option>
                            </select>
                        </div>

                        {/* TARGET AMOUNT MIN */}
                        <div>
                            <label className="block text-xs text-slate-400 uppercase tracking-wide mb-2">
                                Target Min ($)
                            </label>
                            <input
                                type="number"
                                min="0"
                                placeholder="0"
                                value={targetMinFilter}
                                onChange={(e) => setTargetMinFilter(e.target.value === "" ? "" : parseFloat(e.target.value))}
                                className="w-full p-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm"
                            />
                        </div>

                        {/* TARGET AMOUNT MAX */}
                        <div>
                            <label className="block text-xs text-slate-400 uppercase tracking-wide mb-2">
                                Target Max ($)
                            </label>
                            <input
                                type="number"
                                min="0"
                                placeholder="∞"
                                value={targetMaxFilter}
                                onChange={(e) => setTargetMaxFilter(e.target.value === "" ? "" : parseFloat(e.target.value))}
                                className="w-full p-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm"
                            />
                        </div>

                        {/* COLLECTED AMOUNT MIN */}
                        <div>
                            <label className="block text-xs text-slate-400 uppercase tracking-wide mb-2">
                                Collected Min ($)
                            </label>
                            <input
                                type="number"
                                min="0"
                                placeholder="0"
                                value={collectedMinFilter}
                                onChange={(e) => setCollectedMinFilter(e.target.value === "" ? "" : parseFloat(e.target.value))}
                                className="w-full p-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm"
                            />
                        </div>

                        {/* COLLECTED AMOUNT MAX */}
                        <div>
                            <label className="block text-xs text-slate-400 uppercase tracking-wide mb-2">
                                Collected Max ($)
                            </label>
                            <input
                                type="number"
                                min="0"
                                placeholder="∞"
                                value={collectedMaxFilter}
                                onChange={(e) => setCollectedMaxFilter(e.target.value === "" ? "" : parseFloat(e.target.value))}
                                className="w-full p-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm"
                            />
                        </div>

                    </div>

                    {/* RESET FILTERS BUTTON */}
                    <button
                        onClick={() => {
                            setStatusFilter("");
                            setTargetMinFilter("");
                            setTargetMaxFilter("");
                            setCollectedMinFilter("");
                            setCollectedMaxFilter("");
                        }}
                        className="mt-4 px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-xl text-sm text-slate-300 transition-colors"
                    >
                        Reset Filters
                    </button>
                </div>
            )}

            {/* GRID */}
            {filteredProjects.length === 0 ? (
                <div className="text-center py-12">
                    <p className="text-slate-400 text-lg">
                        No projects found matching your filters
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                {filteredProjects.map((p) => {

                    const progress =
                        (p.collectedAmount / p.targetAmount) * 100;

                    return (
                        <Link
                            to={`/projects/${p.id}`}
                            key={p.id}
                            className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col h-full hover:border-blue-600 hover:shadow-blue-600/20 transition-all duration-200 cursor-pointer"
                        >

                            {/* TOP SECTION - TITLE & STATUS */}
                            <div className="flex justify-between items-start mb-4">
                                <h2 className="text-xl font-bold flex-1 pr-2">
                                    {p.title}
                                </h2>
                                <span className={`px-3 py-1 text-xs rounded font-medium whitespace-nowrap ${
                                    p.status === "Active" ? "bg-green-900/30 text-green-400" :
                                    p.status === "Pending" ? "bg-yellow-900/30 text-yellow-400" :
                                    p.status === "Completed" ? "bg-blue-900/30 text-blue-400" :
                                    "bg-red-900/30 text-red-400"
                                }`}>
                                    {p.status}
                                </span>
                            </div>

                            {/* DESCRIPTION - GROWS TO FILL SPACE */}
                            <p className="text-slate-400 text-sm mb-4 wrap-break-word whitespace-normal line-clamp-4 grow">
                                {p.description}
                            </p>

                            {/* BOTTOM SECTION - FIXED TO BOTTOM */}
                            <div className="mt-auto pt-4 border-t border-slate-700 space-y-3">

                                {/* AMOUNTS - 2 COLUMNS */}
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="text-sm">
                                        <div className="text-slate-500 text-xs uppercase tracking-wide">
                                            Target
                                        </div>
                                        <div className="text-slate-200 font-semibold text-lg">
                                            ${p.targetAmount.toLocaleString()}
                                        </div>
                                    </div>
                                    <div className="text-sm">
                                        <div className="text-slate-500 text-xs uppercase tracking-wide">
                                            Collected
                                        </div>
                                        <div className="text-blue-400 font-semibold text-lg">
                                            ${p.collectedAmount.toLocaleString()}
                                        </div>
                                    </div>
                                </div>

                                {/* PROGRESS BAR WITH PERCENTAGE */}
                                <div>
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-xs text-slate-400">Progress</span>
                                        <span className="text-xs font-semibold text-blue-400">
                                            {Math.min(progress, 100).toFixed(1)}%
                                        </span>
                                    </div>
                                    <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                                        <div
                                            className="bg-linear-to-r from-blue-500 to-blue-400 h-2 rounded-full transition-all duration-300"
                                            style={{
                                                width: `${Math.min(progress, 100)}%`,
                                            }}
                                        />
                                    </div>
                                </div>

                                {/* DATE */}
                                <div className="text-xs text-slate-500 pt-2 border-t border-slate-700">
                                    Created: {new Date(p.createdAt).toLocaleDateString()}
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