import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, BarChart3, BookOpen, CheckCircle2, Layers } from 'lucide-react';
import ClassificationChart from '../components/ClassificationChart';
import FlashcardDeck from '../components/FlashcardDeck';
import QuizEngine from '../components/QuizEngine';
import SlideViewer from '../components/SlideViewer';

const shuffleItems = (items) => {
  const shuffled = [...items];
  for (let i = shuffled.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const modes = [
  { id: 'slides', label: '当 繧ｹ繝ｩ繧､繝・', icon: BookOpen },
  { id: 'flashcards', label: 'ワ 繝輔Λ繝・す繝･繧ｫ繝ｼ繝・', icon: Layers },
  { id: 'chart', label: '翌・・蛻・｡槭メ繝｣繝ｼ繝・', icon: BarChart3 },
  { id: 'quiz', label: '笨擾ｸ・繧ｯ繧､繧ｺ', icon: CheckCircle2 },
];

const UnitPage = ({ mode }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [unit, setUnit] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadUnit = async () => {
      try {
        setError('');
        setUnit(null);
        const response = await fetch(`${import.meta.env.BASE_URL}data/units/${id}.json`);
        if (!response.ok) throw new Error(`Unit failed: ${response.status}`);
        const data = await response.json();

        if (data.isComprehensive && Array.isArray(data.sourceUnits)) {
          const sourceUnits = await Promise.all(
            data.sourceUnits.map(async (sourceId) => {
              const sourceResponse = await fetch(`${import.meta.env.BASE_URL}data/units/${sourceId}.json`);
              if (!sourceResponse.ok) throw new Error(`Source unit failed: ${sourceResponse.status}`);
              return sourceResponse.json();
            }),
          );

          setUnit({
            ...data,
            flashcards: shuffleItems(sourceUnits.flatMap((source) => source.flashcards || [])),
            quiz: shuffleItems(sourceUnits.flatMap((source) => source.quiz || [])),
            chart: sourceUnits.flatMap((source) => source.chart || []),
          });
        } else {
          setUnit(data);
        }
      } catch (err) {
        console.error(err);
        setError('ユニットを読み込めませんでした');
      }
    };

    loadUnit();
  }, [id]);

  const activeMode = mode || '';
  const unitColor = unit?.color || '#4ECDC4';

  const content = useMemo(() => {
    if (!unit || !activeMode) return null;
    if (activeMode === 'slides') return <SlideViewer key={unit.id} slides={unit.slides || []} unitColor={unitColor} />;
    if (activeMode === 'flashcards') return <FlashcardDeck key={unit.id} flashcards={unit.flashcards || []} unitColor={unitColor} />;
    if (activeMode === 'chart') return <ClassificationChart key={unit.id} charts={unit.chart || []} unitColor={unitColor} />;
    if (activeMode === 'quiz') return <QuizEngine key={unit.id} questions={unit.quiz || []} unitColor={unitColor} unitId={unit.id} />;
    return null;
  }, [activeMode, unit, unitColor]);

  if (error) {
    return <div className="grid min-h-screen place-items-center px-4 text-muted">{error}</div>;
  }

  if (!unit) {
    return <div className="grid min-h-screen place-items-center px-4 text-muted">読み込み中...</div>;
  }

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-6 md:py-8">
      <header className="flex flex-col gap-4 border-b border-white/10 pb-5">
        <button
          type="button"
          onClick={() => navigate('/')}
          className="flex w-fit items-center gap-2 rounded-lg px-2 py-1 text-sm font-bold text-muted transition hover:bg-white/5 hover:text-white"
        >
          <ArrowLeft size={18} />
          Home
        </button>
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-muted">
              <span>Day {unit.day}</span>
              <span>{unit.emoji}</span>
            </div>
            <h1 className="text-3xl font-black text-white md:text-5xl">{unit.title}</h1>
            <p className="mt-2 text-muted">{unit.subtitle}</p>
          </div>
          <span className="text-sm font-bold text-muted">{unit.quiz?.length || 0} Questions</span>
        </div>
      </header>

      {!activeMode ? (
        <section className="grid gap-4 md:grid-cols-2">
          {modes.map((item) => (
            <Link
              key={item.id}
              to={`/unit/${id}/${item.id}`}
              className="flex min-h-32 items-center gap-4 rounded-lg border border-white/10 bg-card p-5 text-left transition hover:-translate-y-0.5 hover:border-white/25"
            >
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-lg bg-white/10" style={{ color: unitColor }}>
                <item.icon size={26} />
              </span>
              <span className="text-lg font-black text-white">{item.label}</span>
            </Link>
          ))}
        </section>
      ) : (
        <section>{content}</section>
      )}
    </main>
  );
};

export default UnitPage;
