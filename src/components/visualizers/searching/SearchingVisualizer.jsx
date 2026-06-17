import { useState, useCallback, lazy, Suspense } from 'react';
import { motion } from 'framer-motion';
import { Play, RotateCcw, Shuffle, SkipForward, SkipBack, Pause, List, MessageSquare, Code2, BookOpen } from 'lucide-react';
import { useAlgorithm } from '../../../hooks/useAlgorithm';
import { generateRandomArray } from '../../../utils/arrayUtils';
import GlassCard from '../../ui/GlassCard';
import GlowButton from '../../ui/GlowButton';
import Slider from '../../ui/Slider';
import StepTimeline from '../../engine/StepTimeline';
import ExplanationPanel from '../../engine/ExplanationPanel';
import ComplexityDashboard from '../../engine/ComplexityDashboard';

const CodeViewer = lazy(() => import('../../code/CodeViewer'));
const AlgorithmInfo = lazy(() => import('../../education/AlgorithmInfo'));
import { CodeViewerSkeleton, AlgorithmInfoSkeleton } from '../../ui/Skeletons';

const tabs = [
  { key: 'timeline', label: 'Timeline', icon: List },
  { key: 'explanation', label: 'Explain', icon: MessageSquare },
  { key: 'code', label: 'Code', icon: Code2 },
  { key: 'learn', label: 'Learn', icon: BookOpen },
];

export default function SearchingVisualizer() {
  const [algorithm, setAlgorithm] = useState('linearSearch');
  const [arraySize, setArraySize] = useState(20);
  const [array, setArray] = useState(() => {
    const arr = generateRandomArray(20, 1, 50);
    return arr.sort((a, b) => a - b);
  });
  const [target, setTarget] = useState('');
  const [activeTab, setActiveTab] = useState('timeline');

  const {
    steps, currentStep, currentState, isPlaying, isPaused, isComplete,
    speed, stats, totalSteps, setSpeed,
    loadSteps, play, pause, resume, stepForward, stepBackward, goToStep, reset,
  } = useAlgorithm();

  const handleGenerate = useCallback(() => {
    let arr = generateRandomArray(arraySize, 1, 99);
    if (algorithm === 'binarySearch') arr = arr.sort((a, b) => a - b);
    setArray(arr);
    reset();
  }, [arraySize, algorithm, reset]);

  const handleStart = useCallback(async () => {
    const t = parseInt(target, 10);
    if (isNaN(t)) return;
    const searchFn = algorithm === 'linearSearch'
      ? (await import('../../../algorithms/searching/linearSearch')).default
      : (await import('../../../algorithms/searching/binarySearch')).default;
    const searchArray = algorithm === 'binarySearch' ? [...array].sort((a, b) => a - b) : [...array];
    if (algorithm === 'binarySearch') setArray(searchArray);
    const generatedSteps = searchFn(searchArray, t);
    loadSteps(generatedSteps);
    setTimeout(() => play(), 50);
  }, [algorithm, array, target, loadSteps, play]);

  const getBlockStyle = (index) => {
    if (!currentState) return {};
    if (currentState.found === index) {
      return { background: 'linear-gradient(135deg, #10B981, #059669)', boxShadow: '0 0 20px rgba(16,185,129,0.6)', borderColor: 'rgba(16,185,129,0.5)' };
    }
    if (currentState.active === index) {
      return { background: 'linear-gradient(135deg, #06B6D4, #0891B2)', boxShadow: '0 0 15px rgba(6,182,212,0.5)', borderColor: 'rgba(6,182,212,0.5)' };
    }
    // Discarded indices
    if (currentState.discarded && currentState.discarded.includes(index)) {
      return { opacity: 0.2, background: 'rgba(30,41,59,0.5)', borderColor: 'rgba(255,255,255,0.03)' };
    }
    // In search range
    if (currentState.range) {
      const [low, high] = currentState.range;
      if (index >= low && index <= high) {
        return { background: 'rgba(59,130,246,0.15)', borderColor: 'rgba(59,130,246,0.3)' };
      }
      return { opacity: 0.2 };
    }
    return {};
  };

  const renderTab = () => {
    switch (activeTab) {
      case 'timeline':
        return <StepTimeline steps={steps} currentStep={currentStep} onGoToStep={goToStep} />;
      case 'explanation':
        return <ExplanationPanel currentState={currentState} algorithm={algorithm} currentStep={currentStep} totalSteps={totalSteps} />;
      case 'code':
        return (
          <Suspense fallback={<CodeViewerSkeleton />}>
            <CodeViewer algorithmName={algorithm} activeLine={currentState?.codeLine} />
          </Suspense>
        );
      case 'learn':
        return (
          <Suspense fallback={<AlgorithmInfoSkeleton />}>
            <AlgorithmInfo algorithmName={algorithm} />
          </Suspense>
        );
      default: return null;
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-white">
          Searching <span className="gradient-text">Visualizer</span>
        </h1>
        <p className="text-slate-500 text-sm mt-1">Step through searching algorithms with decision tracing</p>
      </div>

      {/* Controls */}
      <GlassCard hover={false} className="p-4 md:p-5">
        <div className="flex flex-wrap items-end gap-4">
          <div className="min-w-[160px]">
            <label className="text-xs font-medium text-slate-400 mb-1.5 block">Algorithm</label>
            <select
              value={algorithm}
              onChange={(e) => { setAlgorithm(e.target.value); reset(); }}
              disabled={isPlaying}
              className="w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-slate-200 text-sm focus:outline-none focus:border-primary/50 disabled:opacity-50 transition-all appearance-none cursor-pointer"
              style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2394A3B8' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center' }}
            >
              <option value="linearSearch" className="bg-dark-900">Linear Search</option>
              <option value="binarySearch" className="bg-dark-900">Binary Search</option>
            </select>
          </div>

          <div className="min-w-[120px]">
            <label className="text-xs font-medium text-slate-400 mb-1.5 block">Target Value</label>
            <input type="number" value={target} onChange={(e) => setTarget(e.target.value)}
              placeholder="Enter target" className="input-glass" />
          </div>

          <div className="flex-1 min-w-[120px]">
            <Slider label="Array Size" value={arraySize} onChange={setArraySize} min={5} max={40} />
          </div>
          <div className="flex-1 min-w-[120px]">
            <Slider label="Speed" value={speed} onChange={setSpeed} min={1} max={10} unit="x" />
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mt-4">
          <GlowButton variant="ghost" icon={Shuffle} onClick={handleGenerate} disabled={isPlaying}>Generate</GlowButton>
          {!isPlaying && !isPaused ? (
            <GlowButton variant="primary" icon={Play} onClick={handleStart} disabled={!target}>Start</GlowButton>
          ) : isPlaying ? (
            <GlowButton variant="accent" icon={Pause} onClick={pause}>Pause</GlowButton>
          ) : (
            <GlowButton variant="primary" icon={Play} onClick={resume}>Resume</GlowButton>
          )}
          <GlowButton variant="ghost" icon={SkipBack} onClick={stepBackward} disabled={isPlaying} size="sm" />
          <GlowButton variant="ghost" icon={SkipForward} onClick={stepForward} disabled={isPlaying} size="sm" />
          <GlowButton variant="ghost" icon={RotateCcw} onClick={() => { reset(); handleGenerate(); }}>Reset</GlowButton>
        </div>
      </GlassCard>

      {/* Visualization + Side Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* Array blocks */}
        <GlassCard hover={false} className="lg:col-span-3 p-4 md:p-6">
          <div className="flex flex-wrap items-center justify-center gap-2 min-h-[180px]">
            {array.map((value, index) => (
              <motion.div
                key={index}
                className="relative flex flex-col items-center"
                layout
              >
                <motion.div
                  className="w-12 h-12 md:w-14 md:h-14 rounded-xl flex items-center justify-center
                             font-mono font-semibold text-sm border border-white/10
                             transition-all duration-300"
                  style={{ background: 'rgba(59,130,246,0.1)', ...getBlockStyle(index) }}
                  whileHover={{ scale: 1.05 }}
                >
                  {value}
                </motion.div>

                {/* Index label */}
                <span className="text-[9px] font-mono text-slate-600 mt-1">{index}</span>

                {/* Low / Mid / High labels for binary search */}
                {currentState && (
                  <div className="flex gap-0.5 mt-0.5">
                    {currentState.low === index && (
                      <span className="text-[8px] font-mono px-1 rounded bg-blue-500/20 text-blue-400">L</span>
                    )}
                    {currentState.mid === index && (
                      <span className="text-[8px] font-mono px-1 rounded bg-cyan-500/20 text-cyan-400">M</span>
                    )}
                    {currentState.high === index && (
                      <span className="text-[8px] font-mono px-1 rounded bg-purple-500/20 text-purple-400">H</span>
                    )}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </GlassCard>

        {/* Side panel */}
        <GlassCard hover={false} className="lg:col-span-2 p-0 flex flex-col h-auto lg:h-[calc(100vh-230px)] lg:min-h-[480px] lg:max-h-[750px] overflow-visible lg:overflow-hidden">
          <div className="flex border-b border-white/[0.06] shrink-0 sticky top-0 z-30 bg-dark-950/95 backdrop-blur-md lg:relative lg:top-auto lg:z-auto lg:bg-transparent lg:backdrop-filter-none">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 text-xs font-medium transition-all
                  ${activeTab === tab.key ? 'text-white border-b-2 border-primary bg-white/[0.02]' : 'text-slate-500 hover:text-slate-300'}`}
              >
                <tab.icon className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </div>
          <div className="flex-1 overflow-visible lg:overflow-hidden">
            {renderTab()}
          </div>
        </GlassCard>
      </div>

      {/* Complexity Dashboard */}
      <GlassCard hover={false} className="p-4">
        <ComplexityDashboard stats={stats} algorithm={algorithm} totalSteps={totalSteps} />
      </GlassCard>
    </div>
  );
}
