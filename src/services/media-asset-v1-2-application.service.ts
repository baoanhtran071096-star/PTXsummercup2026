import { AssetSecurityHarness } from '../domain/media/asset-security-harness';
import { AssetResolverService, AssetResolveOptionsV12 } from '../domain/media/asset-resolver.service';
import { MediaAssetV12, SIGNED_URL_POLICY_MATRIX, AssetType, ImageVariant } from '../domain/media/dam-v1-2-models';
import { StructuredLogger } from '../logger/structured-logger';

export interface UploadAssetInputV12 {
  orgId: string;
  assetType: AssetType;
  fileName: string;
  mimeType: string;
  fileSizeBytes: number;
  uploadedBy: string;
  storageProvider?: 'SUPABASE_STORAGE' | 'CLOUDFLARE_R2' | 'AWS_S3';
}

export class MediaAssetV12ApplicationService {
  private memoryAssets: Map<string, MediaAssetV12> = new Map();
  private resolver: AssetResolverService;

  constructor() {
    this.resolver = new AssetResolverService();
  }

  async uploadAssetV12(input: UploadAssetInputV12): Promise<{ asset: MediaAssetV12; resolvedUrl: string }> {
    // 1. Enterprise Security Validation & Sanitization
    AssetSecurityHarness.validateAssetUpload(input.mimeType, input.fileSizeBytes, input.orgId);
    const sanitizedFileName = AssetSecurityHarness.sanitizeFilename(input.fileName);

    const assetId = 'ast_' + Date.now();
    const timestamp = new Date().toISOString();
    const provider = input.storageProvider || 'SUPABASE_STORAGE';
    const policy = SIGNED_URL_POLICY_MATRIX[input.assetType];

    const storagePath = `${input.assetType.toLowerCase()}/${input.orgId}/${assetId}_${sanitizedFileName}`;

    // Standardized Image Variants
    const variants: ImageVariant[] = [
      { size: 'thumbnail', width: 150, height: 150, storagePath: `${storagePath}_thumb.webp` },
      { size: 'small', width: 300, height: 300, storagePath: `${storagePath}_sm.webp` },
      { size: 'medium', width: 800, height: 800, storagePath: `${storagePath}_md.webp` },
      { size: 'large', width: 1920, height: 1080, storagePath: `${storagePath}_lg.webp` }
    ];

    const asset: MediaAssetV12 = {
      id: assetId,
      orgId: input.orgId,
      assetType: input.assetType,
      assetVersion: 1, // Asset Versioning starts at v1
      status: 'ACTIVE',
      storageProvider: provider,
      bucketName: input.assetType.toLowerCase(),
      storagePath, // SINGLE SOURCE OF TRUTH
      fileName: sanitizedFileName,
      mimeType: input.mimeType,
      fileSizeBytes: input.fileSizeBytes,
      isSignedOnly: policy ? policy.isSignedOnly : false,
      variants,
      auditTrail: {
        uploadedBy: input.uploadedBy,
        createdBy: input.uploadedBy
      },
      metadata: {
        checksum: 'sha256_' + Date.now(),
        uploadedBy: input.uploadedBy,
        createdBy: input.uploadedBy,
        format: input.mimeType.split('/')[1] || 'raw'
      },
      createdAt: timestamp,
      updatedAt: timestamp
    };

    this.memoryAssets.set(assetId, asset);

    StructuredLogger.info('MEDIA_ASSET_V12_REGISTERED', {
      assetId,
      assetType: input.assetType,
      storagePath,
      isSignedOnly: asset.isSignedOnly
    });

    const resolvedUrl = await this.resolver.resolveAssetUrlV12(asset);

    return { asset, resolvedUrl };
  }

  async resolveAssetUrlV12(assetId: string, options?: AssetResolveOptionsV12): Promise<string> {
    const asset = this.memoryAssets.get(assetId);
    return this.resolver.resolveAssetUrlV12(asset, options);
  }

  async getAssetById(assetId: string): Promise<MediaAssetV12 | undefined> {
    return this.memoryAssets.get(assetId);
  }
}
