// ================================================================
// PTX SEARCH ENGINE
// Tìm kiếm: cầu thủ, trận đấu, gallery, tin tức.
// Pure TypeScript, không cần AI/API. Free.
// ================================================================

import { OrchestratorRequest } from '../orchestrator/orchestrator.types';

interface SearchPayload {
  action: 'search' | 'checkDuplicate' | 'suggest';
  query?: string;
  type?: 'player' | 'match' | 'gallery' | 'news' | 'all';
  data?: Record<string, unknown>;
  dataset?: unknown[];
}

export class SearchEngine {
  async handle(request: OrchestratorRequest): Promise<unknown> {
    const { action, query, type, data, dataset } = request.payload as SearchPayload;
    console.log(`[SearchEngine] Action: ${action}, Query: "${query ?? ''}"`);

    switch (action) {
      case 'search':         return this.search(query ?? '', type ?? 'all', dataset ?? []);
      case 'checkDuplicate': return this.checkDuplicate(data ?? {}, dataset ?? []);
      case 'suggest':        return this.suggest(query ?? '', dataset ?? []);
      default:
        throw new Error(`[SearchEngine] Unknown action: ${action}`);
    }
  }

  /**
   * Tìm kiếm full-text đơn giản theo query.
   */
  private search(query: string, type: string, dataset: unknown[]) {
    const q = query.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    const results = dataset.filter((item) => {
      const text = JSON.stringify(item).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      return text.includes(q);
    });

    return {
      query,
      type,
      count: results.length,
      results: results.slice(0, 20),
      searchedAt: new Date().toISOString(),
    };
  }

  /**
   * Kiểm tra trùng lặp (ví dụ: cầu thủ đã tồn tại chưa).
   */
  private checkDuplicate(data: Record<string, unknown>, dataset: unknown[]) {
    const name = (data.name as string ?? '').toLowerCase();
    const duplicates = dataset.filter((item) => {
      const itemName = ((item as Record<string, unknown>).name as string ?? '').toLowerCase();
      return itemName === name || this.similarity(itemName, name) > 0.85;
    });

    return {
      hasDuplicate: duplicates.length > 0,
      duplicates,
      confidence: duplicates.length > 0 ? 'high' : 'none',
      checkedAt: new Date().toISOString(),
    };
  }

  /**
   * Gợi ý tìm kiếm (autocomplete).
   */
  private suggest(query: string, dataset: unknown[]) {
    const q = query.toLowerCase();
    const suggestions = dataset
      .map(item => {
        const text = (item as Record<string, unknown>).name as string ?? '';
        return text;
      })
      .filter(name => name.toLowerCase().startsWith(q))
      .slice(0, 8);

    return { query, suggestions, count: suggestions.length };
  }

  /** Tính độ tương đồng Jaccard đơn giản */
  private similarity(a: string, b: string): number {
    const setA = new Set(a.split(''));
    const setB = new Set(b.split(''));
    const intersection = new Set([...setA].filter(c => setB.has(c)));
    const union = new Set([...setA, ...setB]);
    return union.size === 0 ? 0 : intersection.size / union.size;
  }
}
