import { MatchPhotoEntity, HallOfFameEntity } from '../../domain/gallery/gallery-model';
import { MediaAssetV12ApplicationService } from '../media-asset-v1-2-application.service';

export class GalleryQueryService {
  private damService: MediaAssetV12ApplicationService;

  constructor(damService?: MediaAssetV12ApplicationService) {
    this.damService = damService || new MediaAssetV12ApplicationService();
  }

  async resolveGalleryPhotos(photos: MatchPhotoEntity[]): Promise<(MatchPhotoEntity & { resolvedPhotoUrl: string })[]> {
    return Promise.all(
      photos.map(async (p) => ({
        ...p,
        resolvedPhotoUrl: await this.damService.resolveAssetUrlV12(p.photoAssetId, { variantSize: 'medium' })
      }))
    );
  }

  async resolveHallOfFame(hof: HallOfFameEntity[]): Promise<(HallOfFameEntity & { resolvedPhotoUrl: string })[]> {
    return Promise.all(
      hof.map(async (h) => ({
        ...h,
        resolvedPhotoUrl: await this.damService.resolveAssetUrlV12(h.photoAssetId, { variantSize: 'medium' })
      }))
    );
  }
}
