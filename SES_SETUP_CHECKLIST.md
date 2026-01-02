# AWS SES Setup Checklist

## ✅ Step 1: AWS Credentials - DONE
- [x] AWS_ACCESS_KEY_ID added to .env.local
- [x] AWS_SECRET_ACCESS_KEY added to .env.local
- [ ] IAM user has SES permissions (AmazonSESFullAccess)

## ⚠️ Step 2: Environment Variables in .env.local

Make sure these are set:

```bash
# AWS Credentials (✅ Done)
AWS_ACCESS_KEY_ID=your_access_key_here
AWS_SECRET_ACCESS_KEY=your_secret_key_here

# AWS Region (IMPORTANT: Must match SES region)
AWS_REGION=us-east-1  # Change to match your SES region

# Email Configuration
FROM_EMAIL=your-email@example.com  # Must be verified in SES
```

**To use SES only, comment out or remove:**
```bash
# SENDGRID_API_KEY=...
# MAILGUN_API_KEY=...
# MAILGUN_DOMAIN=...
```

## ⚠️ Step 3: Verify Email in AWS SES Console

**Critical Step!** Your FROM_EMAIL must be verified in SES:

1. Go to: https://console.aws.amazon.com/ses
2. Make sure you're in the correct region (should match AWS_REGION)
3. Click **"Verified identities"** in the left sidebar
4. Click **"Create identity"**
5. Select **"Email address"**
6. Enter your `FROM_EMAIL` address
7. Click **"Create identity"**
8. Check your email inbox for verification email
9. Click the verification link in the email
10. Wait for verification status to show "Verified" (usually instant)

**Important:** 
- Verify email in the SAME region as your `AWS_REGION`
- If in sandbox mode, also verify recipient email addresses

## ⚠️ Step 4: Verify IAM User Permissions

Make sure your IAM user (the one with the access keys) has SES permissions:

1. Go to: https://console.aws.amazon.com/iam
2. Click **"Users"** → Find your user
3. Check **"Permissions"** tab
4. Should have **"AmazonSESFullAccess"** or custom policy with `ses:SendEmail`

If missing:
1. Click **"Add permissions"** → **"Attach policies directly"**
2. Search for **"AmazonSESFullAccess"**
3. Select it → **"Add permissions"**

## 🔄 Step 5: Restart Dev Server

**Important:** Environment variables are loaded when the server starts.

1. Stop your dev server (Ctrl+C)
2. Restart: `npm run dev`
3. New env vars will be loaded

## 🧪 Step 6: Test Email Sending

1. Go to: http://localhost:3000/admin/test-email
2. Enter an email address:
   - If in SES sandbox mode: Use a verified email address
   - If in production mode: Any email address
3. Click **"Send Test Email"**
4. Check for success message or error

## Troubleshooting

### Error: "Email address not verified"
- **Fix:** Verify your FROM_EMAIL in SES console (same region as AWS_REGION)

### Error: "InvalidClientTokenId"
- **Fix:** Check AWS_ACCESS_KEY_ID is correct

### Error: "SignatureDoesNotMatch"
- **Fix:** Check AWS_SECRET_ACCESS_KEY is correct

### Error: "AccessDenied"
- **Fix:** Add SES permissions to IAM user (AmazonSESFullAccess)

### Error: "The provided authorization grant is invalid, expired, or revoked"
- **Fix:** Usually means FROM_EMAIL not verified or wrong region

### Still getting errors?
1. Check server console logs for detailed error messages
2. Verify region matches where email is verified
3. Verify IAM user has SES permissions
4. Make sure dev server was restarted after changing .env.local

