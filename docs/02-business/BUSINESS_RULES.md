---
id: BUS-RULE-001
title: PTX Platform Master Business Rules Specification
layer: Business
category: Business Rules
status: Approved
version: 1.0.0
owner: Product Owner
reviewer: Chief Software Architect
created: 2026-07-28
updated: 2026-07-28
depends_on:
  - DOMAIN-001
  - BUS-CAP-001
related_docs:
  - BUS-FLOW-001
  - PROD-MATCH-001
impacts_on:
  - ENG-ARCH-001
  - DB-SCHEMA-001
  - API-MATCH-001
tags:
  - business-rules
  - tournament-rules
  - standings-rules
---

# PTX MASTER BUSINESS RULES
## Quy Tắc Nghiệp Vụ Cốt Lõi Giải Đấu v1.0.0

---

## 🧭 BA CÂU HỎI KIẾN TRÚC BẮT BUỘC (MANDATORY THREE QUESTIONS)

1. **Tài liệu này giải quyết vấn đề gì?**
   * Định nghĩa toàn bộ các quy tắc nghiệp vụ kinh điển và bắt buộc (Business Rules) áp dụng cho việc tính điểm, xếp hạng, kiểm tra hồ sơ cầu thủ và xử lý sự kiện thẻ phạt trong các giải đấu bóng đá PTX Platform.
2. **Nó phụ thuộc vào những tài liệu nào?**
   * Phụ thuộc vào `DOMAIN-001` (Mô hình miền) và `BUS-CAP-001` (Mô hình Năng lực Nghiệp vụ).
3. **Những tài liệu nào sẽ bị ảnh hưởng nếu nó thay đổi?**
   * PostgreSQL RPC Functions (`fn_add_goal`, `v_standings`), API Validation Schemas (Zod), và UI Display Logic.

---

## 1. QUY TẮC TÍNH ĐIỂM & ĐỨNG XẾP HẠNG (STANDINGS & POINTS RULES)

### RULE-001: Quy tắc Phân định Điểm số Trận đấu
* Đội **Thắng** trận: Được tính **3 điểm**.
* Đội **Hòa** trận: Được tính **1 điểm**.
* Đội **Thua** trận: Được tính **0 điểm**.

### RULE-002: Tiêu chí Xếp hạng Ưu tiên (Tie-breaking Order)
Khi có 2 hoặc nhiều đội bằng điểm nhau trong cùng một Bảng đấu/Mùa giải, thứ hạng xếp hạng trên Bảng xếp hạng sẽ được phân định theo thứ tự ưu tiên nghiêm ngặt sau:

1. **Tổng điểm** (Points - `PTS`).
2. **Hiệu số bàn thắng bại đối đầu trực tiếp** (Head-to-head Goal Difference).
3. **Số bàn thắng đối đầu trực tiếp** (Head-to-head Goals Scored).
4. **Hiệu số bàn thắng toàn giải** (Overall Goal Difference - `GD = GF - GA`).
5. **Tổng số bàn thắng toàn giải** (Overall Goals Scored - `GF`).
6. **Chỉ số Fair-play** (Đội nào ít điểm thẻ phạt hơn: 1 Thẻ vàng = -1d, 1 Thẻ đỏ = -3d).
7. **Bốc thăm may rủi** (hoặc tung đồng xu do BTC quyết định).

---

## 2. QUY TẮC ĐĂNG KÝ VÀ HỒ SƠ THI ĐẤU (ROSTER & SQUAD RULES)

### RULE-003: Giới hạn Danh sách Đội hình (Roster Limits)
* Mỗi đội bóng được đăng ký tối đa **20 cầu thủ** cho một Mùa giải (`Season Squad`).
* Danh sách đăng ký thi đấu cho một trận cụ thể (`Match Lineup` Sân 5): Tối đa **5 cầu thủ chính thức** (bao gồm 1 Thủ môn) và tối đa **7 cầu thủ dự bị**.

### RULE-004: Quy tắc Số áo Cầu thủ (Shirt Number Policy)
* Trong cùng một Mùa giải của một Đội bóng, không thể có 2 cầu thủ trùng số áo.
* Cầu thủ bắt buộc mang đúng số áo đã đăng ký trên hệ thống khi ra sân thi đấu.

---

## 3. QUY TẮC THẺ PHẠT VÀ TREO GIÒ (CARDS & DISCIPLINARY RULES)

### RULE-005: Quy tắc Thẻ vàng & Thẻ đỏ
* **1 Thẻ đỏ trực tiếp** hoặc **2 Thẻ vàng trong cùng 1 trận**: Cầu thủ lập tức bị truất quyền thi đấu và bị treo giò ở **trận đấu tiếp theo**.
* **Cộng dồn 2 Thẻ vàng ở 2 trận đấu khác nhau** trong cùng giải đấu: Cầu thủ sẽ bị tự động treo giò **1 trận tiếp theo**.

### RULE-006: Thẻ phạt và Quyền thay người Sân 5 (Futsal Substitution Rule)
* Khi một cầu thủ bị thẻ đỏ truất quyền thi đấu, đội bóng phải thi đấu thiếu người trong **2 phút**. Sau 2 phút (hoặc nếu đội thi đấu thiếu người bị thủng lưới trước khi hết 2 phút), đội bóng mới được phép tung 1 cầu thủ dự bị vào thay thế.

---

## 4. QUY TẮC SỰ KIỆN TRẬN ĐẤU & CẬP NHẬT REALTIME (REALTIME EVENTS)

### RULE-007: Ghi nhận Bàn thắng Atomic
* Mọi bàn thắng ghi nhận phải chỉ rõ: Cầu thủ ghi bàn (`player_id`), Số phút (`minute`), và loại bàn thắng (`NORMAL`, `PENALTY`, `FREE_KICK`, `OWN_GOAL`).
* Khi ghi nhận `OWN_GOAL` (Phản lưới nhà), bàn thắng được cộng vào tỷ số của đội đối phương, nhưng không được tính vào chỉ số Vua phá lưới (`Top Scorers`) của cầu thủ đó.
