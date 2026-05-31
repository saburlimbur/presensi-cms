import axios from 'axios'
import { getCookie, removeCookie } from './cookies'

const ACCESS_TOKEN_KEY = import.meta.env.VITE_TOKEN_KEY
const REFRESH_TOKEN_KEY = import.meta.env.VITE_REFRESH_TOKEN_KEY

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
// Fallback tunnel (ngrok) — dipakai otomatis kalau request ke API utama gagal
// karena jaringan (mis. server localhost tak terjangkau). Kosongkan kalau tidak
// pakai tunnel.
export const API_BASE_URL_FALLBACK =
  import.meta.env.VITE_API_BASE_URL_FALLBACK ?? ''

const ApiService = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    // ngrok free menyisipkan halaman warning HTML sebelum response; header ini
    // (nilai bebas) membuat ngrok melewatinya → response tetap JSON.
    'ngrok-skip-browser-warning': 'true',
  },
})

ApiService.interceptors.request.use((config) => {
  const token = getCookie(ACCESS_TOKEN_KEY)
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

ApiService.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    // FALLBACK TUNNEL: network error (tidak ada response) & punya URL fallback &
    // belum pernah di-fallback → retry sekali lewat base URL tunnel (ngrok).
    if (
      !error.response &&
      API_BASE_URL_FALLBACK &&
      originalRequest &&
      !originalRequest._fallback &&
      originalRequest.baseURL !== API_BASE_URL_FALLBACK
    ) {
      originalRequest._fallback = true
      originalRequest.baseURL = API_BASE_URL_FALLBACK
      return ApiService(originalRequest)
    }

    // Cegah loop refresh jika request aslinya adalah login
    if (originalRequest.url?.includes('/users/login')) {
      return Promise.reject(error)
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      const refreshToken = getCookie(REFRESH_TOKEN_KEY)

      if (!refreshToken) {
        handleLogout()
        return Promise.reject(error)
      }

      try {
        // Gunakan axios standar untuk refresh agar tidak terkena interceptor ini lagi
        const { data } = await axios.post(
          // `${import.meta.env.VITE_API_BASE_URL}/users/refresh-token`,
          `${import.meta.env.VITE_API_BASE_URL}/users/login`,
          {
            refreshToken,
          }
        )

        // Simpan token baru ke cookie (pakai utilitas Anda)
        // Pastikan nama key sesuai: ACCESS_TOKEN_KEY
        document.cookie = `${ACCESS_TOKEN_KEY}=${data.accessToken}; path=/; max-age=${60 * 60 * 24 * 7}`

        // Ulangi request awal
        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`
        return axios(originalRequest)
      } catch (refreshError) {
        handleLogout()
        return Promise.reject(refreshError)
      }
    }
    return Promise.reject(error)
  }
)

function handleLogout() {
  removeCookie(ACCESS_TOKEN_KEY)
  removeCookie(REFRESH_TOKEN_KEY)
  window.location.href = '/sign-in'
}

export default ApiService
