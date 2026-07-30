// ================================================================
// PTX AI CAPABILITY REGISTRY
// Cho AI biết năng lực của mình để phối hợp linh hoạt.
// Architecture: AI-Native, Free-by-Design
// Frozen: 31/07/2026
// ================================================================

export interface Capability {
  name: string;
  description: string;
  engine: string;
  actions: string[];
  costTier: 'free' | 'low' | 'medium' | 'high';
  requiresApiKey: boolean;
}

// Task → Required Capabilities mapping
const TASK_CAPABILITY_MAP: Record<string, string[]> = {
  'upload-image':    ['vision', 'content', 'automation'],
  'match-result':    ['analytics', 'content', 'automation'],
  'new-player':      ['vision', 'search', 'content', 'automation'],
  'chat':            ['chat'],
  'search':          ['search'],
  'analytics':       ['analytics'],
  'news-generation': ['content'],
  'seo-generation':  ['content'],
  'notification':    ['automation'],
};

export class CapabilityRegistry {
  private capabilities = new Map<string, Capability>();

  constructor() {
    this.registerDefaults();
  }

  register(capability: Capability): void {
    this.capabilities.set(capability.name, capability);
    console.log(`[CapabilityRegistry] Registered: ${capability.name}`);
  }

  get(name: string): Capability | undefined {
    return this.capabilities.get(name);
  }

  getAll(): Capability[] {
    return Array.from(this.capabilities.values());
  }

  /**
   * Trả về danh sách Capability cần thiết cho một task.
   * Ví dụ: "upload-image" → [vision, content, automation]
   */
  getRequiredCapabilities(task: string): Capability[] {
    const required = TASK_CAPABILITY_MAP[task] ?? [];
    return required
      .map(name => this.capabilities.get(name))
      .filter((c): c is Capability => c !== undefined);
  }

  /**
   * Đăng ký toàn bộ capability mặc định của PTX AI Core.
   */
  private registerDefaults(): void {
    const defaults: Capability[] = [
      {
        name: 'chat',
        description: 'Fan chatbot, Q&A về giải đấu, luật thi đấu',
        engine: 'ChatEngine',
        actions: ['answer', 'suggest', 'clarify'],
        costTier: 'low',
        requiresApiKey: true,
      },
      {
        name: 'vision',
        description: 'Phân tích ảnh: avatar, gallery, action shot',
        engine: 'VisionEngine',
        actions: ['analyze', 'tag', 'classify', 'ocr'],
        costTier: 'medium',
        requiresApiKey: true,
      },
      {
        name: 'content',
        description: 'Sinh nội dung: tin tức, mô tả, SEO, hồ sơ cầu thủ',
        engine: 'ContentEngine',
        actions: ['generateNews', 'generateDescription', 'generateTags', 'generateSEO', 'generateProfile'],
        costTier: 'low',
        requiresApiKey: true,
      },
      {
        name: 'search',
        description: 'Tìm kiếm toàn hệ thống: cầu thủ, trận đấu, gallery, tin tức',
        engine: 'SearchEngine',
        actions: ['search', 'checkDuplicate', 'suggest'],
        costTier: 'free',
        requiresApiKey: false,
      },
      {
        name: 'analytics',
        description: 'Phân tích BXH, thống kê, dự đoán kết quả',
        engine: 'AnalyticsEngine',
        actions: ['updateStandings', 'computeStats', 'predict', 'summarize'],
        costTier: 'free',
        requiresApiKey: false,
      },
      {
        name: 'automation',
        description: 'Tự động hóa: đăng bài, thông báo, lịch trình',
        engine: 'AutomationEngine',
        actions: ['publishToGallery', 'publishNews', 'notifyUsers', 'createPlayerPage', 'scheduleMatch'],
        costTier: 'free',
        requiresApiKey: false,
      },
    ];

    defaults.forEach(cap => this.register(cap));
  }
}
