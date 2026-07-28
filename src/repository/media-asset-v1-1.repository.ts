import { MediaAssetV11, UploadAssetInputV11, AssetStatus } from '../domain/media/asset-v1-1-models';
import { StructuredLogger } from '../logger/structured-logger';

export class MediaAssetV11Repository {
  private memoryAssets: Map<string, MediaAssetV11> = new Map();

  async registerAsset(input: UploadAssetInputV11): Promise<MediaAssetV11> {
    const assetId = 'ast_' + Date.now();
    const timestamp = new Date().toISOString();

    const bucketMap: Record<string, string> = {
      PLAYER_AVATAR: 'avatars',
      TEAM_LOGO: 'logos',
      TOURNAMENT_BANNER: 'banners',
      SPONSOR_LOGO: 'sponsors',
      MATCH_PHOTO: 'gallery',
      HALL_OF_FAME: 'gallery',
      DOCUMENT_PDF: 'documents',
      VIDEO_CLIP: 'videos'
    };

    const bucketName = bucketMap[input.assetType] || 'general';
    const storagePath = `${bucketName}/${input.orgId}/${assetId}_${input.fileName}`;

    const asset: MediaAssetV11 = {
      id: assetId,
      orgId: input.orgId,
      assetType: input.assetType,
      status: 'ACTIVE', // Asset Lifecycle: Active upon complete registration
      storageProvider: 'SUPABASE_STORAGE',
      bucketName,
      storagePath, // SINGLE SOURCE OF TRUTH
      fileName: input.fileName,
      mimeType: input.mimeType,
      fileSizeBytes: input.fileSizeBytes,
      metadata: {
        checksum: 'sha256_' + Date.now(),
        uploadedBy: input.uploadedBy,
        createdBy: input.uploadedBy,
        format: input.mimeType.split('/')[1] || 'raw',
        ...input.metadata
      },
      createdAt: timestamp,
      updatedAt: timestamp
    };

    this.memoryAssets.set(assetId, asset);

    StructuredLogger.info('MEDIA_ASSET_V11_REGISTERED', {
      assetId,
      assetType: input.assetType,
      storagePath,
      status: asset.status
    });

    return asset;
  }

  async getAssetById(assetId: string): Promise<MediaAssetV11 | undefined> {
    return this.memoryAssets.get(assetId);
  }

  async updateAssetStatus(assetId: string, status: AssetStatus): Promise<MediaAssetV11> {
    const asset = this.memoryAssets.get(assetId);
    if (!asset) {
      throw new Error(`ERR_ASSET_NOT_FOUND: Asset ${assetId} not found.`);
    }

    asset.status = status;
    asset.updatedAt = new Date().toISOString();

    StructuredLogger.info('MEDIA_ASSET_V11_STATUS_UPDATED', {
      assetId,
      newStatus: status
    });

    return asset;
  }
}
