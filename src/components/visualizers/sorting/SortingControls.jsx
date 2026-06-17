import { motion } from 'framer-motion';
import {
  Play, Pause, SkipForward, SkipBack, RotateCcw, Shuffle, Keyboard
} from 'lucide-react';
import GlowButton from '../../ui/GlowButton';
import Slider from '../../ui/Slider';
import { useState } from 'react';

const algorithms = [
  { key: 'bubbleSort', label: 'Bubble Sort' },
  { key: 'selectionSort', label: 'Selection Sort' },
  { key: 'insertionSort', label: 'Insertion Sort' },
  { key: 'mergeSort', label: 'Merge Sort' },
  { key: 'quickSort', label: 'Quick Sort' },
  { key: 'heapSort', label: 'Heap Sort' },
];

export default function SortingControls({
  algorithm, setAlgorithm, arraySize, setArraySize, speed,
  isPlaying, isPaused, isComplete,
  onGenerate, onStart, onPause, onResume,
  onStepForward, onStepBackward, onReset, onCustomInput, onSpeedChange
}) {
  const [customInput, setCustomInput] = useState('');
  const [showCustom, setShowCustom] = useState(false);

  const handleCustomSubmit = () => {
    if (customInput.trim()) {
      onCustomInput(customInput);
      setShowCustom(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Top Row: Algorithm Selector + Array Controls */}
      <div className="flex flex-wrap items-end gap-4">
        {/* Algorithm Selector */}
        <div className="flex-1 min-w-[180px]">
          <label className="text-xs font-medium text-slate-400 mb-1.5 block">Algorithm</label>
          <select
            value={algorithm}
            onChange={(e) => setAlgorithm(e.target.value)}
            disabled={isPlaying}
            className="w-full px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08]
                       text-slate-200 text-sm font-medium
                       focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20
                       disabled:opacity-50 transition-all duration-200
                       appearance-none cursor-pointer"
            style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2394A3B8' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center' }}
          >
            {algorithms.map((algo) => (
              <option key={algo.key} value={algo.key} className="bg-dark-900">
                {algo.label}
              </option>
            ))}
          </select>
        </div>

        {/* Sliders */}
        <div className="flex-1 min-w-[140px]">
          <Slider label="Array Size" value={arraySize} onChange={setArraySize} min={5} max={100} />
        </div>
        <div className="flex-1 min-w-[140px]">
          <Slider label="Speed" value={speed} onChange={onSpeedChange} min={1} max={10} unit="x" />
        </div>
      </div>

      {/* Control Buttons */}
      <div className="flex flex-wrap items-center gap-2">
        <GlowButton variant="ghost" icon={Shuffle} onClick={onGenerate} disabled={isPlaying}>
          Generate
        </GlowButton>

        <GlowButton
          variant="ghost"
          icon={Keyboard}
          onClick={() => setShowCustom(!showCustom)}
          disabled={isPlaying}
        >
          Custom
        </GlowButton>

        <div className="w-px h-8 bg-white/[0.06] mx-1 hidden sm:block" />

        {!isPlaying && !isPaused ? (
          <GlowButton variant="primary" icon={Play} onClick={onStart} disabled={isPlaying}>
            Start
          </GlowButton>
        ) : isPlaying ? (
          <GlowButton variant="accent" icon={Pause} onClick={onPause}>
            Pause
          </GlowButton>
        ) : (
          <GlowButton variant="primary" icon={Play} onClick={onResume}>
            Resume
          </GlowButton>
        )}

        <GlowButton variant="ghost" icon={SkipBack} onClick={onStepBackward} disabled={isPlaying} size="sm">
          <span className="hidden sm:inline">Back</span>
        </GlowButton>

        <GlowButton variant="ghost" icon={SkipForward} onClick={onStepForward} disabled={isPlaying} size="sm">
          <span className="hidden sm:inline">Next</span>
        </GlowButton>

        <GlowButton variant="ghost" icon={RotateCcw} onClick={onReset} size="sm">
          <span className="hidden sm:inline">Reset</span>
        </GlowButton>
      </div>

      {/* Custom Input */}
      {showCustom && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="flex gap-2"
        >
          <input
            type="text"
            value={customInput}
            onChange={(e) => setCustomInput(e.target.value)}
            placeholder="Enter values: 5, 3, 8, 1, 9"
            className="input-glass flex-1"
            onKeyDown={(e) => e.key === 'Enter' && handleCustomSubmit()}
          />
          <GlowButton variant="primary" onClick={handleCustomSubmit} size="sm">
            Apply
          </GlowButton>
        </motion.div>
      )}
    </div>
  );
}
