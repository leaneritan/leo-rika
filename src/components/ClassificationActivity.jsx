import { useEffect, useMemo, useState } from 'react';
import { CheckCircle2, PartyPopper, RotateCcw, XCircle } from 'lucide-react';
import { useProgress } from '../hooks/useProgress';

const branchKey = (path) => path.join('-');

const annotateBranches = (branches, parentPath = []) => branches.map((branch, index) => {
  const path = [...parentPath, index];
  return {
    ...branch,
    key: branchKey(path),
    path,
    branches: annotateBranches(branch.branches || [], path),
  };
});

const collectBranchMap = (branches, map = {}) => {
  branches.forEach((branch) => {
    map[branch.key] = branch;
    collectBranchMap(branch.branches || [], map);
  });
  return map;
};

const findDeepestBranchKey = (branches, organismId) => {
  for (const branch of branches) {
    if (!branch.correct.includes(organismId)) continue;
    const childMatch = findDeepestBranchKey(branch.branches || [], organismId);
    return childMatch || branch.key;
  }
  return null;
};

const findPlacedKey = (placements, organismId) => (
  Object.entries(placements).find(([, ids]) => ids.includes(organismId))?.[0] || null
);

const removeFromPlacements = (placements, organismId) => (
  Object.fromEntries(
    Object.entries(placements)
      .map(([key, ids]) => [key, ids.filter((id) => id !== organismId)])
      .filter(([, ids]) => ids.length > 0),
  )
);

const StickyCard = ({ organism, isSelected, isSmall, onClick, draggable = true, onDragStart }) => (
  <button
    type="button"
    draggable={draggable}
    onDragStart={(event) => onDragStart?.(event, organism.id)}
    onClick={(event) => {
      event.stopPropagation();
      onClick?.(organism.id);
    }}
    className={`sticky-note ${isSmall ? 'sticky-note-small' : ''} ${isSelected ? 'sticky-note-selected' : ''}`}
    style={{ backgroundColor: `${organism.color}cc` }}
  >
    {organism.name}
  </button>
);

const FeedbackBadge = ({ state }) => {
  if (state === 'correct') return <CheckCircle2 className="absolute right-3 top-3 text-green-300" size={22} />;
  if (state === 'wrong') return <XCircle className="absolute right-3 top-3 text-red-300" size={22} />;
  return null;
};

const BranchZone = ({
  branch,
  organismsById,
  placements,
  selectedId,
  feedback,
  isUnlocked,
  onCardSelect,
  onDropOrganism,
  onDragStart,
}) => {
  const placedIds = placements[branch.key] || [];
  const hasPlaced = placedIds.length > 0;
  const isExpanded = hasPlaced && branch.branches.length > 0;
  const zoneFeedback = feedback?.branchKey === branch.key ? feedback.type : null;

  const handleDrop = (event) => {
    event.preventDefault();
    if (!isUnlocked) return;
    const organismId = event.dataTransfer.getData('text/plain');
    if (organismId) onDropOrganism(organismId, branch);
  };

  return (
    <div className="classification-branch-wrap">
      <div
        role="button"
        tabIndex={isUnlocked ? 0 : -1}
        aria-disabled={!isUnlocked}
        onClick={() => {
          if (selectedId && isUnlocked) onDropOrganism(selectedId, branch);
        }}
        onKeyDown={(event) => {
          if ((event.key === 'Enter' || event.key === ' ') && selectedId && isUnlocked) {
            event.preventDefault();
            onDropOrganism(selectedId, branch);
          }
        }}
        onDragOver={(event) => {
          if (isUnlocked) event.preventDefault();
        }}
        onDrop={handleDrop}
        className={`classification-zone ${!isUnlocked ? 'classification-zone-locked' : ''} ${zoneFeedback === 'correct' ? 'classification-zone-correct' : ''} ${zoneFeedback === 'wrong' ? 'classification-zone-wrong' : ''}`}
      >
        <FeedbackBadge state={zoneFeedback} />
        <span className="text-xs font-black uppercase tracking-wider text-muted">グループ</span>
        <strong className="mt-1 block text-lg text-white">{branch.label}</strong>
        <div className="mt-4 flex min-h-14 flex-wrap gap-2">
          {placedIds.map((id) => (
            <StickyCard
              key={id}
              organism={organismsById[id]}
              isSelected={selectedId === id}
              isSmall
              onClick={onCardSelect}
              onDragStart={onDragStart}
            />
          ))}
          {!placedIds.length && <span className="text-sm text-muted">ここに置く</span>}
        </div>
      </div>

      {isExpanded && (
        <div className="classification-children">
          <div className="classification-line" />
          <div className="rounded-full border border-white/10 bg-background px-4 py-2 text-center text-sm font-black text-gold">
            {branch.question}
          </div>
          <div className="classification-child-grid">
            {branch.branches.map((child) => (
              <BranchZone
                key={child.key}
                branch={child}
                organismsById={organismsById}
                placements={placements}
                selectedId={selectedId}
                feedback={feedback}
                isUnlocked={hasPlaced}
                onCardSelect={onCardSelect}
                onDropOrganism={onDropOrganism}
                onDragStart={onDragStart}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const ClassificationActivity = ({ activities, unitId }) => {
  const activity = activities?.find((item) => item.type === 'classification');
  const { markComplete } = useProgress();
  const [selectedId, setSelectedId] = useState(null);
  const [placements, setPlacements] = useState({});
  const [feedback, setFeedback] = useState(null);
  const [isComplete, setIsComplete] = useState(false);

  const branches = useMemo(() => annotateBranches(activity?.tree?.branches || []), [activity]);
  const branchMap = useMemo(() => collectBranchMap(branches), [branches]);
  const organismsById = useMemo(
    () => Object.fromEntries((activity?.organisms || []).map((organism) => [organism.id, organism])),
    [activity],
  );
  const deepestBranchByOrganism = useMemo(
    () => Object.fromEntries((activity?.organisms || []).map((organism) => [organism.id, findDeepestBranchKey(branches, organism.id)])),
    [activity, branches],
  );

  const placedIds = useMemo(
    () => new Set(Object.values(placements).flat()),
    [placements],
  );
  const completedIds = useMemo(
    () => new Set(Object.entries(placements).flatMap(([key, ids]) => ids.filter((id) => deepestBranchByOrganism[id] === key))),
    [placements, deepestBranchByOrganism],
  );
  const availableOrganisms = (activity?.organisms || []).filter((organism) => !placedIds.has(organism.id));

  useEffect(() => {
    if (!activity || isComplete || completedIds.size !== activity.organisms.length) return;
    setIsComplete(true);
    markComplete(`${unitId}-activity`, activity.organisms.length, activity.organisms.length);
  }, [activity, completedIds.size, isComplete, markComplete, unitId]);

  if (!activity) {
    return <div className="rounded-lg border border-white/10 bg-card p-6 text-muted">分類アクティビティがありません</div>;
  }

  const flashFeedback = (branchKeyValue, type) => {
    setFeedback({ branchKey: branchKeyValue, type });
    window.setTimeout(() => setFeedback(null), 700);
  };

  const selectCard = (organismId) => {
    setSelectedId((current) => (current === organismId ? null : organismId));
  };

  const handleDragStart = (event, organismId) => {
    event.dataTransfer.setData('text/plain', organismId);
    event.dataTransfer.effectAllowed = 'move';
    setSelectedId(organismId);
  };

  const placeOrganism = (organismId, branch) => {
    if (!branch.correct.includes(organismId)) {
      setPlacements((current) => removeFromPlacements(current, organismId));
      flashFeedback(branch.key, 'wrong');
      setSelectedId(organismId);
      return;
    }

    const currentBranchKey = findPlacedKey(placements, organismId);
    if (currentBranchKey) {
      const currentBranch = branchMap[currentBranchKey];
      const canMoveToChild = branch.path.length === currentBranch.path.length + 1
        && branch.path.slice(0, currentBranch.path.length).every((part, index) => part === currentBranch.path[index]);
      if (!canMoveToChild) {
        setPlacements((current) => removeFromPlacements(current, organismId));
        flashFeedback(branch.key, 'wrong');
        setSelectedId(organismId);
        return;
      }
    } else if (branch.path.length > 1) {
      setPlacements((current) => removeFromPlacements(current, organismId));
      flashFeedback(branch.key, 'wrong');
      setSelectedId(organismId);
      return;
    }

    setPlacements((current) => ({
      ...removeFromPlacements(current, organismId),
      [branch.key]: [...(current[branch.key] || []).filter((id) => id !== organismId), organismId],
    }));
    setSelectedId(null);
    flashFeedback(branch.key, 'correct');
  };

  const reset = () => {
    setSelectedId(null);
    setPlacements({});
    setFeedback(null);
    setIsComplete(false);
  };

  return (
    <div className="space-y-6">
      <header className="rounded-lg border border-white/10 bg-card p-5">
        <p className="text-sm font-black uppercase tracking-[0.2em] text-teal">分類アクティビティ</p>
        <h2 className="mt-2 text-3xl font-black text-white">{activity.title}</h2>
        <p className="mt-2 text-muted">{activity.instruction}</p>
      </header>

      <section className="rounded-lg border border-white/10 bg-card p-4">
        <div className="mb-3 flex items-center justify-between gap-3">
          <h3 className="font-black text-white">付箋カード</h3>
          <span className="text-sm text-muted">{completedIds.size} / {activity.organisms.length}</span>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-2">
          {availableOrganisms.map((organism) => (
            <StickyCard
              key={organism.id}
              organism={organism}
              isSelected={selectedId === organism.id}
              onClick={selectCard}
              onDragStart={handleDragStart}
            />
          ))}
        </div>
      </section>

      <section className="rounded-lg border border-white/10 bg-card p-4 md:p-6">
        <h3 className="mb-5 text-center text-xl font-black text-gold">{activity.tree.question}</h3>
        <div className="classification-root-grid">
          {branches.map((branch) => (
            <BranchZone
              key={branch.key}
              branch={branch}
              organismsById={organismsById}
              placements={placements}
              selectedId={selectedId}
              feedback={feedback}
              isUnlocked
              onCardSelect={selectCard}
              onDropOrganism={placeOrganism}
              onDragStart={handleDragStart}
            />
          ))}
        </div>
      </section>

      {isComplete && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-background/90 p-4 backdrop-blur">
          <div className="w-full max-w-md rounded-lg border border-gold/60 bg-card p-8 text-center shadow-2xl">
            <PartyPopper className="mx-auto text-gold" size={52} />
            <h2 className="mt-4 text-3xl font-black text-white">完成！</h2>
            <p className="mt-2 text-muted">全部の生物を正しく分類できました。</p>
            <button type="button" onClick={reset} className="btn-primary mt-6 bg-gold text-background">
              <RotateCcw className="mr-2 inline" size={18} />
              もう一度！
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClassificationActivity;
