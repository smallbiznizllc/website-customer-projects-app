# Firebase Admin SDK Setup

## Error: "Firebase is not configured"

This error occurs when the Firebase Admin SDK cannot be initialized. This is **different** from the Firebase Client SDK.

## Required Environment Variables

Add these to your `.env.local` file:

```bash
# Firebase Admin SDK (Server-side)
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=your-service-account-email@your-project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour private key here\n-----END PRIVATE KEY-----\n"
```

**Important Notes:**
- These are **different** from `NEXT_PUBLIC_FIREBASE_*` variables (which are for client-side)
- `FIREBASE_PRIVATE_KEY` must be the full private key from your service account JSON file
- The private key should be wrapped in quotes and include `\n` for newlines (or use actual line breaks)

## How to Get Firebase Admin SDK Credentials

### Option 1: Download Service Account Key (Recommended)

1. Go to Firebase Console: https://console.firebase.google.com
2. Select your project
3. Go to **Project Settings** (gear icon)
4. Click the **Service Accounts** tab
5. Click **Generate New Private Key**
6. Download the JSON file
7. Open the JSON file and copy the values:
   - `project_id` → `FIREBASE_PROJECT_ID`
   - `client_email` → `FIREBASE_CLIENT_EMAIL`
   - `private_key` → `FIREBASE_PRIVATE_KEY` (keep the full key including `-----BEGIN PRIVATE KEY-----` and `-----END PRIVATE KEY-----`)

### Option 2: Set in .env.local

Add to your `.env.local` file:

```bash
FIREBASE_PROJECT_ID=your-project-id-here
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC...\n-----END PRIVATE KEY-----\n"
```

**Important:** The private key must:
- Be wrapped in double quotes
- Include `\n` for line breaks (or use actual line breaks)
- Include the full key including BEGIN and END markers

## Quick Check

To verify your setup, check your server console logs when the app starts. You should see:
- ✅ No "Firebase Admin initialization failed" warnings
- ❌ If you see warnings, the credentials are invalid or missing

## Common Issues

### Issue 1: Private Key Format
**Problem:** Private key not properly formatted in `.env.local`

**Solution:** Make sure the private key:
- Is wrapped in double quotes
- Includes `\n` for line breaks: `"-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"`
- Or use actual line breaks (make sure no extra spaces)

### Issue 2: Missing Environment Variables
**Problem:** One or more variables not set

**Solution:** Check that all three variables are set:
- `FIREBASE_PROJECT_ID`
- `FIREBASE_CLIENT_EMAIL`
- `FIREBASE_PRIVATE_KEY`

### Issue 3: Wrong Project
**Problem:** Using credentials from a different Firebase project

**Solution:** Make sure the service account is from the same project as your Firebase client config

### Issue 4: Environment Variables Not Loaded
**Problem:** `.env.local` changes not picked up

**Solution:** 
1. Stop the dev server (Ctrl+C)
2. Restart: `npm run dev`
3. Environment variables are loaded on server start

## Testing

After setting up the credentials:
1. Restart your dev server
2. Check server console for any warnings
3. Try registering a new user
4. If it works, Firebase Admin SDK is configured correctly

## Difference: Client vs Admin SDK

- **Client SDK** (`NEXT_PUBLIC_FIREBASE_*`): Used in the browser for authentication
- **Admin SDK** (`FIREBASE_*`): Used on the server for admin operations like creating users, managing Firestore, etc.

You need **both** configured for the app to work properly!

