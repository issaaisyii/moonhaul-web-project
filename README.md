# MoonHaul Web Project

MoonHaul adalah aplikasi e-commerce merchandise K-Pop berbasis web yang dirancang khusus untuk menangani proses pre-order katalog musik dan merchandise K-Pop. Aplikasi ini menyediakan panel antarmuka yang terintegrasi untuk dua kelompok pengguna, yaitu Customer dan Admin. Dukungan aplikasi meliputi pencarian katalog, manajemen keranjang, pengisian checkout, upload bukti bayar transfer manual, serta pelacakan pengiriman secara langsung.

---

## 1. Deskripsi Aplikasi

MoonHaul dikembangkan untuk memberikan kemudahan bagi penggemar K-Pop dalam melakukan pemesanan pre-order barang-barang merchandise. Sistem ini membagi otoritas akses menjadi dua:
1. **Customer**: Mengakses katalog merchandise, menyusun barang belanjaan di keranjang, melakukan checkout, mengunggah struk bukti transfer pembayaran secara manual, serta memantau progres pesanan secara detail.
2. **Admin**: Mengelola kategori barang, mengedit daftar produk katalog, memproses validasi pembayaran, memperbarui status logistik pesanan, mengaudit transaksi lewat Sales Report, dan melihat statistik performa toko secara real-time.

---

## 2. Fitur Aplikasi

### Customer
- **Register**: Membuat akun baru dengan validasi data real-time.
- **Login**: Autentikasi akun menggunakan token JWT.
- **Melihat Katalog Merchandise**: Menelusuri seluruh daftar produk merchandise.
- **Pencarian Produk**: Mencari produk secara spesifik berdasarkan nama.
- **Filter Kategori**: Menyaring daftar barang berdasarkan kategori pre-order.
- **Detail Produk**: Menampilkan deskripsi produk, harga, stok, dan estimasi rilis.
- **Shopping Cart**: Mengelola kuantitas item, menghitung subtotal otomatis, dan menghapus isi keranjang.
- **Checkout**: Mengunci daftar pesanan pre-order untuk diproses.
- **Upload Bukti Pembayaran**: Mengunggah gambar struk transfer bank sebagai bukti bayar manual.
- **Riwayat Pesanan**: Melihat daftar transaksi belanjaan yang pernah dilakukan.
- **Tracking Status Pesanan**: Melacak perkembangan pesanan berdasarkan timeline tahapan logistik.
- **Profile & Settings**: Mengedit nama lengkap dan mengganti kata sandi secara aman.

### Admin
- **Login**: Autentikasi administrator secara aman menggunakan JWT.
- **Dashboard**: Panel ringkasan statistik (jumlah pelanggan, total produk, status pesanan aktif, antrean verifikasi, dan total pendapatan).
- **Manajemen Kategori**: Menambah, mengedit, mencari, dan menghapus kategori produk.
- **Manajemen Merchandise**: Menambah, memperbarui, mencari, dan menghapus produk katalog.
- **Verifikasi Pembayaran**: Menerima atau menolak bukti pembayaran dari customer dengan catatan penolakan.
- **Manajemen Pesanan**: Memperbarui status pengiriman order secara bertahap hingga selesai.
- **Manajemen Customer**: Memantau daftar pelanggan terdaftar, jumlah transaksi, total spending, dan link order.
- **Sales Report**: Laporan penjualan bulanan, produk terlaris, dan riwayat invoice transaksi terbaru.
- **Profile & Settings**: Mengedit identitas administrator dan memperbarui password admin.

---

## 3. Teknologi

### Frontend
- **Core**: React.js (Vite)
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM
- **HTTP Client**: Axios (dilengkapi Global Interceptor untuk auto-logout token kadaluarsa 401)
- **Icons**: Heroicons

### Backend
- **Framework**: Node.js & Express.js
- **Database ORM**: Prisma ORM
- **Database Engine**: MySQL
- **Autentikasi**: JSON Web Token (JWT)
- **Enkripsi**: Bcrypt
- **File Uploader**: Multer

---

## 4. Cara Instalasi

Ikuti langkah-langkah di bawah ini untuk mengunduh dependencies aplikasi:

1. **Clone Repository**
   ```bash
   git clone https://github.com/issaaisyii/moonhaul-web-project.git
   cd moonhaul-web-project
   ```

2. **Instalasi Dependency Backend**
   ```bash
   cd backend
   npm install
   ```

3. **Instalasi Dependency Frontend**
   ```bash
   cd ../frontend
   npm install
   ```

---

## 5. Cara Konfigurasi

### File `.env` Backend
Buat berkas `.env` di dalam direktori `backend/` dan sesuaikan variabel berikut:
```env
PORT=5000
DATABASE_URL="mysql://username:password@localhost:3306/moonhaul"
JWT_SECRET="masukkan_jwt_secret_key_anda_di_sini"
```
*(Catatan: Sesuaikan username, password, dan port MySQL lokal Anda pada variabel DATABASE_URL. Buat juga database kosong bernama `moonhaul` di MySQL Anda).*

### File `.env` Frontend
Buat berkas `.env` di dalam direktori `frontend/` dan sesuaikan variabel berikut:
```env
VITE_API_URL="http://localhost:5000/api"
```

### Migrasi Database & Seeder
Jalankan perintah berikut di dalam direktori `backend/` untuk membuat tabel-tabel database dan mengisi data dummy default:
```bash
npx prisma migrate dev
npm run seed
```

---

## 6. Cara Menjalankan

Jalankan server backend dan frontend secara bersamaan:

### Menjalankan Backend
Masuk ke direktori `backend/` dan jalankan:
```bash
npm run dev
```
Backend akan berjalan pada alamat: [http://localhost:5000](http://localhost:5000)

### Menjalankan Frontend
Masuk ke direktori `frontend/` dan jalankan:
```bash
npm run dev
```
Frontend akan berjalan pada alamat: [http://localhost:5173](http://localhost:5173)

---

## 7. Akun Pengujian

Gunakan akun default berikut yang telah disediakan oleh seeder untuk menguji kedua panel pengguna:

| Role | Email | Password |
|---|---|---|
| **ADMIN** | `admin@moonhaul.com` | `admin123` |
| **CUSTOMER** | `customer@moonhaul.com` | `customer123` |

---

## 8. Struktur Folder

Berikut adalah visualisasi struktur direktori utama aplikasi:

```text
moonhaul-web-project/
├── backend/
│   ├── controllers/      # Logika pemrosesan data (API controllers)
│   ├── middlewares/      # Validasi otentikasi JWT & filter upload file
│   ├── prisma/           # Berkas schema database & script seeder
│   ├── routes/           # Routing API backend
│   ├── uploads/          # Folder lokal untuk file bukti pembayaran
│   ├── utils/            # Inisialisasi Prisma client
│   └── index.js          # Entry point aplikasi backend
│
└── frontend/
    ├── src/
    │   ├── components/   # Komponen UI reusable (input, card, sidebar)
    │   ├── contexts/     # AuthContext API untuk status login pengguna
    │   ├── layouts/      # Wrapper layout halaman (Admin & Customer)
    │   ├── pages/        # Halaman antarmuka aplikasi
    │   ├── routes/       # Konfigurasi routing halaman React
    │   └── services/     # Layanan API (Axios instance & endpoint requests)
```

---

## 9. Cara Pengujian

1. **Pengujian Customer**:
   - Masuk ke [http://localhost:5173/login](http://localhost:5173/login), login dengan akun Customer (`customer@moonhaul.com`).
   - Telusuri halaman Shop, cari produk, dan tambahkan beberapa merchandise ke keranjang (Cart).
   - Masuk ke keranjang belanja, klik **Checkout** untuk membuat pesanan.
   - Buka halaman **Orders**, pilih pesanan tersebut, lalu unggah bukti transfer bank (gambar struk).
   
2. **Pengujian Admin**:
   - Logout dari akun Customer, lalu masuk sebagai Admin menggunakan email (`admin@moonhaul.com`).
   - Buka panel **Payment Verification** untuk memverifikasi pembayaran customer tadi, klik **Approve**.
   - Masuk ke menu **Orders**, cari pesanan tersebut, lalu ubah statusnya secara bertahap dari `PROCESSING` -> `SHIPPED`.
   
3. **Konfirmasi Pengiriman**:
   - Login kembali sebagai Customer, lalu buka halaman **Order Tracking** untuk melihat perubahan status pesanan Anda yang kini berada pada status pengiriman (`SHIPPED`).

---

## 10. Keterbatasan Aplikasi

- **Sistem Pembayaran**: Verifikasi pembayaran masih mengandalkan upload struk transfer secara manual oleh pengguna dan persetujuan manual oleh admin. Belum terintegrasi dengan Payment Gateway (seperti Midtrans/Xendit).
- **Penyimpanan Berkas**: Gambar struk bukti transfer disimpan secara lokal di dalam folder server backend, bukan di Cloud Storage (seperti Cloudinary atau AWS S3).
- **Notifikasi**: Belum tersedia notifikasi real-time (seperti email konfirmasi atau Web Push Notifications) saat status pesanan diperbarui oleh admin.
- **Deployment**: Aplikasi saat ini dikembangkan untuk dijalankan pada lingkungan lokal (*localhost*) dan belum di-deploy ke layanan cloud hosting.

---

## Disusun Oleh

**Aisyah Fitri Ramadhani**  
2450101030

**PROGRAM STUDI AKUNTANSI**

**FAKULTAS EKONOMI DAN BISNIS**

**UNIVERSITAS JENDERAL ACHMAD YANI**

**CIMAHI**

**2026**