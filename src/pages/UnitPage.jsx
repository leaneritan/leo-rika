import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, BookOpen, Layers, Clock, CheckCircle2 } from 'lucide-react';
import SlideViewer from '../components/SlideViewer';
import FlashcardDeck from '../components/FlashcardDeck';
import Timeline from '../components/Timeline';
import QuizEngine from '../components/QuizEngine';
import { useProgress } from '../hooks/useProgress';

const shuffleItems = (items) => {
  const shuffled = [...items];
  for (let i = shuffled.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const UnitPage = ({ activeTab: initialTab }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [unit, setUnit] = useState(null);
  const [activeTab, setActiveTab] = useState(initialTab || 'slides');
  const [loading, setLoading] = useState(true);
  const { progress } = useProgress();

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  useEffect(() => {
    const loadUnit = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${import.meta.env.BASE_URL}data/units/${id}.json`);
        const data = await response.json();

        if (data.isComprehensive) {
          const sourceUnits = [];
          for (const sourceId of data.sourceUnits) {
            const res = await fetch(`${import.meta.env.BASE_URL}data/units/${sourceId}.json`);
            sourceUnits.push(await res.json());
          }

          const allQuestions = sourceUnits.flatMap(u => u.quiz || []);
          const allFlashcards = sourceUnits.flatMap(u => u.flashcards || []);

          setUnit({
            ...data,
            quiz: shuffleItems(allQuestions),
            flashcards: shuffleItems(allFlashcards),
            color: '#FFD700'
          });
        } else {
          setUnit(data);
        }
      } catch (error) {
        console.error('Failed to load unit data', error);
      } finally {
        setLoading(false);
      }
    };
    loadUnit();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-4 border-t-[#FFD700] border-white/10 animate-spin"></div>
          <p className="text-muted font-mono">LOADING UNIT...</p>
        </div>
      </div>
    );
  }

  if (!unit) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8 text-center space-y-6">
        <h1 className="text-4xl font-bold text-white">ユニットが見つかりません</h1>
        <button onClick={() => navigate('/')} className="btn-primary bg-white/10 text-white">ホームに戻る</button>
      </div>
    );
  }

  const tabs = [
    { id: 'slides', label: 'スライド', icon: BookOpen },
    { id: 'flashcards', label: 'フラッシュカード', icon: Layers },
    { id: 'timeline', label: '年表', icon: Clock },
    { id: 'quiz', label: 'クイズ', icon: CheckCircle2 },
  ];

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    navigate(`/unit/${id}/${tabId}`);
  };

  const unitColor = unit.isComprehensive ? '#FFD700' : (unit.color || '#4a9eff');

  return (
    <div className="min-h-screen flex flex-col bg-[#090b18]">
      {/* Header */}
      <header className="sticky top-0 z-20 glass border-b border-white/5">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4 text-white">
            <button
              onClick={() => navigate('/')}
              className="p-2 hover:bg-white/5 rounded-full transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-white/10 text-muted uppercase">
                  Day {unit.day}
                </span>
                <h1 className="font-bold text-sm md:text-base">{unit.title}</h1>
              </div>
            </div>
          </div>

          <div className="hidden md:flex gap-4 text-white">
             <div className="text-right">
                <div className="text-[10px] font-bold text-muted uppercase">Progress</div>
                <div className="text-xs font-mono">
                  Q: {progress.quiz[unit.id]?.correct || 0} / {unit.quiz.length}
                </div>
             </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="container mx-auto px-4 flex gap-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`flex-1 py-3 flex flex-col md:flex-row items-center justify-center gap-2 border-b-2 transition-all ${
                activeTab === tab.id
                  ? 'border-white text-white'
                  : 'border-transparent text-muted hover:text-text'
              }`}
              style={activeTab === tab.id ? { borderBottomColor: unitColor } : {}}
            >
              <tab.icon size={18} />
              <span className="text-[10px] md:text-sm font-bold uppercase tracking-wider">{tab.label}</span>
            </button>
          ))}
        </div>
      </header>

      {/* Content Area */}
      <main className="flex-1 container mx-auto px-4 py-8 text-white">
        <div className="max-w-4xl mx-auto">
          {activeTab === 'slides' && <SlideViewer slides={unit.slides} unitColor={unitColor} />}
          {activeTab === 'flashcards' && <FlashcardDeck flashcards={unit.flashcards} unitColor={unitColor} unitId={unit.id} />}
          {activeTab === 'timeline' && <Timeline events={unit.timeline} unitColor={unitColor} />}
          {activeTab === 'quiz' && <QuizEngine questions={unit.quiz} unitColor={unitColor} unitId={unit.id} />}
        </div>
      </main>
    </div>
  );
};

export default UnitPage;
