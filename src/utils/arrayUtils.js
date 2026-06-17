export function generateRandomArray(size = 50, min = 5, max = 100) {
  return Array.from({ length: size }, () =>
    Math.floor(Math.random() * (max - min + 1)) + min
  );
}

export function generateNearlySortedArray(size = 50) {
  const arr = Array.from({ length: size }, (_, i) => i + 1);
  const swaps = Math.floor(size * 0.1);
  for (let i = 0; i < swaps; i++) {
    const idx = Math.floor(Math.random() * (size - 1));
    [arr[idx], arr[idx + 1]] = [arr[idx + 1], arr[idx]];
  }
  return arr;
}

export function generateReversedArray(size = 50) {
  return Array.from({ length: size }, (_, i) => size - i);
}

export function generateSortedArray(size = 50) {
  return Array.from({ length: size }, (_, i) => i + 1);
}

export function parseCustomArray(input) {
  if (!input || !input.trim()) return null;
  const arr = input
    .split(/[,\s]+/)
    .map((s) => parseInt(s.trim(), 10))
    .filter((n) => !isNaN(n) && n > 0 && n <= 200);
  return arr.length > 0 ? arr : null;
}

export function shuffleArray(arr) {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}
