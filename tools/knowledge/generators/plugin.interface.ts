import { CanonicalIntermediateRepresentation } from '../cir';

export interface GeneratorOutputArtifact {
  name: string;
  targetSubDir: string;
  filename: string;
  content: string;
  generatorId?: string;
  generatorVersion?: string;
  cirVersion?: string;
}

export interface KnowledgeGeneratorPlugin {
  id: string;
  name: string;
  language: string;
  version: string;
  supportsCirVersion: string; // Strategic Directive: Strict CIR Version Compatibility
  generate(cir: CanonicalIntermediateRepresentation): GeneratorOutputArtifact;
}
