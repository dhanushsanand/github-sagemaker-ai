import { NavLink } from 'react-router-dom';

const links = [
  { to: '/', label: 'Home', icon: '🏠' },
  { to: '/dashboard', label: 'Dashboard', icon: '📊' },
  { to: '/debug', label: 'Debug', icon: '🐛' },
  { to: '/chat', label: 'File Chat', icon: '💬' },
];

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-t-0 border-x-0 rounded-none border-b border-dark-700/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <NavLink to="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 bg-gradient-to-br from-sage-400 to-emerald-500 rounded-xl flex items-center justify-center text-dark-950 font-bold text-lg shadow-lg shadow-sage-500/20 group-hover:shadow-sage-500/40 transition-all">
              ⚡
            </div>
            <span className="text-xl font-bold gradient-text">CodeSage</span>
            <span className="text-xs font-medium text-sage-500 bg-sage-500/10 px-2 py-0.5 rounded-full">AI</span>
          </NavLink>
          <div className="flex items-center gap-1">
            {links.map(({ to, label, icon }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
                    isActive
                      ? 'bg-sage-500/10 text-sage-400 border border-sage-500/20'
                      : 'text-dark-400 hover:text-dark-200 hover:bg-dark-800'
                  }`
                }
              >
                <span>{icon}</span>
                <span className="hidden sm:inline">{label}</span>
              </NavLink>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}