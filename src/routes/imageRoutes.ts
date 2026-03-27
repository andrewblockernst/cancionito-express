import { Router, Request, Response } from 'express';
import { body, param, query, validationResult } from 'express-validator';
import { authenticate, authorize } from '../middleware/auth';
import { imageService } from '../services/ImageService';

const router = Router();

// Todas las rutas de imágenes requieren autenticación y rol admin o bot
router.use(authenticate, authorize('admin', 'bot'));

// GET /api/images
router.get('/', async (_req: Request, res: Response): Promise<void> => {
  const images = await imageService.getAll();
  res.json(images);
});

// GET /api/images/:idSong/:idInternal
router.get(
  '/:idSong/:idInternal',
  [param('idSong').isInt(), param('idInternal').isInt()],
  async (req: Request, res: Response): Promise<void> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const image = await imageService.getById(
      parseInt(req.params.idSong),
      parseInt(req.params.idInternal)
    );
    if (!image) {
      res.status(404).json({ message: 'Image not found' });
      return;
    }
    res.json(image);
  }
);

// POST /api/images
router.post(
  '/',
  [
    body('internalId').isInt().withMessage('internalId must be an integer'),
    body('songId').isInt().withMessage('songId must be an integer'),
    body('url').notEmpty().withMessage('url is required'),
  ],
  async (req: Request, res: Response): Promise<void> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const image = await imageService.create(req.body);
    if (!image) {
      res.status(404).json({ message: 'Song not found' });
      return;
    }
    res.status(201).json(image);
  }
);

// PUT /api/images/:idSong/:idInternal
router.put(
  '/:idSong/:idInternal',
  [
    param('idSong').isInt(),
    param('idInternal').isInt(),
    body('internalId').isInt(),
    body('songId').isInt(),
    body('url').notEmpty(),
  ],
  async (req: Request, res: Response): Promise<void> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const updated = await imageService.update(
      parseInt(req.params.idSong),
      parseInt(req.params.idInternal),
      req.body
    );
    if (!updated) {
      res.status(404).json({ message: 'Image not found' });
      return;
    }
    res.json(updated);
  }
);

// DELETE /api/images?songId=&internalId=
router.delete(
  '/',
  [
    query('songId').isInt().withMessage('songId must be an integer'),
    query('internalId').isInt().withMessage('internalId must be an integer'),
  ],
  async (req: Request, res: Response): Promise<void> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const deleted = await imageService.delete(
      parseInt(req.query.songId as string),
      parseInt(req.query.internalId as string)
    );
    if (!deleted) {
      res.status(404).json({ message: 'Image not found' });
      return;
    }
    res.json({ message: 'Image deleted successfully' });
  }
);

export default router;
