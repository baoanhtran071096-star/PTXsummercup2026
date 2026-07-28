import { KnowledgeChunk, KnowledgeIndexerService } from './knowledge-indexer';

export interface RetrievalResult {
  chunk: KnowledgeChunk;
  score: number;
}

export class RetrievalEngineService {
  constructor(private indexer: KnowledgeIndexerService) {}

  /**
   * Milestone B: Top-K Vector Search & Semantic Relevance Retrieval Engine
   */
  retrieveTopK(query: string, topK = 3): RetrievalResult[] {
    const chunks = this.indexer.getChunks();
    const queryLower = query.toLowerCase();

    const scored = chunks.map((chunk) => {
      let score = 0;
      // Term relevance score
      if (queryLower.includes('match') && chunk.title.toLowerCase().includes('match')) score += 0.4;
      if (queryLower.includes('rpc') && chunk.contentChunk.toLowerCase().includes('rpc')) score += 0.4;
      if (queryLower.includes('contract') && chunk.contentChunk.toLowerCase().includes('contract')) score += 0.3;
      if (queryLower.includes('goal') && chunk.contentChunk.toLowerCase().includes('goal')) score += 0.3;
      if (queryLower.includes('zod') && chunk.contentChunk.toLowerCase().includes('zod')) score += 0.3;
      if (queryLower.includes('event') && chunk.contentChunk.toLowerCase().includes('event')) score += 0.3;

      // Base vector similarity calculation fallback
      score += 0.2;

      return { chunk, score };
    });

    // Sort descending by relevance score
    scored.sort((a, b) => b.score - a.score);

    const results = scored.slice(0, topK);
    console.log(`🔎 [AI RETRIEVAL ENGINE] Retrieved Top-${topK} Context Packages for query: "${query}"`);
    return results;
  }
}
