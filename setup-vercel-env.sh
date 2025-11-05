#!/bin/bash

echo "🔧 Setting up Vercel Environment Variables"
echo "=========================================="
echo ""
echo "Your app is deployed at: https://invoice-46vjlqwqg-huseins-projects-d74186ad.vercel.app"
echo ""
echo "To complete the setup, add these environment variables in your Vercel dashboard:"
echo ""
echo "1. Go to: https://vercel.com/dashboard"
echo "2. Select your 'invoice-app' project"
echo "3. Go to Settings → Environment Variables"
echo "4. Add the following variables (from your .env.local file):"
echo ""

# Read environment variables from .env.local
if [ -f .env.local ]; then
    echo "Copy these environment variables to Vercel:"
    echo "----------------------------------------"
    grep "^VITE_" .env.local | while read line; do
        echo "$line"
    done
else
    echo "❌ .env.local file not found"
fi

echo ""
echo "5. Set Environment to: 'Production, Preview, and Development'"
echo "6. Click 'Save'"
echo "7. Redeploy your app by running: vercel --prod"
echo ""
echo "✅ After adding environment variables, your Firebase integration will be complete!"