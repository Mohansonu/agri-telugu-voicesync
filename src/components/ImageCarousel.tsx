import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "./ui/button";

interface ImageItem {
  src: string;
  title: string;
  description: string;
}

interface ImageCarouselProps {
  images: ImageItem[];
}

const ImageCarousel = ({ images }: ImageCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const next = () => setCurrentIndex((prev) => (prev + 1) % images.length);
  const prev = () => setCurrentIndex((p) => (p - 1 + images.length) % images.length);

  if (images.length === 0) return null;

  const current = images[currentIndex];

  return (
    <div className="relative bg-card border border-border rounded-xl p-6 shadow-lg animate-slide-up">
      <div className="flex items-center gap-4">
        <Button
          onClick={prev}
          variant="outline"
          size="icon"
          className="flex-shrink-0 btn-3d"
          aria-label="Previous image"
        >
          <ChevronLeft className="w-5 h-5" />
        </Button>

        <div className="flex-1 text-center">
          <img
            src={current.src}
            alt={current.title}
            className="mx-auto h-40 object-contain mb-3 rounded-lg"
          />
          <h3 className="font-bold text-lg mb-1">{current.title}</h3>
          <p className="text-sm text-muted-foreground">{current.description}</p>
        </div>

        <Button
          onClick={next}
          variant="outline"
          size="icon"
          className="flex-shrink-0 btn-3d"
          aria-label="Next image"
        >
          <ChevronRight className="w-5 h-5" />
        </Button>
      </div>

      <div className="flex justify-center gap-2 mt-4">
        {images.map((_, idx) => (
          <div
            key={idx}
            className={`w-2 h-2 rounded-full transition-all ${
              idx === currentIndex ? 'bg-primary w-6' : 'bg-muted'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default ImageCarousel;
