import type { ProjectStatus } from "./ProjectData";

export interface UpdateProjectCommand {
    id: string;
    title?: string;
    description?: string;
    targetAmount?: number;
    status?: ProjectStatus;
    walletAddress?: string;
}
