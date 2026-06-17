import { useState, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, RotateCcw, Shuffle, Activity, ArrowUpDown, Clock, Database, Trophy, TrendingUp } from 'lucide-react';
import GlassCard from '../ui/GlassCard';
import GlowButton from '../ui/GlowButton';
import Slider from '../ui/Slider';
import Badge from '../ui/Badge';
import { generateRandomArray } from '../../utils/arrayUtils';
import { getBarGradient, getBarShadow } from '../../utils/colorUtils';


const algorithmLabels = {
  bubbleSort: 'Bubble Sort', selectionSort: 'Selection Sort', insertionSort: 'Insertion Sort',
  mergeSort: 'Merge Sort', quickSort: 'Quick Sort', heapSort: 'Heap Sort',
};
const complexities = {
  bubbleSort: { best: 'O(n)', avg: 'O(n²)', worst: 'O(n²)', space: 'O(1)', memEst: 'n' },
  selectionSort: { best: 'O(n²)', avg: 'O(n²)', worst: 'O(n²)', space: 'O(1)', memEst: 'n' },
  insertionSort: { best: 'O(n)', avg: 'O(n²)', worst: 'O(n²)', space: 'O(1)', memEst: 'n' },
  mergeSort: { best: 'O(n log n)', avg: 'O(n log n)', worst: 'O(n log n)', space: 'O(n)', memEst: '2n' },
  quickSort: { best: 'O(n log n)', avg: 'O(n log n)', worst: 'O(n²)', space: 'O(log n)', memEst: 'n + log n' },
  heapSort: { best: 'O(n log n)', avg: 'O(n log n)', worst: 'O(n log n)', space: 'O(1)', memEst: 'n' },
};

function MiniVisualizer({ array, steps, speed, isRunning, onComplete, onStatsUpdate, onProgressUpdate }) {
  const [currentStep, setCurrentStep] = useState(-1);
  const timerRef = useRef(null);
  const stepRef = useRef(-1);

  const currentState = steps[currentStep] || null;
  const displayArray = currentState ? currentState.array : array;
  const maxValue = Math.max(...(displayArray || [1]));

  useEffect(() => {
    if (!isRunning || steps.length === 0) return;
    stepRef.current = 0;
    setCurrentStep(0);

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

    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [isRunning, steps, speed]);

  // Reset when not running
  useEffect(() => {
    if (!isRunning) {
      setCurrentStep(-1);
      stepRef.current = -1;
    }
  }, [isRunning]);

  return (
    <div className="flex items-end justify-center gap-[1px] h-[200px] md:h-[260px]">
      {(displayArray || []).map((value, index) => {
        const heightPercent = (value / maxValue) * 85;
        return (
          <div key={index} className="flex-1 flex flex-col items-center justify-end" style={{ maxWidth: 20 }}>
            <div
              className="w-full rounded-t-sm transition-all duration-75"
              style={{
                height: `${heightPercent}%`,
                background: getBarGradient(index, currentState),
                boxShadow: getBarShadow(index, currentState),
                minHeight: 2,
              }}
            />
          </div>
        );
      })}
    </div>
  );
}

function StatRow({ icon: Icon, label, value, color }) {
  return (
    <div className="flex items-center gap-2 p-2 rounded-lg bg-white/[0.02]">
      <Icon className={`w-3 h-3 ${color}`} />
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

  useEffect(() => { handleGenerate(); }, [arraySize]);

  const renderSide = (side) => {
    const algo = side === 'left' ? algoLeft : algoRight;
    const setAlgo = side === 'left' ? setAlgoLeft : setAlgoRight;
    const steps = side === 'left' ? stepsLeft : stepsRight;
    const stats = side === 'left' ? statsLeft : statsRight;
    const setStats = side === 'left' ? setStatsLeft : setStatsRight;
    const progress = side === 'left' ? progressLeft : progressRight;
    const setProgress = side === 'left' ? setProgressLeft : setProgressRight;
    const done = side === 'left' ? doneLeft : doneRight;
    const onComplete = side === 'left' ? handleCompleteLeft : handleCompleteRight;
    const isWinner = winner === side;
    const comp = complexities[algo];

    return (
      <GlassCard hover={false} className={`p-4 ${isWinner ? 'ring-1 ring-emerald-500/30' : ''}`}>
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <select value={algo} onChange={(e) => setAlgo(e.target.value)} disabled={isRunning}
            className="px-3 py-2 rounded-xl bg-white/[0.03] border border-white/[0.08] text-sm text-slate-200 focus:outline-none appearance-none cursor-pointer"
            style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2394A3B8' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 8px center', paddingRight: '28px' }}
          >
            {Object.entries(algorithmLabels).map(([k, v]) => (
              <option key={k} value={k} className="bg-dark-900">{v}</option>
            ))}
          </select>
          <div className="flex items-center gap-2">
            {isWinner && (
              <motion.div
                initial={{ scale: 0 }} animate={{ scale: 1 }}
                className="flex items-center gap-1 px-2 py-1 rounded-lg bg-emerald-500/15 border border-emerald-500/30"
              >
                <Trophy className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-xs font-bold text-emerald-400">Winner!</span>
              </motion.div>
            )}
            {done && !isWinner && <Badge variant="info">Done</Badge>}
          </div>
        </div>

        {/* Progress bar */}
        <div className="h-1 rounded-full bg-white/[0.05] overflow-hidden mb-3">
          <motion.div
            className="h-full rounded-full"
            style={{
              background: done ? 'linear-gradient(90deg, #10B981, #059669)' : 'linear-gradient(90deg, #3B82F6, #8B5CF6)',
            }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.15 }}
          />
        </div>

        {/* Mini Visualizer */}
        <MiniVisualizer
          array={array} steps={steps} speed={speed}
          isRunning={isRunning} onComplete={onComplete}
          onStatsUpdate={setStats} onProgressUpdate={setProgress}
        />

        {/* Stats */}
        <div className="grid grid-cols-2 gap-1.5 mt-3">
          <StatRow icon={Activity} label="Comparisons" value={stats.comparisons} color="text-amber-400" />
          <StatRow icon={ArrowUpDown} label="Swaps" value={stats.swaps} color="text-red-400" />
          <StatRow icon={Database} label="Array Ops" value={stats.arrayAccesses} color="text-cyan-400" />
          <StatRow icon={TrendingUp} label="Progress" value={`${progress}%`} color="text-emerald-400" />
        </div>

        {/* Memory estimation */}
        <div className="mt-2 px-2 py-1.5 rounded-lg bg-white/[0.02] text-center">
          <span className="text-[9px] text-slate-500">Est. Memory: </span>
          <span className="text-[10px] font-mono text-slate-400">{comp.memEst} ({comp.space})</span>
        </div>
      </GlassCard>
    );
  };

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-white">
          Algorithm <span className="gradient-text">Comparison</span>
        </h1>
        <p className="text-slate-500 text-sm mt-1">Race sorting algorithms side by side with detailed stats</p>
      </div>

      <GlassCard hover={false} className="p-4 md:p-5">
        <div className="flex flex-wrap items-end gap-4">
          <div className="flex-1 min-w-[120px]">
            <Slider label="Array Size" value={arraySize} onChange={setArraySize} min={10} max={80} />
          </div>
          <div className="flex-1 min-w-[120px]">
            <Slider label="Speed" value={speed} onChange={setSpeed} min={1} max={10} unit="x" />
          </div>
          <GlowButton variant="ghost" icon={Shuffle} onClick={handleGenerate} disabled={isRunning}>Generate</GlowButton>
          <GlowButton variant="primary" icon={Play} onClick={handleStart} disabled={isRunning}>Race!</GlowButton>
          <GlowButton variant="ghost" icon={RotateCcw} onClick={() => { setIsRunning(false); handleGenerate(); }}>Reset</GlowButton>
        </div>
      </GlassCard>

      {/* Side by Side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {renderSide('left')}
        {renderSide('right')}
      </div>

      {/* Complexity Table */}
      <GlassCard hover={false} className="p-4 md:p-5 overflow-auto">
        <h3 className="text-sm font-semibold text-white mb-3">Complexity Comparison</h3>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-slate-500 text-xs">
              <th className="text-left pb-2">Metric</th>
              <th className="text-center pb-2">{algorithmLabels[algoLeft]}</th>
              <th className="text-center pb-2">{algorithmLabels[algoRight]}</th>
            </tr>
          </thead>
          <tbody className="text-slate-300">
            {[
              ['Best Time', 'best', 'best'],
              ['Avg Time', 'avg', 'average'],
              ['Worst Time', 'worst', 'worst'],
              ['Space', 'space', 'info'],
            ].map(([label, key, variant]) => (
              <tr key={key} className="border-t border-white/[0.04]">
                <td className="py-2 text-slate-500">{label}</td>
                <td className="text-center"><Badge variant={variant}>{complexities[algoLeft][key]}</Badge></td>
                <td className="text-center"><Badge variant={variant}>{complexities[algoRight][key]}</Badge></td>
              </tr>
            ))}
            <tr className="border-t border-white/[0.04]">
              <td className="py-2 text-slate-500">Comparisons</td>
              <td className="text-center font-mono text-xs">{statsLeft.comparisons}</td>
              <td className="text-center font-mono text-xs">{statsRight.comparisons}</td>
            </tr>
            <tr className="border-t border-white/[0.04]">
              <td className="py-2 text-slate-500">Swaps</td>
              <td className="text-center font-mono text-xs">{statsLeft.swaps}</td>
              <td className="text-center font-mono text-xs">{statsRight.swaps}</td>
            </tr>
            <tr className="border-t border-white/[0.04]">
              <td className="py-2 text-slate-500">Total Steps</td>
              <td className="text-center font-mono text-xs">{stepsLeft.length}</td>
              <td className="text-center font-mono text-xs">{stepsRight.length}</td>
            </tr>
          </tbody>
        </table>
      </GlassCard>
    </div>
  );
}
