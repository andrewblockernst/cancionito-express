import { v2 as cloudinary } from 'cloudinary';

// Cloudinary se configura automáticamente desde CLOUDINARY_URL en el entorno
cloudinary.config(true);

export class CloudinaryService {
  async uploadImageAsync(imageUrl: string): Promise<string> {
    const result = await cloudinary.uploader.upload(imageUrl, {
      folder: 'images',
    });
    return result.secure_url;
  }

  async deleteFromCloudinaryAsync(url: string): Promise<string> {
    const publicId = this.extractPublicIdFromUrl(url);
    if (!publicId) {
      return 'Could not extract public ID from URL';
    }
    const result = await cloudinary.uploader.destroy(publicId);
    return result.result === 'ok' ? 'Image deleted successfully' : `Error deleting image: ${result.result}`;
  }

  private extractPublicIdFromUrl(url: string): string | null {
    // URL format: https://res.cloudinary.com/{cloud}/image/upload/v{version}/images/{id}.{ext}
    const match = url.match(/\/upload\/(?:v\d+\/)?(.+)\.\w+$/);
    return match ? match[1] : null;
  }
}

export const cloudinaryService = new CloudinaryService();
