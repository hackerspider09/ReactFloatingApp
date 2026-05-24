import { useEffect, useState, useRef, useCallback } from 'react'
import { FiPlus, FiEye, FiEyeOff, FiMove, FiX } from 'react-icons/fi'
import { BsGear } from "react-icons/bs";

export default function FloatingManagerWidget() {
  const [expanded, setExpanded] = useState(false)
  const [notesVisible, setNotesVisible] = useState(true)
  const collapseTimer = useRef(null)

  // Collapsed = gear icon only, Expanded = all buttons + divider + gaps
  // gear(40) + 4 btns(40ea) + divider(1) + 5 gaps(2ea) = 211, + 4px padding
  const COLLAPSED_W = 44
  const EXPANDED_W = 215

  useEffect(() => {
    // Resize the BrowserWindow to match widget state
    const w = expanded ? EXPANDED_W : COLLAPSED_W
    window.electronAPI.resizeManagerWindow(w)

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
            <button
              onClick={() => { resetCollapseTimer(); window.electronAPI.createQuickNoteWindow() }}
              style={{
                width: 40, height: 40, minWidth: 40, borderRadius: 10,
                background: 'rgba(255,255,255,0.08)', color: '#fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                border: 'none', cursor: 'pointer', outline: 'none',
              }}
              title="Create Note"
            >
              <FiPlus size={16} />
            </button>

            <button
              onClick={async () => {
                resetCollapseTimer()
                const visible = await window.electronAPI.toggleNotesVisibility()
                setNotesVisible(visible)
              }}
              style={{
                width: 40, height: 40, minWidth: 40, borderRadius: 10,
                background: 'rgba(255,255,255,0.08)', color: '#fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                border: 'none', cursor: 'pointer', outline: 'none',
              }}
              title={notesVisible ? 'Hide Notes' : 'Show Notes'}
            >
              {notesVisible ? <FiEye size={16} /> : <FiEyeOff size={16} />}
            </button>

            <button
              onClick={() => { resetCollapseTimer(); window.electronAPI.magnetNotes() }}
              style={{
                width: 40, height: 40, minWidth: 40, borderRadius: 10,
                background: 'rgba(255,255,255,0.08)', color: '#fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                border: 'none', cursor: 'pointer', outline: 'none',
              }}
              title="Rearrange Notes"
            >
              <FiMove size={16} />
            </button>

            <div style={{ width: 1, height: 24, background: 'rgba(255,255,255,0.1)', flexShrink: 0 }} />

            <button
              onClick={() => window.electronAPI.closeFloatingManager()}
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