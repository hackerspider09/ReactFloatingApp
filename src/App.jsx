import { useState, useEffect } from 'react'
import NoteFormModal from './components/NoteFormModal'
import NotePreviewModal from './components/NotePreviewModal'
import { SAMPLE_NOTES } from './data/notesData'
import NotePage from './page/NotePage'
import SettingsPage from './page/SettingsPage'

export default function App() {
  const [activePage, setActivePage] = useState('notes')
  const [notes, setNotes] = useState([])
  const [search, setSearch] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingNote, setEditingNote] = useState(null)
  const [openedNote, setOpenedNote] = useState(null)
  const [loaded, setLoaded] = useState(false)
  const [settings, setSettings] = useState({
    maxFloatingNotes: 5,
    confirmDelete: false,
  })

  const filteredNotes = notes.filter((note) =>
    note.title.toLowerCase().includes(search.toLowerCase())
  )
  
  useEffect(() => {
    async function load() {
      const savedSettings = await window.electronAPI.loadSettings()
      if (savedSettings) {
        setSettings(prev => ({ ...prev, ...savedSettings }))
      }

      const savedNotes = await window.electronAPI.loadNotes()

      // If savedNotes is null or undefined (first time), use samples
      // If it's an empty array, it means the user deleted all notes
      if (savedNotes && Array.isArray(savedNotes)) {
        if (savedNotes.length > 0) {
          setNotes(savedNotes)
        } else {
          // Check if we have actually initialized before
          // For now, let's just use a simple check: if it's an empty array, it's empty.
          // If it's null/undefined (not found in store), use samples.
          setNotes([])
        }
      } else {
        setNotes(SAMPLE_NOTES)
      }

      setLoaded(true)
    }

    load()
  }, [])

  useEffect(() => {
    if (!loaded) return

    window.electronAPI.saveNotes(notes)
  }, [notes, loaded])

  useEffect(() => {
    if (!loaded) return
    window.electronAPI.saveSettings(settings)
  }, [settings, loaded])

  function handleSaveNote(noteData) {
    if (editingNote) {
      setNotes((prev) =>
        prev.map((note) =>
          note.id === editingNote.id ? { ...note, ...noteData } : note
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

  function handleDeleteNote(id) {
    if (settings.confirmDelete) {
      if (confirm('Are you sure you want to delete this note?')) {
        setNotes((prev) => prev.filter((note) => note.id !== id))
      }
    } else {
      setNotes((prev) => prev.filter((note) => note.id !== id))
    }
  }

  async function handleRefreshNotes() {
    const savedNotes = await window.electronAPI.loadNotes()
    if (savedNotes) {
      setNotes(savedNotes)
    }
  }

  return (
    <div className="h-screen bg-[#10141F] text-white flex">
      {/* Sidebar */}
      <div className="w-64 bg-[#181F2E] border-r border-white/10 p-5 flex flex-col">
        <h1 className="text-2xl font-bold text-cyan-400 mb-8">
          Floating Notes
        </h1>

        <button
          onClick={() => setActivePage('notes')}
          className={`w-full text-left px-4 py-3 rounded-2xl mb-3 ${
            activePage === 'notes'
              ? 'bg-cyan-500/20 text-cyan-300'
              : 'hover:bg-white/5'
          }`}
        >
          Notes
        </button>

        <button className="w-full text-left px-4 py-3 rounded-2xl hover:bg-white/5 mb-3">
          Archived
        </button>

        <button
          onClick={() => setActivePage('settings')}
          className={`w-full text-left px-4 py-3 rounded-2xl mt-auto ${
            activePage === 'settings'
              ? 'bg-cyan-500/20 text-cyan-300'
              : 'hover:bg-white/5'
          }`}
        >
          Settings
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        {activePage === 'notes' ? (
          <NotePage
            notes={filteredNotes}
            search={search}
            onSearchChange={setSearch}
            onNewNote={() => {
              setEditingNote(null)
              setIsModalOpen(true)
            }}
            onOpenNote={(note) => setOpenedNote(note)}
            onEditNote={(note) => {
              setEditingNote(note)
              setIsModalOpen(true)
            }}
            onDeleteNote={handleDeleteNote}
            onRefresh={handleRefreshNotes}
          />
        ) : activePage === 'settings' ? (
          <SettingsPage settings={settings} onChange={setSettings} />
        ) : (
          <div className="flex-1 flex items-center justify-center p-8 text-white/70">
            Archived notes are coming soon.
          </div>
        )}

        <NoteFormModal
          open={isModalOpen}
          onClose={() => {
            setIsModalOpen(false)
            setEditingNote(null)
          }}
          onSave={handleSaveNote}
          initialData={editingNote}
        />

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