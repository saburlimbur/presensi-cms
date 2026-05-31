// File ada di public/notification/ → Vite serve dari root.
const SOUND_URL = '/notification/closure-542.mp3'
const VOLUME = 0.5

// satu instance Audio dipakai ulang (jangan bikin baru tiap event).
let audio: HTMLAudioElement | null = null

function getAudio(): HTMLAudioElement {
  if (!audio) {
    audio = new Audio(SOUND_URL)
    audio.volume = VOLUME
  }
  return audio
}

/**
 * Putar suara notifikasi. Aman dipanggil kapan saja: kalau browser memblok
 * autoplay (user belum pernah berinteraksi dengan halaman sejak load), promise
 * play() ditolak dan errornya ditelan diam-diam supaya tidak mengganggu flow.
 */
export function playNotificationSound() {
  try {
    const a = getAudio()
    a.currentTime = 0 // rewind supaya event beruntun tetap bunyi
    void a.play().catch(() => {
      // autoplay diblok sampai ada gesture user — abaikan
    })
  } catch {
    // abaikan
  }
}
