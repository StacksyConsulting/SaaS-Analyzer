import { NextRequest } from 'next/server'

export function getAccessTokenFromRequest(request: NextRequest): string | null {
  // Check for Authorization header
  const authHeader = request.headers.get('authorization')
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7) // Remove "Bearer " prefix
  }

  // Alternative: Check for token in cookies if you're using cookie-based auth
  // const token = request.cookies.get('token')?.value
  // return token || null

  return null
}
