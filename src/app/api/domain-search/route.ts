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
    const apiUrl = process.env.GODADDY_API_URL || 'https://api.ote-godaddy.com' // OTE (test) or https://api.godaddy.com (production)

    if (!apiKey || !apiSecret) {
      console.error('GoDaddy API credentials not configured')
      return NextResponse.json(
        { error: 'Domain search service not configured' },
        { status: 500 }
      )
    }

    // Check domain availability via GoDaddy Reseller API
    const availabilityUrl = `${apiUrl}/v1/domains/available?domain=${encodeURIComponent(cleanDomain)}`
    
    const response = await fetch(availabilityUrl, {
      method: 'GET',
      headers: {
        'Authorization': `sso-key ${apiKey}:${apiSecret}`,
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('GoDaddy API error:', response.status, errorText)
      
      if (response.status === 401) {
        return NextResponse.json(
          { error: 'Invalid GoDaddy API credentials' },
          { status: 500 }
        )
      }
      
      return NextResponse.json(
        { error: 'Failed to check domain availability. Please try again.' },
        { status: 500 }
      )
    }

    const data = await response.json()
    
    // Format response
    const result: DomainAvailabilityResponse = {
      domain: cleanDomain,
      available: data.available === true,
      price: data.price ? data.price / 1000000 : undefined, // GoDaddy returns price in micro-units (divide by 1,000,000)
      currency: data.currency || 'USD',
      period: data.period || 1,
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

