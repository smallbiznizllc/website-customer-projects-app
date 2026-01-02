# AWS Access Keys Guide for SES

## Important: SES Uses IAM Credentials

AWS SES does **not** have separate access keys. It uses the same AWS IAM credentials (Access Key ID and Secret Access Key) that you use for all AWS services like S3, EC2, etc.

If you already have AWS credentials set up for S3, you can use the **same credentials** for SES. You just need to ensure your IAM user/role has SES permissions.

---

## Option 1: Use Existing AWS Credentials (Recommended)

If you already have AWS credentials in your `.env.local` for S3:
- ✅ Use the same `AWS_ACCESS_KEY_ID`
- ✅ Use the same `AWS_SECRET_ACCESS_KEY`
- ✅ Use the same `AWS_REGION` (or change to match SES region)
- ⚠️ Just make sure the IAM user has SES permissions (see below)

---

## Option 2: Create New IAM User with SES Permissions

If you need to create new credentials or want a dedicated user for SES:

### Step 1: Create IAM User

1. Go to AWS Console: https://console.aws.amazon.com/iam
2. Click **Users** in the left sidebar
3. Click **Create user**
4. Enter a username (e.g., `ses-email-user`)
5. Click **Next**

### Step 2: Attach SES Permissions

1. Click **Attach policies directly**
2. Search for **AmazonSESFullAccess** or create a custom policy with:
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
3. Select the policy and click **Next**
4. Click **Create user**

### Step 3: Create Access Keys

1. Click on the user you just created
2. Click the **Security credentials** tab
3. Scroll down to **Access keys**
4. Click **Create access key**
5. Select **Application running outside AWS** (or appropriate use case)
6. Click **Next**
7. Optionally add a description
8. Click **Create access key**
9. **IMPORTANT**: Copy both values:
   - **Access key ID** → This is your `AWS_ACCESS_KEY_ID`
   - **Secret access key** → This is your `AWS_SECRET_ACCESS_KEY`
   - ⚠️ You can only see the secret key once! Save it immediately.

### Step 4: Add to .env.local

Add the credentials to your `.env.local` file:

```bash
AWS_ACCESS_KEY_ID=AKIAIOSFODNN7EXAMPLE
AWS_SECRET_ACCESS_KEY=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
AWS_REGION=us-east-1
FROM_EMAIL=your-email@example.com
```

---

## Option 3: Use Existing IAM User (Add SES Permissions)

If you want to add SES permissions to your existing IAM user (the one you're using for S3):

1. Go to AWS Console: https://console.aws.amazon.com/iam
2. Click **Users** → Find your existing user
3. Click on the user
4. Click **Add permissions** → **Attach policies directly**
5. Search for **AmazonSESFullAccess** or create a custom policy
6. Select the policy → **Add permissions**

Your existing credentials will now work for SES too!

---

## Quick Reference: Where to Find/Create Access Keys

### To Find Existing Access Keys:
1. AWS Console → IAM → Users
2. Click on your user
3. Security credentials tab
4. Access keys section

### To Create New Access Keys:
1. AWS Console → IAM → Users
2. Create user (or select existing user)
3. Security credentials tab
4. Create access key
5. Copy both values (you can only see secret key once!)

### To Add SES Permissions:
1. AWS Console → IAM → Users
2. Select user
3. Add permissions → Attach policies
4. Search for "SES" → Select `AmazonSESFullAccess`
5. Add permissions

---

## Important Notes

1. **Same Credentials**: AWS SES uses the same IAM credentials as S3, EC2, etc.
2. **Permissions Matter**: Your IAM user needs `ses:SendEmail` permission
3. **Region-Specific**: SES is region-specific - verify email in same region as `AWS_REGION`
4. **Security**: Never commit `.env.local` to git - it contains sensitive credentials
5. **Secret Key**: You can only view the secret access key once when creating it - save it immediately!

---

## Verification Checklist

After setting up credentials:

- [ ] IAM user has SES permissions (`ses:SendEmail`)
- [ ] Access keys are added to `.env.local`
- [ ] `AWS_REGION` is set (must match SES region)
- [ ] `FROM_EMAIL` is verified in SES console
- [ ] SendGrid/Mailgun keys are commented out (if using SES only)
- [ ] Dev server is restarted (to load new env vars)

---

## Test Your Setup

1. Verify credentials work:
   ```bash
   # If you have AWS CLI installed
   aws sts get-caller-identity
   ```

2. Test SES email sending:
   - Go to: `http://localhost:3000/admin/test-email`
   - Enter a verified email address
   - Send test email

