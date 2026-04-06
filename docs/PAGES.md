# Halaman Admin Panel - Attendance CMS

Dokumentasi isi dan fitur setiap halaman pada admin panel.

---

## 1. Dashboard (`/`)

Halaman ringkasan utama untuk admin.

**Konten:**

- **Statistik Hari Ini**
  - Total karyawan hadir / terlambat / tidak hadir
  - Total request pending (permission + overtime)
- **Grafik Kehadiran**
  - Chart kehadiran mingguan/bulanan (line/bar chart)
  - Persentase kehadiran per departemen
- **Aktivitas Terbaru**
  - 5-10 log terbaru (check-in, request masuk, approval)
- **Quick Info**
  - Jumlah total karyawan aktif
  - Jumlah departemen

---

## 2. Employees (`/employees`)

Manajemen data karyawan (model `User`).

**Konten:**

- **Tabel Karyawan**
  - Kolom: Employee ID, Nama, Email, Phone, Departemen, Posisi, Role, Status (aktif/nonaktif), Face Registered, Tanggal Bergabung
  - Search, filter (departemen, posisi, role, status), sorting
  - Bulk actions: activate/deactivate
- **Aksi per Row**
  - View detail
  - Edit data karyawan
  - Reset password
  - Toggle status aktif/nonaktif
- **Detail Karyawan** (drawer/modal atau sub-page)
  - Info profil lengkap
  - Departemen & posisi
  - Shift assignment saat ini
  - Leave balance (sisa cuti tahun ini)
  - Riwayat kehadiran ringkas
  - Status face registration
- **Tambah Karyawan** (form/modal)
  - Input: nama, email, password, phone, employee ID, departemen, posisi, role, tanggal bergabung

---

## 3. Departments (`/departments`)

Manajemen departemen (model `Department`).

**Konten:**

- **Tabel Departemen**
  - Kolom: Kode, Nama Departemen, Kepala Departemen, Jumlah Karyawan
  - Search by nama/kode
- **Aksi per Row**
  - Edit departemen
  - Hapus departemen (validasi: tidak boleh ada karyawan terkait)
  - Assign/ganti kepala departemen
- **Tambah Departemen** (form/modal)
  - Input: nama, kode, kepala departemen (dropdown dari karyawan)
- **Detail Departemen** (drawer/modal)
  - Daftar karyawan dalam departemen
  - Info kepala departemen

---

## 4. Attendance Records (`/attendance`)

Riwayat dan monitoring kehadiran (model `Attendance`).

**Konten:**

- **Tabel Kehadiran**
  - Kolom: Tanggal, Nama Karyawan, Shift, Check-in, Check-out, Status, Metode, Lokasi Valid
  - Filter: tanggal (range), status, metode, departemen, karyawan
  - Sorting by tanggal, status
- **Detail Kehadiran** (drawer/modal)
  - Foto check-in & check-out (watermarked)
  - Koordinat GPS in/out
  - Info device & IP address
  - Lokasi absensi
  - Catatan/note
- **Aksi**
  - Edit status kehadiran (koreksi manual oleh admin)
  - Export data (CSV/Excel) dengan filter
- **Tambah Manual** (form)
  - Input kehadiran manual untuk karyawan yang lupa absen

---

## 5. Locations (`/attendance-locations`)

Manajemen lokasi absensi (model `AttendanceLocation`).

**Konten:**

- **Tabel Lokasi**
  - Kolom: Nama Lokasi, Alamat, Latitude, Longitude, Radius (meter), Tanggal Dibuat, Status (aktif/dihapus)
  - Search by nama/alamat
- **Preview Peta**
  - Map preview dengan radius circle untuk setiap lokasi
- **Aksi per Row**
  - Edit lokasi (nama, alamat, koordinat, radius)
  - Soft delete (set `deletedAt`)
- **Tambah Lokasi** (form/modal)
  - Input: nama, alamat, latitude, longitude, radius
  - Map picker untuk pilih koordinat

---

## 6. Shifts (`/shifts`)

Manajemen jadwal shift dan assignment (model `Shift` + `ShiftAssignment`).

**Konten:**

- **Tabel Shift**
  - Kolom: Nama Shift, Jam Mulai, Jam Selesai, Grace Period (menit), Deskripsi
- **Aksi per Row**
  - Edit shift
  - Hapus shift (validasi: tidak ada assignment aktif)
- **Tambah Shift** (form/modal)
  - Input: nama (enum), jam mulai, jam selesai, grace period, deskripsi
- **Tab: Shift Assignment**
  - Tabel assignment: Karyawan, Shift, Tanggal, Status
  - Filter: karyawan, shift, tanggal (range), status
  - Assign shift ke karyawan (single atau bulk)
  - Calendar view untuk lihat jadwal shift per minggu/bulan

---

## 7. Permissions (`/permissions`)

Manajemen izin dan cuti karyawan (model `Permission` + `LeaveBalance`).

**Konten:**

- **Tabel Request Izin**
  - Kolom: Nama Karyawan, Tipe Izin, Tanggal Mulai, Tanggal Selesai, Durasi (hari), Status, Tanggal Request
  - Filter: status (pending/approved/rejected/cancelled), tipe izin, karyawan, tanggal
  - Sorting by tanggal, status
  - Badge warna untuk status (kuning=pending, hijau=approved, merah=rejected)
- **Aksi per Row**
  - Approve / Reject dengan catatan
  - Lihat detail & lampiran
- **Detail Request** (drawer/modal)
  - Info karyawan
  - Tipe & alasan izin
  - Lampiran (jika ada)
  - Sisa cuti karyawan (dari `LeaveBalance`)
  - Histori approval
- **Tab: Leave Balances**
  - Tabel saldo cuti per karyawan per tahun
  - Kolom: Karyawan, Tahun, Kuota, Terpakai, Sisa, Carry Over
  - Edit manual saldo cuti (adjust kuota/carry over)

---

## 8. Overtime (`/overtime`)

Manajemen request lembur (model `OvertimeRequest`).

**Konten:**

- **Tabel Request Lembur**
  - Kolom: Nama Karyawan, Tanggal, Jam Mulai, Jam Selesai, Durasi (menit), Alasan, Status, Tanggal Request
  - Filter: status, karyawan, tanggal (range)
  - Badge warna untuk status
- **Aksi per Row**
  - Approve / Reject dengan catatan
  - Lihat detail
- **Detail Request** (drawer/modal)
  - Info karyawan & departemen
  - Detail waktu lembur
  - Alasan
  - Histori approval

---

## 9. Audit Logs (`/audit-logs`)

Log aktivitas sistem (model `AuditLog`).

**Konten:**

- **Tabel Log**
  - Kolom: Waktu, User, Action, Detail
  - Filter: user, action, tanggal (range)
  - Sorting by waktu (default: terbaru)
  - Search by action/detail
- **Sifat:** Read-only, tidak ada aksi create/edit/delete

---

## 10. Settings (`/settings`)

Pengaturan akun admin.

**Konten (tabs dalam 1 halaman):**

- **Tab Profile**
  - Edit nama, email, phone
  - Upload avatar
- **Tab Account**
  - Ganti password
- **Tab Appearance**
  - Pilih tema (light/dark/system)
  - Pilih font size
- **Tab Notifications**
  - Toggle notifikasi email untuk: request baru, approval, karyawan baru
- **Tab Display**
  - Pengaturan bahasa (ID/EN)
  - Format tanggal & waktu
  - Jumlah row per tabel (default pagination)
