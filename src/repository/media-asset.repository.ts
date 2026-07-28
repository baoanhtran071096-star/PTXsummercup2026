import { MediaAsset, UploadAssetInput } from '../domain/media/asset-models';
import { StructuredLogger } from '../logger/structured-logger';

export class MediaAssetRepository {
  private memoryAssets: Map<string, MediaAsset> = new Map();

  async registerAsset(input: UploadAssetInput): Promise<MediaAsset> {
    const assetId = 'ast_' + Date.now();
    const timestamp = new Date().toISOString();
    const storagePath = `${input.bucketName}/${input.orgId}/${assetId}_${input.fileName}`;
    const publicUrl = `https://ptx.vn/cdn-assets/${storagePath}`;

    const asset: MediaAsset = {
      id: assetId,
      orgId: input.orgId,
      storageProvider: 'SUPABASE_STORAGE',
      bucketName: input.bucketName,
      storagePath,
      fileName: input.fileName,
      mimeType: input.mimeType,
      fileSizeBytes: input.fileSizeBytes,
      sha256Hash: 'hash_' + Date.now(),
      publicUrl,
      createdAt: timestamp,
      updatedAt: timestamp
    };

    this.memoryAssets.set(assetId, asset);

    StructuredLogger.info('MEDIA_ASSET_REGISTERED_SUCCESS', {
      assetId,
      bucket: input.bucketName,
      fileName: input.fileName,
      publicUrl
    });

    return asset;
  }

  async getAssetById(assetId: string): Promise<MediaAsset | undefined> {
    return this.memoryAssets.get(assetId);
  }

  async resolveAssetUrl(assetId?: string, fallbackUrl?: string): Promise<string> {
    if (!assetId) return fallbackUrl || 'https://ptx.vn/assets/default-placeholder.png';
    const asset = await this.getAssetById(assetId);
    return asset?.publicUrl || fallbackUrl || 'https://ptx.vn/assets/default-placeholder.png';
  }
}
