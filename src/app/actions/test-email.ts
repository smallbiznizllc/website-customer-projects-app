'use server'

import { sendRegistrationApprovalEmail } from '@/lib/email/sendEmail'

export async function sendTestEmail(toEmail: string) {
  try {
    // Send a test email using the registration approval email template
    // This tests the email service configuration
    await sendRegistrationApprovalEmail({
      to: toEmail,
      registrationId: 'test-registration-id',
      email: 'test@example.com',
      displayName: 'Test User',
      createdAt: new Date(),
    })
    
    return { 
      success: true, 
      message: `Test email sent successfully to ${toEmail}` 
    }
  } catch (error: any) {
    console.error('Error sending test email:', error)
    console.error('Full error details:', JSON.stringify(error, null, 2))
    
    // Provide more detailed error messages
    let errorMessage = 'Failed to send test email.'
    
    if (error.response) {
      // SendGrid/Mailgun API error
      const statusCode = error.response.statusCode || error.response.status
      const body = error.response.body || error.response.data
      
      if (statusCode === 401 || statusCode === 403) {
        errorMessage = `Unauthorized: ${body?.errors?.[0]?.message || 'Invalid API key or insufficient permissions. Check your SendGrid/Mailgun API key and FROM_EMAIL verification.'}`
      } else if (statusCode === 400) {
        errorMessage = `Bad Request: ${body?.errors?.[0]?.message || 'Invalid email address or FROM_EMAIL not verified.'}`
      } else {
        errorMessage = `API Error (${statusCode}): ${body?.errors?.[0]?.message || error.message}`
      }
    } else if (error.name === 'InvalidClientTokenId' || error.name === 'SignatureDoesNotMatch') {
      // AWS credential errors
      errorMessage = `AWS Authentication Error: Invalid AWS credentials. Please check your AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY in .env.local`
    } else if (error.name === 'MessageRejected') {
      errorMessage = `AWS SES Error: ${error.message || 'Email was rejected. Make sure your FROM_EMAIL is verified in AWS SES console.'}`
    } else if (error.name === 'AccessDenied' || error.$metadata?.httpStatusCode === 403) {
      errorMessage = `AWS SES Permission Error: Your AWS credentials don't have permission to send emails. Ensure your IAM user/role has 'ses:SendEmail' permission.`
    } else if (error.Code) {
      // AWS SDK error with Code property
      errorMessage = `AWS SES Error (${error.Code}): ${error.message || 'Please check your AWS SES configuration and FROM_EMAIL verification.'}`
    } else if (error.message) {
      errorMessage = error.message
    }
    
    return {
      success: false,
      message: errorMessage,
    }
  }
}

