import { Sequelize } from 'sequelize';
import path from 'path';

const dbPath = process.env.DB_PATH || path.join(__dirname, '../../Data/cancionito.db');

export const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: dbPath,
  logging: false,
});
