import { useEffect, useState } from 'react'
import { NOTE_COLORS } from '../data/notesData'

export default function NoteFormModal({
  open,
  onClose,
  onSave,
  initialData = null,
  embedded = false,
}) {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [color, setColor] = useState(NOTE_COLORS[0])

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || '')
      setContent(initialData.content || '')
      setColor(initialData.color || NOTE_COLORS[0])
    } else {
      setTitle('')
      setContent('')
      setColor(NOTE_COLORS[0])
    }
  }, [initialData, open])

  if (!open) return null

  async function handleSave() {
    if (!title.trim()) return

    try {
      await onSave({
        ...initialData,
        title,
        content,
        color,
      })

      onClose()
    } catch (err) {
      console.error('Failed to save note:', err)
      // Optionally show an error message to the user
    }
  }

  return (
    // <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
    <div
    className={
      embedded
        ? 'w-full h-full flex items-center justify-center'
        : 'fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50'
    }
  >
      <div
  className="w-[500px] max-w-[90vw] bg-[#181F2E] rounded-3xl p-6 border border-white/10 shadow-2xl"
  style={embedded ? { WebkitAppRegion: 'drag' } : {}}
>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">
            {initialData ? 'Edit Note' : 'Create Note'}
          </h2>

          <button
            onClick={onClose}
            className="w-10 h-10 rounded-xl hover:bg-white/10 text-white"
            style={{ WebkitAppRegion: 'no-drag' }}
          >
            ✕
          </button>
        </div>

        <div className="space-y-4">
          <input
            type="text"
            placeholder="Note title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-[#10141F] border border-white/10 rounded-2xl px-4 py-3 text-white outline-none focus:border-cyan-400"
            style={{ WebkitAppRegion: 'no-drag' }}
          />

          <textarea
            placeholder="Write your note..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={6}
            className="w-full bg-[#10141F] border border-white/10 rounded-2xl px-4 py-3 text-white outline-none resize-none focus:border-cyan-400"
            style={{ WebkitAppRegion: 'no-drag' }}
          />

          <div>
            <p className="text-white/60 mb-3 text-sm">Color</p>

            <div className="flex gap-3 flex-wrap">
              {NOTE_COLORS.map((c) => (
                <button
                  key={c}
                  onClick={() => setColor(c)}
                  className={`w-8 h-8 rounded-full border-2 transition ${
                    color === c
                      ? 'border-white scale-110'
                      : 'border-transparent'
                  }`}
                  style={{ background: c,WebkitAppRegion: 'no-drag' }}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-8">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white"
            style={{ WebkitAppRegion: 'no-drag' }}
          >
            Cancel
          </button>

          <button
            onClick={handleSave}
            className="px-5 py-2.5 rounded-2xl bg-cyan-400 text-black font-semibold hover:scale-105 transition"
            style={{ WebkitAppRegion: 'no-drag' }}
          >
            {initialData ? 'Save Changes' : 'Create Note'}
          </button>
        </div>
      </div>
    </div>
  )
}