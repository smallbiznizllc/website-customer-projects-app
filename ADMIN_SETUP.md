# Admin User Setup

## Target Admin User
- **Email:** service@smallbizniz.com
- **Role:** admin
- **Status:** active

---

## Option 1: Using the Setup Script (Recommended)

I've created a script to automatically set up the admin user.

### Steps:

1. **Set a temporary password** (optional, script has a default):
   ```bash
   export ADMIN_PASSWORD="YourSecurePassword123!"
   ```
   Or edit the script to change the default password.

2. **Run the setup script:**
   ```bash
   # Using tsx (recommended - install if needed: npm install -D tsx)
   npx tsx scripts/setup-admin.ts
   
   # OR using ts-node
   npx ts-node --esm scripts/setup-admin.ts
   ```

3. **The script will:**
   - Create the user in Firebase Auth if they don't exist
   - Create/update the user in Firestore with admin role
   - Set custom claims for admin access
   - Handle existing users (update role if needed)

4. **Login:**
   - Go to: http://localhost:3000/login
   - Email: service@smallbizniz.com
   - Password: (the password you set)
   - **⚠️ Change password after first login!**

---

## Option 2: Via Admin Panel (If you have admin access)

If you already have admin access to the app:

1. Login at: http://localhost:3000/login
2. Go to: http://localhost:3000/admin/users
3. Click "Create User" or find the user if they exist
4. Set:
   - Email: service@smallbizniz.com
   - Role: admin
   - Active: true
   - Password: (set a secure password)

---

## Option 3: Via Firebase Console (Manual)

### Step 1: Create User in Firebase Authentication

1. Go to: https://console.firebase.google.com
2. Select your project
3. Go to: Authentication → Users
4. Click "Add user"
5. Enter:
   - Email: service@smallbizniz.com
   - Password: (set a secure password)
6. Click "Add user"
7. Copy the User UID (you'll need this)

### Step 2: Create User Document in Firestore

1. Go to: Firestore Database
2. Open the `users` collection
3. Click "Add document"
4. Set Document ID to the User UID (from Step 1)
5. Add fields:
   - `email`: service@smallbizniz.com (string)
   - `role`: admin (string)
   - `isActive`: true (boolean)
   - `displayName`: Admin User (string, optional)
   - `createdAt`: (timestamp - current time)
6. Save

### Step 3: Set Custom Claims (Optional but Recommended)

For better security, you can set custom claims. This requires Firebase CLI or Admin SDK.

Using Firebase CLI:
```bash
firebase auth:users:set service@smallbizniz.com --custom-claims '{"role":"admin"}'
```

---

## Option 4: Using the Registration System

1. Go to: http://localhost:3000/register
2. Register with email: service@smallbizniz.com
3. After registration, manually update the user in Firestore:
   - Go to Firebase Console → Firestore
   - Find the user in `users` collection
   - Update `role` to "admin"
   - Set `isActive` to true

---

## Verification

After setup, verify the admin user exists:

1. **Via Admin Panel:**
   - Login as admin
   - Go to /admin/users
   - Verify service@smallbizniz.com is listed with role = admin

2. **Via Firebase Console:**
   - Firestore → users collection
   - Find user with email = service@smallbizniz.com
   - Verify: role = "admin", isActive = true

3. **Test Login:**
   - Go to: http://localhost:3000/login
   - Login with service@smallbizniz.com
   - Should redirect to /admin dashboard

---

## Troubleshooting

### "User already exists"
- If user exists in Firebase Auth but not Firestore: The script will handle this
- If user exists in Firestore but not admin: The script will update the role

### "Firebase Admin SDK not configured"
- Make sure `.env.local` has:
  - `FIREBASE_PROJECT_ID`
  - `FIREBASE_CLIENT_EMAIL`
  - `FIREBASE_PRIVATE_KEY`
- Restart the dev server after updating `.env.local`

### "Permission denied"
- Make sure Firebase Admin SDK is properly configured
- Check that the service account has proper permissions in Firebase

---

## Next Steps

After setting up the admin user:

1. ✅ Login and change the password
2. ✅ Verify you can access /admin dashboard
3. ✅ Check that emails are being sent to service@smallbizniz.com
4. ✅ Test ticket creation (should send email to admin)
5. ✅ Test registration requests (should send email to admin)

