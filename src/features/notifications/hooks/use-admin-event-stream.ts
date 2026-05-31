import { useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { getCookie } from '@/lib/cookies'
import { openAdminStream } from '../api/events.sse'

const ACCESS_TOKEN_KEY = import.meta.env.VITE_TOKEN_KEY

/**
 * Subscribe ke admin SSE channel — mount sekali di authenticated layout.
 *
 * Strategi:
 * - Setiap event: toast (jika tab visible) + invalidate query notifications
 *   supaya badge + list re-fetched dari server (source of truth).
 * - Reconnect, fallback URL (ngrok), dan refresh token per-reconnect dikelola
 *   di dalam `openAdminStream` — `getToken` dibaca ulang tiap reconnect supaya
 *   token selalu fresh dari cookie (tidak stuck di 401 loop saat token expired).
 *
 * Param `enabled` — kalau false (mis. user logout / belum login), tidak
 * buka koneksi.
 */
export default function useAdminEventStream(enabled = true) {
  const queryClient = useQueryClient()

  useEffect(() => {
    if (!enabled) return

    const stream = openAdminStream({
      getToken: () => getCookie(ACCESS_TOKEN_KEY),
      onConnected: () => {
        // Re-sync state setelah (re)connect — kejar event yg ke-miss
        queryClient.invalidateQueries({ queryKey: ['notifications'] })
      },
      onEvent: (name, payload) => {
        queryClient.invalidateQueries({ queryKey: ['notifications'] })
        // Event check-in/out: refresh data attendance + rekap dashboard
        // langsung dari SSE (≈instan), tanpa nunggu polling.
        if (
          name === 'attendance:checked_in' ||
          name === 'attendance:checked_out'
        ) {
          queryClient.invalidateQueries({ queryKey: ['allUserAttendance'] })
          queryClient.invalidateQueries({ queryKey: ['monthly-reports'] })
        }
        // Izin baru masuk / dibatalkan karyawan: refresh daftar request supaya
        // admin yang lagi buka halaman Permissions langsung lihat tanpa refresh
        // manual (request yang di-cancel hilang dari antrian).
        if (
          name === 'permission:submitted' ||
          name === 'permission:cancelled'
        ) {
          queryClient.invalidateQueries({ queryKey: ['permissions'] })
        }
        if (document.visibilityState === 'visible') {
          toast(payload.title, { description: payload.body })
        }
      },
    })

    return () => stream.close()
  }, [enabled, queryClient])
}
