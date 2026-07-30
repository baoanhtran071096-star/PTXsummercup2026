# ADR-002: Gemini as Primary AI Provider

**Date:** 2026-07-31  
**Status:** Accepted  
**Deciders:** Chủ trì Thiết kế

## Context
Cần một AI provider mạnh, miễn phí, và có API ổn định.

## Decision
Dùng Gemini 1.5 Flash (Free Tier) làm provider chính. Không dùng GPT-4 (trả phí), Llama (phức tạp), Claude (trả phí).

## Consequences
- (✓) Miễn phí 1500 req/ngày
- (✓) Multimodal (text + vision)
- (✓) Native JSON output
- (⚠) Giới hạn 1M tokens/ngày
- Mức triển khai: fallback message khi hết quota
