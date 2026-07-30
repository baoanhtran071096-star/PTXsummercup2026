# PTX Smoke Test Checklist v1.0

## A. PUBLIC WEBSITE
- [ ] Trang chủ mở được (HTTPS OK)
- [ ] Hero banner & Slogan hiển thị chính xác
- [ ] Countdown đếm ngược đến ngày khai mạc 05/08/2026
- [ ] Bảng xếp hạng 8 đội bóng hiển thị đúng thứ hạng & điểm số
- [ ] Lịch thi đấu hiển thị đủ 8 trận (4 đã kết thúc, 4 sắp diễn ra)
- [ ] Trang chi tiết Đội bóng hiển thị đủ 8 đội
- [ ] Trang Cầu thủ hiển thị đủ 13 cầu thủ
- [ ] Thư viện ảnh (Gallery) tải được hình ảnh
- [ ] Hall of Fame hiển thị danh hiệu mùa trước
- [ ] Tin tức hiển thị bài viết mới nhất
- [ ] Responsive Mobile (iPhone/Android) không tràn viền
- [ ] Responsive Tablet & Desktop mượt mà

## B. AI CHAT
- [ ] Chatbot widget xuất hiện góc dưới màn hình
- [ ] Gửi câu hỏi "Lịch thi đấu hôm nay?" thành công
- [ ] Trả lời chính xác danh sách trận đấu
- [ ] Trả lời chính xác Bảng xếp hạng
- [ ] Phản hồi trong dưới 3 giây
- [ ] Hiển thị loading indicator khi đang xử lý
- [ ] Hiển thị câu thông báo thân thiện khi Gemini timeout/error

## C. ADMIN PANEL
- [ ] Đăng nhập thành công với tài khoản admin
- [ ] Thêm / Sửa / Xóa Đội bóng thành công
- [ ] Thêm / Sửa / Xóa Cầu thủ thành công
- [ ] Cập nhật tỷ số trận đấu thành công (BXH tự động nhảy điểm)
- [ ] Đăng tin tức mới thành công
- [ ] Upload ảnh vào Gallery thành công

## D. PERFORMANCE & QUALITY
- [ ] Console log sạch, 0 lỗi JavaScript nghiêm trọng
- [ ] Không có lỗi Network (404/500)
- [ ] Lighthouse score > 90 (Performance, Accessibility, SEO)
- [ ] Largest Contentful Paint (LCP) < 2.5s
- [ ] Cumulative Layout Shift (CLS) < 0.1

## E. DATA INTEGRITY
- [ ] Supabase connection LIVE
- [ ] Đúng 8 đội bóng trong DB
- [ ] Đúng 13 cầu thủ trong DB
- [ ] Đúng 8 trận đấu trong DB
- [ ] Standings PostgreSQL View hoạt động chính xác
