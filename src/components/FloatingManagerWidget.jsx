import { useEffect, useState, useRef, useCallback } from 'react'
import { FiPlus, FiEye, FiMove, FiX } from 'react-icons/fi'
import { HiSparkles } from 'react-icons/hi2'

export default function FloatingManagerWidget() {
  const [expanded, setExpanded] = useState(false)
  const collapseTimer = useRef(null)

  useEffect(() => {
    if (expanded) {
      collapseTimer.current = setTimeout(() => setExpanded(false), 6000)
      return () => clearTimeout(collapseTimer.current)
    }
  }, [expanded])

  function resetCollapseTimer() {
    if (collapseTimer.current) clearTimeout(collapseTimer.current)
    collapseTimer.current = setTimeout(() => setExpanded(false), 6000)
  }

  const handleMouseDown = useCallback(async (e) => {
    // If expanded and clicking a button, let the button handle it
    if (expanded && e.target.closest('button')) return

    e.preventDefault()

    // Get window position via IPC (correct coordinate system)
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

    const onMouseUp = () => {
      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseup', onMouseUp)
      if (!moved) {
        setExpanded((prev) => !prev)
      }
    }

    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseup', onMouseUp)
  }, [expanded])

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
          gap: expanded ? 4 : 0,
          width: expanded ? 248 : 40,
          height: 40,
          borderRadius: 10,
          background: 'rgba(20, 26, 40, 0.95)',
          padding: expanded ? '0 6px' : 0,
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
            width: expanded ? 28 : 40,
            height: expanded ? 28 : 40,
            minWidth: expanded ? 28 : 40,
            borderRadius: expanded ? 8 : 10,
            background: 'linear-gradient(135deg, #22d3ee, #06b6d4)',
            color: '#000',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            transition: 'width 0.2s ease, height 0.2s ease, min-width 0.2s ease, border-radius 0.2s ease',
          }}
        >
          <HiSparkles size={expanded ? 13 : 16} />
        </div>

        {expanded && (
          <>
            <button
              onClick={() => { resetCollapseTimer(); window.electronAPI.createQuickNoteWindow() }}
              style={{
                width: 28, height: 28, minWidth: 28, borderRadius: 8,
                background: 'rgba(255,255,255,0.08)', color: '#fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                border: 'none', cursor: 'pointer', outline: 'none',
              }}
              title="Create Note"
            >
              <FiPlus size={13} />
            </button>

            <button
              onClick={() => { resetCollapseTimer(); window.electronAPI.toggleNotesVisibility() }}
              style={{
                width: 28, height: 28, minWidth: 28, borderRadius: 8,
                background: 'rgba(255,255,255,0.08)', color: '#fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                border: 'none', cursor: 'pointer', outline: 'none',
              }}
              title="Show / Hide Notes"
            >
              <FiEye size={13} />
            </button>

            <button
              onClick={() => { resetCollapseTimer(); window.electronAPI.magnetNotes() }}
              style={{
                width: 28, height: 28, minWidth: 28, borderRadius: 8,
                background: 'rgba(255,255,255,0.08)', color: '#fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                border: 'none', cursor: 'pointer', outline: 'none',
              }}
              title="Rearrange Notes"
            >
              <FiMove size={13} />
            </button>

            <div style={{ width: 1, height: 18, background: 'rgba(255,255,255,0.08)', flexShrink: 0 }} />

            <button
              onClick={() => window.electronAPI.closeFloatingManager()}
              style={{
                width: 28, height: 28, minWidth: 28, borderRadius: 8,
                background: 'rgba(239,68,68,0.12)', color: '#fca5a5',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                border: 'none', cursor: 'pointer', outline: 'none',
              }}
              title="Close Widget"
            >
              <FiX size={13} />
            </button>
          </>
        )}
      </div>
    </div>
  )
}