import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import UnitCard from '../components/UnitCard';
import ProgressBar from '../components/ProgressBar';
import { useProgress } from '../hooks/useProgress';
import { Trophy } from 'lucide-react';

const Home = () => {
  const navigate = useNavigate();
  const { progress } = useProgress();
  const [manifest, setManifest] = useState(null);

  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}data/manifest.json`)
      .then(res => res.json())
      .then(data => setManifest(data))
      .catch(err => console.error('Failed to load manifest', err));
  }, []);

  if (!manifest) return <div className="min-h-screen flex items-center justify-center text-muted">読み込み中...</div>;

  // Calculate total progress
  const totalQuestions = manifest.units.reduce((acc, unit) => {
    // For normal units, we need to load them to know the count,
    // but we can estimate or use a placeholder if not loaded yet.
    // However, the prompt asks for "Progress bar showing total questions answered across all units"
    return acc + (progress.quiz[unit.id]?.total || 0);
  }, 0);

  const totalCorrect = manifest.units.reduce((acc, unit) => {
    return acc + (progress.quiz[unit.id]?.correct || 0);
  }, 0);

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl space-y-12">
      <header className="text-center space-y-4">
        <h1 className="text-4xl md:text-6xl font-bold text-white">
          Leo の 理科 探偵 🔬
        </h1>
        <p className="text-[#FFD700] text-xl font-bold">
          理科（生物）単元1 | テストまで4日
        </p>
      </header>

      <div className="max-w-md mx-auto space-y-2">
        <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-muted">
          <span>Overall Progress</span>
          <span>{totalCorrect} / {totalQuestions || '-'} Questions</span>
        </div>
        <ProgressBar current={totalCorrect} total={totalQuestions || 1} color="#FFD700" />
      </div>

      <main className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2 max-w-4xl mx-auto">
        {manifest.units.map((unit) => {
          const isDay4 = unit.day === 4;
          return (
            <div key={unit.id} className={isDay4 ? "border-2 border-[#FFD700] rounded-2xl p-1" : ""}>
              <UnitCard
                unit={{
                  ...unit,
                  dayTag: `Day ${unit.day}${isDay4 ? " 🏆" : ""}`,
                  color: isDay4 ? "#FFD700" : (unit.color || "#4a9eff"),
                  description: unit.subtitle
                }}
                progress={progress}
              />
            </div>
          );
        })}
      </main>
    </div>
  );
};

export default Home;
