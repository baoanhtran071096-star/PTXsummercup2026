---
id: GLOSSARY-001
title: PTX Platform Ubiquitous Language Glossary
layer: Foundation
category: Dictionary
status: Approved
version: 1.0.0
owner: Knowledge Architect
reviewer: Chief Software Architect
created: 2026-07-28
updated: 2026-07-28
depends_on:
  - DOMAIN-001
related_docs:
  - MANIFESTO-001
tags:
  - glossary
  - ubiquitous-language
  - terminology
---

# PTX UBIQUITOUS LANGUAGE GLOSSARY
## Từ Điển Thuật Ngữ Chuẩn Hóa Duy Nhất v1.0.0

---

Tài liệu này chuẩn hóa **"Ngôn ngữ chung" (Ubiquitous Language)** áp dụng thống nhất cho cả Product Team, Engineering Team, QA, và các Hệ thống AI Agents. Mọi sự khác biệt về cách gọi đều phải quy chiếu về từ điển này.

---

## 1. THUẬT NGỮ NGHIỆP VỤ ĐỘI BÓNG & GIẢI ĐẤU (TOURNAMENT & DOMAIN)

| Thuật ngữ | Tiếng Anh | Định nghĩa Chuẩn |
| :--- | :--- | :--- |
| **Organization** | Organization | Thực thể quản lý đa khách hàng (Tenant), chứa các mùa giải và dữ liệu riêng biệt. |
| **Tournament** | Tournament | Tên gọi chung của một thương hiệu giải đấu (Ví dụ: PTX Summer Cup). |
| **Season** | Season | Một mùa giải thi đấu cụ thể gắn liền với mốc thời gian/năm. |
| **Fixture** | Fixture | Lịch thi đấu tổng thể được lập kế hoạch trước cho toàn bộ giải đấu. |
| **Match** | Match | Một trận đấu cụ thể diễn ra giữa 2 đội bóng. |
| **Round** | Round | Vòng đấu (Vòng 1, Vòng 2, Vòng Tứ kết, Bán kết, Chung kết). |
| **Group / Division** | Division / Group | Bảng đấu (Bảng A, Bảng B) hoặc Hạng đấu trong một mùa giải. |
| **Squad / Roster** | Squad / Roster | Danh sách chính thức tất cả các cầu thủ được đăng ký thi đấu cho một mùa giải. |
| **Lineup** | Lineup | Danh sách thi đấu đăng ký riêng cho một trận đấu cụ thể (5 chính thức + dự bị). |
| **MVP** | Most Valuable Player | Cầu thủ xuất sắc nhất trận đấu hoặc toàn giải đấu. |

---

## 2. THUẬT NGỮ CHIẾN THUẬT SÂN 5 / FUTSAL (5-A-SIDE TACTICS)

| Thuật ngữ | Vị trí / Sơ đồ | Định nghĩa Chuẩn |
| :--- | :--- | :--- |
| **GK** | Goalkeeper | Thủ môn bảo vệ khung thành. |
| **Fixo** | Defender / Fixo | Hậu vệ thòng phòng ngự khu vực trung tâm, chỉ huy hàng thủ Sân 5. |
| **Ala (Left / Right)** | Wingers / Ala | Cầu thủ thi đấu 2 biên (Cánh trái / Cánh phải) vừa hỗ trợ tấn công vừa bọc lót. |
| **Pivot** | Striker / Pivot | Tiền đạo cắm làm tường, đè người và dứt điểm cận thành. |
| **Power Play** | Tactical Scheme | Chiến thuật rút thủ môn ra để thay bằng 1 cầu thủ thi đấu (dâng cao 5 cầu thủ tấn công). |
| **OVR Rating** | Player Rating | Chỉ số năng lực tổng hợp (Overall) của cầu thủ tính trên thang điểm 100. |

---

## 3. THUẬT NGỮ KỸ THUẬT & HỆ THỐNG (TECHNICAL & SYSTEM)

| Thuật ngữ | Khái niệm Kỹ thuật | Định nghĩa Chuẩn |
| :--- | :--- | :--- |
| **Knowledge Object** | KOS Unit | Một file tài liệu tri thức mang định dạng YAML Frontmatter Metadata đầy đủ. |
| **Atomic RPC** | PostgreSQL RPC | Hàm xử lý giao dịch phức tạp trực tiếp trong PostgreSQL DB để tránh nghẽn logic. |
| **Client Component** | Next.js 14 Component | Component React chạy ở phía Browser Client, có chứa state tương tác trực tiếp. |
| **Server Component** | Next.js 14 Component | Component React mặc định render ở phía Server, không gửi JS thừa xuống Client. |
| **RLS Policy** | Supabase Security | Quy tắc bảo mật phân quyền dòng dữ liệu cấp PostgreSQL Database. |
| **Quality Gate** | Verification Gate | BỘ tiêu chí bắt buộc phải vượt qua trước khi code/tài liệu được phê duyệt. |
