import type { ReactNode } from 'react'

export const metadata = {
  title: 'Onboarding - DevRaid',
  description: 'Complete your Soft Skills Profile',
}

export default function OnboardingLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative">
      {/* Minimal wrapper — most layout handled by page.tsx and root layout */}
      {children}
    </div>
  )
}
