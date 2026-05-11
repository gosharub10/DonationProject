export type ProjectStatus = "Pending" | "Active" | "Completed" | "Canceled";

export interface ProjectData {
    id: string;
    title: string;
    description: string;
    targetAmount: number;
    collectedAmount: number;
    status: ProjectStatus;
    createdAt: string;
    walletAddress: string;
    photoUrls: string[];
}