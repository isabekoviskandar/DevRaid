import type { PendingRaidApplication, Raid, HeroProfile, Quest, RollCandidate } from '@/types'

export const MOCK_RAIDS: Raid[] = [
  {
    id: '1', captain_user_id: 'u1',
    captain: { id: 'u1', display_name: 'ByteForge', avatar_url: undefined },
    title: 'Aether Analytics',
    mission: 'Real-time sports analytics platform for Central Asian leagues. We need fast data pipelines and a clean dashboard.',
    description: '', stage: 'development', raid_status: 'active', recruiting_status: 'open',
    member_count: 3, created_at: '2026-03-20',
    roles: [
      { id: 'r1', raid_id: '1', role_name: 'frontend', required_hard_skills: ['React','TypeScript','Recharts'], desired_soft_profile: undefined, slots_total: 1, slots_filled: 0 },
      { id: 'r2', raid_id: '1', role_name: 'data',     required_hard_skills: ['Python','Kafka','ClickHouse'],   desired_soft_profile: undefined, slots_total: 1, slots_filled: 0 },
    ],
  },
  {
    id: '2', captain_user_id: 'u2',
    captain: { id: 'u2', display_name: 'NullPtr', avatar_url: undefined },
    title: 'GuildMap',
    mission: 'Interactive map of IT communities across Uzbekistan — events, meetups, hackathons in one place.',
    description: '', stage: 'planning', raid_status: 'recruiting', recruiting_status: 'open',
    member_count: 1, created_at: '2026-03-28',
    roles: [
      { id: 'r3', raid_id: '2', role_name: 'backend',   required_hard_skills: ['Laravel','PostgreSQL'],           desired_soft_profile: undefined, slots_total: 1, slots_filled: 0 },
      { id: 'r4', raid_id: '2', role_name: 'design',    required_hard_skills: ['Figma','UX Research'],            desired_soft_profile: undefined, slots_total: 1, slots_filled: 0 },
      { id: 'r5', raid_id: '2', role_name: 'frontend',  required_hard_skills: ['Next.js','Mapbox'],               desired_soft_profile: undefined, slots_total: 1, slots_filled: 0 },
    ],
  },
  {
    id: '3', captain_user_id: 'u3',
    captain: { id: 'u3', display_name: 'Zephyra', avatar_url: undefined },
    title: 'MedVault',
    mission: 'Secure personal health records app for patients in Tashkent clinics. HIPAA-inspired privacy model.',
    description: '', stage: 'idea', raid_status: 'recruiting', recruiting_status: 'open',
    member_count: 1, created_at: '2026-03-31',
    roles: [
      { id: 'r6', raid_id: '3', role_name: 'backend',   required_hard_skills: ['Node.js','encryption','PostgreSQL'], desired_soft_profile: undefined, slots_total: 1, slots_filled: 0 },
      { id: 'r7', raid_id: '3', role_name: 'mobile',    required_hard_skills: ['React Native','Expo'],               desired_soft_profile: undefined, slots_total: 1, slots_filled: 0 },
      { id: 'r8', raid_id: '3', role_name: 'design',    required_hard_skills: ['Figma','Healthcare UX'],             desired_soft_profile: undefined, slots_total: 1, slots_filled: 0 },
    ],
  },
  {
    id: '4', captain_user_id: 'u4',
    captain: { id: 'u4', display_name: 'Vexara', avatar_url: undefined },
    title: 'CodeLens AI',
    mission: 'AI-powered code review bot that understands team conventions. Integrates with GitHub and GitLab.',
    description: '', stage: 'development', raid_status: 'active', recruiting_status: 'open',
    member_count: 4, created_at: '2026-03-15',
    roles: [
      { id: 'r9', raid_id: '4', role_name: 'backend',   required_hard_skills: ['Python','FastAPI','LLM APIs'], desired_soft_profile: undefined, slots_total: 1, slots_filled: 0 },
      { id: 'r10',raid_id: '4', role_name: 'devops',    required_hard_skills: ['Docker','GitHub Actions','AWS'], desired_soft_profile: undefined, slots_total: 1, slots_filled: 0 },
    ],
  },
]

/** Hero applications to join a raid (captain review — mock). */
export const MOCK_PENDING_APPLICATIONS: PendingRaidApplication[] = [
  {
    id: 'app-1',
    raid_id: '1',
    hero: { id: 'c2', display_name: 'Veylix', avatar_url: undefined },
    role_id: 'r1',
    role_name: 'frontend',
    message: 'Strong overlap with your Recharts dashboard work — happy to pair on data viz.',
  },
  {
    id: 'app-2',
    raid_id: '1',
    hero: { id: 'c1', display_name: 'NovaSpark', avatar_url: undefined },
    role_id: 'r2',
    role_name: 'data',
    message: 'Kafka + ClickHouse in production; can own the real-time feed slice.',
  },
]

export function pendingApplicationsForRaid(raidId: string): PendingRaidApplication[] {
  return MOCK_PENDING_APPLICATIONS.filter(a => a.raid_id === raidId)
}

export const MOCK_HERO: HeroProfile = {
  id: 'me',
  user_id: 'me',
  display_name: 'DISP4TCHER',
  headline: 'Frontend Engineer · Product-minded builder',
  bio: 'Building products that matter inside IT Community Uzbekistan. Love clean UIs and fast feedback loops.',
  availability_status: 'open',
  preferred_roles: ['frontend', 'design'],
  hard_skills: ['Next.js', 'TypeScript', 'React', 'Tailwind', 'Figma', 'Node.js'],
  links: { github: 'github.com/DISP4TCHER' },
  soft_profile: {
    initiative: 82,
    expertise: 70,
    speed: 75,
    communication: 70,
    flexibility: 88,
  },
  reputation: {
    completed_raids: 3,
    reliability_badge: 'silver',
    reviews: [
      { text: 'Ships fast, clean code, great communicator.', rating: 5, badge: 'Reliable', source_label: 'AetherRaid · 2026' },
      { text: 'Proactive problem solver. Would raid again.', rating: 5, badge: 'Proactive', source_label: 'MapUZ · 2025' },
    ],
  },
}

// ── Quest Board mock data (raid '1' — Aether Analytics) ─────────
export const MOCK_QUESTS: Quest[] = [
  {
    id: 'q1', raid_id: '1',
    title: 'Design data pipeline schema',
    description: 'Define Kafka topics and ClickHouse table structure for match events',
    status: 'done', priority: 'high', created_by_user_id: 'u1',
    assignee: { id: 'u1', display_name: 'ByteForge', avatar_url: undefined },
  },
  {
    id: 'q2', raid_id: '1',
    title: 'Real-time score feed via WebSocket',
    description: 'Live endpoint for match scores with sub-100ms latency',
    status: 'in_progress', priority: 'critical', created_by_user_id: 'u1',
    assignee: { id: 'u1', display_name: 'ByteForge', avatar_url: undefined },
  },
  {
    id: 'q3', raid_id: '1',
    title: 'Dashboard charts — Recharts integration',
    description: 'Analytics charts connected to ClickHouse aggregates',
    status: 'in_progress', priority: 'high', created_by_user_id: 'u1',
  },
  {
    id: 'q4', raid_id: '1',
    title: 'Hero authentication flow',
    description: 'Login / register screens + Sanctum token handshake',
    status: 'review', priority: 'high', created_by_user_id: 'u1',
    assignee: { id: 'me', display_name: 'DISP4TCHER', avatar_url: undefined },
  },
  {
    id: 'q5', raid_id: '1',
    title: 'Responsive layout — tablet breakpoints',
    status: 'backlog', priority: 'medium', created_by_user_id: 'u1',
  },
  {
    id: 'q6', raid_id: '1',
    title: 'PDF export for analytics reports',
    status: 'backlog', priority: 'low', created_by_user_id: 'u1',
  },
]

// ── Roll Hero candidates (open roles in raid '1') ────────────────
export const MOCK_CANDIDATES: RollCandidate[] = [
  {
    hero: {
      id: 'c1', user_id: 'c1', display_name: 'NovaSpark',
      headline: 'React Engineer · Performance-first builder',
      bio: '', availability_status: 'open',
      preferred_roles: ['frontend'],
      hard_skills: ['React', 'TypeScript', 'Recharts', 'CSS'],
      links: {},
      soft_profile: { initiative: 78, expertise: 77, speed: 90, communication: 85, flexibility: 72 },
    },
    role: MOCK_RAIDS[0].roles[0],
    score: 91, hard_match: 88, soft_match: 94, availability_fit: 'perfect',
  },
  {
    hero: {
      id: 'c2', user_id: 'c2', display_name: 'Veylix',
      headline: 'Frontend dev · TypeScript advocate',
      bio: '', availability_status: 'open',
      preferred_roles: ['frontend'],
      hard_skills: ['React', 'TypeScript', 'Next.js'],
      links: {},
      soft_profile: { initiative: 65, expertise: 80, speed: 75, communication: 90, flexibility: 80 },
    },
    role: MOCK_RAIDS[0].roles[0],
    score: 79, hard_match: 75, soft_match: 82, availability_fit: 'good',
  },
  {
    hero: {
      id: 'c3', user_id: 'c3', display_name: 'DataForgee',
      headline: 'Data Engineer · Real-time pipelines',
      bio: '', availability_status: 'open',
      preferred_roles: ['data', 'backend'],
      hard_skills: ['Python', 'Kafka', 'ClickHouse', 'Spark'],
      links: {},
      soft_profile: { initiative: 70, expertise: 85, speed: 95, communication: 60, flexibility: 85 },
    },
    role: MOCK_RAIDS[0].roles[1],
    score: 95, hard_match: 100, soft_match: 89, availability_fit: 'perfect',
  },
  {
    hero: {
      id: 'c4', user_id: 'c4', display_name: 'Qira_Dev',
      headline: 'Backend + data · Python stack',
      bio: '', availability_status: 'open',
      preferred_roles: ['backend', 'data'],
      hard_skills: ['Python', 'FastAPI', 'Kafka'],
      links: {},
      soft_profile: { initiative: 82, expertise: 85, speed: 80, communication: 70, flexibility: 68 },
    },
    role: MOCK_RAIDS[0].roles[1],
    score: 74, hard_match: 80, soft_match: 68, availability_fit: 'good',
  },
  {
    hero: {
      id: 'c5', user_id: 'c5', display_name: 'FxCrafter',
      headline: 'Creative frontend · CSS sorcerer',
      bio: '', availability_status: 'busy',
      preferred_roles: ['frontend', 'design'],
      hard_skills: ['React', 'CSS', 'Framer Motion'],
      links: {},
      soft_profile: { initiative: 90, expertise: 66, speed: 72, communication: 75, flexibility: 88 },
    },
    role: MOCK_RAIDS[0].roles[0],
    score: 68, hard_match: 65, soft_match: 71, availability_fit: 'poor',
  },
]

/** Resolve a public hero profile by mock id (me, c1…c5). */
export function resolveMockHeroProfile(id: string): HeroProfile | null {
  if (id === MOCK_HERO.id || id === MOCK_HERO.user_id || id === 'me') {
    return MOCK_HERO
  }
  const cand = MOCK_CANDIDATES.find(c => c.hero.id === id)
  return cand ? cand.hero : null
}
