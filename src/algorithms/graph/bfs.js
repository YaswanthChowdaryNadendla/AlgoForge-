/**
 * Breadth-First Search (BFS) on a Graph
 *
 * Time Complexity:  O(V + E)
 * Space Complexity: O(V)
 *
 * Explores nodes level by level using a queue.
 *
 * @param {Object} adjacencyList - Graph as { nodeId: [neighborId, ...] }
 * @param {string|number} startNode - The starting node ID
 * @returns {Object[]} Array of step objects for visualization
 *
 * Step format:
 * {
 *   visited: [...ids],
 *   current: id,
 *   queue: [...ids],
 *   edges: [{ from, to }],   // edges traversed so far
 *   description: string
 * }
 */
export default function bfs(adjacencyList, startNode) {
  const steps = [];
  const visited = new Set();
  const queue = [startNode];
  const traversedEdges = [];

  visited.add(startNode);

  // Initial state
  steps.push({
    visited: [...visited],
    current: startNode,
    queue: [...queue],
    edges: [...traversedEdges],
    description: `Starting BFS from node ${startNode}. Added ${startNode} to the queue.`,
  });

  while (queue.length > 0) {
    const current = queue.shift();

    steps.push({
      visited: [...visited],
      current,
      queue: [...queue],
      edges: [...traversedEdges],
      description: `Dequeued node ${current}. Processing its neighbors.`,
    });

    const neighbors = adjacencyList[current] || [];

    for (const neighbor of neighbors) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push(neighbor);

        traversedEdges.push({ from: current, to: neighbor });

        steps.push({
          visited: [...visited],
          current,
          queue: [...queue],
          edges: [...traversedEdges],
          description: `Discovered node ${neighbor} via edge ${current} → ${neighbor}. Added to queue.`,
        });
      } else {
        steps.push({
          visited: [...visited],
          current,
          queue: [...queue],
          edges: [...traversedEdges],
          description: `Neighbor ${neighbor} already visited. Skipping.`,
        });
      }
    }

    steps.push({
      visited: [...visited],
      current,
      queue: [...queue],
      edges: [...traversedEdges],
      description: `Finished processing all neighbors of node ${current}.`,
    });
  }

  // Final state
  steps.push({
    visited: [...visited],
    current: null,
    queue: [],
    edges: [...traversedEdges],
    description: `BFS complete. Visited ${visited.size} node(s): [${[...visited].join(', ')}].`,
  });

  return steps;
}
