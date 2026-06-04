'use client'
import { useState, useRef, useCallback } from 'react'

interface Props {
  title?: string
  subtitle?: string
  beforeImage?: string
  afterImage?: string
  beforeLabel?: string
  afterLabel?: string
}

export function BeforeAfterSlider({
  title = 'See The Difference',
  subtitle = 'Drag the slider to compare before and after results.',
  beforeImage,
  afterImage,
  beforeLabel = 'Before',
  afterLabel = 'After',
}: Props) {
  const [pos, setPos] = useState(50)
  const [dragging, setDragging] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const calcPos = useCallback((clientX: number) => {
    const rect = containerRef.current?.getBoundingClientRect()
    if (!rect) return
    setPos(Math.min(100, Math.max(0, ((clientX - rect.left) / rect.width) * 100)))
  }, [])

  function onMouseDown(e: React.MouseEvent) {
    e.preventDefault()
    setDragging(true)
    const move = (e: MouseEvent) => calcPos(e.clientX)
    const up = () => {
      setDragging(false)
      window.removeEventListener('mousemove', move)
      window.removeEventListener('mouseup', up)
    }
    window.addEventListener('mousemove', move)
    window.addEventListener('mouseup', up)
  }

  function onTouchStart(e: React.TouchEvent) {
    calcPos(e.touches[0].clientX)
    const move = (e: TouchEvent) => calcPos(e.touches[0].clientX)
    const end = () => {
      window.removeEventListener('touchmove', move)
      window.removeEventListener('touchend', end)
    }
    window.addEventListener('touchmove', move, { passive: true })
    window.addEventListener('touchend', end)
  }

  const Placeholder = ({ side }: { side: 'before' | 'after' }) => (
    <div
      className="absolute inset-0 flex items-center justify-center"
      style={{
        background: side === 'before'
          ? 'linear-gradient(135deg, #8b9cc0 0%, #c4b5a0 100%)'
          : 'linear-gradient(135deg, #4ade80 0%, #3a79a9 100%)',
      }}
    >
      <span style={{ fontSize: 80, opacity: 0.45 }}>{side === 'before' ? '😔' : '✨'}</span>
    </div>
  )

  return (
    <section className="py-20" style={{ background: 'var(--sf-bg)' }}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

        {(title || subtitle) && (
          <div className="text-center mb-12">
            {title && (
              <h2
                className="font-black mb-4"
                style={{
                  fontFamily: 'var(--sf-font-display)',
                  fontSize: 'clamp(1.75rem, 4vw, 2.75rem)',
                  color: 'var(--sf-text)',
                }}
              >
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="text-lg max-w-xl mx-auto" style={{ color: 'var(--sf-text-muted)' }}>
                {subtitle}
              </p>
            )}
          </div>
        )}

        {/* Slider */}
        <div
          ref={containerRef}
          className="relative rounded-3xl overflow-hidden"
          style={{
            aspectRatio: '16 / 9',
            cursor: dragging ? 'col-resize' : 'default',
            boxShadow: '0 8px 40px rgba(0,0,0,0.12)',
            userSelect: 'none',
          }}
        >
          {/* After layer (full width, behind) */}
          <div className="absolute inset-0">
            {afterImage
              ? <img src={afterImage} alt={afterLabel} className="w-full h-full object-cover" draggable={false} />
              : <Placeholder side="after" />}
          </div>

          {/* After label */}
          <span className="absolute top-4 right-4 z-10 text-xs font-bold px-3 py-1.5 rounded-full" style={{ background: 'rgba(0,0,0,.5)', color: '#fff', backdropFilter: 'blur(4px)' }}>
            {afterLabel}
          </span>

          {/* Before layer (clipped to left of handle) */}
          <div
            className="absolute inset-0"
            style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
          >
            {beforeImage
              ? <img src={beforeImage} alt={beforeLabel} className="w-full h-full object-cover" draggable={false} />
              : <Placeholder side="before" />}
          </div>

          {/* Before label */}
          <span className="absolute top-4 left-4 z-10 text-xs font-bold px-3 py-1.5 rounded-full" style={{ background: 'rgba(0,0,0,.5)', color: '#fff', backdropFilter: 'blur(4px)' }}>
            {beforeLabel}
          </span>

          {/* Divider line */}
          <div
            className="absolute inset-y-0 z-20 pointer-events-none"
            style={{ left: `${pos}%`, width: 2, background: '#fff', transform: 'translateX(-50%)' }}
          />

          {/* Handle */}
          <div
            className="absolute z-30 flex items-center justify-center rounded-full bg-white"
            style={{
              top: '50%',
              left: `${pos}%`,
              width: 44,
              height: 44,
              transform: 'translate(-50%, -50%)',
              boxShadow: '0 2px 16px rgba(0,0,0,0.2)',
              cursor: 'col-resize',
            }}
            onMouseDown={onMouseDown}
            onTouchStart={onTouchStart}
          >
            <svg width="22" height="13" viewBox="0 0 22 13" fill="none">
              <path d="M8 1L2 6.5L8 12" stroke="#374151" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M14 1L20 6.5L14 12" stroke="#374151" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>

          {/* Drag hint */}
          <div
            className="absolute bottom-4 left-1/2 z-10 text-xs font-medium px-3 py-1.5 rounded-full pointer-events-none whitespace-nowrap"
            style={{
              transform: 'translateX(-50%)',
              background: 'rgba(0,0,0,.5)',
              color: '#fff',
              backdropFilter: 'blur(4px)',
            }}
          >
            ← Drag to compare →
          </div>
        </div>
      </div>
    </section>
  )
}
