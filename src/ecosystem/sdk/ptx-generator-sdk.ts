import { CanonicalIntermediateRepresentation } from '../../tools/knowledge/cir';

export interface GeneratedArtifactResult {
  name: string;
  filename: string;
  targetSubDir: string;
  content: string;
}

export interface KnowledgeGeneratorPlugin {
  id: string;
  name: string;
  language: string;
  version: string;
  supportsCirVersion: string;
  digitalSignature?: string;
  generate(cir: CanonicalIntermediateRepresentation): GeneratedArtifactResult;
}

/**
 * Epic 2: Official PTX Generator SDK (@ptx/kos-generator-sdk v1.2.0)
 * Base Class for Third-Party Generator & Extension Developers
 */
export abstract class BaseKnowledgeGeneratorSDK implements KnowledgeGeneratorPlugin {
  abstract id: string;
  abstract name: string;
  abstract language: string;
  abstract version: string;
  abstract supportsCirVersion: string;
  digitalSignature?: string;

  abstract generate(cir: CanonicalIntermediateRepresentation): GeneratedArtifactResult;

  verifyCompatibility(cirVersion: string): boolean {
    return this.supportsCirVersion === cirVersion || this.supportsCirVersion === '1.2.x';
  }
}
