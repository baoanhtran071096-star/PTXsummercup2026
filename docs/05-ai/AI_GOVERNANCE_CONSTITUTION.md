---
id: AI-GOV-001
title: PTX AI Governance Constitution & Multi-AI Operating Rules
layer: AI Governance
category: Governance Charter
status: Approved
version: 1.1.0
owner: AI Governance Designer
reviewer: Chief Software Architect
created: 2026-07-28
updated: 2026-07-28
depends_on:
  - MANIFESTO-001
  - KOS-001
  - PRINCIPLE-001
related_docs:
  - DOMAIN-001
  - GLOSSARY-001
tags:
  - ai-governance
  - constitution
  - multi-ai
  - role-based-ai
---

# PTX AI GOVERNANCE CONSTITUTION
## Hiến Pháp Quản Trị Multi-AI & Quy Tắc Vận Hành v1.1.0

---

## 1. TỔNG QUAN HIẾN PHÁP (CONSTITUTION OVERVIEW)

Tài liệu này xác lập **Hiến pháp Quản trị AI (AI Governance Constitution)** điều phối toàn bộ hành vi, quyền hạn và ranh giới hoạt động của tất cả các AI Agents tương tác với mã nguồn và hệ thống tri thức PTX Platform.

Tất cả AI Agents (bất kể mô hình hay thương hiệu) khi tham gia vào dự án đều **bắt buộc phải tuân thủ Hiến pháp này**.

---

## 2. KIẾN TRÚC AI THEO VAI TRÒ (ROLE-BASED AI ARCHITECTURE)

Thay vì gắn kết độc quyền với một thương hiệu duy nhất (Vendor Lock-in Free), PTX Foundation phân chia năng lực AI thành **các Vai trò Chuẩn hóa**:

```
                               ┌────────────────────────┐
                               │  PTX AI GOVERNANCE     │
                               │     CONSTITUTION       │
                               └───────────┬────────────┘
                                           │
        ┌──────────────────────┬───────────┴───────────┬──────────────────────┐
        ▼                      ▼                       ▼                      ▼
┌──────────────┐       ┌──────────────┐        ┌──────────────┐       ┌──────────────┐
│ KNOWLEDGE AI │       │ENGINEERING AI│        │  REVIEW AI   │       │    IDE AI    │
├──────────────┤       ├──────────────┤        ├──────────────┤       ├──────────────┤
│ • Context Engine     │ • System Arch│        │ • Security   │       │ • Pair Prog  │
│ • Doc Synthesis      │ • Backend/DB │        │ • Performance│       │ • Refactoring│
│ • Product Analysis   │ • Frontend/UI│        │ • Quality Gate│       │ • Local Test │
└──────────────┘       └──────────────┘        └──────────────┘       └──────────────┘
```

---

## 3. BẢNG PHÂN VAI MULTI-AI KHUYẾN NGHỊ TỪ CTO (CTO MULTI-AI MATRIX)

Bảng phân công tổ hợp Multi-AI tối ưu giữa hiệu quả và chi phí do CTO Board phê duyệt:

| Vai trò Hệ thống (System Role) | AI Model Khuyến nghị | Phạm vi Trách nhiệm & Nhiệm vụ Trọng tâm |
| :--- | :--- | :--- |
| 🧠 **CTO & Architecture** | **ChatGPT (Ren)** | Định hướng kiến trúc tổng thể, duyệt RFC/ADR, phân tích chiến lược sản phẩm. |
| 💻 **Coding Chính (Primary Coding)** | **Gemini Code Assist** | Phát triển mã nguồn chính (Next.js 14, React 19, TypeScript, Clean 6-Layer). |
| 🔧 **Refactor & Automation** | **Codex** | Tự động hóa công cụ biên dịch (Compiler Tooling), Refactor mã nguồn, CI/CD scripts. |
| 🔍 **Codebase Review & Documentation** | **Claude Code** | Thẩm định mã nguồn (Deep Review), tổng hợp tri thức, kiểm soát chất lượng tài liệu `docs/`. |
| ⚡ **Algorithm & SQL Optimization** | **DeepSeek** | Tối ưu hóa thuật toán phức tạp, viết và tinh chỉnh PostgreSQL Atomic RPCs & Views. |

---

## 4. BẢY PHẠM VI TIÊU CHUẨN ĐIỀU CHỈNH (7 GOVERNANCE DOMAINS)

### 4.1 Quy tắc Lập trình (Coding Rules)
1. **No Unauthorized Schema Changes**: AI KHÔNG ĐƯỢC TỰ Ý sửa đổi Database Schema v1.0.7 hoặc API Contracts nếu chưa qua thảo luận RFC/ADR.
2. **Strict Type Safety**: AI bắt buộc viết 100% mã nguồn TypeScript strict mode, khai báo Zod Schemas rõ ràng cho mọi API Payload.
3. **No Magic Numbers**: Không hardcode pixel, màu sắc hay hằng số tùy tiện. Bắt buộc dùng Design Tokens từ `tailwind.config.ts`.

### 4.2 Quy tắc Kiểm duyệt (Reviewing Rules)
1. **Empirical Evidence**: AI Reviewer chỉ đưa ra nhận xét dựa trên bằng chứng log, mã lỗi hoặc quy định kiến trúc đã công bố.
2. **Zero-Symptom Patching**: Nghiêm cấm các đề xuất sửa đổi kiểu "nuốt ngoại lệ" (silent try/catch), bypass RLS, hoặc xóa bỏ Unit Test đang fail.

### 4.3 Quy tắc Tối ưu (Refactoring Rules)
1. **Scope Limitation**: AI được phép đổi tên biến, tách hàm nhỏ, tối ưu SQL Query nhưng KHÔNG ĐƯỢC ĐỔI LOGIC NGHIỆP VỤ nếu chưa có sự đồng ý của Chief Architect.

### 4.4 Quy tắc Cơ sở dữ liệu (Database Governance)
1. **Atomic RPC Rule**: Logic nghiệp vụ phức tạp liên quan đến tính toán điểm số hay ghi nhận bàn thắng phải nằm trong hàm RPC/View PostgreSQL.
2. **RLS Mandatory**: Không table nào được đưa lên sản xuất mà thiếu RLS Policies bảo vệ.

### 4.5 Quy tắc Bảo mật (Security Governance)
1. **JWT Claim Enforcement**: Phân quyền multi-tenant bắt buộc lấy `org_id` từ JWT custom claim, cấm tin tưởng `org_id` truyền từ phía client URL/body.

### 4.6 Quy tắc Kiểm thử (Testing Governance)
1. **Verifiable Success**: AI không bao giờ được tuyên bố "hoàn thành" hay "đã sửa xong" nếu chưa chạy lệnh kiểm thử và kiểm tra mã thoát (exit code = 0).

### 4.7 Quy tắc Tài liệu (Documentation Governance)
1. **Metadata Enforcement**: Mọi trang tài liệu mới do AI tạo ra đều phải kèm theo YAML Frontmatter tuân thủ `METADATA_SPEC v1.0`.

---

## 5. QUY TẮC NẠP BỐI CẢNH & NGƯỠNG ĐÁNH GIÁ (CONFIDENCE THRESHOLD)

```
Confidence Score >= 80%  ───> AI thực thi nhiệm vụ theo đúng kiến trúc.
Confidence Score < 80%   ───> AI DỪNG LẠI, chỉ rõ khoảng trống tri thức và ĐẶT CÂU HỎI.
```

Nghiêm cấm AI "đoán mò" logic khi thiếu dữ liệu.

---

## 6. LỊCH SỬ THAY ĐỔI (REVISION HISTORY)

| Phiên bản | Ngày | Người thực hiện | Tóm tắt thay đổi |
| :--- | :--- | :--- | :--- |
| **1.0.0** | 2026-07-28 | AI Governance Designer & Chief Architect | Ban hành Hiến pháp Quản trị AI Governance PTX Foundation v1.0.0. |
| **1.1.0** | 2026-07-28 | Chief Software Architect (CTO) | Cập nhật Bảng Phân Vai Multi-AI Matrix Khuyến Nghị từ CTO. |
