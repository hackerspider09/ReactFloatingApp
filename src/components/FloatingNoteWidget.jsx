import { useEffect, useState, useRef, useCallback } from 'react'

export default function FloatingNoteWidget() {
  const [note, setNote] = useState(null)
  const dragRef = useRef(null)

  useEffect(() => {
    async function load() {
      const hashParts = window.location.hash.split('/')
      const id = Number(hashParts[hashParts.length - 1])
      const notes = await window.electronAPI.loadNotes()
      setNote(notes.find((n) => n.id === id) || null)
    }

    load()

    const cleanup = window.electronAPI.onNotesUpdated((updatedNotes) => {
      const hashParts = window.location.hash.split('/')
      const id = Number(hashParts[hashParts.length - 1])
      const updated = updatedNotes.find((n) => n.id === id)
      if (updated) setNote(updated)
    })

    return cleanup
  }, [])

  const handleMouseDown = useCallback(async (e) => {
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
      if (!moved && note) {
        window.electronAPI.openFloatingNotePreview(note.id)
      }
    }

    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseup', onMouseUp)
  }, [note])

  if (!note) return null

  const initial = (note.title || '?')[0].toUpperCase()

  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'transparent',
        pointerEvents: 'none',
      }}
    >
      <div
        className="widget-enter"
        onMouseDown={handleMouseDown}
        style={{
          width: 40,
          height: 40,
          borderRadius: 10,
          background: note.color,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'grab',
          userSelect: 'none',
          pointerEvents: 'auto',
        }}
        title={note.title}
      >
        <span
          style={{
            fontSize: 16,
            fontWeight: 800,
            color: 'rgba(0,0,0,0.4)',
            fontFamily: 'Inter, system-ui, sans-serif',
            userSelect: 'none',
            lineHeight: 1,
            pointerEvents: 'none',
          }}
        >
          {initial}
        </span>
      </div>
    </div>
  )
}