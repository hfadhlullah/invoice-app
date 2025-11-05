#!/bin/bash

echo "🔥 Firebase + Vercel Setup for Invoice App"
echo "=========================================="
echo ""

# Check if Firebase is configured
if [ ! -f .env.local ]; then
    echo "⚠️  Setting up environment configuration..."
    cp .env.example .env.local
    echo "✅ Created .env.local from .env.example"
    echo "🔧 Please edit .env.local with your Firebase configuration values"
    echo ""
fi

# Check if node_modules exists
if [ ! -d node_modules ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Build the project to test
echo "🏗️  Testing build..."
npm run build

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Setup completed successfully!"
    echo ""
    echo "📋 Next Steps:"
    echo "1. Edit .env.local with your Firebase configuration"
    echo "2. Create a Firebase project at https://console.firebase.google.com/"
    echo "3. Enable Firestore Database in your Firebase project"
    echo "4. Run 'firebase login' to authenticate"
    echo "5. Run 'firebase init' to initialize Firebase"
    echo "6. Deploy with 'vercel --prod'"
    echo ""
    echo "📚 See DEPLOYMENT.md for detailed instructions"
else
    echo "❌ Build failed. Please check the errors above."
fi