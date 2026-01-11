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
      let errorText = ''
      try {
        errorText = await response.text()
        console.error('GoDaddy API error:', response.status, errorText)
      } catch (e) {
        console.error('GoDaddy API error (could not read response):', response.status)
      }
      
      if (response.status === 401) {
        return NextResponse.json(
          { error: 'Invalid GoDaddy API credentials. Please check your API key and secret.' },
          { status: 500 }
        )
      }
      
      if (response.status === 403) {
        return NextResponse.json(
          { error: 'GoDaddy API access forbidden. Please check your reseller account permissions.' },
          { status: 500 }
        )
      }
      
      return NextResponse.json(
        { error: `Failed to check domain availability (${response.status}). Please try again.` },
        { status: 500 }
      )
    }

    let data
    try {
      data = await response.json()
    } catch (e) {
      console.error('Failed to parse GoDaddy API response:', e)
      return NextResponse.json(
        { error: 'Invalid response from domain service' },
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

