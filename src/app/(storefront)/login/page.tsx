'use client'
import { useEffect, Suspense } from 'react'
import Link from 'next/link'
import { signIn, useSession } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Loader2 } from 'lucide-react'

function LoginContent() {
  const { status } = useSession()
  const router = useRouter()
  const params = useSearchParams()
  const callbackUrl = params.get('callbackUrl') ?? '/account'
  const error = params.get('error')

  useEffect(() => {
    if (status === 'authenticated') router.replace(callbackUrl)
  }, [status, callbackUrl, router])

  if (status === 'loading') {
    return (
      <div className="min-h-[calc(100vh-6rem)] bg-[#f8f9f4] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#52b788]" />
      </div>
    )
  }

  return (
    <div className="min-h-[calc(100vh-6rem)] bg-[#f8f9f4] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-sm">
        {/* Logo / brand */}
        <div className="text-center mb-8">
          <p className="text-2xl font-black text-gray-900 tracking-tight">CELLAVIVA</p>
          <p className="text-sm text-gray-500 mt-1">Sign in to your account</p>
        </div>

        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
          {/* Error banner */}
          {error && (
            <div className="mb-5 px-4 py-3 bg-red-50 border border-red-100 rounded-xl text-sm text-red-600">
              {error === 'OAuthAccountNotLinked'
                ? 'This email is already linked to a different sign-in method.'
                : error === 'OAuthCallback'
                ? 'Sign-in was cancelled or failed. Please try again.'
                : 'An error occurred. Please try again.'}
            </div>
          )}

          <div className="space-y-3">
            {/* Google */}
            <button
              onClick={() => signIn('google', { callbackUrl })}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-200 rounded-2xl text-sm font-semibold text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all"
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
                <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/>
                <path d="M3.964 10.707A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.707V4.961H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.039l3.007-2.332z" fill="#FBBC05"/>
                <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.961L3.964 7.293C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
              </svg>
              Continue with Google
            </button>

            {/* Facebook */}
            <button
              onClick={() => signIn('facebook', { callbackUrl })}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold text-white transition-all hover:opacity-90"
              style={{ background: '#1877F2' }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                <path d="M24 12.073C24 5.404 18.627 0 12 0S0 5.404 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047v-2.66c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.513c-1.491 0-1.956.93-1.956 1.883v2.268h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"/>
              </svg>
              Continue with Facebook
            </button>
          </div>

          <div className="mt-5 text-center">
            <Link href="/forgot-password" className="text-xs text-[var(--sf-primary)] hover:underline">
              Forgot your password?
            </Link>
          </div>

          <p className="text-center text-xs text-gray-400 mt-3 leading-relaxed">
            By continuing, you agree to our{' '}
            <Link href="/terms" className="underline hover:text-gray-600">Terms</Link>
            {' '}and{' '}
            <Link href="/privacy" className="underline hover:text-gray-600">Privacy Policy</Link>.
          </p>
        </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-[calc(100vh-6rem)] bg-[#f8f9f4] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#52b788]" />
      </div>
    }>
      <LoginContent />
    </Suspense>
  )
}
