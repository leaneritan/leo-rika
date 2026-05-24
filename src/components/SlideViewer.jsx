import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const SlideViewer = ({ slides, unitColor }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const slide = slides[currentIndex];

  if (!slides.length) {
    return <div className="rounded-lg border border-white/10 bg-card p-6 text-muted">スライドがありません</div>;
  }

  return (
    <div className="mx-auto max-w-4xl space-y-5">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-2xl font-black text-white md:text-4xl">{slide.title}</h2>
        <span className="shrink-0 rounded-full bg-white/10 px-3 py-1 font-mono text-sm text-muted">
          {currentIndex + 1} / {slides.length}
        </span>
      </div>

      <article className="rounded-lg border border-white/10 bg-card p-6 md:p-8">
        <p className="text-lg italic leading-relaxed text-muted md:text-xl">{slide.content}</p>
        <ul className="mt-7 space-y-4">
          {(slide.bullets || []).map((bullet, index) => (
            <li key={index} className="flex gap-3 text-base leading-relaxed text-text md:text-lg">
              <span className="mt-2 h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: unitColor }} />
              <span>{bullet}</span>
            </li>
          ))}
        </ul>
      </article>

      <div className="flex justify-between gap-4">
        <button
          type="button"
          onClick={() => setCurrentIndex((current) => Math.max(0, current - 1))}
          disabled={currentIndex === 0}
          className="btn-primary flex items-center gap-2 bg-white/5 hover:bg-white/10 disabled:opacity-30"
        >
          <ChevronLeft size={20} />
          Previous
        </button>
        <button
          type="button"
          onClick={() => setCurrentIndex((current) => Math.min(slides.length - 1, current + 1))}
          disabled={currentIndex === slides.length - 1}
          className="btn-primary flex items-center gap-2 bg-white/5 hover:bg-white/10 disabled:opacity-30"
        >
          Next
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
};

export default SlideViewer;
