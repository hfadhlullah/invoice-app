# Invoice App - Vercel + Firebase Setup Guide

This guide will help you deploy your React invoice application to Vercel with Firebase as the backend.

## 🔧 Prerequisites

1. **Node.js** (v16 or higher)
2. **Firebase account** - [Create one here](https://firebase.google.com/)
3. **Vercel account** - [Create one here](https://vercel.com/)
4. **Firebase CLI** - Install with `npm install -g firebase-tools`
5. **Vercel CLI** - Install with `npm install -g vercel`

## 🚀 Firebase Setup

### 1. Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project"
3. Follow the setup wizard
4. Enable Google Analytics (optional)

### 2. Enable Firestore Database

1. In your Firebase project, go to "Firestore Database"
2. Click "Create database"
3. Choose "Start in test mode" (for development)
4. Select a location for your database

### 3. Get Firebase Configuration

1. Go to Project Settings (gear icon)
2. Scroll down to "Your apps"
3. Click "Add app" and select "Web"
4. Register your app with a nickname
5. Copy the Firebase configuration object

### 4. Configure Environment Variables

1. Copy `.env.example` to `.env.local`
2. Fill in your Firebase configuration values:

\`\`\`env
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id_here
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id_here
VITE_FIREBASE_APP_ID=your_app_id_here
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id_here
\`\`\`

### 5. Deploy Firestore Rules and Indexes

\`\`\`bash
# Login to Firebase
firebase login

# Initialize Firebase in your project
firebase init

# Deploy Firestore rules and indexes
firebase deploy --only firestore
\`\`\`

## 🌐 Vercel Deployment

### 1. Deploy to Vercel

\`\`\`bash
# Build the project
npm run build

# Deploy to Vercel
vercel --prod
\`\`\`

### 2. Set Environment Variables in Vercel

1. Go to your Vercel dashboard
2. Select your project
3. Go to Settings → Environment Variables
4. Add all the VITE_ environment variables from your `.env.local` file

### 3. Redeploy (if needed)

If you added environment variables after the initial deployment:

\`\`\`bash
vercel --prod
\`\`\`

## 📝 Firestore Security Rules

The current rules allow all read/write operations. For production, consider implementing authentication:

\`\`\`javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /invoices/{document} {
      allow read, write: if request.auth != null;
    }
  }
}
\`\`\`

## 🔑 Adding Authentication (Optional)

To add user authentication:

1. Enable Authentication in Firebase Console
2. Choose your sign-in methods (Email/Password, Google, etc.)
3. Update Firestore rules to require authentication
4. Implement authentication in your React components

## 🛠 Development

\`\`\`bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
\`\`\`

## 📁 Project Structure

\`\`\`
src/
├── firebase/
│   ├── config.js          # Firebase configuration
│   └── invoiceService.js  # Firestore operations
├── hooks/
│   ├── useFirebaseInvoices.js  # Firebase React hook
│   └── useLocalStorage.js      # Local storage hook
├── components/
│   ├── InvoiceForm.jsx
│   ├── InvoiceList.jsx
│   └── InvoicePreview.jsx
└── utils/
    ├── dateFormatter.js
    ├── invoiceNumber.js
    └── validation.js
\`\`\`

## 🔧 Environment Variables

| Variable | Description |
|----------|-------------|
| \`VITE_FIREBASE_API_KEY\` | Firebase API key |
| \`VITE_FIREBASE_AUTH_DOMAIN\` | Firebase auth domain |
| \`VITE_FIREBASE_PROJECT_ID\` | Firebase project ID |
| \`VITE_FIREBASE_STORAGE_BUCKET\` | Firebase storage bucket |
| \`VITE_FIREBASE_MESSAGING_SENDER_ID\` | Firebase messaging sender ID |
| \`VITE_FIREBASE_APP_ID\` | Firebase app ID |
| \`VITE_FIREBASE_MEASUREMENT_ID\` | Firebase measurement ID (optional) |

## 🚨 Troubleshooting

### Build Errors
- Ensure all environment variables are set correctly
- Check that Firebase configuration is valid
- Verify that all dependencies are installed

### Deployment Issues
- Make sure environment variables are set in Vercel dashboard
- Check Vercel build logs for specific errors
- Ensure Firebase rules allow the necessary operations

### Firestore Permission Errors
- Check Firestore security rules
- Ensure your app is using the correct Firebase project
- Verify that Firestore is enabled in your Firebase project

## 📚 Resources

- [Vite Documentation](https://vitejs.dev/)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Vercel Documentation](https://vercel.com/docs)
- [React Documentation](https://react.dev/)

## 🎯 Next Steps

1. Set up Firebase project and get configuration
2. Update `.env.local` with your Firebase config
3. Test locally with \`npm run dev\`
4. Deploy to Vercel with \`vercel --prod\`
5. Set environment variables in Vercel dashboard
6. (Optional) Add authentication and update security rules

Your invoice app should now be live on Vercel with Firebase as the backend! 🎉