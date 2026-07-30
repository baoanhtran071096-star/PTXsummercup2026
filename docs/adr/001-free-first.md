# ADR-001: Free-First Strategy

**Date:** 2026-07-31  
**Status:** Accepted  
**Deciders:** Chủ trì Thiết kế

## Context
PTX Summer Cup 2026 là giải đấu nội bộ, không có ngân sách hạ tầng.

## Decision
Sử dụng 100% công nghệ Free Tier: Supabase (DB + Storage + Auth), Cloudflare Pages (Hosting), Gemini API (AI Free Tier), GitHub Actions (CI/CD).

## Consequences
- (✓) Zero chi phí hạ tầng
- (✓) Triển khai nhanh
- (✓) Scale được khi cần với chi phí tối thiểu
- (⚠) Có giới hạn quota (AI, Storage)
- (⚠) Cần fallback khi vượt quota
