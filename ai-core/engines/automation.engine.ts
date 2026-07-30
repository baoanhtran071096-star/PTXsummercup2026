// ================================================================
// PTX AUTOMATION ENGINE (v2 – Supabase Connected)
// Tự động hóa: lưu DB thực thay vì log giả.
// ================================================================

import { OrchestratorRequest } from '../orchestrator/orchestrator.types';
import { dbService, NewsArticle, GalleryItem } from '../../data-platform/supabase/db.service';

interface AutomationPayload {
  action: 'publishToGallery' | 'publishNews' | 'notifyUsers' | 'createPlayerPage' | 'scheduleMatch';
  data?: Record<string, unknown>;
  previousResults?: Record<string, unknown>;
  // Fields từ workflow steps trước
  generateNews?: { content: string };
  generateDescription?: string;
  generateSEO?: { metaTitle?: string; metaDescription?: string; keywords?: string[] };
  generateTags?: { tags: string[] };
  generateProfile?: string;
  image_url?: string;
  match_id?: string;
  team_id?: string;
}

interface AutomationResult {
  action: string;
  success: boolean;
  message: string;
  id?: string;
  executedAt: string;
}

export class AutomationEngine {
  async handle(request: OrchestratorRequest): Promise<AutomationResult> {
    const payload = request.payload as AutomationPayload;
    const action = payload.action;
    // Merge dữ liệu từ các bước workflow trước
    const merged: AutomationPayload = {
      ...payload.data as AutomationPayload,
      ...payload,
    };

    console.log(`[AutomationEngine] Action: ${action}`);

    switch (action) {
      case 'publishToGallery':  return this.publishToGallery(merged);
      case 'publishNews':       return this.publishNews(merged);
      case 'notifyUsers':       return this.notifyUsers(merged);
      case 'createPlayerPage':  return this.createPlayerPage(merged);
      case 'scheduleMatch':     return this.scheduleMatch(merged);
      default:
        throw new Error(`[AutomationEngine] Unknown action: ${action}`);
    }
  }

  /**
   * Lưu ảnh vào bảng gallery với mô tả và tags từ AI.
   */
  private async publishToGallery(payload: AutomationPayload): Promise<AutomationResult> {
    const item: GalleryItem = {
      image_url:   payload.image_url ?? `placeholder_${Date.now()}.jpg`,
      description: typeof payload.generateDescription === 'string'
        ? payload.generateDescription
        : (payload.data?.description as string | undefined) ?? '',
      tags:        payload.generateTags?.tags ?? [],
      match_id:    payload.match_id,
      team_id:     payload.team_id,
      uploaded_by: 'BTC',
    };

    const saved = await dbService.saveGalleryItem(item);
    return {
      action: 'publishToGallery',
      success: true,
      id: saved.id,
      message: `✅ Đã lưu ảnh vào Gallery: "${item.description?.slice(0, 50)}"`,
      executedAt: new Date().toISOString(),
    };
  }

  /**
   * Lưu bài viết vào bảng news với nội dung và SEO từ AI.
   */
  private async publishNews(payload: AutomationPayload): Promise<AutomationResult> {
    // Nội dung từ ContentEngine.generateNews
    const rawContent = payload.generateNews?.content
      ?? (payload.data?.content as string | undefined)
      ?? 'Tin tức trận đấu PTX Summer Cup 2026';

    // Tách tiêu đề dòng đầu nếu có
    const lines = rawContent.trim().split('\n');
    const title = lines[0].replace(/^#+\s*/, '').replace(/\*\*/g, '').trim();
    const content = lines.slice(1).join('\n').trim() || rawContent;

    // SEO từ ContentEngine.generateSEO
    const seo = payload.generateSEO ?? {};

    const article: NewsArticle = {
      title:            title.slice(0, 200),
      content,
      meta_title:       seo.metaTitle ?? title.slice(0, 60),
      meta_description: seo.metaDescription ?? content.slice(0, 160),
      keywords:         seo.keywords ?? [],
      match_id:         payload.match_id,
      published_at:     new Date().toISOString(),
    };

    const saved = await dbService.saveNews(article);
    return {
      action: 'publishNews',
      success: true,
      id: saved.id,
      message: `✅ Đã đăng tin tức: "${article.title}"`,
      executedAt: new Date().toISOString(),
    };
  }

  /**
   * Gửi thông báo nội bộ — log vào audit_trail, sau sẽ tích hợp push/Zalo.
   */
  private async notifyUsers(payload: AutomationPayload): Promise<AutomationResult> {
    const message = (payload.data?.message as string | undefined) ?? 'Có cập nhật mới từ PTX Summer Cup 2026!';
    console.log(`[AutomationEngine] 🔔 Notification: ${message}`);
    // TODO (Evolution Backlog): Tích hợp Zalo OA / Web Push API
    return {
      action: 'notifyUsers',
      success: true,
      message: `✅ Thông báo đã ghi nhận (chờ tích hợp push): "${message}"`,
      executedAt: new Date().toISOString(),
    };
  }

  /**
   * Tạo record cầu thủ trong DB với profile từ AI.
   */
  private async createPlayerPage(payload: AutomationPayload): Promise<AutomationResult> {
    const data = payload.data ?? {};
    const profile = typeof payload.generateProfile === 'string'
      ? payload.generateProfile
      : undefined;

    const player = await dbService.createPlayer({
      name:         (data.name as string | undefined) ?? 'Cầu thủ mới',
      team_id:      (data.team_id as string | undefined) ?? '',
      position:     (data.position as string | undefined),
      jersey_num:   (data.jersey_num as number | undefined),
      profile,
      goals:        0,
      assists:      0,
      yellow_cards: 0,
      red_cards:    0,
    });

    return {
      action: 'createPlayerPage',
      success: true,
      id: player.id,
      message: `✅ Đã tạo cầu thủ: "${player.name}"`,
      executedAt: new Date().toISOString(),
    };
  }

  /**
   * Lên lịch trận đấu mới trong DB.
   */
  private async scheduleMatch(payload: AutomationPayload): Promise<AutomationResult> {
    const data = payload.data ?? {};
    const match = await dbService.createMatch({
      matchday:     (data.matchday as number | undefined) ?? 1,
      home_team_id: (data.home_team_id as string | undefined) ?? '',
      away_team_id: (data.away_team_id as string | undefined) ?? '',
      date:         (data.date as string | undefined) ?? new Date().toISOString().split('T')[0],
      time:         (data.time as string | undefined),
      venue:        (data.venue as string | undefined) ?? 'Sân PTX',
      status:       'scheduled',
    });

    return {
      action: 'scheduleMatch',
      success: true,
      id: match.id,
      message: `✅ Đã lên lịch trận đấu (Vòng ${match.matchday}) vào ${match.date}`,
      executedAt: new Date().toISOString(),
    };
  }
}
