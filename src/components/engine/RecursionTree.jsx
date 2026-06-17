import { useMemo } from 'react';
import { motion } from 'framer-motion';

/**
 * RecursionTree — SVG visualization of recursive call structure.
 * Used for Merge Sort and Quick Sort to show the divide-and-conquer pattern.
 *
 * @param {object[]} recursionTree - Array of call nodes: { id, label, left, right, depth, status }
 * @param {number} activeCallId - Currently executing call's id
 * @param {string} algorithm - 'mergeSort' or 'quickSort'
 */

function layoutTree(nodes) {
  if (!nodes || nodes.length === 0) return { positioned: [], edges: [], width: 0, height: 0 };

  // Build lookup
  const byId = {};
  nodes.forEach(n => { byId[n.id] = { ...n }; });

  // Find root (depth 0 or first node)
  const root = nodes.find(n => n.depth === 0) || nodes[0];
  if (!root) return { positioned: [], edges: [], width: 0, height: 0 };

  const nodeWidth = 80;
  const nodeHeight = 36;
  const levelGap = 56;
  const horizontalPad = 8;

  // Recursive layout: returns width of subtree
  function computeWidth(node) {
    if (!node) return 0;
    const left = node.leftId ? byId[node.leftId] : null;
    const right = node.rightId ? byId[node.rightId] : null;
    if (!left && !right) return nodeWidth;
    const lw = left ? computeWidth(left) : 0;
    const rw = right ? computeWidth(right) : 0;
    return lw + horizontalPad + rw;
  }

  const positioned = [];
  const edges = [];

  function position(node, x, y) {
    if (!node) return;
    positioned.push({ ...node, x, y });

    const left = node.leftId ? byId[node.leftId] : null;
    const right = node.rightId ? byId[node.rightId] : null;
    const lw = left ? computeWidth(left) : 0;
    const rw = right ? computeWidth(right) : 0;

    if (left) {
      const lx = x - (lw + horizontalPad + rw) / 2 + lw / 2;
      const ly = y + levelGap;
      edges.push({ x1: x, y1: y + nodeHeight / 2, x2: lx, y2: ly - nodeHeight / 2 });
      position(left, lx, ly);
    }
    if (right) {
      const rx = x + (lw + horizontalPad + rw) / 2 - rw / 2;
      const ry = y + levelGap;
      edges.push({ x1: x, y1: y + nodeHeight / 2, x2: rx, y2: ry - nodeHeight / 2 });
      position(right, rx, ry);
    }
  }

  const totalWidth = computeWidth(root);
  position(root, totalWidth / 2, nodeHeight / 2 + 10);

  const maxX = Math.max(...positioned.map(p => p.x)) + nodeWidth;
  const maxY = Math.max(...positioned.map(p => p.y)) + nodeHeight + 10;

  return { positioned, edges, width: Math.max(maxX, 300), height: Math.max(maxY, 120) };
}

function getNodeColors(status, isActive) {
  if (isActive) return { fill: 'rgba(6,182,212,0.25)', stroke: '#06B6D4', text: '#fff', shadow: '0 0 12px rgba(6,182,212,0.5)' };
  switch (status) {
    case 'splitting': return { fill: 'rgba(59,130,246,0.15)', stroke: '#3B82F6', text: '#93C5FD', shadow: 'none' };
    case 'merging': return { fill: 'rgba(139,92,246,0.15)', stroke: '#8B5CF6', text: '#C4B5FD', shadow: 'none' };
    case 'done': return { fill: 'rgba(16,185,129,0.15)', stroke: '#10B981', text: '#6EE7B7', shadow: 'none' };
    case 'pivot': return { fill: 'rgba(245,158,11,0.15)', stroke: '#F59E0B', text: '#FCD34D', shadow: 'none' };
    default: return { fill: 'rgba(255,255,255,0.03)', stroke: 'rgba(255,255,255,0.1)', text: '#94A3B8', shadow: 'none' };
  }
}

export default function RecursionTree({ recursionTree, activeCallId, algorithm }) {
  const { positioned, edges, width, height } = useMemo(
    () => layoutTree(recursionTree),
    [recursionTree]
  );

  if (!recursionTree || recursionTree.length === 0) {
    return (
      <div className="h-full flex items-center justify-center text-slate-600 text-sm p-4">
        {algorithm === 'mergeSort' || algorithm === 'quickSort'
          ? 'Run the algorithm to see the recursion tree'
          : 'Recursion tree is only available for Merge Sort and Quick Sort'}
      </div>
    );
  }

  return (
    <div className="h-full overflow-auto p-2">
      <svg width={width} height={height} className="mx-auto" style={{ minWidth: 280 }}>
        {/* Edges */}
        {edges.map((e, i) => (
          <line
            key={i}
            x1={e.x1} y1={e.y1} x2={e.x2} y2={e.y2}
            stroke="rgba(148,163,184,0.15)" strokeWidth={1.5}
          />
        ))}

        {/* Nodes */}
        {positioned.map((node) => {
          const isActive = node.id === activeCallId;
          const colors = getNodeColors(node.status, isActive);
          const rx = 8;

          return (
            <g key={node.id}>
              <rect
                x={node.x - 38} y={node.y - 14}
                width={76} height={28} rx={rx}
                fill={colors.fill} stroke={colors.stroke} strokeWidth={isActive ? 2 : 1}
                style={{ filter: colors.shadow !== 'none' ? `drop-shadow(${colors.shadow})` : 'none', transition: 'all 0.3s' }}
              />
              <text
                x={node.x} y={node.y + 4}
                textAnchor="middle" fill={colors.text}
                fontSize={10} fontFamily="JetBrains Mono, monospace" fontWeight={isActive ? 700 : 500}
              >
                {node.label}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Legend */}
      <div className="flex flex-wrap justify-center gap-3 mt-2 px-2">
        {[
          { label: 'Active', color: '#06B6D4' },
          { label: 'Splitting', color: '#3B82F6' },
          { label: algorithm === 'quickSort' ? 'Pivot' : 'Merging', color: algorithm === 'quickSort' ? '#F59E0B' : '#8B5CF6' },
          { label: 'Done', color: '#10B981' },
        ].map(({ label, color }) => (
          <div key={label} className="flex items-center gap-1">
            <div className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: color }} />
            <span className="text-[9px] text-slate-500">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
