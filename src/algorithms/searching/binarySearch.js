/**
 * Binary Search Algorithm — Enhanced for educational visualization
 *
 * Time Complexity:  O(log n)
 * Space Complexity: O(1)
 *
 * Requires a sorted array.
 */
export default function binarySearch(array, target) {
  const arr = [...array];
  const steps = [];
  let comparisons = 0;
  let arrayAccesses = 0;
  let low = 0;
  let high = arr.length - 1;
  let iteration = 0;

  // Compute discarded indices (outside [low, high])
  function getDiscarded(lo, hi) {
    const d = [];
    for (let i = 0; i < arr.length; i++) {
      if (i < lo || i > hi) d.push(i);
    }
    return d;
  }

  steps.push({
    array: [...arr], active: null, range: [low, high], found: null,
    discarded: [], low, high, mid: null,
    description: `Starting binary search for target = ${target} in sorted array of ${arr.length} elements. Search range: [${low}..${high}].`,
    comparisons, arrayAccesses, type: 'init', codeLine: 1,
  });

  while (low <= high) {
    iteration++;
    const mid = Math.floor((low + high) / 2);
    comparisons++;
    arrayAccesses++;

    if (arr[mid] === target) {
      steps.push({
        array: [...arr], active: mid, range: [low, high], found: mid,
        discarded: getDiscarded(low, high), low, high, mid,
        description: `Iteration ${iteration}: mid = ⌊(${low}+${high})/2⌋ = ${mid}. arr[${mid}] = ${arr[mid]} === ${target}. Target found at index ${mid}!`,
        comparisons, arrayAccesses, type: 'found', codeLine: 5,
      });
      return steps;
    }

    if (arr[mid] < target) {
      steps.push({
        array: [...arr], active: mid, range: [low, high], found: null,
        discarded: getDiscarded(low, high), low, high, mid,
        description: `Iteration ${iteration}: mid = ${mid}, arr[${mid}] = ${arr[mid]} < ${target}. Target is in the RIGHT half. Discarding indices [${low}..${mid}]. Setting low = ${mid + 1}.`,
        comparisons, arrayAccesses, type: 'compare', codeLine: 7,
      });
      low = mid + 1;
    } else {
      steps.push({
        array: [...arr], active: mid, range: [low, high], found: null,
        discarded: getDiscarded(low, high), low, high, mid,
        description: `Iteration ${iteration}: mid = ${mid}, arr[${mid}] = ${arr[mid]} > ${target}. Target is in the LEFT half. Discarding indices [${mid}..${high}]. Setting high = ${mid - 1}.`,
        comparisons, arrayAccesses, type: 'compare', codeLine: 9,
      });
      high = mid - 1;
    }

    // Show narrowed range
    if (low <= high) {
      steps.push({
        array: [...arr], active: null, range: [low, high], found: null,
        discarded: getDiscarded(low, high), low, high, mid: null,
        description: `New search range: [${low}..${high}] (${high - low + 1} elements remaining). ${Math.ceil(Math.log2(high - low + 2))} iteration(s) left at most.`,
        comparisons, arrayAccesses, type: 'compare', codeLine: 11,
      });
    }
  }

  steps.push({
    array: [...arr], active: null, range: [low, high], found: null,
    discarded: Array.from({ length: arr.length }, (_, k) => k), low, high, mid: null,
    description: `Target ${target} not found. Search range exhausted after ${iteration} iterations and ${comparisons} comparisons. Binary search proves the element is not in the array.`,
    comparisons, arrayAccesses, type: 'done', codeLine: 12,
  });

  return steps;
}
