# Firebase Authentication Setup

---

## ⭐ EASIEST METHOD - Using the App Itself

1. **In the login page, set the admin credentials directly:**
   ```javascript
   // For development, set admin credentials directly
   const adminEmail = 'admin@mail.com';
   const adminPassword = '123123';
   ```

2. **Save and run the dev server:**
   ```bash
   npm run dev
   ```

3. **Navigate to the login page**

4. **Enter the admin credentials:**
   - Email: `admin@mail.com`
   - Password: `123123`

5. **Click **Sign In****

6. **If successful, you'll be redirected to the invoice app**

7. **Remove or comment out the admin credentials code for security:**
   - Remove the adminEmail and adminPassword lines
   - Ensure no debug or development code remains

8. **Done! You can now login with admin@mail.com / 123123**

---

## Alternative Method 1 - Firebase Console (Manual)

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project
3. Click **Authentication** in the left sidebar
4. Click the **Users** tab
5. Click **Add user** button
6. Enter:
   - Email: `admin@mail.com`
   - Password: `123123`
7. Click **Add user**

---

## Alternative Method 2 - Enable Email/Password Sign-in

First, ensure the Email/Password provider is enabled:

1. Go to Firebase Console > Authentication
2. Click "Sign-in method" tab
3. Enable "Email/Password" provider
4. Save changes

---

## Verification

After creating the user, test the login:

1. Run your development server:
   ```bash
   npm run dev
   ```

2. Navigate to `http://localhost:5173`

3. You should see the login page

4. Enter:
   - Email: `admin@mail.com`
   - Password: `123123`

5. Click **Sign In**

6. If successful, you'll be redirected to the invoice app

---

## Troubleshooting

### "Email/Password provider is disabled"
1. Go to Firebase Console → Authentication → Sign-in method
2. Enable **Email/Password** provider
3. Save changes

### "Too many requests from this device"
Wait a few minutes or use Firebase Console method instead.

### "Cannot find module 'firebase/auth'"
Run: `npm install firebase`

---

## Security Note

⚠️ The password `123123` is for development only. For production:
1. Use a strong password
2. Enable MFA (Multi-Factor Authentication)
3. Implement password reset functionality
4. Add email verification

