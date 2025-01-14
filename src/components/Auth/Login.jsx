import { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { useNavigate, Link } from 'react-router-dom'
import { FaEnvelope, FaLock, FaGamepad, FaGithub } from 'react-icons/fa'
import logger from '../../utils/logger';

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login, loginWithGithub, sendPasswordResetEmail } = useAuth()
  const Navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setError('')
      setLoading(true)
      await login(email, password)
      Navigate('/')
    } catch (error) {
      let errorMessage = 'Failed to sign in'
      
      // Gestione errori specifici di login
      switch(error.code) {
        case 'auth/invalid-email':
          errorMessage = 'Invalid email format. Please check your email address.'
          break
        case 'auth/user-not-found':
          errorMessage = 'No account found with this email. Please sign up.'
          break
        case 'auth/wrong-password':
        case 'auth/invalid-credential':
          errorMessage = 'Invalid email or password. Please try again.'
          break
        case 'auth/too-many-requests':
          errorMessage = 'Too many login attempts. Please try again later.'
          break
        default:
          errorMessage += `: ${error.message}`
      }
      
      setError(errorMessage)
      logger.error('Login error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handlePasswordReset = async () => {
    if (!email) {
      setError('Please enter your email address first')
      return
    }
    try {
      setLoading(true)
      await sendPasswordResetEmail(email)
      setError('Password reset email sent. Check your inbox.')
    } catch (error) {
      setError('Failed to send password reset email: ' + error.message)
      logger.error('Password reset error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleGithubLogin = async () => {
    // Verifica connessione online
    if (!navigator.onLine) {
      setError('No internet connection. Please check your network.')
      return
    }

    try {
      setError('')
      setLoading(true)
      // Timeout per il login GitHub
      // eslint-disable-next-line no-unused-vars
      const loginResult = await Promise.race([
        loginWithGithub(),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Login timeout. Please try again.')), 10000)
        )
      ]);
      
      Navigate('/')
    } catch (error) {
      let errorMessage = 'Failed to sign in with GitHub'
      
      // Gestione errori specifici
      switch(error.code) {
        case 'auth/popup-blocked':
          errorMessage = 'Popup blocked. Please allow popups for this site.'
          break
        case 'auth/popup-closed-by-user':
          errorMessage = 'Login was cancelled.'
          break
        case 'auth/network-request-failed':
          errorMessage = 'Network error. Please check your connection.'
          break
        default:
          errorMessage += `: ${error.message}`
      }
      
      setError(errorMessage)
      logger.error('GitHub Login Error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full space-y-8">
        {/* Logo and Title */}
        <div className="text-center">
          <div className="flex justify-center">
            <FaGamepad className="text-5xl text-purple-500 animate-bounce" />
          </div>
          <h2 className="mt-6 text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Welcome Back
          </h2>
          <p className="mt-2 text-sm text-gray-400">
            Sign in to continue your gaming journey
          </p>
        </div>

        {/* Error/Success Alert */}
        {error && (
          <div className={`
            ${error.includes('sent') || error.includes('success') 
              ? 'bg-green-500/10 border-green-500/50 text-green-400' 
              : 'bg-red-500/10 border-red-500/50 text-red-400'} 
            border p-4 rounded-xl text-sm text-center
          `}>
            {error}
          </div>
        )}

        {/* Social Login Buttons - only GitHub */}
        <div className="space-y-3">
          <button
            onClick={handleGithubLogin}
            disabled={loading}
            className="w-full flex items-center justify-center px-4 py-3 border border-gray-700 rounded-xl font-medium text-white bg-gray-800 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors duration-200"
          >
            <FaGithub className="w-5 h-5 mr-2" />
            Continue with GitHub
          </button>
        </div>

        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-700"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-gray-900 text-gray-400">Or continue with</span>
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaEnvelope className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-700 rounded-xl bg-gray-800 focus:ring-2 focus:ring-purple-500 focus:border-transparent placeholder-gray-400 transition-colors duration-200"
                  placeholder="name@example.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-700 rounded-xl bg-gray-800 focus:ring-2 focus:ring-purple-500 focus:border-transparent placeholder-gray-400 transition-colors duration-200"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>
          </div>

          {/* Password Reset Link */}
          <div className="flex justify-end">
            <button
              type="button"
              onClick={handlePasswordReset}
              disabled={loading}
              className="text-sm text-purple-400 hover:text-purple-300 transition-colors duration-200"
            >
              Forgot password?
            </button>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3 px-4 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors duration-200"
            >
              {loading ? (
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                'Sign In'
              )}
            </button>
          </div>
        </form>

        {/* Sign Up Link */}
        <p className="text-center text-sm text-gray-400">
          Don&apos;t have an account?{' '}
          <Link
            to="/signup"
            className="font-medium text-purple-400 hover:text-purple-300 transition-colors duration-200"
          >
            Sign up for free
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Login