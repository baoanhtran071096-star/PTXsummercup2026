export interface EcosystemPackage {
  packageId: string;
  name: string;
  type: 'COMPILER_PLUGIN' | 'KNOWLEDGE_PACK' | 'TEMPLATE' | 'AI_PACKAGE';
  version: string;
  publisher: string;
  sha256: string;
  publishedAt: string;
}

export class UniversalPackageRegistryService {
  private packagesMap: Map<string, EcosystemPackage> = new Map();

  constructor() {
    this.packagesMap.set('pkg-sports-domain-pack', {
      packageId: 'pkg-sports-domain-pack',
      name: 'Sports League & Tournament Knowledge Pack',
      type: 'KNOWLEDGE_PACK',
      version: '1.0.0',
      publisher: 'PTX Core Team',
      sha256: '98fa011b98acfe1204',
      publishedAt: '2026-07-28'
    });

    this.packagesMap.set('pkg-ai-match-story', {
      packageId: 'pkg-ai-match-story',
      name: 'Gemini Match Storytelling Prompt Package',
      type: 'AI_PACKAGE',
      version: '1.2.0',
      publisher: 'AI Engineering Guild',
      sha256: '44bc099118fe12760b',
      publishedAt: '2026-07-28'
    });
  }

  getPublishedPackages(): EcosystemPackage[] {
    return Array.from(this.packagesMap.values());
  }

  publishPackage(pkg: EcosystemPackage): EcosystemPackage {
    this.packagesMap.set(pkg.packageId, pkg);
    console.log(`📦 [UNIVERSAL PACKAGE REGISTRY] Published Package [${pkg.name}] (${pkg.packageId} v${pkg.version}).`);
    return pkg;
  }
}
