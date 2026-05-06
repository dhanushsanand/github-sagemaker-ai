const EXT_MAP = {
  '.js': 'JavaScript', '.jsx': 'React', '.ts': 'TypeScript', '.tsx': 'React+TS',
  '.py': 'Python', '.java': 'Java', '.go': 'Go', '.rs': 'Rust',
  '.css': 'CSS', '.scss': 'SCSS', '.html': 'HTML', '.vue': 'Vue',
  '.json': 'JSON', '.yml': 'YAML', '.yaml': 'YAML', '.md': 'Markdown',
  '.rb': 'Ruby', '.php': 'PHP', '.swift': 'Swift', '.kt': 'Kotlin',
};

const IMPORT_PATTERNS = [
  /import\s+.*?\s+from\s+['"](.+?)['"]/g,
  /require\s*\(\s*['"](.+?)['"]\s*\)/g,
  /from\s+(\S+)\s+import/g,
  /import\s+['"](.+?)['"]/g,
];

export function detectTechStack(files) {
  const extCounts = {};
  files.forEach(f => {
    const ext = '.' + f.path.split('.').pop();
    if (EXT_MAP[ext]) extCounts[EXT_MAP[ext]] = (extCounts[EXT_MAP[ext]] || 0) + 1;
  });
  return Object.entries(extCounts)
    .sort((a, b) => b[1] - a[1])
    .map(([lang]) => lang);
}

export function extractDependencies(filePath, content) {
  const deps = [];
  if (!content) return deps;
  for (const pattern of IMPORT_PATTERNS) {
    const regex = new RegExp(pattern.source, pattern.flags);
    let match;
    while ((match = regex.exec(content)) !== null) {
      deps.push({ from: filePath, to: match[1] });
    }
  }
  return deps;
}

export function buildDependencyGraph(fileContents) {
  const edges = [];
  for (const [filePath, content] of Object.entries(fileContents)) {
    if (content) edges.push(...extractDependencies(filePath, content));
  }
  return edges;
}

export function buildTreeStructure(files) {
  const root = { name: 'root', type: 'directory', children: [] };
  files.forEach(({ path }) => {
    const parts = path.split('/');
    let current = root;
    parts.forEach((part, i) => {
      const isFile = i === parts.length - 1;
      let child = current.children.find(c => c.name === part);
      if (!child) {
        child = { name: part, type: isFile ? 'file' : 'directory', path, children: [] };
        current.children.push(child);
      }
      current = child;
    });
  });
  return root;
}

export function getKeyFiles(files) {
  const priority = ['package.json', 'requirements.txt', 'Cargo.toml', 'go.mod',
    'README.md', 'index.js', 'main.py', 'app.py', 'server.js', 'App.jsx', 'App.tsx'];
  const keyFiles = files.filter(f => priority.some(p => f.path.endsWith(p)));
  const srcFiles = files.filter(f =>
    /\.(js|ts|py|jsx|tsx)$/.test(f.path) && !f.path.includes('node_modules')
  ).slice(0, 10);
  return [...new Set([...keyFiles.map(f => f.path), ...srcFiles.map(f => f.path)])].slice(0, 15);
}