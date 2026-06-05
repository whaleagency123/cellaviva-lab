/**
 * Validates that all required environment variables are present.
 * Call this in any server entry point (layout.tsx, route.ts, etc.) or let
 * Next.js invoke it at startup via instrumentation.ts.
 */
const REQUIRED_VARS = [
  'DATABASE_URL',
  'NEXTAUTH_SECRET',
] as const

export function validateEnv() {
  const missing: string[] = []

  for (const key of REQUIRED_VARS) {
    const val = process.env[key]
    if (!val || val.startsWith('<') || val === 'whsec_placeholder') {
      missing.push(key)
    }
  }

  if (missing.length > 0 && process.env.NODE_ENV === 'production') {
    throw new Error(
      `[CELLAVIVA] Missing or placeholder environment variables:\n  ${missing.join('\n  ')}\n` +
      'Set these in your deployment environment before starting the server.',
    )
  }

  if (missing.length > 0) {
    console.warn(
      `[CELLAVIVA] Warning: missing env vars (OK in dev): ${missing.join(', ')}`,
    )
  }
}
