// ── Client-only auth token storage ────────────────────────────
// Uses localStorage — simple for dev/demo.
// Production upgrade path: move to httpOnly cookie via Next.js route handler.

import type { ApiUser } from './api'

const TOKEN_KEY = 'dr_token'
const USER_KEY  = 'dr_user'

function isClient() {
  return typeof window !== 'undefined'
}

export const authStore = {
  getToken(): string | null {
    if (!isClient()) return null
    return localStorage.getItem(TOKEN_KEY)
  },

  getUser(): ApiUser | null {
    if (!isClient()) return null
    try {
      return JSON.parse(localStorage.getItem(USER_KEY) ?? 'null')
    } catch {
      return null
    }
  },

  set(token: string, user: ApiUser) {
    localStorage.setItem(TOKEN_KEY, token)
    localStorage.setItem(USER_KEY, JSON.stringify(user))
  },

  clear() {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
  },

  isAuthenticated(): boolean {
    return !!this.getToken()
  },

  updateUser(patch: Partial<ApiUser>) {
    const current = this.getUser()
    const token   = this.getToken()
    if (current !== null && token !== null) {
      this.set(token, { ...current, ...patch })
    }
  },
}
