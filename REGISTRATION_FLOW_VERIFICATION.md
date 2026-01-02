# Registration Flow & Firestore Permissions Verification

## ✅ Firestore Security Rules

The `registrationRequests` collection has the following rules configured:

```javascript
match /registrationRequests/{requestId} {
  allow read: if request.auth != null && 
                get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
  // Write operations are handled server-side only via Admin SDK
  allow write: if false; // No client-side writes allowed
}
```

### Why This Works:

1. **Server-Side Writes (Admin SDK)**: 
   - The Firebase Admin SDK **bypasses all security rules**
   - Server actions can write to `registrationRequests` collection without restrictions
   - This is secure because server-side code is trusted

2. **Client-Side Reads (Admin Only)**:
   - Only authenticated admin users can read registration requests
   - Used by the admin panel to display pending registrations
   - Prevents unauthorized access to registration data

3. **Client-Side Writes (Disabled)**:
   - No client-side writes allowed
   - All registration submissions go through server actions (Admin SDK)
   - Prevents tampering with registration data

## ✅ Registration Status Flow

### 1. User Registration (`submitRegistrationRequest`)
- **Status**: `'pending'`
- **Firestore Write**: ✅ Allowed (Admin SDK bypasses rules)
- **Email Sent**: ✅ Yes - Email sent to all active admin users
- **Fields Stored**:
  - `email`
  - `encryptedPassword` (encrypted with AES-256-CBC)
  - `displayName`
  - `status: 'pending'`
  - `createdAt`

### 2. Admin Approval (`approveRegistration`)
- **Status**: `'pending'` → `'approved'`
- **Firestore Update**: ✅ Allowed (Admin SDK bypasses rules)
- **Firebase Auth**: ✅ User account created
- **Firestore Users**: ✅ User document created with role 'client'
- **Custom Claims**: ✅ Role set to 'client'
- **Fields Updated**:
  - `status: 'approved'`
  - `approvedAt`
  - `userId` (Firebase Auth UID)

### 3. Admin Rejection (`rejectRegistration`)
- **Status**: `'pending'` → `'rejected'`
- **Firestore Update**: ✅ Allowed (Admin SDK bypasses rules)
- **Fields Updated**:
  - `status: 'rejected'`
  - `rejectedAt`

## ✅ Email Sending

### Registration Request Notification Email
- **Triggered**: When `submitRegistrationRequest` completes successfully
- **Recipients**: All active admin users (from `users` collection where `role == 'admin'` and `isActive == true`)
- **Email Service**: AWS SES
- **Link**: Points to `/admin/registrations` (admin panel)
- **Subject**: `🔔 New Registration Request: {email}`

### Email Configuration Required
```bash
# AWS SES (Required for sending emails)
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...
AWS_REGION=...
FROM_EMAIL=service@smallbizniz.com
```

## ✅ Status Values

The registration request status field uses these values:
- `'pending'`: Initial status when user registers
- `'approved'`: Status after admin approves (user account created)
- `'rejected'`: Status after admin rejects

## ✅ Permissions Summary

| Operation | Permission | Method |
|-----------|-----------|--------|
| Create registration request | ✅ Allowed | Server-side (Admin SDK) |
| Read registration requests (admins) | ✅ Allowed | Client-side (Firestore rules) |
| Read registration requests (non-admins) | ❌ Denied | Client-side (Firestore rules) |
| Update status to 'approved' | ✅ Allowed | Server-side (Admin SDK) |
| Update status to 'rejected' | ✅ Allowed | Server-side (Admin SDK) |
| Write from client | ❌ Denied | Client-side (Firestore rules) |

## ✅ Testing Checklist

To verify the registration flow works correctly:

1. **Registration**:
   - [ ] User can submit registration at `/register`
   - [ ] Registration request stored in Firestore with status `'pending'`
   - [ ] Admin receives email notification

2. **Admin Panel**:
   - [ ] Admin can view pending registrations at `/admin/registrations`
   - [ ] Admin can see all registration details

3. **Approval**:
   - [ ] Admin can approve registration
   - [ ] Status updates to `'approved'` in Firestore
   - [ ] Firebase Auth user created
   - [ ] User document created in `users` collection
   - [ ] User can now login

4. **Rejection**:
   - [ ] Admin can reject registration
   - [ ] Status updates to `'rejected'` in Firestore
   - [ ] No user account created

## 🔍 Troubleshooting

### Issue: "Firebase is not configured"
**Solution**: Add Firebase Admin SDK credentials to `.env.local`:
- `FIREBASE_PROJECT_ID`
- `FIREBASE_CLIENT_EMAIL`
- `FIREBASE_PRIVATE_KEY`

### Issue: Emails not sending
**Solution**: Verify AWS SES credentials in `.env.local`:
- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`
- `AWS_REGION`
- `FROM_EMAIL` (must be verified in AWS SES)

### Issue: Admin can't see registration requests
**Solution**: 
- Verify user has `role: 'admin'` in Firestore `users` collection
- Verify user has `isActive: true` in Firestore `users` collection
- Check Firestore rules are deployed

### Issue: Registration fails with permission error
**Solution**: 
- This shouldn't happen with Admin SDK (it bypasses rules)
- Check Firebase Admin SDK credentials are correct
- Check server console for initialization errors

