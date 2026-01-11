# Contact Form EmailJS Setup Guide

## Quick Setup (5 minutes)

1. **Sign up for EmailJS** (Free tier: 200 emails/month)
   - Go to https://www.emailjs.com/
   - Sign up for a free account
   - Verify your email

2. **Create an Email Service**
   - Go to Email Services → Add New Service
   - Choose "Gmail" or "Outlook" (or any email provider)
   - Connect your email account (service@smallbizniz.com)
   - Note your **Service ID** (e.g., `service_abc123`)

3. **Create an Email Template**
   - Go to Email Templates → Create New Template
   - Template ID will be auto-generated (e.g., `template_xyz789`)
   - Set up the template with these variables:
     ```
     From: {{from_name}} <{{from_email}}>
     To: service@smallbizniz.com
     Subject: Contact Form: {{subject}}
     
     Message from {{from_name}} ({{from_email}}):
     
     {{message}}
     ```
   - Save the template and note your **Template ID**

4. **Get your Public Key**
   - Go to Account → API Keys
   - Copy your **Public Key** (e.g., `abcdefghijklmnop`)

5. **Update the HTML file**
   - Open `public/creative-landing.html`
   - Find these three lines and replace with your values:
     ```javascript
     emailjs.init('YOUR_PUBLIC_KEY');  // Replace with your Public Key
     'YOUR_SERVICE_ID',                // Replace with your Service ID
     'YOUR_TEMPLATE_ID',               // Replace with your Template ID
     ```

6. **Deploy**
   ```bash
   firebase deploy --only hosting
   ```

That's it! The contact form will now send emails directly to service@smallbizniz.com.

---

## Alternative: Firebase Cloud Functions (More Complex)

If you prefer to use your existing AWS SES setup with Cloud Functions, I can help you set that up. It's more secure but requires Firebase Functions setup.

