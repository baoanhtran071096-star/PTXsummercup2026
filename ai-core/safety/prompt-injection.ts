// PTX AI SAFETY – Prompt Injection Guard
export interface InjectionCheckResult {
  safe: boolean;
  reason?: string;
  sanitized: string;
}

const INJECTION_PATTERNS = [
  /ignore (all |previous |above )?instructions?/i,
  /you are now/i,
  /forget (everything|all|your|who)/i,
  /act as (a |an )?/i,
  /system:\s*you/i,
  /\[INST\]/i,
  /<\|im_start\|>/i,
  /###\s*instruction/i,
  /pretend (you are|to be)/i,
  /jailbreak/i,
  /DAN\s+mode/i,
];

const MAX_PROMPT_LENGTH = 2000;

export function checkPromptInjection(input: string): InjectionCheckResult {
  if (!input || input.trim().length === 0) {
    return { safe: true, sanitized: '' };
  }

  // Length check
  if (input.length > MAX_PROMPT_LENGTH) {
    return {
      safe: false,
      reason: `Prompt quá dài (${input.length} > ${MAX_PROMPT_LENGTH} ký tự)`,
      sanitized: input.slice(0, MAX_PROMPT_LENGTH),
    };
  }

  // Pattern check
  for (const pattern of INJECTION_PATTERNS) {
    if (pattern.test(input)) {
      return {
        safe: false,
        reason: `Phát hiện Prompt Injection: ${pattern}`,
        sanitized: input.replace(pattern, '[BLOCKED]'),
      };
    }
  }

  return { safe: true, sanitized: input.trim() };
}
