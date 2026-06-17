/**
 * Dijkstra's Shortest Path Algorithm
 *
 * Time Complexity:  O(V² + E) with array-based min extraction
 *                   (O((V + E) log V) with a real priority queue)
 * Space Complexity: O(V)
 *
 * Finds the shortest path from startNode to endNode in a weighted graph.
 *
 * @param {Object} adjacencyList - Weighted graph as { nodeId: [{ to, weight }, ...] }
 * @param {string|number} startNode - Source node
 * @param {string|number} endNode   - Destination node
 * @returns {Object[]} Array of step objects for visualization
 *
 * Step format:
 * {
 *   visited: [...ids],
 *   current: id,
 *   distances: { id: dist, ... },
 *   path: [...ids],           // shortest path (populated at the end)
 *   description: string
 * }
 */
export default function dijkstra(adjacencyList, startNode, endNode) {
  const steps = [];
  const visited = new Set();

  // Initialize distances to Infinity for all nodes
  const distances = {};
  const previous = {}; // for path reconstruction
  const allNodes = Object.keys(adjacencyList);

  for (const node of allNodes) {
    distances[node] = Infinity;
    previous[node] = null;
  }
  distances[startNode] = 0;

  // Unvisited set (simple array-based priority queue)
  const unvisited = new Set(allNodes);

  // Initial state
  steps.push({
    visited: [...visited],
    current: null,
    distances: { ...distances },
    path: [],
    description: `Starting Dijkstra from node ${startNode} to node ${endNode}. All distances initialized to ∞ except start (0).`,
  });

  while (unvisited.size > 0) {
    // Find the unvisited node with the smallest distance
    let current = null;
    let minDist = Infinity;

    for (const node of unvisited) {
      if (distances[node] < minDist) {
        minDist = distances[node];
        current = node;
      }
    }

    // If no reachable unvisited node, stop
    if (current === null || minDist === Infinity) {
      steps.push({
        visited: [...visited],
        current: null,
        distances: { ...distances },
        path: [],
        description: 'No more reachable unvisited nodes. Algorithm terminated.',
      });
      break;
    }

    // Visit the current node
    unvisited.delete(current);
    visited.add(current);

    steps.push({
      visited: [...visited],
      current,
      distances: { ...distances },
      path: [],
      description: `Visiting node ${current} with distance ${distances[current]}.`,
    });

    // Early exit if we reached the end node
    if (String(current) === String(endNode)) {
      steps.push({
        visited: [...visited],
        current,
        distances: { ...distances },
        path: [],
        description: `Reached destination node ${endNode} with shortest distance ${distances[current]}.`,
      });
      break;
    }

    // Relax edges from current node
    const neighbors = adjacencyList[current] || [];

    for (const { to: neighbor, weight } of neighbors) {
      if (visited.has(String(neighbor))) {
        steps.push({
          visited: [...visited],
          current,
          distances: { ...distances },
          path: [],
          description: `Neighbor ${neighbor} already visited. Skipping.`,
        });
        continue;
      }

      const newDist = distances[current] + weight;

      steps.push({
        visited: [...visited],
        current,
        distances: { ...distances },
        path: [],
        description: `Checking edge ${current} → ${neighbor} (weight ${weight}). Current dist[${neighbor}] = ${distances[neighbor] === Infinity ? '∞' : distances[neighbor]}, new candidate = ${newDist}.`,
      });

      if (newDist < distances[neighbor]) {
        distances[neighbor] = newDist;
        previous[neighbor] = current;

        steps.push({
          visited: [...visited],
          current,
          distances: { ...distances },
          path: [],
          description: `Updated dist[${neighbor}] to ${newDist} (via ${current}).`,
        });
      }
    }
  }

  // Reconstruct the shortest path from startNode to endNode
  const path = [];
  let node = String(endNode);

  if (distances[node] !== Infinity) {
    while (node !== null) {
      path.unshift(node);
      node = previous[node];
    }
  }

  // Final step with the path
  steps.push({
    visited: [...visited],
    current: null,
    distances: { ...distances },
    path,
    description: path.length > 0
      ? `Shortest path from ${startNode} to ${endNode}: [${path.join(' → ')}] with total distance ${distances[endNode]}.`
      : `No path exists from ${startNode} to ${endNode}.`,
  });

  return steps;
}
