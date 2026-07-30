// PTX AI SAFETY – Sensitive Data Detector
export interface SensitiveDataResult {
  hasSensitiveData: boolean;
  fields: string[];
  sanitized: Record<string, unknown>;
}

const SENSITIVE_KEYS = [
  'password', 'secret', 'api_key', 'apikey', 'token',
  'service_role', 'private_key', 'auth', 'credentials',
];

export function detectSensitiveData(data: Record<string, unknown>): SensitiveDataResult {
  const sensitiveFields: string[] = [];
  const sanitized = { ...data };

  for (const key of Object.keys(data)) {
    if (SENSITIVE_KEYS.some(s => key.toLowerCase().includes(s))) {
      sensitiveFields.push(key);
      sanitized[key] = '[REDACTED]';
    }
  }

  return {
    hasSensitiveData: sensitiveFields.length > 0,
    fields: sensitiveFields,
    sanitized,
  };
}

export function sanitizeForLogging(data: unknown): unknown {
  if (typeof data === 'string') {
    return data
      .replace(/eyJ[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+/g, '[JWT]')
      .replace(/sb_secret_[\w-]+/g, '[SUPABASE_SECRET]')
      .replace(/sb_publishable_[\w-]+/g, '[SUPABASE_KEY]');
  }
  if (typeof data === 'object' && data !== null) {
    return detectSensitiveData(data as Record<string, unknown>).sanitized;
  }
  return data;
}
