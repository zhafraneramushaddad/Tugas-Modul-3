# Tugas Modul 3 Pemrograman Mobile: Autentikasi JWT & Push Notification
Dikerjakan oleh: Zhafran Era Mushaddad (09040625101)

## Cara Menjalankan Proyek

### 1. Persiapan Database
- Buat database baru di MySQL/phpMyAdmin dengan nama `db_mobile_auth`.
- Sesuaikan konfigurasi koneksi database pada file `.env` di folder backend.

### 2. Menjalankan Backend (Node.js/Express)
1. Buka terminal dan masuk ke folder `api-auth-notif`.
2. Jalankan perintah `npm install` untuk mengunduh dependencies.
3. Buat file `.env` berdasarkan `.env.example` (isi kredensial DB dan JWT_SECRET).
4. Jalankan server dengan perintah `npm run dev`.

### 3. Menjalankan Frontend (React Native/Expo)
1. Buka terminal baru dan masuk ke folder `mobile-auth-notif`.
2. Jalankan perintah `npm install`.
3. Buat file `.env` dan isi `EXPO_PUBLIC_API_URL=http://<IP_LAPTOP_ANDA>:3000`.
4. Bersihkan cache dan jalankan aplikasi dengan perintah `npx expo start -c`.
5. Scan QR Code menggunakan aplikasi Expo Go di Android/iOS.
