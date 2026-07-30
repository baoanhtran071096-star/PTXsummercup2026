// PTX GALLERY SERVICE – Business Capability Layer
import { dbService, GalleryItem } from '../../data-platform/supabase/db.service';

export class GalleryService {
  async getAllPhotos(limit = 50): Promise<GalleryItem[]> {
    return dbService.getGallery(undefined, limit);
  }

  async getPhotosByMatch(matchId: string): Promise<GalleryItem[]> {
    return dbService.getGallery(matchId);
  }

  async uploadPhoto(item: GalleryItem): Promise<GalleryItem> {
    return dbService.saveGalleryItem(item);
  }

  async getPhotoCount(): Promise<number> {
    const gallery = await dbService.getGallery(undefined, 200);
    return gallery.length;
  }
}

export const galleryService = new GalleryService();
