// PTX AI SAFETY LAYER – Barrel Export + Pipeline
export { checkPromptInjection } from './prompt-injection';
export type { InjectionCheckResult } from './prompt-injection';
export { filterOutput } from './output-filter';
export type { OutputFilterResult } from './output-filter';
export { detectSensitiveData, sanitizeForLogging } from './sensitive-data';
export type { SensitiveDataResult } from './sensitive-data';

import { checkPromptInjection } from './prompt-injection';
import { filterOutput } from './output-filter';

export interface SafetyResult {
  inputSafe: boolean;
  outputSafe: boolean;
  sanitizedInput: string;
  filteredOutput: string;
  violations: string[];
}

/** Chạy toàn bộ pipeline an toàn */
export function runSafetyPipeline(input: string, output: string): SafetyResult {
  const violations: string[] = [];

  const inputCheck = checkPromptInjection(input);
  if (!inputCheck.safe && inputCheck.reason) violations.push(`[INPUT] ${inputCheck.reason}`);

  const outputCheck = filterOutput(output);
  if (!outputCheck.safe && outputCheck.reason) violations.push(`[OUTPUT] ${outputCheck.reason}`);

  return {
    inputSafe: inputCheck.safe,
    outputSafe: outputCheck.safe,
    sanitizedInput: inputCheck.sanitized,
    filteredOutput: outputCheck.filtered,
    violations,
  };
}
