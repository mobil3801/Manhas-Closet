import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const { resetPassword, loading, error } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await resetPassword(email)
      setSent(true)
      toast.success('Password reset email sent! Check your inbox.')
    } catch (error) {
      console.error('Password reset failed:', error)
      toast.error('Failed to send reset email')
    }
  }

  if (sent) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900">Check your email</h2>
          <p className="mt-2 text-sm text-gray-600">
            We've sent a password reset link to {email}
          </p>
        </div>
        
        <div className="text-center">
          <Link to="/login" className="text-indigo-600 hover:text-indigo-500">
            Back to sign in
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-center text-3xl font-extrabold text-gray-900">
          Reset your password
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Enter your email address and we'll send you a link to reset your password.
        </p>
      </div>

      <form className="space-y-6" onSubmit={handleSubmit}>
        {error && (
          <div className="rounded-md bg-red-50 p-4">
            <div className="text-sm text-red-700">{error}</div>
          </div>
        )}

        <div>
          <label htmlFor="email" className="sr-only">
            Email address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
            placeholder="Email address"
          />
        </div>

        <div>
          <button
            type="submit"
            disabled={loading}
            className="group relative flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {loading ? 'Sending...' : 'Send reset email'}
          </button>
        </div>

        <div className="text-center">
          <Link to="/login" className="text-sm text-indigo-600 hover:text-indigo-500">
            Back to sign in
          </Link>
        </div>
      </form>
    </div>
  )
}

export default ForgotPasswordPage