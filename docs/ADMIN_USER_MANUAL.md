# 📘 TÀI LIỆU HƯỚNG DẪN QUẢN TRỊ ADMIN (ADMIN USER MANUAL)
**Sản phẩm:** PTX Sports Platform (v7.0 All-In-One)  
**Dành cho:** Ban Tổ Chức (BTC) & Quản trị viên Hệ thống  
**Ngày phát hành:** 31/07/2026

---

## 🔑 1. THÔNG TIN TRUY CẬP HỆ THỐNG
- **Địa chỉ Quản trị (Admin Portal):** `http://localhost:8000/` (hoặc domain chính thức `https://admin.ptxsummercup.vn`)
- **Tài khoản Admin mặc định:** `admin@ptxsummercup.vn`
- **Mật khẩu Admin mặc định:** `admin123`

---

## 🛠️ 2. HƯỚNG DẪN CÁC TÍNH NĂNG QUẢN TRỊ CỐT LÕI

### 2.1 BTC Smart Dashboard (Giám sát Thời gian thực)
- **Truy cập:** Chọn Tab `📊 BTC Smart Dashboard` trên thanh điều hướng.
- **Chỉ số theo dõi:**
  - **Active Users Realtime:** Số lượng cổ động viên đang truy cập trực tiếp.
  - **Dự đoán đã gửi:** Tổng số lượt dự đoán tỷ số từ người dùng.
  - **Độ chính xác AI:** Chỉ số đo lường hiệu suất AI Match Predictor V2.
  - **System Health:** Trạng thái hoạt động 99.99% của server.

### 2.2 Quản lý Đội bóng, Cầu thủ & Nhập xuất dữ liệu Excel
- **Nhập dữ liệu hàng loạt từ Excel:**
  - Truy cập chức năng Import Excel trong Admin Dashboard.
  - Chọn file mẫu `.xlsx` chứa thông tin danh sách Đội bóng / Cầu thủ và bấm **Import**. Hệ thống sẽ tự động xác thực và cập nhật dữ liệu.
- **Xuất dữ liệu Excel (Export):**
  - Bấm **Xuất Báo cáo Excel** để tải về tập tin `.xlsx` danh sách kết quả, bảng xếp hạng và vua phá lưới.

### 2.3 Xuất Báo cáo Giải đấu Dạng PDF
- **Chức năng:** Tự động tạo và render file báo cáo PDF chứa logo PTX Group, bảng xếp hạng chính thức, danh sách khen thưởng HOF để gửi lãnh đạo hoặc in ấn.
- **Thao tác:** Bấm nút **"Xuất Báo cáo PDF"** trong trang Quản lý Giải đấu.

### 2.4 Quản lý Phân quyền (RBAC) & Nhật ký Audit Log
- **Phân quyền người dùng:**
  - **Super Admin:** Toàn quyền quản trị hệ thống.
  - **Content Editor:** Quyền quản lý tin tức, video, bài viết.
  - **Data Manager:** Quyền cập nhật kết quả trận đấu & tỷ số.
- **Lịch sử thay đổi (Audit Log):** Mọi thao tác thêm/sửa/xóa của Admin được ghi log bất biến (Append-only) tại phân hệ Audit Log để đảm bảo tính minh bạch.

---

## ⚙️ 3. QUY TRÌNH VẬN HÀNH & SAO LƯU DỮ LIỆU
- **Sao lưu tự động (Auto Backup):** Hệ thống tự động thực hiện backup toàn bộ dữ liệu lúc **2:00 AM hàng ngày**.
- **Kênh hỗ trợ kỹ thuật 24/7:** Hotline kỹ thuật PTX Group hoặc Email Support `support@ptxgroup.vn`.
