// ================================================================
// PTX CONTENT ENGINE
// Sinh nội dung tự động: tin tức, mô tả, SEO, hồ sơ cầu thủ.
// ================================================================

import { geminiProvider } from '../providers/gemini.provider';
import { contextBuilder } from '../context/builder';
import { OrchestratorRequest } from '../orchestrator/orchestrator.types';

export interface ContentPayload {
  action: 'generateNews' | 'generateDescription' | 'generateSEO' | 'generateProfile' | 'generateTags';
  data: Record<string, unknown>;
  previousResults?: Record<string, unknown>;
}

export interface ContentResult {
  action: string;
  content: string | Record<string, unknown>;
  generatedAt: string;
}

export class ContentEngine {
  async handle(request: OrchestratorRequest): Promise<ContentResult> {
    const { action, data, previousResults } = request.payload as ContentPayload;

    // Merge dữ liệu từ các step trước (nếu có)
    const mergedData = { ...data, ...(previousResults ?? {}) };

    console.log(`[ContentEngine] Action: ${action}`);

    switch (action) {
      case 'generateNews':        return this.generateNews(mergedData);
      case 'generateDescription': return this.generateDescription(mergedData);
      case 'generateSEO':         return this.generateSEO(mergedData);
      case 'generateProfile':     return this.generateProfile(mergedData);
      case 'generateTags':        return this.generateTags(mergedData);
      default:
        throw new Error(`[ContentEngine] Unknown action: ${action}`);
    }
  }

  private async generateNews(data: Record<string, unknown>): Promise<ContentResult> {
    const prompt = contextBuilder.buildContentPrompt('news', data);
    const response = await geminiProvider.generate(prompt, { temperature: 0.6, maxOutputTokens: 512 });
    return { action: 'generateNews', content: response.text, generatedAt: new Date().toISOString() };
  }

  private async generateDescription(data: Record<string, unknown>): Promise<ContentResult> {
    const prompt = contextBuilder.buildContentPrompt('description', data);
    const response = await geminiProvider.generate(prompt, { temperature: 0.7, maxOutputTokens: 256 });
    return { action: 'generateDescription', content: response.text, generatedAt: new Date().toISOString() };
  }

  private async generateSEO(data: Record<string, unknown>): Promise<ContentResult> {
    const prompt = contextBuilder.buildContentPrompt('seo', data);
    const response = await geminiProvider.generate(prompt, { temperature: 0.3, maxOutputTokens: 256 });

    // Parse JSON nếu Gemini trả về JSON string
    let parsed: Record<string, unknown>;
    try {
      const jsonMatch = response.text.match(/\{[\s\S]*\}/);
      parsed = jsonMatch ? JSON.parse(jsonMatch[0]) : { raw: response.text };
    } catch {
      parsed = { raw: response.text };
    }

    return { action: 'generateSEO', content: parsed, generatedAt: new Date().toISOString() };
  }

  private async generateProfile(data: Record<string, unknown>): Promise<ContentResult> {
    const prompt = contextBuilder.buildContentPrompt('profile', data);
    const response = await geminiProvider.generate(prompt, { temperature: 0.6, maxOutputTokens: 384 });
    return { action: 'generateProfile', content: response.text, generatedAt: new Date().toISOString() };
  }

  private async generateTags(data: Record<string, unknown>): Promise<ContentResult> {
    const prompt = `Tạo danh sách 5-8 tags phù hợp cho nội dung sau (trả về JSON array, bằng tiếng Việt):
${JSON.stringify(data, null, 2)}
Format: ["tag1", "tag2", ...]`;
    const response = await geminiProvider.generate(prompt, { temperature: 0.4, maxOutputTokens: 128 });

    let tags: string[] = [];
    try {
      const jsonMatch = response.text.match(/\[[\s\S]*\]/);
      tags = jsonMatch ? JSON.parse(jsonMatch[0]) : [];
    } catch {
      tags = response.text.split(',').map(t => t.trim().replace(/["\[\]]/g, ''));
    }

    return { action: 'generateTags', content: { tags }, generatedAt: new Date().toISOString() };
  }
}
