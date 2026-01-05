# Firebase Hosting Deployment Guide

## Current Setup

Your Next.js app has been configured for Firebase Hosting. However, **Firebase Hosting only serves static files**, so your server-side features (API routes, Server Actions) won't work with this setup.

## Deployment Options

### Option 1: Deploy Static Landing Page (Current Setup)

This will deploy your landing page (`creative-landing.html`) to Firebase Hosting.

**To deploy:**
```bash
firebase deploy --only hosting
```

**What works:**
- ✅ Landing page
- ✅ Static assets (images, CSS)
- ✅ Contact form (if you set up API route separately)

**What doesn't work:**
- ❌ Login/Registration
- ❌ Dashboard
- ❌ Admin panel
- ❌ API routes
- ❌ Server Actions

### Option 2: Full Next.js Deployment (Recommended)

For full functionality, you have two better options:

#### A. Deploy to Vercel (Easiest)
1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy automatically

Vercel is built specifically for Next.js and handles all server-side features automatically.

#### B. Firebase Hosting + Cloud Run
1. Build Next.js with `output: 'standalone'`
2. Deploy to Cloud Run
3. Configure Firebase Hosting to proxy to Cloud Run

This is more complex but keeps everything on Firebase.

## Current Deployment Steps

### 1. Build the App
```bash
npm run build
```

### 2. Deploy to Firebase Hosting
```bash
firebase deploy --only hosting
```

### 3. Set Environment Variables (if using Cloud Functions)

If you set up Cloud Functions later, add environment variables:
```bash
firebase functions:config:set \
  firebase.project_id="your-project-id" \
  firebase.client_email="your-client-email" \
  firebase.private_key="your-private-key" \
  aws.region="us-east-1" \
  aws.access_key_id="your-access-key" \
  aws.secret_access_key="your-secret-key"
```

Or use Firebase Console:
1. Go to Firebase Console > Functions > Configuration
2. Add environment variables

## Environment Variables Needed

Make sure these are set in your deployment environment:

### Firebase
- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`
- `FIREBASE_PROJECT_ID`
- `FIREBASE_CLIENT_EMAIL`
- `FIREBASE_PRIVATE_KEY`

### AWS
- `AWS_REGION`
- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`
- `S3_BUCKET_NAME`

### Email
- `FROM_EMAIL`
- `ADMIN_EMAIL` (defaults to service@smallbizniz.com)

### App
- `NEXT_PUBLIC_APP_URL` (your production URL)
- `REGISTRATION_ENCRYPTION_KEY`

## Quick Deploy Command

```bash
# Build and deploy
npm run build && firebase deploy --only hosting
```

## Troubleshooting

### Build Errors
- Make sure all dependencies are installed: `npm install`
- Check for TypeScript errors: `npm run lint`

### Deployment Errors
- Make sure you're logged in: `firebase login`
- Check your project: `firebase projects:list`
- Verify project ID in `.firebaserc`

### Environment Variables
- Firebase Hosting doesn't support environment variables directly
- Use Cloud Functions or Cloud Run for server-side features
- Or use Vercel which handles this automatically

## Next Steps

1. **For static landing page only**: Run `firebase deploy --only hosting`
2. **For full app functionality**: Consider deploying to Vercel or setting up Cloud Run
3. **For production**: Set up proper domain, SSL, and environment variables


