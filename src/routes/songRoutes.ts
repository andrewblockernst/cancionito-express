import { Router, Request, Response } from 'express';
import { body, param, validationResult } from 'express-validator';
import { authenticate, authorize } from '../middleware/auth';
import { songService } from '../services/SongService';

const router = Router();

// Todas las rutas de canciones requieren autenticación y rol admin o bot
router.use(authenticate, authorize('admin', 'bot'));

// GET /api/songs
router.get('/', async (_req: Request, res: Response): Promise<void> => {
  const songs = await songService.getAll();
  res.json(songs);
});

// GET /api/songs/count
router.get('/count', async (_req: Request, res: Response): Promise<void> => {
  const result = await songService.getSongCount();
  res.json(result);
});

// GET /api/songs/:id
router.get(
  '/:id',
  [param('id').isInt().withMessage('ID must be an integer')],
  async (req: Request, res: Response): Promise<void> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const song = await songService.getById(parseInt(req.params.id));
    if (!song) {
      res.status(404).json({ message: 'Song not found' });
      return;
    }
    res.json(song);
  }
);

// GET /api/songs/:idSong/images
router.get(
  '/:idSong/images',
  [param('idSong').isInt()],
  async (req: Request, res: Response): Promise<void> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const images = await songService.getImages(parseInt(req.params.idSong));
    res.json(images);
  }
);

// POST /api/songs
router.post(
  '/',
  [body('title').notEmpty().withMessage('Title is required').isLength({ max: 100 })],
  async (req: Request, res: Response): Promise<void> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const song = await songService.create(req.body.title);
    res.status(201).json(song);
  }
);

// PUT /api/songs/:id
router.put(
  '/:id',
  [
    param('id').isInt(),
    body('title').notEmpty().withMessage('Title is required').isLength({ max: 100 }),
  ],
  async (req: Request, res: Response): Promise<void> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const updated = await songService.update(parseInt(req.params.id), req.body.title);
    if (!updated) {
      res.status(404).json({ message: 'Song not found' });
      return;
    }
    res.json(updated);
  }
);

// DELETE /api/songs/:id
router.delete(
  '/:id',
  [param('id').isInt()],
  async (req: Request, res: Response): Promise<void> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const deleted = await songService.delete(parseInt(req.params.id));
    if (!deleted) {
      res.status(404).json({ message: 'Song not found' });
      return;
    }
    res.json({ message: 'Song deleted successfully' });
  }
);

export default router;
