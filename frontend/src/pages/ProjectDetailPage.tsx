import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProjectById } from "../services/projService";
import type { ProjectData } from "../models/ProjectData";

// mock images
const getMockProjectImages = (id: string) => {
    const colors = ["1e3a8a", "0f766e", "7c3aed", "be123c", "0369a1"];

    return Array.from({ length: 4 }, (_, i) => {
        const c = colors[i % colors.length];
        return `https://via.placeholder.com/1400x700/${c}/ffffff?text=Project+${i + 1}`;
    });
};

const ProjectDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [project, setProject] = useState<ProjectData | null>(null);
    const [loading, setLoading] = useState(true);
    const [images, setImages] = useState<string[]>([]);
    const [active, setActive] = useState(0);

    useEffect(() => {
        if (!id) return;

        const load = async () => {
            const data = await getProjectById(id);
            setProject(data);
            setImages(getMockProjectImages(id));
            setLoading(false);
        };

        load();
    }, [id]);

    if (loading || !project) {
        return (
            <div className="h-screen flex items-center justify-center text-slate-400">
                Loading...
            </div>
        );
    }

    const progress =
        (project.collectedAmount / project.targetAmount) * 100;

    const next = () =>
        setActive((p) => (p + 1) % images.length);

    const prev = () =>
        setActive((p) => (p - 1 + images.length) % images.length);

    return (
        <div className="relative min-h-screen bg-slate-950 text-white">

            {/* BACKGROUND GLOW */}
            <div className="absolute top-20 left-10 w-72 h-72 bg-blue-600/20 blur-3xl rounded-full" />
            <div className="absolute bottom-20 right-10 w-72 h-72 bg-purple-600/20 blur-3xl rounded-full" />

            <div className="relative max-w-7xl mx-auto px-6 py-10">

                {/* BACK */}
                <button
                    onClick={() => navigate("/projects")}
                    className="mb-6 text-sm text-slate-400 hover:text-white"
                >
                    ← Back
                </button>

                {/* HERO SLIDER */}
                <div className="relative rounded-2xl overflow-hidden shadow-2xl">

                    <img
                        src={images[active]}
                        className="w-full h-130 object-cover"
                    />

                    {/* overlay */}
                    <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />

                    {/* title overlay */}
                    <div className="absolute bottom-6 left-6">
                        <h1 className="text-4xl font-bold">
                            {project.title}
                        </h1>
                        <p className="text-slate-300 text-sm mt-2">
                            {project.status}
                        </p>
                    </div>

                    {/* arrows */}
                    <button
                        onClick={prev}
                        className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/40 px-3 py-2 rounded-xl"
                    >
                        ◀
                    </button>

                    <button
                        onClick={next}
                        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/40 px-3 py-2 rounded-xl"
                    >
                        ▶
                    </button>
                </div>

                {/* DOTS */}
                <div className="flex justify-center gap-2 mt-4">
                    {images.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => setActive(i)}
                            className={`w-2.5 h-2.5 rounded-full transition ${
                                i === active
                                    ? "bg-white"
                                    : "bg-white/30"
                            }`}
                        />
                    ))}
                </div>

                {/* MAIN GRID */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-10">

                    {/* LEFT */}
                    <div className="lg:col-span-2 space-y-6">

                        {/* DESCRIPTION */}
                        <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-2xl p-6">
                            <h2 className="text-lg mb-3 text-slate-300">
                                About Project
                            </h2>
                            <p className="text-slate-400 leading-relaxed">
                                {project.description}
                            </p>
                        </div>

                        {/* DONATE CTA */}
                        <div className="bg-linear-to-r from-blue-600/20 to-purple-600/20 border border-white/10 rounded-2xl p-6">
                            <h2 className="text-lg mb-2">
                                Support this project
                            </h2>
                            <p className="text-slate-400 text-sm mb-4">
                                Future crypto donation system will be here.
                            </p>
                            <button className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-xl font-semibold">
                                Donate (Coming soon)
                            </button>
                        </div>
                    </div>

                    {/* RIGHT FLOAT CARD */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-20 bg-white/5 border border-white/10 backdrop-blur-xl rounded-2xl p-6 space-y-5">

                            <div>
                                <p className="text-slate-400 text-sm">
                                    Funding
                                </p>
                                <p className="text-3xl font-bold text-blue-400">
                                    {progress.toFixed(1)}%
                                </p>
                            </div>

                            <div>
                                <p className="text-slate-400 text-sm">
                                    Raised
                                </p>
                                <p className="text-xl">
                                    ${project.collectedAmount}
                                </p>
                            </div>

                            <div>
                                <p className="text-slate-400 text-sm">
                                    Goal
                                </p>
                                <p className="text-xl">
                                    ${project.targetAmount}
                                </p>
                            </div>

                            <div>
                                <p className="text-slate-400 text-sm">
                                    Wallet
                                </p>
                                <p className="text-xs break-all text-slate-300">
                                    {project.walletAddress}
                                </p>
                            </div>

                            {/* progress bar */}
                            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                                <div
                                    className="bg-blue-500 h-full"
                                    style={{ width: `${progress}%` }}
                                />
                            </div>

                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default ProjectDetailPage;