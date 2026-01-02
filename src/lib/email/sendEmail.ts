// Email service implementation using AWS SES

interface TicketEmailParams {
  to: string
  ticketId: string
  title: string
  status: string
  publicKey: string
}

interface AdminNotificationParams {
  to: string
  ticketId: string
  title: string
  description: string
  userEmail: string
  createdAt: Date
}

interface RegistrationApprovalParams {
  to: string
  registrationId: string
  email: string
  displayName?: string
  createdAt: Date
}

export async function sendTicketEmail({
  to,
  ticketId,
  title,
  status,
  publicKey,
}: TicketEmailParams) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  const statusUrl = `${appUrl}/ticket-status/${ticketId}/${publicKey}`

  const emailBody = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #4F46E5; color: white; padding: 20px; border-radius: 8px 8px 0 0; }
        .content { background-color: #f9fafb; padding: 20px; border: 1px solid #e5e7eb; }
        .button { display: inline-block; padding: 12px 24px; background-color: #4F46E5; color: white; text-decoration: none; border-radius: 6px; margin-top: 20px; }
        .status-badge { display: inline-block; padding: 6px 12px; border-radius: 4px; font-weight: bold; }
        .status-not-started { background-color: #f3f4f6; color: #374151; }
        .status-in-progress { background-color: #dbeafe; color: #1e40af; }
        .status-complete { background-color: #d1fae5; color: #065f46; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Ticket Update</h1>
        </div>
        <div class="content">
          <h2>${title}</h2>
          <p><strong>Status:</strong> <span class="status-badge status-${status.toLowerCase().replace(/\s+/g, '-')}">${status}</span></p>
          <p>Your ticket has been updated. You can view the current status using the link below:</p>
          <a href="${statusUrl}" class="button">View Ticket Status</a>
          <p style="margin-top: 20px; font-size: 12px; color: #6b7280;">
            Ticket ID: ${ticketId}
          </p>
        </div>
      </div>
    </body>
    </html>
  `

  // Implementation with AWS SES
  if (process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY && process.env.AWS_REGION) {
    try {
      const { SESClient, SendEmailCommand } = require('@aws-sdk/client-ses')
      
      const sesClient = new SESClient({
        region: process.env.AWS_REGION,
        credentials: {
          accessKeyId: process.env.AWS_ACCESS_KEY_ID,
          secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        },
      })

      const command = new SendEmailCommand({
        Source: process.env.FROM_EMAIL || 'noreply@yourdomain.com',
        Destination: {
          ToAddresses: [to],
        },
        Message: {
          Subject: {
            Data: `Ticket Update: ${title}`,
            Charset: 'UTF-8',
          },
          Body: {
            Html: {
              Data: emailBody,
              Charset: 'UTF-8',
            },
          },
        },
      })

      await sesClient.send(command)
      return
    } catch (error: any) {
      console.error('AWS SES error:', error)
      console.error('AWS SES error details:', {
        name: error.name,
        message: error.message,
        code: error.Code,
        statusCode: error.$metadata?.httpStatusCode,
        requestId: error.$metadata?.requestId,
      })
      throw error
    }
  }

  // Fallback: Log to console if AWS credentials are not configured
  console.error('AWS SES not configured. Please set AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, and AWS_REGION in .env.local')
  console.log('Email would be sent:', { to, subject: `Ticket Update: ${title}` })
}

export async function sendAdminNotificationEmail({
  to,
  ticketId,
  title,
  description,
  userEmail,
  createdAt,
}: AdminNotificationParams) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  const adminUrl = `${appUrl}/admin/tickets/${ticketId}`

  const emailBody = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #DC2626; color: white; padding: 20px; border-radius: 8px 8px 0 0; }
        .content { background-color: #f9fafb; padding: 20px; border: 1px solid #e5e7eb; }
        .button { display: inline-block; padding: 12px 24px; background-color: #DC2626; color: white; text-decoration: none; border-radius: 6px; margin-top: 20px; }
        .info-box { background-color: white; padding: 15px; border-radius: 6px; margin: 15px 0; border-left: 4px solid #DC2626; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🔔 New Ticket Created</h1>
        </div>
        <div class="content">
          <div class="info-box">
            <h2>${title}</h2>
            <p><strong>From:</strong> ${userEmail}</p>
            <p><strong>Created:</strong> ${createdAt.toLocaleString()}</p>
            <p><strong>Description:</strong></p>
            <p>${description}</p>
          </div>
          <p>A new support ticket has been created and requires your attention.</p>
          <a href="${adminUrl}" class="button">View Ticket in Admin Panel</a>
          <p style="margin-top: 20px; font-size: 12px; color: #6b7280;">
            Ticket ID: ${ticketId}
          </p>
        </div>
      </div>
    </body>
    </html>
  `

  // Implementation with AWS SES
  if (process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY && process.env.AWS_REGION) {
    try {
      const { SESClient, SendEmailCommand } = require('@aws-sdk/client-ses')
      
      const sesClient = new SESClient({
        region: process.env.AWS_REGION,
        credentials: {
          accessKeyId: process.env.AWS_ACCESS_KEY_ID,
          secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        },
      })

      const command = new SendEmailCommand({
        Source: process.env.FROM_EMAIL || 'noreply@yourdomain.com',
        Destination: {
          ToAddresses: [to],
        },
        Message: {
          Subject: {
            Data: `🔔 New Ticket: ${title}`,
            Charset: 'UTF-8',
          },
          Body: {
            Html: {
              Data: emailBody,
              Charset: 'UTF-8',
            },
          },
        },
      })

      await sesClient.send(command)
      return
    } catch (error: any) {
      console.error('AWS SES error:', error)
      console.error('AWS SES error details:', {
        name: error.name,
        message: error.message,
        code: error.Code,
        statusCode: error.$metadata?.httpStatusCode,
        requestId: error.$metadata?.requestId,
      })
      throw error
    }
  }

  // Fallback: Log to console if AWS credentials are not configured
  console.error('AWS SES not configured. Please set AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, and AWS_REGION in .env.local')
  console.log('Admin notification email would be sent:', { 
    to, 
    subject: `🔔 New Ticket: ${title}`,
    ticketId,
    userEmail 
  })
}

export async function sendRegistrationApprovalEmail({
  to,
  registrationId,
  email,
  displayName,
  createdAt,
}: RegistrationApprovalParams) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  const adminUrl = `${appUrl}/admin/registrations`

  const emailBody = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #10b981; color: white; padding: 20px; border-radius: 8px 8px 0 0; }
        .content { background-color: #f9fafb; padding: 20px; border: 1px solid #e5e7eb; }
        .button { display: inline-block; padding: 12px 24px; background-color: #10b981; color: white; text-decoration: none; border-radius: 6px; margin-top: 20px; }
        .info-box { background-color: white; padding: 15px; border-radius: 6px; margin: 15px 0; border-left: 4px solid #10b981; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🔔 New User Registration Request</h1>
        </div>
        <div class="content">
          <div class="info-box">
            <p><strong>Email:</strong> ${email}</p>
            ${displayName ? `<p><strong>Name:</strong> ${displayName}</p>` : ''}
            <p><strong>Requested:</strong> ${createdAt.toLocaleString()}</p>
          </div>
          <p>A new user has requested access to the system and is waiting for approval.</p>
          <a href="${adminUrl}" class="button">Review Registration in Admin Panel</a>
          <p style="margin-top: 20px; font-size: 12px; color: #6b7280;">
            Registration ID: ${registrationId}
          </p>
        </div>
      </div>
    </body>
    </html>
  `

  // Implementation with AWS SES
  if (process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY && process.env.AWS_REGION) {
    try {
      const { SESClient, SendEmailCommand } = require('@aws-sdk/client-ses')
      
      const sesClient = new SESClient({
        region: process.env.AWS_REGION,
        credentials: {
          accessKeyId: process.env.AWS_ACCESS_KEY_ID,
          secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        },
      })

      const command = new SendEmailCommand({
        Source: process.env.FROM_EMAIL || 'noreply@yourdomain.com',
        Destination: {
          ToAddresses: [to],
        },
        Message: {
          Subject: {
            Data: `🔔 New Registration Request: ${email}`,
            Charset: 'UTF-8',
          },
          Body: {
            Html: {
              Data: emailBody,
              Charset: 'UTF-8',
            },
          },
        },
      })

      await sesClient.send(command)
      return
    } catch (error: any) {
      console.error('AWS SES error:', error)
      console.error('AWS SES error details:', {
        name: error.name,
        message: error.message,
        code: error.Code,
        statusCode: error.$metadata?.httpStatusCode,
        requestId: error.$metadata?.requestId,
      })
      throw error
    }
  }

  // Fallback: Log to console if AWS credentials are not configured
  console.error('AWS SES not configured. Please set AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, and AWS_REGION in .env.local')
  console.log('Registration approval email would be sent:', { 
    to, 
    subject: `🔔 New Registration Request: ${email}`,
    registrationId,
    email,
    displayName 
  })
}



