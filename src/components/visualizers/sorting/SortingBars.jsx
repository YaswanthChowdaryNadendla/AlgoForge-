import { motion } from 'framer-motion';
import { useMemo } from 'react';
import { getBarGradient, getBarShadow } from '../../../utils/colorUtils';

export default function SortingBars({ array, currentState }) {
  const maxValue = useMemo(() => Math.max(...(array || [1])), [array]);
  const showLabels = array && array.length <= 35;

  if (!array || array.length === 0) {
    return (
      <div className="flex items-center justify-center h-[350px] md:h-[400px] text-slate-600 text-sm">
        Generate an array to begin visualization
      </div>
    );
  }

  return (
    <div className="flex items-end justify-center gap-[2px] h-[350px] md:h-[400px] px-2">
      {array.map((value, index) => {
        const heightPercent = (value / maxValue) * 85;
        const barWidth = Math.max(4, Math.min(48, (100 / array.length) * 0.9));

        return (
          <motion.div
            key={index}
            className="relative flex flex-col items-center justify-end h-full"
            style={{ width: `${barWidth}%` }}
            layout
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          >
            {/* Value label */}
            {showLabels && (
              <span className="text-[9px] font-mono text-slate-500 mb-1 select-none">
                {value}
              </span>
            )}

            {/* Bar */}
            <motion.div
              className="w-full rounded-t-md"
              style={{
                height: `${heightPercent}%`,
                background: getBarGradient(index, currentState),
                boxShadow: getBarShadow(index, currentState),
                minHeight: '4px',
              }}
              initial={{ height: 0 }}
              animate={{
                height: `${heightPercent}%`,
              }}
              transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            />
          </motion.div>
        );
      })}
    </div>
  );
}
