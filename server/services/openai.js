import OpenAI from 'openai';
import { PROMPTS } from '../utils/prompts.js';
import { chunkText } from '../utils/chunker.js';

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function complete(systemPrompt, userContent, maxTokens = 1000) {
  const res = await client.chat.completions.create({
    model: 'gpt-3.5-turbo',
    max_tokens: maxTokens,
    temperature: 0.3,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userContent },
    ],
  });
  return res.choices[0].message.content;
}

export async function explainRepo(structure, fileSnippets) {
  const input = `Files:\n${structure.map(f => f.path).join('\n')}\n\nKey file contents:\n${fileSnippets}`;
  const chunks = chunkText(input, 3000);
  if (chunks.length === 1) {
    return complete(PROMPTS.EXPLAIN_REPO, chunks[0], 1200);
  }
  const partials = await Promise.all(
    chunks.map(c => complete(PROMPTS.EXPLAIN_REPO, c, 600))
  );
  return complete(PROMPTS.MERGE_ANALYSIS, partials.join('\n---\n'), 1200);
}

export async function debugCode(errorMessage, codeContext) {
  const input = `Error:\n${errorMessage}\n\nCode:\n${codeContext}`;
  return complete(PROMPTS.DEBUG, input, 800);
}

export async function chatAboutFile(fileContent, messages) {
  const systemPrompt = `${PROMPTS.FILE_CHAT}\n\nFile content:\n${chunkText(fileContent, 2500)[0]}`;
  const res = await client.chat.completions.create({
    model: 'gpt-3.5-turbo',
    max_tokens: 600,
    temperature: 0.3,
    messages: [
      { role: 'system', content: systemPrompt },
      ...messages.slice(-6),
    ],
  });
  return res.choices[0].message.content;
}