'use client'

import { HexRadar } from '@/components/ui/hex-radar'
import type { SoftSkillHexagon } from '@/types'

export function PublicHeroRadar({ profile }: { profile: SoftSkillHexagon }) {
  return (
    <div className="flex justify-center py-2">
      <HexRadar profile={profile} size={220} showLabels />
    </div>
  )
}
