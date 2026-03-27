import 'dotenv/config';
import express from 'express';
import { sequelize } from './db/database';
import './models/index'; // registra asociaciones

import accountRoutes from './routes/accountRoutes';
import songRoutes from './routes/songRoutes';
import imageRoutes from './routes/imageRoutes';

const app = express();
const PORT = process.env.PORT ?? 10000;

app.use(express.json());

// Rutas
app.use('/api/account', accountRoutes);
app.use('/api/songs', songRoutes);
app.use('/api/images', imageRoutes);

// Sincronizar la base de datos y arrancar el servidor
sequelize
  .sync()
  .then(() => {
    console.log('Database synced');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err: Error) => {
    console.error('Failed to sync database:', err);
    process.exit(1);
  });
