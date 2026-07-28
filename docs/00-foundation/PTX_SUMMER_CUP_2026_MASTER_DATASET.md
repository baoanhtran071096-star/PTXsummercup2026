---
id: KOS-DOC-MASTER-DATASET-001
type: KNOWLEDGE_DOCUMENT
title: PTX Summer Cup 2026 Master Dataset
version: 1.0.1
status: APPROVED
owner: ren-chief-architect
layer: foundation
category: dataset
updatedAt: 2026-07-29
tags:
  - dataset
  - master-data
  - roster
  - legacy-data
---

# PTX Summer Cup 2026 — Master Dataset (Single Source of Truth)

Tài liệu chuẩn hóa **Master Dataset v1.0.1** dành cho toàn bộ các module trong hệ thống **PTX Platform Enterprise System**.

---

## 🏆 1. THÔNG TIN GIẢI ĐẤU (TOURNAMENT METADATA)

| Hạng Mục | Giá Trị Chuẩn |
| :--- | :--- |
| **Tên Giải Đấu** | PTX Summer Cup 2026 |
| **Phiên Bản Nền Tảng** | PTX Platform Enterprise v1.0.1 |
| **Thể Thức Thi Đấu** | Giải Bóng Đá Sân 5 (5-a-side Football) |
| **Số Lượng Đội** | 3 Đội Bóng Thật |
| **Tổng Số Cầu Thủ** | 26 Cầu Thủ Đăng Ký |
| **Đơn Vị Tổ Chức** | Ban Tổ Chức PTX Group |
| **Nhà Tài Trợ Kim Cương** | Vinamilk, Viettel |

---

## 👥 2. DANH SÁCH 3 ĐỘI BÓNG THẬT (REAL LEGACY TEAMS)

| ID | Tên Đội | Mã Đội | Logo | Số Cầu Thủ | Trận | T - H - B | Điểm | Hiệu Số |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `team_01` | **FC QUẢN LÝ** | `QL` | 🛡️ | 26 | 4 | 3 - 1 - 0 | 10 | +10 (14-4) |
| `team_02` | **FC VỀ NHÌ** | `VN` | ⭐ | 18 | 4 | 2 - 1 - 1 | 7 | +3 (9-6) |
| `team_03` | **FC TIÊN PHONG** | `TP` | 🚀 | 16 | 4 | 0 - 0 - 4 | 0 | -13 (3-16) |

---

## 🧍 3. BẢNG ROSTER 26 CẦU THỦ THẬT (SINGLE SOURCE OF TRUTH)

| STT | Tên In Áo (Jersey Name) | Họ Tên Thật (Full Name) | Số Áo | Size Áo | Đội Bóng | Trạng Thái In | Trạng Thái Phát | Ghi Chú Nghiệp Vụ |
| :---: | :--- | :--- | :---: | :---: | :--- | :---: | :---: | :--- |
| 1 | **Nguyễn Sử** | Nguyễn Sử | `#10` | 2XL | FC QUẢN LÝ | ☑ Đã In | ☑ Đã Phát | Cầu thủ chính |
| 2 | **Đình Huy** | Đình Huy | `#14` | 2XL | FC QUẢN LÝ | ☑ Đã In | ☑ Đã Phát | Cầu thủ chính |
| 3 | **ANH TỪ** | ANH TỪ | `#7` | XL | FC QUẢN LÝ | ☑ Đã In | ☑ Đã Phát | Cầu thủ chính |
| 4 | **Mạnh Tún** | Mạnh Tún | `#02` | XL | FC QUẢN LÝ | ☑ Đã In | ☑ Đã Phát | Cầu thủ chính |
| 5 | **Erling HaaTháiland** | Erling HaaTháiland | `#9` | 2XL | FC QUẢN LÝ | ☑ Đã In | ☑ Đã Phát | Tiền đạo |
| 6 | **Kylian mBAppé** | **Trần Bảo Anh** | `#9.5` | 2XL | FC QUẢN LÝ | ☑ Đã In | ☑ Đã Phát | **Lead Developer & Captain [C]** |
| 7 | **M.Marquez** | M.Marquez | `#93` | XL | FC QUẢN LÝ | ☑ Đã In | ☑ Đã Phát | Cầu thủ chính |
| 8 | **YuNaKa** | YuNaKa | `#10` | M | FC QUẢN LÝ | ☑ Đã In | ☑ Đã Phát | Cầu thủ chính |
| 9 | **ToQ** | ToQ | `N/A` | XL | FC QUẢN LÝ | ☑ Đã In | ⏳ Chưa Phát | Ghi chú: Không in số |
| 10 | **VERL** | VERL | `#11` | XL | FC QUẢN LÝ | ☑ Đã In | ☑ Đã Phát | Cầu thủ chính |
| 11 | **AmphetamiN** | AmphetamiN | `#24` | 3XL | FC QUẢN LÝ | ☑ Đã In | ☑ Đã Phát | Cầu thủ chính |
| 12 | **ĐQ** | ĐQ | `#04` | XL | FC QUẢN LÝ | ☑ Đã In | ☑ Đã Phát | Cầu thủ chính |
| 13 | **Mr.Cry** | Mr.Cry | `#76` | XL | FC QUẢN LÝ | ☑ Đã In | ☑ Đã Phát | Cầu thủ chính |
| 14 | **Marcus** | Marcus | `#12` | S | FC QUẢN LÝ | ☑ Đã In | ☑ Đã Phát | Cầu thủ chính |
| 15 | **De** | De | `#79` | XL | FC QUẢN LÝ | ☑ Đã In | ☑ Đã Phát | Cầu thủ chính |
| 16 | **Jub** | Jub | `#19` | 2XL | FC QUẢN LÝ | ☑ Đã In | ☑ Đã Phát | Cầu thủ chính |
| 17 | **Mon Trésor** | Mon Trésor | `#13` | 2XL | FC QUẢN LÝ | ☑ Đã In | ☑ Đã Phát | Cầu thủ chính |
| 18 | **Anh Trương** | Anh Trương | `#05` | L | FC QUẢN LÝ | ☑ Đã In | ☑ Đã Phát | Cầu thủ chính |
| 19 | **Nam Kun** | Nam Kun | `#70` | L | FC QUẢN LÝ | ☑ Đã In | ☑ Đã Phát | Ghi chú: Áo tím |
| 20 | **Khang Nguyễn** | Khang Nguyễn | `#19` | L | FC QUẢN LÝ | ☑ Đã In | ☑ Đã Phát | Cầu thủ chính |
| 21 | **Bắp Kun** | Bắp Kun | `#10` | Trẻ em | FC QUẢN LÝ | ☑ Đã In | ☑ Đã Phát | Ghi chú: Size trẻ em |
| 22 | **LA** | LA | `#80` | XL | FC QUẢN LÝ | ☑ Đã In | ☑ Đã Phát | Cầu thủ chính |
| 23 | **Dylan Lưu** | Dylan Lưu | `#22` | XL | FC QUẢN LÝ | ☑ Đã In | ☑ Đã Phát | Cầu thủ chính |
| 24 | **Long Phạm** | Long Phạm | `#13` | XL | FC QUẢN LÝ | ☑ Đã In | ☑ Đã Phát | Cầu thủ chính |
| 25 | **Phương Toàn** | Phương Toàn | `#21` | 2XL | FC QUẢN LÝ | ☑ Đã In | ☑ Đã Phát | Cầu thủ chính |
| 26 | **Cầu thủ Dự bị** | (Chưa in) | `N/A` | XL | FC QUẢN LÝ | ❌ Chưa In | ⏳ Chưa Phát | Ghi chú: Không tên, số |

---

## 📅 4. LỊCH THI ĐẤU VÀ ĐỊA ĐIỂM (FIXTURES & VENUE)

* **Địa điểm**: Sân bóng đá mini PTX Sports Complex (Thành phố Hồ Chí Minh).
* **Vòng 1**: FC QUẢN LÝ `3 - 1` FC VỀ NHÌ (Kylian mBAppé 14', 78' Hattrick).
* **Vòng 2**: FC QUẢN LÝ `4 - 1` FC TIÊN PHONG.
* **Vòng 3**: FC VỀ NHÌ `2 - 1` FC TIÊN PHONG.

---

## 🏅 5. HALL OF FAME & DANH HIỆU

* 👟 **Golden Boot (Vua Dội Bom)**: **Kylian mBAppé (#9.5)** — FC QUẢN LÝ (8 Bàn thắng | Lead Developer).
* 🏆 **MVP (Cầu Thủ Xuất Sắc Nhất)**: **Nguyễn Sử (#10)** — FC QUẢN LÝ (5 Kiến tạo).
* 🥇 **Đội Vô Địch (Champion)**: **FC QUẢN LÝ** (10 Điểm).

---

## 📸 6. ENTERPRISE DAM GALLERY & ASSET MAPPING

* Photo Asset 1: `ast_photo_001` (Khoảnh khắc bàn thắng Hattrick Kylian mBAppé 78').
* Photo Asset 2: `ast_photo_002` (Lễ bế mạc vinh danh FC QUẢN LÝ).
* Logo Asset QL: `ast_logo_fc_quan_ly` (WebP 256x256).
