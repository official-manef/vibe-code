# Vibe Coding Course

Aplikasi web berbasis Next.js untuk pengalaman belajar Vibe Coding. Halaman beranda menautkan ke katalog kursus; repo juga memuat rute kursus, pelajaran, dashboard, dan halaman pengajar, serta kode backend Convex.

## Menjalankan secara lokal

Prasyarat: Node.js dan npm. Versi minimum Node.js tidak ditetapkan di `package.json`.

```bash
npm ci
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000).

Perintah lain yang tersedia:

```bash
npm run lint
npm run build
npm run start
```

`npm run start` menjalankan server Next.js; jalankan `npm run build` terlebih dahulu untuk menyiapkan build.

## Cakupan yang terlihat di repositori

- Beranda dengan tautan menuju `/courses`.
- Rute katalog `/courses`, halaman kursus `/courses/[courseId]`, dan halaman pelajaran `/courses/[courseId]/lessons/[lessonId]`.
- Rute `/dashboard` dan `/teacher`.
- Skema Convex untuk pengguna, kursus, pelajaran, pendaftaran, dan progres belajar, beserta modul query, mutation, dan seed yang tercantum di `convex/`.

Keberadaan halaman dan modul tersebut tidak dengan sendirinya membuktikan bahwa seluruh alur pengguna sudah berfungsi atau siap digunakan.

## Struktur utama

- `src/app/` — rute dan tata letak Next.js.
- `src/components/` — komponen aplikasi bersama.
- `convex/` — skema dan fungsi backend Convex.
- `frontend/slices/` — kontrak dan manifest slice untuk courses dan dashboard.
- `public/` — aset statis.

## Catatan konfigurasi dan verifikasi

Proyek memiliki dependensi Convex, tetapi repositori yang terlihat tidak mendokumentasikan langkah konfigurasi deployment Convex atau nama variabel lingkungan yang diperlukan. Periksa konfigurasi backend sebelum mengandalkan fitur yang memerlukan koneksi Convex.

`package.json` menyediakan skrip dev, build, start, dan lint; tidak menyediakan skrip test. Perintah lint dan build di atas adalah cara menjalankan pemeriksaan yang tersedia, bukan klaim bahwa pemeriksaan tersebut telah berhasil. Deployment dan kesiapan produksi tidak ditetapkan oleh dokumentasi repo ini.
