---
id: KOS-DOC-DESIGN-LANGUAGE-001
type: KNOWLEDGE_DOCUMENT
title: PTX Enterprise Design Language Specification (PDL v1.0.0)
version: 1.0.0
status: APPROVED
owner: ren-chief-architect
layer: foundation
category: design-system
updatedAt: 2026-07-30
tags:
  - design-system
  - pdl
  - tokens
  - accessibility
  - ai-components
---

# PTX Enterprise Design Language Specification (PDL v1.0.0)

**Chief Product & Architecture Officer**: Ren
**Lead Developer & Captain**: Trần Bảo Anh (Kylian mBAppé #9.5)
**Status**: 🟢 APPROVED ENTERPRISE SPECIFICATION

---

## 💎 1. DESIGN PHILOSOPHY (TRIẾT LÝ THIẾT KẾ)

1. **Information First**: Dữ liệu và thông tin trận đấu luôn là trọng tâm hàng đầu.
2. **Speed First**: Mọi dữ liệu phải hiển thị mượt mà trong dưới 2 giây.
3. **One Click Principle**: Thao tác chính hoàn thành tối đa 1 click.
4. **Sports Emotion**: Nhịp điệu chuyển động tạo cảm hứng thể thao đỉnh cao.
5. **Enterprise Ready**: Chuẩn hóa phong cách doanh nghiệp hiện đại, bền vững.

---

## 🎨 2. DESIGN TOKENS & SYSTEM SCALES

### Elevation Scale (Z-Index & Shadows)
* **Shadow XS**: `0 1px 2px rgba(0, 0, 0, 0.05)`
* **Shadow SM**: `0 2px 4px rgba(0, 0, 0, 0.1)`
* **Shadow MD**: `0 4px 6px rgba(0, 0, 0, 0.15)`
* **Shadow LG**: `0 10px 15px rgba(0, 0, 0, 0.2)`
* **Shadow XL**: `0 20px 25px rgba(0, 0, 0, 0.25)`

### Z-Index System Scale
* **Navbar / Header**: `z-index: 100`
* **Drawer / Sidebar**: `z-index: 200`
* **Modal / Dialog**: `z-index: 300`
* **Toast / Notification**: `z-index: 400`
* **Tooltip**: `z-index: 500`
* **Loading / Overlay**: `z-index: 600`

### Border Radius Scale
* `2px`, `4px`, `8px`, `12px`, `16px`, `20px`, `24px`, `999px` (Full rounded)

### Motion Timing
* **Fast**: `150ms - 200ms` (Buttons, Toggles)
* **Normal**: `250ms - 300ms` (Cards, Modals)
* **Slow**: `450ms - 500ms` (Page Transitions, Storytelling Tour)

---

## 🤖 3. AI DESIGN SYSTEM & COMPONENTS (PDL-AI)

* **`AI Suggestion Card`**: Khung hiển thị gợi ý đội hình hoặc phân tích phong độ.
* **`AI Badge`**: Huy hiệu chứng nhận dự đoán thuật toán AI (`⚡ Powered by PTX AI`).
* **`AI Confidence Indicator`**: Thanh chỉ số độ tin cậy của thuật toán (% Accuracy).
* **`AI MVP Card`**: Thẻ vinh danh Cầu thủ xuất sắc nhất do AI phân tích tự động.

---

## ♿ 4. ACCESSIBILITY & ERROR HANDLING (a11y)

* **Focus State**: Viền `2px solid #00f2fe` bật sáng rõ ràng khi dùng phím `Tab`.
* **Microcopy**: Thông báo tiếng Việt tinh tế: *"Không thể tải dữ liệu. Vui lòng thử lại trong giây lát."*
* **Empty State Fallbacks**: Giao diện thân thiện khi không có trận đấu hoặc bài viết mới.
