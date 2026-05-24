import { useEffect, useState } from 'react';
import UnitCard from '../components/UnitCard';
import ProgressBar from '../components/ProgressBar';
import { useProgress } from '../hooks/useProgress';

const Home = () => {
  const [manifest, setManifest] = useState(null);
  const [error, setError] = useState('');
  const { progress } = useProgress();

  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}data/manifest.json`)
      .then((response) => {
        if (!response.ok) throw new Error(`Manifest failed: ${response.status}`);
        return response.json();
      })
      .then(setManifest)
      .catch((err) => {
        console.error(err);
        setError('データを読み込めませんでした');
      });
  }, []);

  if (error) {
    return <div className="grid min-h-screen place-items-center px-4 text-muted">{error}</div>;
  }

  if (!manifest) {
    return <div className="grid min-h-screen place-items-center px-4 text-muted">読み込み中...</div>;
  }

  const totals = manifest.units.reduce(
    (sum, unit) => {
      const unitProgress = progress[unit.id];
      return {
        score: sum.score + (unitProgress?.score || 0),
        total: sum.total + (unitProgress?.total || unit.questionCount || 0),
      };
    },
    { score: 0, total: 0 },
  );

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-8 md:py-12">
      <header className="space-y-4">
        <p className="text-sm font-bold uppercase tracking-[0.25em] text-teal">leo-rika</p>
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-4xl font-black leading-tight text-white md:text-6xl">
              {manifest.appTitle}
            </h1>
            <p className="mt-3 text-lg text-muted">{manifest.subject}</p>
          </div>
          <div className="rounded-lg border border-white/10 bg-white/5 p-4 md:w-80">
            <div className="mb-2 flex items-center justify-between text-sm font-bold text-white">
              <span>Overall Progress</span>
              <span>{totals.score} / {totals.total || '-'}</span>
            </div>
            <ProgressBar current={totals.score} total={totals.total || 1} color="#FFD700" />
          </div>
        </div>
      </header>

      <section className="grid gap-4 sm:grid-cols-2">
        {manifest.units.map((unit) => (
          <UnitCard key={unit.id} unit={unit} progress={progress[unit.id]} />
        ))}
      </section>
    </main>
  );
};

export default Home;
