// PTX AI SAFETY – Output Filter
export interface OutputFilterResult {
  safe: boolean;
  reason?: string;
  filtered: string;
}

// Nội dung không được xuất hiện trong output
const BLOCKED_PATTERNS = [
  /api[_\s-]?key\s*[:=]\s*[\w-]{20,}/gi,
  /password\s*[:=]\s*\S+/gi,
  /secret\s*[:=]\s*\S+/gi,
  /eyJ[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+/g, // JWT
  /sk-[a-zA-Z0-9]{40,}/g, // OpenAI key format
  /sb_secret_[\w-]+/g, // Supabase secret
];

// Hallucination guard: các câu tuyên bố sai
const HALLUCINATION_TRIGGERS = [
  /kết quả (cuối cùng|chính thức).*:\s*\d+\s*-\s*\d+/i, // False final scores
];

export function filterOutput(output: string, context?: { validTeams?: string[]; validScores?: string[] }): OutputFilterResult {
  let filtered = output;
  const issues: string[] = [];

  // Remove sensitive data
  for (const pattern of BLOCKED_PATTERNS) {
    if (pattern.test(filtered)) {
      issues.push('Dữ liệu nhạy cảm bị phát hiện');
      filtered = filtered.replace(pattern, '[REDACTED]');
    }
  }

  // Length guard
  if (filtered.length > 10000) {
    filtered = filtered.slice(0, 10000) + '...';
    issues.push('Output quá dài, đã cắt ngắn');
  }

  return {
    safe: issues.length === 0,
    reason: issues.length > 0 ? issues.join('; ') : undefined,
    filtered,
  };
}
