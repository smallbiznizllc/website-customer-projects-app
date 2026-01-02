#!/bin/bash

echo "=========================================="
echo "Firebase Configuration Setup"
echo "=========================================="
echo ""
echo "This script will help you set up your .env.local file with Firebase credentials."
echo ""
echo "You'll need:"
echo "1. Firebase Web App config (from Firebase Console > Project Settings > General)"
echo "2. Service Account JSON file (from Firebase Console > Project Settings > Service Accounts)"
echo ""
read -p "Press Enter to continue..."

# Check if .env.local exists
if [ -f .env.local ]; then
    echo ""
    echo "⚠️  .env.local already exists. This will update it."
    read -p "Continue? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

echo ""
echo "=========================================="
echo "Step 1: Firebase Web App Configuration"
echo "=========================================="
echo ""
echo "Go to: https://console.firebase.google.com/u/1/project/smallbizniz-site-and-proj-app/settings/general"
echo "Find your web app config and enter the values below:"
echo ""

read -p "NEXT_PUBLIC_FIREBASE_API_KEY: " API_KEY
read -p "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: " AUTH_DOMAIN
read -p "NEXT_PUBLIC_FIREBASE_PROJECT_ID: " PROJECT_ID
read -p "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: " STORAGE_BUCKET
read -p "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: " MESSAGING_SENDER_ID
read -p "NEXT_PUBLIC_FIREBASE_APP_ID: " APP_ID

echo ""
echo "=========================================="
echo "Step 2: Service Account (Admin SDK)"
echo "=========================================="
echo ""
echo "Go to: https://console.firebase.google.com/u/1/project/smallbizniz-site-and-proj-app/settings/serviceaccounts/adminsdk"
echo "Download the JSON file and enter the path below, or enter values manually:"
echo ""

read -p "Path to service account JSON file (or press Enter to enter manually): " JSON_PATH

if [ -n "$JSON_PATH" ] && [ -f "$JSON_PATH" ]; then
    echo "Reading from JSON file..."
    FIREBASE_PROJECT_ID=$(cat "$JSON_PATH" | grep -o '"project_id": "[^"]*"' | cut -d'"' -f4)
    FIREBASE_CLIENT_EMAIL=$(cat "$JSON_PATH" | grep -o '"client_email": "[^"]*"' | cut -d'"' -f4)
    FIREBASE_PRIVATE_KEY=$(cat "$JSON_PATH" | grep -o '"private_key": "[^"]*"' | cut -d'"' -f4)
else
    read -p "FIREBASE_PROJECT_ID: " FIREBASE_PROJECT_ID
    read -p "FIREBASE_CLIENT_EMAIL: " FIREBASE_CLIENT_EMAIL
    echo "FIREBASE_PRIVATE_KEY (paste the full key, it will be on multiple lines):"
    read -d '|' FIREBASE_PRIVATE_KEY
fi

echo ""
echo "=========================================="
echo "Step 3: AWS S3 (Optional for now)"
echo "=========================================="
echo ""
read -p "AWS_REGION (default: us-east-1): " AWS_REGION
AWS_REGION=${AWS_REGION:-us-east-1}
read -p "AWS_ACCESS_KEY_ID (or press Enter to skip): " AWS_ACCESS_KEY_ID
read -p "AWS_SECRET_ACCESS_KEY (or press Enter to skip): " AWS_SECRET_ACCESS_KEY
read -p "S3_BUCKET_NAME (or press Enter to skip): " S3_BUCKET_NAME

echo ""
echo "=========================================="
echo "Step 4: Email Service (Optional for now)"
echo "=========================================="
echo ""
read -p "SENDGRID_API_KEY (or press Enter to skip): " SENDGRID_API_KEY
read -p "MAILGUN_API_KEY (or press Enter to skip): " MAILGUN_API_KEY
read -p "MAILGUN_DOMAIN (or press Enter to skip): " MAILGUN_DOMAIN
read -p "FROM_EMAIL (default: noreply@example.com): " FROM_EMAIL
FROM_EMAIL=${FROM_EMAIL:-noreply@example.com}

# Create .env.local file
cat > .env.local << EOF
# Firebase Web App Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=$API_KEY
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=$AUTH_DOMAIN
NEXT_PUBLIC_FIREBASE_PROJECT_ID=$PROJECT_ID
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=$STORAGE_BUCKET
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=$MESSAGING_SENDER_ID
NEXT_PUBLIC_FIREBASE_APP_ID=$APP_ID

# Firebase Admin SDK (Service Account)
FIREBASE_PROJECT_ID=$FIREBASE_PROJECT_ID
FIREBASE_CLIENT_EMAIL=$FIREBASE_CLIENT_EMAIL
FIREBASE_PRIVATE_KEY="$FIREBASE_PRIVATE_KEY"

# AWS S3
AWS_REGION=$AWS_REGION
AWS_ACCESS_KEY_ID=$AWS_ACCESS_KEY_ID
AWS_SECRET_ACCESS_KEY=$AWS_SECRET_ACCESS_KEY
S3_BUCKET_NAME=$S3_BUCKET_NAME

# Email Service
SENDGRID_API_KEY=$SENDGRID_API_KEY
MAILGUN_API_KEY=$MAILGUN_API_KEY
MAILGUN_DOMAIN=$MAILGUN_DOMAIN
FROM_EMAIL=$FROM_EMAIL

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
EOF

echo ""
echo "✅ .env.local file created successfully!"
echo ""
echo "Next steps:"
echo "1. Make sure Authentication is enabled in Firebase Console"
echo "2. Make sure Firestore Database is created"
echo "3. Restart your dev server: npm run dev"
echo ""



