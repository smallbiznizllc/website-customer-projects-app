# Setup Checklist

## ✅ Completed
- [x] Project structure created
- [x] Dependencies installed
- [x] Firebase Web App credentials configured
- [x] Development server running
- [x] Landing page accessible

## 🔴 Critical - Required for Full Functionality

### 1. Firebase Admin SDK (Service Account) - **REQUIRED**
**Why:** Needed for server-side operations (creating tickets, user management, etc.)

**Steps:**
1. Go to: https://console.firebase.google.com/u/1/project/smallbizniz-site-and-proj-app/settings/serviceaccounts/adminsdk
2. Click "Generate new private key"
3. Download the JSON file
4. Open the JSON file and copy:
   - `client_email` → Update `FIREBASE_CLIENT_EMAIL` in `.env.local`
   - `private_key` → Update `FIREBASE_PRIVATE_KEY` in `.env.local` (keep the quotes and newlines)
5. Restart dev server

**Current Status:** ⚠️ Not configured (using placeholders)

---

### 2. Enable Firebase Authentication - **REQUIRED**
**Why:** Users need to be able to login

**Steps:**
1. Go to: https://console.firebase.google.com/u/1/project/smallbizniz-site-and-proj-app/authentication
2. Click "Get started" (if not already enabled)
3. Go to "Sign-in method" tab
4. Enable "Email/Password" provider
5. Click "Save"

**Current Status:** ❓ Unknown (check Firebase Console)

---

### 3. Create Firestore Database - **REQUIRED**
**Why:** Database for storing tickets, users, content, etc.

**Steps:**
1. Go to: https://console.firebase.google.com/u/1/project/smallbizniz-site-and-proj-app/firestore
2. Click "Create database"
3. Choose "Start in test mode" (we'll deploy rules after)
4. Select a location (e.g., `us-central1` or closest to you)
5. Click "Enable"

**Current Status:** ❓ Unknown (check Firebase Console)

---

### 4. Deploy Firestore Security Rules - **RECOMMENDED**
**Why:** Secures your database and enforces access control

**Steps:**
1. Make sure you're logged in: `firebase login`
2. Deploy rules: `firebase deploy --only firestore:rules`

**Current Status:** ⚠️ Rules file ready, but not deployed

---

## 🟡 Important - For Specific Features

### 5. AWS S3 Setup - **For File Uploads**
**Why:** Needed for ticket attachments (files up to 2MB)

**Steps:**
1. Create AWS account (if you don't have one)
2. Create S3 bucket
3. Configure CORS on the bucket
4. Create IAM user with S3 permissions
5. Get Access Key ID and Secret Access Key
6. Update `.env.local` with AWS credentials

**Current Status:** ⚠️ Not configured (file uploads won't work)

---

### 6. Email Service Setup - **For Notifications**
**Why:** Sends email notifications when tickets are created/updated

**Options:**
- **SendGrid:** https://sendgrid.com (free tier: 100 emails/day)
- **Mailgun:** https://mailgun.com (free tier: 5,000 emails/month)

**Steps:**
1. Sign up for email service
2. Get API key
3. Update `.env.local` with email credentials

**Current Status:** ⚠️ Not configured (emails won't send)

---

## 🟢 Optional - Nice to Have

### 7. Create First Admin User
**Why:** Need an admin account to access admin panel

**Options:**
- Use Firebase Console to create user manually
- Use the admin panel's "Create User" feature (once admin SDK is configured)
- Create via Firebase CLI

---

## Quick Test Checklist

After completing critical items, test:
- [ ] Landing page loads: http://localhost:3000
- [ ] Can access login page: http://localhost:3000/login
- [ ] Can create a user account (via Firebase Console or app)
- [ ] Can login
- [ ] Can access dashboard
- [ ] Can create a ticket (if S3 is configured)
- [ ] Admin can login and see admin panel

---

## Priority Order

1. **Firebase Admin SDK** (Service Account) - Do this first!
2. **Enable Authentication** - Quick, do this now
3. **Create Firestore Database** - Quick, do this now
4. **Deploy Firestore Rules** - Important for security
5. **AWS S3** - When you need file uploads
6. **Email Service** - When you need notifications



