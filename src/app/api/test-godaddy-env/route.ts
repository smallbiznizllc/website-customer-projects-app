import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  const apiKey = process.env.GODADDY_API_KEY?.trim()
  const apiSecret = process.env.GODADDY_API_SECRET?.trim()
  const apiUrl = (process.env.GODADDY_API_URL || 'https://api.godaddy.com').trim()

  // Test authentication by making a simple API call
  let authTest = null
  if (apiKey && apiSecret) {
    try {
      // Try to get account info or make a simple authenticated request
      const testUrl = `${apiUrl}/v1/domains/available?domain=test-domain-xyz-12345.com`
      const response = await fetch(testUrl, {
        method: 'GET',
        headers: {
          'Authorization': `sso-key ${apiKey}:${apiSecret}`,
          'Accept': 'application/json',
        },
      })
      
      authTest = {
        status: response.status,
        statusText: response.statusText,
        success: response.ok,
        message: response.ok ? 'Authentication successful' : 'Authentication failed'
      }
      
      if (!response.ok) {
        const errorText = await response.text()
        try {
          const errorData = JSON.parse(errorText)
          authTest.error = errorData
        } catch {
          authTest.errorText = errorText.substring(0, 200)
        }
      }
    } catch (error: any) {
      authTest = {
        success: false,
        error: error.message
      }
    }
  }

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
    allGodaddyVars: Object.keys(process.env).filter(k => k.toUpperCase().includes('GODADDY')),
    authTest
  })
}
