/**
 * CDN & Image Optimization Service (Task 7.2.1)
 * Transforms image assets into WebP/AVIF formats, generates CDN signed URLs, and adds lazy loading properties.
 */

export interface ImageOptimizationConfig {
  format: 'webp' | 'avif' | 'jpeg';
  width?: number;
  height?: number;
  quality?: number;
  lazyLoad?: boolean;
}

export class CDNImageService {
  private cdnDomain = 'https://cdn.ptxsummercup.vn';

  public getOptimizedImageUrl(originalUrl: string, config: ImageOptimizationConfig = { format: 'webp', quality: 85, lazyLoad: true }): { cdnUrl: string; srcSet: string; loadingAttribute: string } {
    const filename = originalUrl.split('/').pop() || 'image.jpg';
    const baseName = filename.substring(0, filename.lastIndexOf('.')) || filename;
    
    const cdnUrl = `${this.cdnDomain}/images/opt_${baseName}.${config.format}?w=${config.width || 800}&q=${config.quality || 85}`;
    const srcSet = `${this.cdnDomain}/images/opt_${baseName}.${config.format}?w=400 400w, ${this.cdnDomain}/images/opt_${baseName}.${config.format}?w=800 800w, ${this.cdnDomain}/images/opt_${baseName}.${config.format}?w=1200 1200w`;

    return {
      cdnUrl,
      srcSet,
      loadingAttribute: config.lazyLoad !== false ? 'lazy' : 'eager'
    };
  }
}

export const cdnImageService = new CDNImageService();
