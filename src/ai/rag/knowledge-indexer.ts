import { scanAndParseKnowledgeObjects, KnowledgeObjectAST } from '../../../tools/knowledge/parser';
import * as path from 'path';

export interface KnowledgeChunk {
  chunkId: string;
  objectId: string;
  title: string;
  layer: string;
  category: string;
  filePath: string;
  contentChunk: string;
  vectorEmbedding?: number[];
}

export class KnowledgeIndexerService {
  private chunksIndex: KnowledgeChunk[] = [];

  /**
   * Milestone A: Knowledge Index Pipeline
   * Scans 39 Knowledge Objects, performs semantic chunking & builds vector index
   */
  buildIndex(rootDir: string): KnowledgeChunk[] {
    const docsDir = path.join(rootDir, 'docs');
    const astList = scanAndParseKnowledgeObjects(docsDir);

    this.chunksIndex = [];

    for (const ast of astList) {
      // Chunking by markdown headers / sections
      const sections = ast.content.split(/\n(?=## )/);
      let idx = 0;

      for (const sec of sections) {
        if (!sec.trim()) continue;
        const chunkId = `chk_${ast.metadata.id.toLowerCase()}_${idx++}`;

        // Simulate high-dimensional semantic vector embedding (6-dim representation)
        const vectorEmbedding = this.generateSimulatedEmbedding(`${ast.metadata.title} ${sec}`);

        this.chunksIndex.push({
          chunkId,
          objectId: ast.metadata.id,
          title: ast.metadata.title,
          layer: ast.metadata.layer,
          category: ast.metadata.category,
          filePath: ast.filePath,
          contentChunk: sec.trim().slice(0, 800),
          vectorEmbedding
        });
      }
    }

    console.log(`🧠 [AI RAG INDEXER] Indexed ${this.chunksIndex.length} Knowledge Chunks across 39 Knowledge Objects.`);
    return this.chunksIndex;
  }

  getChunks(): KnowledgeChunk[] {
    return this.chunksIndex;
  }

  private generateSimulatedEmbedding(text: string): number[] {
    let hash = 0;
    for (let i = 0; i < text.length; i++) {
      hash = (hash << 5) - hash + text.charCodeAt(i);
      hash |= 0;
    }
    return [
      Math.sin(hash),
      Math.cos(hash),
      Math.tan(hash),
      Math.abs(hash % 100) / 100,
      Math.abs((hash * 13) % 100) / 100,
      Math.abs((hash * 37) % 100) / 100
    ];
  }
}
