// ── DevRaid API client ─────────────────────────────────────────
// Iskandar's backend: Laravel 11 + Sanctum (token-based)
// Base: http://localhost:8000 (local) | NEXT_PUBLIC_API_URL (prod)

import { SoftSkillHexagon } from '@/types'

const BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000'

// ── Types ──────────────────────────────────────────────────────
export interface ApiUser {
  id: number
  username: string
  email: string
  bio?: string
  gender?: string
  photo?: string
  role:   string
  status: string
  created_at: string
  // Extended client-side fields (stored in localStorage; backend endpoints pending)
  github_url?:   string
  linkedin_url?: string
  hard_skills?:  string[]

  // Phase 5: Onboarding fields
  onboarding_completed?: boolean     // Whether user finished 20-question flow
  soft_skills?: SoftSkillHexagon    // Result of onboarding (5 axis values, 0-100)
}

export interface AuthResult {
  user:  ApiUser
  token: string
}

type Ok<T>  = { data: T;      error?: never; errors?: never }
type Err    = { data?: never; error: string; errors?: Record<string, string[]> }
export type ApiResponse<T> = Ok<T> | Err

// ── Core fetch wrapper ─────────────────────────────────────────
async function req<T>(
  method: string,
  path:   string,
  body?:  unknown,
  token?: string | null,
): Promise<ApiResponse<T>> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Accept':       'application/json',
  }
  if (token) headers['Authorization'] = `Bearer ${token}`

  try {
    const res  = await fetch(`${BASE}${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    })
    const json = await res.json()
    if (!res.ok) {
      return {
        error:  json.message ?? 'Request failed',
        errors: json.errors,
      }
    }
    return { data: json }
  } catch {
    return { error: 'Network error — is the backend running on port 8000?' }
  }
}

// ── Auth endpoints ─────────────────────────────────────────────
export const api = {
  auth: {
    login(creds: { username: string; password: string }) {
      return req<AuthResult>('POST', '/api/auth/login', creds)
    },

    register(data: {
      username: string
      email:    string
      password: string
      bio:      string
      gender:   string
      /** JSON string of 5-axis hexagon — backend requires string; default neutral 50s if omitted */
      soft_skills?: string
      /** JSON string of string[] — backend requires string; default [] if omitted */
      hard_skills?: string
      personality_type?: string
    }) {
      const payload = {
        ...data,
        soft_skills:
          data.soft_skills ??
          JSON.stringify({
            initiative: 50,
            expertise: 50,
            speed: 50,
            communication: 50,
            flexibility: 50,
          }),
        hard_skills: data.hard_skills ?? JSON.stringify([]),
        personality_type: data.personality_type ?? 'not_set',
      }
      return req<AuthResult>('POST', '/api/auth/register', payload)
    },

    logout(token: string) {
      return req<{ message: string }>('POST', '/api/auth/logout', undefined, token)
    },

    getUser(token: string) {
      return req<ApiUser>('GET', '/api/auth/user', undefined, token)
    },

    // TODO: replace mock with real call when backend adds PATCH /api/auth/user
    patchUser(
      _token: string,
      _patch: Partial<Pick<ApiUser, 'bio' | 'github_url' | 'linkedin_url' | 'hard_skills'>>,
    ): Promise<ApiResponse<Pick<ApiUser, 'bio' | 'github_url' | 'linkedin_url' | 'hard_skills'>>> {
      return Promise.resolve({ data: _patch })
    },
  },

  onboarding: {
    // Phase 5: Post onboarding completion with hexagon results
    // Note: Backend integration pending (Phase 6+). Currently client-side only.
    postResults(
      token: string,
      hexagon: SoftSkillHexagon,
    ): Promise<ApiResponse<{ message: string }>> {
      return req<{ message: string }>('POST', '/api/onboarding/complete', hexagon, token)
    },
  },
}
