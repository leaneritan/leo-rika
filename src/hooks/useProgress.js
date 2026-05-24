import { useState, useEffect } from 'react';

const STORAGE_KEY = 'leo-rika-progress';
const LEGACY_STORAGE_KEY = 'leo-rekishi-progress';
const INITIAL_PROGRESS = { quiz: {}, flashcards: {} };

const loadSavedProgress = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY) || localStorage.getItem(LEGACY_STORAGE_KEY);
    return saved ? { ...INITIAL_PROGRESS, ...JSON.parse(saved) } : INITIAL_PROGRESS;
  } catch (error) {
    console.error('Failed to load saved progress', error);
    return INITIAL_PROGRESS;
  }
};

export const useProgress = () => {
  const [progress, setProgress] = useState(loadSavedProgress);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch (error) {
      console.error('Failed to save progress', error);
    }
  }, [progress]);

  const saveQuizResult = (unitId, correct, total) => {
    setProgress(prev => ({
      ...prev,
      quiz: {
        ...prev.quiz,
        [unitId]: {
          completed: true,
          score: correct,
          correct,
          total,
          lastAttempt: new Date().toISOString(),
        }
      }
    }));
  };

  const getQuizResult = (unitId) => {
    return progress.quiz[unitId] || null;
  };

  const saveFlashcardMastery = (unitId, masteredIds, total) => {
    setProgress(prev => ({
      ...prev,
      flashcards: {
        ...prev.flashcards,
        [unitId]: {
          masteredIds,
          total,
        }
      }
    }));
  };

  const getFlashcardMastery = (unitId) => {
    return progress.flashcards[unitId] || null;
  };

  const clearAll = () => {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(LEGACY_STORAGE_KEY);
    setProgress(INITIAL_PROGRESS);
  };

  return {
    progress,
    saveQuizResult,
    getQuizResult,
    saveFlashcardMastery,
    getFlashcardMastery,
    clearAll,
  };
};
