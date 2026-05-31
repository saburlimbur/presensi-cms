import { API_BASE_URL } from './axios'

// Origin server (tanpa /attendance_api) untuk akses file statis backend seperti
// /files/permissions/* dan /images/*. Diturunkan dari VITE_API_BASE_URL supaya
// tidak perlu env tambahan — satu URL untuk semuanya.
const ASSET_ORIGIN = (API_BASE_URL ?? '').replace(/\/attendance_api\/?$/, '')

/**
 * Lengkapi path relatif dari backend (mis. "/files/permissions/x.pdf") jadi URL
 * absolut ke origin server, supaya bisa dibuka lintas-origin (Vercel/HP). Kalau
 * sudah absolut (http...) dikembalikan apa adanya.
 */
export function getAssetUrl(path?: string | null): string {
  if (!path) return ''
  if (/^https?:\/\//.test(path)) return path
  return `${ASSET_ORIGIN}${path.startsWith('/') ? '' : '/'}${path}`
}
