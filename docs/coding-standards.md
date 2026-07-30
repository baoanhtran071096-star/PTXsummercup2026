# PTX Platform Coding Standards & Bootstrap Rules v1.0

## 1. Bootstrap & Initialization Rules (MANDATORY)
Dành riêng cho quá trình khởi tạo ứng dụng (`DOMContentLoaded`, `window.load`, App Bootstrapping):

1. **🚫 KHÔNG DÙNG BLOCKING UI DIALOGS:** 
   Tuyệt đối không sử dụng các hàm đồng bộ `prompt()`, `alert()`, `confirm()` trong luồng khởi tạo trang web (`Bootstrap`). Các hàm này gây đóng băng Main Thread của trình duyệt và ngăn chặn việc ẩn Splash Screen.
2. **🚫 KHÔNG PHỤ THUỘC TƯƠNG TÁC THỦ CÔNG:**
   Quá trình Bootstrapping phải diễn ra hoàn toàn tự động không cần người dùng thao tác. Tài khoản mặc định hoặc cấu hình mặc định phải được khởi tạo bất đồng bộ.
3. **⏱️ TIMEOUT & GRACEFUL FALLBACK:**
   Mọi luồng khởi tạo phải có cơ chế Timeout dự phòng (Timeout Fallback) để ẩn Splash Screen hoặc hiển thị Error State thân thiện nếu kết nối mạng/DB gặp sự cố.
4. **🔒 KHÔNG BLOCK MAIN RENDER THREAD:**
   Tất cả các truy vấn Supabase REST API hay AI Core Service trong quá trình nạp trang phải chạy `async/await` không chặn luồng vẽ giao diện DOM.

---

## 2. Production-Grade Code Rules
1. **Empty State:** Mọi bảng, danh sách, hoặc thẻ dữ liệu phải có giao diện hiển thị khi chưa có dữ liệu (Empty State).
2. **Error State:** Khi API hoặc DB gặp sự cố, hệ thống phải hiển thị thông báo lỗi mượt mà thay vì làm vỡ layout.
3. **Loading State:** Mọi thao tác tải dữ liệu bất đồng bộ phải hiển thị hiệu ứng Loading Indicator/Skeleton.
4. **Safety & Security:**
   - Không commit API Keys hay Secret Keys vào mã nguồn.
   - Sử dụng Safety Layer để lọc Prompt Injection và Redact dữ liệu nhạy cảm trước khi trả về cho UI.

---

## 3. Incident Management & Audit Trail Standards
Mọi đợt nghiệm thu hoặc sửa lỗi sự cố phải lưu trữ Audit Trail bao gồm:
- Mã lỗi và mô tả nguyên nhân gốc (Root Cause).
- Log từ Browser Console & Network Tab.
- Kết quả chạy Smoke Test (Pass Rate).
- Mã Commit hash trên GitHub `main` branch.
