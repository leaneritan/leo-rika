import { useMemo, useState } from 'react';
import { Check, Home, RefreshCw, RotateCcw, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useProgress } from '../hooks/useProgress';

const QuizEngine = ({ questions, unitColor, unitId }) => {
  const navigate = useNavigate();
  const { markComplete } = useProgress();
  const [activeQuestions, setActiveQuestions] = useState(questions);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [results, setResults] = useState([]);
  const [isFinished, setIsFinished] = useState(false);
  const [isReviewMode, setIsReviewMode] = useState(false);

  const currentQuestion = activeQuestions[currentIndex];
  const wrongAnswers = useMemo(() => results.filter((result) => !result.isCorrect), [results]);

  if (!questions.length) {
    return <div className="rounded-lg border border-white/10 bg-card p-6 text-muted">クイズがありません</div>;
  }

  const answerQuestion = (choiceIndex) => {
    if (selectedIndex !== null) return;
    const isCorrect = choiceIndex === currentQuestion.answer;
    setSelectedIndex(choiceIndex);
    setResults((current) => [...current, { ...currentQuestion, isCorrect, selectedIndex: choiceIndex }]);
  };

  const goNext = () => {
    if (currentIndex < activeQuestions.length - 1) {
      setCurrentIndex((current) => current + 1);
      setSelectedIndex(null);
      return;
    }

    const finalResults = selectedIndex === null ? results : results;
    const score = finalResults.filter((result) => result.isCorrect).length;
    if (!isReviewMode) markComplete(unitId, score, activeQuestions.length);
    setIsFinished(true);
  };

  const restart = () => {
    setActiveQuestions(questions);
    setCurrentIndex(0);
    setSelectedIndex(null);
    setResults([]);
    setIsFinished(false);
    setIsReviewMode(false);
  };

  const reviewWrongAnswers = () => {
    setActiveQuestions(wrongAnswers.map(({ isCorrect, selectedIndex: _selectedIndex, ...question }) => question));
    setCurrentIndex(0);
    setSelectedIndex(null);
    setResults([]);
    setIsFinished(false);
    setIsReviewMode(true);
  };

  if (isFinished) {
    const score = results.filter((result) => result.isCorrect).length;
    const wrongCount = activeQuestions.length - score;

    return (
      <div className="mx-auto max-w-2xl rounded-lg border border-white/10 bg-card p-6 text-center md:p-8">
        <h2 className="text-3xl font-black text-white">{isReviewMode ? 'Review Complete' : 'Quiz Complete'}</h2>
        <div className="mt-6 text-6xl font-black text-white">
          <span style={{ color: unitColor }}>{score}</span> / {activeQuestions.length}
        </div>
        <div className="mt-8 grid gap-3">
          {wrongCount > 0 && (
            <button type="button" onClick={reviewWrongAnswers} className="btn-primary flex items-center justify-center gap-2 text-background" style={{ backgroundColor: unitColor }}>
              <RefreshCw size={18} />
              Review wrong answers ({wrongCount})
            </button>
          )}
          <button type="button" onClick={restart} className="btn-primary flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20">
            <RotateCcw size={18} />
            Restart
          </button>
          <button type="button" onClick={() => navigate('/')} className="btn-primary flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20">
            <Home size={18} />
            Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <div className="flex items-center justify-between text-sm font-bold text-muted">
        <span>{isReviewMode ? 'Review Mode' : 'Quiz'}</span>
        <span>{currentIndex + 1} / {activeQuestions.length}</span>
      </div>

      <section className="rounded-lg border border-white/10 bg-card p-5 md:p-7">
        <h2 className="text-xl font-black leading-relaxed text-white md:text-2xl">{currentQuestion.question}</h2>
        <div className="mt-6 grid gap-3">
          {currentQuestion.choices.map((choice, index) => {
            const isSelected = selectedIndex === index;
            const isCorrect = index === currentQuestion.answer;
            const answered = selectedIndex !== null;
            const state = answered && isCorrect
              ? 'border-green-400 bg-green-500/15 text-green-200'
              : answered && isSelected
                ? 'border-red-400 bg-red-500/15 text-red-200'
                : 'border-white/10 bg-white/5 hover:bg-white/10';

            return (
              <button
                key={index}
                type="button"
                onClick={() => answerQuestion(index)}
                className={`flex items-center gap-3 rounded-lg border p-4 text-left transition ${state}`}
              >
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded bg-white/10 font-mono font-black">
                  {String.fromCharCode(65 + index)}
                </span>
                <span className="flex-1">{choice}</span>
                {answered && isCorrect && <Check className="text-green-300" size={20} />}
                {answered && isSelected && !isCorrect && <X className="text-red-300" size={20} />}
              </button>
            );
          })}
        </div>

        {selectedIndex !== null && (
          <button type="button" onClick={goNext} className="btn-primary mt-6 w-full text-background" style={{ backgroundColor: unitColor }}>
            {currentIndex === activeQuestions.length - 1 ? 'Show Score' : '次へ'}
          </button>
        )}
      </section>
    </div>
  );
};

export default QuizEngine;
