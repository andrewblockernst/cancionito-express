import { Sequelize } from 'sequelize';
import path from 'path';

// Use in-memory SQLite for Vercel, or file-based for local development
const storage = process.env.NODE_ENV === 'production' ? ':memory:' : path.join(__dirname, '../../Data/cancionito.db');

export const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: storage,
  logging: false,
});
