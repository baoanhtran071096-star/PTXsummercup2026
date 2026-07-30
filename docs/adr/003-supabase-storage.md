# ADR-003: Supabase as Data & Storage Platform

**Date:** 2026-07-31  
**Status:** Accepted

## Context
Cần database, auth, storage trong một giải pháp, miễn phí.

## Decision
Dùng Supabase (PostgreSQL + Storage + Auth + Realtime). Không dùng Firebase (NoSQL, khó query phức tạp), PlanetScale (đã xóa free tier).

## Consequences
- (✓) PostgreSQL thực sự (JOIN, View, Trigger)
- (✓) 500MB database miễn phí
- (✓) 1GB storage miễn phí
- (✓) Auth tích hợp sẵn
- (⚠) 500MB có thể không đủ nếu có nhiều media
