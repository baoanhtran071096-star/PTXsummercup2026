# PTX Rollback Plan v1.0

## 1. Code Rollback
- **Khi nào:** Deploy lỗi, lỗi nghiêm trọng trên Production.
- **Hành động:** `git revert <commit-hash>` + push lên `main`.
- **Thời gian khôi phục:** < 5 phút.

## 2. Database Rollback
- **Khi nào:** Migration lỗi, seed data bị sai lệch.
- **Hành động:** `supabase db reset --target <timestamp>` hoặc khôi phục từ bản Backup tự động 2 AM.
- **Thời gian khôi phục:** < 10 phút.

## 3. AI Chat Rollback
- **Khi nào:** Gemini API bị rate limit/quota error hoặc phản hồi không đúng.
- **Hành động:** Chuyển Feature Flag `aiChat: false` trong `@ptx/sdk` config hoặc trả về Fallback Response mặc định.
- **Thời gian khôi phục:** < 1 phút.

## 4. Infrastructure Fallback
- **Khi nào:** Cloudflare Pages / Supabase downtime.
- **Hành động:** Chuyển hướng DNS sang Maintenance Page (Trang bảo trì công khai).
- **Thời gian khôi phục:** < 5 phút.

## 5. Communication & Escalation
- **Chịu trách nhiệm:** Lead DevOps & Backend Engineer.
- **Kênh báo động:** Group Zalo BTC / Email kĩ thuật.
- **Mẫu thông báo:** `[INCIDENT] Sự cố: {mô tả} | Ảnh hưởng: {phạm vi} | Hành động: {rollback/patch} | ETA: {phút}`.
