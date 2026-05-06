import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import FileTree from '../components/FileTree';
import CodeViewer from '../components/CodeViewer';
import GraphView from '../components/GraphView';
import { explainCode } from '../utils/api';

const tabs = [
  { id: 'overview', label: '📊 Overview' },
  { id: 'graph', label: '🔗 Dependencies' },
  { id: 'file', label: '📄 File View' },
];

export default function Dashboard() {
  const location = useLocation();
  const navigate = useNavigate();
  const data = location.state;

  const [activeTab, setActiveTab] = useState('overview');
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileExplain, setFileExplain] = useState('');
  const [explaining, setExplaining] = useState(false);

  if (!data) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="text-center card max-w-md">
          <div className="text-5xl mb-4">📊</div>
          <h2 className="text-xl font-bold text-dark-100 mb-2">No Repo Loaded</h2>
          <p className="text-dark-400 mb-6">Analyze a GitHub repository from the home page first.</p>
          <button onClick={() => navigate('/')} className="btn-primary">Go to Home</button>
        </div>
      </div>
    );
  }

  const { structure, techStack, dependencies, analysis, fileContents, repoUrl } = data;

  const handleFileSelect = async (node) => {
    setSelectedFile(node);
    setActiveTab('file');
    if (!fileContents?.[node.path]) {
      setExplaining(true);
      try {
        const { data: res } = await explainCode(repoUrl, node.path);
        setFileExplain(res.explanation);
      } catch { setFileExplain('Could not load file explanation.'); }
      finally { setExplaining(false); }
    }
  };

  return (
    <div className="min-h-screen pt-20">
      <div className="max-w-[1600px] mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-dark-100">Repository Dashboard</h1>
            <p className="text-sm text-dark-400 mt-1 font-mono">{repoUrl}</p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {(techStack || []).slice(0, 6).map(t => (
              <span key={t} className="px-3 py-1 bg-sage-500/10 text-sage-400 text-xs font-medium rounded-full border border-sage-500/20">
                {t}
              </span>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-4">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-sage-500/10 text-sage-400 border border-sage-500/20'
                  : 'text-dark-400 hover:text-dark-200 bg-dark-800/50 border border-dark-700/50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="grid grid-cols-12 gap-4" style={{ minHeight: '70vh' }}>
          {/* File Tree Sidebar */}
          <div className="col-span-3 glass-sm overflow-hidden flex flex-col">
            <div className="px-4 py-3 border-b border-dark-700/50">
              <h3 className="text-sm font-semibold text-dark-300">📁 Files</h3>
            </div>
            <FileTree tree={structure} onSelect={handleFileSelect} className="flex-1" />
          </div>

          {/* Main Panel */}
          <div className="col-span-9">
            {activeTab === 'overview' && (
              <div className="glass-sm p-6 h-full">
                <h2 className="text-lg font-bold text-dark-100 mb-4">🧠 AI Analysis</h2>
                {analysis ? (
                  <div className="prose prose-invert max-w-none text-sm text-dark-300 leading-relaxed whitespace-pre-wrap">
                    {analysis}
                  </div>
                ) : (
                  <p className="text-dark-500">No analysis available. Make sure OpenAI API key is configured.</p>
                )}
              </div>
            )}

            {activeTab === 'graph' && (
              <GraphView dependencies={dependencies || []} className="h-[70vh]" />
            )}

            {activeTab === 'file' && (
              <div className="flex flex-col gap-4">
                <div className="glass-sm overflow-hidden flex-1">
                  <CodeViewer
                    code={selectedFile ? (fileContents?.[selectedFile.path] || 'File content not fetched. Only key files are loaded.') : null}
                    filename={selectedFile?.path}
                    className="h-[50vh]"
                  />
                </div>
                {selectedFile && (
                  <div className="glass-sm p-4">
                    <h3 className="text-sm font-semibold text-dark-300 mb-2">💡 Explanation</h3>
                    {explaining ? (
                      <div className="flex items-center gap-2 text-sage-400 text-sm">
                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                        Analyzing file...
                      </div>
                    ) : (
                      <p className="text-sm text-dark-400 whitespace-pre-wrap">{fileExplain || 'Select a file on the left to see AI-generated explanation.'}</p>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
