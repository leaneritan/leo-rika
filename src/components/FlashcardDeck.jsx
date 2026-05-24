import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const FlashcardDeck = ({ flashcards, unitColor }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const card = flashcards[currentIndex];

  const moveCard = (direction) => {
    setCurrentIndex((current) => (current + direction + flashcards.length) % flashcards.length);
    setIsFlipped(false);
  };

  if (!flashcards.length) {
    return <div className="rounded-lg border border-white/10 bg-card p-6 text-muted">フラッシュカードがありません</div>;
  }

  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-6">
      <div className="w-full text-right font-mono text-sm text-muted">
        {currentIndex + 1} / {flashcards.length}
      </div>

      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          setIsFlipped((current) => !current);
        }}
        className="flashcard-scene h-72 w-full cursor-pointer text-left"
      >
        <div className={`flashcard-card ${isFlipped ? 'is-flipped' : ''}`}>
          <div className="flashcard-face border-b-4" style={{ borderBottomColor: unitColor }}>
            <p className="text-2xl font-black leading-relaxed text-white">{card.front}</p>
          </div>
          <div className="flashcard-face flashcard-back border-b-4" style={{ borderBottomColor: unitColor }}>
            <p className="text-xl leading-relaxed text-text">{card.back}</p>
          </div>
        </div>
      </button>

      <div className="grid w-full grid-cols-2 gap-4">
        <button type="button" onClick={() => moveCard(-1)} className="btn-primary flex items-center justify-center bg-white/5 hover:bg-white/10">
          <ChevronLeft size={24} />
        </button>
        <button type="button" onClick={() => moveCard(1)} className="btn-primary flex items-center justify-center bg-white/5 hover:bg-white/10">
          <ChevronRight size={24} />
        </button>
      </div>
    </div>
  );
};

export default FlashcardDeck;
