import { useState, useEffect } from 'react';
import { AuthService } from '../firebase/authService';
import { z } from 'zod';

// Define schema for validation
const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
});

// Map Firebase error codes to user-friendly messages
const firebaseErrorMessages = {
  'auth/invalid-credential': 'The credentials you entered are invalid. Please try again.',
  'auth/user-not-found': 'No account found with this email. Please check your email or sign up.',
  'auth/wrong-password': 'Incorrect password. Please try again.',
  'auth/too-many-requests': 'Too many failed attempts. Please wait a moment and try again.',
};

export default function LoginPage({ onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    // Validate input using Zod
    const validationResult = loginSchema.safeParse({ email, password });
    if (!validationResult.success) {
      const firstError = validationResult.error.errors[0];
      setError(firstError.message);

      // Focus the email field if the error is related to email
      if (firstError.path.includes('email')) {
        document.getElementById('email').focus();
      }
      return;
    }

    setLoading(true);
    const result = await AuthService.login(email, password);
    setLoading(false);

    if (result.success) {
      // Set session expiration for 1 day
      const expirationTime = new Date();
      expirationTime.setDate(expirationTime.getDate() + 1);
      localStorage.setItem('sessionExpiration', expirationTime.toISOString());

      if (onLoginSuccess) {
        onLoginSuccess(result.user);
      }
    } else {
      // Use friendly error messages
      const friendlyMessage = firebaseErrorMessages[result.error] || 'Login failed. Please check your credentials.';
      setError(friendlyMessage);
    }
  };

  // Check session expiration on component mount
  useEffect(() => {
    const sessionExpiration = localStorage.getItem('sessionExpiration');
    if (sessionExpiration && new Date() > new Date(sessionExpiration)) {
      // Reset session if expired
      localStorage.removeItem('sessionExpiration');
      AuthService.logout();
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center">
            <text  fontFamily="Arial, sans-serif" fontSize="24" fontWeight="bold" fill="#714B67">
              Inv-Generator
            </text>
          </div>
          {/* <nav className="hidden md:flex items-center space-x-8">
            <a href="#" className="text-gray-700 hover:text-purple-700 font-medium transition-colors">Apps</a>
            <a href="#" className="text-gray-700 hover:text-purple-700 font-medium transition-colors">Industries</a>
            <a href="#" className="text-gray-700 hover:text-purple-700 font-medium transition-colors">Community</a>
            <a href="#" className="text-gray-700 hover:text-purple-700 font-medium transition-colors">Pricing</a>
            <a href="#" className="text-gray-700 hover:text-purple-700 font-medium transition-colors">Help</a>
          </nav> */}
          {/* <div className="flex items-center space-x-4">
            <a href="#" className="text-purple-700 hover:text-purple-800 font-semibold transition-colors">Sign in</a>
            <a href="#" className="bg-purple-700 hover:bg-purple-800 text-white px-6 py-2 rounded-lg font-semibold transition-colors">Try it free</a>
          </div> */}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          {/* Login Card */}
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
            {/* Logo */}
            {/* <div className="pt-8 pb-6 text-center">
              <svg className="w-32 h-10 mx-auto" viewBox="0 0 120 40" fill="none">
                <text x="10" y="28" fontFamily="Arial, sans-serif" fontSize="24" fontWeight="bold" fill="#714B67">
                  Inv-Generator
                </text>
              </svg>
            </div> */}

            {/* Info Box */}
            {/* <div className="mx-6 mb-6 bg-cyan-50 border border-cyan-200 rounded-lg p-4">
              <p className="text-sm text-cyan-800 text-center">
                Access and manage your documents and databases from Inv-Generator.com.
              </p>
            </div> */}

            {/* Form */}
            <form onSubmit={handleLogin} className="px-6 pb-8 mt-8">
              {/* Error Message */}
              {error && (
                <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-sm text-red-800 text-center">{error}</p>
                </div>
              )}

              {/* Email Field */}
              <div className="mb-4">
                <label htmlFor="email" className="block text-sm text-left font-medium text-gray-700 mb-2">
                  Email
                  {error && error.includes('email') && (
                    <span className="block text-xs text-red-500 mt-1">{error}</span>
                  )}
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent outline-none transition-all text-base"
                  autoComplete="email"
                />
              </div>

              {/* Password Field */}
              <div className="mb-6">
                <label htmlFor="password" className="block text-sm text-left font-medium text-gray-700 mb-2">
                  Password
                  {error && error.includes('Password') && (
                    <span className="block text-xs text-red-500 mt-1">{error}</span>
                  )}
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent outline-none transition-all text-base"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-white bg-slate-600 hover:bg-slate-700 rounded transition-colors"
                  >
                    {showPassword ? (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-slate-700 hover:bg-slate-800 disabled:bg-slate-400 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg uppercase tracking-wide flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Signing in...
                  </>
                ) : (
                  'Sign in'
                )}
              </button>

              {/* Sign up link */}
              {/* <div className="mt-4 text-center">
                <a href="#" className="text-sm text-cyan-600 hover:text-cyan-700 font-medium transition-colors">
                  Don't have an account?
                </a>
              </div> */}
            </form>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12 px-6">
        <div className="max-w-7xl mx-auto">
          

          <div className="text-center">
            <a href="#" className="text-sm text-gray-400 hover:text-white transition-colors">
              Made by razorables
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
