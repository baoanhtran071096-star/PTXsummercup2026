import { MediaAssetV11Repository } from '../repository/media-asset-v1-1.repository';
import { AssetResolverService, AssetResolveOptions } from '../domain/media/asset-resolver.service';
import { UploadAssetInputV11, MediaAssetV11, AssetStatus } from '../domain/media/asset-v1-1-models';

export class MediaAssetV11ApplicationService {
  private repo: MediaAssetV11Repository;
  private resolver: AssetResolverService;

  constructor() {
    this.repo = new MediaAssetV11Repository();
    this.resolver = new AssetResolverService();
  }

  async uploadAsset(input: UploadAssetInputV11): Promise<{ asset: MediaAssetV11; resolvedUrl: string }> {
    const asset = await this.repo.registerAsset(input);
    const resolvedUrl = await this.resolver.resolveAsset(asset);

    return { asset, resolvedUrl };
  }

  async getResolvedAssetUrl(assetId: string, options?: AssetResolveOptions): Promise<string> {
    const asset = await this.repo.getAssetById(assetId);
    if (!asset || asset.status === 'DELETED') {
      return 'https://ptx.vn/assets/default-placeholder.png';
    }
    return this.resolver.resolveAsset(asset, options);
  }

  async setAssetStatus(assetId: string, status: AssetStatus): Promise<MediaAssetV11> {
    return this.repo.updateAssetStatus(assetId, status);
  }
}
