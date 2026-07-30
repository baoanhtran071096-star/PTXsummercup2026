// PTX CHAT ENGINE v2 – Full Architecture
// Chat → Safety → Context → Tools → Gemini → Business Services → Supabase
import { runSafetyPipeline } from '../safety/index';
import { toolRegistry } from '../tools/registry';
import { tournamentService } from '../../backend/capabilities/tournament.service';
import { readFileSync, existsSync } from 'fs';
import { resolve } from 'path';

// Load environment
try {
  const envPath = resolve(process.cwd(), '.env');
  if (existsSync(envPath)) {
    const envFile = readFileSync(envPath, 'utf8');
    for (const line of envFile.split('\n')) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const [key, ...vals] = trimmed.split('=');
      if (key && vals.length) process.env[key.trim()] = vals.join('=').trim();
    }
  }
} catch { /* ignore */ }

const GEMINI_KEY = process.env.GEMINI_API_KEY || process.env.GOOGLE_AI_API_KEY || '';
const GEMINI_MODEL = 'gemini-1.5-flash';
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_KEY}`;

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface ChatResponse {
  answer: string;
  sources: string[];
  latency: number;
  toolsUsed: string[];
  safe: boolean;
  violations?: string[];
}

/** Load prompt template */
function loadPrompt(version = 'v1'): string {
  const paths = [
    resolve(process.cwd(), `ai-core/prompts/chat/${version}.md`),
    resolve(process.cwd(), `ai-core/prompts/chat/v1.md`),
  ];
  for (const p of paths) {
    if (existsSync(p)) return readFileSync(p, 'utf8');
  }
  return `
Ban la tro ly AI chinh thuc cua PTX Summer Cup 2026.
Context: {context}
Cau hoi: {question}
Quy tac: Chi tra loi ve thong tin giai dau. Neu khong co du lieu, noi ro khong co thong tin.
`.trim();
}

/** Build AI context from Business Capability Layer */
async function buildContext(question: string): Promise<{ context: string; toolsUsed: string[] }> {
  const q = question.toLowerCase();
  const toolsUsed: string[] = [];
  const parts: string[] = [];

  // Tournament overview always included
  const context = await tournamentService.getContextForAI();
  parts.push(context);
  toolsUsed.push('tournament.context');

  // Route to specific tools based on question keywords
  if (q.includes('lịch') || q.includes('trận') || q.includes('match') || q.includes('schedule')) {
    const result = await toolRegistry.execute('schedule', { type: 'upcoming', limit: 5 });
    parts.push(`[LỊCH THI ĐẤU TỬC ĐÂY] ${JSON.stringify(result)}`);
    toolsUsed.push('schedule');
  }
  if (q.includes('bxh') || q.includes('xếp hạng') || q.includes('bảng') || q.includes('standing') || q.includes('điểm')) {
    const result = await toolRegistry.execute('standings', { format: 'text' });
    parts.push(`[BẢNG XẾP HẠNG] ${JSON.stringify(result)}`);
    toolsUsed.push('standings');
  }
  if (q.includes('cầu thủ') || q.includes('player') || q.includes('bàn') || q.includes('ghi') || q.includes('vừa')) {
    const result = await toolRegistry.execute('players', { query: 'top_scorers', limit: 5 });
    parts.push(`[CẦU THỦ] ${JSON.stringify(result)}`);
    toolsUsed.push('players');
  }
  if (q.includes('tin') || q.includes('news') || q.includes('bài viết')) {
    const result = await toolRegistry.execute('news', { limit: 3 });
    parts.push(`[TIN TỨC] ${JSON.stringify(result)}`);
    toolsUsed.push('news');
  }

  return { context: parts.join('\n\n'), toolsUsed };
}

/** Call Gemini API */
async function callGemini(prompt: string): Promise<string> {
  if (!GEMINI_KEY) {
    return 'Xin chào! Hệ thống AI đang được cấu hình. Vui lòng liên hệ Ban Tổ Chức để biết thêm thông tin.';
  }
  const res = await fetch(GEMINI_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.3, maxOutputTokens: 1024 },
      safetySettings: [
        { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
        { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
      ],
    }),
  });
  if (!res.ok) throw new Error(`Gemini API error: ${res.status}`);
  const data = await res.json() as { candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }> };
  return data.candidates?.[0]?.content?.parts?.[0]?.text ?? 'Không có phản hồi từ AI.';
}

export class ChatEngine {
  private history: ChatMessage[] = [];

  async chat(question: string): Promise<ChatResponse> {
    const start = Date.now();

    // Step 1: Input Safety
    const inputSafety = runSafetyPipeline(question, '');
    if (!inputSafety.inputSafe) {
      return {
        answer: 'Câu hỏi của bạn vi phạm chính sách an toàn. Vui lòng thử lại.',
        sources: [],
        latency: Date.now() - start,
        toolsUsed: [],
        safe: false,
        violations: inputSafety.violations,
      };
    }

    // Step 2: Build Context from Business Capability Layer
    const { context, toolsUsed } = await buildContext(inputSafety.sanitizedInput);

    // Step 3: Build Prompt from versioned template
    const promptTemplate = loadPrompt('v1');
    const prompt = promptTemplate
      .replace('{context}', context)
      .replace('{question}', inputSafety.sanitizedInput);

    // Step 4: Call Gemini
    let answer: string;
    try {
      answer = await callGemini(prompt);
    } catch (err) {
      answer = 'Xin lỗi, hệ thống AI tạm thời không phản hồi. Vui lòng thử lại sau.';
      console.error('[ChatEngine] Gemini error:', err);
    }

    // Step 5: Output Safety
    const outputSafety = runSafetyPipeline('', answer);

    // Step 6: Store history
    this.history.push({ role: 'user', content: question, timestamp: new Date().toISOString() });
    this.history.push({ role: 'assistant', content: outputSafety.filteredOutput, timestamp: new Date().toISOString() });

    return {
      answer: outputSafety.filteredOutput,
      sources: toolsUsed,
      latency: Date.now() - start,
      toolsUsed,
      safe: outputSafety.outputSafe,
      violations: outputSafety.violations.length > 0 ? outputSafety.violations : undefined,
    };
  }

  getHistory(): ChatMessage[] { return [...this.history]; }
  clearHistory(): void { this.history = []; }
}

export const chatEngine = new ChatEngine();
