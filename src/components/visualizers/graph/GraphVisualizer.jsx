import { useState, useCallback, useMemo, useEffect, useRef, lazy, Suspense, memo } from 'react';
import { ReactFlow, useNodesState, useEdgesState, Controls, Background, MarkerType, Handle, Position } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { motion } from 'framer-motion';
import { Plus, Trash2, Play, Pause, RotateCcw, Link2, SkipForward, SkipBack, List, MessageSquare, Code2, BookOpen, Layers } from 'lucide-react';
import GlassCard from '../../ui/GlassCard';
import GlowButton from '../../ui/GlowButton';
import StepTimeline from '../../engine/StepTimeline';
import ExplanationPanel from '../../engine/ExplanationPanel';
import DataStructurePanel from '../../engine/DataStructurePanel';
import { useAlgorithm } from '../../../hooks/useAlgorithm';

const CodeViewer = lazy(() => import('../../code/CodeViewer'));
const AlgorithmInfo = lazy(() => import('../../education/AlgorithmInfo'));
import { CodeViewerSkeleton, AlgorithmInfoSkeleton } from '../../ui/Skeletons';

const CustomNode = memo(function CustomNode({ data }) {
  return (
    <div
      className={`w-14 h-14 rounded-2xl flex items-center justify-center font-mono font-bold text-sm
                  border transition-all duration-500
                  ${data.state === 'visited'
                    ? 'border-success/50 bg-success/20 text-success shadow-[0_0_15px_rgba(16,185,129,0.4)]'
                    : data.state === 'current'
                      ? 'border-accent/50 bg-accent/20 text-accent shadow-[0_0_20px_rgba(6,182,212,0.5)]'
                      : data.state === 'path'
                        ? 'border-warning/50 bg-warning/20 text-warning shadow-[0_0_15px_rgba(245,158,11,0.4)]'
                        : 'border-white/10 bg-white/[0.05] text-slate-200'
                  }`}
    >
      <Handle type="target" position={Position.Top} className="!bg-transparent !border-none" />
      <Handle type="source" position={Position.Bottom} className="!bg-transparent !border-none" />
      {data.label}
    </div>
  );
});

const nodeTypes = { custom: CustomNode };
let nodeCounter = 0;

// ========== Step generators ==========
function generateBFSSteps(adj, startId, nodeLabels) {
  const steps = [];
  const visited = new Set();
  const queue = [startId];
  visited.add(startId);
  const visitedList = [];

  steps.push({
    visitedNodes: [], currentNode: null, queue: [startId], stack: [],
    distances: {}, description: `BFS: Starting from node ${nodeLabels[startId]}. Queue: [${nodeLabels[startId]}].`,
    comparisons: 0, type: 'init', codeLine: 1,
  });

  while (queue.length > 0) {
    const current = queue.shift();
    visitedList.push(current);

    steps.push({
      visitedNodes: [...visitedList], currentNode: current,
      queue: [...queue], stack: [],
      description: `BFS: Dequeued node ${nodeLabels[current]}. Visiting it. Queue: [${queue.map(id => nodeLabels[id]).join(', ')}]. Visited: [${visitedList.map(id => nodeLabels[id]).join(', ')}].`,
      comparisons: visitedList.length, type: 'compare', codeLine: 4,
    });

    for (const { to } of adj[current] || []) {
      if (!visited.has(to)) {
        visited.add(to);
        queue.push(to);
        steps.push({
          visitedNodes: [...visitedList], currentNode: current,
          queue: [...queue], stack: [],
          description: `BFS: Discovered neighbor ${nodeLabels[to]} from ${nodeLabels[current]}. Added to queue. Queue: [${queue.map(id => nodeLabels[id]).join(', ')}].`,
          comparisons: visitedList.length, type: 'swap', codeLine: 6,
        });
      }
    }
  }

  steps.push({
    visitedNodes: [...visitedList], currentNode: null, queue: [], stack: [],
    description: `BFS complete! Traversal order: [${visitedList.map(id => nodeLabels[id]).join(' → ')}]. Visited ${visitedList.length} nodes.`,
    comparisons: visitedList.length, type: 'done', codeLine: 8,
  });
  return steps;
}

function generateDFSSteps(adj, startId, nodeLabels) {
  const steps = [];
  const visited = new Set();
  const stack = [startId];
  const visitedList = [];

  steps.push({
    visitedNodes: [], currentNode: null, queue: [], stack: [startId],
    description: `DFS: Starting from node ${nodeLabels[startId]}. Stack: [${nodeLabels[startId]}].`,
    comparisons: 0, type: 'init', codeLine: 1,
  });

  while (stack.length > 0) {
    const current = stack.pop();
    if (visited.has(current)) continue;
    visited.add(current);
    visitedList.push(current);

    steps.push({
      visitedNodes: [...visitedList], currentNode: current,
      queue: [], stack: [...stack],
      description: `DFS: Popped node ${nodeLabels[current]} from stack. Visiting it. Stack: [${stack.map(id => nodeLabels[id]).join(', ')}]. Visited: [${visitedList.map(id => nodeLabels[id]).join(', ')}].`,
      comparisons: visitedList.length, type: 'compare', codeLine: 4,
    });

    for (const { to } of (adj[current] || []).slice().reverse()) {
      if (!visited.has(to)) {
        stack.push(to);
        steps.push({
          visitedNodes: [...visitedList], currentNode: current,
          queue: [], stack: [...stack],
          description: `DFS: Pushing neighbor ${nodeLabels[to]} onto stack. Stack: [${stack.map(id => nodeLabels[id]).join(', ')}].`,
          comparisons: visitedList.length, type: 'swap', codeLine: 6,
        });
      }
    }
  }

  steps.push({
    visitedNodes: [...visitedList], currentNode: null, queue: [], stack: [],
    description: `DFS complete! Traversal order: [${visitedList.map(id => nodeLabels[id]).join(' → ')}]. Visited ${visitedList.length} nodes.`,
    comparisons: visitedList.length, type: 'done', codeLine: 8,
  });
  return steps;
}

function generateDijkstraSteps(adj, startId, nodeLabels, allNodeIds) {
  const steps = [];
  const distances = {};
  const visited = new Set();
  const visitedList = [];
  allNodeIds.forEach(id => { distances[id] = Infinity; });
  distances[startId] = 0;
  const pq = [{ node: startId, dist: 0 }];

  const distLabels = () => Object.fromEntries(
    Object.entries(distances).map(([id, d]) => [nodeLabels[id], d === Infinity ? '∞' : d])
  );

  steps.push({
    visitedNodes: [], currentNode: null, queue: [], stack: [],
    distances: distLabels(),
    description: `Dijkstra: Starting from node ${nodeLabels[startId]}. Initial distances: all ∞ except source = 0.`,
    comparisons: 0, type: 'init', codeLine: 1,
  });

  while (pq.length > 0) {
    pq.sort((a, b) => a.dist - b.dist);
    const { node: current, dist } = pq.shift();
    if (visited.has(current)) continue;
    visited.add(current);
    visitedList.push(current);

    steps.push({
      visitedNodes: [...visitedList], currentNode: current,
      queue: pq.map(p => p.node), stack: [],
      distances: distLabels(),
      description: `Dijkstra: Processing node ${nodeLabels[current]} with distance ${dist}. Visited: [${visitedList.map(id => nodeLabels[id]).join(', ')}].`,
      comparisons: visitedList.length, type: 'compare', codeLine: 5,
    });

    for (const { to, weight } of adj[current] || []) {
      const newDist = dist + weight;
      if (newDist < distances[to]) {
        distances[to] = newDist;
        pq.push({ node: to, dist: newDist });

        steps.push({
          visitedNodes: [...visitedList], currentNode: current,
          queue: pq.map(p => p.node), stack: [],
          distances: distLabels(),
          description: `Dijkstra: Relaxed edge ${nodeLabels[current]} → ${nodeLabels[to]} (weight: ${weight}). Updated distance to ${nodeLabels[to]}: ${newDist} (was ${distances[to] === newDist ? '∞' : distances[to]}).`,
          comparisons: visitedList.length, type: 'swap', codeLine: 7,
        });
      }
    }
  }

  steps.push({
    visitedNodes: [...visitedList], currentNode: null, queue: [], stack: [],
    distances: distLabels(),
    description: `Dijkstra complete! Final distances: ${Object.entries(distLabels()).map(([k, v]) => `${k}:${v}`).join(', ')}.`,
    comparisons: visitedList.length, type: 'done', codeLine: 10,
  });
  return steps;
}

function buildAdjList(nodes, edges) {
  const adj = {};
  nodes.forEach(n => { adj[n.id] = []; });
  edges.forEach(e => {
    const w = e.data?.weight || 1;
    adj[e.source] = adj[e.source] || [];
    adj[e.source].push({ to: e.target, weight: w });
  });
  return adj;
}

// Tabs
const tabs = [
  { key: 'timeline', label: 'Timeline', icon: List },
  { key: 'dsview', label: 'DS View', icon: Layers },
  { key: 'explanation', label: 'Explain', icon: MessageSquare },
  { key: 'code', label: 'Code', icon: Code2 },
  { key: 'learn', label: 'Learn', icon: BookOpen },
];

export default function GraphVisualizer() {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [algorithm, setAlgorithm] = useState('bfs');
  const [startNode, setStartNode] = useState('');
  const [connectMode, setConnectMode] = useState(false);
  const [connectFrom, setConnectFrom] = useState(null);
  const [message, setMessage] = useState('Add nodes to build your graph');
  const [edgeWeight, setEdgeWeight] = useState('1');
  const [activeTab, setActiveTab] = useState('timeline');

  const {
    steps, currentStep, currentState, isPlaying, isPaused,
    totalSteps, loadSteps, play, pause, resume, stepForward, stepBackward, goToStep, reset: resetEngine,
  } = useAlgorithm();

  const addNode = useCallback(() => {
    const id = `node-${++nodeCounter}`;
    setNodes(nds => [...nds, {
      id, type: 'custom',
      position: { x: 100 + Math.random() * 400, y: 100 + Math.random() * 300 },
      data: { label: nodeCounter, state: 'default' },
    }]);
    setMessage(`Added node ${nodeCounter}`);
  }, [setNodes]);

  const deleteSelected = useCallback(() => {
    setNodes(nds => nds.filter(n => !n.selected));
    setEdges(eds => eds.filter(e => !e.selected));
    setMessage('Deleted selected elements');
  }, [setNodes, setEdges]);

  const onNodeClick = useCallback((event, node) => {
    if (!connectMode) return;
    if (!connectFrom) {
      setConnectFrom(node.id);
      setMessage(`Select target node to connect from ${node.data.label}`);
    } else if (connectFrom !== node.id) {
      const w = parseInt(edgeWeight, 10) || 1;
      setEdges(eds => [...eds, {
        id: `${connectFrom}-${node.id}`, source: connectFrom, target: node.id,
        label: String(w),
        style: { stroke: 'rgba(148,163,184,0.4)', strokeWidth: 2 },
        labelStyle: { fill: '#94A3B8', fontSize: 11, fontFamily: 'JetBrains Mono' },
        markerEnd: { type: MarkerType.ArrowClosed, color: 'rgba(148,163,184,0.4)' },
        data: { weight: w },
      }]);
      setConnectFrom(null);
      setConnectMode(false);
    }
  }, [connectMode, connectFrom, edgeWeight, setEdges]);

  const resetNodeStates = useCallback(() => {
    setNodes(nds => nds.map(n => {
      if (n.data.state === 'default') return n;
      return { ...n, data: { ...n.data, state: 'default' } };
    }));
    setEdges(eds => eds.map(e => {
      if (e.style?.stroke === 'rgba(148,163,184,0.4)' && !e.animated) return e;
      return {
        ...e, style: { stroke: 'rgba(148,163,184,0.4)', strokeWidth: 2 }, animated: false,
      };
    }));
    resetEngine();
  }, [setNodes, setEdges, resetEngine]);

  const runAlgorithm = useCallback(() => {
    if (nodes.length === 0) return;
    const start = startNode || nodes[0]?.id;
    if (!start) return;
    resetNodeStates();

    const adj = buildAdjList(nodes, edges);
    const nodeLabels = {};
    nodes.forEach(n => { nodeLabels[n.id] = n.data.label; });
    const allNodeIds = nodes.map(n => n.id);

    let generatedSteps;
    if (algorithm === 'bfs') generatedSteps = generateBFSSteps(adj, start, nodeLabels);
    else if (algorithm === 'dfs') generatedSteps = generateDFSSteps(adj, start, nodeLabels);
    else generatedSteps = generateDijkstraSteps(adj, start, nodeLabels, allNodeIds);

    loadSteps(generatedSteps);
    setTimeout(() => play(), 50);
  }, [nodes, edges, startNode, algorithm, resetNodeStates, loadSteps, play]);

  // Sync React Flow node states with step engine
  useEffect(() => {
    if (!currentState) return;
    const { visitedNodes = [], currentNode } = currentState;
    setNodes(nds => nds.map(n => {
      const nextState = n.id === currentNode ? 'current' : visitedNodes.includes(n.id) ? 'visited' : 'default';
      if (n.data.state === nextState) return n;
      return {
        ...n,
        data: { ...n.data, state: nextState }
      };
    }));
  }, [currentState, setNodes]);

  const displayMessage = currentState?.description || message;

  const renderTab = () => {
    switch (activeTab) {
      case 'timeline': return <StepTimeline steps={steps} currentStep={currentStep} onGoToStep={goToStep} />;
      case 'dsview': return <DataStructurePanel currentState={currentState} algorithm={algorithm} graphNodes={nodes} />;
      case 'explanation': return <ExplanationPanel currentState={currentState} algorithm={algorithm} currentStep={currentStep} totalSteps={totalSteps} />;
      case 'code':
        return (
          <Suspense fallback={<CodeViewerSkeleton />}>
            <CodeViewer algorithmName={algorithm} activeLine={currentState?.codeLine} />
          </Suspense>
        );
      case 'learn':
        return (
          <Suspense fallback={<AlgorithmInfoSkeleton />}>
            <AlgorithmInfo algorithmName={algorithm} />
          </Suspense>
        );
      default: return null;
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-white">
          Graph <span className="gradient-text">Visualizer</span>
        </h1>
        <p className="text-slate-500 text-sm mt-1">Build graphs and run traversal algorithms with step-by-step tracing</p>
      </div>

      <GlassCard hover={false} className="p-4 md:p-5">
        <div className="flex flex-wrap items-end gap-3">
          <GlowButton variant="primary" icon={Plus} onClick={addNode} size="sm">Add Node</GlowButton>
          <GlowButton variant={connectMode ? 'accent' : 'ghost'} icon={Link2}
            onClick={() => { setConnectMode(!connectMode); setConnectFrom(null); }} size="sm">
            {connectMode ? 'Connecting...' : 'Connect'}
          </GlowButton>
          <div className="min-w-[70px]">
            <label className="text-xs font-medium text-slate-400 mb-1 block">Weight</label>
            <input type="number" value={edgeWeight} onChange={(e) => setEdgeWeight(e.target.value)}
              className="input-glass !py-1.5 text-center" min="1" />
          </div>
          <GlowButton variant="danger" icon={Trash2} onClick={deleteSelected} size="sm">Delete</GlowButton>
          <div className="w-px h-8 bg-white/[0.06] mx-1 hidden sm:block" />
          <div className="min-w-[130px]">
            <label className="text-xs font-medium text-slate-400 mb-1 block">Algorithm</label>
            <select value={algorithm} onChange={(e) => setAlgorithm(e.target.value)}
              className="w-full px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.08] text-slate-200 text-sm focus:outline-none appearance-none cursor-pointer"
              style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2394A3B8' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 8px center' }}
            >
              <option value="bfs" className="bg-dark-900">BFS</option>
              <option value="dfs" className="bg-dark-900">DFS</option>
              <option value="dijkstra" className="bg-dark-900">Dijkstra</option>
            </select>
          </div>
          <GlowButton variant="primary" icon={Play} onClick={runAlgorithm} disabled={isPlaying} size="sm">Run</GlowButton>
          <GlowButton variant="ghost" icon={RotateCcw} onClick={resetNodeStates} size="sm">Reset</GlowButton>
        </div>
        {/* Playback controls */}
        {steps.length > 0 && (
          <div className="flex items-center gap-1 mt-3">
            <GlowButton variant="ghost" icon={SkipBack} onClick={stepBackward} disabled={isPlaying} size="sm" />
            {isPlaying ? (
              <GlowButton variant="ghost" icon={Pause} onClick={pause} size="sm" />
            ) : isPaused ? (
              <GlowButton variant="ghost" icon={Play} onClick={resume} size="sm" />
            ) : null}
            <GlowButton variant="ghost" icon={SkipForward} onClick={stepForward} disabled={isPlaying} size="sm" />
            <span className="text-xs font-mono text-slate-500 ml-2">{currentStep + 1}/{totalSteps}</span>
          </div>
        )}
      </GlassCard>

      {/* Status + Data Structure Contents */}
      <GlassCard hover={false} className="p-3 px-5">
        <p className="text-sm text-slate-300">{displayMessage}</p>
        {currentState && (
          <div className="flex flex-wrap gap-3 mt-2">
            {currentState.queue?.length > 0 && (
              <div className="text-xs">
                <span className="text-slate-500">Queue: </span>
                <span className="font-mono text-blue-400">[{currentState.queue.map(id => {
                  const n = nodes.find(nd => nd.id === id);
                  return n?.data?.label ?? id;
                }).join(', ')}]</span>
              </div>
            )}
            {currentState.stack?.length > 0 && (
              <div className="text-xs">
                <span className="text-slate-500">Stack: </span>
                <span className="font-mono text-purple-400">[{currentState.stack.map(id => {
                  const n = nodes.find(nd => nd.id === id);
                  return n?.data?.label ?? id;
                }).join(', ')}]</span>
              </div>
            )}
            {currentState.distances && (
              <div className="text-xs">
                <span className="text-slate-500">Distances: </span>
                <span className="font-mono text-cyan-400">
                  {Object.entries(currentState.distances).map(([k, v]) => `${k}:${v}`).join(', ')}
                </span>
              </div>
            )}
          </div>
        )}
      </GlassCard>

      {/* Graph + Side Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        <GlassCard hover={false} className="lg:col-span-3 p-0 overflow-hidden" style={{ height: 450 }}>
          <ReactFlow
            nodes={nodes} edges={edges}
            onNodesChange={onNodesChange} onEdgesChange={onEdgesChange}
            onNodeClick={onNodeClick} nodeTypes={nodeTypes}
            fitView className="bg-dark-950"
          >
            <Controls />
            <Background color="rgba(148,163,184,0.05)" gap={20} />
          </ReactFlow>
        </GlassCard>

        {/* Side Panel */}
        <GlassCard hover={false} className="lg:col-span-2 p-0 flex flex-col h-auto lg:h-[calc(100vh-230px)] lg:min-h-[450px] lg:max-h-[750px] overflow-visible lg:overflow-hidden">
          <div className="flex border-b border-white/[0.06] shrink-0 sticky top-0 z-30 bg-dark-950/95 backdrop-blur-md lg:relative lg:top-auto lg:z-auto lg:bg-transparent lg:backdrop-filter-none">
            {tabs.map((tab) => (
              <button key={tab.key} onClick={() => setActiveTab(tab.key)}
                className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 text-xs font-medium transition-all
                  ${activeTab === tab.key ? 'text-white border-b-2 border-primary bg-white/[0.02]' : 'text-slate-500 hover:text-slate-300'}`}
              >
                <tab.icon className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </div>
          <div className="flex-1 overflow-visible lg:overflow-hidden">
            {renderTab()}
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
