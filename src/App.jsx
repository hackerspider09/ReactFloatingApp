import { useState, useEffect } from 'react'
import NoteFormModal from './components/NoteFormModal'
import NotePreviewModal from './components/NotePreviewModal'
import { SAMPLE_NOTES } from './data/notesData'


export default function App() {
  const [notes, setNotes] = useState([])
  const [search, setSearch] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingNote, setEditingNote] = useState(null)
  const [openedNote, setOpenedNote] = useState(null)

  const filteredNotes = notes.filter((note) =>
    note.title.toLowerCase().includes(search.toLowerCase())
  )
  
  useEffect(() => {
    async function load() {
      const savedNotes = await window.electronAPI.loadNotes()

      if (savedNotes.length > 0) {
        setNotes(savedNotes)
      } else {
        setNotes(SAMPLE_NOTES)
      }
    }

    load()
  }, [])

  useEffect(() => {
    if (notes.length > 0) {
      window.electronAPI.saveNotes(notes)
    }
  }, [notes])

  function handleSaveNote(noteData) {
    if (editingNote) {
      setNotes((prev) =>
        prev.map((note) =>
          note.id === editingNote.id
            ? { ...note, ...noteData }
            : note
        )
      )
    } else {
      setNotes((prev) => [
        {
          id: Date.now(),
          ...noteData,
        },
        ...prev,
      ])
    }

    setEditingNote(null)
  }

  return (
    <div className="h-screen bg-[#10141F] text-white flex">
      {/* Sidebar */}
      <div className="w-64 bg-[#181F2E] border-r border-white/10 p-5 flex flex-col">
        <h1 className="text-2xl font-bold text-cyan-400 mb-8">
          Floating Notes
        </h1>

        <button className="w-full text-left px-4 py-3 rounded-2xl bg-cyan-500/20 text-cyan-300 mb-3">
          Notes
        </button>

        <button className="w-full text-left px-4 py-3 rounded-2xl hover:bg-white/5 mb-3">
          Archived
        </button>

        <button className="w-full text-left px-4 py-3 rounded-2xl hover:bg-white/5 mt-auto">
          Settings
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col p-8 overflow-hidden">
        {/* Top Bar */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold">My Notes</h2>
            <p className="text-white/50 mt-1">
              Manage your floating notes here
            </p>
          </div>

          <button
            onClick={() => {
              setEditingNote(null)
              setIsModalOpen(true)
            }}
            className="px-5 py-3 rounded-2xl bg-cyan-400 text-black font-semibold hover:scale-105 transition"
          >
            + New Note
          </button>
        </div>

        {/* Search */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search notes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#181F2E] border border-white/10 rounded-2xl px-5 py-4 outline-none focus:border-cyan-400"
          />
        </div>

        {/* Notes Grid */}
        <div className="flex-1 overflow-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 m-1">
            {filteredNotes.map((note) => (
              <div
                key={note.id}
                className="rounded-3xl p-4 shadow-xl hover:scale-[1.02] transition h-[155px] flex flex-col"
                style={{ background: note.color }}
              >
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-lg font-bold text-black truncate line-clamp-1">
                    {note.title}
                  </h3>

                  <button className="text-black/60 hover:text-black">
                    ⋮
                  </button>
                </div>

                <p className="text-black/70 text-sm line-clamp-2 overflow-hidden flex-1">
                  {note.content}
                </p>


                <div className="mt-auto flex gap-2 pt-3">
                  <button
                    onClick={() => setOpenedNote(note)}
                    className="px-3 py-1.5 rounded-xl bg-black/10 text-black text-sm hover:bg-black/20"
                  >
                    Open
                  </button>

                  <button
                    onClick={() => {
                      setEditingNote(note)
                      setIsModalOpen(true)
                    }}
                    className="px-3 py-1.5 rounded-xl bg-black/10 text-black text-sm hover:bg-black/20"
                  >
                    Edit
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* Note form modal */}
        <NoteFormModal
          open={isModalOpen}
          onClose={() => {
            setIsModalOpen(false)
            setEditingNote(null)
          }}
          onSave={handleSaveNote}
          initialData={editingNote}
        />

        {/* Preview modal */}
        <NotePreviewModal
          open={!!openedNote}
          note={openedNote}
          onClose={() => setOpenedNote(null)}
          onEdit={(note) => {
            setOpenedNote(null)
            setEditingNote(note)
            setIsModalOpen(true)
          }}
        />
      </div>
    </div>
  )
}