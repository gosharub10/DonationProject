import { useState, useEffect } from "react";

interface ImageSliderProps {
    images: string[];
    alt?: string;
    autoPlay?: boolean;
    autoPlayInterval?: number;
}

const ImageSlider = ({
    images,
    alt = "Project image",
    autoPlay = true,
    autoPlayInterval = 5000,
}: ImageSliderProps) => {
    const [currentSlide, setCurrentSlide] = useState(0);

    // Auto-play functionality
    useEffect(() => {
        if (!autoPlay || images.length <= 1) return;

        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % images.length);
        }, autoPlayInterval);

        return () => clearInterval(interval);
    }, [autoPlay, autoPlayInterval, images.length]);

    // Handle keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "ArrowLeft") goToPrevious();
            if (e.key === "ArrowRight") goToNext();
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);

    const goToNext = () => {
        setCurrentSlide((prev) => (prev + 1) % images.length);
    };

    const goToPrevious = () => {
        setCurrentSlide((prev) => (prev - 1 + images.length) % images.length);
    };

    const goToSlide = (index: number) => {
        setCurrentSlide(index);
    };

    if (!images || images.length === 0) {
        return (
            <div className="w-full aspect-video bg-slate-800 border border-slate-700 rounded-2xl flex items-center justify-center">
                <div className="text-slate-500 text-center">
                    <p className="text-lg font-semibold mb-2">No images available</p>
                    <p className="text-sm">Images will be displayed here</p>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full space-y-4">
            {/* MAIN SLIDER CONTAINER */}
            <div className="relative w-full aspect-video bg-slate-800 border border-slate-700 rounded-2xl overflow-hidden group">
                {/* MAIN IMAGE */}
                <div className="relative w-full h-full overflow-hidden">
                    <img
                        src={images[currentSlide]}
                        alt={`${alt} ${currentSlide + 1}`}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                </div>

                {/* GRADIENT OVERLAY (optional for text overlay if needed later) */}
                <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent pointer-events-none" />

                {/* LEFT BUTTON */}
                <button
                    onClick={goToPrevious}
                    className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-all duration-200 opacity-0 group-hover:opacity-100 lg:opacity-100"
                    aria-label="Previous image"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>

                {/* RIGHT BUTTON */}
                <button
                    onClick={goToNext}
                    className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-all duration-200 opacity-0 group-hover:opacity-100 lg:opacity-100"
                    aria-label="Next image"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </button>

                {/* IMAGE COUNTER - TOP RIGHT */}
                {images.length > 1 && (
                    <div className="absolute top-4 right-4 z-10 bg-black/60 px-3 py-1 rounded-full text-white text-xs font-semibold">
                        {currentSlide + 1} / {images.length}
                    </div>
                )}
            </div>

            {/* INDICATOR DOTS - BOTTOM */}
            {images.length > 1 && (
                <div className="flex justify-center items-center gap-2">
                    {images.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => goToSlide(index)}
                            className={`transition-all duration-300 rounded-full ${
                                index === currentSlide
                                    ? "bg-blue-500 w-3 h-3"
                                    : "bg-slate-600 hover:bg-slate-500 w-2 h-2"
                            }`}
                            aria-label={`Go to slide ${index + 1}`}
                        />
                    ))}
                </div>
            )}

            {/* IMAGE INFO - OPTIONAL */}
            {images.length > 1 && (
                <div className="text-center text-slate-400 text-xs">
                    Use arrow keys or buttons to navigate • Click dots to jump
                </div>
            )}
        </div>
    );
};

export default ImageSlider;
