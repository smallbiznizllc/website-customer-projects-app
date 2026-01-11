# Ticketing System Quick Setup

## ✅ Already Configured
- AWS S3 Bucket Name
- AWS SES (Email)
- AWS Credentials
- Firebase Admin SDK

## 🚀 Quick Setup (2 steps)

### Step 1: Deploy Firestore Rules
```bash
firebase deploy --only firestore:rules
```

### Step 2: Deploy Firestore Indexes
```bash
firebase deploy --only firestore:indexes
```

### Step 3: Verify Firestore Database Exists
Visit: https://console.firebase.google.com/project/smallbizniz-site-and-proj-app/firestore

If database doesn't exist:
1. Click "Create database"
2. Choose "Start in production mode"
3. Select location (e.g., `us-central1`)
4. Click "Enable"

## ✅ That's it!

The ticketing system should now be fully functional:
- ✅ Users can create tickets
- ✅ Files can be uploaded to S3
- ✅ Email notifications will be sent
- ✅ Admins can view/manage tickets
- ✅ Public ticket status pages work

## 🧪 Test It

1. **Register/Login:** http://localhost:3000/login
2. **Create Ticket:** Go to Dashboard → "Create New Ticket"
3. **Check Admin:** Login as admin → `/admin` → Tickets section

## ❓ Need Admin User?

1. Register a user at `/register`
2. Go to Firestore Console → `users` collection
3. Find your user document
4. Add fields: `role: "admin"` and `isActive: true`

Or use the admin panel to approve registrations and change roles.

