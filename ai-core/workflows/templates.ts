// ================================================================
// PTX AI WORKFLOW TEMPLATES
// Chuẩn hóa các quy trình AI thành các mẫu có thể tái sử dụng.
// Architecture: AI-Native, Free-by-Design
// Frozen: 31/07/2026
// ================================================================

export interface WorkflowStep {
  engine: string;
  action: string;
  description?: string;
  dependsOn?: string[];  // Tên step phải hoàn thành trước
  optional?: boolean;    // Nếu true: bỏ qua khi lỗi thay vì dừng
}

export interface WorkflowTemplate {
  id: string;
  name: string;
  description: string;
  trigger: string;
  steps: WorkflowStep[];
  estimatedCostTier: 'free' | 'low' | 'medium' | 'high';
}

// ================================================================
// REGISTRY CHÍNH THỨC – CÁC WORKFLOW PTX AI
// ================================================================
export const WorkflowTemplates: Record<string, WorkflowTemplate> = {

  'upload-image': {
    id: 'upload-image',
    name: 'Xử lý ảnh tải lên',
    description: 'BTC upload ảnh → Phân tích → Sinh mô tả + Tags → Đăng Gallery + Thông báo',
    trigger: 'image.uploaded',
    estimatedCostTier: 'medium',
    steps: [
      { engine: 'vision',     action: 'analyze',             description: 'Phân tích nội dung ảnh' },
      { engine: 'content',    action: 'generateDescription',  description: 'Sinh mô tả ảnh',      dependsOn: ['analyze'] },
      { engine: 'content',    action: 'generateTags',         description: 'Sinh tags tự động',    dependsOn: ['analyze'] },
      { engine: 'automation', action: 'publishToGallery',     description: 'Đăng lên Gallery',     dependsOn: ['generateDescription', 'generateTags'] },
    ],
  },

  'match-result': {
    id: 'match-result',
    name: 'Xử lý kết quả trận đấu',
    description: 'Admin nhập kết quả → Cập nhật BXH → Sinh tin tức + SEO → Đăng + Thông báo',
    trigger: 'match.result.entered',
    estimatedCostTier: 'low',
    steps: [
      { engine: 'analytics',  action: 'updateStandings',  description: 'Cập nhật bảng xếp hạng' },
      { engine: 'analytics',  action: 'computeStats',     description: 'Tính thống kê trận đấu',   dependsOn: ['updateStandings'] },
      { engine: 'content',    action: 'generateNews',     description: 'Sinh tin tức tự động',     dependsOn: ['computeStats'] },
      { engine: 'content',    action: 'generateSEO',      description: 'Sinh meta SEO cho bài',    dependsOn: ['generateNews'] },
      { engine: 'automation', action: 'publishNews',      description: 'Đăng tin tức lên website', dependsOn: ['generateNews', 'generateSEO'] },
      { engine: 'automation', action: 'notifyUsers',      description: 'Gửi thông báo đến fan',    dependsOn: ['publishNews'], optional: true },
    ],
  },

  'new-player': {
    id: 'new-player',
    name: 'Đăng ký cầu thủ mới',
    description: 'Admin thêm cầu thủ → Kiểm tra trùng lặp → Phân tích avatar → Sinh hồ sơ → Tạo trang',
    trigger: 'player.created',
    estimatedCostTier: 'low',
    steps: [
      { engine: 'search',     action: 'checkDuplicate',    description: 'Kiểm tra cầu thủ trùng' },
      { engine: 'vision',     action: 'analyzeAvatar',     description: 'Phân tích ảnh đại diện',   dependsOn: ['checkDuplicate'] },
      { engine: 'content',    action: 'generateProfile',   description: 'Sinh hồ sơ cầu thủ',      dependsOn: ['analyzeAvatar'] },
      { engine: 'automation', action: 'createPlayerPage',  description: 'Tạo trang cầu thủ',        dependsOn: ['generateProfile'] },
    ],
  },

  'news-generation': {
    id: 'news-generation',
    name: 'Sinh tin tức thủ công',
    description: 'BTC yêu cầu sinh tin tức từ dữ liệu có sẵn',
    trigger: 'news.generate.requested',
    estimatedCostTier: 'low',
    steps: [
      { engine: 'content',    action: 'generateNews',  description: 'Sinh nội dung bài viết' },
      { engine: 'content',    action: 'generateSEO',   description: 'Sinh SEO meta',           dependsOn: ['generateNews'] },
      { engine: 'automation', action: 'publishNews',   description: 'Đăng bài',                dependsOn: ['generateSEO'] },
    ],
  },

};
