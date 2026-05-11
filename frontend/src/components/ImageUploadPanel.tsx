import { useState, useRef } from "react";
import { uploadProjectImage, deleteProjectImage } from "../services/projService";

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
        } catch (err: any) {
            setError(err.message || "Failed to upload images");
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        }
    };

    const handleDeleteImage = async (imageUrl: string) => {
        if (!window.confirm("Are you sure you want to delete this image?")) {
            return;
        }

        try {
            setError("");
            await deleteProjectImage(projectId, imageUrl);

            // Remove from images
            const updatedImages = currentImages.filter((url) => url !== imageUrl);
            onImagesChange(updatedImages);
        } catch (err: any) {
            setError(err?.response?.data?.message || "Failed to delete image");
        }
    };

    return (
        <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-4 mt-4">
            <h3 className="text-white font-semibold mb-4">Project Images</h3>

            {/* Upload Section */}
            <div className="mb-6">
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
                <label htmlFor={`file-input-${projectId}`}>
                    <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isUploading}
                        className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isUploading ? "Uploading..." : "Upload Images"}
                    </button>
                </label>
                <p className="text-slate-400 text-sm mt-2">Max 5 MB per file. Formats: JPG, PNG, WebP</p>
            </div>

            {/* Error Message */}
            {error && <div className="text-red-500 text-sm mb-4">{error}</div>}

            {/* Images Preview */}
            {currentImages.length > 0 && (
                <div className="grid grid-cols-3 gap-4">
                    {currentImages.map((imageUrl, index) => (
                        <div
                            key={index}
                            className="relative group rounded-lg overflow-hidden border border-slate-700 hover:border-slate-600 transition-all"
                        >
                            <img
                                src={imageUrl}
                                alt={`Project image ${index + 1}`}
                                className="w-full h-32 object-cover"
                            />
                            <button
                                onClick={() => handleDeleteImage(imageUrl)}
                                className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                            >
                                <span className="text-white font-semibold">Delete</span>
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {currentImages.length === 0 && (
                <div className="text-slate-400 text-center py-8">No images uploaded yet</div>
            )}
        </div>
    );
};

export default ImageUploadPanel;
