/**
 * Quick Sort Algorithm — Enhanced for educational visualization
 *
 * Time Complexity:  O(n log n) avg, O(n²) worst
 * Space Complexity: O(log n) stack
 *
 * Lomuto partition: pivot = last element.
 */
export default function quickSort(inputArray) {
  const arr = [...inputArray];
  const n = arr.length;
  const steps = [];
  let comparisons = 0;
  let swaps = 0;
  let arrayAccesses = 0;
  let partitionCount = 0;
  const sortedIndices = new Set();

  // Recursion tree tracking
  let callIdCounter = 0;
  const recursionNodes = [];

  function createCallNode(low, high, depth) {
    const id = callIdCounter++;
    const label = low > high
      ? `∅`
      : low === high
        ? `[${arr[low]}]`
        : `[${low}..${high}]`;
    recursionNodes.push({ id, label, leftId: null, rightId: null, depth, status: 'pending' });
    return id;
  }

  function updateNodeStatus(id, status, newLabel) {
    const node = recursionNodes.find(n => n.id === id);
    if (node) {
      node.status = status;
      if (newLabel) node.label = newLabel;
    }
  }

  function setChildren(parentId, leftChildId, rightChildId) {
    const node = recursionNodes.find(n => n.id === parentId);
    if (node) {
      node.leftId = leftChildId;
      node.rightId = rightChildId;
    }
  }

  function getTreeSnapshot() {
    return recursionNodes.map(n => ({ ...n }));
  }

  steps.push({
    array: [...arr], comparing: null, swapping: null, sorted: [...sortedIndices],
    description: 'Initial array state. Quick Sort will pick a pivot element and partition the array so smaller elements go left, larger go right.',
    comparisons, swaps, arrayAccesses, pass: 0, type: 'init', codeLine: 1,
    recursionTree: [], activeCallId: null,
  });

  function partition(low, high, callId) {
    const pivot = arr[high];
    arrayAccesses++;
    partitionCount++;
    let i = low - 1;

    updateNodeStatus(callId, 'pivot', `p=${pivot} [${low}..${high}]`);

    steps.push({
      array: [...arr], comparing: [high], swapping: null, sorted: [...sortedIndices],
      description: `Partition ${partitionCount}: Pivot = arr[${high}] = ${pivot}. Partitioning range [${low}..${high}]. Elements < ${pivot} will go left, ≥ ${pivot} will go right.`,
      comparisons, swaps, arrayAccesses, pass: partitionCount, type: 'pass-start', codeLine: 6,
      recursionTree: getTreeSnapshot(), activeCallId: callId,
    });

    for (let j = low; j < high; j++) {
      comparisons++;
      arrayAccesses++;
      const isLess = arr[j] < pivot;

      steps.push({
        array: [...arr], comparing: [j, high], swapping: null, sorted: [...sortedIndices],
        description: `Partition ${partitionCount}: Comparing arr[${j}] = ${arr[j]} with pivot ${pivot}. ${isLess ? `${arr[j]} < ${pivot}, so it belongs in the left partition.` : `${arr[j]} ≥ ${pivot}, leave it in the right partition.`}`,
        comparisons, swaps, arrayAccesses, pass: partitionCount, type: 'compare', codeLine: 8,
        recursionTree: getTreeSnapshot(), activeCallId: callId,
      });

      if (isLess) {
        i++;
        if (i !== j) {
          [arr[i], arr[j]] = [arr[j], arr[i]];
          swaps++;
          arrayAccesses += 4;

          steps.push({
            array: [...arr], comparing: null, swapping: [i, j], sorted: [...sortedIndices],
            description: `Partition ${partitionCount}: Swapped arr[${i}] and arr[${j}] to move ${arr[i]} to the left partition.`,
            comparisons, swaps, arrayAccesses, pass: partitionCount, type: 'swap', codeLine: 9,
            recursionTree: getTreeSnapshot(), activeCallId: callId,
          });
        }
      }
    }

    i++;
    if (i !== high) {
      [arr[i], arr[high]] = [arr[high], arr[i]];
      swaps++;
      arrayAccesses += 4;
    }

    sortedIndices.add(i);

    updateNodeStatus(callId, 'splitting');

    steps.push({
      array: [...arr], comparing: null, swapping: [i, high], sorted: [...sortedIndices],
      description: `Partition ${partitionCount}: Pivot ${pivot} placed at its final position index ${i}. Left partition: [${low}..${i - 1}], Right partition: [${i + 1}..${high}].`,
      comparisons, swaps, arrayAccesses, pass: partitionCount, type: 'pass-end', codeLine: 11,
      recursionTree: getTreeSnapshot(), activeCallId: callId,
    });

    return i;
  }

  function quickSortHelper(low, high, depth) {
    const callId = createCallNode(low, high, depth);

    if (low >= high) {
      if (low === high) sortedIndices.add(low);
      updateNodeStatus(callId, 'done');
      return callId;
    }

    const pivotIdx = partition(low, high, callId);

    const leftChildId = quickSortHelper(low, pivotIdx - 1, depth + 1);
    const rightChildId = quickSortHelper(pivotIdx + 1, high, depth + 1);
    setChildren(callId, leftChildId, rightChildId);

    updateNodeStatus(callId, 'done');
    return callId;
  }

  quickSortHelper(0, n - 1, 0);

  for (let idx = 0; idx < n; idx++) sortedIndices.add(idx);

  steps.push({
    array: [...arr], comparing: null, swapping: null, sorted: [...sortedIndices],
    description: `Sorting complete! Quick Sort finished with ${partitionCount} partitions, ${comparisons} comparisons, and ${swaps} swaps.`,
    comparisons, swaps, arrayAccesses, pass: partitionCount, type: 'done', codeLine: 14,
    recursionTree: getTreeSnapshot(), activeCallId: null,
  });

  return steps;
}
