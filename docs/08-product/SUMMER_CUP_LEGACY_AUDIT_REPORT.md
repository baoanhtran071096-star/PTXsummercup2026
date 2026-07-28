---
id: PROD-AUDIT-001
title: PTX Summer Cup 2026 v2.3 - Legacy Product Audit Report & Capability Mapping
layer: Product Audit
category: Sprint 0 Legacy Product Audit
status: Approved
version: 1.0.0
owner: Ren (Chief Product & Architecture Officer) & Product Owner
reviewer: Claude (Lead Engineer)
created: 2026-07-29
updated: 2026-07-29
---

# PTX SUMMER CUP 2026 v2.3 — LEGACY PRODUCT AUDIT REPORT & CAPABILITY MAPPING
## Báo Cáo Thẩm Định Sản Phẩm Di Sản Sprint 0 & Bản Đồ Chuyển Đổi Nền Tảng

---

## 1. TỔNG QUAN THẨM ĐỊNH (AUDIT OVERVIEW)

* **Tên file di sản**: `PTX Summer Cup 2026 2.3 - Fixed Version.html` (`docs/08-product/legacy-summer-cup-v2.3.html`).
* **Dung lượng & Cấu trúc**: 227 KB HTML Single-Page Portal với 5,214 dòng mã bao gồm Tailwind/CSS custom, Be Vietnam Pro/Bebas Neue fonts, Plyr.js media player, Lightbox2, và JavaScript DOM Vanilla.
* **Đánh giá vị thế**: Đã vượt xa một trang Landing Page đơn thuần, trở thành một **Single-Page Tournament Portal** phong phú tính năng nhưng bị giới hạn bởi lưu trữ Client-side (Local Storage / Hardcoded Data).

---

## 2. BẢNG ĐÁNH GIÁ ĐIỂM SỐ CÁC HẠNG MỤC (UI/UX SCORECARD)

```text
┌────────────────────────────────────────────────────────────────────────┐
│             PTX SUMMER CUP v2.3 UI/UX SCORECARD SUMMARY                │
├───────────────────────────┬──────────────┬─────────────────────────────┤
│ HẠNG MỤC AUDIT            │ ĐIỂM SỐ (/10)│ TRẠNG THÁI ĐÁNH GIÁ         │
├───────────────────────────┼──────────────┼─────────────────────────────┤
│ 1. Foundation & Branding  │ 8.5 / 10     │ 🟢 Excellent                │
│ 2. Mobile Experience      │ 8.0 / 10     │ 🔵 Good                     │
│ 3. Navigation & IA        │ 7.5 / 10     │ 🔵 Good                     │
│ 4. Tournament Experience  │ 7.0 / 10     │ 🟡 Needs Improvement        │
│ 5. Media & Fan Experience │ 8.5 / 10     │ 🟢 Excellent                │
│ 6. Admin Experience       │ 5.5 / 10     │ 🟠 Major Improvement        │
│ 7. Technical Quality      │ 6.0 / 10     │ 🟡 Needs Improvement        │
│ 8. Production Readiness   │ 6.5 / 10     │ 🟡 Needs Improvement        │
├───────────────────────────┼──────────────┼─────────────────────────────┤
│ OVERALL PRODUCT READINESS │ 7.2 / 10     │ 🟡 READY FOR MVP MIGRATION  │
└───────────────────────────┴──────────────┴─────────────────────────────┘
```

---

## 3. ĐÁNH GIÁ CHI TIẾT THEO 4 WAVES REVIEW

### 🌊 Wave 1: Foundation, Branding & Mobile UX (Score: 8.2 / 10)
* **🟢 Điểm mạnh**:
  * Gradient Navy/Orange (`#1D3557` & `#F15A24`) mang đậm nhận diện thương hiệu PTX.
  * Hỗ trợ PWA đầy đủ (`manifest.json`, `theme-color`, `apple-touch-icon`).
  * Typography kết hợp chuẩn giữa `Bebas Neue` (Header/Logo), `Barlow Condensed` (Tiêu đề) và `Be Vietnam Pro` (Nội dung tiếng Việt).
* **🟡 Điểm cần cải tiến**:
  * Tải nặng tài nguyên font và CSS cắm ngoài từ CDNs (Google Fonts, FontAwesome, Plyr, Lightbox).
  * Navigation bar chưa có trạng thái `active section indicator` mượt mà khi cuộn trên di động.

### 🌊 Wave 2: Tournament Core — Matches, Standings & Players (Score: 7.2 / 10)
* **🟢 Điểm mạnh**:
  * Giao diện Trung tâm trận đấu, Bảng xếp hạng, Thống kê ghi bàn và Cầu thủ FIFA được trình bày đẹp mắt, trực quan.
* **🟠 Điểm cần cải tiến (Hardcoded Issue)**:
  * Toàn bộ lịch thi đấu và bảng xếp hạng đang bị **hardcode trong Javascript DOM** hoặc lưu trong `localStorage`.
  * Thiếu khả năng tự động tính toán đối đầu/hiệu số và không có kết nối cơ sở dữ liệu PostgreSQL thực tế.

### 🌊 Wave 3: Media, Sponsor & Governance (Score: 8.5 / 10)
* **🟢 Điểm mạnh**:
  * Module Thư viện Media tích hợp Plyr.js và Lightbox2 xem video/ảnh trận đấu rất ấn tượng.
  * Module Điều lệ giải đấu, Nhà tài trợ và Vinh danh mùa giải thiết kế trang trọng, đầy đủ.

### 🌊 Wave 4: Admin Panel & Technical Architecture (Score: 5.5 / 10)
* **🔴 Hạn chế kỹ thuật lớn nhất**:
  * Admin Control Panel nằm chung trong 1 file HTML, bảo mật bằng Javascript Client-side đơn giản.
  * Không có phân quyền RBAC, không có JWT Authentication, không có Supabase PostgreSQL RPC backend.

---

## 4. BẢNG MA TRẬN KEEP / IMPROVE / REMOVE

| Module Di Sản v2.3 | Quyết Định | Giải Pháp Nâng Cấp Sản Phẩm (PTX 2.0 Plan) |
| :--- | :--- | :--- |
| **Hero & Branding** | 🟢 **KEEP** | Giữ 100% Design System & Tokens; chuyển sang Next.js Tailwind Component. |
| **Trung tâm trận đấu** | 🔵 **IMPROVE** | Chuyển dữ liệu hardcode thành Supabase Realtime Stream & PostgreSQL DB. |
| **Bảng xếp hạng (BXH)**| 🔵 **IMPROVE** | Tự động hóa tính điểm và hiệu số qua Atomic Stored Procedure `fn_calculate_standings`. |
| **Cầu thủ & Đội bóng** | 🔵 **IMPROVE** | Chuẩn hóa Zod Contract Schema `PlayerContractSchema` & `TeamContractSchema`. |
| **Thư viện Media** | 🟢 **KEEP** | Giữ trải nghiệm Plyr.js / Lightbox, lưu URL trên Supabase Storage. |
| **Admin Control Panel**| 🔴 **REMOVE** | Xóa bản Client Admin cũ; thay thế bằng Next.js Auth JWT Admin Console chuẩn Enterprise. |

---

## 5. CAPABILITY MAPPING MATRIX (CHUYỂN ĐỔI THÀNH CAPABILITIES)

```text
LEGACY HTML PORTAL MODULES           PTX PLATFORM CAPABILITIES
┌──────────────────────────┐         ┌───────────────────────────────────────┐
│ Hero / Branding / Nav    │ ──────> │ CMS Capability (Landing & Media)      │
│ Lịch thi đấu & Kết quả   │ ──────> │ Tournament Match Engine Capability    │
│ Bảng xếp hạng (Standings)│ ──────> │ Standings Calculation Capability      │
│ Đội bóng & Cầu thủ       │ ──────> │ Team Enrollment & Player Capability   │
│ Client Admin Panel       │ ──────> │ Auth & Governance Policy Capability   │
└──────────────────────────┘         └───────────────────────────────────────┘
```

---

## 6. LỘ TRÌNH CHUYỂN ĐỔI KỸ THUẬT (MIGRATION ROADMAP)

```text
[Legacy HTML v2.3] ──> [Extract Zod Schemas] ──> [Supabase PostgreSQL DDL] ──> [Next.js 14 App Router] ──> [Production MVP]
```

1. **Giai đoạn 1**: Đóng gói Zod Schemas cho `Tournament`, `Match`, `Team`, `Player` vào `docs/04-contracts/`.
2. **Giai đoạn 2**: Sinh PostgreSQL DDL qua Knowledge Compiler 3.0.
3. **Giai đoạn 3**: Xây dựng Next.js 14 App Router Components kế thừa 100% UI/UX Tokens từ HTML v2.3.
4. **Giai đoạn 4**: Tích hợp JWT Auth và Supabase Realtime Stream cho Live Match.
