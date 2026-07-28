---
id: DNA-001
title: PTX Platform Product DNA & Differentiation Identity
layer: Foundation
category: Identity Charter
status: Approved
version: 1.0.0
owner: Product Owner
reviewer: Chief Software Architect
created: 2026-07-28
updated: 2026-07-28
depends_on:
  - MANIFESTO-001
  - BUS-CAP-001
related_docs:
  - PRINCIPLE-001
  - KOS-001
impacts_on:
  - PROD-MATCH-001
  - UI-PITCH-001
ai_context:
  ai_summary: "Tài liệu xác lập 6 bản sắc DNA cốt lõi của PTX Platform giúp phân biệt với mọi phần mềm quản lý giải đấu thông thường và ngăn ngừa Feature Creep."
  key_entities: ["ProductDNA", "DifferentiationCore"]
  business_terms: ["Product DNA", "Live Referee Console", "Executable Knowledge", "Feature Creep"]
  breaking_changes: ["Nghiêm cấm phát triển tính năng vi phạm hoặc làm mờ 6 trụ cột DNA"]
  implementation_notes: "Mọi PR tính năng mới phải chứng minh sự đóng góp vào 1 trong 6 cột mốc DNA."
  review_checklist: ["DNA Alignment Check", "Feature Creep Guard", "UX Distinctiveness Audit"]
tags:
  - product-dna
  - identity
  - differentiation
  - core-pillars
---

# PTX PRODUCT DNA
## Bản Sắc Sản Phẩm & Trụ Cột Khác Biệt v1.0.0

---

## 🧭 BA CÂU HỎI KIẾN TRÚC BẮT BUỘC (MANDATORY THREE QUESTIONS)

1. **Tài liệu này giải quyết vấn đề gì?**
   * Định nghĩa chính thức 6 Trụ cột DNA tạo nên bản sắc độc bản của PTX Platform so với tất cả các phần mềm quản lý giải đấu bóng đá thông thường trên thị trường. Tài liệu này đóng vai trò là "màng lọc" ngăn chặn hiện tượng phình đại tính năng lãng phí (Feature Creep).
2. **Nó phụ thuộc vào những tài liệu nào?**
   * Phụ thuộc vào `MANIFESTO-001` và `BUS-CAP-001` (Mô hình Năng lực Nghiệp vụ).
3. **Những tài liệu nào sẽ bị ảnh hưởng nếu nó thay đổi?**
   * Tất cả các định hướng sản phẩm, lộ trình tính năng UI/UX và tiêu chuẩn duyệt Pull Request tính năng mới.

---

## 1. SÁU TRỤ CỘT DNA CỐT LÕI (SIX DNA PILLARS)

```
                       ┌──────────────────────────────┐
                       │    PTX PRODUCT DNA           │
                       └──────────────┬───────────────┘
                                      │
       ┌──────────────┬───────────────┼───────────────┬──────────────┬──────────────┐
       ▼              ▼               ▼               ▼              ▼              ▼
┌─────────────┐┌─────────────┐┌─────────────┐┌─────────────┐┌─────────────┐┌─────────────┐
│ 1. LIVE     ││ 2. TACTICAL ││ 3. AI MATCH ││ 4. HISTORIC ││ 5. ENTERPRISE││6. EXECUTABLE│
│ REFEREE     ││ 3D PITCH    ││ STORY       ││ ARCHIVE     ││ KOS ENGINE  ││ KNOWLEDGE   │
│ CONSOLE     ││ VISUALIZER  ││ GENERATOR   ││ & MEDIA DAM ││ SYSTEM      ││ PLATFORM    │
└─────────────┘└─────────────┘└─────────────┘└─────────────┘└─────────────┘└─────────────┘
```

### Pillar 1: Live Referee Console (Bảng Điều hành Trọng tài bàn Realtime)
* **Khác biệt**: Không nhập dữ liệu sau trận đấu theo kiểu thủ công. PTX cung cấp giao diện điều khiển bàn trọng tài bấm giờ, ghi bàn, rút thẻ mượt mà với độ trễ phát sóng khán giả **< 500ms**, tích hợp Web Audio Synthesizer còi báo hiệu và pháo hoa ăn mừng tức thì.

### Pillar 2: Tactical 3D Pitch Visualizer (Sa bàn Chiến thuật Sân 5 3D)
* **Khác biệt**: Tích hợp bộ 6 sơ đồ chiến thuật sân 5 / Futsal quốc tế (Diamond, Box, Yolo, Pyramid, Fortress, Power Play) cho phép tráo đổi vị trí cầu thủ 3D mượt mà, tính toán chỉ số OVR Rating động theo thời gian thực.

### Pillar 3: AI Match Story & Sports Intelligence (Truyền thông AI Thể thao)
* **Khác biệt**: Tự động chuyển đổi toàn bộ chuỗi sự kiện trận đấu thành bài báo tường thuật thể thao chuyên nghiệp chỉ trong **< 3 giây** thông qua Gemini Flash API, giúp mọi giải đấu phong trào có chất lượng truyền thông như giải đấu chuyên nghiệp.

### Pillar 4: Historical Archive & Media DAM (Lưu trữ Lịch sử & DAM Assets)
* **Khác biệt**: Thư viện quản lý hình ảnh số hóa DAM tự động gắn tag AI, lưu giữ toàn bộ dữ liệu lịch sử thi đấu, thống kê đối đầu và danh hiệu cá nhân bền vững qua nhiều năm.

### Pillar 5: Enterprise Knowledge System (Hệ thống Tri thức Enterprise)
* **Khác biệt**: Dự án được quản trị dựa trên nguồn chân lý duy nhất (Single Source of Truth) bám sát các tiêu chuẩn mã nguồn mở quốc tế, giúp bất kỳ Kỹ sư hay AI nào cũng có thể gia nhập và hiểu toàn bộ bối cảnh dự án ngay lập tức.

### Pillar 6: Executable Knowledge Platform (Tri thức Có thể Thực thi)
* **Khác biệt**: Tài liệu tri thức KOS không phải là file văn bản tĩnh, mà đóng vai trò là "nguồn đầu vào có thể thực thi" (Executable Input) điều hướng AI Agents tự động sinh code, migration SQL, API contract và test suite chuẩn xác 100%.

---

## 2. NGUYÊN TẮC CHỐNG FEATURE CREEP (ANTI-FEATURE CREEP RULES)

Một tính năng mới đề xuất **bắt buộc phải bị từ chối** nếu thuộc một trong các trường hợp:
1. Không chứng minh được sự đóng góp vào 1 trong 6 Trụ cột DNA ở trên.
2. Làm tăng độ phức tạp hệ thống mà không mang lại giá trị trực tiếp cho Ban tổ chức, Trọng tài bàn, Vận động viên hoặc Khán giả.
3. Tự ý thay đổi giao diện/logic gây gãy chuẩn trải nghiệm realtime mượt mà.
