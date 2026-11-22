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
