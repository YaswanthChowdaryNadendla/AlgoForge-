import { useState, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, RotateCcw, Shuffle, Activity, ArrowUpDown, Clock, Database, Trophy, TrendingUp, Sparkles, AlertCircle } from 'lucide-react';
import GlassCard from '../ui/GlassCard';
import GlowButton from '../ui/GlowButton';
import Slider from '../ui/Slider';
import Badge from '../ui/Badge';
import { generateRandomArray } from '../../utils/arrayUtils';
import { getBarGradient, getBarShadow } from '../../utils/colorUtils';

const algorithmLabels = {
  bubbleSort: 'Bubble Sort',
  selectionSort: 'Selection Sort',
  insertionSort: 'Insertion Sort',
  mergeSort: 'Merge Sort',
  quickSort: 'Quick Sort',
  heapSort: 'Heap Sort',
};

const complexities = {
  bubbleSort: { best: 'O(n)', avg: 'O(n²)', worst: 'O(n²)', space: 'O(1)', memEst: 'n' },
  selectionSort: { best: 'O(n²)', avg: 'O(n²)', worst: 'O(n²)', space: 'O(1)', memEst: 'n' },
  insertionSort: { best: 'O(n)', avg: 'O(n²)', worst: 'O(n²)', space: 'O(1)', memEst: 'n' },
  mergeSort: { best: 'O(n log n)', avg: 'O(n log n)', worst: 'O(n log n)', space: 'O(n)', memEst: '2n' },
  quickSort: { best: 'O(n log n)', avg: 'O(n log n)', worst: 'O(n²)', space: 'O(log n)', memEst: 'n + log n' },
  heapSort: { best: 'O(n log n)', avg: 'O(n log n)', worst: 'O(n log n)', space: 'O(1)', memEst: 'n' },
};

function AnimatedBarGraph({ array, currentState }) {
  const maxValue = Math.max(...(array || [1]));
  const showLabels = array && array.length <= 35;

  return (
    <div className="flex items-end justify-center gap-[2px] h-[200px] md:h-[260px] px-1 bg-black/20 rounded-xl border border-white/[0.04] p-3 overflow-hidden">
      {(array || []).map((value, index) => {
        const heightPercent = (value / maxValue) * 85;
        const barWidth = Math.max(2, Math.min(24, (100 / array.length) * 0.95));

        return (
          <motion.div
            key={index}
            className="flex-1 flex flex-col items-center justify-end h-full"
            style={{ maxWidth: 24, width: `${barWidth}%` }}
            layout
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          >
            {showLabels && (
              <span className="text-[8px] font-mono text-slate-500 mb-1 select-none">
                {value}
              </span>
            )}
            <motion.div
              className="w-full rounded-t-[3px]"
              style={{
                height: `${heightPercent}%`,
                background: getBarGradient(index, currentState),
                boxShadow: getBarShadow(index, currentState),
                minHeight: '4px',
              }}
              initial={{ height: 0 }}
              animate={{ height: `${heightPercent}%` }}
              transition={{ type: 'spring', stiffness: 200, damping: 22 }}
            />
          </motion.div>
        );
      })}
    </div>
  );
}

function MiniVisualizer({ array, steps, speed, isRunning, onComplete, onStatsUpdate, onProgressUpdate, onTimeUpdate }) {
  const [currentStep, setCurrentStep] = useState(-1);
  const timerRef = useRef(null);
  const stepRef = useRef(-1);
  const startTimeRef = useRef(null);
  const animFrameRef = useRef(null);

  const currentState = steps[currentStep] || null;
  const displayArray = currentState ? currentState.array : array;

  // Visualizer step playback loop
  useEffect(() => {
    if (!isRunning || steps.length === 0) return;
    stepRef.current = 0;
    setCurrentStep(0);
    startTimeRef.current = performance.now();

    const delay = [500, 400, 300, 200, 150, 100, 75, 50, 30, 15][speed - 1] || 100;

    const advance = () => {
      stepRef.current += 1;
      if (stepRef.current >= steps.length) {
        onProgressUpdate?.(100);
        onComplete?.();
        return;
      }
      setCurrentStep(stepRef.current);
      const step = steps[stepRef.current];
      const progress = Math.round((stepRef.current / (steps.length - 1)) * 100);
      
      onStatsUpdate?.({
        comparisons: step.comparisons || 0,
        swaps: step.swaps || 0,
        arrayAccesses: step.arrayAccesses || 0,
      });
      onProgressUpdate?.(progress);
      timerRef.current = setTimeout(advance, delay);
    };
    timerRef.current = setTimeout(advance, delay);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isRunning, steps, speed]);

  // Live timer loop using requestAnimationFrame
  useEffect(() => {
    if (!isRunning || steps.length === 0) return;

    const tick = () => {
      if (startTimeRef.current !== null && stepRef.current < steps.length) {
        const elapsed = Math.round(performance.now() - startTimeRef.current);
        onTimeUpdate?.(elapsed);
        animFrameRef.current = requestAnimationFrame(tick);
      }
    };
    animFrameRef.current = requestAnimationFrame(tick);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isRunning, steps]);

  // Reset when not running
  useEffect(() => {
    if (!isRunning) {
      setCurrentStep(-1);
      stepRef.current = -1;
    }
  }, [isRunning]);

  return <AnimatedBarGraph array={displayArray} currentState={currentState} />;
}

function StatRow({ icon: Icon, label, value, color }) {
  return (
    <div className="flex items-center gap-2 p-2 rounded-lg bg-white/[0.02] border border-white/[0.04]">
      <Icon className={`w-3.5 h-3.5 ${color}`} />
      <span className="text-[10px] text-slate-500 flex-1">{label}</span>
      <span className="text-xs font-mono font-bold text-white">{value}</span>
    </div>
  );
}

export default function ComparisonMode() {
  const [algoLeft, setAlgoLeft] = useState('bubbleSort');
  const [algoRight, setAlgoRight] = useState('mergeSort');
  const [arraySize, setArraySize] = useState(30);
  const [speed, setSpeed] = useState(5);
  const [array, setArray] = useState(() => generateRandomArray(30));
  const [isRunning, setIsRunning] = useState(false);
  const [stepsLeft, setStepsLeft] = useState([]);
  const [stepsRight, setStepsRight] = useState([]);
  const [statsLeft, setStatsLeft] = useState({ comparisons: 0, swaps: 0, arrayAccesses: 0 });
  const [statsRight, setStatsRight] = useState({ comparisons: 0, swaps: 0, arrayAccesses: 0 });
  const [elapsedLeft, setElapsedLeft] = useState(0);
  const [elapsedRight, setElapsedRight] = useState(0);
  const [progressLeft, setProgressLeft] = useState(0);
  const [progressRight, setProgressRight] = useState(0);
  const [doneLeft, setDoneLeft] = useState(false);
  const [doneRight, setDoneRight] = useState(false);
  const [winner, setWinner] = useState(null); // 'left' | 'right' | 'tie' | null
  const finishOrderRef = useRef([]);

  const handleGenerate = () => {
    const arr = generateRandomArray(arraySize);
    setArray(arr);
    setIsRunning(false);
    setDoneLeft(false);
    setDoneRight(false);
    setStatsLeft({ comparisons: 0, swaps: 0, arrayAccesses: 0 });
    setStatsRight({ comparisons: 0, swaps: 0, arrayAccesses: 0 });
    setElapsedLeft(0);
    setElapsedRight(0);
    setProgressLeft(0);
    setProgressRight(0);
    setWinner(null);
    finishOrderRef.current = [];
  };

  const handleStart = async () => {
    const getSortFn = async (algo) => {
      switch (algo) {
        case 'bubbleSort': return (await import('../../algorithms/sorting/bubbleSort')).default;
        case 'selectionSort': return (await import('../../algorithms/sorting/selectionSort')).default;
        case 'insertionSort': return (await import('../../algorithms/sorting/insertionSort')).default;
        case 'mergeSort': return (await import('../../algorithms/sorting/mergeSort')).default;
        case 'quickSort': return (await import('../../algorithms/sorting/quickSort')).default;
        case 'heapSort': return (await import('../../algorithms/sorting/heapSort')).default;
        default: return null;
      }
    };

    const [leftFn, rightFn] = await Promise.all([
      getSortFn(algoLeft),
      getSortFn(algoRight),
    ]);

    if (!leftFn || !rightFn) return;

    const left = leftFn([...array]);
    const right = rightFn([...array]);
    setStepsLeft(left);
    setStepsRight(right);
    setDoneLeft(false);
    setDoneRight(false);
    setStatsLeft({ comparisons: 0, swaps: 0, arrayAccesses: 0 });
    setStatsRight({ comparisons: 0, swaps: 0, arrayAccesses: 0 });
    setElapsedLeft(0);
    setElapsedRight(0);
    setProgressLeft(0);
    setProgressRight(0);
    setWinner(null);
    finishOrderRef.current = [];
    setIsRunning(true);
  };

  const handleCompleteLeft = useCallback(() => {
    setDoneLeft(true);
    finishOrderRef.current.push('left');
    if (finishOrderRef.current.length === 1) {
      setWinner('left');
    } else if (finishOrderRef.current.length === 2 && !winner) {
      setWinner('tie');
    }
  }, [winner]);

  const handleCompleteRight = useCallback(() => {
    setDoneRight(true);
    finishOrderRef.current.push('right');
    if (finishOrderRef.current.length === 1) {
      setWinner('right');
    } else if (finishOrderRef.current.length === 2 && !winner) {
      setWinner('tie');
    }
  }, [winner]);

  useEffect(() => {
    handleGenerate();
  }, [arraySize]);

  const getWinnerExplanation = () => {
    if (winner === 'tie') {
      return 'Both algorithms finished at the exact same time. On larger datasets, difference in time complexity profiles becomes more evident.';
    }
    const wAlgo = winner === 'left' ? algoLeft : algoRight;
    const lAlgo = winner === 'left' ? algoRight : algoLeft;
    const ratio = Math.max(elapsedLeft, elapsedRight) / Math.min(elapsedLeft, elapsedRight || 1);

    return `${algorithmLabels[wAlgo]} completed the sorting operation ${ratio.toFixed(1)}x faster than ${algorithmLabels[lAlgo]}. This highlights the power of ${complexities[wAlgo].avg} average time complexity over ${algorithmLabels[lAlgo]}'s ${complexities[lAlgo].avg} complexity.`;
  };

  const renderSide = (side) => {
    const algo = side === 'left' ? algoLeft : algoRight;
    const setAlgo = side === 'left' ? setAlgoLeft : setAlgoRight;
    const steps = side === 'left' ? stepsLeft : stepsRight;
    const stats = side === 'left' ? statsLeft : statsRight;
    const setStats = side === 'left' ? setStatsLeft : setStatsRight;
    const elapsed = side === 'left' ? elapsedLeft : elapsedRight;
    const setElapsed = side === 'left' ? setElapsedLeft : setElapsedRight;
    const progress = side === 'left' ? progressLeft : progressRight;
    const setProgress = side === 'left' ? setProgressLeft : setProgressRight;
    const done = side === 'left' ? doneLeft : doneRight;
    const onComplete = side === 'left' ? handleCompleteLeft : handleCompleteRight;
    const isWinner = winner === side;
    const comp = complexities[algo];

    return (
      <GlassCard hover={false} className={`p-4 md:p-6 transition-all duration-300 ${isWinner ? 'border-emerald-500/30 bg-emerald-500/[0.01] shadow-[0_0_20px_rgba(16,185,129,0.05)]' : ''}`}>
        {/* Header Controls */}
        <div className="flex items-center justify-between mb-4">
          <select
            value={algo}
            onChange={(e) => setAlgo(e.target.value)}
            disabled={isRunning}
            className="px-3 py-2 rounded-xl bg-white/[0.03] border border-white/[0.08] text-sm text-slate-200 focus:outline-none appearance-none cursor-pointer"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2394A3B8' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`,
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'right 8px center',
              paddingRight: '28px',
            }}
          >
            {Object.entries(algorithmLabels).map(([k, v]) => (
              <option key={k} value={k} className="bg-dark-900">{v}</option>
            ))}
          </select>

          <div className="flex items-center gap-2">
            {isWinner && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-500/15 border border-emerald-500/30 shadow-[0_0_10px_rgba(16,185,129,0.1)]"
              >
                <Trophy className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">Winner</span>
              </motion.div>
            )}
            {done && !isWinner && <Badge variant="info">Done</Badge>}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="h-1.5 rounded-full bg-white/[0.04] overflow-hidden mb-4 border border-white/[0.02]">
          <motion.div
            className="h-full rounded-full"
            style={{
              background: done ? 'linear-gradient(90deg, #10B981, #059669)' : 'linear-gradient(90deg, #3B82F6, #8B5CF6)',
            }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.1 }}
          />
        </div>

        {/* Animated Visualizer */}
        <MiniVisualizer
          array={array}
          steps={steps}
          speed={speed}
          isRunning={isRunning}
          onComplete={onComplete}
          onStatsUpdate={setStats}
          onTimeUpdate={setElapsed}
          onProgressUpdate={setProgress}
        />

        {/* Live Metrics Grid */}
        <div className="grid grid-cols-2 gap-2 mt-4">
          <StatRow icon={Clock} label="Execution Time" value={`${elapsed} ms`} color="text-cyan-400" />
          <StatRow icon={TrendingUp} label="Progress" value={`${progress}%`} color="text-emerald-400" />
          <StatRow icon={Activity} label="Comparisons" value={stats.comparisons} color="text-amber-400" />
          <StatRow icon={ArrowUpDown} label="Swaps" value={stats.swaps} color="text-red-400" />
          <StatRow icon={Clock} label="Time Complexity" value={comp.avg} color="text-violet-400" />
          <StatRow icon={Database} label="Space Complexity" value={comp.space} color="text-pink-400" />
        </div>
      </GlassCard>
    );
  };

  const showWinnerCard = doneLeft && doneRight && winner;

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-white">
          Algorithm <span className="gradient-text">Comparison</span>
        </h1>
        <p className="text-slate-500 text-sm mt-1">Race sorting algorithms side by side with real-time timers and animated bar graphs</p>
      </div>

      <GlassCard hover={false} className="p-4 md:p-5">
        <div className="flex flex-wrap items-end gap-4">
          <div className="flex-1 min-w-[120px]">
            <Slider label="Array Size" value={arraySize} onChange={setArraySize} min={10} max={60} disabled={isRunning} />
          </div>
          <div className="flex-1 min-w-[120px]">
            <Slider label="Speed" value={speed} onChange={setSpeed} min={1} max={10} unit="x" />
          </div>
          <GlowButton variant="ghost" icon={Shuffle} onClick={handleGenerate} disabled={isRunning}>Generate</GlowButton>
          <GlowButton variant="primary" icon={Play} onClick={handleStart} disabled={isRunning}>Race!</GlowButton>
          <GlowButton variant="ghost" icon={RotateCcw} onClick={handleGenerate}>Reset</GlowButton>
        </div>
      </GlassCard>

      {/* Winner Results Card */}
      <AnimatePresence>
        {showWinnerCard && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
          >
            <GlassCard hover={false} className="p-5 md:p-6 border border-emerald-500/20 bg-emerald-500/[0.02] overflow-hidden relative">
              <div className="absolute right-0 top-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />
              <div className="flex flex-col md:flex-row items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.25)] shrink-0">
                  {winner === 'tie' ? <Sparkles className="w-6 h-6 text-amber-400" /> : <Trophy className="w-6 h-6 text-amber-400 animate-bounce" />}
                </div>

                <div className="space-y-1 text-center md:text-left flex-1">
                  <h2 className="text-lg font-bold text-slate-200">
                    {winner === 'tie' ? "Sorting Race Result: It's a Tie!" : `Sorting Race Winner: ${algorithmLabels[winner === 'left' ? algoLeft : algoRight]}`}
                  </h2>
                  <p className="text-slate-400 text-xs md:text-sm leading-relaxed max-w-3xl">
                    {getWinnerExplanation()}
                  </p>
                </div>

                <div className="flex gap-2 shrink-0 w-full md:w-auto justify-center">
                  <GlowButton variant="ghost" icon={RotateCcw} onClick={handleGenerate} size="sm">
                    Dismiss
                  </GlowButton>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Side by Side Visualizers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {renderSide('left')}
        {renderSide('right')}
      </div>

      {/* Complexity Table */}
      <GlassCard hover={false} className="p-4 md:p-5 overflow-auto">
        <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
          <Activity className="w-4 h-4 text-primary" /> Complexity Comparison
        </h3>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-slate-500 text-xs">
              <th className="text-left pb-2 border-b border-white/[0.04]">Metric</th>
              <th className="text-center pb-2 border-b border-white/[0.04]">{algorithmLabels[algoLeft]}</th>
              <th className="text-center pb-2 border-b border-white/[0.04]">{algorithmLabels[algoRight]}</th>
            </tr>
          </thead>
          <tbody className="text-slate-300">
            {[
              ['Best Time Complexity', 'best', 'best'],
              ['Average Time Complexity', 'avg', 'average'],
              ['Worst Time Complexity', 'worst', 'worst'],
              ['Space Complexity', 'space', 'info'],
            ].map(([label, key, variant]) => (
              <tr key={key} className="border-t border-white/[0.04]">
                <td className="py-2.5 text-slate-500 text-xs md:text-sm">{label}</td>
                <td className="text-center py-2.5"><Badge variant={variant}>{complexities[algoLeft][key]}</Badge></td>
                <td className="text-center py-2.5"><Badge variant={variant}>{complexities[algoRight][key]}</Badge></td>
              </tr>
            ))}
            <tr className="border-t border-white/[0.04]">
              <td className="py-2.5 text-slate-500 text-xs md:text-sm">Total Comparisons</td>
              <td className="text-center py-2.5 font-mono text-xs font-semibold text-amber-400">{statsLeft.comparisons}</td>
              <td className="text-center py-2.5 font-mono text-xs font-semibold text-amber-400">{statsRight.comparisons}</td>
            </tr>
            <tr className="border-t border-white/[0.04]">
              <td className="py-2.5 text-slate-500 text-xs md:text-sm">Total Swaps</td>
              <td className="text-center py-2.5 font-mono text-xs font-semibold text-red-400">{statsLeft.swaps}</td>
              <td className="text-center py-2.5 font-mono text-xs font-semibold text-red-400">{statsRight.swaps}</td>
            </tr>
            <tr className="border-t border-white/[0.04]">
              <td className="py-2.5 text-slate-500 text-xs md:text-sm">Simulation Duration</td>
              <td className="text-center py-2.5 font-mono text-xs font-semibold text-cyan-400">{elapsedLeft} ms</td>
              <td className="text-center py-2.5 font-mono text-xs font-semibold text-cyan-400">{elapsedRight} ms</td>
            </tr>
            <tr className="border-t border-white/[0.04]">
              <td className="py-2.5 text-slate-500 text-xs md:text-sm">Total Traversal Steps</td>
              <td className="text-center py-2.5 font-mono text-xs text-slate-400">{stepsLeft.length}</td>
              <td className="text-center py-2.5 font-mono text-xs text-slate-400">{stepsRight.length}</td>
            </tr>
          </tbody>
        </table>
      </GlassCard>
    </div>
  );
}
