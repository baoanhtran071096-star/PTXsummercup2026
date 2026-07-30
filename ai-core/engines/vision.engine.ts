// ================================================================
// PTX VISION ENGINE
// Phân tích ảnh: avatar cầu thủ, ảnh gallery, action shots.
// Dùng Gemini Vision API (multimodal).
// ================================================================

import { geminiProvider } from '../providers/gemini.provider';
import { OrchestratorRequest } from '../orchestrator/orchestrator.types';

export interface VisionPayload {
  action: 'analyze' | 'analyzeAvatar' | 'tag' | 'ocr';
  imageBase64?: string;
  imageUrl?: string;
  mimeType?: string;
  previousResults?: Record<string, unknown>;
}

export interface VisionResult {
  action: string;
  description?: string;
  tags?: string[];
  text?: string;        // OCR result
  quality?: 'good' | 'acceptable' | 'poor';
  subjects?: string[];
  generatedAt: string;
}

export class VisionEngine {
  async handle(request: OrchestratorRequest): Promise<VisionResult> {
    const payload = request.payload as VisionPayload;
    const { action, imageBase64, mimeType = 'image/jpeg' } = payload;

    console.log(`[VisionEngine] Action: ${action}`);

    if (!imageBase64) {
      // Nếu không có ảnh thực, trả về mock result (cho môi trường dev/test)
      return this.mockResult(action);
    }

    switch (action) {
      case 'analyze':        return this.analyzeImage(imageBase64, mimeType);
      case 'analyzeAvatar':  return this.analyzeAvatar(imageBase64, mimeType);
      case 'tag':            return this.tagImage(imageBase64, mimeType);
      case 'ocr':            return this.extractText(imageBase64, mimeType);
      default:
        throw new Error(`[VisionEngine] Unknown action: ${action}`);
    }
  }

  private async analyzeImage(imageBase64: string, mimeType: string): Promise<VisionResult> {
    const prompt = `Phân tích ảnh bóng đá này và trả về JSON:
{
  "description": "mô tả ngắn gọn nội dung ảnh (tiếng Việt)",
  "subjects": ["danh sách chủ thể trong ảnh"],
  "tags": ["tags phù hợp"],
  "quality": "good/acceptable/poor"
}`;
    const response = await geminiProvider.analyzeImage(imageBase64, mimeType, prompt);
    return this.parseVisionResponse('analyze', response.text);
  }

  private async analyzeAvatar(imageBase64: string, mimeType: string): Promise<VisionResult> {
    const prompt = `Đây là ảnh đại diện cầu thủ bóng đá. Phân tích và trả về JSON:
{
  "description": "mô tả về người trong ảnh",
  "quality": "good/acceptable/poor (đánh giá chất lượng ảnh làm avatar)",
  "recommendation": "phù hợp làm avatar hay không, lý do"
}`;
    const response = await geminiProvider.analyzeImage(imageBase64, mimeType, prompt);
    return this.parseVisionResponse('analyzeAvatar', response.text);
  }

  private async tagImage(imageBase64: string, mimeType: string): Promise<VisionResult> {
    const prompt = 'Liệt kê 5-8 tags mô tả ảnh bóng đá này (tiếng Việt). Trả về JSON array: ["tag1", "tag2", ...]';
    const response = await geminiProvider.analyzeImage(imageBase64, mimeType, prompt);
    let tags: string[] = [];
    try {
      const match = response.text.match(/\[[\s\S]*\]/);
      tags = match ? JSON.parse(match[0]) : [];
    } catch {
      tags = response.text.split(',').map(t => t.trim());
    }
    return { action: 'tag', tags, generatedAt: new Date().toISOString() };
  }

  private async extractText(imageBase64: string, mimeType: string): Promise<VisionResult> {
    const prompt = 'Đọc và trích xuất toàn bộ văn bản trong ảnh này. Trả về chỉ văn bản thuần túy.';
    const response = await geminiProvider.analyzeImage(imageBase64, mimeType, prompt);
    return { action: 'ocr', text: response.text, generatedAt: new Date().toISOString() };
  }

  private parseVisionResponse(action: string, text: string): VisionResult {
    try {
      const match = text.match(/\{[\s\S]*\}/);
      const parsed = match ? JSON.parse(match[0]) : {};
      return {
        action,
        description: parsed.description,
        tags: parsed.tags,
        quality: parsed.quality,
        subjects: parsed.subjects,
        generatedAt: new Date().toISOString(),
      };
    } catch {
      return { action, description: text, generatedAt: new Date().toISOString() };
    }
  }

  /** Mock result cho môi trường dev không có ảnh thực */
  private mockResult(action: string): VisionResult {
    return {
      action,
      description: '[Mock] Ảnh trận đấu PTX Summer Cup 2026',
      tags: ['bóng đá', 'PTX', 'summer cup', 'nội bộ'],
      quality: 'good',
      subjects: ['cầu thủ', 'sân cỏ'],
      generatedAt: new Date().toISOString(),
    };
  }
}
