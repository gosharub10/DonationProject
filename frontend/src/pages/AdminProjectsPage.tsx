import { useEffect, useState } from "react";
import {
    Search,
    FolderKanban,
    Plus,
    Edit2,
    Trash2,
    X,
    Save,
    Clock3,
    CircleCheck,
    CircleX,
    ShieldAlert,
} from "lucide-react";
import { getProjects, createProject, updateProject, deleteProject } from "../services/projService";
import type { ProjectData } from "../models/ProjectData";
import type { CreateProjectCommand } from "../models/CreateProjectCommand";
import type { UpdateProjectCommand } from "../models/UpdateProjectCommand";
import ImageUploadPanel from "../components/ImageUploadPanel";

type ProjectStatus = "Pending" | "Active" | "Completed" | "Canceled";

const statusConfig: Record<ProjectStatus, { label: string; className: string; icon: typeof Clock3 }> = {
    Pending: {
        label: "Ожидает",
        className: "bg-brand-beige/40 text-brand-primary border border-brand-beige/80",
        icon: Clock3,
    },
    Active: {
        label: "Активен",
        className: "bg-brand-primary/10 text-brand-primary border border-brand-primary/20",
        icon: CircleCheck,
    },
    Completed: {
        label: "Завершён",
        className: "bg-brand-accent/10 text-brand-secondary border border-brand-accent/20",
        icon: CircleCheck,
    },
    Canceled: {
        label: "Отменён",
        className: "bg-red-50 text-red-600 border border-red-100",
        icon: CircleX,
    },
};

const getErrorMessage = (error: unknown, fallback: string) => {
    if (typeof error === "object" && error !== null && "response" in error) {
        const response = error as { response?: { data?: { message?: string } } };
        return response.response?.data?.message || fallback;
    }

    return fallback;
};

const AdminProjectsPage = () => {
    const [projects, setProjects] = useState<ProjectData[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [editProject, setEditProject] = useState<UpdateProjectCommand | null>(null);
    const [editProjectImages, setEditProjectImages] = useState<string[]>([]);
    const [createMode, setCreateMode] = useState(false);
    const [newProject, setNewProject] = useState<CreateProjectCommand>({
        title: "",
        description: "",
    });
    const [error, setError] = useState("");

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            setLoading(true);
            const data = await getProjects();
            setProjects(data);
            setError("");
        } catch (error: unknown) {
            setError(getErrorMessage(error, "Не удалось загрузить проекты"));
        } finally {
            setLoading(false);
        }
    };

    const resetCreateForm = () => {
        setNewProject({
            title: "",
            description: "",
        });
    };

    const handleCreate = async () => {
        try {
            if (!newProject.title || !newProject.description) {
                setError("Заполните все поля корректно");
                return;
            }

            await createProject(newProject);
            setCreateMode(false);
            resetCreateForm();
            setError("");
            fetchProjects();
        } catch (error: unknown) {
            setError(getErrorMessage(error, "Не удалось создать проект"));
        }
    };

    const handleUpdate = async () => {
        try {
            if (!editProject) return;

            if (editProject.targetAmount !== undefined && editProject.targetAmount <= 0) {
                setError("Целевая сумма должна быть больше 0");
                return;
            }

            if (editProject.walletAddress && !editProject.walletAddress.startsWith("0x")) {
                setError("Адрес кошелька должен начинаться с '0x'");
                return;
            }

            await updateProject(editProject);
            setEditProject(null);
            setEditProjectImages([]);
            setError("");
            fetchProjects();
        } catch (error: unknown) {
            setError(getErrorMessage(error, "Не удалось обновить проект"));
        }
    };

    const handleDelete = async (id: string) => {
        try {
            if (!confirm("Удалить этот проект? Это действие нельзя отменить.")) return;
            await deleteProject(id);
            setProjects((prev) => prev.filter((project) => project.id !== id));
            setError("");
        } catch (error: unknown) {
            setError(getErrorMessage(error, "Не удалось удалить проект"));
        }
    };

    if (loading) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center p-10">
                <div className="flex items-center gap-3 rounded-full border border-brand-beige/70 bg-white px-5 py-3 text-brand-primary shadow-sm">
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-brand-primary/20 border-t-brand-primary" />
                    <span className="text-sm font-semibold">Загружаем проекты...</span>
                </div>
            </div>
        );
    }

    const filteredProjects = projects.filter((project) =>
        project.title.toLowerCase().includes(search.toLowerCase())
    );

    const totalProjects = projects.length;
    const activeProjects = projects.filter((project) => project.status === "Active").length;
    const pendingProjects = projects.filter((project) => project.status === "Pending").length;
    const completedProjects = projects.filter((project) => project.status === "Completed").length;

    return (
        <div className="container mx-auto max-w-7xl px-4 py-8 md:px-6 animate-fade-in">
            <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                <div className="flex items-start gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-brand-beige/70 bg-white text-brand-primary shadow-sm">
                        <FolderKanban size={28} />
                    </div>
                    <div className="space-y-2">
                        <div className="inline-flex items-center gap-2 rounded-full border border-brand-beige/70 bg-white px-3 py-1 text-xs font-bold uppercase tracking-[0.22em] text-brand-secondary shadow-sm">
                            <ShieldAlert size={12} />
                            Админ-панель
                        </div>
                        <h1 className="text-3xl font-black tracking-tight text-slate-800 md:text-4xl">
                            Управление проектами
                        </h1>
                        <p className="max-w-2xl text-sm font-medium leading-6 text-slate-500 md:text-base">
                            Создавайте, редактируйте и отслеживайте проекты в едином premium-интерфейсе.
                        </p>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <div className="glass rounded-2xl px-4 py-3 text-sm font-semibold text-slate-600 shadow-sm">
                        Всего проектов: <span className="text-brand-primary">{totalProjects}</span>
                    </div>
                    <button
                        onClick={() => setCreateMode(true)}
                        className="inline-flex items-center gap-2 rounded-2xl bg-brand-primary px-5 py-3 text-sm font-bold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-brand-secondary hover:shadow-lg active:scale-95"
                    >
                        <Plus size={18} />
                        Создать проект
                    </button>
                </div>
            </div>

            <div className="mb-8 grid gap-4 md:grid-cols-3">
                <div className="premium-card p-5">
                    <div className="text-xs font-bold uppercase tracking-[0.24em] text-slate-400">Активные</div>
                    <div className="mt-3 text-3xl font-black text-brand-primary">{activeProjects}</div>
                    <p className="mt-2 text-sm font-medium text-slate-500">Проекты в статусе сбора средств</p>
                </div>
                <div className="premium-card p-5">
                    <div className="text-xs font-bold uppercase tracking-[0.24em] text-slate-400">В ожидании</div>
                    <div className="mt-3 text-3xl font-black text-brand-secondary">{pendingProjects}</div>
                    <p className="mt-2 text-sm font-medium text-slate-500">Черновики и проекты на проверке</p>
                </div>
                <div className="premium-card p-5">
                    <div className="text-xs font-bold uppercase tracking-[0.24em] text-slate-400">Завершены</div>
                    <div className="mt-3 text-3xl font-black text-brand-accent">{completedProjects}</div>
                    <p className="mt-2 text-sm font-medium text-slate-500">Успешно закрытые кампании</p>
                </div>
            </div>

            {error && (
                <div className="mb-6 rounded-2xl border border-red-100 bg-red-50 px-5 py-4 text-sm font-semibold text-red-600 shadow-sm">
                    {error}
                </div>
            )}

            <div className="premium-card mb-8 p-5 md:p-6">
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                        type="text"
                        placeholder="Поиск по названию проекта..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full rounded-2xl border border-brand-beige/60 bg-brand-light/70 py-4 pl-12 pr-4 text-slate-800 outline-none transition-all placeholder:text-slate-400 focus:border-brand-primary focus:bg-white focus:ring-4 focus:ring-brand-primary/10"
                    />
                </div>
            </div>

            <div className="premium-card overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-275 w-full border-collapse text-left">
                        <thead className="border-b border-brand-beige/60 bg-brand-light/60">
                            <tr>
                                <th className="p-4 text-xs font-bold uppercase tracking-[0.24em] text-slate-500">Название</th>
                                <th className="p-4 text-xs font-bold uppercase tracking-[0.24em] text-slate-500">Описание</th>
                                <th className="p-4 text-xs font-bold uppercase tracking-[0.24em] text-slate-500">Цель</th>
                                <th className="p-4 text-xs font-bold uppercase tracking-[0.24em] text-slate-500">Статус</th>
                                <th className="p-4 text-xs font-bold uppercase tracking-[0.24em] text-slate-500">Создан</th>
                                <th className="p-4 text-xs font-bold uppercase tracking-[0.24em] text-slate-500 text-right">Действия</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-brand-beige/50">
                            {filteredProjects.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="p-10 text-center text-sm font-medium text-slate-500">
                                        Проекты не найдены
                                    </td>
                                </tr>
                            ) : (
                                filteredProjects.map((project) => {
                                    const statusInfo = statusConfig[project.status as ProjectStatus] ?? statusConfig.Pending;
                                    const StatusIcon = statusInfo.icon;

                                    return (
                                        <tr key={project.id} className="group transition-colors hover:bg-brand-light/50">
                                            <td className="p-4 align-top">
                                                <div className="max-w-57.5">
                                                    <div className="font-bold text-slate-800">{project.title}</div>
                                                    <div className="mt-1 text-xs font-medium uppercase tracking-[0.18em] text-slate-400">
                                                        {project.walletAddress?.slice(0, 10)}...{project.walletAddress?.slice(-6)}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-4 align-top text-sm font-medium leading-6 text-slate-600">
                                                <div className="max-w-90 overflow-hidden text-ellipsis whitespace-nowrap">
                                                    {project.description}
                                                </div>
                                            </td>
                                            <td className="p-4 align-top">
                                                <div className="text-sm font-bold text-brand-primary">
                                                    {project.targetAmount.toLocaleString("ru-RU", {
                                                        maximumFractionDigits: 4,
                                                    })} ETH
                                                </div>
                                            </td>
                                            <td className="p-4 align-top">
                                                <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${statusInfo.className}`}>
                                                    <StatusIcon size={12} />
                                                    {statusInfo.label}
                                                </span>
                                            </td>
                                            <td className="p-4 align-top text-sm font-medium text-slate-500">
                                                {new Date(project.createdAt).toLocaleDateString("ru-RU", {
                                                    day: "2-digit",
                                                    month: "2-digit",
                                                    year: "numeric",
                                                })}
                                            </td>
                                            <td className="p-4 align-top">
                                                <div className="flex justify-end gap-2">
                                                    <button
                                                        onClick={() => {
                                                            setEditProject({
                                                                id: project.id,
                                                                title: project.title,
                                                                description: project.description,
                                                                targetAmount: project.targetAmount,
                                                                status: project.status,
                                                                walletAddress: project.walletAddress,
                                                            });
                                                            setEditProjectImages(project.photoUrls || []);
                                                            setError("");
                                                        }}
                                                        className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-brand-beige/70 bg-white text-brand-primary transition-all hover:-translate-y-0.5 hover:border-brand-primary hover:bg-brand-primary hover:text-white hover:shadow-sm"
                                                        title="Редактировать"
                                                    >
                                                        <Edit2 size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(project.id)}
                                                        className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-red-100 bg-white text-red-500 transition-all hover:-translate-y-0.5 hover:border-red-200 hover:bg-red-50 hover:shadow-sm"
                                                        title="Удалить"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {createMode && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-brand-primary/35 px-4 backdrop-blur-sm animate-fade-in">
                    <div className="max-h-[90vh] w-full max-w-2xl overflow-hidden rounded-3xl border border-white/40 bg-white shadow-2xl">
                        <div className="flex items-start justify-between border-b border-brand-beige/50 bg-brand-light/55 p-6">
                            <div>
                                <h2 className="text-xl font-black text-slate-800">Новый проект</h2>
                                <p className="mt-1 text-sm font-medium text-slate-500">Заполните основные параметры кампании</p>
                            </div>
                            <button onClick={() => setCreateMode(false)} className="rounded-xl p-2 text-slate-400 transition-colors hover:bg-white hover:text-slate-600">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="max-h-[calc(90vh-158px)] space-y-5 overflow-y-auto p-6">
                            <div className="space-y-2">
                                <label className="ml-1 text-sm font-bold text-slate-700">Название</label>
                                <input
                                    type="text"
                                    placeholder="Введите название проекта"
                                    value={newProject.title}
                                    onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                                    className="w-full rounded-2xl border border-brand-beige/60 bg-brand-light/70 px-4 py-4 text-slate-800 outline-none transition-all placeholder:text-slate-400 focus:border-brand-primary focus:bg-white focus:ring-4 focus:ring-brand-primary/10"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="ml-1 text-sm font-bold text-slate-700">Описание</label>
                                <textarea
                                    placeholder="Кратко опишите проект"
                                    value={newProject.description}
                                    onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                                    className="h-32 w-full resize-none rounded-2xl border border-brand-beige/60 bg-brand-light/70 px-4 py-4 text-slate-800 outline-none transition-all placeholder:text-slate-400 focus:border-brand-primary focus:bg-white focus:ring-4 focus:ring-brand-primary/10"
                                />
                            </div>

                            <div className="rounded-2xl border border-brand-beige/60 bg-brand-light/40 px-4 py-4 text-sm font-medium text-slate-500">
                                Финансовые поля задаются FinanceManager после создания проекта.
                            </div>
                        </div>

                        <div className="flex flex-col gap-3 border-t border-brand-beige/50 bg-brand-light/55 p-6 md:flex-row">
                            <button
                                onClick={handleCreate}
                                className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl bg-brand-primary px-5 py-3.5 text-sm font-bold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-brand-secondary hover:shadow-lg active:scale-95"
                            >
                                <Save size={18} />
                                Создать
                            </button>
                            <button
                                onClick={() => {
                                    setCreateMode(false);
                                    resetCreateForm();
                                    setError("");
                                }}
                                className="inline-flex flex-1 items-center justify-center rounded-2xl border border-brand-beige/70 bg-white px-5 py-3.5 text-sm font-bold text-slate-700 transition-all hover:-translate-y-0.5 hover:bg-brand-light hover:shadow-sm active:scale-95"
                            >
                                Отмена
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {editProject && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-brand-primary/35 px-4 backdrop-blur-sm animate-fade-in">
                    <div className="max-h-[90vh] w-full max-w-2xl overflow-hidden rounded-3xl border border-white/40 bg-white shadow-2xl">
                        <div className="flex items-start justify-between border-b border-brand-beige/50 bg-brand-light/55 p-6">
                            <div>
                                <h2 className="text-xl font-black text-slate-800">Редактирование проекта</h2>
                                <p className="mt-1 text-sm font-medium text-slate-500">Обновите данные и изображения кампании</p>
                            </div>
                            <button
                                onClick={() => {
                                    setEditProject(null);
                                    setEditProjectImages([]);
                                }}
                                className="rounded-xl p-2 text-slate-400 transition-colors hover:bg-white hover:text-slate-600"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="max-h-[calc(90vh-158px)] space-y-5 overflow-y-auto p-6">
                            <div className="space-y-2">
                                <label className="ml-1 text-sm font-bold text-slate-700">Название</label>
                                <input
                                    type="text"
                                    placeholder="Введите название проекта"
                                    value={editProject.title || ""}
                                    onChange={(e) => setEditProject({ ...editProject, title: e.target.value })}
                                    className="w-full rounded-2xl border border-brand-beige/60 bg-brand-light/70 px-4 py-4 text-slate-800 outline-none transition-all placeholder:text-slate-400 focus:border-brand-primary focus:bg-white focus:ring-4 focus:ring-brand-primary/10"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="ml-1 text-sm font-bold text-slate-700">Описание</label>
                                <textarea
                                    placeholder="Опишите изменения"
                                    value={editProject.description || ""}
                                    onChange={(e) => setEditProject({ ...editProject, description: e.target.value })}
                                    className="h-32 w-full resize-none rounded-2xl border border-brand-beige/60 bg-brand-light/70 px-4 py-4 text-slate-800 outline-none transition-all placeholder:text-slate-400 focus:border-brand-primary focus:bg-white focus:ring-4 focus:ring-brand-primary/10"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="ml-1 text-sm font-bold text-slate-700">Статус</label>
                                <select
                                    value={editProject.status || "Pending"}
                                    onChange={(e) => setEditProject({ ...editProject, status: e.target.value as ProjectStatus })}
                                    className="w-full appearance-none rounded-2xl border border-brand-beige/60 bg-brand-light/70 px-4 py-4 text-slate-800 outline-none transition-all focus:border-brand-primary focus:bg-white focus:ring-4 focus:ring-brand-primary/10"
                                >
                                    <option value="Pending">Ожидает</option>
                                    <option value="Active">Активен</option>
                                    <option value="Completed">Завершён</option>
                                    <option value="Canceled">Отменён</option>
                                </select>
                            </div>

                            <div className="pt-1">
                                <ImageUploadPanel
                                    projectId={editProject.id}
                                    currentImages={editProjectImages}
                                    onImagesChange={setEditProjectImages}
                                />
                            </div>
                        </div>

                        <div className="flex flex-col gap-3 border-t border-brand-beige/50 bg-brand-light/55 p-6 md:flex-row">
                            <button
                                onClick={handleUpdate}
                                className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl bg-brand-primary px-5 py-3.5 text-sm font-bold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-brand-secondary hover:shadow-lg active:scale-95"
                            >
                                <Save size={18} />
                                Сохранить
                            </button>
                            <button
                                onClick={() => {
                                    setEditProject(null);
                                    setEditProjectImages([]);
                                }}
                                className="inline-flex flex-1 items-center justify-center rounded-2xl border border-brand-beige/70 bg-white px-5 py-3.5 text-sm font-bold text-slate-700 transition-all hover:-translate-y-0.5 hover:bg-brand-light hover:shadow-sm active:scale-95"
                            >
                                Отмена
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminProjectsPage;
