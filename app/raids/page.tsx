import { MOCK_RAIDS } from '@/lib/mock-data'
import { RaidBoardView } from '@/components/features/raids/raid-board-view'

export default function RaidBoardPage() {
  // TODO: replace with fetch(`${API}/raid-board`) in Server Component
  return <RaidBoardView raids={MOCK_RAIDS} />
}
