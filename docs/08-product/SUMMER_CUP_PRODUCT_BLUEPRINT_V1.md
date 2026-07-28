---
id: PROD-BLUEPRINT-001
title: PTX Summer Cup Product Blueprint v1.0
layer: Product Specification
category: Product Discovery & Execution
status: Approved
version: 1.0.0
owner: Product Owner & Ren (Chief Product & Architecture Officer)
reviewer: Claude (Lead Engineer)
created: 2026-07-29
updated: 2026-07-29
---

# PTX SUMMER CUP - PRODUCT BLUEPRINT v1.0
## Nền Tảng Quản Lý Giải Đấu Bóng Đá Hiện Đại & Thông Minh

---

## 1. VISION & SUCCESS METRICS (TUYÊN NGÔN & KPI SẢN PHẨM)

### 🌟 Product North Star Statement
> **"Xây dựng nền tảng quản lý giải đấu bóng đá hiện đại, giúp Ban tổ chức vận hành giải đấu nhanh hơn, minh bạch hơn và chuyên nghiệp hơn."**

### 💡 Value Proposition (Giá trị Khác biệt)
* **Vận hành Siêu tốc**: Ban tổ chức khởi tạo giải đấu hoàn chỉnh chỉ trong **dưới 10 phút**.
* **Đăng ký Đơn giản**: Đội trưởng đăng ký danh sách cầu thủ tự động qua link rút gọn trong **dưới 2 phút**.
* **Cập nhật Live 100%**: Tự động cập nhật Bảng xếp hạng, Vua phá lưới & Thẻ phạt ngay khi trọng tài nhập tỷ số.
* **Chi phí Thấp & Minh bạch**: Không còn tranh cãi về điều lệ hay thống kê thủ công trên Excel/Google Sheets.

### 🎯 Success Metrics (Chỉ số Thành công)
| Chỉ số Đo lường | Mục tiêu MVP | Phương pháp Đo lường |
| :--- | :--- | :--- |
| **Real Users** | **500+ Người dùng thực** | Số lượng tài khoản đăng ký & thao tác trên hệ thống. |
| **Active Tournaments** | **5+ Giải đấu live thực tế** | Số giải đấu khởi tạo và kết thúc thành công trên PTX. |
| **Enrollment Speed** | **< 2 phút / Đội** | Telemetry thời gian thực từ lúc click link đăng ký tới hoàn tất. |
| **Registration Completion Rate** | **95%+** | Tỷ lệ hoàn thành form đăng ký không bị bỏ dở giữa chừng. |
| **User Satisfaction (CSAT)** | **> 4.5 / 5.0** | Khảo sát đánh giá trực tiếp sau giải đấu. |

---

## 2. PERSONAS (CHÂN DUNG NGƯỜI DÙNG)

### 👔 Persona 1: Ban Tổ Chức (Organizer)
* **Chân dung**: Anh Nam (32 tuổi) - Trưởng Ban thể thao doanh nghiệp / Người tổ chức giải đấu phong trào.
* **Pain points**: Tốn hàng giờ tạo lịch thi đấu bằng tay; mệt mỏi vì nhập kết quả Excel; bị tố thiếu minh bạch.
* **Nhu cầu**: Muốn tạo giải siêu tốc, tự động xếp lịch thi đấu, cập nhật BXH tự động, giao diện đẹp chuyên nghiệp.

### 🧢 Persona 2: Đội Trưởng (Team Captain)
* **Chân dung**: Anh Huy (28 tuổi) - Đội trưởng đội bóng FC Về Nhì.
* **Pain points**: Phải thu thập ảnh căn cước/số áo của 20 thành viên qua Zalo; form rắc rối; quên lịch thi đấu.
* **Nhu cầu**: Đăng ký danh sách online siêu nhanh qua điện thoại; nhận thông báo lịch đấu qua Zalo/SMS.

### ⚽ Persona 3: Cầu Thủ (Player)
* **Chân dung**: Tuấn (24 tuổi) - Tiền đạo FC Về Nhì.
* **Pain points**: Không biết mình ghi bao nhiêu bàn; không theo dõi được danh sách thẻ phạt.
* **Nhu cầu**: Trang cá nhân hiển thị số bàn thắng, số thẻ, số trận đã đấu chuyên nghiệp.

### 🟨 Persona 4: Trọng Tài (Referee)
* **Chân dung**: Anh Hùng (35 tuổi) - Trọng tài giải phong trào.
* **Pain points**: Biên bản giấy dễ rách/thất lạc; nhập kết quả sau trận đấu chậm trễ.
* **Nhu cầu**: Giao diện Live Match Console mobile siêu đơn giản để nhập bàn thắng/thẻ phạt ngay tại sân.

### 📣 Persona 5: Khán Giả (Spectator / Fan)
* **Chân dung**: Minh (22 tuổi) - Khán giả theo dõi giải đấu.
* **Pain points**: Phải hỏi kết quả qua nhóm Zalo; BXH cập nhật chậm 1-2 ngày.
* **Nhu cầu**: Trang công khai xem Live tỷ số, BXH, Top ghi bàn mượt mà trên di động.

---

## 3. USER JOURNEY & PAIN POINTS (HÀNH TRÌNH NGƯỜI DÙNG)

```text
BAN TỔ CHỨC:  [Tạo Giải] ──> [Tự động Xếp Lịch] ──> [Mời Đội Đăng Ký] ──> [Duyệt Đội] ──> [Vận Hành Live]
ĐỘI TRƯỞNG:   [Nhận Link] ──> [Điền Form Online] ──> [Tải Ảnh Cầu Thủ] ──> [Xác Nhận]
KHÁN GIẢ:     [Mở Trang Giải] ──> [Xem Live Tỷ Số] ──> [Xem BXH Tự Động] ──> [Chia Sẻ Social]
```

---

## 4. FEATURE PRIORITIZATION — MVP VERTICAL SLICES (10 TÍNH NĂNG CỐT LÕI)

| STT | Tính Năng MVP | Phân Vùng Người Dùng | Mô Tả Giá Trị Dịch Chuyển (Value Slice) |
| :--- | :--- | :--- | :--- |
| **F1** | Khởi tạo Giải đấu (<10 min) | Ban Tổ Chức | Khai báo tên giải, số đội, thể thức (Vòng tròn/Knockout). |
| **F2** | Link Đăng ký Đội Siêu Tốc | Đội Trưởng | Đăng ký thông tin đội & màu áo qua đường dẫn rút gọn. |
| **F3** | Đăng ký Danh sách Cầu thủ | Đội Trưởng | Nhập danh sách cầu thủ, số áo, vị trí trên điện thoại. |
| **F4** | Duyệt Đội & Khóa Danh sách | Ban Tổ Chức | Thẩm định và duyệt hồ sơ các đội bóng tham gia. |
| **F5** | Tự động Sinh Lịch thi đấu | Ban Tổ Chức | Thuật toán tự động chia bảng và sắp xếp lịch đấu. |
| **F6** | Live Match Console Mobile | Trọng tài / BTC | Nhập bàn thắng, thẻ phạt, cầu thủ ghi bàn ngay trên sân. |
| **F7** | Tự động Cập nhật BXH | Hệ thống | Tính điểm (Thắng 3, Hòa 1, Thua 0), Hiệu số & Đối đầu live. |
| **F8** | Trang Thống kê Top Ghi bàn | Tất cả người dùng | Bảng xếp hạng Vua phá lưới (Golden Boot Tracker). |
| **F9** | Public Match Portal | Khán giả | Trang thông tin giải đấu public tối ưu di động (Responsive). |
| **F10**| Xuất Báo cáo Giải đấu | Ban Tổ Chức | Export PDF/Excel tổng kết giải đấu nhanh chóng. |

---

## 5. PRODUCT BACKLOG & VERTICAL SPRINTS

### 🚀 Vertical Slice Sprint 1: Đăng Ký Đội & Khởi Tạo Giải (Complete End-to-End)
* **Goal**: Đội trưởng có thể đăng ký giải đấu từ UI ➔ API ➔ Supabase DB ➔ Phân quyền JWT trong <2 phút.

### 📅 Vertical Slice Sprint 2: Lịch Thi Đấu & Quản Lý Trận Đấu
* **Goal**: Ban tổ chức sinh lịch đấu tự động và xem chi tiết từng trận đấu.

### ⚽ Vertical Slice Sprint 3: Live Match Console & BXH Tự Động
* **Goal**: Nhập bàn thắng live và tự động cập nhật BXH ngay tức thì.

---

## 6. RELEASE DEFINITION (DEFINITION OF DONE)

Một đợt phát hành MVP của **PTX Summer Cup** CHỈ ĐƯỢC PHÊ DUYỆT khi đạt đủ **5 Criteria**:
1. ✅ **Architecture**: Tuân thủ Clean 6-Layering Boundary & CIR v1.2.
2. ✅ **Implementation**: 0 lỗi TypeScript, 0 lỗi Runtime.
3. ✅ **Evidence**: Pass 100% Contract Test Suite (`npm run test`).
4. ✅ **UX Benchmark**: Người dùng thử nghiệm hoàn tất tạo giải <10 min, đăng ký <2 min.
5. ✅ **User Value**: Được Ban tổ chức giải đấu thực nghiệm xác nhận đồng ý đưa vào vận hành.
