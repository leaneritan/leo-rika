import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import ProgressBar from './ProgressBar';

const UnitCard = ({ unit, progress }) => {
  const isComprehensive = unit.day === 4 || unit.isComprehensive;
  const score = progress?.score || 0;
  const total = progress?.total || unit.questionCount || 0;

  return (
    <Link
      to={`/unit/${unit.id}`}
      className={`group flex min-h-56 flex-col justify-between rounded-lg border bg-card p-5 transition hover:-translate-y-0.5 hover:border-white/25 ${
        isComprehensive ? 'border-gold shadow-[0_0_0_1px_rgba(255,215,0,0.25)]' : 'border-white/10'
      }`}
      style={{ borderTopColor: unit.color, borderTopWidth: 4 }}
    >
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <span className="text-4xl leading-none">{unit.emoji}</span>
          <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-muted">
            Day {unit.day}{isComprehensive ? ' 🏆' : ''}
          </span>
        </div>

        <div>
          <h2 className="text-xl font-black text-white">{unit.title}</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted">{unit.subtitle}</p>
        </div>
      </div>

      <div className="mt-6 space-y-3">
        <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-muted">
          <span>{unit.questionCount} Questions</span>
          <span>{score} / {total || '-'}</span>
        </div>
        <ProgressBar current={score} total={total || 1} color={unit.color || '#4ECDC4'} />
        <div className="flex items-center justify-end text-sm font-bold text-white">
          <span>Start</span>
          <ChevronRight className="ml-1 transition group-hover:translate-x-1" size={18} />
        </div>
      </div>
    </Link>
  );
};

export default UnitCard;
