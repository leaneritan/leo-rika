import { useEffect, useState } from 'react';

const STORAGE_KEY = 'leo-rika-progress';
const LEGACY_STORAGE_KEY = 'leo-rekishi-progress';

const readProgress = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY) || localStorage.getItem(LEGACY_STORAGE_KEY);
    return saved ? JSON.parse(saved) : {};
  } catch (error) {
    console.error('Failed to read progress', error);
    return {};
  }
};

export function useProgress() {
  const [progress, setProgress] = useState(readProgress);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch (error) {
      console.error('Failed to save progress', error);
    }
  }, [progress]);

  const markComplete = (unitId, score, total) => {
    setProgress((current) => ({
      ...current,
      [unitId]: {
        completed: true,
        score,
        total,
        updatedAt: new Date().toISOString(),
      },
    }));
  };

  const getUnitProgress = (unitId) => progress[unitId] || { completed: false, score: 0, total: 0 };

  const clearAll = () => {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(LEGACY_STORAGE_KEY);
    setProgress({});
  };

  return {
    progress,
    markComplete,
    getUnitProgress,
    clearAll,
  };
}
