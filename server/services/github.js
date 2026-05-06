import axios from 'axios';

const gh = axios.create({
  baseURL: 'https://api.github.com',
  headers: {
    Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
    Accept: 'application/vnd.github.v3+json',
  },
});

export function parseRepoUrl(url) {
  const match = url.match(/github\.com\/([^/]+)\/([^/]+)/);
  if (!match) throw new Error('Invalid GitHub URL');
  return { owner: match[1], name: match[2].replace(/\.git$/, '') };
}

export async function fetchRepoTree(owner, name) {
  const { data: ref } = await gh.get(`/repos/${owner}/${name}/git/ref/heads/main`)
    .catch(() => gh.get(`/repos/${owner}/${name}/git/ref/heads/master`));

  const sha = ref.object.sha;
  const { data } = await gh.get(`/repos/${owner}/${name}/git/trees/${sha}?recursive=1`);

  return data.tree
    .filter(item => item.type === 'blob' && item.size < 100000)
    .map(item => ({ path: item.path, size: item.size, sha: item.sha }));
}

export async function fetchFileContent(owner, name, path) {
  const { data } = await gh.get(`/repos/${owner}/${name}/contents/${path}`);
  return Buffer.from(data.content, 'base64').toString('utf-8');
}

export async function fetchMultipleFiles(owner, name, paths, limit = 20) {
  const selected = paths.slice(0, limit);
  const results = {};
  await Promise.allSettled(
    selected.map(async (p) => {
      try {
        results[p] = await fetchFileContent(owner, name, p);
      } catch { results[p] = null; }
    })
  );
  return results;
}