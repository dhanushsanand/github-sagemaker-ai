import { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import CodeViewer from '../components/CodeViewer';
import { chatFile, explainCode } from '../utils/api';

export default function FileChat() {
  const location = useLocation();
  const passedData = location.state || {};

  const [repoUrl, setRepoUrl] = useState(passedData.repoUrl || '');
  const [filePath, setFilePath] = useState('');
  const [fileContent, setFileContent] = useState('');
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingFile, setLoadingFile] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const loadFile = async () => {
    if (!repoUrl || !filePath) return;
    setLoadingFile(true);
    try {
      const { data } = await explainCode(repoUrl, filePath);
      setFileContent(data.content);
      setMessages([]);
    } catch {
      setFileContent('Failed to load file.');
    } finally {
      setLoadingFile(false);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || !repoUrl || !filePath) return;
    const msg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: msg }]);
    setLoading(true);
    try {
      const { data } = await chatFile(repoUrl, filePath, msg);
      setMessages(prev => [...prev, { role: 'assistant', content: data.response }]);
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Error: Failed to get response.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-20">
      <div className="max-w-[1400px] mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-dark-100 mb-1">💬 File-Level Chat</h1>
          <p className="text-sm text-dark-400">Select a file and ask questions about it</p>
        </div>

        {/* File Selector */}
        <div className="glass-sm p-4 mb-4">
          <div className="flex gap-3 items-end">
            <div className="flex-1">
              <label className="block text-xs font-medium text-dark-400 mb-1">GitHub Repo URL</label>
              <input
                id="chat-repo-url"
                type="url"
                value={repoUrl}
                onChange={(e) => setRepoUrl(e.target.value)}
                placeholder="https://github.com/username/repo"
                className="input-field text-sm"
              />
            </div>
            <div className="flex-1">
              <label className="block text-xs font-medium text-dark-400 mb-1">File Path</label>
              <input
                id="chat-file-path"
                type="text"
                value={filePath}
                onChange={(e) => setFilePath(e.target.value)}
                placeholder="src/index.js"
                className="input-field text-sm"
                onKeyDown={(e) => e.key === 'Enter' && loadFile()}
              />
            </div>
            <button
              id="load-file-btn"
              onClick={loadFile}
              disabled={loadingFile || !repoUrl || !filePath}
              className="btn-secondary flex items-center gap-2"
            >
              {loadingFile ? (
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
              ) : '📄'} Load
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4" style={{ minHeight: '65vh' }}>
          {/* Code View */}
          <div className="glass-sm overflow-hidden">
            <CodeViewer code={fileContent} filename={filePath} className="h-full min-h-[60vh]" />
          </div>

          {/* Chat */}
          <div className="glass-sm flex flex-col overflow-hidden">
            <div className="px-4 py-3 border-b border-dark-700/50 flex items-center gap-2">
              <span>💬</span>
              <h3 className="text-sm font-semibold text-dark-300">Chat</h3>
              {filePath && <span className="text-xs font-mono text-sage-400 ml-auto">{filePath}</span>}
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-[40vh]">
              {messages.length === 0 && (
                <div className="flex flex-col items-center justify-center h-full text-dark-500 py-12">
                  <div className="text-4xl mb-3">🤖</div>
                  <p className="text-sm">Load a file and ask questions about it</p>
                </div>
              )}
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm whitespace-pre-wrap ${
                    msg.role === 'user'
                      ? 'bg-sage-500/20 text-sage-100 rounded-tr-sm'
                      : 'bg-dark-800 text-dark-300 rounded-tl-sm border border-dark-700/50'
                  }`}>
                    {msg.content}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-dark-800 text-dark-400 px-4 py-3 rounded-2xl rounded-tl-sm text-sm border border-dark-700/50">
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1">
                        <span className="w-2 h-2 bg-sage-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <span className="w-2 h-2 bg-sage-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <span className="w-2 h-2 bg-sage-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                      Thinking...
                    </div>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Input */}
            <div className="p-3 border-t border-dark-700/50">
              <div className="flex gap-2">
                <input
                  id="chat-message-input"
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={fileContent ? 'Ask about this file...' : 'Load a file first...'}
                  className="input-field text-sm flex-1"
                  disabled={!fileContent}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                />
                <button
                  id="send-msg-btn"
                  onClick={handleSend}
                  disabled={loading || !input.trim() || !fileContent}
                  className="btn-primary px-4"
                >
                  ➤
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}