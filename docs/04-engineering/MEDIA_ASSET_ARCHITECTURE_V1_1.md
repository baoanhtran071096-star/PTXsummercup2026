---
id: DAM-ARCH-002
title: Media Asset Management Architecture v1.1 (Storage Adapters, Resolver & Lifecycle)
layer: Architecture & Capability Specification
category: Media Engineering
status: Approved Enterprise Architecture
version: 1.1.0
owner: Ren (Chief Product & Architecture Officer) & Claude (Lead Engineer)
reviewer: Product Owner
created: 2026-07-29
updated: 2026-07-29
---

# PTX PLATFORM — MEDIA ASSET MANAGEMENT ARCHITECTURE v1.1 (ENTERPRISE DAM)

---

## 🏛️ 5 LỚP NÂNG CẤP KIẾN TRÚC MEDIA ASSET v1.1 (REN'S MANDATE)

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│                 MEDIA ASSET MANAGEMENT ARCHITECTURE v1.1                    │
├─────────────────────────────────────────────────────────────────────────────┤
│ 1. Decoupled Storage Path  │ storagePath là Single Source of Truth           │
│ 2. Business AssetType      │ PLAYER_AVATAR, TEAM_LOGO, TOURNAMENT_BANNER... │
│ 3. Asset Lifecycle Status  │ UPLOADING ➔ ACTIVE ➔ ARCHIVED ➔ DELETED         │
│ 4. Storage Adapter Pattern │ SupabaseStorage, CloudflareR2, S3Storage        │
│ 5. AssetResolver Engine    │ Sinh Dynamic Signed URL & Query Processing      │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 1. PHÂN TÁCH `AssetType` VÀ `Bucket`

* `AssetType` đại diện cho **Nghiệp vụ (Business Intent)**.
* `Bucket` đại diện cho **Hạ tầng Lưu trữ (Storage Container)**.

| Business AssetType | Target Storage Bucket | Default Expiry (Signed URL) |
| :--- | :--- | :--- |
| `PLAYER_AVATAR` | `avatars` | Public CDN (N/A) |
| `TEAM_LOGO` | `logos` | Public CDN (N/A) |
| `TOURNAMENT_BANNER` | `banners` | Public CDN (N/A) |
| `SPONSOR_LOGO` | `sponsors` | Public CDN (N/A) |
| `MATCH_PHOTO` | `gallery` | Public CDN (N/A) |
| `DOCUMENT_PDF` | `documents` | Private Signed URL (1 hour) |
| `VIDEO_CLIP` | `videos` | Private Signed URL (2 hours) |

---

## 2. VÒNG ĐỜI TÀI SẢN (`AssetStatus`)

* `UPLOADING`: Bắt đầu quá trình truyền file từ Client.
* `ACTIVE`: File đã upload xong, hash SHA256 được xác nhận và sẵn sàng phục vụ.
* `ARCHIVED`: File được chuyển sang lưu trữ lâu dài (Cool storage).
* `DELETED`: File bị xóa mềm (Soft deleted), ngăn truy xuất từ Resolver.

---

## 3. STORAGE ADAPTER PATTERN & ASSET RESOLVER ENGINE

```text
Business Entity ──> asset_id ──> AssetResolver ──> StorageAdapter ──> Dynamic CDN Signed URL
```
