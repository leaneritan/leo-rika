import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const MIN_SWIPE_DISTANCE = 50;

const SlideViewer = ({ slides, unitEmoji }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStartX, setTouchStartX] = useState(null);
  const slide = slides[currentIndex];

  if (!slides.length) {
    return <div className="rounded-lg border border-white/10 bg-card p-6 text-muted">スライドがありません</div>;
  }

  const goPrevious = () => setCurrentIndex((current) => Math.max(0, current - 1));
  const goNext = () => setCurrentIndex((current) => Math.min(slides.length - 1, current + 1));
  const displayEmoji = slide.emoji || unitEmoji || '';

  const handleTouchEnd = (event) => {
    if (touchStartX === null) return;
    const touchEndX = event.changedTouches[0]?.clientX;
    const distance = touchStartX - touchEndX;
    setTouchStartX(null);

    if (Math.abs(distance) < MIN_SWIPE_DISTANCE) return;
    if (distance > 0) goNext();
    else goPrevious();
  };

  return (
    <div className="mx-auto w-full max-w-5xl space-y-4 px-4">
      <article
        className="flex min-h-[70vh] flex-col rounded-2xl border border-gold/20 bg-[#0f1228] p-6 text-center shadow-[0_0_30px_rgba(255,215,0,0.05)] md:p-8"
        onTouchStart={(event) => setTouchStartX(event.touches[0]?.clientX ?? null)}
        onTouchEnd={handleTouchEnd}
      >
        <div className="flex-1">
          {displayEmoji && <div className="mb-2 text-[4rem] leading-none">{displayEmoji}</div>}
          <h2 className="mb-2 text-[1.6rem] font-black leading-tight text-white">{slide.title}</h2>
          <p className="mx-auto mb-4 max-w-3xl text-[0.95rem] italic leading-relaxed text-gold">
            {slide.content}
          </p>

          <div className="my-3 border-t border-gold/30" />

          <ul className="space-y-2 pl-2 text-left text-base leading-[1.8] text-[#e0e0e0]">
            {(slide.bullets || []).map((bullet, index) => (
              <li key={index}>{bullet}</li>
            ))}
          </ul>
        </div>

        <div className="mt-6 space-y-4">
          <div className="text-sm font-black text-gold">
            {currentIndex + 1} / {slides.length}
          </div>
          <div className="flex items-center justify-center gap-2" aria-label="Slide position">
            {slides.map((item, index) => (
              <button
                key={item.id || index}
                type="button"
                onClick={() => setCurrentIndex(index)}
                className={`h-2.5 w-2.5 rounded-full transition ${index === currentIndex ? 'bg-gold' : 'bg-white/25 hover:bg-white/50'}`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
          <div className="flex justify-between gap-4">
            <button
              type="button"
              onClick={goPrevious}
              disabled={currentIndex === 0}
              className="btn-primary flex items-center gap-2 bg-white/5 hover:bg-white/10 disabled:opacity-30"
            >
              <ChevronLeft size={20} />
              Previous
            </button>
            <button
              type="button"
              onClick={goNext}
              disabled={currentIndex === slides.length - 1}
              className="btn-primary flex items-center gap-2 bg-white/5 hover:bg-white/10 disabled:opacity-30"
            >
              Next
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </article>
    </div>
  );
};

export default SlideViewer;
