import { useState, useCallback, useEffect, lazy, Suspense } from 'react';
import { motion } from 'framer-motion';
import { List, MessageSquare, Code2, BookOpen, GitBranch } from 'lucide-react';
import { useAlgorithm } from '../../../hooks/useAlgorithm';
import { generateRandomArray, parseCustomArray } from '../../../utils/arrayUtils';
import SortingBars from './SortingBars';
import SortingControls from './SortingControls';
import StepTimeline from '../../engine/StepTimeline';
import ExplanationPanel from '../../engine/ExplanationPanel';
import ComplexityDashboard from '../../engine/ComplexityDashboard';
import RecursionTree from '../../engine/RecursionTree';
import GlassCard from '../../ui/GlassCard';

const CodeViewer = lazy(() => import('../../code/CodeViewer'));
const AlgorithmInfo = lazy(() => import('../../education/AlgorithmInfo'));
import { CodeViewerSkeleton, AlgorithmInfoSkeleton } from '../../ui/Skeletons';

const baseTabs = [
  { key: 'timeline', label: 'Timeline', icon: List },
  { key: 'explanation', label: 'Explain', icon: MessageSquare },
  { key: 'code', label: 'Code', icon: Code2 },
  { key: 'learn', label: 'Learn', icon: BookOpen },
];

const recursionTab = { key: 'recursion', label: 'Recursion', icon: GitBranch };
const hasRecursion = (algo) => algo === 'mergeSort' || algo === 'quickSort';

export default function SortingVisualizer() {
  const [algorithm, setAlgorithm] = useState('bubbleSort');
  const [arraySize, setArraySize] = useState(30);
  const [array, setArray] = useState(() => generateRandomArray(30));
  const [activeTab, setActiveTab] = useState('timeline');

  const {
    steps, currentStep, currentState, isPlaying, isPaused, isComplete,
    speed, stats, totalSteps, setSpeed,
    loadSteps, play, pause, resume, stepForward, stepBackward, goToStep, reset,
  } = useAlgorithm();

  const displayArray = currentState ? currentState.array : array;

  const handleGenerate = useCallback(() => {
    const newArr = generateRandomArray(arraySize);
    setArray(newArr);
    reset();
  }, [arraySize, reset]);

  const handleCustomInput = useCallback((input) => {
    const parsed = parseCustomArray(input);
    if (parsed) {
      setArray(parsed);
      reset();
    }
  }, [reset]);

  const handleStart = useCallback(async () => {
    let sortFn;
    switch (algorithm) {
      case 'bubbleSort':
        sortFn = (await import('../../../algorithms/sorting/bubbleSort')).default;
        break;
      case 'selectionSort':
        sortFn = (await import('../../../algorithms/sorting/selectionSort')).default;
        break;
      case 'insertionSort':
        sortFn = (await import('../../../algorithms/sorting/insertionSort')).default;
        break;
      case 'mergeSort':
        sortFn = (await import('../../../algorithms/sorting/mergeSort')).default;
        break;
      case 'quickSort':
        sortFn = (await import('../../../algorithms/sorting/quickSort')).default;
        break;
      case 'heapSort':
        sortFn = (await import('../../../algorithms/sorting/heapSort')).default;
        break;
      default:
        return;
    }
    const generatedSteps = sortFn([...array]);
    loadSteps(generatedSteps);
    setTimeout(() => play(), 50);
  }, [algorithm, array, loadSteps, play]);


  useEffect(() => {
    handleGenerate();
  }, [arraySize]);

  const tabs = hasRecursion(algorithm) ? [...baseTabs, recursionTab] : baseTabs;

  const renderActiveTab = () => {
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
      case 'recursion':
        return <RecursionTree recursionTree={currentState?.recursionTree} activeCallId={currentState?.activeCallId} algorithm={algorithm} />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-white">
          Sorting <span className="gradient-text">Visualizer</span>
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Step through sorting algorithms with full execution tracing
        </p>
      </div>

      {/* Controls */}
      <GlassCard hover={false} className="p-4 md:p-5">
        <SortingControls
          algorithm={algorithm} setAlgorithm={setAlgorithm}
          arraySize={arraySize} setArraySize={setArraySize}
          speed={speed} isPlaying={isPlaying} isPaused={isPaused} isComplete={isComplete}
          onGenerate={handleGenerate} onStart={handleStart}
          onPause={pause} onResume={resume}
          onStepForward={stepForward} onStepBackward={stepBackward}
          onReset={() => { reset(); setArray(generateRandomArray(arraySize)); }}
          onCustomInput={handleCustomInput} onSpeedChange={setSpeed}
        />
      </GlassCard>

      {/* Main visualization area: Bars + Side Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* Bars — takes 3/5 width on desktop */}
        <GlassCard hover={false} className="lg:col-span-3 p-4 md:p-6">
          <SortingBars array={displayArray} currentState={currentState} />
          {/* Pass & Progress overlay */}
          {currentState && (
            <div className="flex items-center justify-between mt-3 px-1">
              <div className="flex items-center gap-2">
                {currentState.pass > 0 && (
                  <span className="px-2 py-0.5 rounded-md bg-blue-500/15 text-blue-400 text-xs font-mono">
                    Pass {currentState.pass}
                  </span>
                )}
                {currentState.type && (
                  <span className={`px-2 py-0.5 rounded-md text-xs font-mono capitalize
                    ${currentState.type === 'compare' ? 'bg-amber-500/15 text-amber-400'
                      : currentState.type === 'swap' ? 'bg-red-500/15 text-red-400'
                      : currentState.type === 'done' ? 'bg-emerald-500/15 text-emerald-400'
                      : 'bg-slate-500/15 text-slate-400'}`}>
                    {currentState.type}
                  </span>
                )}
              </div>
              <span className="text-xs font-mono text-slate-500">
                {currentStep + 1} / {totalSteps}
              </span>
            </div>
          )}
        </GlassCard>

        {/* Side panel with tabs — takes 2/5 width */}
        <GlassCard hover={false} className="lg:col-span-2 p-0 flex flex-col h-auto lg:h-[calc(100vh-230px)] lg:min-h-[500px] lg:max-h-[750px] overflow-visible lg:overflow-hidden">
          {/* Tab header */}
          <div className="flex border-b border-white/[0.06] shrink-0 sticky top-0 z-30 bg-dark-950/95 backdrop-blur-md lg:relative lg:top-auto lg:z-auto lg:bg-transparent lg:backdrop-filter-none">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 text-xs font-medium transition-all duration-200
                  ${activeTab === tab.key
                    ? 'text-white border-b-2 border-primary bg-white/[0.02]'
                    : 'text-slate-500 hover:text-slate-300'
                  }`}
              >
                <tab.icon className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Tab content */}
          <div className="flex-1 overflow-visible lg:overflow-hidden">
            {renderActiveTab()}
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
