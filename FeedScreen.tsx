import { useState, useCallback, useEffect, useRef } from 'react';
import { useApp } from './AppContext';
import { generateFeedFact, type AIFeedItem } from './lib/ai';
import { MASCOT, ICONS, FEED_CARDS } from './assets';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Bookmark, Zap, HelpCircle, X, Check } from 'lucide-react';
import { toast } from 'sonner';

export default function FeedScreen() {
  const { setScreen, user, preferences, addXP, removeXP, addSavedFact, savedFacts, getRoast } = useApp();
  const [items, setItems] = useState<AIFeedItem[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [loadingMore, setLoadingMore] = useState(false);

  // Quiz Modal State
  const [activeQuizItem, setActiveQuizItem] = useState<AIFeedItem | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [quizResult, setQuizResult] = useState<'none' | 'correct' | 'wrong'>('none');

  const containerRef = useRef<HTMLDivElement>(null);

  // Load initially
  useEffect(() => {
    loadMoreFacts(3);
  }, []);

  const loadMoreFacts = async (count = 1) => {
    if (loadingMore) return;
    setLoadingMore(true);
    const newItems: AIFeedItem[] = [];

    // Fallbacks if AI fails
    const fallbacks: AIFeedItem[] = FEED_CARDS.map((c) => ({
      category: c.category,
      title: c.title,
      content: c.content,
      quiz: {
        type: c.quiz.type as any,
        question: c.quiz.question,
        options: c.quiz.options,
        correct: c.quiz.correct,
      },
    }));

    for (let i = 0; i < count; i++) {
      try {
        const fact = await generateFeedFact(
          preferences.aiUrl,
          user?.grade || '8',
          user?.interests || 'Wissenschaft, Kurioses',
          preferences.language
        );
        if (fact) {
          newItems.push(fact);
        } else {
          newItems.push({ ...fallbacks[Math.floor(Math.random() * fallbacks.length)] });
        }
      } catch {
        newItems.push({ ...fallbacks[Math.floor(Math.random() * fallbacks.length)] });
      }
    }

    setItems((prev) => [...prev, ...newItems]);
    setLoadingMore(false);
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const index = Math.round(el.scrollTop / el.clientHeight);
    if (index !== activeIndex) {
      setActiveIndex(index);
    }
    // Load more when reaching near the end
    if (index >= items.length - 2 && !loadingMore) {
      loadMoreFacts(2);
    }
  };

  const handleSave = (item: AIFeedItem) => {
    const isSaved = savedFacts.some((f) => f.title === item.title);
    if (isSaved) {
      toast('Bereits gespeichert!');
      return;
    }
    addSavedFact({
      category: item.category,
      title: item.title,
      content: item.content,
    });
    toast.success('Fakt gespeichert! 🔖');
  };

  const openQuiz = (item: AIFeedItem) => {
    setActiveQuizItem(item);
    setSelectedAnswer(null);
    setQuizResult('none');
  };

  const handleAnswer = (idx: number) => {
    if (!activeQuizItem) return;
    setSelectedAnswer(idx);
    const correct = idx === activeQuizItem.quiz.correct;
    setQuizResult(correct ? 'correct' : 'wrong');

    if (correct) {
      addXP(25);
      toast.success('+25 XP! 🎉', { description: 'Richtig! Weiter so!' });
    } else {
      removeXP(5);
      toast.error(getRoast(), { description: '-5 XP 💀' });
    }
  };

  const closeQuiz = () => {
    setActiveQuizItem(null);
  };

  return (
    <div className="bg-black text-white h-dvh w-full relative overflow-hidden flex flex-col">
      {/* Header Overlay */}
      <div className="absolute top-0 inset-x-0 z-20 flex items-center justify-between p-5 pt-12">
        <button onClick={() => setScreen('home')} className="w-10 h-10 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center text-white">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-black/50 backdrop-blur-md border border-white/10">
          <img src={ICONS.xp} alt="XP" className="w-5 h-5" />
          <span className="font-display font-bold">{user?.xp || 0} XP</span>
        </div>
      </div>

      {/* Full Screen Scroll Container */}
      <div
        ref={containerRef}
        className="flex-1 overflow-y-scroll snap-y snap-mandatory scrollbar-hide"
        onScroll={handleScroll}
      >
        {items.map((item, idx) => {
          const isSaved = savedFacts.some((f) => f.title === item.title);

          return (
            <div key={idx} className="h-dvh w-full snap-start snap-always relative flex flex-col justify-end pb-24">
              {/* Background gradient color logic based on category, just a subtle glow */}
              <div
                className="absolute inset-0 pointer-events-none opacity-40 mix-blend-screen"
                style={{
                  background: `radial-gradient(circle at 50% 50%, ${idx % 2 === 0 ? 'var(--color-primary)' : 'var(--color-sidebar-primary)'}, transparent 70%)`
                }}
              />

              <div className="relative z-10 px-5 flex items-end justify-between">
                {/* Content Area */}
                <div className="flex-1 pr-12">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full mb-3 text-xs font-display font-medium text-white/90">
                    <Zap className="w-3.5 h-3.5 text-yellow-400" />
                    {item.category}
                  </div>
                  <h2 className="text-3xl font-display font-extrabold mb-3 leading-tight text-white drop-shadow-lg">
                    {item.title}
                  </h2>
                  <p className="text-lg leading-relaxed text-white/90 drop-shadow-md">
                    {item.content}
                  </p>
                </div>

                {/* Right Side Actions */}
                <div className="flex flex-col items-center gap-6 pb-2">
                  <button
                    onClick={() => handleSave(item)}
                    className="flex flex-col items-center gap-1 group"
                  >
                    <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/10 active:scale-95 transition-transform">
                      <Bookmark className={`w-6 h-6 ${isSaved ? 'fill-yellow-400 text-yellow-400' : 'text-white'}`} />
                    </div>
                    <span className="text-[10px] font-bold text-white/80">Save</span>
                  </button>

                  <button
                    onClick={() => openQuiz(item)}
                    className="flex flex-col items-center gap-1 group"
                  >
                    <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center border border-white/20 active:scale-95 transition-transform shadow-[0_0_15px_rgba(255,255,255,0.3)]">
                      <HelpCircle className="w-6 h-6 text-primary-foreground" />
                    </div>
                    <span className="text-[10px] font-bold text-white/80">Quiz</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        {loadingMore && (
          <div className="h-dvh w-full snap-start snap-always relative flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
              <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
              <p className="font-display text-white/70">Wissen wird geladen...</p>
            </div>
          </div>
        )}
      </div>

      {/* Quiz Modal Overlays the Feed */}
      <AnimatePresence>
        {activeQuizItem && (
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="absolute inset-0 z-50 bg-background/95 backdrop-blur-xl flex flex-col"
          >
            <div className="flex justify-between items-center p-5 pt-12 border-b border-white/10">
              <span className="font-display font-bold text-lg text-primary">Quiz Time!</span>
              <button onClick={closeQuiz} className="p-2 bg-white/10 rounded-full active:scale-95">
                <X className="w-5 h-5 text-white" />
              </button>
            </div>

            <div className="flex-1 p-6 overflow-y-auto flex flex-col justify-center">
              <h3 className="font-display text-2xl font-extrabold leading-tight mb-8 text-center text-foreground">
                {activeQuizItem.quiz.question}
              </h3>

              <div className="space-y-4 w-full max-w-sm mx-auto">
                {activeQuizItem.quiz.options.map((opt, idx) => {
                  const isSelected = selectedAnswer === idx;
                  const isRight = idx === activeQuizItem.quiz.correct;

                  let bgClasses = 'bg-card border-border hover:border-primary/50 text-foreground';

                  if (selectedAnswer !== null) {
                    if (isRight) {
                      bgClasses = 'bg-green-500/20 border-green-500 text-green-400';
                    } else if (isSelected && !isRight) {
                      bgClasses = 'bg-red-500/20 border-red-500 text-red-400';
                    } else {
                      bgClasses = 'bg-card border-border opacity-50 text-foreground';
                    }
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => selectedAnswer === null && handleAnswer(idx)}
                      disabled={selectedAnswer !== null}
                      className={`w-full text-left px-5 py-4 rounded-2xl border-2 text-base font-medium transition-all active:scale-[0.98] ${bgClasses}`}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>

              <AnimatePresence>
                {quizResult !== 'none' && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    className="mt-10 flex flex-col items-center"
                  >
                    <img
                      src={quizResult === 'correct' ? MASCOT.happy : MASCOT.crying}
                      alt="Fynix Result"
                      className="w-32 h-32 object-contain drop-shadow-2xl mb-4"
                    />
                    <button
                      onClick={closeQuiz}
                      className="mt-4 px-8 py-3 bg-primary text-primary-foreground font-display font-bold rounded-full active:scale-95"
                    >
                      Weiter
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div >
  );
}
