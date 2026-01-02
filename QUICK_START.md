# Quick Start Guide

## ✅ Setup Complete!

Your app is now fully configured and ready to use!

## 🚀 What You Can Do Now

### 1. View the Landing Page
- **URL:** http://localhost:3000
- Dynamic content managed via Admin Panel

### 2. Create Your First User

**Option A: Via Firebase Console (Recommended for first admin)**
1. Go to: https://console.firebase.google.com/u/1/project/smallbizniz-site-and-proj-app/authentication/users
2. Click "Add user"
3. Enter email and password
4. **Important:** After creating, you need to set the user's role to "admin" in Firestore:
   - Go to Firestore: https://console.firebase.google.com/u/1/project/smallbizniz-site-and-proj-app/firestore
   - Create a collection called `users`
   - Create a document with the user's UID (from Authentication)
   - Add fields:
     - `email`: user's email
     - `role`: "admin"
     - `isActive`: true
     - `createdAt`: current timestamp

**Option B: Via Admin Panel (After first admin is created)**
- Login as admin
- Go to Admin Panel > Users
- Click "Create User"
- Set role to "admin" or "client"

### 3. Test the App

1. **Login:** http://localhost:3000/login
2. **Client Dashboard:** http://localhost:3000/dashboard
   - Create tickets
   - View your tickets
   - Upload attachments (requires AWS S3 setup)
3. **Admin Panel:** http://localhost:3000/admin
   - Manage tickets
   - Manage users
   - Configure SEO
   - Manage landing page content
   - Set calendar/blackout dates

## 📝 Next Steps (Optional)

### For File Uploads (Ticket Attachments)
- Set up AWS S3 bucket
- Configure CORS
- Add credentials to `.env.local`

### For Email Notifications
- Sign up for SendGrid or Mailgun
- Add API key to `.env.local`

## 🎯 Quick Test Checklist

- [ ] Landing page loads
- [ ] Can access login page
- [ ] Can create user (via Firebase Console)
- [ ] Can login
- [ ] Can access dashboard
- [ ] Can create ticket (if S3 configured)
- [ ] Admin can access admin panel

## 🔗 Useful Links

- **Firebase Console:** https://console.firebase.google.com/u/1/project/smallbizniz-site-and-proj-app/overview
- **Authentication Users:** https://console.firebase.google.com/u/1/project/smallbizniz-site-and-proj-app/authentication/users
- **Firestore Database:** https://console.firebase.google.com/u/1/project/smallbizniz-site-and-proj-app/firestore
- **Local App:** http://localhost:3000



