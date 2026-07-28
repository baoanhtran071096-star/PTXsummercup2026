import { MediaAssetRepository } from '../repository/media-asset.repository';
import { UploadAssetInput, MediaAsset } from '../domain/media/asset-models';

export class MediaAssetApplicationService {
  private repo: MediaAssetRepository;

  constructor() {
    this.repo = new MediaAssetRepository();
  }

  async handleUploadAsset(input: UploadAssetInput): Promise<{ asset: MediaAsset; resolutionTimeMs: number }> {
    const startTime = Date.now();

    // Validation
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'];
    if (!allowedMimeTypes.includes(input.mimeType)) {
      throw new Error(`ERR_INVALID_MIME_TYPE: Type ${input.mimeType} is not supported.`);
    }

    if (input.fileSizeBytes > 5 * 1024 * 1024) {
      throw new Error('ERR_FILE_TOO_LARGE: Asset file size exceeds 5MB limit.');
    }

    const asset = await this.repo.registerAsset(input);
    const resolutionTimeMs = Date.now() - startTime;

    return {
      asset,
      resolutionTimeMs
    };
  }

  async resolveAssetUrl(assetId?: string, fallbackUrl?: string): Promise<string> {
    return this.repo.resolveAssetUrl(assetId, fallbackUrl);
  }
}
