import { TournamentEntity } from '../../domain/tournament/tournament-model';
import { MediaAssetV12ApplicationService } from '../media-asset-v1-2-application.service';

export interface TournamentProfileDTO extends TournamentEntity {
  resolvedBannerUrl: string;
}

export class TournamentProfileQueryService {
  private damService: MediaAssetV12ApplicationService;

  constructor(damService?: MediaAssetV12ApplicationService) {
    this.damService = damService || new MediaAssetV12ApplicationService();
  }

  async resolveTournamentProfile(tournament: TournamentEntity): Promise<TournamentProfileDTO> {
    let resolvedBannerUrl = 'https://ptx.vn/assets/default-banner-placeholder.png';
    if (tournament.bannerAssetId) {
      resolvedBannerUrl = await this.damService.resolveAssetUrlV12(tournament.bannerAssetId, {
        variantSize: 'large'
      });
    }

    return {
      ...tournament,
      resolvedBannerUrl
    };
  }
}
