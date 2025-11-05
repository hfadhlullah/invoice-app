#!/bin/bash

# Deployment script for Vercel + Firebase
echo "🚀 Starting deployment process..."

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo "❌ .env.local file not found. Please create it with your Firebase configuration."
    echo "You can copy .env.example to .env.local and fill in your Firebase config values."
    exit 1
fi

# Build the project
echo "📦 Building the project..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    echo "🌐 Project is ready for deployment to Vercel"
    echo ""
    echo "Next steps:"
    echo "1. Install Vercel CLI: npm i -g vercel"
    echo "2. Deploy: vercel --prod"
    echo "3. Set environment variables in Vercel dashboard"
else
    echo "❌ Build failed. Please check the errors above."
    exit 1
fi