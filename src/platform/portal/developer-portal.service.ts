import { generatorRegistry } from '../../../tools/knowledge/generators';

export interface DeveloperPortalPluginInfo {
  id: string;
  name: string;
  language: string;
  version: string;
  supportsCirVersion: string;
}

export class DeveloperPortalService {
  /**
   * Epic 5: Developer Portal & Plugin SDK Hub
   */
  getRegisteredPlugins(): DeveloperPortalPluginInfo[] {
    const plugins = generatorRegistry.getAllPlugins();
    return plugins.map((p) => ({
      id: p.id,
      name: p.name,
      language: p.language,
      version: p.version,
      supportsCirVersion: p.supportsCirVersion
    }));
  }

  getSdkDocumentation() {
    return {
      sdkName: '@ptx/kos-generator-sdk',
      sdkVersion: '1.2.0',
      interface: 'KnowledgeGeneratorPlugin',
      examplePluginCode: `export class CustomSdkGeneratorPlugin implements KnowledgeGeneratorPlugin {\n  id = 'gen-custom-sdk';\n  name = 'Custom SDK Generator';\n  language = 'TypeScript';\n  version = '1.0.0';\n  supportsCirVersion = '1.2.0';\n  generate(cir) { return { name: 'SDK', filename: 'sdk.ts', targetSubDir: 'sdk', content: '// Custom SDK' }; }\n}`
    };
  }
}
