---
id: DAM-ARCH-003
title: Enterprise Media Asset Management Architecture v1.2 & Architecture Freeze
layer: Architecture Specification
category: Enterprise DAM Specification
status: Frozen Core Architecture
version: 1.2.0
owner: Ren (Chief Product & Architecture Officer) & Claude (Lead Engineer)
reviewer: Product Owner
created: 2026-07-29
updated: 2026-07-29
---

# PTX PLATFORM — ENTERPRISE MEDIA ASSET MANAGEMENT ARCHITECTURE v1.2

---

## 🔒 5 QUY TẮC ĐÓNG BĂNG KIẾN TRÚC (ARCHITECTURE FREEZE RULES)

> [!IMPORTANT]
> 1. **Rule 1**: KHÔNG BAO GIỜ lưu URL hình ảnh dạng chuỗi thô (`avatarUrl`, `logoUrl`, `bannerUrl`) trong bất kỳ bảng nghiệp vụ nào (`Player`, `Team`, `Tournament`, `Sponsor`).
> 2. **Rule 2**: Thực thể nghiệp vụ CẦN PHẢI chỉ tham chiếu qua `asset_id` (`avatar_asset_id`, `logo_asset_id`, `banner_asset_id`).
> 3. **Rule 3**: `storagePath` là Single Source of Truth duy nhất xác định vị trí lưu trữ vật lý của tài sản.
> 4. **Rule 4**: MỌI URL truy cập hình ảnh/media PHẢI được sinh ra động thông qua `AssetResolver`.
> 5. **Rule 5**: MỌI thao tác truy cập hạ tầng storage PHẢI đi qua `StorageAdapter` và `StorageProviderRegistry`.

---

## 🏛️ 6 NÂNG CẤP ENTERPRISE DAM v1.2

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│                 ENTERPRISE DAM ARCHITECTURE v1.2                            │
├─────────────────────────────────────────────────────────────────────────────┤
│ 1. StorageProviderRegistry │ Register Adapters via Dependency Injection     │
│ 2. SignedUrlPolicyMatrix   │ Public (Avatars/Logos) vs Signed (Docs/Videos) │
│ 3. Asset Versioning        │ assetVersion (v1, v2, v3)                       │
│ 4. Standard Image Variants │ thumbnail, small, medium, large, original      │
│ 5. Audit Trail             │ uploadedBy, createdBy, replacedBy, deletedBy    │
│ 6. Enterprise Security     │ MIME Whitelist, Size Limit, Filename Sanitize  │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 📋 ACCESS POLICY MATRIX (`SIGNED_URL_POLICY_MATRIX`)

| AssetType | Target Policy | Default Expiration |
| :--- | :--- | :--- |
| `PLAYER_AVATAR` | Public CDN | 24 Hours |
| `TEAM_LOGO` | Public CDN | 24 Hours |
| `TOURNAMENT_BANNER` | Public CDN | 24 Hours |
| `SPONSOR_LOGO` | Public CDN | 24 Hours |
| `MATCH_PHOTO` | Signed Token Required | 1 Hour |
| `DOCUMENT_PDF` | Signed Token Required | 1 Hour |
| `VIDEO_CLIP` | Signed Token Required | 2 Hours |
