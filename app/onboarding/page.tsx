'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { api } from '@/lib/api'
import { authStore } from '@/lib/auth-store'
import { StepProgress } from '@/components/ui/step-progress'
import { SoftSkillHexagon } from '@/types'

type MetricsOption = {
  id: string
  text: string
}

type MetricsQuestion = {
  id: string
  axis: string
  prompt: string
  options: MetricsOption[]
}

const AXIS_LABELS: Record<string, string> = {
  drive: 'Drive',
  reliability: 'Reliability',
  communication: 'Communication',
  tempo: 'Tempo',
  mastery: 'Mastery',
  adaptability: 'Adaptability',
}

export default function OnboardingPage() {
  const router = useRouter()

  const [questions, setQuestions] = useState<MetricsQuestion[]>([])
  const [questionsLoading, setQuestionsLoading] = useState(true)
  const [questionsError, setQuestionsError] = useState<string | null>(null)

  const [currentStep, setCurrentStep] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [hexagon, setHexagon] = useState<SoftSkillHexagon | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  useEffect(() => {
    let active = true

    api.metrics.questions().then((res) => {
      if (!active) return

      if (!('data' in res) || !res.data) {
        setQuestionsError(res.error ?? 'Failed to load assessment questions')
        setQuestionsLoading(false)
        return
      }

      setQuestions(res.data.questions)
      setQuestionsLoading(false)
    })

    return () => {
      active = false
    }
  }, [])

  const totalQuestions = questions.length
  const currentQuestion = questions[currentStep]
  const hasAnswered = currentQuestion ? answers[currentQuestion.id] !== undefined : false
  const isLastStep = totalQuestions > 0 && currentStep === totalQuestions - 1
  const progressPercent = useMemo(() => {
    if (totalQuestions === 0) return 0
    return ((currentStep + 1) / totalQuestions) * 100
  }, [currentStep, totalQuestions])

  const handleSelectAnswer = (value: string) => {
    if (!currentQuestion) return
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: value,
    }))
  }

  const handleNext = async () => {
    if (!hasAnswered || !currentQuestion) return

    if (isLastStep) {
      setIsSubmitting(true)
      setSubmitError(null)

      const scoreRes = await api.metrics.score(answers)
      if (!('data' in scoreRes) || !scoreRes.data) {
        setSubmitError(scoreRes.error ?? 'Failed to calculate profile')
        setIsSubmitting(false)
        return
      }

      const result = scoreRes.data.soft_profile
      setHexagon(result)

      const token = authStore.getToken()
      if (token) {
        await api.auth.patchUser(token, { soft_profile: result, onboarding_completed: true })
      }

      localStorage.setItem('soft_skills_completed', JSON.stringify(result))
      localStorage.setItem('onboarding_completed', 'true')
      authStore.updateUser({
        soft_profile: result,
        soft_skills: result,
        onboarding_completed: true,
      })

      setIsSubmitting(false)
    } else {
      setCurrentStep((prev) => prev + 1)
    }
  }

  const handleGoToProfile = () => {
    router.push('/hero/me')
  }

  // Results Screen (after step 20)
  if (hexagon) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-8">
        <div
          className="fixed top-0 left-0 h-1 bg-gradient-to-r from-dr-glow to-emerald-500 w-full"
          role="progressbar"
          aria-valuenow={100}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Progress: 100% complete"
        />

        <div className="dr-card max-w-md w-full p-lg space-y-lg">
          <h1 className="dr-heading text-2xl text-center">
            Your Soft Skills Profile
          </h1>

          <p className="text-center text-sm text-dr-text-2">
            Based on your {totalQuestions} responses
          </p>

          <div className="space-y-md">
            {Object.entries(hexagon)
              .filter(([, value]) => typeof value === 'number')
              .map(([axis, value]) => (
              <div
                key={axis}
                className="flex justify-between items-center p-md border border-dr-edge rounded-[var(--radius-badge)]"
              >
                <span className="font-medium text-sm">
                  {AXIS_LABELS[axis] ?? axis}
                </span>
                <span className="dr-heading text-lg">{Number(value).toFixed(2)}</span>
              </div>
            ))}
          </div>

          <button
            onClick={handleGoToProfile}
            className="dr-btn-primary w-full"
          >
            Go to Profile
          </button>
        </div>
      </div>
    )
  }

  if (questionsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="dr-card p-lg max-w-md w-full text-center">
          <p className="dr-text">Loading assessment questions...</p>
        </div>
      </div>
    )
  }

  if (questionsError || !currentQuestion) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="dr-card p-lg max-w-md w-full text-center space-y-md">
          <p className="dr-text">
            {questionsError ?? 'Assessment is unavailable right now.'}
          </p>
          <button
            className="dr-btn-primary w-full"
            onClick={() => window.location.reload()}
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col relative">
      <div
        className="fixed top-0 left-0 h-1 bg-gradient-to-r from-dr-glow to-emerald-500 transition-all duration-400 ease-out"
        style={{ width: `${progressPercent}%` }}
        role="progressbar"
        aria-valuenow={currentStep + 1}
        aria-valuemin={1}
        aria-valuemax={totalQuestions}
        aria-label={`Progress: question ${currentStep + 1} of ${totalQuestions}`}
      />

      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-xl">
          <div className="mb-lg space-y-3">
            <div className="flex items-center justify-between gap-3 text-xs">
              <span className="dr-label" style={{ color: 'var(--color-dr-muted)' }}>
                Assessment Progress
              </span>
              <span className="dr-label" style={{ color: 'var(--color-dr-text)' }}>
                Step {currentStep + 1} of {totalQuestions}
              </span>
            </div>

            <StepProgress currentStep={currentStep} totalSteps={totalQuestions} />

            <div
              className="h-1 overflow-hidden rounded-full"
              style={{ background: 'color-mix(in srgb, var(--color-dr-edge) 90%, transparent)' }}
              aria-hidden="true"
            >
              <div
                className="h-full rounded-full transition-all duration-400 ease-out"
                style={{
                  width: `${progressPercent}%`,
                  background:
                    'linear-gradient(90deg, var(--color-dr-gold) 0%, var(--color-dr-glow) 55%, #1ad589 100%)',
                }}
              />
            </div>
          </div>

          <div key={currentQuestion.id} className="dr-card p-lg space-y-lg">
            <p className="dr-label uppercase tracking-wide text-dr-text-2">
              {AXIS_LABELS[currentQuestion.axis] ?? currentQuestion.axis}
            </p>
            <h2 className="dr-heading text-xl leading-tight">
              {currentQuestion.prompt}
            </h2>

            <div className="space-y-md">
              {currentQuestion.options.map((option) => {
                const isSelected = answers[currentQuestion.id] === option.id
                return (
                  <label
                    key={option.id}
                    className={`
                      relative flex items-center gap-3 p-3 rounded-[var(--radius-badge)]
                      border transition-all duration-150 cursor-pointer
                      ${
                        isSelected
                          ? 'border-[rgba(0,217,126,0.4)] bg-[rgba(0,217,126,0.15)]'
                          : 'border-[rgba(255,255,255,0.055)] hover:bg-[rgba(0,217,126,0.08)]'
                      }
                    `}
                  >
                    <input
                      type="radio"
                      name={`q_${currentQuestion.id}`}
                      value={option.id}
                      checked={isSelected}
                      onChange={() => handleSelectAnswer(option.id)}
                      className="sr-only"
                    />

                    <div
                      className={`
                        flex-shrink-0 w-[18px] h-[18px] rounded-full border-2
                        transition-all duration-150
                        ${
                          isSelected
                            ? 'border-dr-glow bg-dr-glow'
                            : 'border-[rgba(255,255,255,0.2)]'
                        }
                      `}
                    />

                    <span className="text-sm text-dr-text">
                      {option.text}
                    </span>
                  </label>
                )
              })}
            </div>

            {submitError && (
              <p className="text-sm text-red-300">{submitError}</p>
            )}

            <div className="flex justify-end gap-md pt-lg">
              <button
                onClick={handleNext}
                disabled={!hasAnswered || isSubmitting}
                className={`
                  dr-btn-primary
                  ${!hasAnswered || isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}
                `}
              >
                {isLastStep ? 'Finish Onboarding' : 'Next Step'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
