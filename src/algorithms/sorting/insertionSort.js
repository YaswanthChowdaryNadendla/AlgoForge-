/**
 * Insertion Sort Algorithm — Enhanced for educational visualization
 *
 * Time Complexity:  O(n²) average/worst, O(n) best
 * Space Complexity: O(1)
 */
export default function insertionSort(inputArray) {
  const arr = [...inputArray];
  const n = arr.length;
  const steps = [];
  let comparisons = 0;
  let swaps = 0;
  let arrayAccesses = 0;
  const sorted = [0];

  steps.push({
    array: [...arr], comparing: null, swapping: null, sorted: [...sorted],
    description: 'Initial array state. Insertion Sort treats the first element as sorted and inserts each subsequent element into its correct position.',
    comparisons, swaps, arrayAccesses, pass: 0, type: 'init', codeLine: 1,
  });

  for (let i = 1; i < n; i++) {
    const key = arr[i];
    const passNum = i;
    arrayAccesses++;
    let j = i - 1;

    steps.push({
      array: [...arr], comparing: [i], swapping: null, sorted: [...sorted],
      description: `Pass ${passNum}: Picking key = ${key} (index ${i}). Will insert it into the sorted portion [0..${i - 1}].`,
      comparisons, swaps, arrayAccesses, pass: passNum, type: 'pass-start', codeLine: 3,
    });

    let shifted = false;
    while (j >= 0 && arr[j] > key) {
      comparisons++;
      arrayAccesses += 2;

      steps.push({
        array: [...arr], comparing: [j, j + 1], swapping: null, sorted: [...sorted],
        description: `Pass ${passNum}: arr[${j}] = ${arr[j]} > key = ${key}. Shifting ${arr[j]} one position to the right.`,
        comparisons, swaps, arrayAccesses, pass: passNum, type: 'compare', codeLine: 6,
      });

      arr[j + 1] = arr[j];
      arrayAccesses += 2;
      swaps++;
      shifted = true;

      steps.push({
        array: [...arr], comparing: null, swapping: [j, j + 1], sorted: [...sorted],
        description: `Pass ${passNum}: Shifted ${arr[j]} from index ${j} to index ${j + 1}.`,
        comparisons, swaps, arrayAccesses, pass: passNum, type: 'swap', codeLine: 7,
      });

      j--;
    }

    if (j >= 0) {
      comparisons++;
      arrayAccesses++;
    }

    arr[j + 1] = key;
    arrayAccesses++;

    sorted.push(i);
    sorted.sort((a, b) => a - b);

    steps.push({
      array: [...arr], comparing: null, swapping: null, sorted: [...sorted],
      description: `Pass ${passNum}: Inserted key = ${key} at index ${j + 1}. ${shifted ? `Shifted ${i - j - 1} element(s) to make room.` : 'No shifting needed — key was already in position.'} Sorted portion is now [0..${i}].`,
      comparisons, swaps, arrayAccesses, pass: passNum, type: 'pass-end', codeLine: 9,
    });
  }

  steps.push({
    array: [...arr], comparing: null, swapping: null,
    sorted: Array.from({ length: n }, (_, i) => i),
    description: `Sorting complete! Array is fully sorted after ${n - 1} passes, ${comparisons} comparisons, and ${swaps} shifts.`,
    comparisons, swaps, arrayAccesses, pass: n - 1, type: 'done', codeLine: 11,
  });

  return steps;
}
