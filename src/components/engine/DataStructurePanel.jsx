import { motion, AnimatePresence } from 'framer-motion';

/**
 * Visual representation of the data structure used by a graph algorithm.
 * - BFS → Queue visualization
 * - DFS → Stack visualization
 * - Dijkstra → Priority Queue visualization with distances
 *
 * @param {object} currentState - The current step state from useAlgorithm
 * @param {string} algorithm - 'bfs' | 'dfs' | 'dijkstra'
 * @param {object[]} graphNodes - The React Flow nodes (for label lookup)
 */
export default function DataStructurePanel({ currentState, algorithm, graphNodes }) {
  if (!currentState) {
    return (
      <div className="h-full flex items-center justify-center text-slate-600 text-sm p-4">
        Run a graph algorithm to see its data structure
      </div>
    );
  }

  const nodeLabel = (id) => {
    const n = graphNodes?.find(nd => nd.id === id);
    return n?.data?.label ?? id;
  };

  const { visitedNodes = [], currentNode, queue = [], stack = [], distances = {} } = currentState;

  // BFS Queue
  if (algorithm === 'bfs') {
    return (
      <div className="h-full overflow-y-auto p-4 space-y-4">
        <div>
          <p className="text-[10px] font-mono text-slate-500 uppercase tracking-wider mb-2">BFS Queue (FIFO)</p>
          <div className="flex flex-wrap gap-1.5">
            {queue.length === 0 ? (
              <span className="text-xs text-slate-600">Empty</span>
            ) : (
              <>
                <span className="text-[9px] text-success font-mono self-center mr-0.5">FRONT→</span>
                {queue.map((id, i) => (
                  <motion.div
                    key={`${id}-${i}`}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-9 h-9 rounded-lg flex items-center justify-center text-xs font-mono font-bold
                               border border-blue-500/30 bg-blue-500/10 text-blue-300"
                  >
                    {nodeLabel(id)}
                  </motion.div>
                ))}
                <span className="text-[9px] text-primary font-mono self-center ml-0.5">←REAR</span>
              </>
            )}
          </div>
        </div>

        {/* Current processing */}
        {currentNode && (
          <div>
            <p className="text-[10px] font-mono text-slate-500 uppercase tracking-wider mb-1">Processing</p>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-mono font-bold
                            border-2 border-cyan-400 bg-cyan-500/20 text-cyan-300 shadow-[0_0_12px_rgba(6,182,212,0.4)]">
              {nodeLabel(currentNode)}
            </div>
          </div>
        )}

        {/* Visited */}
        <div>
          <p className="text-[10px] font-mono text-slate-500 uppercase tracking-wider mb-2">
            Visited ({visitedNodes.length})
          </p>
          <div className="flex flex-wrap gap-1">
            {visitedNodes.map((id, i) => (
              <span key={`${id}-${i}`} className="px-2 py-1 rounded-md bg-emerald-500/10 text-emerald-400 text-[10px] font-mono font-semibold border border-emerald-500/20">
                {nodeLabel(id)}
              </span>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // DFS Stack
  if (algorithm === 'dfs') {
    return (
      <div className="h-full overflow-y-auto p-4 space-y-4">
        <div>
          <p className="text-[10px] font-mono text-slate-500 uppercase tracking-wider mb-2">DFS Stack (LIFO)</p>
          <div className="flex flex-col items-center gap-1">
            {stack.length === 0 ? (
              <span className="text-xs text-slate-600">Empty</span>
            ) : (
              <>
                {stack.slice().reverse().map((id, i) => {
                  const isTop = i === 0;
                  return (
                    <motion.div
                      key={`${id}-${i}`}
                      initial={{ x: -30, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      className={`w-24 h-8 rounded-lg flex items-center justify-center text-xs font-mono font-bold
                                  border transition-all ${isTop
                                    ? 'border-purple-400/50 bg-purple-500/20 text-purple-300'
                                    : 'border-white/[0.08] bg-white/[0.03] text-slate-400'}`}
                    >
                      {isTop && <span className="text-[8px] text-purple-400 mr-1">TOP→</span>}
                      {nodeLabel(id)}
                    </motion.div>
                  );
                })}
              </>
            )}
          </div>
        </div>

        {/* Current */}
        {currentNode && (
          <div>
            <p className="text-[10px] font-mono text-slate-500 uppercase tracking-wider mb-1">Processing</p>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-mono font-bold
                            border-2 border-cyan-400 bg-cyan-500/20 text-cyan-300 shadow-[0_0_12px_rgba(6,182,212,0.4)]">
              {nodeLabel(currentNode)}
            </div>
          </div>
        )}

        {/* Visited */}
        <div>
          <p className="text-[10px] font-mono text-slate-500 uppercase tracking-wider mb-2">
            Visited ({visitedNodes.length})
          </p>
          <div className="flex flex-wrap gap-1">
            {visitedNodes.map((id, i) => (
              <span key={`${id}-${i}`} className="px-2 py-1 rounded-md bg-emerald-500/10 text-emerald-400 text-[10px] font-mono font-semibold border border-emerald-500/20">
                {nodeLabel(id)}
              </span>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Dijkstra Priority Queue
  if (algorithm === 'dijkstra') {
    const distEntries = Object.entries(distances);

    return (
      <div className="h-full overflow-y-auto p-4 space-y-4">
        <div>
          <p className="text-[10px] font-mono text-slate-500 uppercase tracking-wider mb-2">Priority Queue (Min-Heap)</p>
          <div className="flex flex-wrap gap-1.5">
            {queue.length === 0 ? (
              <span className="text-xs text-slate-600">Empty</span>
            ) : (
              queue.map((id, i) => (
                <motion.div
                  key={`${id}-${i}`}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className={`flex flex-col items-center px-2 py-1 rounded-lg border
                    ${i === 0 ? 'border-cyan-500/30 bg-cyan-500/10' : 'border-white/[0.08] bg-white/[0.03]'}`}
                >
                  <span className={`text-xs font-mono font-bold ${i === 0 ? 'text-cyan-300' : 'text-slate-300'}`}>
                    {nodeLabel(id)}
                  </span>
                  {distances[nodeLabel(id)] !== undefined && (
                    <span className="text-[8px] text-slate-500">{distances[nodeLabel(id)]}</span>
                  )}
                </motion.div>
              ))
            )}
          </div>
        </div>

        {/* Distance Table */}
        <div>
          <p className="text-[10px] font-mono text-slate-500 uppercase tracking-wider mb-2">Distances</p>
          <div className="grid grid-cols-3 gap-1">
            {distEntries.map(([node, dist]) => {
              const isVisited = visitedNodes.some(id => nodeLabel(id) === node);
              const isCurrent = currentNode && nodeLabel(currentNode) === node;
              return (
                <div key={node} className={`flex items-center justify-between px-2 py-1.5 rounded-lg border text-xs font-mono
                  ${isCurrent
                    ? 'border-cyan-500/30 bg-cyan-500/10 text-cyan-300'
                    : isVisited
                      ? 'border-emerald-500/20 bg-emerald-500/5 text-emerald-400'
                      : 'border-white/[0.04] bg-white/[0.02] text-slate-400'}`}
                >
                  <span className="font-bold">{node}</span>
                  <span className="text-[10px]">{dist}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Visited */}
        <div>
          <p className="text-[10px] font-mono text-slate-500 uppercase tracking-wider mb-1">
            Visited ({visitedNodes.length})
          </p>
          <div className="flex flex-wrap gap-1">
            {visitedNodes.map((id, i) => (
              <span key={`${id}-${i}`} className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[9px] font-mono border border-emerald-500/20">
                {nodeLabel(id)}
              </span>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return null;
}
