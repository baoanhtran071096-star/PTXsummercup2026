---
id: PRINCIPLE-001
title: PTX Engineering Principles
layer: Foundation
category: Engineering Charter
status: Approved
version: 1.0.0
owner: Chief Software Architect
reviewer: Knowledge Architect
created: 2026-07-28
updated: 2026-07-28
depends_on:
  - MANIFESTO-001
related_docs:
  - KOS-001
  - DOMAIN-001
tags:
  - engineering
  - principles
  - architecture
  - standards
---

# PTX ENGINEERING PRINCIPLES
## Tám Nguyên Tắc Kỹ Thuật Cốt Lõi v1.0.0

---

Tài liệu này định hình tư duy kỹ thuật và tiêu chuẩn đưa ra quyết định cho toàn bộ Kỹ sư và AI Agents làm việc trên hệ thống PTX Platform.

---

### 1. Product First (Sản phẩm là Trên hết)
Mọi dòng code, bảng database, hay kiến trúc hạ tầng được xây dựng đều phải phục vụ cho mục tiêu mang lại giá trị sản phẩm rõ ràng cho người dùng (Vận động viên, Ban tổ chức, Khán giả). Tránh hiện tượng "Over-Engineering" vì sở thích công nghệ cá nhân.

### 2. Security by Default (Bảo mật mặc định)
Bảo mật không phải là tính năng thêm vào sau cùng. 
* Mọi API Endpoint đều phải qua Auth Guard & Zod Validation.
* Mọi truy vấn Supabase PostgreSQL bắt buộc phải được bảo vệ bởi Row Level Security (RLS) policies chặt chẽ.
* Audit Log không thể bị xóa hoặc sửa đổi (`Immutable Audit Log`).

### 3. Simplicity over Cleverness (Đơn giản vượt trên Phức tạp)
Ưu tiên giải pháp đơn giản, dễ đọc, dễ bảo trì hơn là các giải pháp mã nguồn quá "tinh vi" nhưng khó hiểu. Code được viết ra để con người đọc nhiều hơn là cho máy chạy.

### 4. Explicit over Implicit (Rõ ràng thay vì Ngầm định)
Không giả định hay che giấu logic ngầm. 
* Data type, API Parameters, Return values đều phải khai báo rõ ràng bằng TypeScript Strict Types và Zod Schema.
* Tránh xài `any` hoặc ngầm định ép kiểu (implicit coercion).

### 5. Type Safety (An toàn Kiểu dữ liệu 100%)
Toàn bộ luồng dữ liệu từ Database Schema → Supabase SSR Client → Service Layer → API Route → Client Component bắt buộc phải đồng bộ Type 100%. Mọi sai lệch về Type phải được phát hiện ngay ở thời điểm Compile-time.

### 6. Documentation as Code (Tài liệu chính là Mã nguồn)
Tài liệu kỹ thuật được lưu giữ ngay trong Repository dưới dạng Markdown/MDX, có định phiên bản (Git), có kiểm tra cú pháp và được cập nhật đồng thời trong cùng một Pull Request với thay đổi code.

### 7. Backward Compatibility (Tương thích Ngược)
Mọi thay đổi liên quan đến Database Schema, RPC Function hoặc API Contracts phải đảm bảo tính tương thích ngược. Tránh gây ra "Breaking Changes" đột ngột làm gãy các ứng dụng Client hoặc Mobile App đang chạy.

### 8. Progressive Enhancement (Nâng cấp Cuốn chiếu)
Xây dựng hệ thống theo hướng từng bước cải tiến:
* Core features (Bảng xếp hạng, Kết quả trận đấu) phải hoạt động siêu nhanh và tin cậy ở mức căn bản.
* Các tính năng nâng cao (Dynamic 3D Tactical Pitch, Realtime Fireworks Canvas, Audio Synthesizer, AI Match Story) được bổ sung dưới dạng module tải động mà không làm ảnh hưởng đến lõi hệ thống.
