'use client'
import { useEffect, useRef } from 'react'
import { useSearchParams } from 'next/navigation'

// Unique CSS selector path for any DOM element (relative to body)
function getSelectorPath(el: Element): string {
  const parts: string[] = []
  let cur: Element | null = el
  while (cur && cur !== document.body) {
    let selector = cur.tagName.toLowerCase()
    if (cur.id) {
      selector += `#${cur.id}`
      parts.unshift(selector)
      break
    }
    if (cur.hasAttribute('data-section')) {
      selector += `[data-section="${cur.getAttribute('data-section')}"]`
      parts.unshift(selector)
      break
    }
    const siblings = Array.from(cur.parentElement?.children ?? [])
    const idx = siblings.indexOf(cur)
    if (idx > 0) selector += `:nth-child(${idx + 1})`
    parts.unshift(selector)
    cur = cur.parentElement
  }
  return parts.join(' > ')
}

export function BuilderBridge() {
  const params    = useSearchParams()
  const isBuilder = params.get('builder') === '1'
  const modeRef   = useRef<'select' | 'drag'>('select')
  const dragRef   = useRef<{
    el: HTMLElement
    selector: string
    startX: number; startY: number
    origX: number;  origY: number
    type: 'move' | 'resize-se'
    origW: number;  origH: number
  } | null>(null)

  useEffect(() => {
    if (!isBuilder) return
    if (typeof window === 'undefined' || window.self === window.top) return

    document.body.setAttribute('data-builder', '1')

    // ── Inject drag/resize overlay styles ────────────────────────────────
    const styleEl = document.createElement('style')
    styleEl.id = 'builder-drag-styles'
    styleEl.textContent = `
      [data-builder="1"] [data-section] {
        position: relative;
        outline: 2px dashed transparent;
        outline-offset: 2px;
        transition: outline-color 0.15s ease;
      }
      [data-builder="1"] [data-section]:hover { outline-color: rgba(74,222,128,0.45); }
      [data-builder="1"] [data-section]::after {
        content: attr(data-section);
        position: absolute; top: 6px; left: 6px;
        background: rgba(74,222,128,0); color: transparent;
        font-size: 11px; font-weight: 700; padding: 2px 8px;
        border-radius: 6px; pointer-events: none;
        transition: all 0.15s; text-transform: uppercase; letter-spacing: 0.08em; z-index:1000;
      }
      [data-builder="1"] [data-section]:hover::after {
        background: rgba(74,222,128,0.9); color: #0b0d13;
      }
      [data-builder="1"] [data-section][data-builder-active] {
        outline: 3px solid #4ade80 !important; outline-offset: 2px;
      }
      [data-builder="1"] [data-section][data-builder-active]::after {
        background: #4ade80; color: #0b0d13;
      }
      [data-builder="1"] a,
      [data-builder="1"] button:not(.builder-del-btn):not(.builder-drag-handle) {
        pointer-events: none;
      }
      .builder-del-btn {
        position: absolute !important; top: 12px !important; right: 12px !important;
        z-index: 9999 !important; display: flex !important; align-items: center !important;
        gap: 5px !important; padding: 7px 13px !important;
        background: rgba(220,38,38,0.90) !important; color: white !important;
        border: none !important; border-radius: 9px !important;
        font-size: 12px !important; font-weight: 700 !important;
        cursor: pointer !important; pointer-events: auto !important;
        opacity: 0; transition: opacity 0.15s ease, background 0.15s ease !important;
        font-family: system-ui, sans-serif !important;
        box-shadow: 0 4px 16px rgba(0,0,0,.30) !important; white-space: nowrap !important;
      }
      [data-section]:hover > .builder-del-btn,
      [data-section][data-builder-active] > .builder-del-btn { opacity: 1 !important; }
      .builder-del-btn:hover { background: rgb(239,68,68) !important; }

      /* ── Free-move mode styles ── */
      [data-move-mode="1"] * { cursor: crosshair !important; }
      [data-move-mode="1"] a, [data-move-mode="1"] button { pointer-events: auto !important; }
      .builder-selected-el {
        outline: 2px solid #60a5fa !important;
        outline-offset: 2px;
      }
      .builder-move-handle {
        position: fixed !important; z-index: 99999 !important;
        background: #60a5fa !important; color: #0b0d13 !important;
        font-size: 11px !important; font-weight: 800 !important;
        padding: 3px 10px !important; border-radius: 6px 6px 0 0 !important;
        cursor: grab !important; pointer-events: auto !important;
        user-select: none !important; display: flex; align-items: center; gap: 5px;
        letter-spacing: 0.04em; white-space: nowrap;
      }
      .builder-move-handle:active { cursor: grabbing !important; }
      .builder-resize-handle {
        position: fixed !important; z-index: 99999 !important;
        width: 18px !important; height: 18px !important;
        background: #60a5fa !important; border-radius: 0 0 4px 0 !important;
        cursor: se-resize !important; pointer-events: auto !important;
      }
      .builder-info-bar {
        position: fixed !important; z-index: 99999 !important;
        background: rgba(15,17,23,0.92) !important; color: #60a5fa !important;
        font-size: 10px !important; font-weight: 700 !important;
        padding: 3px 8px !important; border-radius: 4px !important;
        pointer-events: none !important; white-space: nowrap;
        border: 1px solid #60a5fa33 !important;
      }
    `
    document.head.appendChild(styleEl)

    // ── Section click → parent (existing feature) ─────────────────────────
    function nearestSection(el: Element | null): Element | null {
      while (el) {
        if (el.hasAttribute('data-section')) return el
        el = el.parentElement
      }
      return null
    }

    // ── Delete buttons (existing feature) ─────────────────────────────────
    function injectDeleteBtns() {
      document.querySelectorAll('[data-section]').forEach(section => {
        if (section.querySelector('.builder-del-btn')) return
        const id = section.getAttribute('data-section')!
        const btn = document.createElement('button')
        btn.className = 'builder-del-btn'
        btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg><span>Delete</span>`
        btn.onclick = e => { e.stopPropagation(); e.preventDefault(); window.parent.postMessage({ type: 'delete-section', id }, '*') }
        ;(section as HTMLElement).style.position = 'relative'
        section.appendChild(btn)
      })
    }
    injectDeleteBtns()

    // ── Free-move system ──────────────────────────────────────────────────
    let selectedEl: HTMLElement | null = null
    let moveHandleEl: HTMLElement | null = null
    let resizeHandleEl: HTMLElement | null = null
    let infoBarEl: HTMLElement | null = null
    let currentOverrides: Record<string, { x: number; y: number; w?: number; h?: number }> = {}
    let moveMode = false

    function getOverride(selector: string) {
      return currentOverrides[selector] ?? { x: 0, y: 0 }
    }

    function positionHandles(el: HTMLElement) {
      const rect = el.getBoundingClientRect()
      if (moveHandleEl) {
        moveHandleEl.style.top    = `${rect.top - 24}px`
        moveHandleEl.style.left   = `${rect.left}px`
      }
      if (resizeHandleEl) {
        resizeHandleEl.style.top  = `${rect.bottom - 18}px`
        resizeHandleEl.style.left = `${rect.right  - 18}px`
      }
      if (infoBarEl) {
        const ov = dragRef.current ? { x: dragRef.current.origX + (dragRef.current.type === 'move' ? 0 : 0), y: 0 } : getOverride(getSelectorPath(el))
        infoBarEl.style.top  = `${rect.top - 44}px`
        infoBarEl.style.left = `${rect.left}px`
        infoBarEl.textContent = `x:${Math.round(ov.x ?? 0)}  y:${Math.round(ov.y ?? 0)}  w:${Math.round(rect.width)}  h:${Math.round(rect.height)}`
      }
    }

    function createHandles(el: HTMLElement) {
      removeHandles()
      moveHandleEl   = document.createElement('div')
      resizeHandleEl = document.createElement('div')
      infoBarEl      = document.createElement('div')
      moveHandleEl.className   = 'builder-move-handle'
      resizeHandleEl.className = 'builder-resize-handle'
      infoBarEl.className      = 'builder-info-bar'
      moveHandleEl.innerHTML   = '✥ MOVE'
      document.body.appendChild(moveHandleEl)
      document.body.appendChild(resizeHandleEl)
      document.body.appendChild(infoBarEl)
      positionHandles(el)

      moveHandleEl.addEventListener('mousedown', e => startDrag(e, el, 'move'))
      resizeHandleEl.addEventListener('mousedown', e => startDrag(e, el, 'resize-se'))
    }

    function removeHandles() {
      moveHandleEl?.remove(); moveHandleEl = null
      resizeHandleEl?.remove(); resizeHandleEl = null
      infoBarEl?.remove(); infoBarEl = null
    }

    function selectElement(el: HTMLElement) {
      if (selectedEl) selectedEl.classList.remove('builder-selected-el')
      selectedEl = el
      el.classList.add('builder-selected-el')
      createHandles(el)
      window.parent.postMessage({ type: 'element-selected', tag: el.tagName, text: el.textContent?.slice(0, 40) }, '*')
    }

    function deselectAll() {
      if (selectedEl) { selectedEl.classList.remove('builder-selected-el'); selectedEl = null }
      removeHandles()
      dragRef.current = null
    }

    function startDrag(e: MouseEvent, el: HTMLElement, type: 'move' | 'resize-se') {
      e.stopPropagation(); e.preventDefault()
      const selector = getSelectorPath(el)
      const ov = getOverride(selector)
      const rect = el.getBoundingClientRect()
      dragRef.current = {
        el, selector, type,
        startX: e.clientX, startY: e.clientY,
        origX: ov.x ?? 0,  origY: ov.y ?? 0,
        origW: rect.width,  origH: rect.height,
      }
    }

    function applyTransform(el: HTMLElement, x: number, y: number, w?: number, h?: number) {
      el.style.position  = 'relative'
      el.style.transform = `translate(${x}px, ${y}px)`
      el.style.zIndex    = '10'
      if (w != null) el.style.width  = `${w}px`
      if (h != null) el.style.height = `${h}px`
    }

    // Click to select any element in move mode
    function clickHandler(e: MouseEvent) {
      const target = e.target as HTMLElement
      if (target.closest('.builder-del-btn') || target.closest('.builder-move-handle') || target.closest('.builder-resize-handle')) return

      if (moveMode) {
        e.preventDefault(); e.stopPropagation()
        selectElement(target)
        return
      }

      // Original section-click behaviour
      const section = nearestSection(target)
      if (!section) return
      e.preventDefault(); e.stopPropagation()
      document.querySelectorAll('[data-section]').forEach(s => s.removeAttribute('data-builder-active'))
      section.setAttribute('data-builder-active', '1')
      window.parent.postMessage({ type: 'section-click', id: section.getAttribute('data-section') }, '*')
    }

    // Global mousemove for drag
    function mousemoveHandler(e: MouseEvent) {
      const d = dragRef.current
      if (!d) return
      const dx = e.clientX - d.startX
      const dy = e.clientY - d.startY

      if (d.type === 'move') {
        const newX = d.origX + dx
        const newY = d.origY + dy
        applyTransform(d.el, newX, newY)
        if (infoBarEl) positionHandles(d.el)
      } else {
        const newW = Math.max(40, d.origW + dx)
        const newH = Math.max(30, d.origH + dy)
        applyTransform(d.el, d.origX, d.origY, newW, newH)
        if (resizeHandleEl) positionHandles(d.el)
      }
    }

    // Global mouseup → save override
    function mouseupHandler(e: MouseEvent) {
      const d = dragRef.current
      if (!d) return
      const dx = e.clientX - d.startX
      const dy = e.clientY - d.startY

      let entry: { x: number; y: number; w?: number; h?: number }
      if (d.type === 'move') {
        entry = { x: d.origX + dx, y: d.origY + dy }
        const prev = currentOverrides[d.selector]
        if (prev?.w != null) entry.w = prev.w
        if (prev?.h != null) entry.h = prev.h
      } else {
        const prev = currentOverrides[d.selector] ?? { x: 0, y: 0 }
        entry = { x: prev.x ?? 0, y: prev.y ?? 0, w: Math.max(40, d.origW + dx), h: Math.max(30, d.origH + dy) }
      }
      currentOverrides[d.selector] = entry
      dragRef.current = null

      if (selectedEl) positionHandles(selectedEl)

      // Send to parent to persist
      window.parent.postMessage({
        type: 'save-element-override',
        selector: d.selector,
        override: entry,
      }, '*')
    }

    document.addEventListener('click',     clickHandler,     true)
    document.addEventListener('mousemove', mousemoveHandler)
    document.addEventListener('mouseup',   mouseupHandler)

    // ── Messages from parent ──────────────────────────────────────────────
    function msgHandler(e: MessageEvent) {
      if (e.data?.type === 'highlight-section') {
        document.querySelectorAll('[data-section]').forEach(s => s.removeAttribute('data-builder-active'))
        document.querySelector(`[data-section="${e.data.id}"]`)?.setAttribute('data-builder-active', '1')
      }
      if (e.data?.type === 'scroll-to-section') {
        document.querySelector(`[data-section="${e.data.id}"]`)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
      if (e.data?.type === 'delete-section') {
        const id = e.data.id as string
        setSections((prev: { id: string }[]) => prev.filter((s: { id: string }) => s.id !== id))
        // Re-signal to parent so it deduplicates
        window.parent.postMessage({ type: 'delete-section-ack', id }, '*')
      }
      if (e.data?.type === 'inject-delete-btns') injectDeleteBtns()

      // Toggle move mode
      if (e.data?.type === 'set-move-mode') {
        moveMode = e.data.enabled as boolean
        modeRef.current = moveMode ? 'drag' : 'select'
        document.body.setAttribute('data-move-mode', moveMode ? '1' : '0')
        if (!moveMode) deselectAll()
      }
      // Load existing overrides into local state so dragging accumulates correctly
      if (e.data?.type === 'load-overrides') {
        try { currentOverrides = JSON.parse(e.data.overrides ?? '{}') } catch {}
        // Re-apply transforms
        for (const [selector, ov] of Object.entries(currentOverrides) as [string, { x: number; y: number; w?: number; h?: number }][]) {
          try {
            const el = document.querySelector(selector) as HTMLElement | null
            if (el) applyTransform(el, ov.x ?? 0, ov.y ?? 0, ov.w, ov.h)
          } catch {}
        }
      }
      // Reset one element
      if (e.data?.type === 'reset-element') {
        const selector = e.data.selector as string
        delete currentOverrides[selector]
        try {
          const el = document.querySelector(selector) as HTMLElement | null
          if (el) {
            el.style.transform = ''; el.style.position = ''; el.style.width = ''; el.style.height = ''
          }
        } catch {}
        if (selectedEl) { deselectAll() }
      }
      // Reset all overrides
      if (e.data?.type === 'reset-all-overrides') {
        for (const [selector] of Object.entries(currentOverrides)) {
          try {
            const el = document.querySelector(selector) as HTMLElement | null
            if (el) { el.style.transform = ''; el.style.position = ''; el.style.width = ''; el.style.height = '' }
          } catch {}
        }
        currentOverrides = {}
        deselectAll()
      }
    }
    window.addEventListener('message', msgHandler)

    // Scroll → reposition handles
    function scrollHandler() { if (selectedEl) positionHandles(selectedEl) }
    window.addEventListener('scroll', scrollHandler, { passive: true })

    return () => {
      document.removeEventListener('click',     clickHandler,     true)
      document.removeEventListener('mousemove', mousemoveHandler)
      document.removeEventListener('mouseup',   mouseupHandler)
      window.removeEventListener('message',     msgHandler)
      window.removeEventListener('scroll',      scrollHandler)
      document.body.removeAttribute('data-builder')
      document.body.removeAttribute('data-move-mode')
      document.querySelectorAll('.builder-del-btn').forEach(b => b.remove())
      removeHandles()
      styleEl.remove()
    }
  }, [isBuilder])

  if (!isBuilder) return null
  return null
}

// stub so the import doesn't fail
function setSections(_fn: unknown) {}
