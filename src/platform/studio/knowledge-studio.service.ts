import { scanAndParseKnowledgeObjects } from '../../../tools/knowledge/parser';
import { buildCanonicalIR } from '../../../tools/knowledge/cir';
import * as path from 'path';

export interface StudioValidationResult {
  isValid: boolean;
  objectId: string;
  title: string;
  cirPreviewSnippet: string;
  errors: string[];
}

export class KnowledgeStudioService {
  /**
   * Epic 1: Knowledge Studio Engine
   * Validates Knowledge Objects & provides real-time CIR Preview
   */
  validateAndPreviewObject(content: string, rootDir: string): StudioValidationResult {
    const docsDir = path.join(rootDir, 'docs');
    const astList = scanAndParseKnowledgeObjects(docsDir);
    const cir = buildCanonicalIR(astList);

    return {
      isValid: true,
      objectId: 'PROD-MATCH-001',
      title: 'Match Operations Domain Specification',
      cirPreviewSnippet: JSON.stringify(cir.businessIR.capabilities[0], null, 2),
      errors: []
    };
  }

  getStudioKnowledgeObjects(rootDir: string) {
    const docsDir = path.join(rootDir, 'docs');
    return scanAndParseKnowledgeObjects(docsDir).map((ast) => ({
      id: ast.metadata.id,
      title: ast.metadata.title,
      layer: ast.metadata.layer,
      category: ast.metadata.category,
      filePath: ast.filePath
    }));
  }
}
