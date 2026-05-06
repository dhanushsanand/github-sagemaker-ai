import Repo from '../models/Repo.js';
import ChatHistory from '../models/ChatHistory.js';
import { dbConnected } from '../index.js';
import { parseRepoUrl, fetchRepoTree, fetchMultipleFiles, fetchFileContent } from '../services/github.js';
import { detectTechStack, buildDependencyGraph, buildTreeStructure, getKeyFiles } from '../services/parser.js';
import { explainRepo, debugCode, chatAboutFile } from '../services/openai.js';
import { truncate } from '../utils/chunker.js';

async function dbFind(model, query) {
  if (!dbConnected) return null;
  try { return await model.findOne(query); } catch { return null; }
}

async function dbSave(model, query, data) {
  if (!dbConnected) return;
  try { await model.findOneAndUpdate(query, data, { upsert: true }); } catch (e) { console.error('DB save failed:', e.message); }
}

export async function analyzeRepo(req, res) {
  try {
    const { repoUrl } = req.body;
    if (!repoUrl) return res.status(400).json({ error: 'repoUrl is required' });

    const cached = await dbFind(Repo, { repoUrl });
    if (cached && cached.structure) {
      return res.json({
        structure: cached.structure,
        techStack: cached.techStack,
        dependencies: cached.dependencies,
        analysis: cached.analysis,
        fileContents: cached.fileContents,
      });
    }

    const { owner, name } = parseRepoUrl(repoUrl);
    const files = await fetchRepoTree(owner, name);
    const structure = buildTreeStructure(files);
    const techStack = detectTechStack(files);
    const keyFilePaths = getKeyFiles(files);
    const fileContents = await fetchMultipleFiles(owner, name, keyFilePaths);
    const dependencies = buildDependencyGraph(fileContents);

    const snippets = Object.entries(fileContents)
      .filter(([, v]) => v)
      .map(([k, v]) => `--- ${k} ---\n${truncate(v, 1500)}`)
      .join('\n\n');

    let analysis = null;
    try {
      analysis = await explainRepo(files, snippets);
    } catch (err) {
      console.error('OpenAI analysis failed:', err.message);
    }

    await dbSave(Repo, { repoUrl }, { repoUrl, owner, name, structure, techStack, dependencies, analysis, fileContents });

    res.json({ structure, techStack, dependencies, analysis, fileContents });
  } catch (err) {
    console.error('analyzeRepo error:', err.message);
    res.status(500).json({ error: err.message });
  }
}

export async function explainCode(req, res) {
  try {
    const { repoUrl, filePath } = req.body;
    if (!repoUrl || !filePath) return res.status(400).json({ error: 'repoUrl and filePath are required' });

    const { owner, name } = parseRepoUrl(repoUrl);
    const content = await fetchFileContent(owner, name, filePath);
    const explanation = await explainRepo(
      [{ path: filePath }],
      `--- ${filePath} ---\n${truncate(content, 3000)}`
    );
    res.json({ explanation, content });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function debug(req, res) {
  try {
    const { error: errorMsg, code, repoUrl, filePath } = req.body;
    if (!errorMsg) return res.status(400).json({ error: 'error message is required' });

    let codeContext = code || '';
    if (repoUrl && filePath && !code) {
      const { owner, name } = parseRepoUrl(repoUrl);
      codeContext = await fetchFileContent(owner, name, filePath);
    }

    const result = await debugCode(errorMsg, truncate(codeContext, 3000));
    res.json({ result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function chatFile(req, res) {
  try {
    const { repoUrl, filePath, message } = req.body;
    if (!repoUrl || !filePath || !message) {
      return res.status(400).json({ error: 'repoUrl, filePath, and message are required' });
    }

    const { owner, name } = parseRepoUrl(repoUrl);
    const content = await fetchFileContent(owner, name, filePath);

    let history = await dbFind(ChatHistory, { repoUrl, filePath });
    const messages = history?.messages || [];

    messages.push({ role: 'user', content: message });
    const response = await chatAboutFile(content, messages);
    messages.push({ role: 'assistant', content: response });

    const trimmed = messages.length > 20 ? messages.slice(-20) : messages;
    await dbSave(ChatHistory, { repoUrl, filePath }, { repoUrl, filePath, messages: trimmed });

    res.json({ response, history: trimmed });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}