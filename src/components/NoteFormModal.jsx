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
    <div
      className={
        embedded
          ? 'w-full h-full flex items-center justify-center'
          : 'fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50'
      }
    >
      <div
        className="w-[550px] max-w-[90vw] rounded-3xl p-6 shadow-2xl overflow-hidden"
        style={{ 
          background: color || NOTE_COLORS[0],
          border: embedded ? 'none' : '1px solid rgba(0,0,0,0.05)',
          WebkitAppRegion: embedded ? 'drag' : 'none'
        }}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold text-black">
            {initialData ? 'Edit Note' : 'Create Note'}
          </h2>

          <button
            onClick={onClose}
            className="w-10 h-10 rounded-xl hover:bg-black/10 text-black"
            style={{ WebkitAppRegion: 'no-drag' }}
          >
            ✕
          </button>
        </div>

        <div className="space-y-4 pr-1">
          <div>
            <p className="text-black/60 mb-2 text-sm ml-1">Title</p>
            <input
              type="text"
              placeholder="Note title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-black/5 border-black/5 rounded-2xl px-4 py-3 text-black outline-none focus:border-black/20 border placeholder:text-black/30"
              style={{ WebkitAppRegion: 'no-drag' }}
            />
          </div>

          <div>
            <p className="text-black/60 mb-2 text-sm ml-1">Content</p>
            <textarea
              placeholder="Write your note..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={8}
              className="w-full bg-black/5 border-black/5 rounded-2xl px-4 py-3 text-black outline-none resize-none focus:border-black/20 border placeholder:text-black/30 custom-scrollbar"
              style={{ WebkitAppRegion: 'no-drag' }}
            />
          </div>

          <div>
            <p className="text-black/60 mb-3 text-sm ml-1">Theme Color</p>

            <div className="flex gap-3 flex-wrap">
              {NOTE_COLORS.map((c) => (
                <button
                  key={c}
                  onClick={() => setColor(c)}
                  className={`w-8 h-8 rounded-full border-2 transition ${
                    color === c
                      ? 'border-black scale-110'
                      : 'border-transparent'
                  }`}
                  style={{ background: c, WebkitAppRegion: 'no-drag' }}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-8">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-2xl bg-black/10 hover:bg-black/20 text-black transition"
            style={{ WebkitAppRegion: 'no-drag' }}
          >
            Cancel
          </button>

          <button
            onClick={handleSave}
            className="px-5 py-2.5 rounded-2xl bg-black text-white font-semibold hover:scale-105 transition"
            style={{ WebkitAppRegion: 'no-drag' }}
          >
            {initialData ? 'Save Changes' : 'Create Note'}
          </button>
        </div>
      </div>
    </div>
  )
}