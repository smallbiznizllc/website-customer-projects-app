#!/bin/bash

echo "=========================================="
echo "Firebase Admin SDK Setup Helper"
echo "=========================================="
echo ""
echo "This script will help you add Firebase Admin SDK credentials to .env.local"
echo ""
echo "First, download the service account JSON file from:"
echo "https://console.firebase.google.com/u/1/project/smallbizniz-site-and-proj-app/settings/serviceaccounts/adminsdk"
echo ""

read -p "Enter the path to the downloaded JSON file (or press Enter to enter manually): " JSON_PATH

if [ -n "$JSON_PATH" ] && [ -f "$JSON_PATH" ]; then
    echo ""
    echo "Reading credentials from JSON file..."
    
    CLIENT_EMAIL=$(grep -o '"client_email": "[^"]*"' "$JSON_PATH" | cut -d'"' -f4)
    PRIVATE_KEY=$(grep -o '"private_key": "[^"]*"' "$JSON_PATH" | cut -d'"' -f4)
    
    # For private key, we need to get the full multi-line value
    # This is a bit more complex, so let's use a different approach
    PRIVATE_KEY=$(python3 -c "
import json
import sys
with open('$JSON_PATH', 'r') as f:
    data = json.load(f)
    print(data['private_key'])
" 2>/dev/null)
    
    if [ -z "$CLIENT_EMAIL" ] || [ -z "$PRIVATE_KEY" ]; then
        echo "❌ Error: Could not extract credentials from JSON file"
        echo "Please enter them manually:"
        read -p "FIREBASE_CLIENT_EMAIL: " CLIENT_EMAIL
        echo "FIREBASE_PRIVATE_KEY (paste the full key):"
        read -d '|' PRIVATE_KEY
    else
        echo "✅ Successfully extracted credentials"
    fi
else
    echo ""
    echo "Enter credentials manually:"
    read -p "FIREBASE_CLIENT_EMAIL: " CLIENT_EMAIL
    echo ""
    echo "FIREBASE_PRIVATE_KEY (paste the entire key including BEGIN/END lines):"
    read -d '|' PRIVATE_KEY
fi

# Update .env.local
if [ -f .env.local ]; then
    # Backup original
    cp .env.local .env.local.backup
    
    # Update the values
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        sed -i '' "s|FIREBASE_CLIENT_EMAIL=.*|FIREBASE_CLIENT_EMAIL=$CLIENT_EMAIL|" .env.local
        sed -i '' "s|FIREBASE_PRIVATE_KEY=.*|FIREBASE_PRIVATE_KEY=\"$PRIVATE_KEY\"|" .env.local
    else
        # Linux
        sed -i "s|FIREBASE_CLIENT_EMAIL=.*|FIREBASE_CLIENT_EMAIL=$CLIENT_EMAIL|" .env.local
        sed -i "s|FIREBASE_PRIVATE_KEY=.*|FIREBASE_PRIVATE_KEY=\"$PRIVATE_KEY\"|" .env.local
    fi
    
    echo ""
    echo "✅ Updated .env.local with Admin SDK credentials"
    echo ""
    echo "Updated values:"
    echo "FIREBASE_CLIENT_EMAIL=$CLIENT_EMAIL"
    echo "FIREBASE_PRIVATE_KEY=*** (hidden)"
    echo ""
    echo "⚠️  Don't forget to restart your dev server!"
    echo "   Stop it (Ctrl+C) and run: npm run dev"
else
    echo "❌ Error: .env.local file not found"
    echo "Please create it first or run the full setup script"
fi



