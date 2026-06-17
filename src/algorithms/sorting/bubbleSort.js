/**
 * Bubble Sort Algorithm — Enhanced for educational visualization
 *
 * Time Complexity:  O(n²) average/worst, O(n) best (already sorted)
 * Space Complexity: O(1)
 *
 * Each step tracks: codeLine, arrayAccesses, pass, type for timeline/code sync.
 */
export default function bubbleSort(inputArray) {
  const arr = [...inputArray];
  const n = arr.length;
  const steps = [];
  let comparisons = 0;
  let swaps = 0;
  let arrayAccesses = 0;
  const sorted = [];

  steps.push({
    array: [...arr],
    comparing: null, swapping: null, sorted: [...sorted],
    description: 'Initial array state. Bubble Sort will repeatedly compare adjacent elements and swap them if they are in the wrong order.',
    comparisons, swaps, arrayAccesses, pass: 0,
    type: 'init', codeLine: 1,
  });

  for (let i = 0; i < n - 1; i++) {
    let swapped = false;
    const passNum = i + 1;

    steps.push({
      array: [...arr],
      comparing: null, swapping: null, sorted: [...sorted],
      description: `Starting pass ${passNum}. Will compare elements from index 0 to ${n - 2 - i}.`,
      comparisons, swaps, arrayAccesses, pass: passNum,
      type: 'pass-start', codeLine: 3,
    });

    for (let j = 0; j < n - 1 - i; j++) {
      // Comparison step
      arrayAccesses += 2;
      comparisons++;
      steps.push({
        array: [...arr],
        comparing: [j, j + 1], swapping: null, sorted: [...sorted],
        description: `Pass ${passNum}: Comparing arr[${j}] = ${arr[j]} with arr[${j + 1}] = ${arr[j + 1]}. ${arr[j] > arr[j + 1] ? `${arr[j]} > ${arr[j + 1]}, so a swap will occur.` : `${arr[j]} ≤ ${arr[j + 1]}, no swap needed.`}`,
        comparisons, swaps, arrayAccesses, pass: passNum,
        type: 'compare', codeLine: 5,
      });

      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        swaps++;
        arrayAccesses += 4; // 2 reads + 2 writes
        swapped = true;

        steps.push({
          array: [...arr],
          comparing: null, swapping: [j, j + 1], sorted: [...sorted],
          description: `Pass ${passNum}: Swapped arr[${j}] and arr[${j + 1}]. Array now has ${arr[j]} at index ${j} and ${arr[j + 1]} at index ${j + 1}.`,
          comparisons, swaps, arrayAccesses, pass: passNum,
          type: 'swap', codeLine: 6,
        });
      }
    }

    sorted.push(n - 1 - i);

    steps.push({
      array: [...arr],
      comparing: null, swapping: null, sorted: [...sorted],
      description: `Pass ${passNum} complete. Element ${arr[n - 1 - i]} is now in its final position at index ${n - 1 - i}. Made ${swapped ? 'swaps' : 'no swaps'} this pass.`,
      comparisons, swaps, arrayAccesses, pass: passNum,
      type: 'pass-end', codeLine: 10,
    });

    if (!swapped) {
      for (let k = 0; k < n; k++) {
        if (!sorted.includes(k)) sorted.push(k);
      }
      steps.push({
        array: [...arr],
        comparing: null, swapping: null, sorted: [...sorted],
        description: `No swaps occurred in pass ${passNum} — the array is already sorted! Early termination saves unnecessary passes.`,
        comparisons, swaps, arrayAccesses, pass: passNum,
        type: 'done', codeLine: 11,
      });
      return steps;
    }
  }

  if (!sorted.includes(0)) sorted.push(0);

  steps.push({
    array: [...arr],
    comparing: null, swapping: null, sorted: [...sorted],
    description: `Sorting complete! Array is fully sorted after ${n - 1} passes, ${comparisons} comparisons, and ${swaps} swaps.`,
    comparisons, swaps, arrayAccesses, pass: n - 1,
    type: 'done', codeLine: 12,
  });

  return steps;
}
