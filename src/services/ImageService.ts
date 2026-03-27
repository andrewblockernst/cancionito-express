import { Image, Song } from '../models';
import { cloudinaryService } from './CloudinaryService';

export interface ImageDTO {
  internalId: number;
  songId: number;
  url: string;
}

export class ImageService {
  async getAll(): Promise<Image[]> {
    return Image.findAll();
  }

  async getById(songId: number, internalId: number): Promise<Image | null> {
    return Image.findOne({ where: { songId, internalId } });
  }

  async create(dto: ImageDTO): Promise<Image | null> {
    const song = await Song.findByPk(dto.songId);
    if (!song) return null;

    const cloudinaryUrl = await cloudinaryService.uploadImageAsync(dto.url);

    return Image.create({
      internalId: dto.internalId,
      songId: dto.songId,
      url: cloudinaryUrl,
    });
  }

  async update(songId: number, internalId: number, dto: ImageDTO): Promise<Image | null> {
    const image = await Image.findOne({ where: { songId, internalId } });
    if (!image) return null;

    image.internalId = dto.internalId;
    image.songId = dto.songId;
    image.url = dto.url;
    await image.save();
    return image;
  }

  async delete(songId: number, internalId: number): Promise<boolean> {
    const image = await Image.findOne({ where: { songId, internalId } });
    if (!image) return false;

    await cloudinaryService.deleteFromCloudinaryAsync(image.url);
    await image.destroy();
    return true;
  }
}

export const imageService = new ImageService();
