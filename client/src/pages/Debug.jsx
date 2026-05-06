import { useState } from 'react';
import { debugCode } from '../utils/api';

export default function Debug() {
  const [errorMsg, setErrorMsg] = useState('');
  const [code, setCode] = useState('');
  const [repoUrl, setRepoUrl] = useState('');
  const [filePath, setFilePath] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const handleDebug = async () => {
    if (!errorMsg.trim()) return;
    setLoading(true);
    setResult('');
    try {
      const { data } = await debugCode({ error: errorMsg, code, repoUrl: repoUrl || undefined, filePath: filePath || undefined });
      setResult(data.result);
    } catch (err) {
      setResult('Error: ' + (err.response?.data?.error || 'Failed to debug'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="max-w-5xl mx-auto px-4">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-red-500/10 border border-red-500/20 rounded-full text-red-400 text-sm font-medium mb-4">
            🐛 Debug Navigator
          </div>
          <h1 className="text-3xl font-bold text-dark-100">AI-Powered Debugging</h1>
          <p className="text-dark-400 mt-2">Paste your error message and code context for AI analysis</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input */}
          <div className="space-y-4">
            <div className="card">
              <label className="block text-sm font-medium text-dark-300 mb-2">Error Message *</label>
              <textarea
                id="error-input"
                value={errorMsg}
                onChange={(e) => setErrorMsg(e.target.value)}
                placeholder="Paste your error here..."
                rows={5}
                className="input-field font-mono text-sm resize-none"
              />
            </div>
            <div className="card">
              <label className="block text-sm font-medium text-dark-300 mb-2">Code Context (optional)</label>
              <textarea
                id="code-context-input"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Paste the relevant code..."
                rows={8}
                className="input-field font-mono text-sm resize-none"
              />
            </div>
            <div className="card">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-dark-400 mb-1">GitHub Repo URL (optional)</label>
                  <input
                    type="url"
                    value={repoUrl}
                    onChange={(e) => setRepoUrl(e.target.value)}
                    placeholder="https://github.com/..."
                    className="input-field text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-dark-400 mb-1">File Path (optional)</label>
                  <input
                    type="text"
                    value={filePath}
                    onChange={(e) => setFilePath(e.target.value)}
                    placeholder="src/index.js"
                    className="input-field text-sm"
                  />
                </div>
              </div>
            </div>
            <button
              id="debug-btn"
              onClick={handleDebug}
              disabled={loading || !errorMsg.trim()}
              className="btn-primary w-full flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                  Debugging...
                </>
              ) : (
                <>🐛 Debug Error</>
              )}
            </button>
          </div>

          {/* Output */}
          <div className="card h-fit sticky top-24">
            <h3 className="text-sm font-semibold text-dark-300 mb-4 flex items-center gap-2">
              <span>💡</span> AI Suggestions
            </h3>
            {result ? (
              <div className="prose prose-invert max-w-none text-sm text-dark-300 whitespace-pre-wrap leading-relaxed">
                {result}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-dark-500">
                <div className="text-5xl mb-4">🔍</div>
                <p className="text-sm">Enter an error message and click Debug</p>
                <p className="text-xs mt-1">AI will analyze and suggest fixes</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}