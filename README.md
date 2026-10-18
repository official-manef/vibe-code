# Vibe Coding Course

Aplikasi Next.js dan Convex untuk katalog kursus, kurikulum, pelajaran, dashboard murid, dan dashboard guru.

## Menjalankan secara lokal

Gunakan Node.js yang mendukung Next.js 16 (minimal 20.9) dan npm.

```sh
npm ci
npm run dev
```

Buka http://localhost:3000. Tanpa `NEXT_PUBLIC_CONVEX_URL`, halaman menampilkan petunjuk konfigurasi dan tidak menghubungi endpoint dummy. Atur variabel tersebut ke URL deployment Convex yang dituju sebelum menjalankan fitur katalog/backend. Build tidak menjalankan deploy atau seed.

```sh
npm test
npm run typecheck
npm run lint
npm run build
```

## Batas autentikasi dan penyiapan operator

Kode backend memerlukan identitas terverifikasi dari `ctx.auth.getUserIdentity()`. Aplikasi ini **belum menyediakan formulir masuk, SDK penyedia identitas, atau alur pembuatan akun**. `ConvexProvider` saat ini dapat membaca katalog publik, tetapi tidak memasok token masuk. Mengatur URL backend saja tidak membuat sesi autentikasi.

Sebelum mengaktifkan fitur akun pada deployment yang telah disetujui, operator perlu:

1. Memilih penyedia identitas OIDC, lalu mengatur `AUTH_ISSUER_URL` dan `AUTH_APPLICATION_ID` pada environment deployment Convex. `convex/auth.config.ts` memakai keduanya sebagai issuer dan audience yang diizinkan. Tanpa pasangan lengkap, daftar provider kosong dan akses akun tetap tertutup.
2. Mengintegrasikan SDK penyedia di frontend dan adaptor `ConvexProviderWithAuth` yang memasok JWT dengan issuer/audience tersebut. Jangan mempercayai email, role, atau ID pengguna yang dikirim sebagai argumen dari browser. Jangan menyimpan token atau kunci privat dalam source maupun variabel `NEXT_PUBLIC_*`.
3. Memverifikasi akun pada penyedia, lalu memetakan nilai `identity.tokenIdentifier` yang telah diverifikasi ke **satu** baris `users` melalui proses administrator tepercaya. Pertahankan `_id` pengguna lama agar ownership, enrollment, dan progres tetap terhubung. Pilih role `STUDENT` atau `TEACHER` melalui kebijakan operator, bukan melalui klaim role/browser atau kecocokan email. Tidak ada endpoint publik untuk mendaftar, mengikat identitas, atau menaikkan role.
4. Menguji issuer, login/refresh/logout, akun yang belum diprovisi, serta isolasi dua akun pada environment uji sebelum mengandalkan deployment.

Field `users.tokenIdentifier` bersifat opsional agar baris lama tetap lolos schema. Baris tanpa binding tidak mendapat akses akun. Binding ganda untuk identitas yang sama ditolak, bukan dipilih secara arbitrer. Resolver tidak memakai pengguna pertama atau email sebagai fallback. Seed internal hanya membuat data contoh tanpa binding; menjalankannya tidak memberikan akses autentikasi kepada siapa pun. Perubahan ini tidak menjalankan setup issuer, provisioning, seed, deploy, atau perubahan environment layanan.

## Aturan akses

- Katalog dan detail kursus tetap publik. Kurikulum publik hanya memuat judul, urutan, dan ID pelajaran; isi pelajaran tidak disertakan.
- Isi pelajaran hanya tersedia bagi akun yang terdaftar pada kursus tersebut atau guru pemiliknya. Pelajaran yang tidak tersedia/tidak diizinkan mengembalikan `null`.
- `getLesson` hanya menerima `lessonId`. Progres selalu berasal dari identitas sesi; argumen `userId` dari klien ditolak.
- Setiap akun terprovisi dapat mendaftarkan dirinya ke kursus yang ada. Pendaftaran mandiri ini belum merupakan alur pembayaran atau persetujuan wali/admin.
- Penyelesaian pelajaran memerlukan enrollment pada kursus pelajaran yang sebenarnya. Guru pemilik dapat membaca konten tanpa enrollment, tetapi harus mendaftar jika ingin mencatat progres belajar sendiri.
- Pembuatan kursus memerlukan role guru. Penambahan pelajaran juga memerlukan ownership kursus. Dashboard hanya membaca kursus/progres milik akun sesi.

Pembacaan dibatasi: katalog 50 kursus; detail kursus maksimal 1.000 pelajaran; dashboard maksimal 100 kursus dan total 1.000 pelajaran. Dashboard/detail mengembalikan error jika batas terlampaui, sehingga hitungan tidak dipotong diam-diam. Pagination untuk skala lebih besar belum tersedia.

## Verifikasi lokal

Tes `convex-test` menjalankan fungsi backend dengan database sintetis dan identitas mock tanpa menghubungi deployment. Cakupannya: anonymous, identitas belum diprovisi, issuer/binding berbeda, binding ganda, dua murid, dua guru, ownership pelajaran, enrollment, isolasi progres, penolakan `userId` palsu, dan referensi yang dihapus. Tes render React memeriksa pesan signed-out dan setup backend.

Typecheck, lint, build frontend, dan tes lokal tidak membuktikan bahwa issuer atau deployment Convex aktif sudah dikonfigurasi dengan benar. Verifikasi deploy/schema dan login penyedia nyata masih diperlukan dalam pekerjaan operasional yang disetujui terpisah.

Dependensi Next dan konfigurasi lint dipin ke `16.3.8`; Vitest dipin ke `4.1.12`. Audit dependency produksi pada 18 Oktober 2026 tidak melaporkan advisory setelah pembaruan kompatibel pada lockfile. Audit lengkap masih melaporkan lima temuan high pada rantai tooling development `eslint-config-next → @next/eslint-plugin-next → fast-glob → micromatch → braces`. [Advisory braces](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm) belum memiliki versi perbaikan; saran npm berupa downgrade lint config lintas major tidak diterapkan. Temuan ini bukan bukti eksploitasi aplikasi. Jalankan ulang `npm audit --omit=dev` dan `npm audit` karena data advisory dapat berubah.

## Struktur

- `src/app/` — rute Next.js.
- `src/components/` — provider dan komponen bersama.
- `convex/` — schema, konfigurasi issuer, query, mutation, dan seed internal.
- `frontend/slices/` — komponen dan kontrak fitur.
- `tests/` — regresi otorisasi dan akses UI.
