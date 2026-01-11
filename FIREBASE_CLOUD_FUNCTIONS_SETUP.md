# Firebase Cloud Functions Setup for Contact Form

This guide will help you set up Firebase Cloud Functions to send emails via AWS SES for your contact form.

## Prerequisites

1. Firebase CLI installed: `npm install -g firebase-tools`
2. AWS SES configured and verified
3. Firebase project created

## Step 1: Install Function Dependencies

```bash
cd functions
npm install
cd ..
```

## Step 2: Set Environment Variables for Cloud Functions

You need to set environment variables in Firebase Functions for AWS SES credentials:

```bash
firebase functions:config:set \
  aws.region="us-east-1" \
  aws.access_key_id="YOUR_AWS_ACCESS_KEY_ID" \
  aws.secret_access_key="YOUR_AWS_SECRET_ACCESS_KEY" \
  email.from_email="noreply@yourdomain.com" \
  email.admin_email="service@smallbizniz.com"
```

**Or use the new .env format (recommended):**

1. Create `functions/.env` file:
```bash
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_access_key_here
AWS_SECRET_ACCESS_KEY=your_secret_key_here
FROM_EMAIL=noreply@yourdomain.com
ADMIN_EMAIL=service@smallbizniz.com
```

2. Update `functions/package.json` to use dotenv (if using .env file):
```bash
cd functions
npm install dotenv
```

3. Update `functions/src/index.ts` to load .env:
```typescript
import * as dotenv from 'dotenv'
dotenv.config()
```

**Note:** For production, use Firebase Functions config (firebase functions:config:set) or Firebase Console → Functions → Configuration.

## Step 3: Build the Functions

```bash
cd functions
npm run build
cd ..
```

## Step 4: Deploy the Function

```bash
firebase deploy --only functions
```

After deployment, you'll see the function URL, something like:
```
https://us-central1-smallbizniz-site-and-proj-app.cloudfunctions.net/sendContactForm
```

## Step 5: Update the HTML Form

1. Open `public/creative-landing.html`
2. Find the line with `cloudFunctionUrl` (around line 695)
3. Replace the URL with your actual function URL from step 4

## Step 6: Deploy the Updated HTML

```bash
firebase deploy --only hosting
```

## Testing

1. Visit your site: https://smallbizniz-site-and-proj-app.web.app
2. Scroll to the contact form
3. Fill out and submit the form
4. Check that you receive the email at `service@smallbizniz.com`

## Troubleshooting

### Function not found
- Make sure the function is deployed: `firebase deploy --only functions`
- Check the function URL in Firebase Console → Functions

### Email not sending
- Verify AWS SES credentials are correct
- Check that your FROM_EMAIL is verified in AWS SES
- Check function logs: `firebase functions:log`

### CORS errors
- The function includes CORS headers, but make sure your domain is allowed

## Security Notes

- Never commit your `.env` file or Firebase config with secrets
- Use Firebase Functions config for production credentials
- Consider adding rate limiting to prevent abuse
- Validate all inputs on the server side (already done)

