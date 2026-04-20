import { useEffect, useState } from 'react'
import NoteFormModal from './NoteFormModal'

export default function FloatingNotePreview() {
  const [note, setNote] = useState(null)
  const [settings, setSettings] = useState({ confirmDelete: false })
  const [isEditing, setIsEditing] = useState(false)

  useEffect(() => {
    async function load() {
      const hashParts = window.location.hash.split('/')
      const id = Number(hashParts[hashParts.length - 1])
      const notes = await window.electronAPI.loadNotes()
      setNote(notes.find((n) => n.id === id) || null)

      const savedSettings = await window.electronAPI.loadSettings()
      if (savedSettings) {
        setSettings(prev => ({ ...prev, ...savedSettings }))
      }
    }

    load()
  }, [])

  useEffect(() => {
    if (window.electronAPI.onNotesUpdated) {
      window.electronAPI.onNotesUpdated((updatedNotes) => {
        if (!note) return
        const updatedSelf = updatedNotes.find((n) => n.id === note.id)
        if (updatedSelf) {
          setNote(updatedSelf)
        } else {
          // If note is gone, close window
          window.close()
        }
      })
    }
  }, [note])

  async function handleSave(updatedData) {
    try {
      const notes = await window.electronAPI.loadNotes()
      const updatedNotes = notes.map((n) =>
        n.id === note.id ? { ...n, ...updatedData } : n
      )

      await window.electronAPI.saveNotes(updatedNotes)
      setNote({ ...note, ...updatedData })
      setIsEditing(false)
    } catch (err) {
      console.error('Failed to save note:', err)
    }
  }

  async function handleDelete() {
    const deleteAction = async () => {
      try {
        const notes = await window.electronAPI.loadNotes()
        const updatedNotes = notes.filter((n) => n.id !== note.id)
        await window.electronAPI.saveNotes(updatedNotes)
        window.close()
      } catch (err) {
        console.error('Failed to delete note:', err)
      }
    }

    if (settings.confirmDelete) {
      if (confirm('Are you sure you want to delete this note?')) {
        await deleteAction()
      }
    } else {
      await deleteAction()
    }
  }

  if (!note) return null

  return (
    <div className="w-full h-full flex items-center justify-center p-4 overflow-hidden" style={{ background: 'transparent' }}>
      <div
        className="w-[550px] max-w-[90vw] rounded-3xl shadow-2xl overflow-hidden"
        style={{ background: note.color }}
      >
        {isEditing ? (
          <NoteFormModal
            open={isEditing}
            embedded
            onClose={() => setIsEditing(false)}
            onSave={handleSave}
            initialData={note}
          />
        ) : (
          <>
            <div className="flex items-start justify-between p-6" style={{ WebkitAppRegion: 'drag' }}>
              <div>
                <h2 className="text-3xl font-bold text-black">{note.title}</h2>
              </div>

              <button
                onClick={() => window.close()}
                className="w-10 h-10 rounded-xl hover:bg-black/10 text-black px-2 mt-1"
                style={{ WebkitAppRegion: 'no-drag' }}
              >
                ✕
              </button>
            </div>

            <div className="px-6 pb-6" style={{ WebkitAppRegion: 'no-drag' }}>
              <div 
                className="text-black/80 overflow-y-auto custom-scrollbar whitespace-pre-wrap leading-7"
                style={{ maxHeight: '300px' }}
              >
                {note.content}
              </div>
            </div>

            <div className="flex justify-end gap-3 px-6 pb-6" style={{ WebkitAppRegion: 'no-drag' }}>
              <button
                onClick={() => setIsEditing(true)}
                className="px-5 py-2.5 rounded-2xl bg-black/10 text-black hover:bg-black/20"
              >
                Edit
              </button>

              <button
                onClick={handleDelete}
                className="mr-auto px-5 py-2.5 rounded-2xl bg-red-500/20 text-red-500 hover:bg-red-500/30 transition"
              >
                Delete
              </button>

              <button
                onClick={() => window.close()}
                className="px-5 py-2.5 rounded-2xl bg-black text-white hover:opacity-90"
              >
                Close
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
