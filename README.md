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

Fitur calendar **["Panggih" ]** adalah Kalender Event untuk wisatawan mengetahui event yang sedang atau akan berlangsung di sekitar tempat wisata

Proyek ini dibangun menggunakan tumpukan teknologi (Stack) utama berikut:
**HTML, CSS, Java Script, Dan Node js dengan Express sebagai Backend**

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
    git clone [https://github.com/YourUsername/YourRepo.git](https://github.com/Rfn18/Final_JYCC2025_Kurang_Titik_Koma)
    cd YourRepo
    ```

2.  **Instal Dependensi**

    pergi ke folder backend terlebih dahulu dan

    ```bash
    npm install
    # atau
    yarn install
    ```

3.  **Konfigurasi Variabel Lingkungan**
    Buat file `.env` di _root_ proyek dan tambahkan variabel-variabel berikut:

    ```
     SUPABASE_URL=https://yoursupabaseurl.supabase.co
     SUPABASE_KEY=yoursupabasekey

    ```

4.  **Buat Tabel Di Supabase**
    sql_editor = "
    create table public.events (
    id uuid not null default gen_random_uuid (),
    nama_event text not null,
    location text not null,
    jam_mulai time without time zone not null,
    jam_selesai time without time zone not null,
    no_wa text null,
    email text null,
    harga_tiket text null,
    created_at timestamp without time zone null default now(),
    latitude numeric null,
    longitude numeric null,
    description text null,
    tanggal_mulai date not null,
    tanggal_selesai date not null,
    constraint events_pkey primary key (id)
    ) TABLESPACE pg_default;"

5.  **Jalankan Scrapping**
    tetap di folder backend, jalankan :

    ```bash
    node scrapper.js
    ```

6.  **Jalankan Aplikasi**
    jalankan :

    ```bash
    npm run api-service
    # Aplikasi akan berjalan di http://localhost:3000
    ```

---

## 👨‍💻 Penggunaan

Setelah aplikasi berjalan, Anda dapat mengaksesnya data event melalui peramban.

```javascript
async function getEventsByDate(dateString) {
  try {
    const response = await fetch(`http://localhost:3000/events/${dateString}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (err) {
    console.error("Gagal mengambil data event:", err);
    return [];
  }
}

async function getEventsByMonth(year, month) {
  try {
    const monthString = String(month + 1).padStart(2, "0");

    const res = await fetch(
      `http://localhost:3000/events/month/${year}/${monthString}`
    );

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    return await res.json();
  } catch (err) {
    console.error("Gagal mengambil data event bulan ini:", err);
    return [];
  }
}
```
