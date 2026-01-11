import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  const apiKey = process.env.GODADDY_API_KEY
  const apiSecret = process.env.GODADDY_API_SECRET
  const apiUrl = process.env.GODADDY_API_URL || 'https://api.godaddy.com'

  return NextResponse.json({
    configured: !!(apiKey && apiSecret),
    hasApiKey: !!apiKey,
    hasApiSecret: !!apiSecret,
    apiUrl,
    keyLength: apiKey?.length || 0,
    secretLength: apiSecret?.length || 0,
    // Show first/last chars for verification (not full keys for security)
    keyPreview: apiKey ? `${apiKey.substring(0, 4)}...${apiKey.substring(apiKey.length - 4)}` : 'missing',
    secretPreview: apiSecret ? `${apiSecret.substring(0, 4)}...${apiSecret.substring(apiSecret.length - 4)}` : 'missing',
    allGodaddyVars: Object.keys(process.env).filter(k => k.toUpperCase().includes('GODADDY'))
  })
}

