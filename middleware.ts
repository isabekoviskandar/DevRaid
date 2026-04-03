import { NextRequest, NextResponse } from 'next/server'

// Routes that require authentication
const PROTECTED_ROUTES = ['/hero', '/raids', '/captain']

// Routes that require completed onboarding
const ONBOARDING_REQUIRED = ['/hero/me', '/hero', '/raids', '/captain']

// Routes that are always public
const PUBLIC_ROUTES = ['/login', '/register', '/onboarding']

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // Skip API routes, static files, etc
  if (pathname.startsWith('/api') || pathname.startsWith('/_next')) {
    return NextResponse.next()
  }

  // Check if route requires authentication
  const isProtected = PROTECTED_ROUTES.some((route) =>
    pathname.startsWith(route)
  )
  const isPublic = PUBLIC_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(route)
  )

  // Get token from cookies (adjust if using different storage)
  const token = request.cookies.get('auth_token')?.value

  // If no token and not public route → redirect to login
  if (!token && !isPublic && isProtected) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // If token exists, check onboarding status
  // Phase 5: Basic check using localStorage flag (client-side hint)
  // Phase 6+: Integrate with backend to persist onboarding_completed flag
  // For now, we rely on the client-side localStorage flag set by page.tsx
  // A full production implementation would:
  // 1. Decode JWT or make API call to verify onboarding_completed
  // 2. Store the flag in user's backend record
  // 3. Check it here before allowing access to protected routes

  if (token && ONBOARDING_REQUIRED.some((route) => pathname.startsWith(route))) {
    // TODO: Fetch user from backend to check onboarding_completed flag
    // For Phase 5, we'll allow access and rely on client-side checks
    // const user = await getUser(token); // Backend call
    // if (user && !user.onboarding_completed) {
    //   return NextResponse.redirect(new URL('/onboarding', request.url))
    // }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    // Match all routes except those starting with:
    // - _next (internal Next.js files)
    // - api (API routes, handled separately)
    // - (public assets like images, fonts)
    '/((?!_next|api|.*\\..*|static|public).*)',
  ],
}
