import { NextRequest, NextResponse } from 'next/server'
import { sendContactFormEmail } from '@/lib/email/sendEmail'

export async function POST(request: NextRequest) {
  try {
    const { name, email, subject, message } = await request.json()

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      )
    }

    // Send email to admin
    await sendContactFormEmail({
      fromEmail: email,
      fromName: name,
      subject,
      message,
    })

    return NextResponse.json({ 
      success: true,
      message: 'Your message has been sent successfully!' 
    })
  } catch (error: any) {
    console.error('Contact form error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to send message. Please try again later.' },
      { status: 500 }
    )
  }
}


