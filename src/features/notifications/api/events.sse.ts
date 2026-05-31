import { fetchEventSource } from '@microsoft/fetch-event-source'
import { API_BASE_URL, API_BASE_URL_FALLBACK } from '@/lib/axios'
import {
  ADMIN_EVENT_NAMES,
  type AdminEventName,
  type AdminEventPayload,
} from '../data/schema'

// Stream admin SSE yang tahan tunnel ngrok + punya fallback URL.
//
// Kenapa bukan `EventSource` native: native tidak bisa kirim header apa pun,
// padahal ngrok free butuh header `ngrok-skip-browser-warning` supaya tidak
// membalas halaman warning HTML (yang merusak stream). `fetchEventSource`
// (fetch + ReadableStream) bisa kirim header sekaligus streaming.
//
// Token tetap lewat query string karena middleware SSE backend membacanya dari
// `req.query.token` (lihat sse-auth.middleware.js). Trade-off: lihat SSE.md.
//
// Fallback + reconnect dikelola di dalam sini: coba `API_BASE_URL` dulu
// (prod = ngrok, dev = localhost); saat gagal konek dirotasi ke
// `API_BASE_URL_FALLBACK`. `getToken` dibaca ulang tiap (re)connect supaya
// token selalu fresh dari cookie.

export interface OpenAdminStreamOptions {
  getToken: () => string | null | undefined
  onConnected?: (info: { userId: string; role: string }) => void
  onEvent?: (name: AdminEventName, payload: AdminEventPayload) => void
  onError?: (e: unknown) => void
}

export interface AdminStreamHandle {
  close: () => void
}

const RECONNECT_DELAY_MS = 5000
const ADMIN_EVENT_SET = new Set<string>(ADMIN_EVENT_NAMES)

export function openAdminStream({
  getToken,
  onConnected,
  onEvent,
  onError,
}: OpenAdminStreamOptions): AdminStreamHandle {
  const bases = [
    ...new Set([API_BASE_URL, API_BASE_URL_FALLBACK].filter(Boolean)),
  ]
  const ctrl = new AbortController()
  let closed = false
  let idx = 0

  const connect = () => {
    if (closed) return

    const token = getToken()
    if (!token) {
      // belum ada token (mis. belum login) → coba lagi nanti
      if (!closed) setTimeout(connect, RECONNECT_DELAY_MS)
      return
    }

    const base = bases[idx % bases.length]
    const url = `${base}/events/stream?token=${encodeURIComponent(token)}`

    fetchEventSource(url, {
      signal: ctrl.signal,
      // jaga stream tetap hidup walau tab pindah ke background
      openWhenHidden: true,
      headers: { 'ngrok-skip-browser-warning': 'true' },
      onopen: async (res) => {
        const contentType = res.headers.get('content-type') ?? ''
        if (res.ok && contentType.includes('text/event-stream')) return
        // 401 / halaman warning ngrok / response lain → lempar supaya rotasi
        // ke fallback URL di .catch
        throw new Error(
          `SSE gagal konek (status ${res.status}, type "${contentType}")`
        )
      },
      onmessage: (ev) => {
        if (!ev.event) return

        if (ev.event === 'connected') {
          try {
            onConnected?.(JSON.parse(ev.data))
          } catch {
            // payload non-JSON — abaikan
          }
          return
        }

        if (ADMIN_EVENT_SET.has(ev.event)) {
          try {
            onEvent?.(
              ev.event as AdminEventName,
              JSON.parse(ev.data) as AdminEventPayload
            )
          } catch {
            // payload non-JSON — abaikan
          }
        }
      },
      // matikan retry bawaan lib; reconnect + fallback kita atur sendiri
      onerror: (err) => {
        throw err
      },
    })
      .then(() => {
        // server menutup stream secara normal → reconnect URL yang sama
        if (!closed) setTimeout(connect, RECONNECT_DELAY_MS)
      })
      .catch((err) => {
        // gagal konek → rotasi ke kandidat berikutnya (fallback) lalu reconnect
        if (closed) return
        onError?.(err)
        idx += 1
        setTimeout(connect, RECONNECT_DELAY_MS)
      })
  }

  connect()

  return {
    close: () => {
      closed = true
      ctrl.abort()
    },
  }
}
