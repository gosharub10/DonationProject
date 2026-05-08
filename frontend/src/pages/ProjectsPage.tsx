import { useEffect, useState } from "react";
import { getProjects } from "../services/projectService";

type Project = {
    id: string;
    title: string;
    description: string;
    targetAmount: number;
    collectedAmount: number;
    status: string;
    createdAt: string;
};

const ProjectsPage = () => {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getProjects();
                setProjects(data);
            } catch (err) {
                console.error("Ошибка загрузки проектов", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return <div className="container page">Загрузка...</div>;
    }

    return (
        <div className="container page">
            <h1 className="title">Проекты</h1>
            <p className="subtitle">Актуальные сборы и цели</p>

            <div className="projects-grid">
                {projects.map((p) => {
                    const progress =
                        (p.collectedAmount / p.targetAmount) * 100;

                    return (
                        <div key={p.id} className="project-card">
                            <div className="project-header">
                                <h2>{p.title}</h2>
                                <span className={`status ${p.status.toLowerCase()}`}>
                                    {p.status}
                                </span>
                            </div>

                            <p className="project-desc">{p.description}</p>

                            <div className="progress-info">
                                <span>
                                    {p.collectedAmount} / {p.targetAmount} тугриков
                                </span>
                                <span>{progress.toFixed(0)}%</span>
                            </div>

                            <div className="progress-bar">
                                <div
                                    className="progress-fill"
                                    style={{ width: `${progress}%` }}
                                />
                            </div>

                            <div className="project-footer">
                                <span className="muted">
                                    {new Date(p.createdAt).toLocaleDateString()}
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default ProjectsPage;