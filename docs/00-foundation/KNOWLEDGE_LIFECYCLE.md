---
id: KOS-LIFE-001
title: PTX Knowledge Lifecycle & Document State Machine
layer: Foundation
category: System Architecture
status: Approved
version: 1.0.0
owner: Knowledge Architect
reviewer: Chief Software Architect
created: 2026-07-28
updated: 2026-07-28
depends_on:
  - KOS-001
  - MANIFESTO-001
related_docs:
  - QUAL-MODEL-001
  - METADATA_SPEC.md
impacts_on:
  - DEPRECATION_POLICY.md
tags:
  - knowledge-lifecycle
  - state-machine
  - document-management
---

# PTX KNOWLEDGE LIFECYCLE
## Vòng Đời Tài Liệu Tri Thức & Máy Trạng Thái v1.0.0

---

## 🧭 BA CÂU HỎI KIẾN TRÚC BẮT BUỘC (MANDATORY THREE QUESTIONS)

1. **Tài liệu này giải quyết vấn đề gì?**
   * Quy định máy trạng thái (State Machine) quản lý vòng đời phát triển của một tài liệu tri thức (Knowledge Object) từ khi phác thảo ý tưởng cho đến khi lưu trữ lịch sử.
2. **Nó phụ thuộc vào những tài liệu nào?**
   * Phụ thuộc vào `KOS-001` (Bản thiết kế KOS) và `MANIFESTO-001` (Tuyên ngôn).
3. **Những tài liệu nào sẽ bị ảnh hưởng nếu nó thay đổi?**
   * Quy trình kiểm duyệt tài liệu, Metadata Parser, và hệ thống AI Context Engine Indexer.

---

## 1. MÁY TRẠNG THÁI VÒNG ĐỜI TRI THỨC (DOCUMENT STATE MACHINE)

```
[1. DRAFT] ──> [2. IN_REVIEW] ──> [3. APPROVED] ──> [4. PUBLISHED]
                                                          │
                                                          ├──> [5. DEPRECATED] ──> [6. ARCHIVED]
                                                          │
                                                          └──(Sửa đổi lớn)──> [1. DRAFT (v1.1.0)]
```

---

## 2. CHI TIẾT SÁU TRẠNG THÁI TÀI LIỆU (DOCUMENT STATES)

### 1. Draft (Bản nháp)
* **Đặc điểm**: Tài liệu đang trong quá trình soạn thảo bởi Kỹ sư hoặc AI. Dữ liệu có thể chưa đầy đủ.
* **Quy tắc AI**: AI Context Engine chỉ xem tài liệu này là tài liệu tham khảo tạm thời, KHÔNG DÙNG làm chuẩn thực thi chính thức.

### 2. In Review (Đang kiểm duyệt)
* **Đặc điểm**: Tài liệu đã hoàn thiện bản nháp, vượt qua tự kiểm tra Metadata và đang chờ kiểm duyệt từ Chief Architect / Knowledge Architect và Review AI Agent.

### 3. Approved (Đã phê duyệt)
* **Đặc điểm**: Tài liệu đã đạt 9 tiêu chí Foundation Quality Gate và chuẩn DoD. Chuẩn bị đưa vào phát hành chính thức.

### 4. Published (Đã phát hành chính thức)
* **Đặc điểm**: Tài liệu đang hoạt động chính thức là Nguồn Chân lý Duy nhất (Single Source of Truth) cho hệ thống.
* **Quy tắc AI**: AI Agents bắt buộc tuân thủ 100% các quy định trong tài liệu này khi gõ code.

### 5. Deprecated (Lạc hậu / Chuẩn bị thay thế)
* **Đặc điểm**: Tài liệu bị đánh dấu ngưng sử dụng do có tài liệu phiên bản mới hơn hoặc kiến trúc thay đổi. Đã có hướng dẫn chuyển đổi (Migration Guide).

### 6. Archived (Lưu trữ Lịch sử)
* **Đặc điểm**: Tài liệu chính thức ngừng hoạt động, được di chuyển vào kho lưu trữ lịch sử để truy vết quá trình tiến hóa của hệ thống.

---

## 3. QUY TẮC ĐÁNH SỐ PHIÊN BẢN (SEMANTIC VERSIONING FOR KNOWLEDGE)

* **Major Version (v1.0.0 ➔ v2.0.0)**: Thay đổi lớn về Kiến trúc hoặc Quy tắc Nghiệp vụ gây ra ngưng tương thích.
* **Minor Version (v1.0.0 ➔ v1.1.0)**: Bổ sung tính năng mới, thêm phần giải thích chi tiết nhưng giữ nguyên kiến trúc cũ.
* **Patch Version (v1.0.0 ➔ v1.0.1)**: Sửa lỗi chính tả, làm rõ câu từ, cập nhật liên kết tham chiếu `related_docs`.
