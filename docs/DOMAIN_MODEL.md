---
id: DOMAIN-001
title: PTX Platform Domain Model & Entity Hierarchy
layer: Foundation
category: Domain Architecture
status: Approved
version: 1.0.0
owner: Chief Software Architect
reviewer: Knowledge Architect
created: 2026-07-28
updated: 2026-07-28
depends_on:
  - MANIFESTO-001
related_docs:
  - GLOSSARY-001
  - KOS-001
tags:
  - domain-model
  - entities
  - hierarchy
  - database-mapping
---

# PTX DOMAIN MODEL
## Mô Hình Miền Nghiệp Vụ & Phân Tầng Thực Thể v1.0.0

---

## 1. TỔNG QUAN PHÂN TẦNG MIỀN (DOMAINS HIERARCHY)

Hệ thống PTX Platform được xây dựng dựa trên mô hình phân tầng thực thể (Entity Hierarchy) đa người dùng (Multi-tenant) chuẩn xác phục vụ bóng đá phong trào và chuyên nghiệp:

```
[Organization] (Tenant Lõi)
      │
      └── [Tournament] (Giải đấu)
                │
                └── [Season] (Mùa giải)
                          │
                          └── [Division / Group] (Bảng đấu / Hạng đấu)
                                    │
                                    ├── [Team] (Đội bóng tham gia)
                                    │     │
                                    │     └── [Player] (Cầu thủ / VĐV)
                                    │
                                    └── [Match / Fixture] (Trận đấu)
                                              │
                                              ├── [Match Event] (Sự kiện: Bàn thắng, Thẻ, MVP)
                                              │
                                              └── [Statistics] (Thống kê: BXH, Vua phá lưới)
```

---

## 2. CHI TIẾT CÁC THỰC THỂ CỐT LÕI (CORE ENTITIES SPECIFICATION)

### 2.1 Organization (`org`) — Tenant Lõi
* **Định nghĩa**: Đơn vị quản lý cấp cao nhất (doanh nghiệp, liên đoàn, trung tâm thể thao).
* **Thuộc tính chính**: `id`, `name`, `slug`, `logo_url`, `settings_json`, `created_at`.
* **Quy tắc miền**: Mỗi dữ liệu mùa giải, đội bóng, trận đấu đều phải gắn chặt với một `org_id`.

### 2.2 Tournament & Season (`season`) — Giải đấu & Mùa giải
* **Định nghĩa**: Một giải đấu có thể có nhiều mùa giải theo các năm khác nhau.
* **Thuộc tính chính**: `id`, `org_id`, `name`, `year`, `format_type` (Vòng tròn, Cúp knock-out, Chia bảng), `is_active`.

### 2.3 Team (`team`) — Đội bóng
* **Định nghĩa**: Tập hợp các cầu thủ tham gia tranh tài trong một mùa giải cụ thể.
* **Thuộc tính chính**: `id`, `season_id`, `name`, `full_name`, `icon`, `color_primary`, `color_secondary`, `ovr_rating`, `stats_json`.

### 2.4 Player (`player`) — Cầu thủ / Vận động viên
* **Định nghĩa**: Cá nhân thi đấu trong danh sách đăng ký của đội bóng.
* **Thuộc tính chính**: `id`, `team_id`, `name`, `shirt_number`, `position` (GK, Fixo, Ala, Pivot), `avatar_url`, `goals`, `assists`, `mvp_count`.

### 2.5 Match (`match`) — Trận đấu / Fixture
* **Định nghĩa**: Cuộc đối đầu trực tiếp giữa Đội Nhà (Home Team) và Đội Khách (Away Team).
* **Thuộc tính chính**: `id`, `season_id`, `home_team_id`, `away_team_id`, `home_score`, `away_score`, `status` (Scheduled, Live, Completed), `scheduled_at`, `pitch_number`.

### 2.6 Match Event (`match_event`) — Sự kiện Trận đấu
* **Định nghĩa**: Hành vi diễn ra trong trận đấu do Trọng tài bàn ghi nhận realtime.
* **Event Types**: `GOAL`, `YELLOW_CARD`, `RED_CARD`, `OWN_GOAL`, `SUBSTITUTION`, `PERIOD_START`, `PERIOD_END`.

### 2.7 Statistics (`v_standings`) — Thống kê & Bảng xếp hạng
* **Định nghĩa**: Dữ liệu tổng hợp tính toán tự động qua PostgreSQL View.
* **Chỉ số**: `Played (P)`, `Won (W)`, `Drawn (D)`, `Lost (L)`, `Goals For (GF)`, `Goals Against (GA)`, `Goal Difference (GD)`, `Points (PTS)`.

---

## 3. MÁY TRẠNG THÁI TRẬN ĐẤU (MATCH STATE MACHINE)

```
[SCHEDULED] ──(Bắt đầu trận)──> [LIVE_HALF_1] ──(Hết Hệp 1)──> [HALF_TIME]
                                                                     │
[COMPLETED] <──(Còi kết thúc)── [LIVE_HALF_2] <──(Bắt đầu Hệp 2)────┘
```
