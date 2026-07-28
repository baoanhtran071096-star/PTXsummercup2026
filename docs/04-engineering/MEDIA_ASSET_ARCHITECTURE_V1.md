---
id: DAM-ARCH-001
title: Media Asset Management & Digital Asset Management (DAM) Architecture v1.0
layer: Architecture & Capability Specification
category: Media Engineering
status: Approved Blueprint
version: 1.0.0
owner: Ren (Chief Product & Architecture Officer) & Claude (Lead Engineer)
reviewer: Product Owner
created: 2026-07-29
updated: 2026-07-29
---

# PTX PLATFORM — MEDIA ASSET MANAGEMENT ARCHITECTURE v1.0 (DAM)

---

## 🏛️ 1. NGUYÊN TẮC THIẾT KẾ CỐT LÕI (REN'S MANDATE)

> **"Không lưu trực tiếp URL hình ảnh (raw string URL) trong các bảng nghiệp vụ (`players`, `teams`, `tournaments`, `sponsors`). Toàn bộ hình ảnh phải được lưu bằng `asset_id` độc lập thông qua Digital Asset Management (DAM) Capability (`CAP-007`)."**

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│                    DIGITAL ASSET MANAGEMENT ARCHITECTURE                    │
├─────────────────────────────────────────────────────────────────────────────┤
│  Business Entities (Player, Team, Tournament, Sponsor)                      │
│       │                                                                     │
│       ├── avatar_asset_id ──┐                                               │
│       ├── logo_asset_id   ──┼──>  Asset Repository (media_assets Table)    │
│       └── banner_asset_id ──┘          │                                    │
│                                        ▼                                    │
│                               Storage Adapter Engine                         │
│                     ┌──────────────────┼──────────────────┐                 │
│                     ▼                  ▼                  ▼                 │
│              Supabase Storage   Cloudflare R2         AWS S3                │
│                     │                  │                  │                 │
│                     └──────────────────┴──────────────────┘                 │
│                                        │                                    │
│                                        ▼                                    │
│                          Public CDN / Signed Token URL                      │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. DỮ LIỆU SCHEMA CƠ SỞ DỮ LIỆU (`media_assets` TABLE DDL)

```sql
CREATE TABLE IF NOT EXISTS public.media_assets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id UUID NOT NULL,
    storage_provider VARCHAR(50) NOT NULL DEFAULT 'SUPABASE_STORAGE',
    bucket_name VARCHAR(100) NOT NULL,
    storage_path VARCHAR(500) NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    file_size_bytes BIGINT NOT NULL,
    width_px INT,
    height_px INT,
    sha256_hash VARCHAR(64) NOT NULL,
    public_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for high-performance lookup by asset_id and org_id
CREATE INDEX IF NOT EXISTS idx_media_assets_org_id ON public.media_assets (org_id);
CREATE INDEX IF NOT EXISTS idx_media_assets_hash ON public.media_assets (sha256_hash);
```

---

## 3. CÁC THỰC THỂ SỬ DỤNG CHUNG ASSET ID (UNIFIED ASSET REGISTRY)

| Thực Thể (Entity) | Thuộc Tính Asset mới | Mô tả Loại Tài sản | Bucket tương ứng |
| :--- | :--- | :--- | :--- |
| **Player** | `avatar_asset_id` | Ảnh chân dung cầu thủ | `avatars` |
| **Team** | `logo_asset_id` | Logo biểu tượng đội bóng | `logos` |
| **Tournament** | `banner_asset_id` | Banner giải đấu & Poster Matchday | `banners` |
| **Sponsor** | `logo_asset_id` | Logo thương hiệu Nhà tài trợ | `sponsors` |
| **Media Gallery**| `photo_asset_id` | Ảnh khoảnh khắc trận đấu | `gallery` |
| **Certificate** | `bg_asset_id` | Ảnh nền chứng nhận & vinh danh | `templates` |

---

## 4. QUY TRÌNH UPLOAD & TRUY XUẤT 3 BƯỚC (SECURE SIGNED URL)

1. **Upload Request**: Client gửi yêu cầu upload ➔ `AssetService` kiểm tra `mime_type` (JPEG/PNG/WebP), `file_size` (<5MB) và `sha256_hash` (tránh trùng lặp).
2. **Storage Persistence**: Lưu file vật lý vào `Supabase Storage Bucket` ➔ Ghi nhận 1 dòng metadata vào bảng `media_assets` ➔ Trả về `asset_id`.
3. **Asset Resolution**: Khi API lấy thông tin Player/Team, `AssetService` tự động chuyển đổi `avatar_asset_id` thành CDN URL chuẩn (Signed URL nếu private, Public URL nếu public).
