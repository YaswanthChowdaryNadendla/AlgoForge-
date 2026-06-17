/**
 * Heap Sort Algorithm — Enhanced for educational visualization
 *
 * Time Complexity:  O(n log n) all cases
 * Space Complexity: O(1)
 */
export default function heapSort(inputArray) {
  const arr = [...inputArray];
  const n = arr.length;
  const steps = [];
  let comparisons = 0;
  let swaps = 0;
  let arrayAccesses = 0;
  let pass = 0;
  const sorted = [];

  steps.push({
    array: [...arr], comparing: null, swapping: null, sorted: [...sorted],
    description: 'Initial array state. Heap Sort will first build a max-heap, then repeatedly extract the maximum element.',
    comparisons, swaps, arrayAccesses, pass: 0, type: 'init', codeLine: 1,
  });

  function heapify(size, root) {
    let largest = root;
    const left = 2 * root + 1;
    const right = 2 * root + 2;

    if (left < size) {
      comparisons++;
      arrayAccesses += 2;
      if (arr[left] > arr[largest]) largest = left;
    }
    if (right < size) {
      comparisons++;
      arrayAccesses += 2;
      if (arr[right] > arr[largest]) largest = right;
    }

    if (largest !== root) {
      steps.push({
        array: [...arr], comparing: [root, largest], swapping: null, sorted: [...sorted],
        description: `Heapify: arr[${largest}] = ${arr[largest]} > arr[${root}] = ${arr[root]}. The heap property is violated.`,
        comparisons, swaps, arrayAccesses, pass, type: 'compare', codeLine: 7,
      });

      [arr[root], arr[largest]] = [arr[largest], arr[root]];
      swaps++;
      arrayAccesses += 4;

      steps.push({
        array: [...arr], comparing: null, swapping: [root, largest], sorted: [...sorted],
        description: `Heapify: Swapped arr[${root}] and arr[${largest}] to restore heap property. Now arr[${root}] = ${arr[root]}.`,
        comparisons, swaps, arrayAccesses, pass, type: 'swap', codeLine: 8,
      });

      heapify(size, largest);
    }
  }

  // Build max-heap phase
  steps.push({
    array: [...arr], comparing: null, swapping: null, sorted: [...sorted],
    description: 'Phase 1: Building the max-heap. Heapifying all non-leaf nodes from bottom to top.',
    comparisons, swaps, arrayAccesses, pass: 0, type: 'pass-start', codeLine: 3,
  });

  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    heapify(n, i);
  }

  steps.push({
    array: [...arr], comparing: null, swapping: null, sorted: [...sorted],
    description: `Max-heap built! Maximum element ${arr[0]} is at the root. Now extracting elements one by one.`,
    comparisons, swaps, arrayAccesses, pass: 0, type: 'pass-end', codeLine: 4,
  });

  // Extraction phase
  for (let i = n - 1; i > 0; i--) {
    pass++;

    steps.push({
      array: [...arr], comparing: [0, i], swapping: null, sorted: [...sorted],
      description: `Extraction ${pass}: Swapping root (max = ${arr[0]}) with last unsorted element arr[${i}] = ${arr[i]}. Element ${arr[0]} will be in its final position.`,
      comparisons, swaps, arrayAccesses, pass, type: 'compare', codeLine: 5,
    });

    [arr[0], arr[i]] = [arr[i], arr[0]];
    swaps++;
    arrayAccesses += 4;
    sorted.push(i);

    steps.push({
      array: [...arr], comparing: null, swapping: [0, i], sorted: [...sorted],
      description: `Extraction ${pass}: ${arr[i]} is now at its final sorted position (index ${i}). Heapifying remaining heap of size ${i}.`,
      comparisons, swaps, arrayAccesses, pass, type: 'swap', codeLine: 5,
    });

    heapify(i, 0);
  }

  sorted.push(0);

  steps.push({
    array: [...arr], comparing: null, swapping: null, sorted: [...sorted],
    description: `Sorting complete! Heap Sort finished with ${comparisons} comparisons and ${swaps} swaps. All elements extracted from heap.`,
    comparisons, swaps, arrayAccesses, pass, type: 'done', codeLine: 10,
  });

  return steps;
}
