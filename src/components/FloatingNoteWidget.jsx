import { useEffect, useState } from 'react'

export default function FloatingNoteWidget() {
  const [note, setNote] = useState(null)

  useEffect(() => {
    async function load() {
      const id = Number(window.location.hash.split('/').pop())
      const notes = await window.electronAPI.loadNotes()
      const found = notes.find((n) => n.id === id)
      setNote(found)
    }

    load()
  }, [])

  if (!note) return null

  return (
    <div className="w-screen h-screen flex items-center justify-center p-2">
      <div
        className="w-[78px] h-[78px] rounded-3xl shadow-2xl border border-black/10 flex items-center justify-center cursor-pointer hover:scale-105 transition"
        style={{
          background: note.color,
          WebkitAppRegion: 'drag',
        }}
        onDoubleClick={() => {
          window.location.hash = `#/floating-note-open/${note.id}`
        }}
      >
        <div
          className="text-black text-xs font-bold text-center px-2 line-clamp-3"
          style={{ WebkitAppRegion: 'no-drag' }}
        >
          {note.title}
        </div>
      </div>
    </div>
  )
}