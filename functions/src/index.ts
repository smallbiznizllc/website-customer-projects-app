import * as functions from 'firebase-functions'
import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses'

interface ContactFormData {
  name: string
  email: string
  subject: string
  message: string
}

// Helper to escape HTML
const escapeHtml = (text: string): string => {
  const map: { [key: string]: string } = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  }
  return text.replace(/[&<>"']/g, (m) => map[m])
}

export const sendContactForm = functions.https.onRequest(async (req, res) => {
  // Set CORS headers
  res.set('Access-Control-Allow-Origin', '*')
  res.set('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.set('Access-Control-Allow-Headers', 'Content-Type')

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(204).send('')
    return
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  try {
    const { name, email, subject, message }: ContactFormData = req.body

    // Validate required fields
    if (!name || !email || !subject || !message) {
      res.status(400).json({ error: 'All fields are required' })
      return
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      res.status(400).json({ error: 'Invalid email address' })
      return
    }

    // Get configuration from environment variables (Firebase Functions config)
    // These can be set via: firebase functions:config:set aws.region="us-east-1" etc.
    // Or via .env file in development
    const config = functions.config()
    const awsRegion = config.aws?.region || process.env.AWS_REGION || 'us-east-1'
    const awsAccessKeyId = config.aws?.access_key_id || process.env.AWS_ACCESS_KEY_ID
    const awsSecretAccessKey = config.aws?.secret_access_key || process.env.AWS_SECRET_ACCESS_KEY
    const fromEmail = config.email?.from_email || process.env.FROM_EMAIL
    const adminEmail = config.email?.admin_email || process.env.ADMIN_EMAIL || 'service@smallbizniz.com'

    if (!awsAccessKeyId || !awsSecretAccessKey || !fromEmail) {
      console.error('Missing AWS SES configuration')
      res.status(500).json({ error: 'Email service not configured' })
      return
    }

    // Escape HTML for security
    const safeFromName = escapeHtml(name)
    const safeFromEmail = escapeHtml(email)
    const safeSubject = escapeHtml(subject)
    const safeMessage = escapeHtml(message).replace(/\n/g, '<br>')

    // Create HTML email body
    const emailBody = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #DC2626; color: white; padding: 20px; border-radius: 8px 8px 0 0; }
          .content { background-color: #f9fafb; padding: 20px; border: 1px solid #e5e7eb; }
          .info-box { background-color: white; padding: 15px; border-radius: 6px; margin: 15px 0; border-left: 4px solid #DC2626; }
          .message-box { background-color: white; padding: 15px; border-radius: 6px; margin: 15px 0; border: 1px solid #e5e7eb; }
          a { color: #DC2626; text-decoration: underline; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="margin: 0;">📧 New Contact Form Submission</h1>
          </div>
          <div class="content">
            <div class="info-box">
              <p style="margin: 5px 0;"><strong>From:</strong> ${safeFromName}</p>
              <p style="margin: 5px 0;"><strong>Email:</strong> <a href="mailto:${safeFromEmail}">${safeFromEmail}</a></p>
              <p style="margin: 5px 0;"><strong>Subject:</strong> ${safeSubject}</p>
            </div>
            <div class="message-box">
              <p style="margin-top: 0;"><strong>Message:</strong></p>
              <p style="white-space: pre-wrap; margin-bottom: 0;">${safeMessage}</p>
            </div>
            <p style="margin-top: 20px; font-size: 12px; color: #6b7280;">
              This message was sent from the contact form on your website.
            </p>
          </div>
        </div>
      </body>
      </html>
    `.trim()

    // Create plain text version
    const textBody = `
New Contact Form Submission

From: ${name}
Email: ${email}
Subject: ${subject}

Message:
${message}

---
This message was sent from the contact form on your website.
    `.trim()

    // Initialize SES client
    const sesClient = new SESClient({
      region: awsRegion,
      credentials: {
        accessKeyId: awsAccessKeyId,
        secretAccessKey: awsSecretAccessKey,
      },
    })

    // Send email via AWS SES
    const command = new SendEmailCommand({
      Source: fromEmail,
      Destination: {
        ToAddresses: [adminEmail],
      },
      Message: {
        Subject: {
          Data: `Contact Form: ${subject}`,
          Charset: 'UTF-8',
        },
        Body: {
          Html: {
            Data: emailBody,
            Charset: 'UTF-8',
          },
          Text: {
            Data: textBody,
            Charset: 'UTF-8',
          },
        },
      },
    })

    await sesClient.send(command)
    console.log(`Contact form email sent to ${adminEmail} from ${email}`)

    res.status(200).json({
      success: true,
      message: 'Your message has been sent successfully!',
    })
  } catch (error: any) {
    console.error('Contact form error:', error)
    res.status(500).json({
      error: error.message || 'Failed to send message. Please try again later.',
    })
  }
})

