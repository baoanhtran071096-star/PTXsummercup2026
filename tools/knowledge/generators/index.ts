import { KnowledgeGeneratorPlugin } from './plugin.interface';
import { typescriptGeneratorPlugin } from './typescript';
import { zodGeneratorPlugin } from './zod';
import { openapiGeneratorPlugin } from './openapi';
import { sqlGeneratorPlugin } from './sql';
import { testGeneratorPlugin } from './tests';

export * from './plugin.interface';

/**
 * Generator Plugin Registry
 * Easily register new target language generators (Kotlin, Swift, Rust, C#, GraphQL)
 */
class GeneratorPluginRegistry {
  private plugins: Map<string, KnowledgeGeneratorPlugin> = new Map();

  constructor() {
    // Register Default Built-in Generators
    this.register(typescriptGeneratorPlugin);
    this.register(zodGeneratorPlugin);
    this.register(openapiGeneratorPlugin);
    this.register(sqlGeneratorPlugin);
    this.register(testGeneratorPlugin);
  }

  register(plugin: KnowledgeGeneratorPlugin) {
    if (this.plugins.has(plugin.id)) {
      throw new Error(`Generator plugin ID collision: ${plugin.id}`);
    }
    this.plugins.set(plugin.id, plugin);
    console.log(`🔌 Registered Generator Plugin: [${plugin.id}] ${plugin.name} (${plugin.language})`);
  }

  getAllPlugins(): KnowledgeGeneratorPlugin[] {
    return Array.from(this.plugins.values());
  }
}

export const generatorRegistry = new GeneratorPluginRegistry();
