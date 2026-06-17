import { useState, useCallback, lazy, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus, Search as SearchIcon, RotateCcw, ArrowRight, ArrowLeftRight, Play, Pause, SkipForward, SkipBack, List, MessageSquare, Code2, BookOpen } from 'lucide-react';
import GlassCard from '../../ui/GlassCard';
import GlowButton from '../../ui/GlowButton';
import StepTimeline from '../../engine/StepTimeline';
import ExplanationPanel from '../../engine/ExplanationPanel';
import { useAlgorithm } from '../../../hooks/useAlgorithm';

const CodeViewer = lazy(() => import('../../code/CodeViewer'));
const AlgorithmInfo = lazy(() => import('../../education/AlgorithmInfo'));
import { CodeViewerSkeleton, AlgorithmInfoSkeleton } from '../../ui/Skeletons';

let nodeIdCounter = 0;

// Generate search steps
function generateSearchSteps(nodes, target) {
  const steps = [];
  steps.push({
    nodes: nodes.map(n => n.value), highlighted: null, pointers: {},
    description: `Searching for ${target} in linked list. Starting at head.`,
    comparisons: 0, type: 'init', codeLine: 1,
  });

  for (let i = 0; i < nodes.length; i++) {
    const found = nodes[i].value === target;
    steps.push({
      nodes: nodes.map(n => n.value), highlighted: i,
      pointers: { current: i },
      description: found
        ? `Found ${target} at position ${i}! Node value ${nodes[i].value} matches the target.`
        : `Checking node ${i}: value = ${nodes[i].value}. ${nodes[i].value} ≠ ${target}, moving to next node.`,
      comparisons: i + 1, type: found ? 'found' : 'compare', codeLine: found ? 5 : 3,
    });
    if (found) return steps;
  }

  steps.push({
    nodes: nodes.map(n => n.value), highlighted: null, pointers: {},
    description: `${target} not found after traversing all ${nodes.length} nodes.`,
    comparisons: nodes.length, type: 'done', codeLine: 7,
  });
  return steps;
}

// Generate reverse steps
function generateReverseSteps(nodes) {
  const steps = [];
  const values = nodes.map(n => n.value);
  const result = [...values];

  steps.push({
    nodes: [...result], highlighted: null,
    pointers: { prev: null, current: 0, next: 1 },
    description: 'Starting reverse. Initialize prev = null, current = head.',
    comparisons: 0, type: 'init', codeLine: 1,
  });

  let prev = -1, current = 0;
  while (current < result.length) {
    const next = current + 1 < result.length ? current + 1 : null;

    steps.push({
      nodes: [...result], highlighted: current,
      pointers: { prev: prev >= 0 ? prev : null, current, next },
      description: `Reversing pointer: node[${current}] (${result[current]}).next → ${prev >= 0 ? `node[${prev}] (${result[prev]})` : 'null'}. Moving forward.`,
      comparisons: current + 1, type: 'swap', codeLine: 3,
    });

    prev = current;
    current++;
  }

  result.reverse();

  steps.push({
    nodes: [...result], highlighted: null, pointers: {},
    description: `Reverse complete! New order: [${result.join(' → ')}]. Head is now ${result[0]}.`,
    comparisons: values.length, type: 'done', codeLine: 5,
  });
  return { steps, reversed: result };
}

const tabs = [
  { key: 'timeline', label: 'Timeline', icon: List },
  { key: 'explanation', label: 'Explain', icon: MessageSquare },
  { key: 'code', label: 'Code', icon: Code2 },
  { key: 'learn', label: 'Learn', icon: BookOpen },
];

export default function LinkedListVisualizer() {
  const [nodes, setNodes] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [message, setMessage] = useState('Linked list is empty. Add some nodes!');
  const [activeTab, setActiveTab] = useState('timeline');

  const {
    steps, currentStep, currentState, isPlaying, isPaused,
    speed, totalSteps, setSpeed,
    loadSteps, play, pause, resume, stepForward, stepBackward, goToStep, reset,
  } = useAlgorithm();

  // Derive highlighting from step engine
  const highlightedIdx = currentState?.highlighted ?? null;
  const pointers = currentState?.pointers ?? {};
  const displayNodes = nodes; // Always show real nodes; steps track traversal state

  const insertHead = () => {
    const val = parseInt(inputValue, 10);
    if (isNaN(val)) return;
    setNodes(prev => [{ value: val, id: ++nodeIdCounter }, ...prev]);
    setMessage(`Inserted ${val} at head. New node becomes the first element.`);
    setInputValue('');
    reset();
  };

  const insertTail = () => {
    const val = parseInt(inputValue, 10);
    if (isNaN(val)) return;
    setNodes(prev => [...prev, { value: val, id: ++nodeIdCounter }]);
    setMessage(`Inserted ${val} at tail. Traversed to end and linked new node.`);
    setInputValue('');
    reset();
  };

  const deleteNodeOp = () => {
    const val = parseInt(inputValue, 10);
    if (isNaN(val)) return;
    const idx = nodes.findIndex(n => n.value === val);
    if (idx === -1) {
      setMessage(`Value ${val} not found in the list.`);
      return;
    }
    setNodes(prev => prev.filter((_, i) => i !== idx));
    setMessage(`Deleted node with value ${val} at position ${idx}. Re-linked adjacent pointers.`);
    setInputValue('');
    reset();
  };

  const handleSearch = () => {
    const val = parseInt(inputValue, 10);
    if (isNaN(val) || nodes.length === 0) return;
    const searchSteps = generateSearchSteps(nodes, val);
    loadSteps(searchSteps);
    setTimeout(() => play(), 50);
  };

  const handleReverse = () => {
    if (nodes.length === 0) return;
    const { steps: revSteps, reversed } = generateReverseSteps(nodes);
    loadSteps(revSteps);
    setTimeout(() => play(), 50);
    // Apply the reverse after animation completes
    setTimeout(() => {
      setNodes(reversed.map(v => ({ value: v, id: ++nodeIdCounter })));
    }, revSteps.length * 300);
  };

  const displayMessage = currentState?.description || message;

  const renderTab = () => {
    switch (activeTab) {
      case 'timeline': return <StepTimeline steps={steps} currentStep={currentStep} onGoToStep={goToStep} />;
      case 'explanation': return <ExplanationPanel currentState={currentState} algorithm="linkedList" currentStep={currentStep} totalSteps={totalSteps} />;
      case 'code':
        return (
          <Suspense fallback={<CodeViewerSkeleton />}>
            <CodeViewer algorithmName="linkedList" activeLine={currentState?.codeLine} />
          </Suspense>
        );
      case 'learn':
        return (
          <Suspense fallback={<AlgorithmInfoSkeleton />}>
            <AlgorithmInfo algorithmName="linkedList" />
          </Suspense>
        );
      default: return null;
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-white">
          Linked List <span className="gradient-text">Visualizer</span>
        </h1>
        <p className="text-slate-500 text-sm mt-1">Visualize linked list operations with pointer tracking</p>
      </div>

      {/* Controls */}
      <GlassCard hover={false} className="p-4 md:p-5">
        <div className="flex flex-wrap items-end gap-3">
          <div className="min-w-[120px]">
            <label className="text-xs font-medium text-slate-400 mb-1.5 block">Value</label>
            <input type="number" value={inputValue} onChange={(e) => setInputValue(e.target.value)}
              placeholder="Enter value" className="input-glass" onKeyDown={(e) => e.key === 'Enter' && insertTail()} />
          </div>
          <GlowButton variant="primary" icon={Plus} onClick={insertHead} size="sm">Insert Head</GlowButton>
          <GlowButton variant="primary" icon={Plus} onClick={insertTail} size="sm">Insert Tail</GlowButton>
          <GlowButton variant="danger" icon={Minus} onClick={deleteNodeOp} size="sm">Delete</GlowButton>
          <GlowButton variant="accent" icon={SearchIcon} onClick={handleSearch} size="sm" disabled={isPlaying}>Search</GlowButton>
          <GlowButton variant="ghost" icon={ArrowLeftRight} onClick={handleReverse} size="sm" disabled={isPlaying}>Reverse</GlowButton>
          <GlowButton variant="ghost" icon={RotateCcw} onClick={() => { setNodes([]); setMessage('List cleared.'); reset(); }} size="sm">Reset</GlowButton>
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
        {/* Node chain */}
        <GlassCard hover={false} className="lg:col-span-3 p-4 md:p-6">
          <div className="flex flex-wrap items-center justify-center gap-1 min-h-[150px]">
            {nodes.length === 0 ? (
              <p className="text-slate-600 text-sm">Empty list — add nodes to visualize</p>
            ) : (
              nodes.map((node, index) => {
                const isHighlighted = highlightedIdx === index;
                const isCurrent = pointers.current === index;
                const isPrev = pointers.prev === index;
                const isNext = pointers.next === index;

                return (
                  <div key={node.id} className="flex items-center">
                    <motion.div
                      layout
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      className={`relative flex flex-col items-center`}
                    >
                      {/* Pointer labels */}
                      <div className="flex gap-0.5 mb-1 h-4">
                        {isPrev && <span className="text-[8px] font-mono px-1 rounded bg-purple-500/20 text-purple-400">prev</span>}
                        {isCurrent && <span className="text-[8px] font-mono px-1 rounded bg-cyan-500/20 text-cyan-400">curr</span>}
                        {isNext && <span className="text-[8px] font-mono px-1 rounded bg-blue-500/20 text-blue-400">next</span>}
                        {index === 0 && !isCurrent && !isPrev && <span className="text-[8px] font-mono px-1 rounded bg-emerald-500/20 text-emerald-400">HEAD</span>}
                      </div>

                      <div
                        className={`w-14 h-14 rounded-xl flex items-center justify-center font-mono font-semibold text-sm border transition-all duration-300
                          ${isHighlighted
                            ? 'bg-cyan-500/20 border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.5)]'
                            : 'bg-white/[0.03] border-white/[0.08]'
                          }`}
                      >
                        {node.value}
                      </div>
                      <span className="text-[9px] font-mono text-slate-600 mt-1">{index}</span>
                    </motion.div>
                    {index < nodes.length - 1 && (
                      <ArrowRight className="w-4 h-4 text-slate-600 mx-1 shrink-0" />
                    )}
                  </div>
                );
              })
            )}
            {nodes.length > 0 && (
              <span className="text-xs font-mono text-slate-600 ml-2">→ null</span>
            )}
          </div>
        </GlassCard>

        {/* Side panel */}
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
