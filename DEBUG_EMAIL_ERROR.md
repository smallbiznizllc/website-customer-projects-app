# Debugging Email Error: "The provided authorization grant is invalid, expired, or revoked"

## Problem

This error message is **NOT** a typical AWS SES error. This error format suggests it's coming from SendGrid or Mailgun, not AWS SES.

## Email Service Priority

The app checks email services in this order:
1. **SendGrid** (if `SENDGRID_API_KEY` is set) ← **Checked FIRST**
2. **Mailgun** (if `MAILGUN_API_KEY` + `MAILGUN_DOMAIN` are set) ← **Checked SECOND**
3. **AWS SES** (only if above are NOT set) ← **Checked LAST**

## Solution

### Step 1: Check Which Service is Being Used

I've added logging to help identify which service is being used. 

**Check your server console** (the terminal where `npm run dev` is running) when you try to send an email. You should see one of:
- `📧 Using SendGrid for email sending`
- `📧 Using Mailgun for email sending`
- `📧 Using AWS SES for email sending`

### Step 2: Remove/Comment Out Other Services

If you see "Using SendGrid" or "Using Mailgun", that's the problem! The app is using those services instead of AWS SES.

**To fix:** Open `.env.local` and comment out or remove:

```bash
# Comment out SendGrid
# SENDGRID_API_KEY=your_key_here

# Comment out Mailgun
# MAILGUN_API_KEY=your_key_here
# MAILGUN_DOMAIN=your_domain_here
```

### Step 3: Restart Dev Server

After commenting out SendGrid/Mailgun keys:
1. Stop dev server (Ctrl+C)
2. Restart: `npm run dev`
3. Test again

### Step 4: Verify AWS SES is Being Used

After restarting, when you test an email:
- Server console should show: `📧 Using AWS SES for email sending`
- If you see this, AWS SES is now being used

## Why This Error Occurs

The error "The provided authorization grant is invalid, expired, or revoked" is:
- ✅ A typical **SendGrid** error (OAuth/API key issue)
- ✅ A typical **Mailgun** error (API key issue)
- ❌ **NOT** a typical AWS SES error

AWS SES errors typically look like:
- `InvalidClientTokenId`
- `SignatureDoesNotMatch`
- `MessageRejected`
- `AccessDenied`
- `Email address not verified`

## Quick Checklist

- [ ] Check server console for "Using [Service] for email sending" message
- [ ] If SendGrid/Mailgun: Comment out those keys in `.env.local`
- [ ] Restart dev server
- [ ] Verify console shows "Using AWS SES for email sending"
- [ ] Test email again

## Still Not Working?

If you're sure AWS SES is being used (console shows "Using AWS SES") and you still get errors:

1. **Check AWS credentials:**
   - `AWS_ACCESS_KEY_ID` is correct
   - `AWS_SECRET_ACCESS_KEY` is correct
   - `AWS_REGION` matches where email is verified

2. **Check email verification:**
   - `FROM_EMAIL` is verified in SES console
   - Verified in the same region as `AWS_REGION`

3. **Check IAM permissions:**
   - IAM user has `ses:SendEmail` permission
   - Policy attached: `AmazonSESFullAccess`

4. **Check server console logs:**
   - Look for "AWS SES error:" messages
   - These will show the actual AWS error code and message

