import { useCallback, useMemo } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  useNodesState,
  useEdgesState,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

export default function GraphView({ dependencies = [], className = '' }) {
  const { nodes: initialNodes, edges: initialEdges } = useMemo(() => {
    if (!dependencies.length) return { nodes: [], edges: [] };

    const fileSet = new Set();
    dependencies.forEach(d => {
      fileSet.add(d.from);
      if (!d.to.startsWith('.') && !d.to.startsWith('/')) return;
      fileSet.add(d.to);
    });

    const files = [...fileSet];
    const cols = Math.ceil(Math.sqrt(files.length));

    const nodes = files.map((file, i) => ({
      id: file,
      data: { label: file.split('/').pop() },
      position: { x: (i % cols) * 220, y: Math.floor(i / cols) * 100 },
      style: {
        background: '#1e293b',
        border: '1px solid #334155',
        borderRadius: '0.75rem',
        color: '#f1f5f9',
        padding: '8px 16px',
        fontSize: '0.75rem',
        fontFamily: 'JetBrains Mono, monospace',
      },
    }));

    const edges = dependencies
      .filter(d => fileSet.has(d.from) && fileSet.has(d.to))
      .map((d, i) => ({
        id: `e-${i}`,
        source: d.from,
        target: d.to,
        animated: true,
        style: { stroke: '#4ade80', strokeWidth: 1.5 },
      }));

    return { nodes, edges };
  }, [dependencies]);

  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, , onEdgesChange] = useEdgesState(initialEdges);

  if (!dependencies.length) {
    return (
      <div className={`flex items-center justify-center text-dark-500 ${className}`}>
        <div className="text-center">
          <div className="text-4xl mb-3">🔗</div>
          <p>No dependency data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`rounded-xl overflow-hidden border border-dark-700/50 ${className}`}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        fitView
        minZoom={0.3}
        maxZoom={2}
        attributionPosition="bottom-left"
      >
        <Background color="#1e293b" gap={20} />
        <Controls
          style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '0.75rem' }}
        />
      </ReactFlow>
    </div>
  );
}