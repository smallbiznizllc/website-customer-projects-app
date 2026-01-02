# SmallBizNiz LLC - Customer Projects App

A full-stack web application built with Next.js, Firebase, AWS S3, and TypeScript.

## Features

- **Public Landing Page** with dynamic content management
- **Client Dashboard** with ticket creation and management
- **Admin Panel** with comprehensive management tools
- **Ticketing System** with file uploads to AWS S3
- **Email Notifications** for ticket updates
- **Public Ticket Status Pages** with secure links
- **SEO Management** with dynamic meta tags
- **Calendar/Scheduling** with blackout dates

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React, TypeScript, Tailwind CSS
- **Backend**: Next.js Server Actions, Firebase Admin SDK
- **Authentication**: Firebase Authentication
- **Database**: Firebase Firestore
- **Storage**: AWS S3
- **Email**: SendGrid or Mailgun

## Getting Started

### Prerequisites

- Node.js 18+ 
- Firebase project
- AWS account with S3 bucket
- Email service account (SendGrid or Mailgun)

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Copy `.env.local.example` to `.env.local` and fill in your credentials:
   ```bash
   cp .env.local.example .env.local
   ```

4. Configure your environment variables:
   - Firebase credentials
   - AWS S3 credentials
   - Email service credentials

5. Run the development server:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## Environment Variables

See `.env.local.example` for all required environment variables.

## Firebase Setup

1. Create a Firebase project
2. Enable Authentication (Email/Password)
3. Create a Firestore database
4. Deploy Firestore rules:
   ```bash
   firebase deploy --only firestore:rules
   ```

## AWS S3 Setup

1. Create an S3 bucket
2. Configure CORS:
   ```json
   [
     {
       "AllowedHeaders": ["*"],
       "AllowedMethods": ["GET", "PUT"],
       "AllowedOrigins": ["*"],
       "ExposeHeaders": []
     }
   ]
   ```
3. Set up IAM user with S3 permissions

## Deployment

### Vercel

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Firebase Hosting (Alternative)

```bash
npm run build
firebase deploy
```

## Project Structure

```
├── src/
│   ├── app/              # Next.js app router pages
│   ├── components/       # React components
│   ├── lib/              # Utilities and configurations
│   └── hooks/            # Custom React hooks
├── public/               # Static assets
└── functions/            # Firebase Cloud Functions (optional)
```

## License

MIT



