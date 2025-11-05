#!/bin/bash

echo "🔧 Adding Environment Variables to Vercel"
echo "========================================"
echo ""
echo "IMPORTANT: You need to add these environment variables to your Vercel project:"
echo ""
echo "1. Go to: https://vercel.com/dashboard"
echo "2. Select your 'invoice-app' project"
echo "3. Go to Settings → Environment Variables"
echo "4. Add each variable below:"
echo ""

# Read and display environment variables
echo "Environment Variables to Add:"
echo "----------------------------"
cat .env.local | grep "^VITE_" | while read line; do
    echo "$line"
done

echo ""
echo "5. For each variable:"
echo "   - Name: [Variable name before =]"
echo "   - Value: [Variable value after =]"
echo "   - Environment: Select 'Production, Preview, and Development'"
echo "   - Click 'Save'"
echo ""
echo "6. After adding all variables, redeploy:"
echo "   vercel --prod"
echo ""

# Also create a .vercel script to add them programmatically
echo "Alternative: Use Vercel CLI to add variables:"
echo "--------------------------------------------"
echo ""
echo "Run these commands one by one:"
echo ""

cat .env.local | grep "^VITE_" | while read line; do
    var_name=$(echo "$line" | cut -d'=' -f1)
    var_value=$(echo "$line" | cut -d'=' -f2-)
    echo "vercel env add $var_name"
    echo "  When prompted, enter: $var_value"
    echo "  Select: Production, Preview, Development"
    echo ""
done