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
    const apiKey = process.env.GODADDY_API_KEY
    const apiSecret = process.env.GODADDY_API_SECRET
    const apiUrl = process.env.GODADDY_API_URL || 'https://api.godaddy.com'

    if (!apiKey || !apiSecret) {
      const missing = []
      if (!apiKey) missing.push('GODADDY_API_KEY')
      if (!apiSecret) missing.push('GODADDY_API_SECRET')
      
      console.error('GoDaddy API credentials not configured', {
        hasKey: !!apiKey,
        hasSecret: !!apiSecret,
        apiUrl,
        missingVars: missing,
        allEnvVars: Object.keys(process.env).filter(k => k.includes('GODADDY'))
      })
      
      return NextResponse.json(
        { 
          error: `Domain search service not configured. Missing environment variables: ${missing.join(', ')}. Please check Vercel environment variables.`,
          debug: process.env.NODE_ENV === 'development' ? {
            hasKey: !!apiKey,
            hasSecret: !!apiSecret,
            missing
          } : undefined
        },
        { status: 500 }
      )
    }

    console.log('GoDaddy API request:', {
      url: `${apiUrl}/v1/domains/available`,
      domain: cleanDomain,
      hasCredentials: !!(apiKey && apiSecret)
    })

    // Check domain availability via GoDaddy Reseller API
    // Note: GoDaddy requires at least 50 domains in account OR Discount Domain Club membership for availability API
    const availabilityUrl = `${apiUrl}/v1/domains/available?domain=${encodeURIComponent(cleanDomain)}`
    
    const response = await fetch(availabilityUrl, {
      method: 'GET',
      headers: {
        'Authorization': `sso-key ${apiKey}:${apiSecret}`,
        'Accept': 'application/json',
      },
    })

    const responseText = await response.text()
    console.log('GoDaddy API response:', {
      status: response.status,
      statusText: response.statusText,
      headers: Object.fromEntries(response.headers.entries()),
      body: responseText.substring(0, 500) // First 500 chars for logging
    })

    if (!response.ok) {
      let errorMessage = 'Failed to check domain availability'
      
      if (response.status === 401) {
        errorMessage = 'Invalid GoDaddy API credentials. Please verify your API key and secret in Vercel environment variables.'
      } else if (response.status === 403) {
        errorMessage = 'GoDaddy API access forbidden. Your reseller account may need at least 50 domains or a Discount Domain Club membership to use the availability API. Contact GoDaddy support for API access.'
      } else if (response.status === 429) {
        errorMessage = 'Rate limit exceeded. Please try again in a moment.'
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
          details: response.status !== 401 && response.status !== 403 ? responseText.substring(0, 200) : undefined
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
    // The API may return the domain data directly or in an array
    const domainData = Array.isArray(data) && data.length > 0 ? data[0] : data
    
    // Format response
    const result: DomainAvailabilityResponse = {
      domain: cleanDomain,
      available: domainData.available === true,
      price: domainData.price ? domainData.price / 1000000 : undefined, // GoDaddy returns price in micro-units (divide by 1,000,000)
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

