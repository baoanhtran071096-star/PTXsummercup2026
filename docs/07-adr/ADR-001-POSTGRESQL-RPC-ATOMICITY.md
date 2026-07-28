---
id: ADR-001
title: PostgreSQL RPC Atomic Operations for Complex Match Calculations
layer: Governance
category: Architecture Decision Record
status: Approved
version: 1.0.0
owner: Chief Software Architect
reviewer: Knowledge Architect
created: 2026-07-28
updated: 2026-07-28
depends_on:
  - ENG-ARCH-001
  - DB-MATCH-001
related_docs:
  - PROD-MATCH-001
  - PRINCIPLE-001
tags:
  - adr
  - postgresql
  - rpc
  - atomic-operations
  - trade-offs
---

# ADR-001: PostgreSQL RPC Atomic Operations

---

## 1. STATUS
**APPROVED** — Quyết định kiến trúc chính thức áp dụng từ PTX Platform V2.0.

---

## 2. CONTEXT (BỐI CẢNH)
Trong hệ thống PTX Platform V2.0 (Multi-tenant Football Tournament Platform), các thao tác như ghi nhận bàn thắng (`fn_add_goal`), cập nhật điểm số trận đấu, và tính toán Bảng xếp hạng tức thì (`v_standings`) diễn ra với tần suất cao dưới áp lực hàng ngàn khán giả và trọng tài bàn cùng tương tác đồng thời.

Nếu xử lý tính toán điểm số và thứ hạng qua Node.js Multi-step API Transactions, hệ thống dễ gặp phải các vấn đề:
* Race Condition khi 2 sự kiện cập nhật cùng lúc.
* Latency cao do luồng dữ liệu phải quay qua lại nhiều vòng giữa API Node.js và Database Server.
* Không đảm bảo tính toàn vẹn dữ liệu nếu một bước trong chuỗi giao dịch API bị crash giữa chừng.

---

## 3. PROBLEM (VẤN ĐỀ CẦN GIẢI QUYẾT)
Đảm bảo tính nhất quán dữ liệu tuyệt đối (100% Data Atomicity), độ trễ thấp (< 50ms), và chống nghẽn Race Condition cho mọi thao tác ghi nhận bàn thắng và cập nhật bảng xếp hạng giải đấu.

---

## 4. OPTIONS CONSIDERED (CÁC PHƯƠNG ÁN ĐÃ XEM XÉT)

### Phương án A: Node.js Multi-step API Service Transaction
* *Mô tả*: API Route gọi lần lượt `INSERT match_events`, sau đó `SELECT` tất cả bàn thắng, tính lại score rồi `UPDATE matches`, cuối cùng `UPDATE team_stats`.
* *Nhược điểm*: Rất dễ bị Race Condition, nghẽn Network Roundtrips, tốn CPU Server Next.js.

### Phương án B: Message Queue Async Worker (Redis + BullMQ)
* *Mô tả*: API đẩy event vào Queue, Worker chạy ngầm để cập nhật BXH.
* *Nhược điểm*: Bảng xếp hạng bị Eventual Consistency (có độ trễ), không hiển thị điểm số tức thì cho khán giả trên sân.

### Phương án C (CHỌN): PostgreSQL Stored Procedure (RPC) & View Atomicity
* *Mô tả*: Thực thi toàn bộ giao dịch tính toán phức tạp bằng hàm PostgreSQL RPC (`fn_add_goal`) bọc trong DB Transaction duy nhất và truy vấn BXH qua PostgreSQL View (`v_standings`).

---

## 5. DECISION (QUYẾT ĐỊNH)
**Lựa chọn Phương án C**: Áp dụng quy tắc **Atomic RPC Rule**. Mọi giao dịch tính toán nghiệp vụ phức tạp bắt buộc thực thi trực tiếp tại PostgreSQL Database Level qua hàm RPC.

---

## 6. TRADE-OFFS & RISKS (ĐÁNH ĐỔI VÀ RỦI RO)

| Khía cạnh | Lợi ích thu được | Đánh đổi / Rủi ro | Giải pháp khắc phục |
| :--- | :--- | :--- | :--- |
| **Data Integrity** | Tuyệt đối nhất quán (ACID Transaction), chống Race Condition 100%. | Tight Coupling giữa ứng dụng và PostgreSQL. | Đóng gói migration SQL rõ ràng trong `supabase/migrations/`. |
| **Performance** | Tốc độ tính toán siêu nhanh (< 20ms) ngay tại DB engine. | Tăng tải CPU trên PostgreSQL Database instance. | Tối ưu Indexing trên `match_events` và `matches`. |
| **Testing** | Logic được đóng gói tập trung ở DB level. | Khó viết Unit Test hơn so với hàm TypeScript thuần. | Áp dụng framework kiểm thử DB `pgTAP` trong CI/CD pipeline. |

---

## 7. CONSEQUENCES (HỆ QUẢ)
1. Các Kỹ sư Backend khi viết tính năng ghi bàn/thẻ phạt bắt buộc tạo Migration SQL RPC thay vì viết multi-step query ở Next.js API route.
2. Mọi thay đổi logic tính điểm phải được cập nhật ở SQL Migration file và gắn tag Semantic Versioning.

---

## 8. REFERENCES (TÀI LIỆU THAM CHIẾU)
* [PostgreSQL RPC Documentation](https://supabase.com/docs/guides/database/functions)
* [STRICT_6_LAYER_ARCHITECTURE.md](file:///c:/Users/ASUS/Documents/antigravity/fervent-goodall/docs/04-engineering/STRICT_6_LAYER_ARCHITECTURE.md)
