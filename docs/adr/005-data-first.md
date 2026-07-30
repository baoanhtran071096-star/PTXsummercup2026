# ADR-005: Single Source of Truth (Data-First)

**Date:** 2026-07-31  
**Status:** Accepted

## Decision
Supabase là nguồn dữ liệu duy nhất. Không có hardcode data trong frontend. Không có local JSON files làm source of truth.

## Consequences
- (✓) Dữ liệu thống nhất ở mọi điểm
- (✓) Admin cập nhật một nơi, tất cả cập nhật
- (⚠) Cần fallback/cache khi DB offline
- Mức triển khai: mock data layer khi chưa có kết nối
