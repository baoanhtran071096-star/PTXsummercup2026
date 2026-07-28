---
id: BUS-CAP-001
title: PTX Platform Business Capability Model
layer: Business
category: Capability Architecture
status: Approved
version: 1.0.0
owner: Product Owner
reviewer: Chief Software Architect
created: 2026-07-28
updated: 2026-07-28
depends_on:
  - MANIFESTO-001
  - DOMAIN-001
related_docs:
  - BUS-RULE-001
  - BUS-FLOW-001
  - ENG-NFR-001
impacts_on:
  - PROD-MATCH-001
  - ENG-ARCH-001
  - DB-SCHEMA-001
tags:
  - capability-model
  - business-architecture
  - enterprise
---

# PTX BUSINESS CAPABILITY MODEL
## Mô Hình Năng Lực Nghiệp Vụ v1.0.0

---

## 🧭 BA CÂU HỎI KIẾN TRÚC BẮT BUỘC (MANDATORY THREE QUESTIONS)

1. **Tài liệu này giải quyết vấn đề gì?**
   * Định nghĩa toàn bộ năng lực nghiệp vụ (Business Capabilities) của PTX Platform — tức là *"Hệ thống có khả năng làm gì"* độc lập hoàn toàn với công nghệ, Database Schema, API hay giao diện UI. Tài liệu này cung cấp cái nhìn tổng thể cho CTO, Product Owner và Chief Architect để lập bản đồ phát triển sản phẩm.
2. **Nó phụ thuộc vào những tài liệu nào?**
   * Phụ thuộc vào `MANIFESTO-001` (Sứ mệnh nền tảng) và `DOMAIN-001` (Mô hình miền thực thể).
3. **Những tài liệu nào sẽ bị ảnh hưởng nếu nó thay đổi?**
   * Tất cả các tài liệu Đặc tả Module Sản phẩm (`PROD-xxx`), Architecture (`ENG-xxx`), Database (`DB-xxx`), và API Specifications (`API-xxx`).

---

## 1. TỔNG QUAN NĂNG LỰC (CAPABILITY MAP OVERVIEW)

```
PTX Platform System Capabilities
├── 1. Organization & Tenant Management
├── 2. Tournament & Season Management
├── 3. Team & Roster Management
├── 4. Competition & Fixture Engine
├── 5. Match Operations & Live Control
├── 6. Statistics & Standings Engine
├── 7. Media & Digital Asset Management (DAM)
├── 8. Notification & Push Messaging
├── 9. Finance & Sponsorship Management
└── 10. AI Services & Sports Intelligence
```

---

## 2. CHI TIẾT 10 LĨNH VỰC NĂNG LỰC CỐT LÕI (CAPABILITY DETAILS)

### 2.1 Organization & Tenant Management (Quản lý Đa tổ chức)
* **Mô tả**: Khả năng phân tách đa người dùng (Multi-tenant Isolation), quản lý thông tin tổ chức, cấu hình thương hiệu (Logo, Theme) và phân quyền vai trò (Role-Based Access Control - RBAC).
* **Năng lực con**:
  * Organization Provisioning (Khởi tạo Tổ chức).
  * Role & Permission Management (Quản lý Phân quyền).
  * Tenant Isolation & Audit Logging (Cách ly Dữ liệu & Nhật ký Audit).

### 2.2 Tournament & Season Management (Quản lý Giải đấu & Mùa giải)
* **Mô tả**: Khả năng thiết lập các giải đấu, định nghĩa thể thức thi đấu, quản lý các mùa giải thi đấu nối tiếp nhau qua các năm.
* **Năng lực con**:
  * Tournament Formatting (Định nghĩa Thể thức: Vòng tròn, Chia bảng, Knock-out).
  * Season Lifecycle Management (Khởi tạo, Kích hoạt, Đóng Mùa giải).

### 2.3 Team & Roster Management (Quản lý Đội bóng & Đội hình)
* **Mô tả**: Khả năng đăng ký đội bóng, quản lý hồ sơ cầu thủ, kiểm tra tính hợp lệ của hồ sơ thi đấu và đánh giá chỉ số năng lực.
* **Năng lực con**:
  * Team Enrollment (Đăng ký Đội tham gia).
  * Roster Validation (Duyệt Danh sách Cầu thủ & Số áo).
  * Player Profile & OVR Rating (Hồ sơ Cầu thủ & Chỉ số OVR).

### 2.4 Competition & Fixture Engine (Động cơ Lịch thi đấu)
* **Mô tả**: Khả năng tự động xếp lịch thi đấu (Fixture Generator), chia sân, xếp khung giờ thi đấu và xử lý hoán đổi lịch.
* **Năng lực con**:
  * Automated Fixture Generation (Tự động Tạo Lịch Vòng tròn/Cúp).
  * Pitch & Schedule Assignment (Phân lịch Sân & Giờ thi đấu).

### 2.5 Match Operations & Live Control (Điều hành Trận đấu Live)
* **Mô tả**: Khả năng vận hành Trọng tài bàn realtime, ghi nhận sự kiện trận đấu (Bàn thắng, Thẻ phạt, Thay người) và điều khiển sa bàn chiến thuật.
* **Năng lực con**:
  * Referee Live Control Console (Bảng điều khiển Trọng tài bàn).
  * Realtime Match Events Recording (Ghi nhận Sự kiện Realtime).
  * Tactical Visualizer 3D (Sa bàn Chiến thuật Sân 5 3D).

### 2.6 Statistics & Standings Engine (Động cơ Thống kê & Bảng xếp hạng)
* **Mô tả**: Khả năng tự động tính toán Bảng xếp hạng, Hiệu số bàn thắng, Chỉ số Fair-play và Danh sách Vua phá lưới (Top Scorers) tức thì.
* **Năng lực con**:
  * Instant Standings Calculation (Tính Bảng xếp hạng Realtime).
  * Top Scorers & MVP Analytics (Thống kê Vua phá lưới & MVP).

### 2.7 Media & Digital Asset Management (DAM)
* **Mô tả**: Khả năng quản lý thư viện hình ảnh, video highlight trận đấu, gắn tag tự động và semantic search.
* **Năng lực con**:
  * Asset Ingestion & Optimization (Nạp & Tối ưu Ảnh/Video).
  * AI Media Tagging & Blurhash (Gắn Tag AI & Ảnh làm mờ Blurhash).

### 2.8 Notification & Push Messaging (Thông báo & Tin nhắn)
* **Mô tả**: Khả năng gửi thông báo Push Notification tới khán giả, VĐV khi có bàn thắng hoặc thay đổi lịch thi đấu.
* **Năng lực con**:
  * Web Push & VAPID Messaging.
  * Realtime Goal Alert Broadcast.

### 2.9 Finance & Sponsorship Management (Tài chính & Tài trợ)
* **Mô tả**: Khả năng quản lý lệ phí giải đấu, hợp đồng tài trợ, quyền lợi hiển thị banner thương hiệu trên giao diện.

### 2.10 AI Services & Sports Intelligence (Dịch vụ AI Thể thao)
* **Mô tả**: Khả năng tự động viết bài báo tóm tắt trận đấu (Match Story Generator), Chatbot trợ lý giải đấu và Tìm kiếm ảnh bằng câu lệnh tự nhiên.
