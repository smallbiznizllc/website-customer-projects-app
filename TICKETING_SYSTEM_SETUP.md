# Ticketing System Setup Checklist

This guide outlines everything needed to get the ticketing system fully operational.

## ✅ Already Configured

Based on your current setup:
- ✅ **AWS SES** - Configured for email sending
- ✅ **Firebase Admin SDK** - Credentials appear to be set
- ✅ **Firebase Hosting** - Deployed and working
- ✅ **Contact Form** - Working with Cloud Functions

## 🔴 Critical Requirements

### 1. AWS S3 Bucket Setup (Required for File Attachments)

The ticketing system needs S3 to upload ticket attachments (files up to 2MB).

**Current Status:** ⚠️ `S3_BUCKET_NAME` not found in environment variables

**Setup Steps:**

1. **Create S3 Bucket:**
   ```bash
   # Via AWS Console: https://s3.console.aws.amazon.com/
   # Or via AWS CLI:
   aws s3 mb s3://your-bucket-name --region us-east-1
   ```

2. **Configure CORS on S3 Bucket:**
   Go to S3 Console → Your Bucket → Permissions → CORS configuration:
   ```json
   [
     {
       "AllowedHeaders": ["*"],
       "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
       "AllowedOrigins": [
         "http://localhost:3000",
         "https://smallbizniz-site-and-proj-app.web.app",
         "https://smallbizniz-site-and-proj-app.firebaseapp.com"
       ],
       "ExposeHeaders": ["ETag"],
       "MaxAgeSeconds": 3000
     }
   ]
   ```

3. **Create IAM User with S3 Permissions:**
   - Go to IAM Console → Users → Create User
   - Attach policy: `AmazonS3FullAccess` (or create custom policy for your bucket only)
   - Create Access Key
   - Copy Access Key ID and Secret Access Key

4. **Add to `.env.local`:**
   ```bash
   S3_BUCKET_NAME=your-bucket-name-here
   # AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY already set for SES
   # AWS_REGION already set
   ```

**Note:** You can use the same AWS credentials you're already using for SES.

### 2. Firestore Database Setup

**Check if Firestore is created:**
- Visit: https://console.firebase.google.com/project/smallbizniz-site-and-proj-app/firestore
- If not created, click "Create database"
- Choose location (e.g., `us-central1`)
- Start in production mode (we'll deploy rules)

**Required Collections:**
- `tickets` - Will be created automatically when first ticket is created
- `users` - Should already exist for user management

**Firestore Indexes:**

Check `firestore.indexes.json` - you may need to deploy indexes if queries fail:
```bash
firebase deploy --only firestore:indexes
```

### 3. Firestore Security Rules

**Deploy Security Rules:**
```bash
firebase deploy --only firestore:rules
```

This will deploy the rules in `firestore.rules` which allows:
- Authenticated users to create/read their own tickets
- Admins to read/update all tickets
- Public read access to tickets via public key

### 4. Email Notifications (Already Configured ✅)

You already have AWS SES configured, which is used for:
- Sending confirmation emails to users when tickets are created
- Sending update emails when ticket status changes
- Sending admin notifications when new tickets are created

**Verify Email Settings:**
- `FROM_EMAIL` should be verified in AWS SES
- `ADMIN_EMAIL` should receive notifications

## 🟡 Recommended Setup

### 5. Firestore Indexes

The ticket system uses these queries that may need indexes:

**For Admin Panel (All Tickets):**
- Collection: `tickets`
- Fields: `createdAt` (Descending)
- Status: Should auto-create on first query

**For User Tickets:**
- Collection: `tickets`
- Fields: `userId` (Ascending), `createdAt` (Descending)
- Status: Should auto-create on first query

If you get index errors, Firebase will provide a link to create them automatically.

**Deploy indexes:**
```bash
firebase deploy --only firestore:indexes
```

### 6. Admin User Setup

You need at least one admin user to manage tickets:

**Option A: Via Firebase Console**
1. Go to: https://console.firebase.google.com/project/smallbizniz-site-and-proj-app/authentication/users
2. Create a user (or use existing user)
3. Go to Firestore Console
4. Find the user document in `users` collection
5. Set `role: "admin"` and `isActive: true`

**Option B: Via Registration + Approval**
1. Register a user via `/register`
2. Go to admin panel at `/admin`
3. Approve the registration
4. Change role to "admin" in user management

## 📋 Quick Setup Commands

```bash
# 1. Add S3 bucket name to .env.local
echo "S3_BUCKET_NAME=your-bucket-name" >> .env.local

# 2. Deploy Firestore rules
firebase deploy --only firestore:rules

# 3. Deploy Firestore indexes (if needed)
firebase deploy --only firestore:indexes

# 4. Restart dev server to load new env vars
npm run dev
```

## 🧪 Testing the Ticketing System

1. **Create a User Account:**
   - Visit: http://localhost:3000/register
   - Register a new user
   - Login at: http://localhost:3000/login

2. **Access Dashboard:**
   - After login, you'll be redirected to `/dashboard`
   - You should see "Create New Ticket" button

3. **Create a Ticket:**
   - Click "Create New Ticket"
   - Fill in title and description
   - Optionally upload a file (if S3 is configured)
   - Submit ticket

4. **Check Admin Panel:**
   - Login as admin user
   - Go to `/admin`
   - Navigate to "Tickets" section
   - You should see the created ticket

5. **Test Email Notifications:**
   - Check user email for ticket confirmation
   - Check admin email for new ticket notification

## ❌ What Won't Work Without Setup

- **File Uploads:** Without S3 bucket, users can't attach files to tickets
- **Email Notifications:** Already configured ✅
- **Ticket Creation:** Will work without S3 (just no attachments)
- **Admin Access:** Needs at least one admin user with `role: "admin"`

## 🐛 Troubleshooting

### "Firebase is not configured" Error
- Check `.env.local` has `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, `FIREBASE_PRIVATE_KEY`
- Restart dev server after adding credentials

### "S3 upload failed" Error
- Verify `S3_BUCKET_NAME` is set in `.env.local`
- Check AWS credentials have S3 permissions
- Verify CORS is configured on S3 bucket
- Check bucket name is correct

### "Firestore index required" Error
- Click the link in the error message to create index
- Or deploy indexes: `firebase deploy --only firestore:indexes`

### "Email not sending" Error
- Verify AWS SES credentials
- Check FROM_EMAIL is verified in AWS SES
- Check AWS SES is out of sandbox mode (or recipient is verified)

## Summary

**Minimum Required:**
1. ✅ Firebase Admin SDK (Already configured)
2. ✅ AWS SES (Already configured)
3. ⚠️ S3 Bucket (Need to add `S3_BUCKET_NAME`)
4. ⚠️ Firestore Database (Check if created)
5. ⚠️ Firestore Rules (Deploy with `firebase deploy --only firestore:rules`)

**Optional but Recommended:**
- Deploy Firestore indexes
- Set up admin user
- Verify email settings

Once you add `S3_BUCKET_NAME` and deploy Firestore rules, the ticketing system should be fully functional!

