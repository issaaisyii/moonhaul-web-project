# MoonHaul Feature Documentation

Dokumen ini berisi penjelasan resmi mengenai fitur, arsitektur, basis data, endpoint API, dan alur kerja aplikasi e-commerce merchandise K-Pop MoonHaul berdasarkan source code yang telah diimplementasikan.

---

## 1. Ringkasan Aplikasi

**MoonHaul** adalah aplikasi web e-commerce yang dirancang secara khusus untuk memfasilitasi transaksi pre-order merchandise K-Pop (seperti album musik, lightstick, dan merchandise resmi lainnya). Aplikasi ini memiliki sistem otentikasi berbasis JWT, otorisasi berbasis peran (role-based), pencatatan keranjang belanja dinamis, sistem manajemen pesanan terpusat dengan lini masa status, verifikasi pembayaran manual menggunakan upload berkas gambar struk transfer bank, serta dasbor analitik penjualan bagi pihak administrator.

---

## 2. Aktor Sistem

Sistem MoonHaul memiliki 3 (tiga) kategori aktor utama dengan otoritas sebagai berikut:

1. **Guest (Tamu / Pengunjung Tanpa Login)**
   - Dapat menelusuri katalog produk merchandise.
   - Dapat mencari barang belanjaan dan melihat detail detail produk.
   - Memiliki akses untuk mendaftarkan akun baru (*Register*) dan masuk log (*Login*).

2. **Customer (Pelanggan Terdaftar)**
   - Memiliki semua hak akses yang dimiliki oleh Guest.
   - Dapat menambahkan produk merchandise ke keranjang belanja, memperbarui kuantitas item keranjang, dan melakukan checkout.
   - Mengakses panel Dasbor Pelanggan untuk melihat rekapitulasi belanjaan, jumlah pesanan aktif, kuantitas item keranjang, dan total spending terformat Rupiah.
   - Dapat mengunggah berkas gambar struk bukti transfer pembayaran pre-order.
   - Dapat memantau riwayat transaksi belanjaan dan melacak status progres pengiriman barang lewat lini masa logistik.
   - Mengedit data profil personal dan mengganti kata sandi akun.

3. **Admin (Administrator Sistem)**
   - Mengakses dasbor utama administrator untuk melihat metrik total pelanggan, kategori, barang dagangan, riwayat transaksi, antrean konfirmasi pembayaran, serta grafik rekapitulasi pendapatan toko.
   - Mengelola kategori merchandise (tambah, edit, hapus, cari).
   - Mengelola katalog produk merchandise (tambah, edit, hapus, cari).
   - Memvalidasi data transfer pembayaran pre-order masuk (menyetujui / menolak pembayaran beserta catatan).
   - Mengelola alur status logistik pengiriman pesanan pelanggan.
   - Membaca data direktori pelanggan terdaftar, total pesanan mereka, dan nominal akumulasi belanjaan mereka.
   - Mengakses menu laporan penjualan (*Sales Report*) bulanan, daftar 5 produk terlaris, dan daftar 10 transaksi invoice terbaru.
   - Mengedit data profil pribadi admin dan mengganti kata sandi admin.

---

## 3. Daftar Fitur

Berikut adalah detail klasifikasi modul fitur yang tersedia bagi masing-masing aktor:

### Guest

#### Fitur: Register Akun
- **Tujuan**: Membuat akun pelanggan baru secara mandiri.
- **Endpoint Backend**: `POST /api/auth/register`
- **Halaman Frontend**: `/register`
- **Role Pengakses**: Guest

#### Fitur: Login Akun
- **Tujuan**: Membuka sesi interaktif menggunakan kredensial email dan password terdaftar untuk mendapat token JWT.
- **Endpoint Backend**: `POST /api/auth/login`
- **Halaman Frontend**: `/login`
- **Role Pengakses**: Guest

#### Fitur: Penelusuran Katalog Produk
- **Tujuan**: Menampilkan seluruh katalog merchandise K-Pop dengan dukungan filter kategori dan pencarian nama.
- **Endpoint Backend**: `GET /api/products`, `GET /api/categories`
- **Halaman Frontend**: `/`
- **Role Pengakses**: Guest, Customer

#### Fitur: Detail Deskripsi Merchandise
- **Tujuan**: Menampilkan informasi spesifik produk seperti nama barang, foto, harga, deskripsi barang, stok, kategori, dan tanggal rilis pre-order.
- **Endpoint Backend**: `GET /api/products/:id`
- **Halaman Frontend**: `/products/:id`
- **Role Pengakses**: Guest, Customer

---

### Customer

#### Fitur: Dasbor Pelanggan
- **Tujuan**: Menyajikan ringkasan metrik belanjaan: total pesanan aktif, nominal kumulatif pembelanjaan terformat Rupiah, kuantitas item keranjang, dan daftar 5 pesanan teratas.
- **Endpoint Backend**: `GET /api/dashboard/customer`
- **Halaman Frontend**: `/dashboard`
- **Role Pengakses**: Customer

#### Fitur: Manajemen Keranjang Belanja (Cart)
- **Tujuan**: Menyimpan item merchandise sementara, mengubah kuantitas beli, menghapus item belanjaan tertentu, dan mengosongkan keranjang.
- **Endpoint Backend**: `GET /api/cart`, `POST /api/cart/items`, `PUT /api/cart/items/:id`, `DELETE /api/cart/items/:id`, `DELETE /api/cart/clear`
- **Halaman Frontend**: `/cart`
- **Role Pengakses**: Customer

#### Fitur: Checkout Pre-Order
- **Tujuan**: Melakukan pesanan pre-order barang belanjaan dari keranjang belanja.
- **Endpoint Backend**: `POST /api/checkout`
- **Halaman Frontend**: `/checkout`
- **Role Pengakses**: Customer

#### Fitur: Riwayat Pesanan (Order History)
- **Tujuan**: Melihat daftar pesanan belanjaan lengkap dengan nomor ID order, nominal total, tanggal pemesanan, dan status logistik.
- **Endpoint Backend**: `GET /api/orders`
- **Halaman Frontend**: `/order-history`
- **Role Pengakses**: Customer

#### Fitur: Detail Pesanan & Timeline Progres
- **Tujuan**: Menampilkan rincian item barang dalam pesanan tertentu beserta alur lini masa status logistik.
- **Endpoint Backend**: `GET /api/orders/:id`
- **Halaman Frontend**: `/order-history/:id`
- **Role Pengakses**: Customer

#### Fitur: Upload Bukti Pembayaran
- **Tujuan**: Mengunggah file struk transfer manual untuk pesanan berstatus `WAITING_PAYMENT`.
- **Endpoint Backend**: `POST /api/payments/upload`, `GET /api/payments/my`
- **Halaman Frontend**: `/payment-upload/:orderId`
- **Role Pengakses**: Customer

#### Fitur: Pelacakan Pengiriman (Order Tracking)
- **Tujuan**: Melihat daftar pesanan pre-order yang sedang aktif dikirimkan.
- **Endpoint Backend**: `GET /api/orders`
- **Halaman Frontend**: `/order-tracking`
- **Role Pengakses**: Customer

#### Fitur: Update Profile & Ganti Password Customer
- **Tujuan**: Mengubah nama profil personal dan mengganti kata sandi akun dengan validasi password saat ini.
- **Endpoint Backend**: `PUT /api/auth/profile`, `GET /api/dashboard/customer`
- **Halaman Frontend**: `/profile`
- **Role Pengakses**: Customer

---

### Admin

#### Fitur: Dasbor Administrasi (Admin Dashboard)
- **Tujuan**: Menampilkan rangkuman statistik data master (total customer, kategori, merchandise, antrean verifikasi pembayaran, total pesanan, dan total pendapatan) serta histori customer pendaftar terbaru.
- **Endpoint Backend**: `GET /api/dashboard/admin`
- **Halaman Frontend**: `/admin`
- **Role Pengakses**: Admin

#### Fitur: Manajemen Kategori Produk
- **Tujuan**: Mengelola master kategori merchandise, termasuk menambahkan kategori baru, memperbarui nama kategori, menghapus kategori (yang tidak terikat dengan produk aktif), dan pencarian nama.
- **Endpoint Backend**: `GET /api/categories`, `POST /api/categories`, `PUT /api/categories/:id`, `DELETE /api/categories/:id`
- **Halaman Frontend**: `/admin/categories`
- **Role Pengakses**: Admin

#### Fitur: Manajemen Merchandise
- **Tujuan**: Mengelola katalog merchandise, termasuk menambahkan produk baru, memperbarui atribut barang (harga, deskripsi, stok, tanggal rilis pre-order), serta menghapus produk.
- **Endpoint Backend**: `GET /api/products`, `POST /api/products`, `PUT /api/products/:id`, `DELETE /api/products/:id`
- **Halaman Frontend**: `/admin/merchandise`
- **Role Pengakses**: Admin

#### Fitur: Manajemen Pesanan (Order Logistics)
- **Tujuan**: Memantau seluruh pesanan pre-order yang masuk dan mengubah status logistik pesanan secara berkala (WAITING_PAYMENT, PAYMENT_VERIFICATION, PROCESSING, PACKED, SHIPPED, DELIVERED, CANCELLED).
- **Endpoint Backend**: `GET /api/admin/orders`, `PUT /api/admin/orders/:id/status`
- **Halaman Frontend**: `/admin/orders`
- **Role Pengakses**: Admin

#### Fitur: Verifikasi Pembayaran Manual
- **Tujuan**: Mengaudit berkas struk bukti transfer yang diunggah customer. Admin dapat menyetujui transaksi (mengubah status order ke `PROCESSING`) atau menolak transfer dengan menyertakan catatan (status order kembali ke `WAITING_PAYMENT`).
- **Endpoint Backend**: `GET /api/payments`, `PUT /api/payments/:id/approve`, `PUT /api/payments/:id/reject`
- **Halaman Frontend**: `/admin/payment-verification`
- **Role Pengakses**: Admin

#### Fitur: Direktori Pelanggan (Customer Directory)
- **Tujuan**: Menampilkan seluruh data customer terdaftar lengkap dengan tanggal join, jumlah transaksi, jumlah pesanan aktif, dan total spending terakumulasi belanja.
- **Endpoint Backend**: `GET /api/admin/customers`
- **Halaman Frontend**: `/admin/customers`
- **Role Pengakses**: Admin

#### Fitur: Laporan Keuangan Penjualan (Sales Report)
- **Tujuan**: Menyajikan rekapitulasi data penjualan bulanan, peringkat produk merchandise terlaris, dan histori transaksi invoice terbaru.
- **Endpoint Backend**: `GET /api/admin/sales-report`
- **Halaman Frontend**: `/admin/sales-report`
- **Role Pengakses**: Admin

#### Fitur: Update Profile & Ganti Password Admin
- **Tujuan**: Mengubah nama profil administrator dan mengganti kata sandi akun admin.
- **Endpoint Backend**: `PUT /api/auth/profile`
- **Halaman Frontend**: `/admin/profile`
- **Role Pengakses**: Admin

---

## 4. Daftar Halaman (Frontend Routes)

Berikut adalah daftar seluruh rute halaman frontend yang telah terimplementasi:

| Halaman | Route | Role | Deskripsi |
| :--- | :--- | :--- | :--- |
| **Login** | `/login` | Guest | Autentikasi email & password untuk login. |
| **Register** | `/register` | Guest | Pembuatan akun customer baru. |
| **Shop Catalog** | `/` | Guest, Customer | Daftar produk merchandise dengan search & filter kategori. |
| **Customer Dashboard** | `/dashboard` | Customer | Rekap belanja, pesanan aktif, dan ringkasan order terbaru. |
| **Product Detail** | `/products/:id` | Guest, Customer | Rincian spesifikasi barang merchandise & tombol add-to-cart. |
| **Shopping Cart** | `/cart` | Customer | Daftar belanja keranjang aktif. |
| **Checkout Confirmation** | `/checkout` | Customer | Rincian data pesanan sebelum checkout. |
| **Customer Profile** | `/profile` | Customer | Mengubah data profil customer & ganti password. |
| **Order History** | `/order-history` | Customer | Daftar riwayat transaksi pesanan belanja. |
| **Order Detail** | `/order-history/:id` | Customer | Rincian detail belanjaan & timeline logistik pesanan tertentu. |
| **Order Tracking** | `/order-tracking` | Customer | Daftar pelacakan logistik pesanan customer yang sedang dikirim. |
| **Upload Payment** | `/payment-upload/:orderId` | Customer | Halaman upload berkas struk bukti transfer manual. |
| **Admin Dashboard** | `/admin` | Admin | Ringkasan data master statistik toko & log pendaftar customer. |
| **Category Management** | `/admin/categories` | Admin | Tambah, ubah, hapus, dan cari kategori produk. |
| **Merchandise Management** | `/admin/merchandise` | Admin | CRUD katalog produk pre-order. |
| **Customer Management** | `/admin/customers` | Admin | Direktori pelanggan terdaftar, jumlah transaksi, & total belanja. |
| **Order Management** | `/admin/orders` | Admin | Mengubah status logistik pesanan pelanggan. |
| **Payment Verification** | `/admin/payment-verification`| Admin | Konfirmasi/tolak bukti transfer manual pembayaran. |
| **Sales Report** | `/admin/sales-report` | Admin | Analisis bulanan, top produk terlaris, dan histori transaksi. |
| **Admin Profile** | `/admin/profile` | Admin | Mengubah data profil admin & ganti password. |

---

## 5. Daftar Endpoint Backend (REST API)

Seluruh rute backend terdaftar di bawah prefiks jalur `/api`:

### Authentication (`/api/auth`)
| Method | Endpoint | Role | Fungsi |
| :--- | :--- | :--- | :--- |
| **POST** | `/auth/register` | Guest | Registrasi customer baru. |
| **POST** | `/auth/login` | Guest | Login mendapatkan token JWT. |
| **PUT** | `/auth/profile` | Customer, Admin | Mengubah nama profil & password baru. |

### Category (`/api/categories`)
| Method | Endpoint | Role | Fungsi |
| :--- | :--- | :--- | :--- |
| **GET** | `/categories` | Guest, Customer, Admin | Mendapatkan daftar kategori produk. |
| **POST** | `/categories` | Admin | Membuat kategori baru. |
| **PUT** | `/categories/:id` | Admin | Mengubah nama kategori tertentu. |
| **DELETE**| `/categories/:id` | Admin | Menghapus kategori tertentu. |

### Product (`/api/products`)
| Method | Endpoint | Role | Fungsi |
| :--- | :--- | :--- | :--- |
| **GET** | `/products` | Guest, Customer, Admin | Menampilkan barang katalog (mendukung query search & filter). |
| **GET** | `/products/:id` | Guest, Customer, Admin | Mendapatkan detail spesifikasi produk. |
| **POST** | `/products` | Admin | Membuat produk merchandise baru. |
| **PUT** | `/products/:id` | Admin | Mengubah data produk tertentu. |
| **DELETE**| `/products/:id` | Admin | Menghapus produk tertentu dari database. |

### Cart (`/api/cart`)
| Method | Endpoint | Role | Fungsi |
| :--- | :--- | :--- | :--- |
| **GET** | `/cart` | Customer | Melihat isi keranjang belanja pelanggan yang login. |
| **POST** | `/cart/items` | Customer | Menambahkan item barang ke keranjang. |
| **PUT** | `/cart/items/:id` | Customer | Memperbarui kuantitas item keranjang. |
| **DELETE**| `/cart/items/:id` | Customer | Menghapus item tertentu dari keranjang. |
| **DELETE**| `/cart/clear` | Customer | Mengosongkan keranjang belanja. |

### Checkout (`/api/checkout`)
| Method | Endpoint | Role | Fungsi |
| :--- | :--- | :--- | :--- |
| **POST** | `/checkout` | Customer | Memproses pre-order belanja keranjang. |

### Payment (`/api/payments`)
| Method | Endpoint | Role | Fungsi |
| :--- | :--- | :--- | :--- |
| **POST** | `/payments/upload` | Customer | Mengunggah gambar struk pembayaran pre-order (Multer). |
| **GET** | `/payments/my` | Customer | Mendapatkan riwayat bukti bayar pribadi. |
| **GET** | `/payments` | Admin | Menampilkan log seluruh bukti bayar masuk. |
| **PUT** | `/payments/:id/approve` | Admin | Verifikasi/menyetujui transfer struk masuk. |
| **PUT** | `/payments/:id/reject` | Admin | Menolak transfer struk masuk dengan catatan. |

### Order (`/api/orders`)
| Method | Endpoint | Role | Fungsi |
| :--- | :--- | :--- | :--- |
| **GET** | `/orders` | Customer | Riwayat pesanan milik customer yang bersangkutan. |
| **GET** | `/orders/:id` | Customer | Detail order & timeline pengiriman customer bersangkutan. |
| **GET** | `/admin/orders` | Admin | Daftar seluruh pesanan di database. |
| **PUT** | `/admin/orders/:id/status` | Admin | Memperbarui status logistik pesanan. |

### Dashboard (`/api/dashboard`)
| Method | Endpoint | Role | Fungsi |
| :--- | :--- | :--- | :--- |
| **GET** | `/dashboard/customer` | Customer | Rekap statistik belanja pribadi customer. |
| **GET** | `/dashboard/admin` | Admin | Mengambil metrik utama untuk panel ringkasan admin. |

### Customer Management (`/api/admin/customers`)
| Method | Endpoint | Role | Fungsi |
| :--- | :--- | :--- | :--- |
| **GET** | `/admin/customers` | Admin | Menampilkan direktori nama, email, order, & spent pelanggan. |

### Sales Report (`/api/admin/sales-report`)
| Method | Endpoint | Role | Fungsi |
| :--- | :--- | :--- | :--- |
| **GET** | `/admin/sales-report` | Admin | Rekapitulasi bulanan, ranking produk terlaris, & log invoice. |

---

## 6. Struktur Database (Prisma Schema)

Berikut adalah struktur model tabel pada berkas [schema.prisma](file:///c:/Users/Farhan%20M%20Yasin/Documents/Project/Project-Web/moonhaul-web-project/backend/prisma/schema.prisma):

1. **User**
   - Model untuk menyimpan kredensial autentikasi.
   - Relasi: Satu `User` memiliki satu `Cart` (One-to-One) dan banyak `Order` (One-to-Many).
   - Memiliki enum `Role` (`ADMIN`, `CUSTOMER`).

2. **Category**
   - Menyimpan nama kategori produk pre-order.
   - Relasi: Satu `Category` berelasi dengan banyak `Product` (One-to-Many).

3. **Product**
   - Menyimpan detail catalog merchandise.
   - Relasi: Berelasi dengan satu `Category`. Terhubung dengan banyak `CartItem` dan `OrderItem`.

4. **Cart**
   - Menampung keranjang belanja milik user.
   - Relasi: Terhubung dengan satu `User` (One-to-One) dan banyak `CartItem` (One-to-Many).

5. **CartItem**
   - Menyimpan daftar barang dalam keranjang belanja lengkap dengan kuantitas.
   - Relasi: Terhubung dengan satu `Cart` dan satu `Product`.

6. **Order**
   - Menyimpan data transaksi pesanan pre-order.
   - Relasi: Terhubung dengan satu `User` (One-to-Many), satu `Payment` (One-to-One), dan banyak `OrderItem` (One-to-Many).
   - Memiliki enum `OrderStatus`.

7. **OrderItem**
   - Menyimpan data snapshot produk yang dibeli ketika checkout (nama produk, harga saat checkout, kuantitas, subtotal).
   - Relasi: Terhubung dengan satu `Order` dan satu `Product` (SetNull bila produk dihapus).

8. **Payment**
   - Menyimpan unggahan bukti transfer pembayaran pre-order.
   - Relasi: Terhubung dengan satu `Order` (One-to-One).
   - Memiliki enum `PaymentStatus` (`PENDING`, `APPROVED`, `REJECTED`).

---

## 7. Alur Bisnis Utama

### Alur Kerja Customer
1. **Register**: Pelanggan mendaftarkan akun baru secara mandiri.
2. **Login**: Melakukan autentikasi email dan sandi untuk memperoleh token akses JWT.
3. **Belanja**: Menjelajahi katalog merchandise K-Pop, menyaring kategori, mencari nama produk, melihat rincian rilis pre-order, dan menyusun barang belanjaan di keranjang.
4. **Checkout**: Mengunci daftar kuantitas belanja dari keranjang untuk diubah menjadi invoice pesanan berstatus `WAITING_PAYMENT`.
5. **Upload Pembayaran**: Melakukan transfer bank manual secara mandiri kemudian mengunggah file struk bukti bayar (status pesanan otomatis berubah ke `PAYMENT_VERIFICATION`).
6. **Tracking**: Memantau progress approval bukti bayar dari admin dan mengikuti status pengiriman logistik produk hingga barang diterima (`DELIVERED`).

### Alur Kerja Admin
1. **Login**: Administrator masuk ke panel admin dengan hak akses role `ADMIN`.
2. **Dashboard**: Meninjau ringkasan performa penjualan dan histori register customer.
3. **Mengelola Kategori**: Membuat kategori pre-order K-Pop baru, merubah namanya, atau menghapus kategori kosong.
4. **Mengelola Produk**: CRUD item merchandise (menyesuaikan deskripsi, stok barang, tanggal rilis, dan harga pre-order).
5. **Verifikasi Pembayaran**: Menerima transfer struk masuk (status order berubah ke `PROCESSING`) atau menolak struk palsu (status order kembali ke `WAITING_PAYMENT` disertai catatan admin).
6. **Mengelola Pesanan**: Memperbarui status logistik pesanan (`PROCESSING` -> `PACKED` -> `SHIPPED` -> `DELIVERED`).
7. **Sales Report**: Menganalisis total omzet bulanan, daftar barang terlaris, dan rincian transaksi invoice terbaru.

---

## 8. Daftar Validasi

Aplikasi MoonHaul telah mengimplementasikan serangkaian validasi baik di frontend maupun backend:

1. **Email Unik**: Backend melarang pembuatan user baru dengan email yang sudah terdaftar.
2. **Kekuatan Password**: Frontend membatasi panjang password login minimal 6 karakter. Backend membatasi password baru minimal 8 karakter di menu ganti password profile.
3. **Konfirmasi Password**: Mengubah password pada form profil wajib menyertakan verifikasi kecocokan password baru dengan konfirmasi password baru.
4. **Verifikasi Password Lama**: Sebelum pengguna dapat menyetel password baru di profil, password lama wajib dimasukkan dan diverifikasi keakuratannya menggunakan `bcrypt.compare` terhadap database.
5. **Autentikasi & Otorisasi Rute**: API di backend diproteksi secara ketat menggunakan middleware `authenticate` (memeriksa integritas token JWT) dan `authorize("ADMIN")` (memastikan hanya pengguna dengan peran administrator yang dapat memicu aksi tulis).
6. **Mencegah Rollback Status Order**: Di backend, status order tidak dapat diubah mundur (misalnya status `SHIPPED` dikembalikan ke `PROCESSING`). Transisi status logistik hanya dapat bergerak maju secara logis.
7. **Penyaringan Upload File Struk**: Middleware upload Multer membatasi ukuran berkas struk maksimal 5 MB dan hanya menerima ekstensi berkas gambar bertipe `.png`, `.jpg`, atau `.jpeg`.
8. **Validasi Ketersediaan Stok**: Saat checkout, sistem menguji apakah kuantitas beli melebihi batas sisa stok produk aktif. Pembelian akan dibatalkan jika stok tidak memadai.
9. **Penghapusan Kategori Terikat**: Kategori produk tidak dapat dihapus jika ada produk aktif yang masih merujuk ke kategori bersangkutan untuk menghindari ketidaksesuaian integritas data (*foreign key constraints*).
10. **Pencegahan Registrasi ADMIN Baru**: Endpoint register menolak pembuatan akun baru secara mandiri jika muatan payload role dikirimkan sebagai `ADMIN` secara sengaja. Role baru selalu dipaksa bernilai `CUSTOMER`.

---

## 9. Keterbatasan Sistem

- **Sistem Pembayaran Manual**: Sistem transaksi pre-order belum terhubung dengan gerbang pembayaran otomatis (*Payment Gateway*). Proses transaksi transfer bank masih dikonfirmasi secara manual oleh Admin dengan memverifikasi visual struk transfer.
- **Penyimpanan Aset Fisik**: Foto produk merchandise dan bukti transfer pembayaran diunggah ke dalam memori disk lokal server backend (`backend/uploads/`), bukan disimpan di cloud storage terdistribusi.
- **Notifikasi**: Belum tersedia layanan pengiriman notifikasi instan secara otomatis (seperti SMS, email notifikasi logistik, ataupun Firebase Push Notification) saat status logistik pre-order diubah admin.
- **Hosting / Deployment**: Aplikasi dirancang untuk dijalankan di lingkungan lokal pengujian (*localhost*) dan belum di-deploy ke server cloud production.
