# 🚀 Panggih - Explore and Go Jatim

[![Lisensi: Proyek ini dilisensikan di bawah [Lisensi GNU](LICENSE).]]

---

## 📖 Daftar Isi

1.  [Tentang Proyek](#-tentang-proyek)
2.  [Fitur](#-fitur)
3.  [Memulai](#-memulai)
    - [Prasyarat](#prasyarat)
    - [Instalasi](#instalasi)
4.  [Penggunaan](#-penggunaan)
5.  [Pengujian](#-pengujian)
6.  [Kontribusi](#-kontribusi)
7.  [Lisensi](#-lisensi)
8.  [Kontak](#-kontak)

---

## 💡 Tentang Proyek

## 💡 Tentang Proyek

**Panggih** adalah **Kalender Event** berbasis web yang dirancang untuk membantu **wisatawan** menemukan _event_ budaya, pariwisata, dan kegiatan yang sedang atau akan berlangsung di sekitar tempat wisata di **Jawa Timur (Jatim)**.

Proyek ini dibangun menggunakan tumpukan teknologi (Stack) utama berikut:

- **Frontend:** HTML, CSS, dan Vanilla JavaScript
- **Backend:** Node.js (dengan Express)
- **Database:** Supabase (PostgreSQL)

## 🌟 Fitur

- ✅ [Fitur Utama 1]: Menampilkan event yang sedang atau akan berlangsung di sekitar tempat wisata.
- 📊 [Fitur Utama 2]: Srapping data dari website https://sidita.disbudpar.jatimprov.go.id/.

---

## 🛠️ Memulai

Ikuti langkah-langkah di bawah ini untuk mendapatkan salinan proyek yang berjalan di mesin lokal Anda untuk tujuan pengembangan dan pengujian.

### Prasyarat

Pastikan Anda memiliki _software_ berikut yang terinstal di sistem Anda:

- **Node.js** (Versi minimum v18.x)
- **npm** atau **Yarn**
- **Git**

### Instalasi

1.  **Kloning Repositori**

    ```bash
    git clone [https://github.com/Rfn18/Final_JYCC2025_Kurang_Titik_Koma.git](https://github.com/Rfn18/Final_JYCC2025_Kurang_Titik_Koma.git)
    cd Final_JYCC2025_Kurang_Titik_Koma
    ```

2.  **Instal Dependensi Backend**
    _Penting: Pindah ke direktori backend terlebih dahulu._

    ```bash
    cd backend
    npm install
    # atau
    yarn install
    ```

3.  **Konfigurasi Variabel Lingkungan**
    Buat file `.env` **di dalam direktori `backend`** dan tambahkan variabel-variabel Supabase:

    ```
    SUPABASE_URL=[https://yoursupabaseurl.supabase.co](https://yoursupabaseurl.supabase.co)
    SUPABASE_KEY=yoursupabasekey
    ```

4.  **Setup Database (Supabase)**
    Impor skema tabel yang dibutuhkan ke instance Supabase Anda.

    - **Skema Tabel:** Gunakan editor SQL di Supabase dan jalankan skrip SQL yang tersedia di file **`db/events_table_schema.sql`**

5.  **Jalankan Scrapping dan Isi Data Awal**
    _(Pastikan Anda masih di folder `backend`)_

    ```bash
    node scrapper.js
    ```

    (Langkah ini akan mengisi data event dari [https://sidita.disbudpar.jatimprov.go.id/](https://sidita.disbudpar.jatimprov.go.id/) ke database Supabase.)

6.  **Jalankan Aplikasi (API Service)**
    _(Pastikan Anda masih di folder `backend`)_
    ```bash
    npm run api-service
    # API akan berjalan di http://localhost:3000
    ```

## 👨‍💻 Penggunaan

Setelah layanan API (`http://localhost:3000`) berjalan, Anda dapat mengakses data _event_ melalui _endpoint_ REST.

Berikut adalah contoh fungsi JavaScript (misalnya, di sisi _frontend_ atau pengujian) untuk mengambil data:

### A. Mengambil Event Berdasarkan Tanggal

```javascript
// Mengambil event berdasarkan tanggal spesifik (format YYYY-MM-DD)
async function getEventsByDate(dateString) {
  // ... [kode yang sudah Anda buat] ...
}
// Contoh penggunaan: getEventsByDate("2025-12-01")
```
