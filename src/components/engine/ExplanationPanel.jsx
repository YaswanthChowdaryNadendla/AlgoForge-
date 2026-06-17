import { motion } from 'framer-motion';
import { MessageSquare, ArrowRight } from 'lucide-react';

/**
 * Execution Explanation Panel — shows detailed context at each algorithm step.
 */
export default function ExplanationPanel({ currentState, algorithm, currentStep, totalSteps }) {
  if (!currentState) {
    return (
      <div className="h-full flex items-center justify-center p-6">
        <div className="text-center space-y-2">
          <MessageSquare className="w-8 h-8 text-slate-700 mx-auto" />
          <p className="text-slate-600 text-sm">Run the algorithm to see step-by-step explanations</p>
        </div>
      </div>
    );
  }

  const progress = totalSteps > 1
    ? Math.round((currentStep / (totalSteps - 1)) * 100)
    : 0;

  return (
    <div className="h-full overflow-y-auto p-4 space-y-4">
      {/* Progress */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">Progress</span>
          <span className="text-xs font-mono font-bold text-white">{progress}%</span>
        </div>
        <div className="h-1.5 rounded-full bg-white/[0.05] overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-primary to-secondary"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Step Info */}
      <div className="flex items-center gap-2">
        <span className="px-2 py-0.5 rounded-md bg-primary/15 text-primary text-xs font-mono font-bold">
          Step {currentStep + 1} / {totalSteps}
        </span>
        {currentState.pass > 0 && (
          <span className="px-2 py-0.5 rounded-md bg-blue-500/15 text-blue-400 text-xs font-mono">
            Pass {currentState.pass}
          </span>
        )}
        {currentState.type && (
          <span className={`px-2 py-0.5 rounded-md text-xs font-mono capitalize
            ${currentState.type === 'compare' ? 'bg-amber-500/15 text-amber-400'
              : currentState.type === 'swap' ? 'bg-red-500/15 text-red-400'
              : currentState.type === 'done' || currentState.type === 'found' ? 'bg-emerald-500/15 text-emerald-400'
              : 'bg-slate-500/15 text-slate-400'}`}>
            {currentState.type}
          </span>
        )}
      </div>

      {/* Main Description */}
      <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06]">
        <p className="text-sm text-slate-200 leading-relaxed">
          {currentState.description}
        </p>
      </div>

      {/* Variable State (for sorting) */}
      {(currentState.comparing || currentState.swapping) && (
        <div className="space-y-2">
          <p className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">Current Operation</p>
          <div className="grid grid-cols-2 gap-2">
            {currentState.comparing && (
              <div className="p-2.5 rounded-lg bg-amber-500/5 border border-amber-500/10">
                <p className="text-[10px] text-amber-400/60 mb-0.5">Comparing</p>
                <p className="text-xs font-mono text-amber-300">
                  idx [{currentState.comparing.join(', ')}]
                </p>
              </div>
            )}
            {currentState.swapping && (
              <div className="p-2.5 rounded-lg bg-red-500/5 border border-red-500/10">
                <p className="text-[10px] text-red-400/60 mb-0.5">Swapping</p>
                <p className="text-xs font-mono text-red-300">
                  idx [{currentState.swapping.join(', ')}]
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Sorted elements */}
      {currentState.sorted && currentState.sorted.length > 0 && (
        <div>
          <p className="text-[10px] font-mono text-slate-500 uppercase tracking-wider mb-1">
            Sorted Positions ({currentState.sorted.length})
          </p>
          <div className="flex flex-wrap gap-1">
            {currentState.sorted.slice(0, 20).map((idx) => (
              <span key={idx} className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[10px] font-mono">
                {idx}
              </span>
            ))}
            {currentState.sorted.length > 20 && (
              <span className="text-[10px] text-slate-500">+{currentState.sorted.length - 20} more</span>
            )}
          </div>
        </div>
      )}

      {/* Search-specific: range/discarded */}
      {currentState.range && (
        <div className="grid grid-cols-3 gap-2">
          {currentState.low !== undefined && (
            <div className="p-2 rounded-lg bg-blue-500/5 border border-blue-500/10 text-center">
              <p className="text-[9px] text-blue-400/60">low</p>
              <p className="text-sm font-mono font-bold text-blue-300">{currentState.low}</p>
            </div>
          )}
          {currentState.mid !== undefined && currentState.mid !== null && (
            <div className="p-2 rounded-lg bg-cyan-500/5 border border-cyan-500/10 text-center">
              <p className="text-[9px] text-cyan-400/60">mid</p>
              <p className="text-sm font-mono font-bold text-cyan-300">{currentState.mid}</p>
            </div>
          )}
          {currentState.high !== undefined && (
            <div className="p-2 rounded-lg bg-purple-500/5 border border-purple-500/10 text-center">
              <p className="text-[9px] text-purple-400/60">high</p>
              <p className="text-sm font-mono font-bold text-purple-300">{currentState.high}</p>
            </div>
          )}
        </div>
      )}

      {/* Live Stats */}
      <div>
        <p className="text-[10px] font-mono text-slate-500 uppercase tracking-wider mb-1.5">Live Statistics</p>
        <div className="grid grid-cols-3 gap-2">
          <div className="p-2 rounded-lg bg-white/[0.02] text-center">
            <p className="text-[9px] text-slate-500">Comparisons</p>
            <p className="text-sm font-mono font-bold text-white">{currentState.comparisons ?? 0}</p>
          </div>
          <div className="p-2 rounded-lg bg-white/[0.02] text-center">
            <p className="text-[9px] text-slate-500">Swaps</p>
            <p className="text-sm font-mono font-bold text-white">{currentState.swaps ?? 0}</p>
          </div>
          <div className="p-2 rounded-lg bg-white/[0.02] text-center">
            <p className="text-[9px] text-slate-500">Array Reads</p>
            <p className="text-sm font-mono font-bold text-white">{currentState.arrayAccesses ?? 0}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
