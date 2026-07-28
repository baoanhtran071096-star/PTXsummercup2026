import { MediaAssetV11 } from './asset-v1-1-models';
import { StorageAdapter, SupabaseStorageAdapter, CloudflareR2Adapter, S3StorageAdapter } from './storage-adapter.interface';

export interface AssetResolveOptions {
  signedUrl?: boolean;
  expiresInSec?: number;
  width?: number;
  height?: number;
  format?: 'webp' | 'png' | 'jpg';
}

export class AssetResolverService {
  private adapters: Map<string, StorageAdapter> = new Map();

  constructor() {
    const supabase = new SupabaseStorageAdapter();
    const r2 = new CloudflareR2Adapter();
    const s3 = new S3StorageAdapter();

    this.adapters.set(supabase.providerName, supabase);
    this.adapters.set(r2.providerName, r2);
    this.adapters.set(s3.providerName, s3);
  }

  async resolveAsset(asset?: MediaAssetV11, options?: AssetResolveOptions): Promise<string> {
    if (!asset) {
      return 'https://ptx.vn/assets/default-placeholder.png';
    }

    const adapter = this.adapters.get(asset.storageProvider) || this.adapters.get('SUPABASE_STORAGE')!;

    let baseUrl: string;
    if (options?.signedUrl) {
      baseUrl = await adapter.getSignedUrl(asset.storagePath, options.expiresInSec || 3600);
    } else {
      baseUrl = await adapter.getPublicUrl(asset.storagePath);
    }

    // Dynamic Image Processing Pipeline Query Parameters
    const queryParams: string[] = [];
    if (options?.width) queryParams.push(`w=${options.width}`);
    if (options?.height) queryParams.push(`h=${options.height}`);
    if (options?.format) queryParams.push(`fm=${options.format}`);

    if (queryParams.length > 0) {
      const joinChar = baseUrl.includes('?') ? '&' : '?';
      baseUrl += `${joinChar}${queryParams.join('&')}`;
    }

    return baseUrl;
  }
}
