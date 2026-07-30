# ADR-007: Domain-Driven Folder Structure

**Date:** 2026-07-31  
**Status:** Accepted

## Context
Code đang tổ chức theo kỹ thuật (components/, hooks/, services/). Khi mở rộng, khó tìm code liên quan đến một Business Domain.

## Decision
Tổ chức code theo Business Domain: Tournament/, Match/, Player/, Team/, News/, Gallery/. Mỗi Domain có đủ UI, Services, Types, Validation.

## Consequences
- (✓) Dễ tìm code theo domain
- (✓) Team có thể làm việc song song trên domain khác nhau
- (✓) Dễ extract thành package riêng
- (⚠) Cần quy ước rõ ràng, tránh code được viết ở sai domain
