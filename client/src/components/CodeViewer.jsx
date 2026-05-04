import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { getLanguage } from '../utils/helpers';

export default function CodeViewer({ code, filename, className = '' }) {
  if (!code) return (
    <div className={`flex items-center justify-center text-dark-500 p-8 ${className}`}>
      Select a file to view its content
    </div>
  );

  return (
    <div className={`flex flex-col ${className}`}>
      {filename && (
        <div className="flex items-center gap-2 px-4 py-2 bg-dark-800 border-b border-dark-700 rounded-t-xl">
          <span className="text-xs">📄</span>
          <span className="text-sm font-mono text-sage-400">{filename}</span>
        </div>
      )}
      <div className="overflow-auto flex-1 rounded-b-xl">
        <SyntaxHighlighter
          language={getLanguage(filename || 'text')}
          style={oneDark}
          showLineNumbers
          customStyle={{
            margin: 0,
            borderRadius: filename ? '0 0 0.75rem 0.75rem' : '0.75rem',
            background: '#0f172a',
            fontSize: '0.8rem',
          }}
          lineNumberStyle={{ color: '#334155', fontSize: '0.75rem' }}
        >
          {code}
        </SyntaxHighlighter>
      </div>
    </div>
  );
}