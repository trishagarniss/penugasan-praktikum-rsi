# Praktikum Rekayasa Sistem Informasi (RSI)

Repositori ini berisi *source code* untuk penugasan RSI.

## 🛠️ Tech Stack
Proyek ini dibangun menggunakan teknologi berikut:
- **Python 3**
- **Dependency Management:** Poetry
- **Database:** PostgreSQL (berjalan di dalam Docker Container)
- **ORM (Object Relational Mapping):** SQLModel
- **Database Migrations:** Alembic

## 🗄️ Struktur Basis Data
Skema basis data `acara-rsi` terdiri dari 6 entitas utama yang saling berelasi:
- `roles`: Menyimpan tingkat akses pengguna.
- `users`: Menyimpan data profil utama pengguna.
- `accounts`: Menyimpan kredensial autentikasi (username, password) yang berelasi dengan `users` dan `roles`.
- `events`: Menyimpan informasi acara yang tersedia.
- `registrations`: Tabel *junction* untuk mencatat pendaftaran *user* pada suatu *event*.
- `logs`: Mencatat riwayat aktivitas dari setiap akun.

## 🚀 Cara Menjalankan Proyek (Local Setup)

### 1. Prasyarat
Pastikan sistem Anda sudah terinstal perangkat lunak berikut:
- [Docker](https://www.docker.com/) & Docker Compose
- [Python](https://www.python.org/)
- [Poetry](https://python-poetry.org/)

### 2. Menjalankan Database PostgreSQL
Buka terminal di dalam direktori `backend` dan jalankan Docker Compose untuk menyalakan *container* database:
```bash
docker compose up -d
```

*Catatan: Database akan berjalan di `localhost` pada port `5433`.*

### 3. Instalasi Dependency
Aktifkan *virtual environment* dan instal semua pustaka yang dibutuhkan menggunakan Poetry:
```bash
poetry install
```

### 4. Eksekusi Migrasi Database (Alembic)
Untuk membuat tabel-tabel secara fisik di dalam database PostgreSQL, jalankan perintah migrasi berikut:
```bash
poetry run alembic upgrade head
```

### 5. Verifikasi
Gunakan Database Management Tool seperti DBeaver untuk memverifikasi tabel yang telah terbuat.
- Host: localhost
- Port: 5433
- Database: acara-rsi
- User: postgres
- Password: 1234
