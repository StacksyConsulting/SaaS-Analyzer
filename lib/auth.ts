import { NextRequest } from 'next/server'

export function getAccessTokenFromRequest(request: NextRequest): string | null {
  // If you had real logic here, copy it in.
  // For now we’ll return a dummy token so your build works.
  return 'dummy-access-token'
}
