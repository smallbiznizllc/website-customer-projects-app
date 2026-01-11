# How to Check Environment Variable Scope in Vercel

## Step-by-Step Instructions:

1. **Go to Vercel Dashboard:**
   - Visit: https://vercel.com/dashboard
   - Log in to your account

2. **Select Your Project:**
   - Click on your project name (website-customer-projects-app or similar)

3. **Navigate to Settings:**
   - Click on the **"Settings"** tab at the top of the project page

4. **Go to Environment Variables:**
   - In the left sidebar, click **"Environment Variables"**
   - Or scroll down to the "Environment Variables" section

5. **Check/Edit Each Variable:**
   - You'll see a list of all environment variables
   - Each variable has columns showing:
     - **Variable Name** (left column)
     - **Value** (masked with dots)
     - **Environments** (middle column) - **THIS IS THE SCOPE**
     - Actions (edit/delete buttons)

6. **Environment Scope Options:**
   The scope column shows checkboxes or tags for:
   - ☑ Production
   - ☑ Preview
   - ☑ Development
   
   **IMPORTANT:** For domain search to work in production, make sure your variables have **☑ Production** checked (or all three).

7. **To Edit/Update Scope:**
   - Click the **three dots (...) or "Edit"** button next to each variable
   - Select the environments you want the variable to apply to
   - Click **"Save"**

8. **After Making Changes:**
   - **MUST REDEPLOY** for changes to take effect
   - Go to "Deployments" tab
   - Click "..." on the latest deployment
   - Select "Redeploy"

## What to Look For:

For your GoDaddy variables, they should show:
- Variable: `GODADDY_API_KEY`
  - Environments: ✅ Production (at minimum)
- Variable: `GODADDY_API_SECRET`
  - Environments: ✅ Production (at minimum)
- Variable: `GODADDY_API_URL`
  - Environments: ✅ Production (at minimum)

If any variable doesn't have Production checked, that's why it's not working!
