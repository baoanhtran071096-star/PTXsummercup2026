---
id: BUS-FLOW-001
title: PTX Tournament Workflows & Operational Lifecycles
layer: Business
category: Business Workflows
status: Approved
version: 1.0.0
owner: Product Owner
reviewer: Chief Software Architect
created: 2026-07-28
updated: 2026-07-28
depends_on:
  - BUS-CAP-001
  - BUS-RULE-001
related_docs:
  - PROD-MATCH-001
  - PLAY-DEPLOY-001
impacts_on:
  - API-MATCH-001
  - UI-MATCH-001
tags:
  - workflows
  - operational-flow
  - match-lifecycle
---

# PTX TOURNAMENT WORKFLOWS
## Quy Trình Vận Hành Giải Đấu & Trận Đấu v1.0.0

---

## 🧭 BA CÂU HỎI KIẾN TRÚC BẮT BUỘC (MANDATORY THREE QUESTIONS)

1. **Tài liệu này giải quyết vấn đề gì?**
   * Mô tả toàn bộ các luồng quy trình vận hành (Operational Workflows) từ khi khởi tạo mùa giải, lập lịch thi đấu, điều hành bàn trọng tài live, cho đến khi tổng kết giải đấu và trao giải.
2. **Nó phụ thuộc vào những tài liệu nào?**
   * Phụ thuộc vào `BUS-CAP-001` (Mô hình Năng lực) và `BUS-RULE-001` (Quy tắc Nghiệp vụ).
3. **Những tài liệu nào sẽ bị ảnh hưởng nếu nó thay đổi?**
   * Các màn hình giao diện UI/UX của Trọng tài bàn (`/admin/live-control`), API Route xử lý trận đấu, và kịch bản kiểm thử QA Test Cases.

---

## 1. LUỒNG QUY TRÌNH MÙA GIẢI (SEASON LIFECYCLE WORKFLOW)

```
[1. DRAFT] ──> [2. REGISTRATION] ──> [3. FIXTURE_GEN] ──> [4. IN_PROGRESS] ──> [5. COMPLETED]
   Khởi tạo       Đăng ký Đội          Tạo Lịch đấu         Thi đấu Live          Tổng kết trao giải
```

### Bước 1: Draft (Khởi tạo Mùa giải)
* BTC tạo thông tin Mùa giải (`Season`), thiết lập số lượng đội, số bảng đấu và chọn thể thức thi đấu.

### Bước 2: Registration (Mở Đăng ký Đội & Cầu thủ)
* BTC duyệt danh sách Đội bóng tham gia (`Teams`) và duyệt danh sách Cầu thủ (`Roster Validation`).
* Kiểm tra ảnh đại diện, số áo và thông tin VĐV theo `RULE-003` & `RULE-004`.

### Bước 3: Fixture Generation (Tạo Lịch thi đấu)
* Động cơ xếp lịch (`Fixture Engine`) tự động sinh lịch thi đấu theo thể thức Vòng tròn (Round Robin) hoặc Chia bảng.
* BTC gán Sân thi đấu và Khung giờ thi đấu cho từng trận.

### Bước 4: In-Progress (Thi đấu Live)
* Các trận đấu diễn ra theo lịch.
* Trọng tài bàn vận hành console `/admin/live-control` để cập nhật bàn thắng, thẻ phạt, thời gian trận đấu realtime.

### Bước 5: Completed (Tổng kết & Đóng Mùa giải)
* Động cơ xếp hạng cập nhật kết quả Bảng xếp hạng cuối cùng (`v_standings`).
* Hệ thống AI khởi tạo bài báo tổng kết giải đấu và vinh danh danh hiệu cá nhân (Vua phá lưới, Thủ môn xuất sắc, MVP).

---

## 2. LUỒNG QUY TRÌNH ĐIỀU HÀNH TRẬN ĐẤU LIVE (MATCH LIVE CONTROL WORKFLOW)

```
[BÀN TRỌNG TÀI CONTROL ROOM]
       │
       ├── 1. Kiểm tra Danh sách Đăng ký Thi đấu (Lineup Check)
       ├── 2. Bấm nút Bắt đầu Trận đấu (Start Match Event)
       ├── 3. Ghi nhận Sự kiện Bàn thắng / Thẻ phạt Realtime (RPC Atomic call)
       ├── 4. Bùng nổ Canvas Pháo hoa + Âm thanh Còi (Web Audio Synthesizer)
       ├── 5. Phát sóng Broadcast Signal tới Khán giả (WebSocket / SSE Push)
       └── 6. Thổi còi Kết thúc Trận đấu (Finish Match & Lock Event Stream)
```

---

## 3. LUỒNG XỬ LÝ KHI CÓ KHIẾU NẠI HOẶC SỬA LỖI BÀN THẮNG

1. Trong trường hợp Trọng tài bàn nhập sai bàn thắng hoặc sai tên cầu thủ:
2. Trọng tài bấm nút **"Undo Last Event"** hoặc chọn sự kiện trong nhật ký trận đấu để kích hoạt hàm RPC `fn_rollback_event`.
3. Hệ thống cập nhật lại tỷ số trận đấu, điều chỉnh lại danh sách Vua phá lưới và tính toán lại Bảng xếp hạng tức thì trong vòng 50ms.
