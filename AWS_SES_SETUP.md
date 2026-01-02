# AWS SES Setup Guide

## Common Error: "The provided authorization grant is invalid, expired, or revoked"

This error typically indicates an AWS authentication or configuration issue.

### Quick Checklist

1. **Verify AWS Credentials**
   - Check that `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY` in `.env.local` are correct
   - Ensure credentials haven't expired (if using temporary credentials)
   - Verify credentials match your AWS account

2. **Verify AWS Region**
   - Check that `AWS_REGION` matches the region where you verified your email in SES
   - Common regions: `us-east-1`, `us-west-2`, `eu-west-1`
   - SES is region-specific - verify email in the same region you're sending from

3. **Verify FROM_EMAIL in SES**
   - Go to AWS Console: https://console.aws.amazon.com/ses
   - Navigate to: **Verified identities**
   - Ensure your `FROM_EMAIL` is listed and verified
   - If not verified: Click "Create identity" → "Email address" → Enter email → Verify

4. **Check IAM Permissions**
   - Your AWS IAM user/role needs `ses:SendEmail` and `ses:SendRawEmail` permissions
   - Minimum IAM policy:
     ```json
     {
       "Version": "2012-10-17",
       "Statement": [
         {
           "Effect": "Allow",
           "Action": [
             "ses:SendEmail",
             "ses:SendRawEmail"
           ],
           "Resource": "*"
         }
       ]
     }
     ```

5. **SES Sandbox Mode**
   - New SES accounts start in "sandbox mode"
   - In sandbox mode, you can only send to verified email addresses
   - To send to any email: Request production access in SES console
   - Sandbox mode is per-region

## Step-by-Step Setup

### 1. Verify Email Address in SES

1. Go to AWS Console → SES → **Verified identities**
2. Click **Create identity**
3. Choose **Email address**
4. Enter your email address (the one in `FROM_EMAIL`)
5. Click **Create identity**
6. Check your email inbox for verification link
7. Click the verification link

### 2. Request Production Access (Optional but Recommended)

If you want to send to any email address (not just verified ones):

1. Go to AWS Console → SES → **Account dashboard**
2. Click **Request production access**
3. Fill out the request form
4. Wait for approval (usually 24 hours)

### 3. Verify IAM Permissions

1. Go to AWS Console → IAM → **Users** (or **Roles** if using roles)
2. Find your user/role (the one with the access keys you're using)
3. Click on it → **Permissions** tab
4. Ensure it has `ses:SendEmail` permission (either via attached policy or inline policy)

### 4. Check Region Consistency

- The `AWS_REGION` in `.env.local` must match the region where you verified your email
- Example: If you verified email in `us-east-1`, set `AWS_REGION=us-east-1`

### 5. Test Configuration

1. Go to: `http://localhost:3000/admin/test-email`
2. Enter a verified email address (in sandbox mode) or any email (in production mode)
3. Click "Send Test Email"
4. Check server logs for detailed error messages

## Troubleshooting

### Error: "InvalidClientTokenId"
- **Cause**: Invalid `AWS_ACCESS_KEY_ID`
- **Fix**: Check that your access key ID is correct in `.env.local`

### Error: "SignatureDoesNotMatch"
- **Cause**: Invalid `AWS_SECRET_ACCESS_KEY`
- **Fix**: Check that your secret access key is correct in `.env.local`

### Error: "MessageRejected" or "Email address not verified"
- **Cause**: `FROM_EMAIL` is not verified in SES
- **Fix**: Verify the email address in SES console (same region as `AWS_REGION`)

### Error: "AccessDenied"
- **Cause**: IAM user/role doesn't have SES send permissions
- **Fix**: Add `ses:SendEmail` permission to your IAM user/role

### Error: "The provided authorization grant is invalid, expired, or revoked"
- **Cause**: Usually indicates invalid credentials, wrong region, or unverified email
- **Fix**: 
  1. Verify credentials are correct
  2. Ensure region matches where email is verified
  3. Verify FROM_EMAIL in SES console
  4. Check IAM permissions

## Environment Variables Required

```bash
# AWS Credentials (already set for S3)
AWS_ACCESS_KEY_ID=your_access_key_id
AWS_SECRET_ACCESS_KEY=your_secret_access_key
AWS_REGION=us-east-1  # Must match SES region where email is verified

# Email Configuration
FROM_EMAIL=your-verified-email@example.com  # Must be verified in SES
```

## Quick Verification Commands

If you have AWS CLI installed, you can test your credentials:

```bash
# Test AWS credentials
aws sts get-caller-identity

# List verified identities in SES
aws sesv2 list-email-identities --region us-east-1

# Send a test email (if FROM_EMAIL is verified)
aws ses send-email \
  --from your-verified-email@example.com \
  --to recipient@example.com \
  --subject "Test" \
  --text "Test message" \
  --region us-east-1
```

## Still Having Issues?

1. **Check server logs** - Detailed error information is logged to console
2. **Verify credentials work** - Use AWS CLI to test credentials separately
3. **Check SES console** - Verify email status and region
4. **Check IAM console** - Verify permissions are attached
5. **Try a different region** - If issues persist, try `us-east-1` (most common)

