import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { readFileSync } from 'fs'
import { join } from 'path'

export function middleware(request: NextRequest) {
  // Only intercept the root path
  if (request.nextUrl.pathname === '/') {
    try {
      const htmlPath = join(process.cwd(), 'public', 'creative-landing.html')
      const htmlContent = readFileSync(htmlPath, 'utf-8')
      
      return new NextResponse(htmlContent, {
        headers: {
          'Content-Type': 'text/html',
        },
      })
    } catch (error) {
      console.error('Error serving HTML:', error)
    }
  }
  
  // For all other routes, continue normally
  return NextResponse.next()
}

export const config = {
  matcher: '/',
}
