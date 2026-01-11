# How to Add GoDaddy Environment Variables in Vercel

## Step-by-Step Instructions:

1. **Go to Vercel Dashboard:**
   - Visit: https://vercel.com/dashboard
   - Log in to your account

2. **Select Your Project:**
   - Click on your project name

3. **Navigate to Settings:**
   - Click on the **"Settings"** tab at the top

4. **Go to Environment Variables:**
   - In the left sidebar, click **"Environment Variables"**
   - Or scroll down to the "Environment Variables" section

5. **Add First Variable - GODADDY_API_KEY:**
   - Click the **"Add New"** button (or "+" button)
   - **Key/Name:** `GODADDY_API_KEY`
     - Must be EXACTLY this (all caps, underscore)
   - **Value:** Paste your GoDaddy API Key
     - Get this from: https://developer.godaddy.com/
     - It looks like: `9EXj4TnBKwF_MthiVxSkAtAMd5wrkxvF` (your actual key)
   - **Environment:** Check **☑ Production** (and optionally Preview/Development)
   - Click **"Save"**

6. **Add Second Variable - GODADDY_API_SECRET:**
   - Click **"Add New"** again
   - **Key/Name:** `GODADDY_API_SECRET`
     - Must be EXACTLY this
   - **Value:** Paste your GoDaddy API Secret
     - Get this from: https://developer.godaddy.com/
     - It looks like: `V3m7LHnYF2VywYxxpBb1BW` (your actual secret)
   - **Environment:** Check **☑ Production**
   - Click **"Save"**

7. **Add Third Variable - GODADDY_API_URL:**
   - Click **"Add New"** again
   - **Key/Name:** `GODADDY_API_URL`
   - **Value:** `https://api.godaddy.com`
     - This is the production API URL
   - **Environment:** Check **☑ Production**
   - Click **"Save"**

8. **Verify All Three Variables:**
   You should now see:
   - ✅ GODADDY_API_KEY
   - ✅ GODADDY_API_SECRET
   - ✅ GODADDY_API_URL

   Each should show "Production" (or "All Environments") in the Environments column.

9. **CRITICAL: Redeploy!**
   - Go to the **"Deployments"** tab
   - Find your latest deployment
   - Click the **three dots (...)** next to it
   - Select **"Redeploy"**
   - Wait for deployment to complete

## Important Notes:

- **Variable names are case-sensitive:** Must be exactly `GODADDY_API_KEY`, `GODADDY_API_SECRET`, `GODADDY_API_URL`
- **No spaces:** No spaces before or after the variable names
- **Production scope:** Make sure Production is checked for all three
- **Redeploy required:** Changes won't take effect until you redeploy

## Getting Your API Credentials:

If you don't have them saved:
1. Go to: https://developer.godaddy.com/
2. Log in with your GoDaddy reseller account
3. Go to "API Keys" section
4. Find your production API key
5. Copy the Key and Secret (you won't see the secret again, so save it!)
