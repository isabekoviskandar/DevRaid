'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import * as Dialog from '@radix-ui/react-dialog'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { X } from 'lucide-react'
import { RoleChip } from '@/components/ui/card'
import { authStore } from '@/lib/auth-store'
import type { RaidRole } from '@/types'

interface ApplyModalProps {
  openRoles: RaidRole[]
}

export function ApplyModal({ openRoles }: ApplyModalProps) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [selectedRoleId, setSelectedRoleId] = useState<string>(openRoles[0]?.id ?? '')
  const [motivation, setMotivation] = useState('')
  const [formState, setFormState] = useState<'form' | 'success'>('form')
  const prefersReducedMotion = useReducedMotion()

  function handleOpenChange(next: boolean) {
    setOpen(next)
    if (!next && formState === 'success') {
      setTimeout(() => {
        setFormState('form')
        setMotivation('')
        setSelectedRoleId(openRoles[0]?.id ?? '')
      }, 300)
    }
  }

  function handleSubmit() {
    if (motivation.length < 20 || !selectedRoleId) return
    setFormState('success')
  }

  const overlayMotion = prefersReducedMotion
    ? {}
    : {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
      }

  const contentMotion = prefersReducedMotion
    ? {}
    : {
        initial: { opacity: 0, scale: 0.96, y: 16 },
        animate: {
          opacity: 1,
          scale: 1,
          y: 0,
          transition: { type: 'spring' as const, stiffness: 300, damping: 24 },
        },
        exit: { opacity: 0, scale: 0.96, y: 8 },
      }

  return (
    <Dialog.Root open={open} onOpenChange={handleOpenChange}>
      <Dialog.Trigger asChild>
        <button
          className="shrink-0 px-4 py-2 rounded-[var(--radius-badge)] text-sm font-semibold transition-all hover:scale-105 active:scale-95"
          style={{ background: 'var(--color-dr-glow)', color: '#fff' }}
          onClick={(e) => {
            if (!authStore.isAuthenticated()) {
              e.preventDefault()
              router.push('/login')
            }
          }}
        >
          Apply →
        </button>
      </Dialog.Trigger>

      <AnimatePresence>
        {open && (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild>
              <motion.div
                className="fixed inset-0 z-40"
                style={{ background: 'rgba(5,7,13,0.7)', backdropFilter: 'blur(4px)' }}
                {...overlayMotion}
              />
            </Dialog.Overlay>

            <Dialog.Content asChild>
              <motion.div
                className="fixed inset-0 z-50 flex items-center justify-center p-4"
                {...contentMotion}
              >
                <div
                  className="dr-card max-w-md w-full p-6 relative"
                >
                  {/* X close button */}
                  <button
                    onClick={() => setOpen(false)}
                    aria-label="Close"
                    className="absolute top-3 right-3 flex items-center justify-center w-7 h-7 rounded-[var(--radius-badge)] transition-colors"
                    style={{ color: 'var(--color-dr-muted)' }}
                  >
                    <X size={16} />
                  </button>

                  {/* Header */}
                  <Dialog.Title className="dr-title-fantasy text-lg font-bold mb-1" style={{ color: 'var(--color-dr-text)' }}>
                    Apply to This Raid
                  </Dialog.Title>
                  <Dialog.Description className="dr-label mb-5" style={{ color: 'var(--color-dr-muted)' }}>
                    Select your role and write your motivation
                  </Dialog.Description>

                  {formState === 'form' ? (
                    <div className="flex flex-col gap-5">
                      {/* Role selector */}
                      <div>
                        <p className="dr-label mb-2" style={{ color: 'var(--color-dr-text-2)' }}>
                          YOUR ROLE
                        </p>
                        <div
                          role="radiogroup"
                          className="flex flex-col gap-2"
                        >
                          {openRoles.map(role => {
                            const isSelected = selectedRoleId === role.id
                            const slotsOpen = role.slots_total - role.slots_filled
                            return (
                              <div
                                key={role.id}
                                role="radio"
                                aria-checked={isSelected}
                                tabIndex={0}
                                onClick={() => setSelectedRoleId(role.id)}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter' || e.key === ' ') {
                                    e.preventDefault()
                                    setSelectedRoleId(role.id)
                                  }
                                }}
                                className="flex items-center justify-between p-3 rounded-[var(--radius-badge)] cursor-pointer transition-all"
                                style={{
                                  border: `1px solid ${isSelected ? 'var(--color-dr-glow)' : 'var(--color-dr-edge)'}`,
                                  background: isSelected ? 'var(--color-dr-glow-dim)' : 'var(--color-dr-surface-2)',
                                }}
                              >
                                <RoleChip role={role.role_name} />
                                <span className="dr-label" style={{ color: 'var(--color-dr-muted)' }}>
                                  {slotsOpen} slot{slotsOpen !== 1 ? 's' : ''} open
                                </span>
                              </div>
                            )
                          })}
                        </div>
                      </div>

                      {/* Motivation textarea */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <p className="dr-label" style={{ color: 'var(--color-dr-text-2)' }}>
                            MOTIVATION
                          </p>
                          <span
                            className="dr-label"
                            style={{
                              color: motivation.length >= 20
                                ? 'var(--color-dr-glow)'
                                : 'var(--color-dr-muted)',
                            }}
                          >
                            {motivation.length}/300
                          </span>
                        </div>
                        <textarea
                          value={motivation}
                          onChange={(e) => setMotivation(e.target.value)}
                          rows={4}
                          maxLength={300}
                          placeholder="Describe why you're the right hero for this quest..."
                          className="w-full px-3 py-2 text-sm rounded-[var(--radius-badge)] outline-none resize-none"
                          style={{
                            background: 'var(--color-dr-surface-2)',
                            border: '1px solid var(--color-dr-edge)',
                            color: 'var(--color-dr-text)',
                          }}
                          onFocus={(e) => {
                            e.currentTarget.style.borderColor = 'var(--color-dr-glow-dim)'
                          }}
                          onBlur={(e) => {
                            e.currentTarget.style.borderColor = 'var(--color-dr-edge)'
                          }}
                        />
                        {motivation.length > 0 && motivation.length < 20 && (
                          <p className="dr-label mt-1" style={{ color: 'var(--color-dr-gold)' }}>
                            At least 20 characters required
                          </p>
                        )}
                      </div>

                      {/* Submit button */}
                      <button
                        className="dr-btn-primary w-full"
                        disabled={motivation.length < 20 || !selectedRoleId}
                        onClick={handleSubmit}
                        style={
                          motivation.length < 20 || !selectedRoleId
                            ? { opacity: 0.5, cursor: 'not-allowed' }
                            : undefined
                        }
                      >
                        Submit Application
                      </button>
                    </div>
                  ) : (
                    /* Success state */
                    <div className="flex flex-col items-center gap-4 py-4">
                      <span
                        className="text-4xl select-none"
                        style={{ color: 'var(--color-dr-glow)' }}
                        aria-hidden="true"
                      >
                        ⚔
                      </span>
                      <h3
                        className="dr-title-fantasy text-lg text-center"
                        style={{ color: 'var(--color-dr-text)' }}
                      >
                        Quest Application Submitted!
                      </h3>
                      <p
                        className="text-sm text-center"
                        style={{ color: 'var(--color-dr-text-2)' }}
                      >
                        Your scroll has been delivered to the captain. Stand ready, hero.
                      </p>
                      <button
                        className="dr-btn-secondary w-full mt-2"
                        onClick={() => setOpen(false)}
                      >
                        Close
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  )
}
