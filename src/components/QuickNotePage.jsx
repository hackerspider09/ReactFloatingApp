import { useState } from 'react'
import NoteFormModal from './NoteFormModal'

export default function QuickNotePage() {
  const [open, setOpen] = useState(true)

  async function handleSave(noteData) {
  console.log('saving note', noteData)

  try {
    const notes = await window.electronAPI.loadNotes()
    console.log('loaded notes', notes)

    const updated = [
      {
        id: Date.now(),
        ...noteData,
      },
      ...notes,
    ]

    console.log('saving updated', updated)

    await window.electronAPI.saveNotes(updated)

    console.log('saved successfully')

    // window.close()
  } catch (err) {
    console.error('save failed', err)
  }
}

  return (
  <div
    className="w-screen h-screen flex items-center justify-center"
    style={{ WebkitAppRegion: 'drag' }}
  >
    <div style={{ WebkitAppRegion: 'no-drag' }}>
      <NoteFormModal
        open={open}
        embedded
        onClose={() => window.close()}
        onSave={handleSave}
      />
    </div>
  </div>
)
}