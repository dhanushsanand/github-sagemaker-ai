export function flattenTree(node, prefix = '') {
  const results = [];
  if (!node) return results;
  const children = node.children || [];
  children.sort((a, b) => {
    if (a.type !== b.type) return a.type === 'directory' ? -1 : 1;
    return a.name.localeCompare(b.name);
  });
  children.forEach(child => {
    const fullPath = prefix ? `${prefix}/${child.name}` : child.name;
    results.push({ ...child, fullPath });
    if (child.type === 'directory') {
      results.push(...flattenTree(child, fullPath));
    }
  });
  return results;
}

export function getLanguage(filename) {
  const ext = filename.split('.').pop().toLowerCase();
  const map = {
    js: 'javascript', jsx: 'jsx', ts: 'typescript', tsx: 'tsx',
    py: 'python', java: 'java', go: 'go', rs: 'rust',
    css: 'css', scss: 'scss', html: 'html', json: 'json',
    yml: 'yaml', yaml: 'yaml', md: 'markdown', rb: 'ruby',
    php: 'php', swift: 'swift', kt: 'kotlin', sh: 'bash',
  };
  return map[ext] || 'text';
}

export function truncateText(text, max = 200) {
  if (!text || text.length <= max) return text;
  return text.slice(0, max) + '…';
}