import { SponsorEntity } from '../../domain/sponsor/sponsor-model';
import { MediaAssetV12ApplicationService } from '../media-asset-v1-2-application.service';

export class SponsorQueryService {
  private damService: MediaAssetV12ApplicationService;

  constructor(damService?: MediaAssetV12ApplicationService) {
    this.damService = damService || new MediaAssetV12ApplicationService();
  }

  async resolveSponsors(sponsors: SponsorEntity[]): Promise<(SponsorEntity & { resolvedLogoUrl: string })[]> {
    return Promise.all(
      sponsors.map(async (s) => ({
        ...s,
        resolvedLogoUrl: s.logoAssetId
          ? await this.damService.resolveAssetUrlV12(s.logoAssetId, { variantSize: 'small' })
          : 'https://ptx.vn/assets/default-sponsor-placeholder.png'
      }))
    );
  }
}
