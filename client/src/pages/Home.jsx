import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { analyzeRepo } from '../utils/api';

const features = [
  { icon: '🔍', title: 'Repo Analysis', desc: 'Parse structure, dependencies, and tech stack from any GitHub repo.' },
  { icon: '🧠', title: 'AI Explanation', desc: 'Get architecture summaries and module breakdowns powered by GPT.' },
  { icon: '🐛', title: 'Debug Navigator', desc: 'Paste an error, get root cause analysis and fix suggestions.' },
  { icon: '💬', title: 'File-Level Chat', desc: 'Ask context-aware questions about any file in the codebase.' },
  { icon: '🔗', title: 'Dependency Graph', desc: 'Visualize how files and modules connect to each other.' },
  { icon: '⚡', title: 'Token Optimized', desc: 'Smart chunking and caching minimize API costs.' },
];

export default function Home() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleAnalyze = async () => {
    if (!url.includes('github.com')) {
      setError('Please enter a valid GitHub repository URL');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const { data } = await analyzeRepo(url);
      navigate('/dashboard', { state: { repoUrl: url, ...data } });
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to analyze repository');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-20">
      {/* Hero */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-sage-500/5 via-transparent to-transparent" />
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-sage-500/5 rounded-full blur-3xl" />
        <div className="relative max-w-4xl mx-auto px-4 pt-16 pb-20 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-sage-500/10 border border-sage-500/20 rounded-full text-sage-400 text-sm font-medium mb-8 animate-float">
            <span>⚡</span> AI-Powered Code Intelligence
          </div>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold mb-6 leading-tight">
            Understand Any<br />
            <span className="gradient-text">Codebase Instantly</span>
          </h1>
          <p className="text-lg sm:text-xl text-dark-400 max-w-2xl mx-auto mb-10">
            Analyze GitHub repositories, get AI explanations of architecture and modules,
            debug errors, and chat with your code — all in one place.
          </p>

          {/* Input */}
          <div className="max-w-2xl mx-auto">
            <div className="glass p-2 flex gap-2">
              <input
                id="repo-url-input"
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://github.com/username/repository"
                className="input-field flex-1 bg-dark-900/50 border-0 focus:ring-sage-500/30"
                onKeyDown={(e) => e.key === 'Enter' && handleAnalyze()}
              />
              <button
                id="analyze-btn"
                onClick={handleAnalyze}
                disabled={loading || !url}
                className="btn-primary whitespace-nowrap flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Analyzing...
                  </>
                ) : (
                  <>🔍 Analyze Repo</>
                )}
              </button>
            </div>
            {error && (
              <p className="mt-3 text-red-400 text-sm bg-red-400/10 px-4 py-2 rounded-xl border border-red-400/20">
                {error}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="max-w-6xl mx-auto px-4 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((f) => (
            <div key={f.title} className="card group cursor-default">
              <div className="text-3xl mb-4 group-hover:scale-110 transition-transform duration-300">{f.icon}</div>
              <h3 className="text-lg font-semibold text-dark-100 mb-2">{f.title}</h3>
              <p className="text-sm text-dark-400">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-dark-800 py-8">
        <div className="text-center text-dark-600 text-sm">
          Built with React, Express, MongoDB, and OpenAI • Github SageMaker AI
        </div>
      </footer>
    </div>
  );
}