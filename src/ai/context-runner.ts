import * as fs from 'fs';
import * as path from 'path';

export class AiContextRunner {
  /**
   * Extract & Load Context Package for Match Domain
   */
  loadMatchDomainContextPackage(rootDir: string) {
    const manifestPath = path.join(rootDir, 'generated', 'knowledge-build.json');
    if (!fs.existsSync(manifestPath)) {
      throw new Error(`Build Manifest not found at ${manifestPath}`);
    }

    const manifestRaw = fs.readFileSync(manifestPath, 'utf-8');
    const manifest = JSON.parse(manifestRaw);

    const checksum = manifest.source_deterministic_checksum_sha256 || manifest.master_checksum_sha256 || 'unknown_checksum';

    const contextPackage = {
      bundle_id: 'ctx_match_domain_v1',
      domain: 'PROD-MATCH-001',
      manifest_checksum: checksum,
      generated_at: manifest.generated_at,
      context_summary: 'Match Operations Domain: Atomic RPC goal recording, Zod contracts, and Realtime SSE Stream.'
    };

    console.log(`🤖 [AI RUNTIME ENGINE] Loaded Context Package: ${contextPackage.bundle_id} (Checksum: ${contextPackage.manifest_checksum.slice(0, 10)}...)`);
    return contextPackage;
  }
}
