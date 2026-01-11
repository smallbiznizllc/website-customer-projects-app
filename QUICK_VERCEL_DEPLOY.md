# Quick Vercel Deployment

## Step 1: Import to Vercel (2 minutes)

1. Go to: **https://vercel.com/new**
2. Sign in with **GitHub**
3. Click **"Import"** next to: `smallbiznizllc/website-customer-projects-app`
4. Vercel will auto-detect Next.js ✅

## Step 2: Add Environment Variables

Click **"Environment Variables"** and add these from your `.env.local`:

### Copy from your `.env.local` file:

**Firebase Client (Public):**
- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`
- `NEXT_PUBLIC_APP_URL` → Set this to: `https://your-project.vercel.app` (update after first deploy)

**Firebase Admin (Private):**
- `FIREBASE_PROJECT_ID`
- `FIREBASE_CLIENT_EMAIL`
- `FIREBASE_PRIVATE_KEY` → Copy the entire key including `-----BEGIN` and `-----END` lines

**AWS (Private):**
- `AWS_REGION`
- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`
- `S3_BUCKET_NAME`

**Email (Private):**
- `FROM_EMAIL`
- `ADMIN_EMAIL` (add if you have it, or set to same as FROM_EMAIL)

**App Config (Private):**
- `REGISTRATION_ENCRYPTION_KEY`

**⚠️ Important:**
- Make sure `FIREBASE_PRIVATE_KEY` includes the entire key with newlines
- Set `NEXT_PUBLIC_APP_URL` to your Vercel URL after first deployment
- All variables should be set for "Production" environment

## Step 3: Deploy

1. Click **"Deploy"**
2. Wait 2-3 minutes for build to complete
3. Your app will be live at: `https://your-project.vercel.app`

## Step 4: Update APP_URL (After First Deploy)

1. Go to: Vercel Dashboard → Your Project → Settings → Environment Variables
2. Find `NEXT_PUBLIC_APP_URL`
3. Update value to your actual Vercel URL (e.g., `https://website-customer-projects-app.vercel.app`)
4. Redeploy (Settings → Deployments → Redeploy)

## ✅ Done!

Your Next.js app is now live with:
- ✅ Landing page
- ✅ Login/Dashboard
- ✅ Ticketing system
- ✅ Admin panel
- ✅ Contact form

## Quick Test Checklist

- [ ] Landing page loads
- [ ] Can register/login
- [ ] Dashboard works
- [ ] Can create tickets
- [ ] Admin panel accessible (if you're an admin)
- [ ] Contact form sends emails

## Need Help?

- Check build logs: Vercel Dashboard → Deployments → Click on deployment
- Common issues: Missing env vars, wrong `NEXT_PUBLIC_APP_URL`
- Redeploy after adding new environment variables

