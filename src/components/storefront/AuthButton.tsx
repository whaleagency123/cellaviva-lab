'use client'
import Link from 'next/link'
import Image from 'next/image'
import { User } from 'lucide-react'
import { useSession } from 'next-auth/react'

export function AuthButton() {
  const { data: session, status } = useSession()

  if (status === 'loading') {
    return <div className="w-7 h-7 flex-shrink-0" />
  }

  if (session?.user) {
    return (
      <Link href="/account" aria-label="My Account">
        {session.user.image ? (
          <Image
            src={session.user.image}
            alt={session.user.name ?? 'Profile'}
            width={28}
            height={28}
            className="rounded-full border-2 hover:ring-2 hover:ring-[var(--sf-primary)] transition-all"
            style={{ borderColor: 'var(--sf-primary)' }}
            referrerPolicy="no-referrer"
          />
        ) : (
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold hover:opacity-80 transition-opacity"
            style={{ background: 'var(--sf-primary)' }}
          >
            {(session.user.name?.[0] ?? 'U').toUpperCase()}
          </div>
        )}
      </Link>
    )
  }

  return (
    <Link
      href="/login"
      className="p-2 text-[var(--sf-text-muted)] hover:text-[var(--sf-text)] transition-colors hover:scale-110 transform duration-150"
      aria-label="Sign In"
    >
      <User style={{ width: 'var(--sf-icon-size)', height: 'var(--sf-icon-size)' }} />
    </Link>
  )
}
