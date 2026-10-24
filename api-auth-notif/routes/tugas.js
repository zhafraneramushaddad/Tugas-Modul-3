import { Router } from 'express';
import { pool } from '../db.js';
import { wajibLogin } from '../middleware/auth.js';
import { kirimExpoPush } from '../services/pushService.js';

const router = Router();

// Get Semua Tugas User
router.get('/', wajibLogin, async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM tugas WHERE user_id = ? ORDER BY dibuat_pada DESC', [req.user.sub]);
    res.json(rows);
  } catch (e) {
    res.status(500).json({ pesan: 'Gagal mengambil tugas' });
  }
});

// Tambah Tugas & Kirim Notifikasi (Syarat 4 & 5 E.4)
router.post('/', wajibLogin, async (req, res) => {
  const { judul, deskripsi } = req.body;
  if (!judul) return res.status(400).json({ pesan: 'Judul tugas wajib diisi' });
  
  try {
    const [hasil] = await pool.query(
      'INSERT INTO tugas (user_id, judul, deskripsi) VALUES (?, ?, ?)',
      [req.user.sub, judul, deskripsi || '']
    );

    // Cari token perangkat milik user yang sedang login
    const [tokens] = await pool.query(
      'SELECT expo_push_token FROM push_tokens WHERE user_id = ? ORDER BY diperbarui_pada DESC LIMIT 1',
      [req.user.sub]
    );

    // Kirim push notification jika token ditemukan
    if (tokens.length > 0) {
      await kirimExpoPush(tokens[0].expo_push_token, {
        title: 'Tugas Baru Ditambahkan!',
        body: `Tugas "${judul}" berhasil disimpan ke sistem.`,
        data: { screen: 'index' } // Payload data navigasi
      });
    }

    res.status(201).json({ pesan: 'Tugas berhasil dibuat', id: hasil.insertId });
  } catch (e) {
    res.status(500).json({ pesan: 'Gagal menambah tugas' });
  }
});

export default router;