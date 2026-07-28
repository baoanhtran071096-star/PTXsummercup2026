---
id: MANIFESTO-001
title: PTX Foundation Manifesto & Core Mission
layer: Foundation
category: Charter
status: Approved
version: 1.1.0
owner: Knowledge Architect
reviewer: Chief Software Architect
created: 2026-07-28
updated: 2026-07-28
depends_on: []
related_docs:
  - KOS-001
  - PRINCIPLE-001
  - DNA-001
ai_context:
  ai_summary: "Bản tuyên ngôn nền tảng PTX Foundation bổ sung KOS LAW-001 quy định Source code là hiện thực của tri thức và PTX Foundation là nguồn gốc của tri thức."
  key_entities: ["Manifesto", "KOSLaw001"]
  business_terms: ["Single Source of Truth", "KOS LAW-001", "Documentation as Code"]
  breaking_changes: ["Tất cả PR phải cập nhật tri thức đồng thời với code"]
  implementation_notes: "KOS LAW-001 có giá trị cao nhất trong mọi quy trình review."
  review_checklist: ["KOS LAW-001 Compliance Audit", "Metadata Version Upgrade Check"]
tags:
  - manifesto
  - vision
  - mission
  - principles
  - kos-law-001
---

# PTX FOUNDATION MANIFESTO
## Bản Tuyên Nôn & Sứ Mệnh Tri Thức Kỹ Thuật v1.1.0

---

## 1. ĐIỀU LUẬT TỐI CAO TRI THỨC (KOS LAW-001)

> [!IMPORTANT]
> **KOS LAW-001**: Source code là hiện thực của tri thức; PTX Foundation là nguồn gốc của tri thức. Khi có xung đột giữa hai bên, phải xác định nguyên nhân và cập nhật để chúng phản ánh cùng một sự thật, không để chúng phát triển tách rời.
> 
> * **Trường hợp Code đúng nhưng Tài liệu cũ**: Cập nhật ngay PTX Foundation trong cùng Pull Request.
> * **Trường hợp Tài liệu đúng nhưng Code lệch**: Sửa lại Mã nguồn theo đúng đặc tả tài liệu.

---

## 2. SỨ MỆNH (MISSION)
PTX Foundation là **Hệ điều hành Tri thức Kỹ thuật & Sản phẩm (Knowledge Operating System)** được xây dựng để trở thành **Nguồn Chân lý Duy nhất (Single Source of Truth)** cho toàn bộ hệ sinh thái PTX Platform.

## 3. TẦM NHÌN (VISION)
Xây dựng nền tảng **Executable Knowledge Platform (Tri thức Có thể Thực thi)** hướng tới **Digital Twin of the Product** — nơi tri thức phản ánh 100% cấu trúc, hành vi, quy tắc và quyết định để bất kỳ Kỹ sư hay hệ thống AI Agents nào cũng có thể tái dựng toàn bộ sản phẩm từ đầu nếu cần.

## 4. BẢY NGUYÊN TẮC THIẾT KẾ NỀN TẢNG (7 CORE DESIGN PRINCIPLES)

### 1. Human First (Con người là Trung tâm)
Tri thức được trình bày mạch lạc, trực quan và dễ học. Không bao giờ hy sinh trải nghiệm đọc hiểu của con người chỉ để tối ưu riêng cho AI.

### 2. AI Native & Machine Readable (Tự nhiên & Máy đọc được)
Mọi trang tài liệu đều được đóng gói dưới dạng **Knowledge Object** chứa Metadata và khối `ai_context` chuẩn hóa cho AI Agents truy vấn RAG/MCP trực tiếp.

### 3. Knowledge Driven (Tri thức Định hướng)
Hệ thống không chỉ lưu giữ tài liệu kết quả, mà lưu giữ toàn bộ quy trình ra quyết định, các bài học kinh nghiệm, phân tích rủi ro và các đánh đổi (Trade-offs).

### 4. Version Everything (Đồng bộ Phiên bản 100%)
Mọi quy tắc nghiệp vụ, kiến trúc Database Schema, API Contracts, Design System Tokens và Playbooks đều được định phiên bản (Semantic Versioning) và lưu trữ dưới dạng Code trong Git Repository.

### 5. No Guessing (Không Suy đoán)
AI Agents và Kỹ sư không được tự ý suy đoán khi tài liệu đã có quy định rõ ràng. Nếu tài liệu chưa đề cập hoặc confidence score < 80%, hệ thống phải chỉ ra khoảng trống tri thức và yêu cầu làm rõ.

### 6. Decision Transparency (Minh bạch Quyết định)
Mọi thay đổi kiến trúc hoặc tính năng quan trọng đều phải trải qua luồng **RFC (Request for Comments)** và ghi nhận chính thức tại **ADR (Architecture Decision Records)** kèm chỉ số **Decision Quality Index (DQI)** bắt buộc.

### 7. Open Standards Quality (Tiêu chuẩn Mở Quốc tế)
PTX Foundation được thiết kế theo tiêu chuẩn của một dự án mã nguồn mở chất lượng cao. Quyết định công khai hay lưu hành nội bộ là một quyết định chiến lược độc lập trong tương lai.
