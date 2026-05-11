import api from "../api/axios.ts";
import type {ProjectData} from "../models/ProjectData.ts";
import type { CreateProjectCommand } from "../models/CreateProjectCommand.ts";
import type { UpdateProjectCommand } from "../models/UpdateProjectCommand.ts";

export const getProjects = async (): Promise<ProjectData[]> => {
    const response = await api.get("/projects");
    return response.data;
};

export const getProjectById = async (id: string): Promise<ProjectData> => {
    const response = await api.get(`/projects/${id}`);
    return response.data;
};

export const createProject = async (data: CreateProjectCommand) => {
    const response = await api.post("/projects", data);
    return response.data;
};

export const updateProject = async (data: UpdateProjectCommand) => {
    const response = await api.put("/projects", data);
    return response.data;
};

export const deleteProject = async (id: string) => {
    const response = await api.delete(`/projects/${id}`);
    return response.data;
};

export const uploadProjectImage = async (projectId: string, file: File): Promise<{ imageUrl: string }> => {
    const formData = new FormData();
    formData.append("file", file);
    
    const response = await api.post(`/projects/${projectId}/images`, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return response.data;
};

export const deleteProjectImage = async (projectId: string, imageUrl: string): Promise<void> => {
    await api.delete(`/projects/${projectId}/images`, {
        params: {
            imageUrl,
        },
    });
};