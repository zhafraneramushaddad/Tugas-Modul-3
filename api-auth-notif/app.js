import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.js';
import tugasRoutes from './routes/tugas.js';
import notificationRoutes from './routes/notifications.js';

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ pesan: 'API Auth, Notification & Tugas berjalan' });
});

app.use('/auth', authRoutes);
app.use('/tugas', tugasRoutes);
app.use('/notifications', notificationRoutes);

export default app;