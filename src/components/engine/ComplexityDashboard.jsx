import { motion } from 'framer-motion';
import { Activity, ArrowUpDown, Database, Clock, RotateCw, TrendingUp } from 'lucide-react';
import Badge from '../ui/Badge';

const complexities = {
  bubbleSort: { time: { best: 'O(n)', avg: 'O(n²)', worst: 'O(n²)' }, space: 'O(1)' },
  selectionSort: { time: { best: 'O(n²)', avg: 'O(n²)', worst: 'O(n²)' }, space: 'O(1)' },
  insertionSort: { time: { best: 'O(n)', avg: 'O(n²)', worst: 'O(n²)' }, space: 'O(1)' },
  mergeSort: { time: { best: 'O(n log n)', avg: 'O(n log n)', worst: 'O(n log n)' }, space: 'O(n)' },
  quickSort: { time: { best: 'O(n log n)', avg: 'O(n log n)', worst: 'O(n²)' }, space: 'O(log n)' },
  heapSort: { time: { best: 'O(n log n)', avg: 'O(n log n)', worst: 'O(n log n)' }, space: 'O(1)' },
  linearSearch: { time: { best: 'O(1)', avg: 'O(n)', worst: 'O(n)' }, space: 'O(1)' },
  binarySearch: { time: { best: 'O(1)', avg: 'O(log n)', worst: 'O(log n)' }, space: 'O(1)' },
};

function StatCard({ icon: Icon, label, value, color, subtext }) {
  return (
    <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
      <div className="flex items-center gap-1.5 mb-1">
        <Icon className={`w-3.5 h-3.5 ${color}`} />
        <span className="text-[10px] text-slate-500 uppercase tracking-wider">{label}</span>
      </div>
      <p className="text-lg font-bold font-mono text-white">{value}</p>
      {subtext && <p className="text-[10px] text-slate-600 mt-0.5">{subtext}</p>}
    </div>
  );
}

/**
 * Live-updating complexity analysis dashboard.
 */
export default function ComplexityDashboard({ stats, algorithm, totalSteps }) {
  const complexity = complexities[algorithm] || { time: { best: '—', avg: '—', worst: '—' }, space: '—' };

  return (
    <div className="space-y-3">
      {/* Complexity badges */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/[0.02] border border-white/[0.04]">
          <span className="text-[10px] text-slate-500">Time:</span>
          <Badge variant="best">{complexity.time.best}</Badge>
          <span className="text-[9px] text-slate-600">/</span>
          <Badge variant="average">{complexity.time.avg}</Badge>
          <span className="text-[9px] text-slate-600">/</span>
          <Badge variant="worst">{complexity.time.worst}</Badge>
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/[0.02] border border-white/[0.04]">
          <span className="text-[10px] text-slate-500">Space:</span>
          <Badge variant="info">{complexity.space}</Badge>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
        <StatCard icon={Activity} label="Comparisons" value={stats.comparisons} color="text-amber-400" />
        <StatCard icon={ArrowUpDown} label="Swaps" value={stats.swaps} color="text-red-400" />
        <StatCard icon={Database} label="Array Ops" value={stats.arrayAccesses} color="text-cyan-400" />
        <StatCard icon={Clock} label="Runtime" value={`${stats.runtime}ms`} color="text-purple-400" />
        <StatCard icon={RotateCw} label="Pass" value={stats.pass} color="text-blue-400" />
        <StatCard icon={TrendingUp} label="Progress" value={`${stats.progress}%`} color="text-emerald-400"
          subtext={`Step ${Math.max(0, stats.progress > 0 ? Math.round(stats.progress / 100 * totalSteps) : 0)}/${totalSteps}`} />
      </div>

      {/* Progress bar */}
      <div className="h-1 rounded-full bg-white/[0.05] overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{
            background: stats.progress >= 100
              ? 'linear-gradient(90deg, #10B981, #059669)'
              : 'linear-gradient(90deg, #3B82F6, #8B5CF6)',
          }}
          initial={{ width: 0 }}
          animate={{ width: `${stats.progress}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>
    </div>
  );
}
