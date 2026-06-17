/**
 * Linear Search Algorithm — Enhanced for educational visualization
 *
 * Time Complexity:  O(n)
 * Space Complexity: O(1)
 */
export default function linearSearch(array, target) {
  const arr = [...array];
  const steps = [];
  let comparisons = 0;
  let arrayAccesses = 0;

  steps.push({
    array: [...arr], active: null, found: null, discarded: [],
    description: `Starting linear search for target = ${target}. Will check each element from left to right.`,
    comparisons, arrayAccesses, type: 'init', codeLine: 1,
  });

  for (let i = 0; i < arr.length; i++) {
    comparisons++;
    arrayAccesses++;
    const isMatch = arr[i] === target;
    const checked = Array.from({ length: i }, (_, k) => k); // previously checked indices

    steps.push({
      array: [...arr],
      active: i,
      found: isMatch ? i : null,
      discarded: checked,
      description: `Step ${i + 1}: Checking arr[${i}] = ${arr[i]}. ${isMatch ? `Found! ${arr[i]} === ${target}. Search successful!` : `${arr[i]} ≠ ${target}. Moving to next element.`}`,
      comparisons,
      arrayAccesses,
      type: isMatch ? 'found' : 'compare',
      codeLine: isMatch ? 4 : 3,
    });

    if (isMatch) return steps;
  }

  steps.push({
    array: [...arr], active: null, found: null,
    discarded: Array.from({ length: arr.length }, (_, k) => k),
    description: `Target ${target} not found after checking all ${arr.length} elements. ${comparisons} comparisons made.`,
    comparisons, arrayAccesses, type: 'done', codeLine: 6,
  });

  return steps;
}
