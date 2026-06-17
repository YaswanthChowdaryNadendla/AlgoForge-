/**
 * Selection Sort Algorithm — Enhanced for educational visualization
 *
 * Time Complexity:  O(n²) all cases
 * Space Complexity: O(1)
 */
export default function selectionSort(inputArray) {
  const arr = [...inputArray];
  const n = arr.length;
  const steps = [];
  let comparisons = 0;
  let swaps = 0;
  let arrayAccesses = 0;
  const sorted = [];

  steps.push({
    array: [...arr], comparing: null, swapping: null, sorted: [...sorted],
    description: 'Initial array state. Selection Sort will find the minimum element in the unsorted region and place it at the beginning.',
    comparisons, swaps, arrayAccesses, pass: 0, type: 'init', codeLine: 1,
  });

  for (let i = 0; i < n - 1; i++) {
    let minIdx = i;
    const passNum = i + 1;
    arrayAccesses++;

    steps.push({
      array: [...arr], comparing: null, swapping: null, sorted: [...sorted],
      description: `Pass ${passNum}: Finding the minimum element in unsorted region [${i}..${n - 1}]. Starting with arr[${i}] = ${arr[i]} as the current minimum.`,
      comparisons, swaps, arrayAccesses, pass: passNum, type: 'pass-start', codeLine: 3,
    });

    for (let j = i + 1; j < n; j++) {
      arrayAccesses += 2;
      comparisons++;
      const isNewMin = arr[j] < arr[minIdx];

      steps.push({
        array: [...arr], comparing: [j, minIdx], swapping: null, sorted: [...sorted],
        description: `Pass ${passNum}: Comparing arr[${j}] = ${arr[j]} with current minimum arr[${minIdx}] = ${arr[minIdx]}. ${isNewMin ? `${arr[j]} < ${arr[minIdx]}, new minimum found!` : `${arr[j]} ≥ ${arr[minIdx]}, minimum unchanged.`}`,
        comparisons, swaps, arrayAccesses, pass: passNum, type: 'compare', codeLine: 5,
      });

      if (isNewMin) minIdx = j;
    }

    if (minIdx !== i) {
      [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
      swaps++;
      arrayAccesses += 4;

      steps.push({
        array: [...arr], comparing: null, swapping: [i, minIdx], sorted: [...sorted],
        description: `Pass ${passNum}: Swapping minimum element ${arr[i]} (was at index ${minIdx}) with ${arr[minIdx]} at index ${i}. Element ${arr[i]} is now in its sorted position.`,
        comparisons, swaps, arrayAccesses, pass: passNum, type: 'swap', codeLine: 8,
      });
    } else {
      steps.push({
        array: [...arr], comparing: null, swapping: null, sorted: [...sorted],
        description: `Pass ${passNum}: Element ${arr[i]} at index ${i} is already the minimum. No swap needed.`,
        comparisons, swaps, arrayAccesses, pass: passNum, type: 'pass-end', codeLine: 9,
      });
    }

    sorted.push(i);
  }

  sorted.push(n - 1);

  steps.push({
    array: [...arr], comparing: null, swapping: null, sorted: [...sorted],
    description: `Sorting complete! Array is fully sorted after ${n - 1} passes, ${comparisons} comparisons, and ${swaps} swaps.`,
    comparisons, swaps, arrayAccesses, pass: n - 1, type: 'done', codeLine: 12,
  });

  return steps;
}
