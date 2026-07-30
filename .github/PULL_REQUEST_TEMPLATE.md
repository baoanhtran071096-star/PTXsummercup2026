## 🚀 PTX Platform Pull Request Review

### 1. Launch-First Assessment
- [ ] **Functional Risk:** Tính năng hoạt động đúng yêu cầu và không ảnh hưởng tính năng khác?
- [ ] **Performance Risk:** Thời gian tải < 500ms, không gây lag UI?
- [ ] **Security Risk:** Không lộ API key, secret key hay dữ liệu nhạy cảm?
- [ ] **Data Risk:** Không làm sai lệch dữ liệu Supabase hay standings view?
- [ ] **Launch Risk:** Có ngăn cản kế hoạch Launch 05/08/2026 không?

### 2. Production-Grade Check
- [ ] Empty State handled (Khi không có dữ liệu)
- [ ] Error State handled (Khi gặp sự cố network/API)
- [ ] Loading State handled (Hiệu ứng chờ mượt mà)
- [ ] Mobile & Responsive design tested
- [ ] Logging & Observability integrated

### 3. AI Core Check (Nếu có chỉnh sửa AI)
- [ ] Safety Layer (Injection Guard & Output Redaction) được áp dụng
- [ ] Fallback response khi API error/timeout
- [ ] Versioned prompt được sử dụng
- [ ] Không có hallucination dữ liệu

### 4. Review Decision
- [ ] ✅ **Approve for Merge**
- [ ] ⚠️ **Request Changes**
- [ ] 🚫 **Block (Launch Risk)**
