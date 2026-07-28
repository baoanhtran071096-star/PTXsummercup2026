---
id: ENG-ERR-001
title: PTX System-Wide Error Taxonomy & Classification Matrix
layer: Engineering
category: Error Standards
status: Approved
version: 1.0.0
owner: Chief Software Architect
reviewer: CTO
created: 2026-07-28
updated: 2026-07-28
depends_on:
  - ENG-ARCH-001
  - ENG-CON-001
related_docs:
  - API-SPEC-001
  - QUAL-MODEL-001
impacts_on: []
ai_context:
  ai_summary: "Bảng phân loại Mã lỗi toàn hệ thống (Error Taxonomy) bọc 6 nhóm lỗi, HTTP Mapping, Level Logging và Chiến lược xử lý Retry."
  key_entities: ["ErrorTaxonomy", "ErrorCodeRegistry", "HttpMapping"]
  business_terms: ["Error Taxonomy", "Error Classification", "HTTP Status Mapping", "Retry Strategy"]
  breaking_changes: ["Nghiêm cấm tự sáng tác mã lỗi ngoài Error Taxonomy Matrix này"]
  implementation_notes: "100% error response sử dụng mã code tiếng Anh chuẩn hóa."
  review_checklist: ["Error Taxonomy Coverage Check", "HTTP Status Alignment", "Log Severity Audit"]
tags:
  - error-taxonomy
  - error-codes
  - http-mapping
  - logging-severity
---

# PTX SYSTEM-WIDE ERROR TAXONOMY

---

## 🧭 BA CÂU HỎI KIẾN TRÚC BẮT BUỘC (MANDATORY THREE QUESTIONS)

1. **Tài liệu này giải quyết vấn đề gì?**
   * Phân loại toàn bộ các loại lỗi (Error Taxonomy) có thể xảy ra trong hệ thống PTX Platform thành 6 nhóm chuẩn mực. Quy định rõ mã lỗi (Error Code), HTTP Mapping, Mức độ Log Severity, và Chiến lược xử lý Retry để Backend, Frontend, QA và AI phản hồi đồng nhất.
2. **Nó phụ thuộc vào những tài liệu nào?**
   * Phụ thuộc vào `ENG-ARCH-001` và `ENG-CON-001` (Contract Standards).
3. **Những tài liệu nào sẽ bị ảnh hưởng nếu nó thay đổi?**
   * Tệp mã nguồn xử lý lỗi trung tâm `ErrorHandlerMiddleware`, API Response Envelopes và UI Toast Notification Engines.

---

## 1. PHÂN LOẠI 6 NHÓM LỖI HỆ THỐNG (SIX ERROR CATEGORIES)

```
                       ┌──────────────────────────────┐
                       │   PTX ERROR TAXONOMY         │
                       └──────────────┬───────────────┘
                                      │
       ┌──────────────┬───────────────┼───────────────┬──────────────┬──────────────┐
       ▼              ▼               ▼               ▼              ▼              ▼
┌─────────────┐┌─────────────┐┌─────────────┐┌─────────────┐┌─────────────┐┌─────────────┐
│ 1.VALIDATION││ 2.BUSINESS  ││3.AUTHORIZA- ││4.INFRASTRUC-││ 5.EXTERNAL  ││6.UNEXPECTED │
│   ERRORS    ││  VIOLATION  ││  TION ERROR ││  TURE ERROR ││SERVICE ERROR││ SYSTEM ERROR│
└─────────────┘└─────────────┘└─────────────┘└─────────────┘└─────────────┘└─────────────┘
```

---

## 2. MA TRẬN MÃ LỖI TOÀN HỆ THỐNG (ERROR CODE MATRIX)

| Nhóm Lỗi (Category) | Mã Lỗi (Error Code) | HTTP Status | Mức Log Severity | Chiến lược Retry |
| :--- | :--- | :--- | :--- | :--- |
| **Validation Error** | `ERR_VALIDATION_FAILED` | `422 Unprocessable` | `WARN` | Không Retry (Sửa Payload) |
| **Business Violation** | `ERR_MATCH_NOT_LIVE` | `409 Conflict` | `WARN` | Không Retry (Vi phạm Invariant) |
| **Business Violation** | `ERR_DUPLICATE_SHIRT_NO` | `409 Conflict` | `WARN` | Không Retry |
| **Authorization Error** | `ERR_UNAUTHORIZED` | `401 Unauthorized` | `WARN` | Tự động chuyển trang Login |
| **Authorization Error** | `ERR_FORBIDDEN_TENANT` | `403 Forbidden` | `ERROR` | Cảnh báo Bảo mật RLS |
| **Infrastructure Error**| `ERR_DATABASE_RPC_TIMEOUT`| `504 Gateway Timeout`| `CRITICAL` | Retry Exponential Backoff (3 lần)|
| **External Service Error**| `ERR_GEMINI_API_FAILURE` | `502 Bad Gateway` | `ERROR` | Retry sau 2 giây |
| **Unexpected Error** | `ERR_INTERNAL_SERVER_FAIL`| `500 Internal Error`| `CRITICAL` | Gửi Cảnh báo Pager/Slack |
