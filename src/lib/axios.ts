import axios from 'axios'
import { getCookie, setCookie, removeCookie } from './cookies'

const ACCESS_TOKEN_KEY = import.meta.env.VITE_TOKEN_KEY
const REFRESH_TOKEN_KEY = import.meta.env.VITE_REFRESH_TOKEN_KEY

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
// kalau request ke api utama gagal gara-gara jaringan (mis. localhost lagi
// nggak kejangkau), otomatis dicoba ulang lewat tunnel ini. kosongin aja
// kalau nggak pakai tunnel.
export const API_BASE_URL_FALLBACK =
  import.meta.env.VITE_API_BASE_URL_FALLBACK ?? ''

const ApiService = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    // ngrok free suka nyelipin halaman warning html sebelum response. header
    // ini bikin dia nge-skip itu, jadi yang balik tetap json. nilainya bebas.
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

    // gagal total tanpa response, dan belum pernah dicoba lewat tunnel?
    // ulangi sekali pakai base url fallback.
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

    // login yang gagal jangan ikut di-refresh, nanti muter-muter
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
        // pakai axios polos biar nggak kena interceptor ini lagi
        const { data } = await axios.post(
          `${originalRequest.baseURL ?? API_BASE_URL}/users/refresh-token`,
          { refreshToken },
          { headers: { 'ngrok-skip-browser-warning': 'true' } }
        )

        const accessToken = data.data.accessToken
        setCookie(ACCESS_TOKEN_KEY, accessToken)

        originalRequest.headers.Authorization = `Bearer ${accessToken}`
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
