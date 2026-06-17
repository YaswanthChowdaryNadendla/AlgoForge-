import { useState, useCallback, lazy, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus, Eye, RotateCcw, Play, Pause, SkipForward, SkipBack, Zap, List, MessageSquare, Code2, BookOpen } from 'lucide-react';
import GlassCard from '../../ui/GlassCard';
import GlowButton from '../../ui/GlowButton';
import StepTimeline from '../../engine/StepTimeline';
import ExplanationPanel from '../../engine/ExplanationPanel';
import { useAlgorithm } from '../../../hooks/useAlgorithm';

const CodeViewer = lazy(() => import('../../code/CodeViewer'));
const AlgorithmInfo = lazy(() => import('../../education/AlgorithmInfo'));
import { CodeViewerSkeleton, AlgorithmInfoSkeleton } from '../../ui/Skeletons';

const MAX_SIZE = 10;

// Generate demo steps: push 5 values, peek, pop all
function generateDemoSteps(initialStack = []) {
  const steps = [];
  const stack = [...initialStack];
  const valuesToPush = [42, 17, 85, 33, 61];

  steps.push({
    stack: stack.map(s => s.value),
    highlighted: null, operation: null,
    description: `Stack demo starting. Current size: ${stack.length}/${MAX_SIZE}.`,
    comparisons: 0, type: 'init', codeLine: 1,
  });

  // Push phase
  for (let i = 0; i < valuesToPush.length; i++) {
    if (stack.length >= MAX_SIZE) break;
    const val = valuesToPush[i];
    stack.unshift({ value: val, id: Date.now() + i });
    steps.push({
      stack: stack.map(s => s.value),
      highlighted: 0, operation: 'push',
      description: `Push(${val}): Added ${val} to top of stack. Stack size: ${stack.length}. TOP is now ${val}.`,
      comparisons: i + 1, type: 'swap', codeLine: 3,
    });
  }

  // Peek
  if (stack.length > 0) {
    steps.push({
      stack: stack.map(s => s.value),
      highlighted: 0, operation: 'peek',
      description: `Peek(): Top element is ${stack[0].value}. Stack remains unchanged. O(1) operation.`,
      comparisons: valuesToPush.length, type: 'compare', codeLine: 5,
    });
  }

  // Pop phase
  const popCount = stack.length;
  for (let i = 0; i < popCount; i++) {
    const top = stack[0];
    steps.push({
      stack: stack.map(s => s.value),
      highlighted: 0, operation: 'pop-highlight',
      description: `Pop(): Removing top element ${top.value}. Stack size will be ${stack.length - 1}.`,
      comparisons: valuesToPush.length + i + 1, type: 'compare', codeLine: 7,
    });
    stack.shift();
    steps.push({
      stack: stack.map(s => s.value),
      highlighted: null, operation: 'pop',
      description: `Popped ${top.value}. ${stack.length > 0 ? `New TOP: ${stack[0].value}.` : 'Stack is now empty.'} Size: ${stack.length}.`,
      comparisons: valuesToPush.length + i + 1, type: 'swap', codeLine: 8,
    });
  }

  steps.push({
    stack: [],
    highlighted: null, operation: null,
    description: `Demo complete! Performed ${valuesToPush.length} pushes, 1 peek, and ${popCount} pops. Stack is empty.`,
    comparisons: valuesToPush.length + popCount, type: 'done', codeLine: 10,
  });

  return steps;
}

const tabs = [
  { key: 'timeline', label: 'Timeline', icon: List },
  { key: 'explanation', label: 'Explain', icon: MessageSquare },
  { key: 'code', label: 'Code', icon: Code2 },
  { key: 'learn', label: 'Learn', icon: BookOpen },
];

export default function StackVisualizer() {
  const [stack, setStack] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [peekIndex, setPeekIndex] = useState(-1);
  const [message, setMessage] = useState('Stack is empty. Push some elements!');
  const [activeTab, setActiveTab] = useState('timeline');

  const {
    steps, currentStep, currentState, isPlaying, isPaused,
    totalSteps, loadSteps, play, pause, resume, stepForward, stepBackward, goToStep, reset,
  } = useAlgorithm();

  // Derive display from step engine if active
  const isEngineActive = steps.length > 0 && currentState;
  const displayStack = isEngineActive ? currentState.stack : stack.map(s => s.value);
  const highlightedIdx = isEngineActive ? currentState.highlighted : peekIndex;

  const push = () => {
    const val = parseInt(inputValue, 10);
    if (isNaN(val)) return;
    if (stack.length >= MAX_SIZE) {
      setMessage('Stack overflow! Maximum capacity reached.');
      return;
    }
    setStack(prev => [{ value: val, id: Date.now() }, ...prev]);
    setMessage(`Push(${val}): Added to top. Size: ${stack.length + 1}/${MAX_SIZE}. Time: O(1).`);
    setInputValue('');
    setPeekIndex(-1);
    reset();
  };

  const pop = () => {
    if (stack.length === 0) {
      setMessage('Stack underflow! Cannot pop from empty stack.');
      return;
    }
    const top = stack[0];
    setMessage(`Pop(): Removed ${top.value} from top. Size: ${stack.length - 1}/${MAX_SIZE}. Time: O(1).`);
    setPeekIndex(-1);
    setStack(prev => prev.slice(1));
    reset();
  };

  const peek = () => {
    if (stack.length === 0) {
      setMessage('Stack is empty — nothing to peek.');
      return;
    }
    setPeekIndex(0);
    setMessage(`Peek(): Top element is ${stack[0].value}. Stack unchanged. Time: O(1).`);
    setTimeout(() => setPeekIndex(-1), 2000);
  };

  const runDemo = () => {
    const demoSteps = generateDemoSteps(stack);
    loadSteps(demoSteps);
    setTimeout(() => play(), 50);
  };

  const displayMessage = isEngineActive ? currentState.description : message;

  const renderTab = () => {
    switch (activeTab) {
      case 'timeline': return <StepTimeline steps={steps} currentStep={currentStep} onGoToStep={goToStep} />;
      case 'explanation': return <ExplanationPanel currentState={currentState} algorithm="stack" currentStep={currentStep} totalSteps={totalSteps} />;
      case 'code':
        return (
          <Suspense fallback={<CodeViewerSkeleton />}>
            <CodeViewer algorithmName="stack" activeLine={currentState?.codeLine} />
          </Suspense>
        );
      case 'learn':
        return (
          <Suspense fallback={<AlgorithmInfoSkeleton />}>
            <AlgorithmInfo algorithmName="stack" />
          </Suspense>
        );
      default: return null;
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-white">
          Stack <span className="gradient-text">Visualizer</span>
        </h1>
        <p className="text-slate-500 text-sm mt-1">Last In, First Out (LIFO) — O(1) push, pop, peek</p>
      </div>

      {/* Controls */}
      <GlassCard hover={false} className="p-4 md:p-5">
        <div className="flex flex-wrap items-end gap-3">
          <div className="min-w-[120px]">
            <label className="text-xs font-medium text-slate-400 mb-1.5 block">Value</label>
            <input type="number" value={inputValue} onChange={(e) => setInputValue(e.target.value)}
              placeholder="Enter value" className="input-glass" onKeyDown={(e) => e.key === 'Enter' && push()} />
          </div>
          <GlowButton variant="primary" icon={Plus} onClick={push} size="sm">Push</GlowButton>
          <GlowButton variant="danger" icon={Minus} onClick={pop} size="sm">Pop</GlowButton>
          <GlowButton variant="accent" icon={Eye} onClick={peek} size="sm">Peek</GlowButton>
          <div className="w-px h-8 bg-white/[0.06] mx-1 hidden sm:block" />
          <GlowButton variant="primary" icon={Zap} onClick={runDemo} disabled={isPlaying} size="sm">Run Demo</GlowButton>
          <GlowButton variant="ghost" icon={RotateCcw} onClick={() => { setStack([]); setMessage('Stack cleared.'); setPeekIndex(-1); reset(); }} size="sm">Reset</GlowButton>
        </div>
        {/* Playback controls */}
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
        {/* Stack visualization */}
        <GlassCard hover={false} className="lg:col-span-3 p-6 md:p-8">
          <div className="flex flex-col items-center gap-2 min-h-[300px] justify-end">
            {displayStack.length === 0 ? (
              <p className="text-slate-600 text-sm mb-auto pt-8">Empty stack</p>
            ) : (
              <AnimatePresence>
                {displayStack.map((value, index) => {
                  const isHighlighted = highlightedIdx === index;
                  const isTop = index === 0;
                  const operation = isEngineActive ? currentState.operation : null;
                  const isPopping = operation === 'pop-highlight' && index === 0;

                  return (
                    <motion.div
                      key={`${value}-${index}`}
                      initial={{ x: -100, opacity: 0, scale: 0.8 }}
                      animate={{
                        x: 0, opacity: isPopping ? 0.5 : 1, scale: isPopping ? 0.95 : 1,
                      }}
                      exit={{ x: 100, opacity: 0, scale: 0.8 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                      layout
                      className={`w-48 md:w-56 py-3 px-4 rounded-xl font-mono font-semibold text-center text-base
                                  border transition-all duration-300 relative
                                  ${isHighlighted || isPopping
                                    ? 'border-accent bg-accent/20 shadow-[0_0_15px_rgba(6,182,212,0.4)] text-white'
                                    : isTop
                                      ? 'border-primary/30 bg-primary/10 text-white'
                                      : 'border-white/[0.08] bg-white/[0.03] text-slate-300'
                                  }`}
                    >
                      {value}
                      {isTop && (
                        <span className="absolute -left-14 top-1/2 -translate-y-1/2 text-[10px] font-mono text-primary font-bold">
                          TOP →
                        </span>
                      )}
                      <span className="absolute -right-8 top-1/2 -translate-y-1/2 text-[9px] font-mono text-slate-600">
                        [{index}]
                      </span>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            )}

            {/* Stack base & capacity */}
            <div className="w-48 md:w-56 mt-2">
              <div className="h-1 bg-slate-700 rounded-full" />
              <div className="flex items-center justify-between mt-1.5">
                <span className="text-[10px] text-slate-600 font-mono">{displayStack.length}/{MAX_SIZE}</span>
                <div className="flex-1 mx-2 h-1 rounded-full bg-white/[0.05] overflow-hidden">
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-primary to-secondary"
                    animate={{ width: `${(displayStack.length / MAX_SIZE) * 100}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
                <span className="text-[10px] text-slate-600 font-mono">capacity</span>
              </div>
            </div>
          </div>
        </GlassCard>

        {/* Side Panel */}
        <GlassCard hover={false} className="lg:col-span-2 p-0 flex flex-col h-auto lg:h-[calc(100vh-230px)] lg:min-h-[480px] lg:max-h-[750px] overflow-visible lg:overflow-hidden">
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
