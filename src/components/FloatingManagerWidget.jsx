import { useEffect, useState, useRef, useCallback } from 'react'
import { FiPlus, FiEye, FiEyeOff, FiMove, FiX } from 'react-icons/fi'
import { BsGear } from "react-icons/bs";

const COLLAPSED_W = 44
const COLLAPSED_H = 44
const BAR_EXPANDED_W = 215
const BAR_EXPANDED_H = 44

// Circular layout: buttons in arc above-left of gear
const RADIUS = 70
const CIRCULAR_SIZE = 120 // fixed window size — no resize on expand/collapse
// Angles in degrees (math coords: 0=right, CCW positive)
// Arc from 90° (up) to 180° (left) — buttons fan out above-left of gear
const CIRCULAR_ANGLES = [90, 120, 150, 180]

export default function FloatingManagerWidget() {
  const [expanded, setExpanded] = useState(false)
  const [notesVisible, setNotesVisible] = useState(true)
  const [layout, setLayout] = useState('bar')
  const collapseTimer = useRef(null)

  // Load layout preference from settings
  useEffect(() => {
    window.electronAPI.loadSettings().then((settings) => {
      if (settings?.managerLayout) {
        setLayout(settings.managerLayout)
      }
    })

    // Listen for settings changes from main app
    if (window.electronAPI.onNotesUpdated) {
      // Settings may be broadcast alongside notes
    }
  }, [])

  // Resize window when layout changes (circular needs fixed size)
  useEffect(() => {
    if (layout === 'circular') {
      // Fixed size — no resize on expand/collapse, eliminates gear jump
      window.electronAPI.resizeManagerWindow(CIRCULAR_SIZE, CIRCULAR_SIZE)
    }
  }, [layout])

  // Resize window on expand/collapse (bar mode only)
  useEffect(() => {
    if (layout === 'bar') {
      const w = expanded ? BAR_EXPANDED_W : COLLAPSED_W
      window.electronAPI.resizeManagerWindow(w, BAR_EXPANDED_H)
    }

    if (expanded) {
      collapseTimer.current = setTimeout(() => setExpanded(false), 6000)
      return () => clearTimeout(collapseTimer.current)
    }
  }, [expanded, layout])

  function resetCollapseTimer() {
    if (collapseTimer.current) clearTimeout(collapseTimer.current)
    collapseTimer.current = setTimeout(() => setExpanded(false), 6000)
  }

  const handleMouseDown = useCallback(async (e) => {
    if (expanded && e.target.closest('button')) return
    e.preventDefault()

    const startPos = await window.electronAPI.startWindowDrag()
    if (!startPos) return

    const startMouseX = e.screenX
    const startMouseY = e.screenY
    let moved = false

    const onMouseMove = (ev) => {
      const dx = ev.screenX - startMouseX
      const dy = ev.screenY - startMouseY
      if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
        moved = true
        window.electronAPI.moveWindowDrag(dx, dy)
      }
    }

    const onMouseUp = async () => {
      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseup', onMouseUp)
      if (!moved) {
        if (layout === 'bar') {
          // Pre-resize for bar mode
          const willExpand = !expanded
          const w = willExpand ? BAR_EXPANDED_W : COLLAPSED_W
          await window.electronAPI.resizeManagerWindow(w, BAR_EXPANDED_H)
        }
        setExpanded(prev => !prev)
      }
    }

    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseup', onMouseUp)
  }, [expanded, layout])

  // Shared button definitions
  const actionButtons = [
    {
      icon: <FiPlus size={16} />,
      title: 'Create Note',
      onClick: () => { resetCollapseTimer(); window.electronAPI.createQuickNoteWindow() },
    },
    {
      icon: notesVisible ? <FiEye size={16} /> : <FiEyeOff size={16} />,
      title: notesVisible ? 'Hide Notes' : 'Show Notes',
      onClick: async () => {
        resetCollapseTimer()
        const visible = await window.electronAPI.toggleNotesVisibility()
        setNotesVisible(visible)
      },
    },
    {
      icon: <FiMove size={16} />,
      title: 'Rearrange Notes',
      onClick: () => { resetCollapseTimer(); window.electronAPI.magnetNotes() },
    },
    {
      icon: <FiX size={16} />,
      title: 'Close Widget',
      onClick: () => window.electronAPI.closeFloatingManager(),
      isClose: true,
    },
  ]

  // ── Circular Layout ──
  if (layout === 'circular') {
    return (
      <div
        style={{
          width: '100vw',
          height: '100vh',
          position: 'relative',
          background: 'transparent',
          pointerEvents: 'none',
        }}
      >
        {/* Glow ring behind buttons */}
        {expanded && (
          <div
            style={{
              position: 'absolute',
              right: 22 - RADIUS,
              bottom: 22 - RADIUS,
              width: RADIUS * 2,
              height: RADIUS * 2,
              borderRadius: '50%',
              border: '1px solid rgba(34, 211, 238, 0.15)',
              boxShadow: '0 0 30px rgba(34, 211, 238, 0.08), inset 0 0 30px rgba(34, 211, 238, 0.05)',
              pointerEvents: 'none',
              animation: 'ringFadeIn 0.3s ease-out',
            }}
          />
        )}

        {/* Action buttons in arc */}
        {expanded && actionButtons.map((btn, i) => {
          const angleDeg = CIRCULAR_ANGLES[i]
          const angleRad = (angleDeg * Math.PI) / 180
          // Position relative to gear center (bottom-right corner: right=22, bottom=22)
          const cx = Math.cos(angleRad) * RADIUS
          const cy = Math.sin(angleRad) * RADIUS
          return (
            <button
              key={i}
              onClick={btn.onClick}
              title={btn.title}
              style={{
                position: 'absolute',
                right: 22 - cx - 18,
                bottom: 22 + cy - 18,
                width: 36,
                height: 36,
                borderRadius: '50%',
                background: btn.isClose
                  ? 'rgba(255, 60, 60, 0.9)'
                  : 'rgba(20, 26, 40, 0.95)',
                color: btn.isClose ? '#000' : '#fff',
                border: btn.isClose
                  ? '1px solid rgba(255, 80, 80, 0.4)'
                  : '1px solid rgba(34, 211, 238, 0.2)',
                boxShadow: btn.isClose
                  ? '0 0 12px rgba(255, 60, 60, 0.3)'
                  : '0 0 12px rgba(34, 211, 238, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                outline: 'none',
                pointerEvents: 'auto',
                animation: `circularPop 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) ${i * 0.06}s both`,
              }}
            >
              {btn.icon}
            </button>
          )
        })}

        {/* Center gear icon — always visible, bottom-right */}
        <div
          onMouseDown={handleMouseDown}
          style={{
            position: 'absolute',
            right: 2,
            bottom: 2,
            width: 40,
            height: 40,
            borderRadius: '50%',
            background: expanded
              ? 'linear-gradient(135deg, #22d3ee, #0891b2)'
              : 'linear-gradient(135deg, #22d3ee, #06b6d4)',
            color: '#000',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'grab',
            userSelect: 'none',
            pointerEvents: 'auto',
            boxShadow: expanded
              ? '0 0 20px rgba(34, 211, 238, 0.4), 0 0 40px rgba(34, 211, 238, 0.15)'
              : '0 0 8px rgba(34, 211, 238, 0.2)',
            transition: 'box-shadow 0.3s ease',
          }}
        >
          <BsGear
            size={16}
            style={{
              transition: 'transform 0.4s ease',
              transform: expanded ? 'rotate(90deg)' : 'rotate(0deg)',
            }}
          />
        </div>
      </div>
    )
  }

  // ── Bar Layout (default) ──
  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        background: 'transparent',
        pointerEvents: 'none',
      }}
    >
      <div
        className="widget-enter"
        onMouseDown={handleMouseDown}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: expanded ? 2 : 0,
          width: expanded ? 'fit-content' : 40,
          height: 40,
          borderRadius: 10,
          background: 'rgba(20, 26, 40, 0.95)',
          padding: 0,
          overflow: 'hidden',
          cursor: 'grab',
          userSelect: 'none',
          pointerEvents: 'auto',
          transition: 'width 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)',
        }}
      >
        {/* Main icon — always visible */}
        <div
          style={{
            width: 40,
            height: 40,
            minWidth: 40,
            borderRadius: 10,
            background: 'linear-gradient(135deg, #22d3ee, #06b6d4)',
            color: '#000',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <BsGear size={16} />
        </div>

        {expanded && (
          <>
            {actionButtons.filter(b => !b.isClose).map((btn, i) => (
              <button
                key={i}
                onClick={btn.onClick}
                style={{
                  width: 40, height: 40, minWidth: 40, borderRadius: 10,
                  background: 'rgba(255,255,255,0.08)', color: '#fff',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  border: 'none', cursor: 'pointer', outline: 'none',
                }}
                title={btn.title}
              >
                {btn.icon}
              </button>
            ))}

            <div style={{ width: 1, height: 24, background: 'rgba(255,255,255,0.1)', flexShrink: 0 }} />

            <button
              onClick={actionButtons.find(b => b.isClose).onClick}
              style={{
                width: 40, height: 40, minWidth: 40, borderRadius: 10,
                background: 'rgba(255, 0, 0, 1)', color: '#000000ff',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                border: 'none', cursor: 'pointer', outline: 'none',
              }}
              title="Close Widget"
            >
              <FiX size={16} />
            </button>
          </>
        )}
      </div>
    </div>
  )
}