# Custom Domain Setup for smallbizniz.com

## Step 1: Add Domain in Vercel

1. Go to **Vercel Dashboard** → Your Project → **Settings** → **Domains**
2. Click **"Add"** or **"Add Domain"**
3. Enter: `smallbizniz.com`
4. Click **"Add"**

Vercel will show you the DNS records you need to configure.

## Step 2: Configure DNS Records

You'll need to add these DNS records to your domain registrar (where you bought smallbizniz.com):

### For Root Domain (smallbizniz.com):
- **Type:** `A` record
- **Name:** `@` or blank (or `smallbizniz.com`)
- **Value:** Vercel will provide an IP address (e.g., `76.76.21.21`)
- **TTL:** 3600 (or default)

### For www subdomain (www.smallbizniz.com):
- **Type:** `CNAME` record
- **Name:** `www`
- **Value:** `cname.vercel-dns.com` (Vercel will provide exact value)
- **TTL:** 3600 (or default)

**Important:** Vercel will show you the exact values to use. They may look different from the examples above.

## Step 3: Update Environment Variables

After DNS is configured and the domain is verified:

1. Go to **Vercel Dashboard** → Your Project → **Settings** → **Environment Variables**
2. Find `NEXT_PUBLIC_APP_URL`
3. Update it to: `https://smallbizniz.com`
4. Click **"Save"**

## Step 4: Redeploy

After updating the environment variable:
1. Go to **Deployments** tab
2. Click the **"..."** menu on the latest deployment
3. Click **"Redeploy"**

Or make a small change and push to GitHub (Vercel will auto-deploy).

## Step 5: Verify

Wait for DNS propagation (can take a few minutes to 48 hours):
1. Visit: `https://smallbizniz.com`
2. Visit: `https://www.smallbizniz.com`
3. Both should work and show your site

## Common DNS Providers:

**If using:**
- **GoDaddy**: DNS Management → Add Record
- **Namecheap**: Advanced DNS → Add New Record
- **Cloudflare**: DNS → Add Record
- **Google Domains**: DNS → Custom Records

## Troubleshooting:

**Domain not working?**
- Wait 24-48 hours for DNS propagation
- Check DNS records match exactly what Vercel shows
- Use https://dnschecker.org to verify DNS propagation globally

**SSL Certificate Issues?**
- Vercel automatically provisions SSL certificates
- May take a few minutes after domain verification
- Check Vercel Dashboard → Domains for certificate status

**Redirect www to root (or vice versa)?**
- Vercel handles this automatically
- Both www and root domain will work

