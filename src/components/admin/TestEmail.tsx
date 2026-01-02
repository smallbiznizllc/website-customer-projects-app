'use client'

import { useState } from 'react'
import { sendTestEmail } from '@/app/actions/test-email'
import { Mail, Send, CheckCircle, XCircle } from 'lucide-react'

export default function TestEmail() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null)

  const handleSendTest = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email || !email.includes('@')) {
      setResult({
        success: false,
        message: 'Please enter a valid email address',
      })
      return
    }

    setLoading(true)
    setResult(null)

    try {
      const response = await sendTestEmail(email)
      setResult(response)
    } catch (error: any) {
      setResult({
        success: false,
        message: error.message || 'An unexpected error occurred',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <div className="flex items-center gap-3 mb-4">
        <Mail className="w-6 h-6 text-primary" />
        <h2 className="text-xl font-semibold">Send Test Email</h2>
      </div>
      
      <p className="text-gray-600 dark:text-gray-400 mb-6">
        Send a test email to verify that your email service (SendGrid/Mailgun) is configured correctly.
      </p>

      <form onSubmit={handleSendTest} className="space-y-4">
        <div>
          <label htmlFor="test-email" className="block text-sm font-medium mb-2">
            Email Address
          </label>
          <input
            id="test-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your-email@example.com"
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            disabled={loading}
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              Sending...
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              Send Test Email
            </>
          )}
        </button>
      </form>

      {result && (
        <div
          className={`mt-4 p-4 rounded-lg flex items-start gap-3 ${
            result.success
              ? 'bg-green-50 border border-green-200 dark:bg-green-900/20 dark:border-green-800'
              : 'bg-red-50 border border-red-200 dark:bg-red-900/20 dark:border-red-800'
          }`}
        >
          {result.success ? (
            <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
          ) : (
            <XCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
          )}
          <div>
            <p
              className={`font-medium ${
                result.success
                  ? 'text-green-800 dark:text-green-200'
                  : 'text-red-800 dark:text-red-200'
              }`}
            >
              {result.success ? 'Success!' : 'Error'}
            </p>
            <p
              className={`text-sm mt-1 ${
                result.success
                  ? 'text-green-700 dark:text-green-300'
                  : 'text-red-700 dark:text-red-300'
              }`}
            >
              {result.message}
            </p>
          </div>
        </div>
      )}

      <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
        <p className="text-sm text-blue-800 dark:text-blue-200 font-medium mb-2">
          📧 Email Service Configuration
        </p>
        <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1 list-disc list-inside">
          <li>The test email uses the registration approval email template</li>
          <li>Check your inbox (and spam folder) for the test email</li>
          <li>If the email doesn't arrive, verify your SendGrid/Mailgun API keys in .env.local</li>
          <li>Make sure your FROM_EMAIL is verified in your email service</li>
        </ul>
      </div>
    </div>
  )
}

