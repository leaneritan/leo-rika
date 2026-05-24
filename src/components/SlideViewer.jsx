import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const SlideViewer = ({ slides, unitColor }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const slide = slides[currentIndex];

  const nextSlide = () => setCurrentIndex((prev) => Math.min(prev + 1, slides.length - 1));
  const prevSlide = () => setCurrentIndex((prev) => Math.max(prev - 1, 0));

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold flex items-center gap-3">
          <span className="w-2 h-8 rounded-full" style={{ backgroundColor: unitColor }}></span>
          {slide.title}
        </h2>
        <div className="text-sm font-mono text-muted bg-white/10 px-3 py-1 rounded-full">
          {currentIndex + 1} / {slides.length}
        </div>
      </div>

      <div className="min-h-[400px] animate-in slide-in-from-right-4 fade-in duration-300">
        <div className="card p-6 md:p-8 space-y-6">
          <p className="text-lg md:text-xl text-text/90 leading-relaxed">
            {slide.content}
          </p>

          <ul className="space-y-4">
            {(slide.bullets || []).map((bullet, index) => (
              <li key={index} className="flex gap-3 text-base md:text-lg leading-relaxed text-text">
                <span className="mt-2 h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: unitColor }}></span>
                <span>{bullet}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="flex justify-between gap-4 pt-8">
        <button
          onClick={prevSlide}
          disabled={currentIndex === 0}
          className="btn-primary bg-white/5 hover:bg-white/10 disabled:opacity-30 flex items-center gap-2"
        >
          <ChevronLeft size={20} /> 謌ｻ繧・
        </button>
        <button
          onClick={nextSlide}
          disabled={currentIndex === slides.length - 1}
          className="btn-primary bg-white/5 hover:bg-white/10 disabled:opacity-30 flex items-center gap-2"
        >
          谺｡縺ｸ <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
};

export default SlideViewer;
