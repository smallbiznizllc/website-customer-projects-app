# Vercel Deployment Guide

## Quick Deployment Steps

### 1. Import Project to Vercel

1. Go to https://vercel.com/new
2. Sign in with GitHub
3. Import your repository: `smallbiznizllc-website-customer-projects-app`
4. Vercel will auto-detect Next.js configuration

### 2. Configure Build Settings

**Framework Preset:** Next.js (auto-detected)
**Root Directory:** `./` (leave as default)
**Build Command:** `npm run build` (auto-detected)
**Output Directory:** `.next` (auto-detected)
**Install Command:** `npm install` (auto-detected)

### 3. Add Environment Variables

Click "Environment Variables" and add all of these:

#### Firebase Client (Public - starts with NEXT_PUBLIC_)
```
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_APP_URL=https://your-vercel-domain.vercel.app
```

#### Firebase Admin (Private)
```
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_CLIENT_EMAIL=your_client_email
FIREBASE_PRIVATE_KEY="your_private_key_with_escaped_newlines"
```

#### AWS S3 (Private)
```
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_access_key_id
AWS_SECRET_ACCESS_KEY=your_secret_access_key
S3_BUCKET_NAME=your_bucket_name
```

#### AWS SES (Private)
```
FROM_EMAIL=service@smallbizniz.com
ADMIN_EMAIL=service@smallbizniz.com
```

#### App Configuration
```
REGISTRATION_ENCRYPTION_KEY=your_encryption_key
```

**Important Notes:**
- For `FIREBASE_PRIVATE_KEY`: Paste the entire key including `-----BEGIN PRIVATE KEY-----` and `-----END PRIVATE KEY-----`
- The private key should be on multiple lines - Vercel will handle this correctly
- `NEXT_PUBLIC_APP_URL` should be your Vercel domain (e.g., `https://your-project.vercel.app`)

### 4. Deploy

Click "Deploy" and wait for the build to complete.

### 5. Update APP_URL After First Deployment

After first deployment, update `NEXT_PUBLIC_APP_URL` environment variable with your actual Vercel URL:
1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Update `NEXT_PUBLIC_APP_URL` to your actual Vercel domain
3. Redeploy (or it will auto-update on next commit)

## Post-Deployment Checklist

- [ ] Verify landing page loads
- [ ] Test login functionality
- [ ] Test ticket creation
- [ ] Verify file uploads work
- [ ] Test contact form
- [ ] Check email notifications

## Troubleshooting

### Build Fails
- Check that all environment variables are set
- Verify `FIREBASE_PRIVATE_KEY` is formatted correctly
- Check build logs in Vercel dashboard

### Runtime Errors
- Verify `NEXT_PUBLIC_APP_URL` matches your Vercel domain
- Check that Firebase Admin credentials are correct
- Verify AWS credentials have correct permissions

### Environment Variables Not Loading
- Ensure variables are set for "Production" environment
- Redeploy after adding new environment variables
- Check that variable names match exactly (case-sensitive)

## Using Vercel CLI (Alternative)

If you prefer using CLI:

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel

# Set environment variables
vercel env add FIREBASE_PROJECT_ID
vercel env add FIREBASE_CLIENT_EMAIL
# ... etc for each variable
```

## Custom Domain (Optional)

1. Go to Vercel Dashboard → Your Project → Settings → Domains
2. Add your custom domain
3. Update DNS records as instructed
4. Update `NEXT_PUBLIC_APP_URL` to your custom domain

