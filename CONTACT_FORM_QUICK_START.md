# Contact Form Quick Start Guide

## Setup Steps (5-10 minutes)

### 1. Install Function Dependencies

```bash
cd functions
npm install
cd ..
```

### 2. Set AWS SES Credentials

**Option A: Using Firebase Functions Config (Recommended for Production)**

```bash
firebase functions:config:set \
  aws.region="us-east-1" \
  aws.access_key_id="YOUR_AWS_ACCESS_KEY_ID" \
  aws.secret_access_key="YOUR_AWS_SECRET_ACCESS_KEY" \
  email.from_email="noreply@yourdomain.com" \
  email.admin_email="service@smallbizniz.com"
```

**Option B: Using .env file (For Local Development)**

Create `functions/.env`:
```
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_access_key_here
AWS_SECRET_ACCESS_KEY=your_secret_key_here
FROM_EMAIL=noreply@yourdomain.com
ADMIN_EMAIL=service@smallbizniz.com
```

### 3. Build and Deploy the Function

```bash
cd functions
npm run build
cd ..
firebase deploy --only functions
```

**After deployment, copy the function URL** - it will look like:
```
https://us-central1-smallbizniz-site-and-proj-app.cloudfunctions.net/sendContactForm
```

### 4. Update HTML with Function URL

1. Open `public/creative-landing.html`
2. Find line 698: `const cloudFunctionUrl = 'https://us-central1-smallbizniz-site-and-proj-app.cloudfunctions.net/sendContactForm';`
3. Replace the URL with the actual URL from step 3

### 5. Deploy Updated HTML

```bash
firebase deploy --only hosting
```

### 6. Test the Form

1. Visit: https://smallbizniz-site-and-proj-app.web.app
2. Scroll to the contact form
3. Fill it out and submit
4. Check `service@smallbizniz.com` for the email

## Troubleshooting

**Function not found:**
- Verify deployment: `firebase functions:list`
- Check the URL matches what's in the HTML

**Email not sending:**
- Check function logs: `firebase functions:log --only sendContactForm`
- Verify AWS SES credentials are correct
- Ensure FROM_EMAIL is verified in AWS SES

**Need help?** See `FIREBASE_CLOUD_FUNCTIONS_SETUP.md` for detailed instructions.

