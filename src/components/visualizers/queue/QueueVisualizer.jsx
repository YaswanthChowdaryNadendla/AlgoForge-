import { useState, useCallback, lazy, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus, RotateCcw, Play, Pause, SkipForward, SkipBack, Zap, ArrowRight, List, MessageSquare, Code2, BookOpen } from 'lucide-react';
import GlassCard from '../../ui/GlassCard';
import GlowButton from '../../ui/GlowButton';
import StepTimeline from '../../engine/StepTimeline';
import ExplanationPanel from '../../engine/ExplanationPanel';
import { useAlgorithm } from '../../../hooks/useAlgorithm';

const CodeViewer = lazy(() => import('../../code/CodeViewer'));
const AlgorithmInfo = lazy(() => import('../../education/AlgorithmInfo'));
import { CodeViewerSkeleton, AlgorithmInfoSkeleton } from '../../ui/Skeletons';

const MAX_SIZE = 10;

// Generate demo steps: enqueue 5 values, then dequeue all
function generateDemoSteps(initialQueue = []) {
  const steps = [];
  const queue = [...initialQueue];
  const valuesToEnqueue = [10, 25, 38, 52, 77];

  steps.push({
    queue: queue.map(q => q.value),
    highlighted: null, operation: null, frontIdx: 0, rearIdx: queue.length - 1,
    description: `Queue demo starting. Current size: ${queue.length}/${MAX_SIZE}. FIFO order maintained.`,
    comparisons: 0, type: 'init', codeLine: 1,
  });

  // Enqueue phase
  for (let i = 0; i < valuesToEnqueue.length; i++) {
    if (queue.length >= MAX_SIZE) break;
    const val = valuesToEnqueue[i];
    queue.push({ value: val, id: Date.now() + i });
    steps.push({
      queue: queue.map(q => q.value),
      highlighted: queue.length - 1, operation: 'enqueue',
      frontIdx: 0, rearIdx: queue.length - 1,
      description: `Enqueue(${val}): Added ${val} to rear. Front: ${queue[0].value}, Rear: ${val}. Size: ${queue.length}.`,
      comparisons: i + 1, type: 'swap', codeLine: 3,
    });
  }

  // Dequeue phase
  const dequeueCount = queue.length;
  for (let i = 0; i < dequeueCount; i++) {
    const front = queue[0];
    steps.push({
      queue: queue.map(q => q.value),
      highlighted: 0, operation: 'dequeue-highlight',
      frontIdx: 0, rearIdx: queue.length - 1,
      description: `Dequeue(): Removing front element ${front.value}. ${queue.length - 1} elements will remain.`,
      comparisons: valuesToEnqueue.length + i + 1, type: 'compare', codeLine: 5,
    });
    queue.shift();
    steps.push({
      queue: queue.map(q => q.value),
      highlighted: null, operation: 'dequeue',
      frontIdx: 0, rearIdx: queue.length - 1,
      description: `Dequeued ${front.value}. ${queue.length > 0 ? `New front: ${queue[0].value}.` : 'Queue is now empty.'} Size: ${queue.length}.`,
      comparisons: valuesToEnqueue.length + i + 1, type: 'swap', codeLine: 6,
    });
  }

  steps.push({
    queue: [],
    highlighted: null, operation: null, frontIdx: -1, rearIdx: -1,
    description: `Demo complete! Performed ${valuesToEnqueue.length} enqueues and ${dequeueCount} dequeues. Queue is empty. All operations O(1).`,
    comparisons: valuesToEnqueue.length + dequeueCount, type: 'done', codeLine: 8,
  });

  return steps;
}

const tabs = [
  { key: 'timeline', label: 'Timeline', icon: List },
  { key: 'explanation', label: 'Explain', icon: MessageSquare },
  { key: 'code', label: 'Code', icon: Code2 },
  { key: 'learn', label: 'Learn', icon: BookOpen },
];

export default function QueueVisualizer() {
  const [queue, setQueue] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [message, setMessage] = useState('Queue is empty. Enqueue some elements!');
  const [activeTab, setActiveTab] = useState('timeline');

  const {
    steps, currentStep, currentState, isPlaying, isPaused,
    totalSteps, loadSteps, play, pause, resume, stepForward, stepBackward, goToStep, reset,
  } = useAlgorithm();

  const isEngineActive = steps.length > 0 && currentState;
  const displayQueue = isEngineActive ? currentState.queue : queue.map(q => q.value);
  const highlightedIdx = isEngineActive ? currentState.highlighted : null;

  const enqueue = () => {
    const val = parseInt(inputValue, 10);
    if (isNaN(val)) return;
    if (queue.length >= MAX_SIZE) {
      setMessage('Queue is full! Maximum capacity reached.');
      return;
    }
    setQueue(prev => [...prev, { value: val, id: Date.now() }]);
    setMessage(`Enqueue(${val}): Added at rear. Size: ${queue.length + 1}/${MAX_SIZE}. Time: O(1).`);
    setInputValue('');
    reset();
  };

  const dequeue = () => {
    if (queue.length === 0) {
      setMessage('Queue is empty — nothing to dequeue.');
      return;
    }
    const front = queue[0];
    setMessage(`Dequeue(): Removed ${front.value} from front. Size: ${queue.length - 1}/${MAX_SIZE}. Time: O(1).`);
    setQueue(prev => prev.slice(1));
    reset();
  };

  const runDemo = () => {
    const demoSteps = generateDemoSteps(queue);
    loadSteps(demoSteps);
    setTimeout(() => play(), 50);
  };

  const displayMessage = isEngineActive ? currentState.description : message;

  const renderTab = () => {
    switch (activeTab) {
      case 'timeline': return <StepTimeline steps={steps} currentStep={currentStep} onGoToStep={goToStep} />;
      case 'explanation': return <ExplanationPanel currentState={currentState} algorithm="queue" currentStep={currentStep} totalSteps={totalSteps} />;
      case 'code':
        return (
          <Suspense fallback={<CodeViewerSkeleton />}>
            <CodeViewer algorithmName="queue" activeLine={currentState?.codeLine} />
          </Suspense>
        );
      case 'learn':
        return (
          <Suspense fallback={<AlgorithmInfoSkeleton />}>
            <AlgorithmInfo algorithmName="queue" />
          </Suspense>
        );
      default: return null;
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-white">
          Queue <span className="gradient-text">Visualizer</span>
        </h1>
        <p className="text-slate-500 text-sm mt-1">First In, First Out (FIFO) — O(1) enqueue, dequeue</p>
      </div>

      {/* Controls */}
      <GlassCard hover={false} className="p-4 md:p-5">
        <div className="flex flex-wrap items-end gap-3">
          <div className="min-w-[120px]">
            <label className="text-xs font-medium text-slate-400 mb-1.5 block">Value</label>
            <input type="number" value={inputValue} onChange={(e) => setInputValue(e.target.value)}
              placeholder="Enter value" className="input-glass" onKeyDown={(e) => e.key === 'Enter' && enqueue()} />
          </div>
          <GlowButton variant="primary" icon={Plus} onClick={enqueue} size="sm">Enqueue</GlowButton>
          <GlowButton variant="danger" icon={Minus} onClick={dequeue} size="sm">Dequeue</GlowButton>
          <div className="w-px h-8 bg-white/[0.06] mx-1 hidden sm:block" />
          <GlowButton variant="primary" icon={Zap} onClick={runDemo} disabled={isPlaying} size="sm">Run Demo</GlowButton>
          <GlowButton variant="ghost" icon={RotateCcw} onClick={() => { setQueue([]); setMessage('Queue cleared.'); reset(); }} size="sm">Reset</GlowButton>
        </div>
        {steps.length > 0 && (
          <div className="flex items-center gap-1 mt-3">
            <GlowButton variant="ghost" icon={SkipBack} onClick={stepBackward} disabled={isPlaying} size="sm" />
            {isPlaying ? (
              <GlowButton variant="ghost" icon={Pause} onClick={pause} size="sm" />
            ) : isPaused ? (
              <GlowButton variant="ghost" icon={Play} onClick={resume} size="sm" />
            ) : null}
            <GlowButton variant="ghost" icon={SkipForward} onClick={stepForward} disabled={isPlaying} size="sm" />
            <span className="text-xs font-mono text-slate-500 ml-2">{currentStep + 1}/{totalSteps}</span>
          </div>
        )}
      </GlassCard>

      {/* Status */}
      <GlassCard hover={false} className="p-3 px-5">
        <p className="text-sm text-slate-300">{displayMessage}</p>
      </GlassCard>

      {/* Visualization + Side Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* Queue visualization */}
        <GlassCard hover={false} className="lg:col-span-3 p-6 md:p-8">
          <div className="min-h-[180px] flex flex-col justify-center">
            <div className="flex items-center justify-center gap-2 overflow-x-auto py-4">
              {displayQueue.length === 0 ? (
                <p className="text-slate-600 text-sm">Empty queue</p>
              ) : (
                <>
                  <span className="text-[10px] font-mono text-success shrink-0 font-bold">FRONT →</span>
                  <AnimatePresence>
                    {displayQueue.map((value, index) => {
                      const isHighlighted = highlightedIdx === index;
                      const isFront = index === 0;
                      const isRear = index === displayQueue.length - 1;
                      const operation = isEngineActive ? currentState.operation : null;
                      const isDequeuing = operation === 'dequeue-highlight' && index === 0;

                      return (
                        <motion.div
                          key={`${value}-${index}`}
                          initial={{ scale: 0, x: 50, opacity: 0 }}
                          animate={{ scale: isDequeuing ? 0.9 : 1, x: 0, opacity: isDequeuing ? 0.5 : 1 }}
                          exit={{ scale: 0, x: -50, opacity: 0 }}
                          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                          layout
                          className="flex flex-col items-center"
                        >
                          <div
                            className={`w-14 h-14 rounded-xl flex items-center justify-center
                                        font-mono font-bold text-base border transition-all duration-300 shrink-0
                                        ${isHighlighted || isDequeuing
                                          ? 'border-accent/50 bg-accent/20 text-accent shadow-[0_0_15px_rgba(6,182,212,0.4)]'
                                          : isFront
                                            ? 'border-success/30 bg-success/10 text-success shadow-[0_0_10px_rgba(16,185,129,0.2)]'
                                            : isRear
                                              ? 'border-primary/30 bg-primary/10 text-primary shadow-[0_0_10px_rgba(59,130,246,0.2)]'
                                              : 'border-white/[0.08] bg-white/[0.03] text-slate-300'
                                        }`}
                          >
                            {value}
                          </div>
                          <span className="text-[9px] font-mono text-slate-600 mt-1">[{index}]</span>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                  <span className="text-[10px] font-mono text-primary shrink-0 font-bold">← REAR</span>
                </>
              )}
            </div>

            {/* Capacity bar */}
            <div className="flex items-center justify-center gap-2 mt-3">
              <span className="text-[10px] text-slate-600 font-mono">{displayQueue.length}/{MAX_SIZE}</span>
              <div className="w-32 h-1 rounded-full bg-white/[0.05] overflow-hidden">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-success to-primary"
                  animate={{ width: `${(displayQueue.length / MAX_SIZE) * 100}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
              <span className="text-[10px] text-slate-600 font-mono">capacity</span>
            </div>
          </div>
        </GlassCard>

        {/* Side Panel */}
        <GlassCard hover={false} className="lg:col-span-2 p-0 flex flex-col h-auto lg:h-[calc(100vh-230px)] lg:min-h-[450px] lg:max-h-[750px] overflow-visible lg:overflow-hidden">
          <div className="flex border-b border-white/[0.06] shrink-0 sticky top-0 z-30 bg-dark-950/95 backdrop-blur-md lg:relative lg:top-auto lg:z-auto lg:bg-transparent lg:backdrop-filter-none">
            {tabs.map((tab) => (
              <button key={tab.key} onClick={() => setActiveTab(tab.key)}
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
    </div>
  );
}
