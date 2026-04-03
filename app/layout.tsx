import type { Metadata } from 'next'
import { Cinzel, JetBrains_Mono, Sora } from 'next/font/google'
import './globals.css'
import { AppShell } from '@/components/layout/app-shell'

// ── Font loading ───────────────────────────────────────────────
const cinzel = Cinzel({
  subsets: ['latin'],
  variable: '--font-fantasy',
  display: 'swap',
  weight: ['400', '600', '700'],
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
  weight: ['400', '500', '600'],
})

const sora = Sora({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700'],
})

export const metadata: Metadata = {
  title: 'DevRaid',
  description: 'Form your raid. Build your legend.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const fonts = `${sora.variable} ${cinzel.variable} ${jetbrainsMono.variable}`

  return (
    <html lang="en" className={fonts}>
      <body style={{ margin: 0 }}>
        {/* Fixed atmospheric layers — aurora glow + grain */}
        <div className="dr-aurora" aria-hidden="true" />
        <div className="dr-noise"  aria-hidden="true" />

        {/* App content sits above bg layers */}
        <div className="dr-app">
          <AppShell>{children}</AppShell>
        </div>
      </body>
    </html>
  )
}
