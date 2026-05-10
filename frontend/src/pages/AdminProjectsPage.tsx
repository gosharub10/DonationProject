import { useEffect, useState } from "react";
import {
    getProjects,
    createProject,
    updateProject,
    deleteProject,
} from "../services/projService";
import type { ProjectData } from "../models/ProjectData";
import type { CreateProjectCommand } from "../models/CreateProjectCommand";
import type { UpdateProjectCommand } from "../models/UpdateProjectCommand";

const AdminProjectsPage = () => {
    const [projects, setProjects] = useState<ProjectData[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [editProject, setEditProject] = useState<UpdateProjectCommand | null>(null);
    const [createMode, setCreateMode] = useState(false);
    const [newProject, setNewProject] = useState<CreateProjectCommand>({
        title: "",
        description: "",
        targetAmount: 0,
        walletAddress: "",
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
        } catch (err: any) {
            setError(err?.response?.data?.message || "Failed to load projects");
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async () => {
        try {
            if (!newProject.title || !newProject.description || newProject.targetAmount <= 0 || !newProject.walletAddress) {
                setError("Please fill all fields correctly");
                return;
            }

            if (!newProject.walletAddress.startsWith("0x")) {
                setError("Wallet address must start with '0x'");
                return;
            }

            await createProject(newProject);
            setCreateMode(false);
            setNewProject({
                title: "",
                description: "",
                targetAmount: 0,
                walletAddress: "",
            });
            setError("");
            fetchProjects();
        } catch (err: any) {
            setError(err?.response?.data?.message || "Failed to create project");
        }
    };

    const handleUpdate = async () => {
        try {
            if (!editProject) return;

            if (editProject.title && editProject.targetAmount && editProject.targetAmount <= 0) {
                setError("Target amount must be greater than 0");
                return;
            }

            if (editProject.walletAddress && !editProject.walletAddress.startsWith("0x")) {
                setError("Wallet address must start with '0x'");
                return;
            }

            await updateProject(editProject);
            setEditProject(null);
            setError("");
            fetchProjects();
        } catch (err: any) {
            setError(err?.response?.data?.message || "Failed to update project");
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await deleteProject(id);
            setProjects((prev) => prev.filter((p) => p.id !== id));
            setError("");
        } catch (err: any) {
            setError(err?.response?.data?.message || "Failed to delete project");
        }
    };

    if (loading) {
        return (
            <div className="container page">
                Loading...
            </div>
        );
    }

    // 🔎 FILTER PROJECTS (search by title)
    const filteredProjects = projects.filter((p) =>
        p.title.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="container page">

            {/* HEADER */}
            <div className="flex justify-between items-center mb-6">

                <h1 className="title">
                    Projects Management
                </h1>

                {/* COUNT */}
                <div className="flex gap-3">
                    <div className="text-slate-300 bg-slate-800 px-4 py-2 rounded-xl">
                        Total: {projects.length}
                    </div>
                    <button
                        onClick={() => setCreateMode(true)}
                        className="bg-green-600 hover:bg-green-700 transition-colors duration-200 px-4 py-2 rounded-xl text-white font-medium"
                    >
                        + Create Project
                    </button>
                </div>

            </div>

            {/* ERROR MESSAGE */}
            {error && (
                <div className="mb-6 p-4 bg-red-900/20 border border-red-600 text-red-400 rounded-xl">
                    {error}
                </div>
            )}

            {/* SEARCH */}
            <div className="mb-6">
                <input
                    type="text"
                    placeholder="Search by title..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full p-3 rounded-xl bg-slate-900 border border-slate-700 text-white"
                />
            </div>

            {/* TABLE */}
            <div className="overflow-x-auto">

                <table className="w-full text-left bg-slate-900 rounded-xl overflow-hidden">

                    <thead className="bg-slate-800 text-slate-300">
                    <tr>
                        <th className="p-3">Title</th>
                        <th className="p-3">Description</th>
                        <th className="p-3">Target Amount</th>
                        <th className="p-3">Status</th>
                        <th className="p-3">Created</th>
                        <th className="p-3"></th>
                    </tr>
                    </thead>

                    <tbody>
                    {filteredProjects.map((p) => (
                        <tr
                            key={p.id}
                            className="border-t border-slate-800"
                        >
                            <td className="p-3 font-medium">
                                {p.title}
                            </td>

                            <td className="p-3 text-slate-400 truncate max-w-xs">
                                {p.description}
                            </td>

                            <td className="p-3">
                                ${p.targetAmount.toLocaleString()}
                            </td>

                            <td className="p-3">
                                <span className={`px-2 py-1 rounded text-sm font-medium ${
                                    p.status === "Active" ? "bg-green-900/30 text-green-400" :
                                    p.status === "Pending" ? "bg-yellow-900/30 text-yellow-400" :
                                    p.status === "Completed" ? "bg-blue-900/30 text-blue-400" :
                                    "bg-red-900/30 text-red-400"
                                }`}>
                                    {p.status}
                                </span>
                            </td>

                            <td className="p-3 text-slate-400">
                                {new Date(p.createdAt).toLocaleDateString()}
                            </td>

                            <td className="p-3 flex gap-2">

                                <button
                                    onClick={() =>
                                        setEditProject({
                                            id: p.id,
                                            title: p.title,
                                            description: p.description,
                                            targetAmount: p.targetAmount,
                                            status: p.status,
                                            walletAddress: p.walletAddress,
                                        })
                                    }
                                    className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-sm transition-colors"
                                >
                                    Edit
                                </button>

                                <button
                                    onClick={() =>
                                        handleDelete(p.id)
                                    }
                                    className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded text-sm transition-colors"
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            {/* CREATE PROJECT MODAL */}
            {createMode && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
                    <div className="bg-slate-900 p-6 rounded-xl w-96 space-y-4 border border-slate-800">
                        <h2 className="text-xl font-bold">Create New Project</h2>

                        <input
                            type="text"
                            placeholder="Project title"
                            value={newProject.title}
                            onChange={(e) =>
                                setNewProject({ ...newProject, title: e.target.value })
                            }
                            className="w-full p-2 rounded bg-slate-800 border border-slate-700 text-white"
                        />

                        <textarea
                            placeholder="Project description"
                            value={newProject.description}
                            onChange={(e) =>
                                setNewProject({ ...newProject, description: e.target.value })
                            }
                            className="w-full p-2 rounded bg-slate-800 border border-slate-700 text-white h-24 resize-none"
                        />

                        <input
                            type="number"
                            placeholder="Target amount"
                            value={newProject.targetAmount || ""}
                            onChange={(e) =>
                                setNewProject({ ...newProject, targetAmount: parseFloat(e.target.value) || 0 })
                            }
                            className="w-full p-2 rounded bg-slate-800 border border-slate-700 text-white"
                        />

                        <input
                            type="text"
                            placeholder="Project Wallet Address (0x...)"
                            value={newProject.walletAddress}
                            onChange={(e) =>
                                setNewProject({ ...newProject, walletAddress: e.target.value })
                            }
                            className="w-full p-2 rounded bg-slate-800 border border-slate-700 text-white"
                        />

                        <div className="flex gap-2">
                            <button
                                onClick={handleCreate}
                                className="flex-1 bg-green-600 hover:bg-green-700 rounded p-2 transition-colors"
                            >
                                Create
                            </button>
                            <button
                                onClick={() => setCreateMode(false)}
                                className="flex-1 bg-slate-700 hover:bg-slate-600 rounded p-2 transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* EDIT PROJECT MODAL */}
            {editProject && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
                    <div className="bg-slate-900 p-6 rounded-xl w-96 space-y-4 border border-slate-800 max-h-[90vh] overflow-y-auto">
                        <h2 className="text-xl font-bold">Edit Project</h2>

                        <input
                            type="text"
                            placeholder="Project title"
                            value={editProject.title || ""}
                            onChange={(e) =>
                                setEditProject({ ...editProject, title: e.target.value })
                            }
                            className="w-full p-2 rounded bg-slate-800 border border-slate-700 text-white"
                        />

                        <textarea
                            placeholder="Project description"
                            value={editProject.description || ""}
                            onChange={(e) =>
                                setEditProject({ ...editProject, description: e.target.value })
                            }
                            className="w-full p-2 rounded bg-slate-800 border border-slate-700 text-white h-24 resize-none"
                        />

                        <input
                            type="number"
                            placeholder="Target amount"
                            value={editProject.targetAmount || ""}
                            onChange={(e) =>
                                setEditProject({ ...editProject, targetAmount: parseFloat(e.target.value) || 0 })
                            }
                            className="w-full p-2 rounded bg-slate-800 border border-slate-700 text-white"
                        />

                        <select
                            value={editProject.status || "Pending"}
                            onChange={(e) =>
                                setEditProject({ ...editProject, status: e.target.value as any })
                            }
                            className="w-full p-2 rounded bg-slate-800 border border-slate-700 text-white"
                        >
                            <option value="Pending">Pending</option>
                            <option value="Active">Active</option>
                            <option value="Completed">Completed</option>
                            <option value="Canceled">Canceled</option>
                        </select>

                        <input
                            type="text"
                            placeholder="Project Wallet Address (0x...)"
                            value={editProject.walletAddress || ""}
                            onChange={(e) =>
                                setEditProject({ ...editProject, walletAddress: e.target.value })
                            }
                            className="w-full p-2 rounded bg-slate-800 border border-slate-700 text-white"
                        />

                        <div className="flex gap-2">
                            <button
                                onClick={handleUpdate}
                                className="flex-1 bg-blue-600 hover:bg-blue-700 rounded p-2 transition-colors"
                            >
                                Save
                            </button>
                            <button
                                onClick={() => setEditProject(null)}
                                className="flex-1 bg-slate-700 hover:bg-slate-600 rounded p-2 transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminProjectsPage;
