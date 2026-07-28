---
id: ENG-NFR-001
title: PTX Platform Non-Functional Requirements (NFR Specification)
layer: Quality
category: Quality Standards
status: Approved
version: 1.0.0
owner: Chief Software Architect
reviewer: Knowledge Architect
created: 2026-07-28
updated: 2026-07-28
depends_on:
  - MANIFESTO-001
  - BUS-CAP-001
related_docs:
  - QUAL-MODEL-001
  - STRICT_6_LAYER_ARCHITECTURE.md
impacts_on:
  - ENG-ARCH-001
  - DB-SCHEMA-001
  - API-MATCH-001
tags:
  - nfr
  - performance
  - scalability
  - security
  - accessibility
  - metrics
---

# PTX NON-FUNCTIONAL REQUIREMENTS (NFR)
## Đặc Tả Yêu Cầu Phi Chức Năng v1.0.0

---

## 🧭 BA CÂU HỎI KIẾN TRÚC BẮT BUỘC (MANDATORY THREE QUESTIONS)

1. **Tài liệu này giải quyết vấn đề gì?**
   * Định nghĩa toàn bộ các tiêu chuẩn kỹ thuật phi chức năng (NFR) đo lường bằng con số định lượng cụ thể về Hiệu năng, Độ tin cậy, Bảo mật, Khả năng mở rộng và Web Vitals. Tài liệu này giúp tất cả các Kỹ sư và AI Agents đồng mật độ tiêu chuẩn chất lượng.
2. **Nó phụ thuộc vào những tài liệu nào?**
   * Phụ thuộc vào `MANIFESTO-001` và `BUS-CAP-001` (Mô hình Năng lực Nghiệp vụ).
3. **Những tài liệu nào sẽ bị ảnh hưởng nếu nó thay đổi?**
   * Mọi quyết định thiết kế Backend 6 Lớp, Supabase RLS Policies, Next.js Rendering, và Kịch bản Kiểm thử Tải (Load Testing).

---

## 1. TIÊU CHUẨN HIỆU NĂNG & THỜI GIAN PHẢN HỒI (PERFORMANCE METRICS)

| Chỉ số (Metric) | Nguồn / Phân vùng | Ngưỡng Tối đa cho phép |
| :--- | :--- | :--- |
| **Realtime Goal Broadcast Delay** | WebSocket / SSE Signal | **< 500 ms** (từ lúc bấm nút đến khán giả) |
| **Match Story AI Generation** | `/api/ai/match-story` | **< 3,000 ms** (xử lý qua Gemini Flash) |
| **Dashboard TTFB (Time to First Byte)** | Next.js Server Component | **< 800 ms** |
| **Database RPC Execution Time** | `fn_add_goal`, `v_standings` | **< 50 ms** |
| **Tactical Pitch 3D Render FPS** | Client Canvas Component | **>= 60 FPS** (trên Mobile & Desktop) |

---

## 2. TIÊU CHUẨN WEB VITALS & UX PERFORMANCE

```
[Core Web Vitals Metric Targets]
  • LCP (Largest Contentful Paint) : < 2.5 giây
  • INP (Interaction to Next Paint): < 200 ms
  • CLS (Cumulative Layout Shift)  : < 0.1
  • Lighthouse Score               : >= 95 / 100 (Performance, Accessibility, SEO)
```

---

## 3. KHẢ NĂNG MỞ RỘNG & TẢI TẮC NGHẼN (SCALABILITY & RELIABILITY)

### NFR-001: Concurrent Viewers Support
* Hệ thống phải chịu tải tối thiểu **10,000 người dùng đồng thời (Concurrent Viewers)** theo dõi Bảng xếp hạng và Tỷ số trực tiếp trong các giờ cao điểm của giải đấu mà không bị tụt FPS hay sập DB pool connection.

### NFR-002: System Availability & SLA
* Độ sẵn sàng hệ thống (System Availability): **99.9% Uptime** trong suốt thời gian diễn ra giải đấu.

---

## 4. AN TOÀN BẢO MẬT & TRUY XUẤT NGUỒN GỐC (SECURITY & AUDIT)

### NFR-003: Strict Multi-tenant Data Isolation
* Data Leakage giữa các Organization phải ở mức **0%**. 100% câu lệnh truy vấn SQL bắt buộc đi qua Supabase RLS Policy bọc JWT Tenant Claim.

### NFR-004: Immutable Audit Trail
* Mọi hành động can thiệp bàn thắng, sửa điểm, xóa cầu thủ của Admin/Trọng tài bàn phải được lưu nhật ký `audit_logs` **không thể sửa/xóa (Immutable)**.

---

## 5. KHẢ NĂNG TRUY CẬP & TƯƠNG THÍCH TRUYỀN THÔNG (ACCESSIBILITY & i18n)

### NFR-005: WCAG 2.1 AA Compliance
* Giao diện web phải tuân thủ chuẩn tương phản màu sắc và hỗ trợ phím điều hướng (Keyboard Navigation) cho người khuyết thị theo WCAG 2.1 AA.

### NFR-006: Full Internationalization (i18n)
* Hỗ trợ đa ngôn ngữ mượt mà (Tiếng Việt `vi` và Tiếng Anh `en`) với thời gian chuyển đổi giao diện mượt < 100ms.
