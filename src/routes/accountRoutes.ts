import { Router, Request, Response } from 'express';
import { body, param, validationResult } from 'express-validator';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { User, Role, UserRole } from '../models';

const router = Router();

// POST /api/account/register
router.post(
  '/register',
  [
    body('username').notEmpty().withMessage('Username is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  ],
  async (req: Request, res: Response): Promise<void> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const { username, email, password } = req.body;

    const existing = await User.findOne({ where: { username } });
    if (existing) {
      res.status(400).json({ message: 'Username already taken' });
      return;
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ id: uuidv4(), username, email, passwordHash });

    res.status(201).json({ message: 'User registered successfully', userId: user.id });
  }
);

// POST /api/account/login
router.post(
  '/login',
  [
    body('username').notEmpty().withMessage('Username is required'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  async (req: Request, res: Response): Promise<void> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const { username, password } = req.body;

    const user = await User.findOne({ where: { username } });
    if (!user) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    const roles = await Role.findAll({
      include: [{ model: User, where: { id: user.id }, attributes: [] }],
    });
    const roleNames = roles.map((r) => r.name);

    const isBot = roleNames.includes('bot');
    const expiresIn = isBot ? '100y' : '3h';

    const token = jwt.sign(
      { sub: user.id, name: user.username, roles: roleNames, jti: uuidv4() },
      process.env.JWT_KEY!,
      { issuer: 'badrithm', audience: 'cancionito', expiresIn }
    );

    res.json({ token });
  }
);

// POST /api/account/role  — crear un nuevo rol
router.post('/role', async (req: Request, res: Response): Promise<void> => {
  const { roleName } = req.body;
  if (!roleName) {
    res.status(400).json({ message: 'roleName is required' });
    return;
  }

  const existing = await Role.findOne({ where: { name: roleName } });
  if (existing) {
    res.status(400).json({ message: 'Role already exists' });
    return;
  }

  const role = await Role.create({ id: uuidv4(), name: roleName });
  res.status(201).json({ message: 'Role created', roleId: role.id });
});

// POST /api/account/assign-role — asignar rol a usuario
router.post(
  '/assign-role',
  [
    body('username').notEmpty(),
    body('role').notEmpty(),
  ],
  async (req: Request, res: Response): Promise<void> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const { username, role } = req.body;

    const user = await User.findOne({ where: { username } });
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    const roleRecord = await Role.findOne({ where: { name: role } });
    if (!roleRecord) {
      res.status(404).json({ message: 'Role not found' });
      return;
    }

    const alreadyAssigned = await UserRole.findOne({ where: { userId: user.id, roleId: roleRecord.id } });
    if (alreadyAssigned) {
      res.status(400).json({ message: 'User already has this role' });
      return;
    }

    await UserRole.create({ userId: user.id, roleId: roleRecord.id });
    res.json({ message: `Role '${role}' assigned to '${username}'` });
  }
);

// GET /api/account/roles
router.get('/roles', async (_req: Request, res: Response): Promise<void> => {
  const roles = await Role.findAll();
  res.json(roles);
});

// GET /api/account/users
router.get('/users', async (_req: Request, res: Response): Promise<void> => {
  const users = await User.findAll({ attributes: ['id', 'username', 'email'] });
  res.json(users);
});

// GET /users/:id/roles
router.get(
  '/:id/roles',
  [param('id').notEmpty()],
  async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const user = await User.findByPk(id);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    const roles = await Role.findAll({
      include: [{ model: User, where: { id }, attributes: [] }],
    });

    res.json(roles.map((r) => r.name));
  }
);

// DELETE /api/account/user/:id
router.delete(
  '/user/:id',
  [param('id').notEmpty()],
  async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const user = await User.findByPk(id);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    await UserRole.destroy({ where: { userId: id } });
    await user.destroy();
    res.json({ message: 'User deleted successfully' });
  }
);

export default router;
