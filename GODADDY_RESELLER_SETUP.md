# GoDaddy Reseller API Setup Guide

## Step 1: Get GoDaddy Reseller API Credentials

1. **Log in to GoDaddy Reseller Portal:**
   - Visit: https://reseller.godaddy.com/
   - Log in with your reseller account

2. **Navigate to API Settings:**
   - Go to: Settings → API
   - Or visit: https://developer.godaddy.com/

3. **Create API Credentials:**
   - Click "Create API Key"
   - Give it a name (e.g., "Website Domain Search")
   - Copy the **API Key** and **API Secret**
   - **Important:** Save these securely - you won't be able to see the secret again

## Step 2: Choose API Environment

GoDaddy has two environments:

**OTE (Test/Sandbox):**
- URL: `https://api.ote-godaddy.com`
- Use for testing
- Won't charge real money

**Production:**
- URL: `https://api.godaddy.com`
- Use for live/production
- Real transactions

## Step 3: Add Environment Variables

Add these to your `.env.local` and Vercel:

### For Local Development (.env.local):
```bash
GODADDY_API_KEY=your_api_key_here
GODADDY_API_SECRET=your_api_secret_here
GODADDY_API_URL=https://api.ote-godaddy.com  # Use production URL for live site
```

### For Vercel:
1. Go to: Vercel Dashboard → Settings → Environment Variables
2. Add:
   - `GODADDY_API_KEY` = your API key
   - `GODADDY_API_SECRET` = your API secret
   - `GODADDY_API_URL` = `https://api.godaddy.com` (for production) or `https://api.ote-godaddy.com` (for testing)

## Step 4: Test the Integration

1. Visit your site
2. Scroll to "Find The Perfect Domain" section
3. Enter a domain name (e.g., `test123xyz.com`)
4. Click "Search Domain"
5. You should see availability status and pricing

## API Endpoints Used

- **Domain Availability:** `GET /v1/domains/available?domain={domain}`
- **Authentication:** SSO Key format: `sso-key {apiKey}:{apiSecret}`

## Pricing Information

The API returns pricing in micro-units (divide by 1,000,000 to get USD):
- Example: `15000000` = $15.00

## Troubleshooting

**401 Unauthorized:**
- Check API key and secret are correct
- Verify you're using the correct API URL (OTE vs Production)
- Make sure your reseller account has API access enabled

**403 Forbidden:**
- Your reseller account may not have API permissions
- Contact GoDaddy support to enable API access

**Rate Limits:**
- GoDaddy API has rate limits
- Implement caching if you expect high traffic
- Check GoDaddy documentation for current rate limits

## Documentation

- GoDaddy Reseller API: https://developer.godaddy.com/doc
- Domain Availability API: https://developer.godaddy.com/doc/endpoint/domains#/v1/available

