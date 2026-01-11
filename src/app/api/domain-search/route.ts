import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

interface DomainAvailabilityResponse {
  domain: string
  available: boolean
  price?: number
  currency?: string
  period?: number
}

export async function POST(request: NextRequest) {
  try {
    const { domain } = await request.json()

    if (!domain) {
      return NextResponse.json(
        { error: 'Domain name is required' },
        { status: 400 }
      )
    }

    // Clean and validate domain name
    const cleanDomain = domain.trim().toLowerCase().replace(/^https?:\/\//, '').replace(/\/$/, '')
    
    // Basic validation
    const domainRegex = /^[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?(\.[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?)*$/i
    if (!domainRegex.test(cleanDomain)) {
      return NextResponse.json(
        { error: 'Invalid domain name format' },
        { status: 400 }
      )
    }

    // Get GoDaddy Reseller API credentials
    // Trim whitespace to avoid authentication issues
    const apiKey = process.env.GODADDY_API_KEY?.trim()
    const apiSecret = process.env.GODADDY_API_SECRET?.trim()
    const apiUrl = (process.env.GODADDY_API_URL || 'https://api.godaddy.com').trim()

    if (!apiKey || !apiSecret) {
      const missing = []
      if (!apiKey) missing.push('GODADDY_API_KEY')
      if (!apiSecret) missing.push('GODADDY_API_SECRET')
      
      console.error('GoDaddy API credentials not configured', {
        hasKey: !!apiKey,
        hasSecret: !!apiSecret,
        apiUrl,
        missingVars: missing,
      })
      
      return NextResponse.json(
        { 
          error: `Domain search service not configured. Missing environment variables: ${missing.join(', ')}. Please check Vercel environment variables.`,
        },
        { status: 500 }
      )
    }

    console.log('GoDaddy API request:', {
      url: `${apiUrl}/v1/domains/available`,
      domain: cleanDomain,
      method: 'GET',
      hasCredentials: !!(apiKey && apiSecret),
      keyLength: apiKey.length,
      secretLength: apiSecret.length
    })

    // GoDaddy API uses GET with query parameter for single domain
    // Try GET first (this is the standard format)
    const availabilityUrl = `${apiUrl}/v1/domains/available?domain=${encodeURIComponent(cleanDomain)}`
    
    // Build authorization header - ensure no extra spaces
    const authHeader = `sso-key ${apiKey}:${apiSecret}`
    
    let response = await fetch(availabilityUrl, {
      method: 'GET',
      headers: {
        'Authorization': authHeader,
        'Accept': 'application/json',
      },
    })

    let responseText = await response.text()
    
    console.log('GoDaddy API response:', {
      status: response.status,
      statusText: response.statusText,
      method: 'GET',
      body: responseText.substring(0, 500)
    })

    // If GET fails with 400/401, the API might need POST or credentials are wrong
    if (!response.ok) {
      let errorMessage = 'Failed to check domain availability'
      
      if (response.status === 401) {
        errorMessage = 'Invalid GoDaddy API credentials. Please verify your API key and secret in Vercel environment variables. Make sure there are no extra spaces or characters.'
      } else if (response.status === 403) {
        errorMessage = 'GoDaddy API access forbidden. Your reseller account may need at least 50 domains or a Discount Domain Club membership to use the availability API.'
      } else if (response.status === 429) {
        errorMessage = 'Rate limit exceeded. Please try again in a moment.'
      } else if (response.status === 400) {
        try {
          const errorData = JSON.parse(responseText)
          if (errorData.code === 'UNABLE_TO_AUTHENTICATE') {
            errorMessage = 'Authentication failed. Please check your GoDaddy API key and secret. Ensure they are correct and have no extra spaces. The error suggests the credentials cannot be authenticated.'
          } else {
            errorMessage = errorData.message || errorData.code || 'Bad Request'
            if (errorData.fields) {
              const fieldErrors = errorData.fields.map((f: any) => 
                `${f.path || 'unknown'}: ${f.message || f.code || 'error'}`
              ).join(', ')
              errorMessage += ` [${fieldErrors}]`
            }
          }
        } catch {
          errorMessage = `Bad Request: ${responseText.substring(0, 300)}`
        }
      } else {
        try {
          const errorData = JSON.parse(responseText)
          errorMessage = errorData.message || errorMessage
        } catch {
          errorMessage = `API error (${response.status}): ${responseText.substring(0, 200)}`
        }
      }
      
      return NextResponse.json(
        { 
          error: errorMessage,
          status: response.status,
          details: responseText ? responseText.substring(0, 500) : 'No response body',
        },
        { status: 500 }
      )
    }

    let data
    try {
      data = JSON.parse(responseText)
      console.log('Parsed GoDaddy API data:', data)
    } catch (e) {
      console.error('Failed to parse GoDaddy API response:', e, 'Response:', responseText)
      return NextResponse.json(
        { error: 'Invalid response from domain service. Please check GoDaddy API status.' },
        { status: 500 }
      )
    }
    
    // Handle GoDaddy API response format
    const domainData = Array.isArray(data) && data.length > 0 ? data[0] : data
    
    // Format response
    const result: DomainAvailabilityResponse = {
      domain: cleanDomain,
      available: domainData.available === true,
      price: domainData.price ? domainData.price / 1000000 : undefined, // GoDaddy returns price in micro-units
      currency: domainData.currency || 'USD',
      period: domainData.period || 1,
    }

    return NextResponse.json(result)
  } catch (error: any) {
    console.error('Domain search error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to search domain. Please try again.' },
      { status: 500 }
    )
  }
}
