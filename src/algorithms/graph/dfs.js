/**
 * Depth-First Search (DFS) on a Graph
 *
 * Time Complexity:  O(V + E)
 * Space Complexity: O(V)
 *
 * Explores as deep as possible along each branch before backtracking.
 * Uses an explicit stack (iterative implementation) for clarity
 * in step recording.
 *
 * @param {Object} adjacencyList - Graph as { nodeId: [neighborId, ...] }
 * @param {string|number} startNode - The starting node ID
 * @returns {Object[]} Array of step objects for visualization
 *
 * Step format:
 * {
 *   visited: [...ids],
 *   current: id,
 *   stack: [...ids],
 *   edges: [{ from, to }],   // edges traversed so far
 *   description: string
 * }
 */
export default function dfs(adjacencyList, startNode) {
  const steps = [];
  const visited = new Set();
  const stack = [startNode];
  const traversedEdges = [];

  // Track which node pushed each node onto the stack (for edge recording)
  const parentMap = {};
  parentMap[startNode] = null;

  // Initial state
  steps.push({
    visited: [...visited],
    current: null,
    stack: [...stack],
    edges: [...traversedEdges],
    description: `Starting DFS from node ${startNode}. Pushed ${startNode} onto the stack.`,
  });

  while (stack.length > 0) {
    const current = stack.pop();

    // If already visited, skip
    if (visited.has(current)) {
      steps.push({
        visited: [...visited],
        current,
        stack: [...stack],
        edges: [...traversedEdges],
        description: `Popped node ${current} but it's already visited. Skipping.`,
      });
      continue;
    }

    visited.add(current);

    // Record the edge from parent to current (if it exists)
    if (parentMap[current] !== null && parentMap[current] !== undefined) {
      traversedEdges.push({ from: parentMap[current], to: current });
    }

    steps.push({
      visited: [...visited],
      current,
      stack: [...stack],
      edges: [...traversedEdges],
      description: `Popped and visited node ${current}.`,
    });

    // Get neighbors and push unvisited ones onto the stack
    // Reverse to maintain left-to-right order in DFS when popping
    const neighbors = adjacencyList[current] || [];
    const reversedNeighbors = [...neighbors].reverse();

    for (const neighbor of reversedNeighbors) {
      if (!visited.has(neighbor)) {
        stack.push(neighbor);
        parentMap[neighbor] = current;

        steps.push({
          visited: [...visited],
          current,
          stack: [...stack],
          edges: [...traversedEdges],
          description: `Pushed unvisited neighbor ${neighbor} onto the stack.`,
        });
      } else {
        steps.push({
          visited: [...visited],
          current,
          stack: [...stack],
          edges: [...traversedEdges],
          description: `Neighbor ${neighbor} already visited. Not pushing to stack.`,
        });
      }
    }

    steps.push({
      visited: [...visited],
      current,
      stack: [...stack],
      edges: [...traversedEdges],
      description: `Finished exploring neighbors of node ${current}.`,
    });
  }

  // Final state
  steps.push({
    visited: [...visited],
    current: null,
    stack: [],
    edges: [...traversedEdges],
    description: `DFS complete. Visited ${visited.size} node(s): [${[...visited].join(', ')}].`,
  });

  return steps;
}
