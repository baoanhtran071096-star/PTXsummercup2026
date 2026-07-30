# ADR-004: AI Core as Separate Architecture Layer

**Date:** 2026-07-31  
**Status:** Accepted

## Context
AI là core capability của PTX Platform, không chỉ là một tính năng.

## Decision
Tách AI thành lớp kiến trúc riêng: AI Core (Orchestrator, Engines, Safety, Tools, Prompts, Memory, Providers). AI không nằm trong frontend hay backend.

## Consequences
- (✓) AI độc lập với UI framework
- (✓) Dễ test AI độc lập
- (✓) Dễ thay provider (Gemini → GPT-4)
- (✓) Safety layer áp dụng nhất quán
