import { useEffect, useState } from 'react'
import { FiPaperclip } from 'react-icons/fi'

export default function FloatingNoteWidget() {
  const [note, setNote] = useState(null)

  useEffect(() => {
    async function load() {
      const hashParts = window.location.hash.split('/')
      const id = Number(hashParts[hashParts.length - 1])
      const notes = await window.electronAPI.loadNotes()
      setNote(notes.find((n) => n.id === id) || null)
    }

    load()
  }, [])

  useEffect(() => {
    async function load() {
      const hashParts = window.location.hash.split('/')
      const id = Number(hashParts[hashParts.length - 1])
      const notes = await window.electronAPI.loadNotes()
      setNote(notes.find((n) => n.id === id) || null)
    }

    load()
  }, [])

  if (!note) return null

  return (
    <div className="w-full h-full flex items-center justify-center pointer-events-none" style={{ background: 'transparent' }}>
      <div className="pointer-events-auto">
        <div
          className="relative rounded-xl shadow-2xl overflow-hidden"
          style={{
            width: 70,
            height: 70,
            background: note.color,
            WebkitAppRegion: 'drag',
          }}
        >
          <button
            onClick={() => window.electronAPI.openFloatingNotePreview(note.id)}
            className="absolute inset-0 flex items-center justify-center text-black text-[11px] font-bold"
            style={{ WebkitAppRegion: 'no-drag', background: 'transparent', border: 'none' }}
          >
            <FiPaperclip size={18} />
          </button>
        </div>
      </div>
    </div>
  )
}