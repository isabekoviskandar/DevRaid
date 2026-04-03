// ── Hexagon Skill Calculator ────────────────────────────────
// Phase 5: Convert A/B/C/D answers to 0-100 scale values
// Weight mapping: A=1, B=2, C=3, D=4 → scale by 25 for 0-100 range

import { AXIS_QUESTIONS, AxisType } from './onboarding-questions'
import { SoftSkillHexagon } from '@/types'

// ── Weight Mapping ──────────────────────────────────────
const WEIGHT_MAP: Record<'A' | 'B' | 'C' | 'D', number> = {
  A: 1,
  B: 2,
  C: 3,
  D: 4,
}

/**
 * Calculate hexagon skill values from onboarding answers
 *
 * Algorithm:
 * 1. For each of 5 axes, collect 4 question weights
 * 2. Average the weights (range 1-4)
 * 3. Scale to 0-100: average * 25
 * 4. Round to nearest integer
 *
 * @param answers Record of question ID → answer value (A/B/C/D)
 * @returns SoftSkillHexagon with 5 axis values (0-100)
 */
export function calculateHexagon(
  answers: Record<string, 'A' | 'B' | 'C' | 'D'>
): SoftSkillHexagon {
  const result: Record<AxisType, number> = {
    initiative: 0,
    expertise: 0,
    speed: 0,
    communication: 0,
    flexibility: 0,
  }

  // For each axis, calculate average weight of 4 questions, then scale to 0-100
  for (const axis of Object.keys(AXIS_QUESTIONS) as AxisType[]) {
    const questionIds = AXIS_QUESTIONS[axis]

    // Map question IDs to weights, default to 0 if missing
    const weights = questionIds.map((qId) => WEIGHT_MAP[answers[qId]] ?? 0)

    // Average the 4 weights (range 1-4 or 0 if missing)
    const average = weights.reduce((sum, w) => sum + w, 0) / weights.length

    // Scale to 0-100 range: avg * 25
    // E.g., avg=1 → 25, avg=2 → 50, avg=3 → 75, avg=4 → 100
    result[axis] = Math.round(average * 25)
  }

  return {
    initiative: result.initiative,
    expertise: result.expertise,
    speed: result.speed,
    communication: result.communication,
    flexibility: result.flexibility,
  }
}
