# App Status Check

## Admin Users

**Target Admin Email:** service@smallbizniz.com

To check who the current admin users are:

### Option 1: Via Admin Panel (Recommended)
1. Login to the app: http://localhost:3000/login
2. Navigate to: http://localhost:3000/admin/users
3. Look for users with role = "admin" and isActive = true

### Option 2: Via Firebase Console
1. Go to: https://console.firebase.google.com/project/YOUR_PROJECT_ID/firestore
2. Open the `users` collection
3. Filter or search for documents where:
   - `role` = "admin"
   - `isActive` = true
4. The `email` field shows the admin email address(es)

### Option 3: Via Code (for developers)
The app uses this query to find admin users:
```typescript
// From src/app/actions/tickets.ts and src/app/actions/registration.ts
const snapshot = await db.collection('users')
  .where('role', '==', 'admin')
  .where('isActive', '==', true)
  .get()
```

**Note:** If no admin users exist, email notifications will not be sent to anyone. You need at least one active admin user for emails to work.

**To Set Up Admin User:** See `ADMIN_SETUP.md` for instructions. Quick setup:
```bash
npx tsx scripts/setup-admin.ts
```

---

## Email Configuration Status

Based on your `.env.local` file:

✅ **Email Service Configured:** YES
- `SENDGRID_API_KEY`: ✅ Set
- `MAILGUN_API_KEY`: ✅ Set  
- `MAILGUN_DOMAIN`: ✅ Set
- `FROM_EMAIL`: ✅ Set

### Email Readiness by Feature:

#### 1. New Ticket Creation ✅ READY
- **Function:** `sendAdminNotificationEmail()` in `src/lib/email/sendEmail.ts`
- **Recipients:** All active admin users (fetched automatically)
- **Trigger:** When a ticket is created via `createTicket()` in `src/app/actions/tickets.ts`
- **Status:** ✅ Ready (requires at least 1 active admin user)

#### 2. Ticket Updates ✅ READY
- **Function:** `sendTicketEmail()` in `src/lib/email/sendEmail.ts`
- **Recipients:** The ticket owner (user who created the ticket)
- **Trigger:** When ticket status is updated via `updateTicketStatus()` in `src/app/actions/tickets.ts`
- **Status:** ✅ Ready

#### 3. New User Registration ✅ READY
- **Function:** `sendRegistrationApprovalEmail()` in `src/lib/email/sendEmail.ts`
- **Recipients:** All active admin users (fetched automatically)
- **Trigger:** When a registration request is submitted via `submitRegistrationRequest()` in `src/app/actions/registration.ts`
- **Status:** ✅ Ready (requires at least 1 active admin user)

---

## Requirements Checklist

### For Emails to Work:

- [x] Email service API keys configured (SendGrid or Mailgun)
- [x] FROM_EMAIL configured
- [ ] **At least 1 active admin user in Firestore** ⚠️ **CHECK THIS**
  - Collection: `users`
  - Fields: `role` = "admin", `isActive` = true
  - Must have an `email` field

### Current Status:

✅ **Email Service:** Configured and ready
⚠️ **Admin Users:** Unknown - need to verify in database
✅ **Email Functions:** All implemented and ready

---

## Testing Email Functionality

### Test New Ticket Email:
1. Create a ticket as a logged-in user
2. Check admin email inboxes
3. Check server logs for email sending confirmation

### Test Registration Email:
1. Go to `/register` and submit a registration request
2. Check admin email inboxes
3. Check server logs for email sending confirmation

### Test Ticket Update Email:
1. Update a ticket status (as admin)
2. Check the ticket owner's email inbox
3. Check server logs for email sending confirmation

---

## Troubleshooting

### If emails aren't sending:

1. **Check server logs** for errors
   - Look for "Error sending admin emails" or similar messages
   - Check if SendGrid/Mailgun API errors are logged

2. **Verify admin users exist:**
   - Use Option 1 or 2 above to check for admin users
   - Ensure at least one user has `role: "admin"` and `isActive: true`

3. **Verify email service credentials:**
   - Check `.env.local` has correct API keys
   - For SendGrid: Verify API key has "Mail Send" permissions
   - For Mailgun: Verify domain is verified in Mailgun dashboard

4. **Check FROM_EMAIL:**
   - For SendGrid: FROM_EMAIL must be a verified sender
   - For Mailgun: FROM_EMAIL must match verified domain or be verified

5. **Development mode:**
   - In development, emails may log to console instead of sending
   - Check console output for "Email would be sent" messages

