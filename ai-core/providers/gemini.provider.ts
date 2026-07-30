// ================================================================
// PTX GEMINI PROVIDER
// Kết nối với Google Gemini API (Free Tier)
// Đây là Provider duy nhất của PTX AI Core.
// ================================================================

export interface GeminiMessage {
  role: 'user' | 'model';
  parts: Array<{ text?: string; inlineData?: { mimeType: string; data: string } }>;
}

export interface GeminiGenerateOptions {
  temperature?: number;
  maxOutputTokens?: number;
  topP?: number;
  topK?: number;
}

export interface GeminiResponse {
  text: string;
  finishReason: string;
  usageMetadata?: {
    promptTokenCount: number;
    candidatesTokenCount: number;
    totalTokenCount: number;
  };
}

export class GeminiProvider {
  private apiKey: string;
  private model: string;
  private baseUrl: string;
  private dailyRequestCount = 0;
  private dailyLimit: number;

  constructor() {
    this.apiKey = process.env.GEMINI_API_KEY ?? '';
    this.model = process.env.GEMINI_MODEL ?? 'gemini-1.5-flash';
    this.dailyLimit = parseInt(process.env.AI_DAILY_REQUEST_LIMIT ?? '500', 10);
    this.baseUrl = `https://generativelanguage.googleapis.com/v1beta/models/${this.model}`;

    if (!this.apiKey) {
      console.warn('[GeminiProvider] ⚠️  GEMINI_API_KEY not set. AI features will be disabled.');
    }
  }

  /**
   * Gọi Gemini API với prompt đơn giản.
   */
  async generate(prompt: string, options: GeminiGenerateOptions = {}): Promise<GeminiResponse> {
    return this.chat([{ role: 'user', parts: [{ text: prompt }] }], options);
  }

  /**
   * Gọi Gemini API với nhiều lượt hội thoại.
   */
  async chat(messages: GeminiMessage[], options: GeminiGenerateOptions = {}): Promise<GeminiResponse> {
    this.guardApiKey();
    this.guardQuota();

    const url = `${this.baseUrl}:generateContent?key=${this.apiKey}`;
    const body = {
      contents: messages,
      generationConfig: {
        temperature: options.temperature ?? parseFloat(process.env.GEMINI_TEMPERATURE ?? '0.7'),
        maxOutputTokens: options.maxOutputTokens ?? parseInt(process.env.GEMINI_MAX_TOKENS ?? '8192', 10),
        topP: options.topP ?? 0.95,
        topK: options.topK ?? 40,
      },
    };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`[GeminiProvider] API Error ${response.status}: ${error}`);
      }

      const data = await response.json() as {
        candidates: Array<{
          content: { parts: Array<{ text: string }> };
          finishReason: string;
        }>;
        usageMetadata?: GeminiResponse['usageMetadata'];
      };

      this.dailyRequestCount++;
      const candidate = data.candidates?.[0];
      const text = candidate?.content?.parts?.map((p: { text: string }) => p.text).join('') ?? '';

      return {
        text,
        finishReason: candidate?.finishReason ?? 'STOP',
        usageMetadata: data.usageMetadata,
      };

    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      throw new Error(`[GeminiProvider] Request failed: ${message}`);
    }
  }

  /**
   * Gọi Gemini Vision API với ảnh base64.
   */
  async analyzeImage(imageBase64: string, mimeType: string, prompt: string): Promise<GeminiResponse> {
    const messages: GeminiMessage[] = [{
      role: 'user',
      parts: [
        { inlineData: { mimeType, data: imageBase64 } },
        { text: prompt },
      ],
    }];
    return this.chat(messages, { temperature: 0.4 });
  }

  private guardApiKey(): void {
    if (!this.apiKey) {
      throw new Error('[GeminiProvider] GEMINI_API_KEY is not configured.');
    }
  }

  private guardQuota(): void {
    if (this.dailyRequestCount >= this.dailyLimit) {
      throw new Error(`[GeminiProvider] Daily quota limit (${this.dailyLimit}) reached.`);
    }
  }

  getStats() {
    return {
      model: this.model,
      dailyRequestCount: this.dailyRequestCount,
      dailyLimit: this.dailyLimit,
      remaining: this.dailyLimit - this.dailyRequestCount,
    };
  }
}

// Singleton
export const geminiProvider = new GeminiProvider();
