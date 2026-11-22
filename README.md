# Presensi — CMS Admin

Dashboard admin untuk sistem absensi berbasis face recognition dan geofencing. Dipakai HR/admin untuk mengelola karyawan, memantau kehadiran, dan memproses pengajuan izin.

Backend-nya ada di monorepo [`presensi-app`](https://github.com/saburlimbur/presensi-app) (`apps/api`) — dashboard ini tidak jalan tanpa itu. Aplikasi sisi karyawan ada di repo yang sama (`apps/web`).

## Fitur

| Fitur              | Isi                                                                           |
| :----------------- | :---------------------------------------------------------------------------- |
| **Karyawan**       | CRUD karyawan, aktif/nonaktif akun, reset password.                           |
| **Departemen**     | Master departemen beserta kepala departemen.                                  |
| **Absensi**        | Pantau kehadiran harian, detail check-in/out lengkap dengan foto & titik GPS. |
| **Pengajuan izin** | Approve/reject izin, lihat lampiran, catatan keputusan.                       |
| **Saldo cuti**     | Kuota tahunan, terpakai, dan sisa per karyawan.                               |
| **Laporan**        | Rekap absensi, ekspor Excel.                                                  |
| **Audit log**      | Jejak aksi admin.                                                             |
| **Notifikasi**     | Realtime lewat SSE.                                                           |

## Stack

| Kategori     | Teknologi                                                |
| :----------- | :------------------------------------------------------- |
| Framework    | React 19 + TypeScript, Vite                              |
| Routing      | TanStack Router (file-based)                             |
| Server state | TanStack Query                                           |
| Tabel        | TanStack Table                                           |
| Client state | Zustand                                                  |
| HTTP         | Axios (interceptor auto-refresh token + fallback tunnel) |
| UI           | shadcn/ui + Tailwind CSS                                 |
| Chart        | Recharts                                                 |
| Validasi     | Zod                                                      |

## Menjalankan

```bash
npm install
cp .env.example .env.local   # isi VITE_API_BASE_URL
npm run dev
```

| Script                 | Fungsi                                     |
| :--------------------- | :----------------------------------------- |
| `npm run dev`          | Dev server + HMR                           |
| `npm run build`        | Build production ke `dist/`                |
| `npm run lint`         | ESLint                                     |
| `npm run format:check` | Cek format Prettier                        |
| `npm run format`       | Rapikan format                             |
| `npm run knip`         | Cari file & dependency yang tidak terpakai |

## Environment

| Variable                     | Fungsi                                                                                                         |
| :--------------------------- | :------------------------------------------------------------------------------------------------------------- |
| `VITE_API_BASE_URL`          | Base URL API backend, mis. `http://localhost:3000/attendance_api`                                              |
| `VITE_API_BASE_URL_FALLBACK` | Dipakai otomatis kalau base URL utama tidak terjangkau (mis. lewat tunnel ngrok). Kosongkan kalau tidak perlu. |
| `VITE_TOKEN_KEY`             | Nama key access token di storage.                                                                              |
| `VITE_REFRESH_TOKEN_KEY`     | Nama key refresh token di storage.                                                                             |

## Catatan

Lampiran izin disimpan di Supabase Storage sebagai key privat. Server mengirim _signed URL_ ber-TTL di field `attachmentUrl_url` — **pakai itu untuk `href`**, bukan `attachmentUrl` yang isinya cuma key.

Deploy lewat Vercel (`vercel.json`); push ke branch = deploy otomatis. Server harus di-deploy lebih dulu kalau ada perubahan field API.

## Sisa template

Dashboard ini dibangun di atas [shadcn-admin](https://github.com/satnaing/shadcn-admin) karya [@satnaing](https://github.com/satnaing) (MIT). Bagian template yang tidak dipakai (feature demo, Clerk) sudah dibuang; auth dashboard ini pakai JWT sendiri.

## Lisensi

MIT — mengikuti lisensi template asalnya.
