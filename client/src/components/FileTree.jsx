import { useState } from 'react';

function TreeNode({ node, depth = 0, onSelect }) {
  const [open, setOpen] = useState(depth < 2);
  const isDir = node.type === 'directory';
  const children = node.children || [];

  return (
    <div>
      <button
        onClick={() => {
          if (isDir) setOpen(!open);
          else onSelect?.(node);
        }}
        className={`w-full text-left flex items-center gap-2 py-1.5 px-2 rounded-lg text-sm transition-all duration-200 hover:bg-dark-700/50 group ${
          !isDir ? 'cursor-pointer hover:text-sage-400' : ''
        }`}
        style={{ paddingLeft: `${depth * 16 + 8}px` }}
      >
        <span className="text-xs flex-shrink-0 w-4">
          {isDir ? (open ? '📂' : '📁') : '📄'}
        </span>
        <span className={`truncate ${isDir ? 'text-dark-300 font-medium' : 'text-dark-400 group-hover:text-sage-400'}`}>
          {node.name}
        </span>
        {isDir && (
          <span className="ml-auto text-[10px] text-dark-600">
            {children.length}
          </span>
        )}
      </button>
      {isDir && open && children.map((child, i) => (
        <TreeNode key={`${child.name}-${i}`} node={child} depth={depth + 1} onSelect={onSelect} />
      ))}
    </div>
  );
}

export default function FileTree({ tree, onSelect, className = '' }) {
  if (!tree) return null;
  return (
    <div className={`overflow-y-auto font-mono ${className}`}>
      <div className="p-2">
        {(tree.children || []).map((child, i) => (
          <TreeNode key={`${child.name}-${i}`} node={child} onSelect={onSelect} />
        ))}
      </div>
    </div>
  );
}