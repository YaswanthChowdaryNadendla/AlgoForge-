import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Play, RotateCcw } from 'lucide-react';
import GlassCard from '../ui/GlassCard';

const INITIAL_ARRAY = [38, 27, 43, 10, 82, 15, 62, 35, 50, 20];
const BAR_COLORS = {
  default: 'from-blue-500 to-blue-600',
  comparing: 'from-amber-400 to-amber-500',
  swapping: 'from-rose-500 to-rose-600',
  sorted: 'from-emerald-400 to-emerald-500',
};

export default function Showcase() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  const [array, setArray] = useState([...INITIAL_ARRAY]);
  const [comparing, setComparing] = useState([]);
  const [swapping, setSwapping] = useState([]);
  const [sorted, setSorted] = useState([]);
  const [isSorting, setIsSorting] = useState(false);
  const timeoutsRef = useRef([]);

  const clearTimeouts = useCallback(() => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
  }, []);

  const reset = useCallback(() => {
    clearTimeouts();
    setArray([...INITIAL_ARRAY]);
    setComparing([]);
    setSwapping([]);
    setSorted([]);
    setIsSorting(false);
  }, [clearTimeouts]);

  const bubbleSort = useCallback(() => {
    clearTimeouts();
    setIsSorting(true);
    const arr = [...INITIAL_ARRAY];
    const steps = [];
    const n = arr.length;

    for (let i = 0; i < n - 1; i++) {
      for (let j = 0; j < n - i - 1; j++) {
        steps.push({ type: 'compare', indices: [j, j + 1], array: [...arr] });
        if (arr[j] > arr[j + 1]) {
          [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
          steps.push({ type: 'swap', indices: [j, j + 1], array: [...arr] });
        }
      }
      steps.push({ type: 'sorted', index: n - i - 1, array: [...arr] });
    }
    steps.push({ type: 'sorted', index: 0, array: [...arr] });

    let delay = 0;
    const SPEED = 120;
    const sortedIndices = [];

    steps.forEach((step) => {
      const t = setTimeout(() => {
        setArray([...step.array]);
        if (step.type === 'compare') {
          setComparing(step.indices);
          setSwapping([]);
        } else if (step.type === 'swap') {
          setSwapping(step.indices);
          setComparing([]);
        } else if (step.type === 'sorted') {
          sortedIndices.push(step.index);
          setSorted([...sortedIndices]);
          setComparing([]);
          setSwapping([]);
        }
      }, delay);
      timeoutsRef.current.push(t);
      delay += SPEED;
    });

    const endT = setTimeout(() => {
      setIsSorting(false);
      setComparing([]);
      setSwapping([]);
    }, delay + 200);
    timeoutsRef.current.push(endT);
  }, [clearTimeouts]);

  // Auto-start when section comes into view
  useEffect(() => {
    if (isInView && !isSorting && sorted.length === 0) {
      const t = setTimeout(bubbleSort, 800);
      return () => clearTimeout(t);
    }
  }, [isInView, isSorting, sorted.length, bubbleSort]);

  useEffect(() => {
    return clearTimeouts;
  }, [clearTimeouts]);

  const maxVal = Math.max(...INITIAL_ARRAY);

  const getBarColor = (index) => {
    if (sorted.includes(index)) return BAR_COLORS.sorted;
    if (swapping.includes(index)) return BAR_COLORS.swapping;
    if (comparing.includes(index)) return BAR_COLORS.comparing;
    return BAR_COLORS.default;
  };

  return (
    <section ref={sectionRef} className="relative py-32 px-6" id="showcase">
      <div className="absolute inset-0 bg-gradient-to-b from-dark-950 via-dark-900/50 to-dark-950 pointer-events-none" />

      <div className="relative max-w-5xl mx-auto">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl sm:text-5xl font-bold mb-6">
            <span className="text-slate-100">See It </span>
            <span className="gradient-text">In Action</span>
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Watch Bubble Sort animate in real time — compare, swap, and sort
            elements step by step.
          </p>
        </motion.div>

        {/* Visualization Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          <GlassCard className="p-8 sm:p-12" hover={false}>
            {/* Controls */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <span className="text-sm font-mono text-slate-400">Bubble Sort</span>
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={bubbleSort}
                  disabled={isSorting}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <Play className="w-3 h-3" />
                  Play
                </button>
                <button
                  onClick={reset}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-white/[0.05] text-slate-400 border border-white/[0.08] hover:bg-white/[0.1] transition-colors"
                >
                  <RotateCcw className="w-3 h-3" />
                  Reset
                </button>
              </div>
            </div>

            {/* Bars */}
            <div className="flex items-end justify-center gap-2 sm:gap-3 h-64 sm:h-72">
              {array.map((value, index) => (
                <motion.div
                  key={index}
                  className="relative flex-1 max-w-16 rounded-t-lg overflow-hidden"
                  style={{ height: `${(value / maxVal) * 100}%` }}
                  layout
                  transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                >
                  <div
                    className={`absolute inset-0 bg-gradient-to-t ${getBarColor(index)} transition-all duration-150`}
                  />
                  {/* Glow effect for active bars */}
                  {(comparing.includes(index) || swapping.includes(index)) && (
                    <div className="absolute inset-0 bg-white/10 animate-pulse" />
                  )}
                  {/* Value label */}
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-mono text-slate-400">
                    {value}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Legend */}
            <div className="flex flex-wrap items-center justify-center gap-6 mt-8 pt-6 border-t border-white/[0.06]">
              {[
                { color: 'bg-blue-500', label: 'Default' },
                { color: 'bg-amber-400', label: 'Comparing' },
                { color: 'bg-rose-500', label: 'Swapping' },
                { color: 'bg-emerald-400', label: 'Sorted' },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-sm ${item.color}`} />
                  <span className="text-xs text-slate-500">{item.label}</span>
                </div>
              ))}
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </section>
  );
}
