// ── Core Domain Types ──────────────────────────────────────────
// These mirror the backend entity model (Laravel API)

// Soft profile supports both legacy 5-axis and new 6-axis model.
export interface SoftSkillHexagon {
  // New backend model (1-10 float)
  drive?: number
  reliability?: number
  communication?: number
  tempo?: number
  mastery?: number
  adaptability?: number

  // Legacy frontend model (0-100)
  initiative?: number
  expertise?: number
  speed?: number
  flexibility?: number
}

// Type alias for backward compatibility (use SoftSkillHexagon directly)
export type SoftSkillProfile = SoftSkillHexagon

export interface HeroProfile {
  id: string
  user_id: string
  display_name: string
  avatar_url?: string
  headline: string
  bio: string
  availability_status: 'open' | 'busy' | 'unavailable'
  preferred_roles: string[]
  hard_skills: string[]
  links: { github?: string; linkedin?: string; portfolio?: string }
  soft_profile?: SoftSkillHexagon
  reputation?: ReputationSnapshot
}

export interface ReputationSnapshot {
  completed_raids: number
  reliability_badge?: 'gold' | 'silver' | 'bronze'
  reviews: SeedReview[]
}

export interface SeedReview {
  text: string
  rating: number
  badge?: string
  source_label: string
}

export type RaidStage = 'idea' | 'planning' | 'development' | 'testing' | 'launched'
export type RaidStatus = 'recruiting' | 'active' | 'completed' | 'closed'

export interface Raid {
  id: string
  captain_user_id: string
  captain?: Pick<HeroProfile, 'id' | 'display_name' | 'avatar_url'>
  title: string
  mission: string
  description: string
  stage: RaidStage
  raid_status: RaidStatus
  recruiting_status: 'open' | 'closed'
  roles: RaidRole[]
  member_count: number
  created_at: string
  // Demo/matching enrichment (optional — from backend matching or mock)
  fit_score?: number
  explainability?: { top_matches: string[] }
  /** Raid-wide target soft profile (1–10 per axis). Used with current_team_profiles for deficit demo. */
  target_soft_profile?: SoftSkillHexagon
  /** Current members' soft profiles (1–10 per axis) for deficit = target×slots − sum(team). */
  current_team_profiles?: SoftSkillHexagon[]
}

export interface RaidRole {
  id: string
  raid_id: string
  role_name: string
  required_hard_skills: string[]
  desired_soft_profile?: Partial<SoftSkillProfile>
  slots_total: number
  slots_filled: number
}

export type MatchDirection = 'apply' | 'invite'
export type MatchStatus = 'pending' | 'accepted' | 'rejected' | 'cancelled'

export interface MatchRequest {
  id: string
  raid_id: string
  raid_role_id: string
  initiator_user_id: string
  target_user_id: string
  direction: MatchDirection
  status: MatchStatus
  message?: string
  created_at: string
}

export type QuestStatus = 'backlog' | 'in_progress' | 'review' | 'done'
export type QuestPriority = 'low' | 'medium' | 'high' | 'critical'

export interface Quest {
  id: string
  raid_id: string
  title: string
  description?: string
  status: QuestStatus
  priority: QuestPriority
  assignee?: Pick<HeroProfile, 'id' | 'display_name' | 'avatar_url'>
  created_by_user_id: string
}

// ── Roll Hero result ───────────────────────────────────────────
export interface RollCandidate {
  hero: HeroProfile
  role: RaidRole
  score: number           // 0-100 composite match score
  hard_match: number      // % of required skills matched
  soft_match: number      // similarity score 0-100
  availability_fit: 'perfect' | 'good' | 'poor'
  explainability?: {
    top_gap_axes?: Array<{ axis: string; contribution: number; wanted: number }>
  }
}

/** Pending hero application to join a raid (captain queue — UI mock). */
export interface PendingRaidApplication {
  id: string
  raid_id: string
  hero: Pick<HeroProfile, 'id' | 'display_name' | 'avatar_url'>
  role_id: string
  role_name: string
  message?: string
}
