import { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { useNavigate, Link } from 'react-router-dom'
import { FaEnvelope, FaLock, FaUser, FaGamepad, FaGithub } from 'react-icons/fa'

const Signup = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [username, setUsername] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const {signup, loginWithGithub } = useAuth()
  const Navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (password !== confirmPassword) {
      return setError('Passwords do not match')
    }

    try {
      setError('')
      setLoading(true)
      const result = await signup(email, password, username)
      console.log('Signup result:', result) // Debug log
      if (result && result.user) {
        Navigate('/', { replace: true })
      }
    } catch (error) {
      setError('Failed to create an account: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

   const handleGithubSignup = async () => {
     try {
       setError('')
       setLoading(true)
       const result = await loginWithGithub()
       console.log('GitHub signup result:', result) // Debug log

         Navigate('/')
         
     } catch (error) {
       console.error('GitHub signup error:', error) // Debug log
       setError('Failed to sign up with GitHub: ' + error.message)
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
            <div className="relative">
              <FaGamepad className="text-5xl text-purple-500 animate-bounce" />
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-pink-500 rounded-full animate-pulse" />
            </div>
          </div>
          <h2 className="mt-6 text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Create Your Account
          </h2>
          <p className="mt-2 text-sm text-gray-400">
            Join our gaming community today
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-4 rounded-xl text-sm text-center animate-shake">
            {error}
          </div>
        )}

        {/* Social Signup Buttons - only GitHub */}
        <div className="space-y-3">
          <button
            onClick={handleGithubSignup}
            disabled={loading}
            className="w-full flex items-center justify-center px-4 py-3 border border-gray-700 rounded-xl font-medium text-white bg-gray-800 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors duration-200"
          >
            <FaGithub className="w-5 h-5 mr-2" />
            Sign up with GitHub
          </button>
        </div>

        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-700"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-gray-900 text-gray-400">Or sign up with email</span>
          </div>
        </div>

        {/* Signup Form */}
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaUser className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-700 rounded-xl bg-gray-800 focus:ring-2 focus:ring-purple-500 focus:border-transparent placeholder-gray-400 transition-colors duration-200"
                  placeholder="Choose a username"
                  required
                />
              </div>
            </div>

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
                  placeholder="Create a password"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-700 rounded-xl bg-gray-800 focus:ring-2 focus:ring-purple-500 focus:border-transparent placeholder-gray-400 transition-colors duration-200"
                  placeholder="Confirm your password"
                  required
                />
              </div>
            </div>
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
                'Create Account'
              )}
            </button>
          </div>
        </form>

        {/* Login Link */}
        <p className="text-center text-sm text-gray-400">
          Already have an account?{' '}
          <Link
            to="/login"
            className="font-medium text-purple-400 hover:text-purple-300 transition-colors duration-200"
          >
            Sign in here
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Signup 