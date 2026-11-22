import api from '@/lib/axios'
import { type User } from '../data/schema'

export const usersService = {
  getProfile: async () => {
    const res = await api.get<{ data: User }>('/users/profile')
    return res.data.data
  },

  // Update profil sendiri (admin yang login). Backend hanya menerima
  // fullName & phone (updateProfileSchema).
  updateProfile: async (payload: { fullName: string; phone: string }) => {
    const res = await api.patch('/users/profile', payload)
    return res.data
  },

  // Upload foto profil sendiri (PATCH /users/profile/photo). Backend membaca
  // field multipart `profile_photo`, hanya jpeg/jpg/png, maksimal 5 MB, dan
  // mengembalikan user dengan profilePhoto_url (signed URL) yang baru.
  updateProfilePhoto: async (file: File) => {
    const body = new FormData()
    body.append('profile_photo', file)
    // instance axios default-nya application/json; untuk FormData harus
    // di-override supaya dikirim sebagai multipart (boundary diisi axios).
    const res = await api.patch<{ data: User }>('/users/profile/photo', body, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return res.data.data
  },

  // Ganti password sendiri (PATCH /users/password, updatePasswordSchema).
  // Backend mencabut semua refresh token user setelah berhasil.
  updatePassword: async (payload: {
    oldPassword: string
    newPassword: string
  }) => {
    const res = await api.patch<{ success: boolean; message: string }>(
      '/users/password',
      payload
    )
    return res.data
  },

  // Admin men-generate link reset password untuk karyawan. Backend TIDAK
  // menerima password baru di sini — ia mengembalikan token reset yang harus
  // diserahkan ke karyawan agar mereka mengatur password sendiri.
  resetPassword: async (id: string) => {
    const res = await api.patch<{
      success: boolean
      message: string
      data: {
        employeeId: string
        email: string
        token: string
        expiresAt: string
      }
    }>(`/users/${id}/reset-password`)
    return res.data.data
  },
}
