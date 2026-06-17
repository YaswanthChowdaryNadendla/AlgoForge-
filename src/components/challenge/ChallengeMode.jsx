import { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Brain, Trophy, CheckCircle, XCircle, ArrowRight,
  RotateCcw, Zap, Clock, BarChart3, Award, Trash2
} from 'lucide-react';
import GlassCard from '../ui/GlassCard';
import GlowButton from '../ui/GlowButton';
import Badge from '../ui/Badge';

const LOCAL_ACTIVE_KEY = 'algoForge_active_quiz';
const LOCAL_STATS_KEY = 'algoForge_quiz_stats';

const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

function loadActiveState() {
  try {
    const data = localStorage.getItem(LOCAL_ACTIVE_KEY);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}

function saveActiveState(state) {
  try {
    localStorage.setItem(LOCAL_ACTIVE_KEY, JSON.stringify(state));
  } catch (e) {
    console.error(e);
  }
}

function clearActiveState() {
  try {
    localStorage.removeItem(LOCAL_ACTIVE_KEY);
  } catch (e) {
    console.error(e);
  }
}

function loadUserStats() {
  try {
    const data = localStorage.getItem(LOCAL_STATS_KEY);
    if (data) return JSON.parse(data);
  } catch (e) {
    console.error(e);
  }
  return {
    highScores: { all: 0, easy: 0, medium: 0, hard: 0 },
    quizzesCompleted: 0,
    totalCorrect: 0,
    totalAnswered: 0,
    categoryPerformance: {},
  };
}

function saveUserStats(stats) {
  try {
    localStorage.setItem(LOCAL_STATS_KEY, JSON.stringify(stats));
  } catch (e) {
    console.error(e);
  }
}

export default function ChallengeMode() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [phase, setPhase] = useState('config'); // config, active, results
  const [difficulty, setDifficulty] = useState('all');
  const [activeQuestions, setActiveQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [revealed, setRevealed] = useState(false);
  const [userAnswers, setUserAnswers] = useState([]);
  const [score, setScore] = useState(0);
  const [userStats, setUserStats] = useState(loadUserStats);

  // Lazy load question data on mount
  useEffect(() => {
    import('../../data/questions.json')
      .then((data) => {
        setQuestions(data.default);
        setLoading(false);

        // Resume active quiz from Local Storage if it exists
        const saved = loadActiveState();
        if (saved) {
          setPhase('active');
          setDifficulty(saved.difficulty);
          setActiveQuestions(saved.questions);
          setCurrentIndex(saved.index);
          setUserAnswers(saved.userAnswers);
          setScore(saved.score);
          setSelectedOption(saved.selectedOption);
          setRevealed(saved.revealed);
        }
      })
      .catch((err) => {
        console.error('Failed to load questions:', err);
        setLoading(false);
      });
  }, []);

  const handleStartQuiz = useCallback((selectedDiff) => {
    const pool = selectedDiff === 'all'
      ? questions
      : questions.filter((q) => q.difficulty === selectedDiff);

    if (pool.length === 0) return;

    // Select up to 10 random questions, shuffle, and randomize option orders
    const shuffledPool = [...pool].sort(() => Math.random() - 0.5);
    const quizLength = Math.min(10, shuffledPool.length);
    const selectedQuestions = shuffledPool.slice(0, quizLength).map((q) => {
      const correctVal = q.options[q.correctIndex];
      const shuffledOptions = [...q.options].sort(() => Math.random() - 0.5);
      const newCorrectIndex = shuffledOptions.indexOf(correctVal);
      return {
        ...q,
        options: shuffledOptions,
        correctIndex: newCorrectIndex,
      };
    });

    setDifficulty(selectedDiff);
    setActiveQuestions(selectedQuestions);
    setCurrentIndex(0);
    setSelectedOption(null);
    setRevealed(false);
    setUserAnswers([]);
    setScore(0);
    setPhase('active');

    saveActiveState({
      difficulty: selectedDiff,
      questions: selectedQuestions,
      index: 0,
      userAnswers: [],
      score: 0,
      selectedOption: null,
      revealed: false,
    });
  }, [questions]);

  const handleSelectOption = useCallback((index) => {
    if (revealed) return;
    setSelectedOption(index);
  }, [revealed]);

  const handleSubmitAnswer = useCallback(() => {
    if (selectedOption === null || revealed) return;

    const currentQ = activeQuestions[currentIndex];
    const isCorrect = selectedOption === currentQ.correctIndex;
    const newScore = score + (isCorrect ? 1 : 0);
    const currentAnswer = {
      question: currentQ,
      selectedIndex: selectedOption,
      correctIndex: currentQ.correctIndex,
      isCorrect,
    };

    const newAnswers = [...userAnswers, currentAnswer];

    setScore(newScore);
    setRevealed(true);
    setUserAnswers(newAnswers);

    // Save active state intermediate progress
    saveActiveState({
      difficulty,
      questions: activeQuestions,
      index: currentIndex,
      userAnswers: newAnswers,
      score: newScore,
      selectedOption,
      revealed: true,
    });
  }, [selectedOption, revealed, activeQuestions, currentIndex, score, userAnswers, difficulty]);

  const handleNextQuestion = useCallback(() => {
    if (!revealed) return;

    const nextIndex = currentIndex + 1;
    if (nextIndex < activeQuestions.length) {
      setCurrentIndex(nextIndex);
      setSelectedOption(null);
      setRevealed(false);

      saveActiveState({
        difficulty,
        questions: activeQuestions,
        index: nextIndex,
        userAnswers,
        score,
        selectedOption: null,
        revealed: false,
      });
    } else {
      // Completed the quiz! Calculate and save final user stats
      const finalScore = score;
      const totalQs = activeQuestions.length;
      
      const newStats = { ...userStats };
      newStats.quizzesCompleted += 1;
      newStats.totalCorrect += finalScore;
      newStats.totalAnswered += totalQs;

      // Update high scores
      if (finalScore > (newStats.highScores[difficulty] || 0)) {
        newStats.highScores[difficulty] = finalScore;
      }

      // Update topic stats
      userAnswers.forEach((ans) => {
        const cat = ans.question.category;
        if (!newStats.categoryPerformance[cat]) {
          newStats.categoryPerformance[cat] = { correct: 0, total: 0 };
        }
        newStats.categoryPerformance[cat].total += 1;
        if (ans.isCorrect) {
          newStats.categoryPerformance[cat].correct += 1;
        }
      });

      setUserStats(newStats);
      saveUserStats(newStats);
      clearActiveState();
      setPhase('results');
    }
  }, [revealed, currentIndex, activeQuestions, userAnswers, score, difficulty, userStats]);

  const handleRestartQuiz = useCallback(() => {
    clearActiveState();
    setPhase('config');
    setSelectedOption(null);
    setRevealed(false);
    setUserAnswers([]);
    setScore(0);
  }, []);

  const handleClearStats = useCallback(() => {
    if (window.confirm('Are you sure you want to reset all your learning statistics and high scores?')) {
      const resetStats = {
        highScores: { all: 0, easy: 0, medium: 0, hard: 0 },
        quizzesCompleted: 0,
        totalCorrect: 0,
        totalAnswered: 0,
        categoryPerformance: {},
      };
      setUserStats(resetStats);
      saveUserStats(resetStats);
    }
  }, []);

  // Compute stats for results screen
  const topicStats = useMemo(() => {
    const stats = {};
    userAnswers.forEach((ans) => {
      const cat = ans.question.category;
      const topicLabel = cat.charAt(0).toUpperCase() + cat.slice(1);
      if (!stats[topicLabel]) {
        stats[topicLabel] = { correct: 0, total: 0 };
      }
      stats[topicLabel].total += 1;
      if (ans.isCorrect) {
        stats[topicLabel].correct += 1;
      }
    });
    return Object.entries(stats).map(([name, val]) => ({
      name,
      ...val,
      percentage: Math.round((val.correct / val.total) * 100),
    }));
  }, [userAnswers]);

  const difficultyStats = useMemo(() => {
    const stats = { easy: { correct: 0, total: 0 }, medium: { correct: 0, total: 0 }, hard: { correct: 0, total: 0 } };
    userAnswers.forEach((ans) => {
      const diff = ans.question.difficulty;
      if (stats[diff]) {
        stats[diff].total += 1;
        if (ans.isCorrect) {
          stats[diff].correct += 1;
        }
      }
    });
    return Object.entries(stats).filter(([_, val]) => val.total > 0).map(([name, val]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      ...val,
      percentage: Math.round((val.correct / val.total) * 100),
    }));
  }, [userAnswers]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 rounded-full border-2 border-primary/20 border-t-primary animate-spin" />
          <p className="text-slate-500 text-sm animate-pulse">Loading question database...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-white">
          Challenge <span className="gradient-text">Mode</span>
        </h1>
        <p className="text-slate-500 text-sm mt-1">Test your DSA knowledge on the interactive AlgoForge Challenge engine</p>
      </div>

      <AnimatePresence mode="wait">
        {/* PHASE 1: CONFIG SCREEN */}
        {phase === 'config' && (
          <motion.div
            key="config"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-6"
          >
            {/* Setup selection panel */}
            <GlassCard hover={false} className="lg:col-span-2 p-6 space-y-6 flex flex-col justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-200 mb-3 flex items-center gap-2">
                  <Brain className="w-5 h-5 text-primary" /> Start a Practice Quiz
                </h2>
                <p className="text-slate-400 text-sm leading-relaxed mb-6">
                  Pick a difficulty level below. We will randomly select 10 practice questions from our bank spanning
                  Sorting, Searching, Lists, Stacks, Queues, Binary Trees, Graph traversals, and Complexity analysis.
                </p>

                {/* Difficulty options */}
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  {[
                    { key: 'all', label: 'All Levels', desc: 'Mix of everything', color: 'bg-primary/10 border-primary/20 text-primary' },
                    { key: 'easy', label: 'Easy', desc: 'Fundamental concepts', color: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' },
                    { key: 'medium', label: 'Medium', desc: 'Algorithm applications', color: 'bg-amber-500/10 border-amber-500/20 text-amber-400' },
                    { key: 'hard', label: 'Hard', desc: 'Complex runtimes & math', color: 'bg-rose-500/10 border-rose-500/20 text-rose-400' },
                  ].map((lvl) => (
                    <button
                      key={lvl.key}
                      onClick={() => setDifficulty(lvl.key)}
                      className={`p-4 rounded-xl border text-left transition-all duration-200 flex flex-col justify-between h-24
                        ${difficulty === lvl.key
                          ? 'bg-primary/20 border-primary/50 text-white scale-[1.02] shadow-glow-sm'
                          : 'bg-white/[0.02] border-white/[0.05] text-slate-400 hover:bg-white/[0.04]'
                        }`}
                    >
                      <span className="text-sm font-bold block">{lvl.label}</span>
                      <span className="text-[10px] text-slate-500 leading-snug">{lvl.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-6 border-t border-white/[0.04] flex justify-end">
                <GlowButton variant="primary" size="lg" icon={ArrowRight} onClick={() => handleStartQuiz(difficulty)}>
                  Start Quiz
                </GlowButton>
              </div>
            </GlassCard>

            {/* User Performance History Panel */}
            <GlassCard hover={false} className="p-6 space-y-6 flex flex-col justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-200 mb-4 flex items-center gap-2">
                  <Award className="w-5 h-5 text-amber-400" /> Your Progress
                </h2>

                <div className="space-y-4">
                  <div className="flex items-center justify-between py-2 border-b border-white/[0.04]">
                    <span className="text-xs text-slate-500 font-medium">Quizzes Completed</span>
                    <span className="text-sm font-mono font-bold text-slate-200">{userStats.quizzesCompleted}</span>
                  </div>

                  <div className="flex items-center justify-between py-2 border-b border-white/[0.04]">
                    <span className="text-xs text-slate-500 font-medium">Overall Accuracy</span>
                    <span className="text-sm font-mono font-bold text-slate-200">
                      {userStats.totalAnswered > 0
                        ? `${Math.round((userStats.totalCorrect / userStats.totalAnswered) * 100)}%`
                        : 'N/A'}
                    </span>
                  </div>

                  {/* High Scores breakdown */}
                  <div className="pt-2">
                    <span className="text-xs text-slate-400 font-bold block mb-2">High Scores (Max 10)</span>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      {Object.entries(userStats.highScores).map(([k, val]) => (
                        <div key={k} className="p-2 rounded-lg bg-white/[0.02] border border-white/[0.04] flex justify-between items-center">
                          <span className="capitalize text-slate-500 font-medium">{k}</span>
                          <span className="font-mono font-bold text-slate-300">{val}/10</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {userStats.quizzesCompleted > 0 && (
                <button
                  onClick={handleClearStats}
                  className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold
                             bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 text-red-400 transition-colors mt-4"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Reset All Statistics
                </button>
              )}
            </GlassCard>
          </motion.div>
        )}

        {/* PHASE 2: ACTIVE QUIZ SCREEN */}
        {phase === 'active' && activeQuestions.length > 0 && (
          <motion.div
            key="active"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-6"
          >
            {/* Main Question Card */}
            <GlassCard hover={false} className="lg:col-span-2 p-6 flex flex-col justify-between min-h-[460px]">
              <div>
                {/* Meta details */}
                <div className="flex items-center justify-between mb-5 border-b border-white/[0.04] pb-3 shrink-0">
                  <div className="flex items-center gap-2">
                    <Badge variant="info">{activeQuestions[currentIndex].topic}</Badge>
                    <Badge
                      variant={
                        activeQuestions[currentIndex].difficulty === 'easy'
                          ? 'best'
                          : activeQuestions[currentIndex].difficulty === 'medium'
                            ? 'average'
                            : 'worst'
                      }
                    >
                      {activeQuestions[currentIndex].difficulty}
                    </Badge>
                  </div>
                  <span className="text-xs font-mono text-slate-500">
                    Question {currentIndex + 1} of {activeQuestions.length}
                  </span>
                </div>

                {/* Progress bar */}
                <div className="w-full h-1.5 bg-white/[0.04] rounded-full overflow-hidden mb-6 shrink-0">
                  <div
                    className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-300"
                    style={{ width: `${((currentIndex) / activeQuestions.length) * 100}%` }}
                  />
                </div>

                {/* Question */}
                <h2 className="text-base sm:text-lg font-bold text-slate-100 leading-relaxed mb-6 whitespace-pre-line text-balance font-sans">
                  {activeQuestions[currentIndex].question}
                </h2>

                {/* Answer Options */}
                <div className="space-y-3.5">
                  {activeQuestions[currentIndex].options.map((option, index) => {
                    let optionClass = 'border-white/[0.06] bg-white/[0.015] text-slate-300 hover:bg-white/[0.04] hover:border-white/[0.1]';
                    if (selectedOption === index && !revealed) {
                      optionClass = 'border-primary/50 bg-primary/10 text-white shadow-glow-sm';
                    }
                    if (revealed) {
                      if (index === activeQuestions[currentIndex].correctIndex) {
                        optionClass = 'border-emerald-500/50 bg-emerald-500/10 text-emerald-300';
                      } else if (index === selectedOption && index !== activeQuestions[currentIndex].correctIndex) {
                        optionClass = 'border-red-500/50 bg-red-500/10 text-red-300';
                      } else {
                        optionClass = 'border-white/[0.03] bg-white/[0.005] text-slate-500 pointer-events-none';
                      }
                    }

                    return (
                      <button
                        key={index}
                        onClick={() => handleSelectOption(index)}
                        disabled={revealed}
                        className={`w-full text-left flex items-center gap-3.5 px-4 py-3.5 rounded-xl border transition-all duration-200 ${optionClass}`}
                      >
                        <span className="w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold bg-white/[0.04] shrink-0 font-mono text-slate-400">
                          {String.fromCharCode(65 + index)}
                        </span>
                        <span className="text-xs sm:text-sm leading-relaxed">{option}</span>
                        {revealed && index === activeQuestions[currentIndex].correctIndex && (
                          <CheckCircle className="w-4 h-4 text-emerald-400 ml-auto shrink-0" />
                        )}
                        {revealed && index === selectedOption && index !== activeQuestions[currentIndex].correctIndex && (
                          <XCircle className="w-4 h-4 text-red-400 ml-auto shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex gap-3 pt-6 border-t border-white/[0.04] mt-8 shrink-0 justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500">Correct:</span>
                  <span className="text-xs font-bold text-emerald-400 font-mono">{score}</span>
                  <span className="text-xs text-slate-500 ml-1">Remaining:</span>
                  <span className="text-xs font-bold text-slate-300 font-mono">
                    {activeQuestions.length - (revealed ? currentIndex + 1 : currentIndex)}
                  </span>
                </div>

                <div>
                  {!revealed ? (
                    <GlowButton variant="primary" onClick={handleSubmitAnswer} disabled={selectedOption === null}>
                      Submit Answer
                    </GlowButton>
                  ) : (
                    <GlowButton
                      variant="primary"
                      icon={ArrowRight}
                      onClick={handleNextQuestion}
                    >
                      {currentIndex === activeQuestions.length - 1 ? 'Finish Quiz' : 'Next Question'}
                    </GlowButton>
                  )}
                </div>
              </div>
            </GlassCard>

            {/* Explanation side panel */}
            <div className="flex flex-col gap-4">
              <AnimatePresence mode="wait">
                {revealed ? (
                  <motion.div
                    key="explain-box"
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.2 }}
                  >
                    <GlassCard hover={false} className="p-5 space-y-4">
                      <div className={`flex items-center gap-2 text-sm font-bold
                        ${selectedOption === activeQuestions[currentIndex].correctIndex ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {selectedOption === activeQuestions[currentIndex].correctIndex
                          ? <CheckCircle className="w-4 h-4" />
                          : <XCircle className="w-4 h-4" />
                        }
                        <span>
                          {selectedOption === activeQuestions[currentIndex].correctIndex
                            ? 'Correct Answer!'
                            : 'Incorrect Answer'
                          }
                        </span>
                      </div>
                      <p className="text-slate-300 text-xs sm:text-sm leading-relaxed whitespace-pre-line font-sans">
                        {activeQuestions[currentIndex].explanation}
                      </p>
                    </GlassCard>
                  </motion.div>
                ) : (
                  <motion.div
                    key="instruct-box"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    <GlassCard hover={false} className="p-5 border border-dashed border-white/[0.04]">
                      <h3 className="text-xs font-bold text-slate-400 mb-2 uppercase tracking-wide">Instructions</h3>
                      <ul className="text-slate-500 text-xs space-y-2 leading-relaxed">
                        <li>• Read the question carefully.</li>
                        <li>• Select one of the answer options above.</li>
                        <li>• Click "Submit Answer" to check correctness.</li>
                        <li>• An educational explanation will appear here immediately after submission.</li>
                      </ul>
                    </GlassCard>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Quit quiz safety */}
              <button
                onClick={handleRestartQuiz}
                className="flex items-center justify-center gap-1.5 py-3 rounded-xl text-xs font-semibold
                           bg-white/[0.02] border border-white/[0.06] hover:bg-white/[0.05] text-slate-400 hover:text-white transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Abandon Quiz & Return
              </button>
            </div>
          </motion.div>
        )}

        {/* PHASE 3: RESULTS SCREEN */}
        {phase === 'results' && (
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-6"
          >
            {/* Performance Overview */}
            <GlassCard hover={false} className="p-6 text-center space-y-6 flex flex-col items-center justify-center min-h-[360px]">
              <div className="relative">
                {/* Visual score circle */}
                <div className="w-32 h-32 rounded-full border-4 border-white/[0.04] flex flex-col items-center justify-center bg-white/[0.01]">
                  <span className="text-3xl font-mono font-bold text-white">{score}</span>
                  <span className="text-slate-500 text-xs mt-0.5">/ {activeQuestions.length}</span>
                </div>
                <div className="absolute -bottom-1 -right-1 bg-amber-400 p-2 rounded-full shadow-glow-sm">
                  <Trophy className="w-5 h-5 text-dark-950" />
                </div>
              </div>

              <div className="space-y-2">
                <h2 className="text-xl font-bold text-white">Quiz Completed!</h2>
                <p className="text-slate-400 text-sm max-w-xs leading-relaxed">
                  You scored <span className="font-bold font-mono text-primary">{Math.round((score / activeQuestions.length) * 100)}%</span> in difficulty <span className="capitalize text-slate-300 font-bold">{difficulty}</span>.
                </p>
              </div>

              <div className="flex gap-3 pt-4 border-t border-white/[0.04] w-full justify-center">
                <GlowButton variant="primary" icon={RotateCcw} onClick={handleRestartQuiz}>
                  Restart Practice
                </GlowButton>
              </div>
            </GlassCard>

            {/* Performance Details Grid (TOC Performance / Difficulty breakdown) */}
            <GlassCard hover={false} className="lg:col-span-2 p-6 space-y-6">
              <h2 className="text-base font-bold text-slate-200 border-b border-white/[0.04] pb-3">
                Detailed Performance Breakdown
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Topic breakdown */}
                <div className="space-y-4">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Topic-wise Performance</h3>
                  {topicStats.length === 0 ? (
                    <p className="text-xs text-slate-500">No topic data available.</p>
                  ) : (
                    <div className="space-y-3">
                      {topicStats.map((topic) => (
                        <div key={topic.name} className="space-y-1">
                          <div className="flex justify-between text-xs font-semibold">
                            <span className="text-slate-300">{topic.name}</span>
                            <span className="text-slate-500 font-mono">
                              {topic.correct}/{topic.total} ({topic.percentage}%)
                            </span>
                          </div>
                          <div className="w-full h-1.5 bg-white/[0.03] rounded-full overflow-hidden">
                            <div
                              className="h-full bg-primary"
                              style={{ width: `${topic.percentage}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Difficulty breakdown */}
                <div className="space-y-4">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Difficulty-wise Performance</h3>
                  {difficultyStats.length === 0 ? (
                    <p className="text-xs text-slate-500">No difficulty data available.</p>
                  ) : (
                    <div className="space-y-3">
                      {difficultyStats.map((diff) => (
                        <div key={diff.name} className="space-y-1">
                          <div className="flex justify-between text-xs font-semibold">
                            <span className="text-slate-300">{diff.name}</span>
                            <span className="text-slate-500 font-mono">
                              {diff.correct}/{diff.total} ({diff.percentage}%)
                            </span>
                          </div>
                          <div className="w-full h-1.5 bg-white/[0.03] rounded-full overflow-hidden">
                            <div
                              className="h-full bg-secondary"
                              style={{ width: `${diff.percentage}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
