/**
 * Merge Sort Algorithm — Enhanced for educational visualization
 *
 * Time Complexity:  O(n log n) all cases
 * Space Complexity: O(n)
 *
 * Divide-and-conquer: recursively splits the array in half,
 * then merges the sorted halves.
 */
export default function mergeSort(inputArray) {
  const arr = [...inputArray];
  const n = arr.length;
  const steps = [];
  let comparisons = 0;
  let swaps = 0;
  let arrayAccesses = 0;
  let mergePass = 0;
  const sortedIndices = new Set();

  // Recursion tree tracking
  let callIdCounter = 0;
  const recursionNodes = []; // { id, label, leftId, rightId, depth, status }

  function createCallNode(left, right, depth) {
    const id = callIdCounter++;
    const label = left === right
      ? `[${arr[left]}]`
      : `[${left}..${right}]`;
    recursionNodes.push({ id, label, leftId: null, rightId: null, depth, status: 'pending' });
    return id;
  }

  function updateNodeStatus(id, status) {
    const node = recursionNodes.find(n => n.id === id);
    if (node) node.status = status;
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
    array: [...arr], comparing: null, swapping: null, sorted: [],
    description: 'Initial array state. Merge Sort will recursively divide the array in half, then merge the sorted halves back together.',
    comparisons, swaps, arrayAccesses, pass: 0, type: 'init', codeLine: 1,
    recursionTree: [], activeCallId: null,
  });

  function merge(left, mid, right, callId) {
    const leftArr = arr.slice(left, mid + 1);
    const rightArr = arr.slice(mid + 1, right + 1);
    arrayAccesses += (right - left + 1);
    let i = 0, j = 0, k = left;
    mergePass++;

    updateNodeStatus(callId, 'merging');

    steps.push({
      array: [...arr], comparing: null, swapping: null, sorted: [...sortedIndices],
      description: `Merge phase: Merging subarrays [${left}..${mid}] = [${leftArr.join(', ')}] and [${mid + 1}..${right}] = [${rightArr.join(', ')}].`,
      comparisons, swaps, arrayAccesses, pass: mergePass, type: 'pass-start', codeLine: 8,
      recursionTree: getTreeSnapshot(), activeCallId: callId,
    });

    while (i < leftArr.length && j < rightArr.length) {
      comparisons++;
      arrayAccesses += 2;
      const takeLeft = leftArr[i] <= rightArr[j];

      steps.push({
        array: [...arr], comparing: [left + i, mid + 1 + j], swapping: null, sorted: [...sortedIndices],
        description: `Comparing left[${i}] = ${leftArr[i]} with right[${j}] = ${rightArr[j]}. ${takeLeft ? `${leftArr[i]} ≤ ${rightArr[j]}, taking from left.` : `${leftArr[i]} > ${rightArr[j]}, taking from right.`}`,
        comparisons, swaps, arrayAccesses, pass: mergePass, type: 'compare', codeLine: 10,
        recursionTree: getTreeSnapshot(), activeCallId: callId,
      });

      if (takeLeft) {
        arr[k] = leftArr[i]; i++;
      } else {
        arr[k] = rightArr[j]; j++;
      }
      swaps++;
      arrayAccesses++;

      steps.push({
        array: [...arr], comparing: null, swapping: [k], sorted: [...sortedIndices],
        description: `Placed ${arr[k]} at index ${k} in the merged region.`,
        comparisons, swaps, arrayAccesses, pass: mergePass, type: 'swap', codeLine: 12,
        recursionTree: getTreeSnapshot(), activeCallId: callId,
      });
      k++;
    }

    while (i < leftArr.length) {
      arr[k] = leftArr[i];
      swaps++; arrayAccesses++;
      steps.push({
        array: [...arr], comparing: null, swapping: [k], sorted: [...sortedIndices],
        description: `Copying remaining left element ${arr[k]} to index ${k}.`,
        comparisons, swaps, arrayAccesses, pass: mergePass, type: 'swap', codeLine: 15,
        recursionTree: getTreeSnapshot(), activeCallId: callId,
      });
      i++; k++;
    }

    while (j < rightArr.length) {
      arr[k] = rightArr[j];
      swaps++; arrayAccesses++;
      steps.push({
        array: [...arr], comparing: null, swapping: [k], sorted: [...sortedIndices],
        description: `Copying remaining right element ${arr[k]} to index ${k}.`,
        comparisons, swaps, arrayAccesses, pass: mergePass, type: 'swap', codeLine: 17,
        recursionTree: getTreeSnapshot(), activeCallId: callId,
      });
      j++; k++;
    }

    if (left === 0 && right === n - 1) {
      for (let idx = 0; idx < n; idx++) sortedIndices.add(idx);
    }

    updateNodeStatus(callId, 'done');

    steps.push({
      array: [...arr], comparing: null, swapping: null, sorted: [...sortedIndices],
      description: `Merge complete: [${left}..${right}] is now [${arr.slice(left, right + 1).join(', ')}].`,
      comparisons, swaps, arrayAccesses, pass: mergePass, type: 'pass-end', codeLine: 19,
      recursionTree: getTreeSnapshot(), activeCallId: callId,
    });
  }

  function mergeSortHelper(left, right, depth) {
    const callId = createCallNode(left, right, depth);

    if (left >= right) {
      updateNodeStatus(callId, 'done');
      return callId;
    }

    const mid = Math.floor((left + right) / 2);
    updateNodeStatus(callId, 'splitting');

    steps.push({
      array: [...arr], comparing: null, swapping: null, sorted: [...sortedIndices],
      description: `Divide: Splitting [${left}..${right}] into [${left}..${mid}] and [${mid + 1}..${right}].`,
      comparisons, swaps, arrayAccesses, pass: mergePass, type: 'compare', codeLine: 3,
      recursionTree: getTreeSnapshot(), activeCallId: callId,
    });

    const leftChildId = mergeSortHelper(left, mid, depth + 1);
    const rightChildId = mergeSortHelper(mid + 1, right, depth + 1);
    setChildren(callId, leftChildId, rightChildId);

    merge(left, mid, right, callId);
    return callId;
  }

  mergeSortHelper(0, n - 1, 0);

  for (let idx = 0; idx < n; idx++) sortedIndices.add(idx);

  steps.push({
    array: [...arr], comparing: null, swapping: null, sorted: [...sortedIndices],
    description: `Sorting complete! Merge Sort finished with ${comparisons} comparisons and ${swaps} writes. Time complexity: O(n log n).`,
    comparisons, swaps, arrayAccesses, pass: mergePass, type: 'done', codeLine: 20,
    recursionTree: getTreeSnapshot(), activeCallId: null,
  });

  return steps;
}
