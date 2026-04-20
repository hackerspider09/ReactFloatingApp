import { useState } from 'react'
import NoteFormModal from './NoteFormModal'

export default function QuickNotePage() {
  const [open, setOpen] = useState(true)

  function handleSave(noteData) {
    window.electronAPI.loadNotes().then((notes) => {
      const updated = [
        {
          id: Date.now(),
          ...noteData,
        },
        ...notes,
      ]

      window.electronAPI.saveNotes(updated)
      window.close()
    })
  }

  return (
    <div
      className="w-screen h-screen bg-transparent flex items-center justify-center"
    >
      <div>
        <NoteFormModal
          open={open}
          onClose={() => window.close()}
          onSave={handleSave}
        />
      </div>
    </div>
  )
}