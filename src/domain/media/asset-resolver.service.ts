import { MediaAssetV12, SIGNED_URL_POLICY_MATRIX, ImageVariantSize } from './dam-v1-2-models';
import { StorageProviderRegistry } from './storage-provider.registry';

export interface AssetResolveOptionsV12 {
  signedUrl?: boolean;
  expiresInSec?: number;
  variantSize?: ImageVariantSize;
  width?: number;
  height?: number;
  format?: 'webp' | 'png' | 'jpg';
}

export class AssetResolverService {
  private registry: StorageProviderRegistry;

  constructor() {
    this.registry = StorageProviderRegistry.getInstance();
  }

  async resolveAssetUrlV12(asset?: MediaAssetV12, options?: AssetResolveOptionsV12): Promise<string> {
    if (!asset || asset.status === 'DELETED') {
      return 'https://ptx.vn/assets/default-placeholder.png';
    }

    const adapter = this.registry.getProvider(asset.storageProvider);
    const policy = SIGNED_URL_POLICY_MATRIX[asset.assetType] || { isSignedOnly: false, defaultExpiresInSec: 3600 };

    let targetPath = asset.storagePath;

    // Check if Variant requested
    if (options?.variantSize && options.variantSize !== 'original') {
      const variant = asset.variants.find((v) => v.size === options.variantSize);
      if (variant) {
        targetPath = variant.storagePath;
      }
    }

    let baseUrl: string;
    const isSignedRequired = options?.signedUrl ?? (asset.isSignedOnly || policy.isSignedOnly);

    if (isSignedRequired) {
      const expiresIn = options?.expiresInSec || policy.defaultExpiresInSec;
      baseUrl = await adapter.getSignedUrl(targetPath, expiresIn);
    } else {
      baseUrl = await adapter.getPublicUrl(targetPath);
    }

    // Processing Query Parameters
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
