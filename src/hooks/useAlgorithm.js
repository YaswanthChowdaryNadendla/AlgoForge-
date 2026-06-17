import { useState, useCallback, useRef, useEffect } from 'react';

export function useAlgorithm() {
  const [steps, setSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [speed, setSpeed] = useState(5);
  const [stats, setStats] = useState({
    comparisons: 0,
    swaps: 0,
    arrayAccesses: 0,
    runtime: 0,
    pass: 0,
    progress: 0,
  });
  const timerRef = useRef(null);
  const startTimeRef = useRef(null);

  const getDelay = useCallback(() => {
    const delays = [1000, 800, 600, 400, 300, 200, 150, 100, 50, 20];
    return delays[speed - 1] || 200;
  }, [speed]);

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const loadSteps = useCallback((generatedSteps) => {
    setSteps(generatedSteps);
    setCurrentStep(-1);
    setIsPlaying(false);
    setIsPaused(false);
    setIsComplete(false);
    setStats({ comparisons: 0, swaps: 0, arrayAccesses: 0, runtime: 0, pass: 0, progress: 0 });
    clearTimer();
  }, [clearTimer]);

  const updateStats = useCallback((stepIndex, stepsArray) => {
    if (stepIndex < 0 || stepIndex >= stepsArray.length) return;
    const step = stepsArray[stepIndex];
    const elapsed = startTimeRef.current ? Date.now() - startTimeRef.current : 0;
    const progress = stepsArray.length > 1
      ? Math.round((stepIndex / (stepsArray.length - 1)) * 100)
      : 0;
    setStats({
      comparisons: step.comparisons ?? 0,
      swaps: step.swaps ?? 0,
      arrayAccesses: step.arrayAccesses ?? 0,
      runtime: elapsed,
      pass: step.pass ?? 0,
      progress,
    });
  }, []);

  const playStep = useCallback((stepIndex) => {
    if (stepIndex >= steps.length) {
      setIsPlaying(false);
      setIsComplete(true);
      return;
    }
    setCurrentStep(stepIndex);
    updateStats(stepIndex, steps);

    timerRef.current = setTimeout(() => {
      playStep(stepIndex + 1);
    }, getDelay());
  }, [steps, getDelay, updateStats]);

  const play = useCallback(() => {
    if (steps.length === 0) return;
    startTimeRef.current = Date.now();
    setIsPlaying(true);
    setIsPaused(false);
    setIsComplete(false);
    const startFrom = currentStep < 0 ? 0 : currentStep;
    playStep(startFrom);
  }, [steps, currentStep, playStep]);

  const pause = useCallback(() => {
    clearTimer();
    setIsPlaying(false);
    setIsPaused(true);
  }, [clearTimer]);

  const resume = useCallback(() => {
    if (!isPaused || steps.length === 0) return;
    setIsPlaying(true);
    setIsPaused(false);
    playStep(currentStep + 1);
  }, [isPaused, steps, currentStep, playStep]);

  const stepForward = useCallback(() => {
    clearTimer();
    setIsPlaying(false);
    if (currentStep < steps.length - 1) {
      const next = currentStep + 1;
      setCurrentStep(next);
      updateStats(next, steps);
      if (next === steps.length - 1) {
        setIsComplete(true);
      }
    }
  }, [clearTimer, currentStep, steps, updateStats]);

  const stepBackward = useCallback(() => {
    clearTimer();
    setIsPlaying(false);
    if (currentStep > 0) {
      const prev = currentStep - 1;
      setCurrentStep(prev);
      updateStats(prev, steps);
      setIsComplete(false);
    }
  }, [clearTimer, currentStep, steps, updateStats]);

  /** Jump to any step by index — enables timeline click-to-jump */
  const goToStep = useCallback((targetIndex) => {
    if (targetIndex < 0 || targetIndex >= steps.length) return;
    clearTimer();
    setIsPlaying(false);
    setIsPaused(true);
    setCurrentStep(targetIndex);
    updateStats(targetIndex, steps);
    setIsComplete(targetIndex === steps.length - 1);
  }, [clearTimer, steps, updateStats]);

  const reset = useCallback(() => {
    clearTimer();
    setCurrentStep(-1);
    setIsPlaying(false);
    setIsPaused(false);
    setIsComplete(false);
    setStats({ comparisons: 0, swaps: 0, arrayAccesses: 0, runtime: 0, pass: 0, progress: 0 });
    startTimeRef.current = null;
  }, [clearTimer]);

  useEffect(() => {
    return () => clearTimer();
  }, [clearTimer]);

  const currentState = steps[currentStep] || null;

  return {
    steps,
    currentStep,
    currentState,
    isPlaying,
    isPaused,
    isComplete,
    speed,
    stats,
    totalSteps: steps.length,
    setSpeed,
    loadSteps,
    play,
    pause,
    resume,
    stepForward,
    stepBackward,
    goToStep,
    reset,
  };
}
