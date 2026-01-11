# Environment Variables to Import to Vercel

## 📋 Copy ALL of these from your .env.local file

### ✅ REQUIRED - Import All of These:

**Firebase Client (Public - start with NEXT_PUBLIC_):**
- NEXT_PUBLIC_FIREBASE_API_KEY
- NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
- NEXT_PUBLIC_FIREBASE_PROJECT_ID
- NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
- NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
- NEXT_PUBLIC_FIREBASE_APP_ID
- NEXT_PUBLIC_APP_URL (set to: https://your-project.vercel.app after first deploy)

**Firebase Admin (Private):**
- FIREBASE_PROJECT_ID
- FIREBASE_CLIENT_EMAIL
- FIREBASE_PRIVATE_KEY (copy entire key including BEGIN/END lines)

**AWS S3 (Private):**
- AWS_REGION
- AWS_ACCESS_KEY_ID
- AWS_SECRET_ACCESS_KEY
- S3_BUCKET_NAME (update if it says "placeholder")

**AWS SES (Private):**
- FROM_EMAIL
- ADMIN_EMAIL (or set same as FROM_EMAIL)

**App Configuration (Private):**
- REGISTRATION_ENCRYPTION_KEY

### ❌ SKIP These (if present):
- Any variables with "SENDGRID" or "MAILGUN" (you're using AWS SES)
- Any test/development-only variables
- Comments (lines starting with #)

## 📝 Quick Copy Instructions:

1. Open your `.env.local` file
2. Copy each variable name and value
3. In Vercel: Settings → Environment Variables → Add New
4. Paste variable name and value
5. Select "Production" environment (and "Preview" if you want)
6. Click "Save"

## ⚠️ Important Notes:

- **FIREBASE_PRIVATE_KEY**: Copy the ENTIRE key, including:
  ```
  -----BEGIN PRIVATE KEY-----
  [all the lines of the key]
  -----END PRIVATE KEY-----
  ```
  Vercel will handle the newlines correctly when you paste it.

- **NEXT_PUBLIC_APP_URL**: 
  - First deployment: Set to `https://your-project.vercel.app` (or let Vercel auto-generate)
  - After deployment: Update to your actual Vercel URL

- **S3_BUCKET_NAME**: 
  - If it says "placeholder", update it with your actual S3 bucket name
  - Format: `your-bucket-name` (no s3:// prefix)

## ✅ Verification:

After adding all variables, verify:
- All NEXT_PUBLIC_* variables are set
- FIREBASE_PRIVATE_KEY is complete (not truncated)
- S3_BUCKET_NAME is your actual bucket (not "placeholder")
- AWS credentials match your AWS account
