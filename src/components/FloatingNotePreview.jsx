import { useEffect, useState } from 'react'

export default function FloatingNotePreview() {
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

  if (!note) return null

  return (
    <div className="w-full h-full flex items-center justify-center p-4 overflow-hidden" style={{ background: 'transparent' }}>
      <div
        className="w-full max-w-130  rounded-3xl shadow-2xl overflow-hidden"
        style={{ background: note.color }}
      >
        <div className="flex items-center justify-between p-5" style={{ WebkitAppRegion: 'drag' }}>
          <div>
            <h2 className="text-2xl font-bold text-black">{note.title}</h2>
            <p className="text-black/60 text-sm">Floating note details</p>
          </div>

          <button
            onClick={() => window.close()}
            className="w-10 h-10 rounded-2xl bg-black/10 text-black hover:bg-black/20"
            style={{ WebkitAppRegion: 'no-drag' }}
          >
            ✕
          </button>
        </div>

        <div className="px-5 pb-5">
          <div className="rounded-3xl bg-white/80 p-4 text-black/80 max-h-90 overflow-auto custom-scrollbar whitespace-pre-wrap leading-7">
            {note.content}
          </div>
        </div>

        <div className="flex justify-end gap-3 px-5 pb-5" style={{ WebkitAppRegion: 'no-drag' }}>
          <button
            onClick={() => window.close()}
            className="px-5 py-2.5 rounded-2xl bg-black/10 text-black hover:bg-black/20"
          >
            Close
          </button>

          <button
            onClick={() => window.close()}
            className="px-5 py-2.5 rounded-2xl bg-black text-white hover:opacity-90"
          >
            Edit
          </button>
        </div>
      </div>
    </div>
  )
}
