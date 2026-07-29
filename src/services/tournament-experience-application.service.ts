import { TournamentEntity, CreateTournamentInput } from '../domain/tournament/tournament-model';
import { SponsorEntity, CreateSponsorInput } from '../domain/sponsor/sponsor-model';
import { MatchPhotoEntity, HallOfFameEntity } from '../domain/gallery/gallery-model';
import { MediaAssetV12ApplicationService } from './media-asset-v1-2-application.service';

export interface TournamentExperienceDTO extends TournamentEntity {
  resolvedBannerUrl: string;
  sponsors: (SponsorEntity & { resolvedLogoUrl: string })[];
  galleryPhotos: (MatchPhotoEntity & { resolvedPhotoUrl: string })[];
  hallOfFame: (HallOfFameEntity & { resolvedPhotoUrl: string })[];
}

export class TournamentExperienceApplicationService {
  private memoryTournaments: Map<string, TournamentEntity> = new Map();
  private memorySponsors: Map<string, SponsorEntity> = new Map();
  private memoryGallery: Map<string, MatchPhotoEntity> = new Map();
  private memoryHallOfFame: Map<string, HallOfFameEntity> = new Map();
  private damService: MediaAssetV12ApplicationService;

  constructor(damService?: MediaAssetV12ApplicationService) {
    this.damService = damService || new MediaAssetV12ApplicationService();
  }

  async createTournament(input: CreateTournamentInput): Promise<TournamentEntity> {
    const id = 'trn_' + Date.now();
    const timestamp = new Date().toISOString();

    const tournament: TournamentEntity = {
      id,
      orgId: input.orgId,
      name: input.name,
      year: input.year,
      seasonId: input.seasonId,
      status: 'ACTIVE',
      bannerAssetId: input.bannerAssetId,
      createdAt: timestamp,
      updatedAt: timestamp
    };

    this.memoryTournaments.set(id, tournament);
    return tournament;
  }

  async addSponsor(input: CreateSponsorInput): Promise<SponsorEntity> {
    const id = 'spn_' + Date.now();
    const timestamp = new Date().toISOString();

    const sponsor: SponsorEntity = {
      id,
      tournamentId: input.tournamentId,
      name: input.name,
      sponsorTier: input.sponsorTier,
      logoAssetId: input.logoAssetId,
      createdAt: timestamp,
      updatedAt: timestamp
    };

    this.memorySponsors.set(id, sponsor);
    return sponsor;
  }

  async addMatchPhoto(matchId: string, caption: string, photoAssetId: string): Promise<MatchPhotoEntity> {
    const id = 'pho_' + Date.now();
    const photo: MatchPhotoEntity = {
      id,
      matchId,
      caption,
      photoAssetId,
      createdAt: new Date().toISOString()
    };
    this.memoryGallery.set(id, photo);
    return photo;
  }

  async addHallOfFame(tournamentId: string, awardName: HallOfFameEntity['awardName'], recipientName: string, photoAssetId: string): Promise<HallOfFameEntity> {
    const id = 'hof_' + Date.now();
    const hof: HallOfFameEntity = {
      id,
      tournamentId,
      awardName,
      recipientName,
      photoAssetId,
      createdAt: new Date().toISOString()
    };
    this.memoryHallOfFame.set(id, hof);
    return hof;
  }

  async getPublicTournamentView() {
    return {
      liveMatch: { score: '3 - 1' },
      hallOfFame: { goldenBootPlayerName: 'Kylian mBAppé (#9.5)' }
    };
  }

  async getTournamentExperience(tournamentId: string): Promise<TournamentExperienceDTO> {
    const tournament = this.memoryTournaments.get(tournamentId);
    if (!tournament) {
      throw new Error(`ERR_TOURNAMENT_NOT_FOUND: Tournament ${tournamentId} does not exist.`);
    }

    // Resolve Banner URL via AssetResolver
    let resolvedBannerUrl = 'https://ptx.vn/assets/default-banner-placeholder.png';
    if (tournament.bannerAssetId) {
      resolvedBannerUrl = await this.damService.resolveAssetUrlV12(tournament.bannerAssetId, {
        variantSize: 'large'
      });
    }

    // Resolve Sponsors Logos
    const sponsorsList = Array.from(this.memorySponsors.values()).filter((s) => s.tournamentId === tournamentId);
    const resolvedSponsors = await Promise.all(
      sponsorsList.map(async (s) => ({
        ...s,
        resolvedLogoUrl: s.logoAssetId
          ? await this.damService.resolveAssetUrlV12(s.logoAssetId, { variantSize: 'small' })
          : 'https://ptx.vn/assets/default-sponsor-placeholder.png'
      }))
    );

    // Resolve Gallery Photos
    const photosList = Array.from(this.memoryGallery.values());
    const resolvedGallery = await Promise.all(
      photosList.map(async (p) => ({
        ...p,
        resolvedPhotoUrl: await this.damService.resolveAssetUrlV12(p.photoAssetId, { variantSize: 'medium' })
      }))
    );

    // Resolve Hall of Fame Photos
    const hofList = Array.from(this.memoryHallOfFame.values()).filter((h) => h.tournamentId === tournamentId);
    const resolvedHof = await Promise.all(
      hofList.map(async (h) => ({
        ...h,
        resolvedPhotoUrl: await this.damService.resolveAssetUrlV12(h.photoAssetId, { variantSize: 'medium' })
      }))
    );

    return {
      ...tournament,
      resolvedBannerUrl,
      sponsors: resolvedSponsors,
      galleryPhotos: resolvedGallery,
      hallOfFame: resolvedHof
    };
  }
}
