import { KnowledgeGeneratorPlugin } from '../sdk/ptx-generator-sdk';
import { CanonicalIntermediateRepresentation } from '../../../tools/knowledge/cir';

export class ExtensionRuntimeService {
  private activeExtensions: Map<string, KnowledgeGeneratorPlugin> = new Map();

  /**
   * Epic 3: Extension Runtime Engine
   * Dynamic Extension Registration & Execution without modifying core codebase
   */
  registerExtension(extension: KnowledgeGeneratorPlugin) {
    this.activeExtensions.set(extension.id, extension);
    console.log(`🧩 [EXTENSION RUNTIME] Registered Dynamic Extension [${extension.name}] (${extension.id}).`);
  }

  executeActiveExtensions(cir: CanonicalIntermediateRepresentation) {
    const results = [];
    for (const [id, ext] of this.activeExtensions.entries()) {
      const artifact = ext.generate(cir);
      results.push({ extensionId: id, artifact });
    }
    return results;
  }

  getActiveExtensionsCount(): number {
    return this.activeExtensions.size;
  }
}
