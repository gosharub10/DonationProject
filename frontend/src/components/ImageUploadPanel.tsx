import { useState, useRef } from "react";
import { uploadProjectImage, deleteProjectImage } from "../services/projService";
import { Upload, Trash2, Image as ImageIcon } from "lucide-react";

interface ImageUploadPanelProps {
    projectId: string;
    currentImages: string[];
    onImagesChange: (images: string[]) => void;
}

const ImageUploadPanel = ({
    projectId,
    currentImages,
    onImagesChange,
}: ImageUploadPanelProps) => {
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState("");
    const fileInputRef = useRef<HTMLInputElement>(null);

    const getErrorMessage = (error: unknown, fallback: string) => {
        if (typeof error === "object" && error !== null && "response" in error) {
            const response = error as { response?: { data?: { message?: string } } };
            return response.response?.data?.message || fallback;
        }

        if (error instanceof Error) {
            return error.message || fallback;
        }

        return fallback;
    };

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.currentTarget.files;
        if (!files) return;

        setError("");
        setIsUploading(true);

        try {
            for (let i = 0; i < files.length; i++) {
                const file = files[i];

                // Validate file type
                const validTypes = ["image/jpeg", "image/png", "image/webp"];
                if (!validTypes.includes(file.type)) {
                    throw new Error(`${file.name}: Invalid file type. Only jpg, png, and webp are allowed.`);
                }

                // Validate file size (5 MB)
                if (file.size > 5 * 1024 * 1024) {
                    throw new Error(`${file.name}: File size exceeds 5 MB limit.`);
                }

                // Upload to server
                const response = await uploadProjectImage(projectId, file);

                // Add to images
                onImagesChange([...currentImages, response.imageUrl]);
            }
        } catch (error: unknown) {
            setError(getErrorMessage(error, "Не удалось загрузить изображения"));
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        }
    };

    const handleDeleteImage = async (imageUrl: string) => {
        if (!window.confirm("Удалить это изображение?")) {
            return;
        }

        try {
            setError("");
            await deleteProjectImage(projectId, imageUrl);

            // Remove from images
            const updatedImages = currentImages.filter((url) => url !== imageUrl);
            onImagesChange(updatedImages);
        } catch (error: unknown) {
            setError(getErrorMessage(error, "Не удалось удалить изображение"));
        }
    };

    return (
        <div className="premium-card mt-4 p-5">
            <div className="flex items-center gap-2 text-slate-800">
                <ImageIcon size={18} className="text-brand-primary" />
                <h3 className="font-bold">Изображения проекта</h3>
            </div>

            <div className="mt-4 space-y-3">
                <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleFileSelect}
                    disabled={isUploading}
                    className="hidden"
                    id={`file-input-${projectId}`}
                />
                <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-brand-primary px-4 py-3 font-bold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-brand-secondary hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 disabled:hover:bg-brand-primary"
                >
                    <Upload size={16} />
                    {isUploading ? "Загрузка изображений..." : "Загрузить изображения"}
                </button>
                <p className="text-sm font-medium text-slate-500">
                    До 5 МБ на файл. Форматы: JPG, PNG, WebP.
                </p>
            </div>

            {error && <div className="mb-4 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">{error}</div>}

            {currentImages.length > 0 && (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {currentImages.map((imageUrl, index) => (
                        <div
                            key={index}
                            className="group relative overflow-hidden rounded-2xl border border-brand-beige/60 bg-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lg"
                        >
                            <img
                                src={imageUrl}
                                alt={`Project image ${index + 1}`}
                                className="h-36 w-full object-cover"
                            />
                            <button
                                onClick={() => handleDeleteImage(imageUrl)}
                                className="absolute inset-0 flex items-center justify-center bg-brand-primary/50 opacity-0 backdrop-blur-[1px] transition-opacity group-hover:opacity-100"
                            >
                                <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-bold text-brand-primary shadow-sm">
                                    <Trash2 size={14} />
                                    Удалить
                                </span>
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {currentImages.length === 0 && (
                <div className="rounded-2xl border border-dashed border-brand-beige/80 bg-brand-light/40 py-10 text-center text-sm font-medium text-slate-500">
                    Изображения пока не загружены
                </div>
            )}
        </div>
    );
};

export default ImageUploadPanel;
