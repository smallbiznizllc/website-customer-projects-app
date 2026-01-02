# Email Service Troubleshooting

## Email Service Priority

The app supports three email services, in this order:
1. **SendGrid** (if `SENDGRID_API_KEY` is set)
2. **Mailgun** (if `MAILGUN_API_KEY` and `MAILGUN_DOMAIN` are set)
3. **AWS SES** (if `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, and `AWS_REGION` are set)

**To use AWS SES only:** Remove or comment out SendGrid and Mailgun API keys from `.env.local`

## Common "Unauthorized" Error Fixes

### AWS SES

**Error:** `AccessDenied` or `MessageRejected`

**Solutions:**

1. **Verify Email Address or Domain**
   - Go to AWS Console: https://console.aws.amazon.com/ses
   - Navigate to: Verified identities
   - Verify your `FROM_EMAIL` address (click "Create identity" → "Email address")
   - Or verify your entire domain for production use

2. **Check SES Sandbox Mode**
   - New SES accounts start in "sandbox mode"
   - In sandbox mode, you can only send to verified email addresses
   - To send to any email: Request production access in SES console

3. **Verify IAM Permissions**
   - Your AWS IAM user/role needs `ses:SendEmail` permission
   - Check IAM policy includes:
     ```json
     {
       "Effect": "Allow",
       "Action": ["ses:SendEmail", "ses:SendRawEmail"],
       "Resource": "*"
     }
     ```

4. **Check Region**
   - Ensure `AWS_REGION` matches the region where your SES identity is verified
   - Common regions: `us-east-1`, `us-west-2`, `eu-west-1`

5. **Verify FROM_EMAIL**
   - The `FROM_EMAIL` in `.env.local` must match a verified SES identity
   - Format: `name@verified-domain.com` or just the verified email

### SendGrid

**Error:** `401 Unauthorized` or `403 Forbidden`

**Solutions:**

1. **Verify API Key**
   - Go to SendGrid Dashboard: https://app.sendgrid.com/settings/api_keys
   - Verify the API key in `.env.local` matches your SendGrid account
   - Ensure the API key has "Mail Send" permissions enabled

2. **Verify FROM_EMAIL Address**
   - Go to SendGrid Dashboard: https://app.sendgrid.com/settings/sender_auth
   - Click "Verify a Single Sender" (for testing) or set up Domain Authentication (for production)
   - Add and verify your `FROM_EMAIL` address
   - The FROM_EMAIL in `.env.local` must match a verified sender

3. **Check API Key Permissions**
   - In SendGrid Dashboard > Settings > API Keys
   - Click on your API key
   - Ensure "Mail Send" permission is enabled (Full Access or Restricted Access with Mail Send)

### Mailgun

**Error:** `401 Unauthorized` or `403 Forbidden`

**Solutions:**

1. **Verify API Key**
   - Go to Mailgun Dashboard: https://app.mailgun.com/app/account/security/api_keys
   - Verify the API key in `.env.local` matches your Mailgun account

2. **Verify Domain**
   - Go to Mailgun Dashboard: https://app.mailgun.com/app/sending/domains
   - Ensure your domain is verified
   - The `MAILGUN_DOMAIN` in `.env.local` must match a verified domain

3. **Check FROM_EMAIL Domain**
   - The FROM_EMAIL should use your verified Mailgun domain
   - Example: If domain is `mg.example.com`, FROM_EMAIL should be `noreply@mg.example.com` or a verified subdomain

## Quick Test

1. **Check Configuration:**
   ```bash
   # Verify environment variables are set
   grep -E "SENDGRID|MAILGUN|FROM_EMAIL" .env.local
   ```

2. **Test Email:**
   - Go to: http://localhost:3000/admin/test-email
   - Enter your email address
   - Click "Send Test Email"
   - Check the error message for specific details

3. **Check Server Logs:**
   - Look at your terminal/console where `npm run dev` is running
   - Check for detailed error messages from SendGrid/Mailgun

## Development Mode

In development, if email services aren't configured, the app will:
- Log email details to the console instead of sending
- Show "Email would be sent" messages in logs
- This is intentional for development/testing without email service

## Which Service is Being Used?

The app uses this priority:
1. **SendGrid** - if `SENDGRID_API_KEY` is set
2. **Mailgun** - if `MAILGUN_API_KEY` and `MAILGUN_DOMAIN` are set
3. **Console logging** - if neither is configured

## Still Having Issues?

1. Check your email service dashboard for:
   - API key validity
   - Sender/domain verification status
   - Account limits or restrictions

2. Try switching services:
   - If SendGrid isn't working, try Mailgun (or vice versa)
   - Remove one API key to force using the other service

3. Check server logs for the full error message

