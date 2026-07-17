import { create } from 'zustand'
import { getCookie, setCookie, removeCookie } from '@/lib/cookies'

const ACCESS_TOKEN = import.meta.env.VITE_TOKEN_KEY
const REFRESH_TOKEN = import.meta.env.VITE_REFRESH_TOKEN_KEY

interface AuthUser {
  accountNo: string
  email: string
  role: string[]
  exp: number
}

interface AuthState {
  auth: {
    user: AuthUser | null
    setUser: (user: AuthUser | null) => void
    accessToken: string
    setAccessToken: (accessToken: string) => void
    setRefreshToken: (refreshToken: string) => void
    resetAccessToken: () => void
    reset: () => void
  }
}

export const useAuthStore = create<AuthState>()((set) => {
  const cookieState = getCookie(ACCESS_TOKEN)

  const initToken =
    cookieState && cookieState !== 'undefined' ? cookieState : ''
  return {
    auth: {
      user: null,
      setUser: (user) =>
        set((state) => ({
          ...state,
          auth: {
            ...state.auth,
            user,
          },
        })),
      accessToken: initToken,
      setAccessToken: (accessToken) =>
        set((state) => {
          setCookie(ACCESS_TOKEN, accessToken)
          return {
            ...state,
            auth: {
              ...state.auth,
              accessToken,
            },
          }
        }),
      setRefreshToken: (refreshToken) => setCookie(REFRESH_TOKEN, refreshToken),
      resetAccessToken: () =>
        set((state) => {
          removeCookie(ACCESS_TOKEN)
          return {
            ...state,
            auth: {
              ...state.auth,
              accessToken: '',
            },
          }
        }),
      reset: () =>
        set((state) => {
          removeCookie(ACCESS_TOKEN)
          removeCookie(REFRESH_TOKEN)
          return {
            ...state,
            auth: {
              ...state.auth,
              user: null,
              accessToken: '',
            },
          }
        }),
    },
  }
})
