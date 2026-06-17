import { useState, useCallback, useMemo, lazy, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus, Search as SearchIcon, RotateCcw, Play, Pause, SkipForward, SkipBack, List, MessageSquare, Code2, BookOpen } from 'lucide-react';
import GlassCard from '../../ui/GlassCard';
import GlowButton from '../../ui/GlowButton';
import StepTimeline from '../../engine/StepTimeline';
import ExplanationPanel from '../../engine/ExplanationPanel';
import { useAlgorithm } from '../../../hooks/useAlgorithm';

const CodeViewer = lazy(() => import('../../code/CodeViewer'));
const AlgorithmInfo = lazy(() => import('../../education/AlgorithmInfo'));
import { CodeViewerSkeleton, AlgorithmInfoSkeleton } from '../../ui/Skeletons';

// ========== BST logic ==========
class TreeNode {
  constructor(value) {
    this.value = value;
    this.left = null;
    this.right = null;
    this.id = Math.random().toString(36).slice(2, 9);
  }
}

function cloneTree(node) {
  if (!node) return null;
  const n = new TreeNode(node.value);
  n.id = node.id;
  n.left = cloneTree(node.left);
  n.right = cloneTree(node.right);
  return n;
}

function insertNode(root, value) {
  if (!root) return new TreeNode(value);
  if (value < root.value) root.left = insertNode(root.left, value);
  else if (value > root.value) root.right = insertNode(root.right, value);
  return root;
}

function deleteNode(root, value) {
  if (!root) return null;
  if (value < root.value) { root.left = deleteNode(root.left, value); return root; }
  if (value > root.value) { root.right = deleteNode(root.right, value); return root; }
  if (!root.left) return root.right;
  if (!root.right) return root.left;
  let minNode = root.right;
  while (minNode.left) minNode = minNode.left;
  root.value = minNode.value;
  root.right = deleteNode(root.right, minNode.value);
  return root;
}

function getPositions(node, x = 400, y = 40, spread = 160, depth = 0, positions = []) {
  if (!node) return positions;
  positions.push({ value: node.value, x, y, id: node.id, depth });
  getPositions(node.left, x - spread / (1 + depth * 0.3), y + 70, spread * 0.6, depth + 1, positions);
  getPositions(node.right, x + spread / (1 + depth * 0.3), y + 70, spread * 0.6, depth + 1, positions);
  return positions;
}

function getEdges(node, x = 400, y = 40, spread = 160, depth = 0, edges = []) {
  if (!node) return edges;
  if (node.left) {
    const cx = x - spread / (1 + depth * 0.3);
    edges.push({ x1: x, y1: y, x2: cx, y2: y + 70 });
    getEdges(node.left, cx, y + 70, spread * 0.6, depth + 1, edges);
  }
  if (node.right) {
    const cx = x + spread / (1 + depth * 0.3);
    edges.push({ x1: x, y1: y, x2: cx, y2: y + 70 });
    getEdges(node.right, cx, y + 70, spread * 0.6, depth + 1, edges);
  }
  return edges;
}

// ========== Traversal step generators ==========
function generateSearchSteps(root, value) {
  const steps = [];
  let node = root;
  const visited = [];
  let comparisons = 0;

  steps.push({ highlighted: [], visited: [], description: `Searching for ${value} in BST. Starting at root.`, comparisons, type: 'init', codeLine: 1 });

  while (node) {
    comparisons++;
    visited.push(node.value);

    if (value === node.value) {
      steps.push({ highlighted: [node.value], visited: [...visited], description: `Found ${value}! Node ${node.value} matches the target.`, comparisons, type: 'found', codeLine: 3 });
      return steps;
    } else if (value < node.value) {
      steps.push({ highlighted: [node.value], visited: [...visited], description: `${value} < ${node.value}, moving to left subtree.`, comparisons, type: 'compare', codeLine: 4 });
      node = node.left;
    } else {
      steps.push({ highlighted: [node.value], visited: [...visited], description: `${value} > ${node.value}, moving to right subtree.`, comparisons, type: 'compare', codeLine: 5 });
      node = node.right;
    }
  }

  steps.push({ highlighted: [], visited: [...visited], description: `${value} not found in the BST. Reached a null node after ${comparisons} comparisons.`, comparisons, type: 'done', codeLine: 6 });
  return steps;
}

function generateTraversalSteps(root, type) {
  const steps = [];
  const visited = [];
  let comparisons = 0;

  steps.push({ highlighted: [], visited: [], traversalOrder: [], description: `Starting ${type} traversal of BST.`, comparisons, type: 'init', codeLine: 1 });

  function inorder(node) {
    if (!node) return;
    inorder(node.left);
    comparisons++;
    visited.push(node.value);
    steps.push({ highlighted: [node.value], visited: [...visited], traversalOrder: [...visited], description: `Inorder: Visit node ${node.value}. Order so far: [${visited.join(', ')}]`, comparisons, type: 'compare', codeLine: 3 });
    inorder(node.right);
  }

  function preorder(node) {
    if (!node) return;
    comparisons++;
    visited.push(node.value);
    steps.push({ highlighted: [node.value], visited: [...visited], traversalOrder: [...visited], description: `Preorder: Visit node ${node.value} first, then left and right subtrees. Order: [${visited.join(', ')}]`, comparisons, type: 'compare', codeLine: 3 });
    preorder(node.left);
    preorder(node.right);
  }

  function postorder(node) {
    if (!node) return;
    postorder(node.left);
    postorder(node.right);
    comparisons++;
    visited.push(node.value);
    steps.push({ highlighted: [node.value], visited: [...visited], traversalOrder: [...visited], description: `Postorder: Visit node ${node.value} after both subtrees. Order: [${visited.join(', ')}]`, comparisons, type: 'compare', codeLine: 3 });
  }

  function levelorder(node) {
    if (!node) return;
    const queue = [node];
    while (queue.length) {
      const n = queue.shift();
      comparisons++;
      visited.push(n.value);
      steps.push({ highlighted: [n.value], visited: [...visited], traversalOrder: [...visited], description: `Level-order: Visit node ${n.value}. Queue: [${queue.map(q => q.value).join(', ')}]. Order: [${visited.join(', ')}]`, comparisons, type: 'compare', codeLine: 3 });
      if (n.left) queue.push(n.left);
      if (n.right) queue.push(n.right);
    }
  }

  if (type === 'inorder') inorder(root);
  else if (type === 'preorder') preorder(root);
  else if (type === 'postorder') postorder(root);
  else levelorder(root);

  steps.push({ highlighted: [], visited: [...visited], traversalOrder: [...visited], description: `${type} traversal complete: [${visited.join(', ')}]`, comparisons, type: 'done', codeLine: 5 });
  return steps;
}

// ========== Tabs ==========
const tabs = [
  { key: 'timeline', label: 'Timeline', icon: List },
  { key: 'explanation', label: 'Explain', icon: MessageSquare },
  { key: 'code', label: 'Code', icon: Code2 },
  { key: 'learn', label: 'Learn', icon: BookOpen },
];

export default function TreeVisualizer() {
  const [root, setRoot] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const [message, setMessage] = useState('BST is empty. Insert some values!');
  const [traversalResult, setTraversalResult] = useState(null);
  const [activeTab, setActiveTab] = useState('timeline');

  const {
    steps, currentStep, currentState, isPlaying, isPaused, isComplete,
    speed, stats, totalSteps, setSpeed,
    loadSteps, play, pause, resume, stepForward, stepBackward, goToStep, reset,
  } = useAlgorithm();

  // Derive highlighted from step engine
  const highlighted = currentState?.highlighted || [];
  const visited = currentState?.visited || [];

  const positions = useMemo(() => getPositions(root), [root]);
  const edges = useMemo(() => getEdges(root), [root]);

  const viewWidth = 800;
  const viewHeight = Math.max(350, positions.length > 0 ? Math.max(...positions.map(p => p.y)) + 80 : 350);

  const handleInsert = () => {
    const val = parseInt(inputValue, 10);
    if (isNaN(val)) return;
    setRoot((prev) => (prev ? insertNode(cloneTree(prev), val) : new TreeNode(val)));
    setMessage(`Inserted ${val}`);
    setInputValue('');
    reset();
  };

  const handleDelete = () => {
    const val = parseInt(inputValue, 10);
    if (isNaN(val)) return;
    setRoot((prev) => deleteNode(cloneTree(prev), val));
    setMessage(`Deleted ${val}`);
    setInputValue('');
    reset();
  };

  const handleSearch = () => {
    const val = parseInt(inputValue, 10);
    if (isNaN(val) || !root) return;
    const searchSteps = generateSearchSteps(root, val);
    loadSteps(searchSteps);
    setTimeout(() => play(), 50);
  };

  const runTraversal = (type) => {
    if (!root) return;
    const travSteps = generateTraversalSteps(root, type);
    loadSteps(travSteps);
    setTimeout(() => play(), 50);
  };

  // Show traversal result when done
  const displayMessage = currentState?.description || message;

  const renderTab = () => {
    switch (activeTab) {
      case 'timeline': return <StepTimeline steps={steps} currentStep={currentStep} onGoToStep={goToStep} />;
      case 'explanation': return <ExplanationPanel currentState={currentState} algorithm="bst" currentStep={currentStep} totalSteps={totalSteps} />;
      case 'code':
        return (
          <Suspense fallback={<CodeViewerSkeleton />}>
            <CodeViewer algorithmName="bst" activeLine={currentState?.codeLine} />
          </Suspense>
        );
      case 'learn':
        return (
          <Suspense fallback={<AlgorithmInfoSkeleton />}>
            <AlgorithmInfo algorithmName="bst" />
          </Suspense>
        );
      default: return null;
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-white">
          Binary Search Tree <span className="gradient-text">Visualizer</span>
        </h1>
        <p className="text-slate-500 text-sm mt-1">Visualize BST operations and traversals step by step</p>
      </div>

      {/* Controls */}
      <GlassCard hover={false} className="p-4 md:p-5">
        <div className="flex flex-wrap items-end gap-3">
          <div className="min-w-[120px]">
            <label className="text-xs font-medium text-slate-400 mb-1.5 block">Value</label>
            <input type="number" value={inputValue} onChange={(e) => setInputValue(e.target.value)}
              placeholder="Enter value" className="input-glass" onKeyDown={(e) => e.key === 'Enter' && handleInsert()} />
          </div>
          <GlowButton variant="primary" icon={Plus} onClick={handleInsert} size="sm">Insert</GlowButton>
          <GlowButton variant="danger" icon={Minus} onClick={handleDelete} size="sm">Delete</GlowButton>
          <GlowButton variant="accent" icon={SearchIcon} onClick={handleSearch} size="sm">Search</GlowButton>
          <GlowButton variant="ghost" icon={RotateCcw} onClick={() => { setRoot(null); setMessage('BST cleared.'); reset(); }} size="sm">Reset</GlowButton>
        </div>
        <div className="flex flex-wrap items-center gap-2 mt-3">
          <span className="text-xs text-slate-500 mr-1">Traversals:</span>
          {['inorder', 'preorder', 'postorder', 'levelOrder'].map((t) => (
            <GlowButton key={t} variant="ghost" onClick={() => runTraversal(t)} size="sm" icon={Play} disabled={isPlaying}>
              {t === 'levelOrder' ? 'Level Order' : t.charAt(0).toUpperCase() + t.slice(1)}
            </GlowButton>
          ))}
          <div className="flex-1" />
          {/* Playback controls for traversal */}
          {steps.length > 0 && (
            <div className="flex items-center gap-1">
              <GlowButton variant="ghost" icon={SkipBack} onClick={stepBackward} disabled={isPlaying} size="sm" />
              {isPlaying ? (
                <GlowButton variant="ghost" icon={Pause} onClick={pause} size="sm" />
              ) : isPaused ? (
                <GlowButton variant="ghost" icon={Play} onClick={resume} size="sm" />
              ) : null}
              <GlowButton variant="ghost" icon={SkipForward} onClick={stepForward} disabled={isPlaying} size="sm" />
            </div>
          )}
        </div>
      </GlassCard>

      {/* Status message */}
      <GlassCard hover={false} className="p-3 px-5">
        <p className="text-sm text-slate-300">{displayMessage}</p>
        {currentState?.traversalOrder && (
          <p className="text-xs font-mono text-primary mt-1">
            Order: [{currentState.traversalOrder.join(', ')}]
          </p>
        )}
      </GlassCard>

      {/* Visualization + Side Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* SVG Tree */}
        <GlassCard hover={false} className="lg:col-span-3 p-4">
          <div className="overflow-auto">
            <svg width={viewWidth} height={viewHeight} className="mx-auto" style={{ minHeight: 300 }}>
              {edges.map((edge, i) => (
                <motion.line
                  key={i}
                  x1={edge.x1} y1={edge.y1 + 18} x2={edge.x2} y2={edge.y2 - 18}
                  stroke="rgba(148,163,184,0.2)" strokeWidth={2}
                  initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                  transition={{ duration: 0.3 }}
                />
              ))}
              {positions.map((pos) => {
                const isHighlighted = highlighted.includes(pos.value);
                const isVisited = visited.includes(pos.value);
                return (
                  <motion.g key={pos.id || pos.value}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                  >
                    <circle
                      cx={pos.x} cy={pos.y} r={22}
                      fill={isHighlighted ? 'rgba(6,182,212,0.3)' : isVisited ? 'rgba(16,185,129,0.15)' : 'rgba(59,130,246,0.12)'}
                      stroke={isHighlighted ? '#06B6D4' : isVisited ? '#10B981' : 'rgba(255,255,255,0.1)'}
                      strokeWidth={isHighlighted ? 2.5 : isVisited ? 1.5 : 1}
                      style={{ filter: isHighlighted ? 'drop-shadow(0 0 10px rgba(6,182,212,0.6))' : 'none', transition: 'all 0.3s' }}
                    />
                    <text
                      x={pos.x} y={pos.y + 5} textAnchor="middle"
                      fill={isHighlighted ? '#fff' : isVisited ? '#A7F3D0' : '#CBD5E1'}
                      fontSize={13} fontFamily="JetBrains Mono, monospace" fontWeight={600}
                    >
                      {pos.value}
                    </text>
                  </motion.g>
                );
              })}
              {positions.length === 0 && (
                <text x={viewWidth / 2} y={viewHeight / 2} textAnchor="middle" fill="#475569" fontSize={14}>
                  Empty tree — insert values to begin
                </text>
              )}
            </svg>
          </div>
        </GlassCard>

        {/* Side Panel */}
        <GlassCard hover={false} className="lg:col-span-2 p-0 flex flex-col h-auto lg:h-[calc(100vh-230px)] lg:min-h-[480px] lg:max-h-[750px] overflow-visible lg:overflow-hidden">
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
