import { Song, Image } from '../models';

export class SongService {
  async getAll(): Promise<Song[]> {
    return Song.findAll();
  }

  async getById(id: number): Promise<Song | null> {
    return Song.findByPk(id);
  }

  async create(title: string): Promise<Song> {
    return Song.create({ title });
  }

  async update(id: number, title: string): Promise<Song | null> {
    const song = await Song.findByPk(id);
    if (!song) return null;
    song.title = title;
    await song.save();
    return song;
  }

  async delete(id: number): Promise<boolean> {
    const song = await Song.findByPk(id);
    if (!song) return false;
    // Cascade delete via association (onDelete: 'CASCADE')
    await song.destroy();
    return true;
  }

  async getImages(songId: number): Promise<Image[]> {
    const song = await Song.findByPk(songId, {
      include: [{ model: Image }],
    });
    if (!song) return [];
    return (song as Song & { Images: Image[] }).Images ?? [];
  }

  async getSongCount(): Promise<{ message: string; songs: { id: number; title: string }[] }> {
    const songs = await Song.findAll();
    return {
      message: `Total songs: ${songs.length}`,
      songs: songs.map((s) => ({ id: s.id, title: s.title })),
    };
  }
}

export const songService = new SongService();
