import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProjectById } from "../services/projService";
import { useWallet } from "../context/WalletContext";
import DonationModal from "../components/DonationModal";
import RecentDonationsBlock from "../components/RecentDonationsBlock";
import { formatEthAmount } from "../utils/formatUtils";
import type { ProjectData } from "../models/ProjectData";
import { ArrowLeft, Target, Heart, Wallet, Activity, CheckCircle2, ChevronLeft, ChevronRight } from "lucide-react";

const getPlaceholderImage = (projectId: string) => {
    const colors = ["e4dfd9", "e4c7b7", "8b4c70", "522157", "c2649a"];
    const colorIndex = projectId.charCodeAt(0) % colors.length;
    const color = colors[colorIndex];
    return `https://via.placeholder.com/1400x700/${color}/ffffff?text=Фото+проекта`;
};

const ProjectDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { wallet } = useWallet();

    const [project, setProject] = useState<ProjectData | null>(null);
    const [loading, setLoading] = useState(true);
    const [images, setImages] = useState<string[]>([]);
    const [active, setActive] = useState(0);
    const [showDonationModal, setShowDonationModal] = useState(false);
    const [refreshPayments, setRefreshPayments] = useState(0);

    useEffect(() => {
        if (!id) return;

        const load = async () => {
            try {
                const data = await getProjectById(id);
                setProject(data);
                
                const projectImages = data.photoUrls && data.photoUrls.length > 0 
                    ? data.photoUrls 
                    : [getPlaceholderImage(id)];
                
                setImages(projectImages);
            } catch (err) {
                console.error("Failed to load project", err);
            } finally {
                setLoading(false);
            }
        };

        load();
    }, [id]);

    const refreshProjectDetails = async () => {
        if (!id) return;
        try {
            const updatedProject = await getProjectById(id);
            setProject(updatedProject);
            setRefreshPayments(prev => prev + 1);
        } catch (error) {
            console.error("Failed to refresh project details:", error);
        }
    };

    const handleDonationSuccess = () => {
        refreshProjectDetails();
    };

    if (loading || !project) {
        return (
            <div className="min-h-screen flex items-center justify-center text-brand-primary">
                <div className="animate-spin w-12 h-12 border-4 border-brand-primary/20 border-t-brand-primary rounded-full"></div>
            </div>
        );
    }

    const progress = Math.min(
        (project.collectedAmount / project.targetAmount) * 100,
        100
    );
    const remaining = Math.max(0, project.targetAmount - project.collectedAmount);
    
    // Determine project status display
    const isCompleted = project.status === 'Completed' || progress >= 100;

    const next = () => setActive((p) => (p + 1) % images.length);
    const prev = () => setActive((p) => (p - 1 + images.length) % images.length);

    return (
        <div className="min-h-screen bg-brand-light pb-20">

            <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">

                {/* BACK */}
                <button
                    onClick={() => navigate("/projects")}
                    className="mb-8 flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-brand-primary transition-colors group"
                >
                    <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> 
                    Все проекты
                </button>

                {/* HERO SLIDER */}
                <div className="relative rounded-4xl overflow-hidden shadow-2xl mb-8 group animate-scale-up">

                    <img
                        src={images[active]}
                        alt={`${project.title} - Изображение ${active + 1}`}
                        className="w-full h-100 md:h-125 lg:h-150 object-cover"
                    />

                    {/* gradient overlay */}
                    <div className="absolute inset-0 bg-linear-to-t from-slate-900/90 via-slate-900/40 to-transparent" />

                    {/* title overlay */}
                    <div className="absolute bottom-8 left-8 md:bottom-12 md:left-12 max-w-3xl">
                        <span className="inline-block px-3 py-1 bg-brand-accent/20 backdrop-blur-md text-white border border-white/10 rounded-full text-xs font-bold uppercase tracking-wider mb-4">
                            {isCompleted ? "Сбор завершен" : "Активный сбор"}
                        </span>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight">
                            {project.title}
                        </h1>
                    </div>

                    {/* arrows */}
                    {images.length > 1 && (
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <button
                                onClick={prev}
                                className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center bg-white/10 hover:bg-white/30 backdrop-blur-md text-white rounded-full transition-all"
                            >
                                <ChevronLeft size={24} />
                            </button>

                            <button
                                onClick={next}
                                className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center bg-white/10 hover:bg-white/30 backdrop-blur-md text-white rounded-full transition-all"
                            >
                                <ChevronRight size={24} />
                            </button>
                        </div>
                    )}
                    
                    {/* dots position indicator for images */}
                    {images.length > 1 && (
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                            {images.map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setActive(i)}
                                    className={`h-2 rounded-full transition-all ${
                                        i === active ? "w-8 bg-white" : "w-2 bg-white/40 hover:bg-white/60"
                                    }`}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* MAIN GRID */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* LEFT CONTENT */}
                    <div className="lg:col-span-2 space-y-8 animate-fade-in-up" style={{ animationDelay: '100ms' }}>

                        {/* DESCRIPTION */}
                        <div className="premium-card p-8 lg:p-10">
                            <h2 className="text-2xl font-bold flex items-center gap-2 text-slate-800 mb-6">
                                <Activity size={24} className="text-brand-accent" />
                                О проекте
                            </h2>
                            <div className="text-slate-600 leading-relaxed text-lg whitespace-pre-line font-medium">
                                {project.description}
                            </div>
                        </div>

                        {/* RECENT DONATIONS */}
                        <div className="premium-card p-6 lg:p-8">
                            <h2 className="text-2xl font-bold flex items-center gap-2 text-slate-800 mb-6">
                                <Heart size={24} className="text-brand-secondary" />
                                Последние пожертвования
                            </h2>
                            <RecentDonationsBlock projectId={project.id} triggerRefresh={refreshPayments} />
                        </div>
                    </div>

                    {/* RIGHT FLOAT CARD */}
                    <div className="lg:col-span-1 animate-fade-in-left" style={{ animationDelay: '200ms' }}>
                        <div className="sticky top-24 premium-card p-8 space-y-8 border-t-4 border-t-brand-primary">

                            <div>
                                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">
                                    Прогресс сбора
                                </h3>
                                <div className="flex items-baseline gap-2">
                                    <p className={`text-5xl font-black tracking-tight ${
                                        isCompleted ? 'text-green-500' : 'text-slate-800'
                                    }`}>
                                        {progress.toFixed(1)}%
                                    </p>
                                </div>
                                {isCompleted && (
                                    <div className="flex items-center gap-1 text-sm font-bold text-green-500 mt-2 bg-green-50 w-fit px-3 py-1 rounded-full">
                                        <CheckCircle2 size={16} /> Цель достигнута
                                    </div>
                                )}
                            </div>

                            {/* progress bar */}
                            <div className="w-full bg-slate-100 h-4 rounded-full overflow-hidden shadow-inner">
                                <div
                                    className={`h-full transition-all duration-1000 ease-out rounded-full ${
                                        isCompleted ? 'bg-green-500' : 'bg-brand-primary'
                                    }`}
                                    style={{ width: `${Math.min(progress, 100)}%` }}
                                />
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                                    <div className="flex items-center justify-between mb-1">
                                        <Heart size={16} className="text-brand-accent" />
                                    </div>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                                        Собрано
                                    </p>
                                    <p className="text-xl font-bold text-slate-800 tracking-tight">
                                        {formatEthAmount(project.collectedAmount, 4)} ETH
                                    </p>
                                </div>

                                <div className="bg-brand-beige/30 p-4 rounded-2xl border border-brand-beige">
                                    <div className="flex items-center justify-between mb-1">
                                        <Target size={16} className="text-brand-secondary" />
                                    </div>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                                        Цель
                                    </p>
                                    <p className="text-xl font-bold text-slate-800 tracking-tight">
                                        {formatEthAmount(project.targetAmount, 4)} ETH
                                    </p>
                                </div>
                            </div>

                            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex items-center justify-between">
                                <div>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                                        Осталось собрать
                                    </p>
                                    <p className={`text-lg font-bold tracking-tight ${
                                        remaining === 0 ? 'text-green-500' : 'text-slate-800'
                                    }`}>
                                        {remaining === 0 ? '0 ETH' : formatEthAmount(remaining, 4) + ' ETH'}
                                    </p>
                                </div>
                            </div>

                            <div className="px-1">
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                                    <Wallet size={14} /> Смарт-контракт кошелька
                                </p>
                                <p className="text-xs font-mono break-all text-slate-600 bg-slate-100 p-3 rounded-lg border border-slate-200">
                                    {project.walletAddress}
                                </p>
                            </div>

                            {/* Donate Button */}
                            <button
                                onClick={() => {
                                    if (wallet && !isCompleted) {
                                        setShowDonationModal(true);
                                    }
                                }}
                                disabled={!wallet || isCompleted}
                                className={`w-full py-5 rounded-2xl font-bold text-lg transition-all duration-300 transform outline-none flex justify-center items-center gap-2 ${
                                    isCompleted
                                        ? 'bg-green-50 text-green-600 border border-green-200 cursor-not-allowed'
                                        : wallet
                                        ? 'bg-brand-primary hover:bg-brand-secondary text-white hover:shadow-xl hover:-translate-y-1'
                                        : 'bg-slate-100 text-slate-400 cursor-not-allowed hover:bg-slate-200'
                                }`}
                            >
                                {isCompleted 
                                    ? <><CheckCircle2 size={24} /> Сбор закрыт</>
                                    : wallet 
                                    ? <><Heart size={24} className="animate-pulse" /> Поддержать проект</>
                                    : <><Wallet size={24} /> Подключить кошелек</>}
                            </button>
                            
                            {!wallet && !isCompleted && (
                                <p className="text-center text-xs font-medium text-slate-500 mt-2">
                                    Авторизуйтесь через MetaMask в профиле,<br/>чтобы совершить пожертвование
                                </p>
                            )}
                        </div>
                    </div>

                </div>
            </div>

            <DonationModal
                isOpen={showDonationModal}
                projectId={project.id}
                projectTitle={project.title}
                recipientAddress={project.walletAddress}
                onClose={() => setShowDonationModal(false)}
                onSuccess={handleDonationSuccess}
            />
        </div>
    );
};

export default ProjectDetailPage;
