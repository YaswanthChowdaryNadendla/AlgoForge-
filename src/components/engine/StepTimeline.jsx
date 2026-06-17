import { useRef, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { GitCompare, ArrowUpDown, Flag, CheckCircle, Play, Pause, Search, SplitSquareHorizontal } from 'lucide-react';

const typeIcons = {
  'init': Play,
  'compare': GitCompare,
  'swap': ArrowUpDown,
  'pass-start': Play,
  'pass-end': Flag,
  'found': CheckCircle,
  'done': CheckCircle,
};

const typeColors = {
  'init': 'text-slate-500',
  'compare': 'text-amber-400',
  'swap': 'text-red-400',
  'pass-start': 'text-blue-400',
  'pass-end': 'text-blue-400',
  'found': 'text-emerald-400',
  'done': 'text-emerald-400',
};

const typeBgColors = {
  'compare': 'bg-amber-400/10',
  'swap': 'bg-red-400/10',
  'pass-start': 'bg-blue-400/10',
  'pass-end': 'bg-blue-400/10',
  'found': 'bg-emerald-400/10',
  'done': 'bg-emerald-400/10',
};

/**
 * Clickable step-by-step operation timeline.
 * Shows every operation with icons, truncated descriptions, and jump-on-click.
 */
export default function StepTimeline({ steps, currentStep, onGoToStep }) {
  const activeRef = useRef(null);
  const containerRef = useRef(null);

  // Auto-scroll to active step
  useEffect(() => {
    if (activeRef.current && containerRef.current) {
      const container = containerRef.current;
      const item = activeRef.current;
      const containerRect = container.getBoundingClientRect();
      const itemRect = item.getBoundingClientRect();

      if (itemRect.top < containerRect.top || itemRect.bottom > containerRect.bottom) {
        item.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [currentStep]);

  // Collapse steps by pass when > 100 steps
  const collapsed = steps.length > 150;

  // Group by pass for collapsed mode
  const passGroups = useMemo(() => {
    if (!collapsed) return null;
    const groups = [];
    let currentGroup = { pass: 0, start: 0, end: 0, steps: [] };
    steps.forEach((step, i) => {
      const pass = step.pass || 0;
      if (pass !== currentGroup.pass && currentGroup.steps.length > 0) {
        groups.push({ ...currentGroup });
        currentGroup = { pass, start: i, end: i, steps: [i] };
      } else {
        currentGroup.end = i;
        currentGroup.steps.push(i);
      }
    });
    if (currentGroup.steps.length > 0) groups.push(currentGroup);
    return groups;
  }, [steps, collapsed]);

  if (steps.length === 0) {
    return (
      <div className="h-full flex items-center justify-center text-slate-600 text-sm p-4">
        Run an algorithm to see the operation timeline
      </div>
    );
  }

  return (
    <div ref={containerRef} className="h-full overflow-y-auto space-y-0.5 p-2 custom-scrollbar">
      {steps.map((step, index) => {
        const Icon = typeIcons[step.type] || GitCompare;
        const colorClass = typeColors[step.type] || 'text-slate-500';
        const bgClass = typeBgColors[step.type] || '';
        const isActive = index === currentStep;
        const isPast = index < currentStep;

        // In collapsed mode, only show pass boundaries and current step vicinity
        if (collapsed && !isActive && Math.abs(index - currentStep) > 3
            && step.type !== 'pass-start' && step.type !== 'pass-end'
            && step.type !== 'init' && step.type !== 'done') {
          // Show a dot placeholder for collapsed steps
          if (index > 0 && steps[index - 1]?.type !== 'pass-start'
              && steps[index - 1]?.type !== 'pass-end'
              && Math.abs(index - 1 - currentStep) > 3) {
            return null; // Skip rendering, previous item shows the collapse dot
          }
          return (
            <button
              key={index}
              onClick={() => onGoToStep(index)}
              className="w-full flex items-center justify-center py-0.5 text-slate-700 hover:text-slate-500 transition-colors"
              title={`Step ${index + 1}: ${step.description}`}
            >
              <span className="text-[8px]">•••</span>
            </button>
          );
        }

        return (
          <button
            key={index}
            ref={isActive ? activeRef : null}
            onClick={() => onGoToStep(index)}
            className={`w-full text-left flex items-start gap-2.5 px-3 py-2 rounded-lg transition-all duration-150 group
              ${isActive
                ? 'bg-primary/15 border border-primary/30'
                : isPast
                  ? 'opacity-60 hover:opacity-90 hover:bg-white/[0.03]'
                  : 'hover:bg-white/[0.03]'
              }`}
          >
            {/* Step number */}
            <span className={`text-[10px] font-mono mt-0.5 min-w-[24px] text-right
              ${isActive ? 'text-primary font-bold' : 'text-slate-600'}`}>
              {index + 1}
            </span>

            {/* Icon */}
            <div className={`mt-0.5 p-1 rounded ${isActive ? 'bg-primary/20' : bgClass}`}>
              <Icon className={`w-3 h-3 ${isActive ? 'text-primary' : colorClass}`} />
            </div>

            {/* Description */}
            <div className="flex-1 min-w-0">
              <p className={`text-xs leading-relaxed ${isActive ? 'text-white font-medium' : 'text-slate-400'} line-clamp-2`}>
                {step.description}
              </p>
              {step.pass > 0 && (
                <span className="text-[9px] text-slate-600 font-mono">
                  Pass {step.pass}
                </span>
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
}
