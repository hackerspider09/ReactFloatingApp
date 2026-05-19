import { FiRefreshCw, FiPlus, FiMoreVertical } from 'react-icons/fi'

export default function NotePage({
  notes,
  search,
  onSearchChange,
  onNewNote,
  onOpenNote,
  onEditNote,
  onDeleteNote,
  onRefresh,
}) {
  return (
    <div className="flex-1 flex flex-col p-8 overflow-hidden">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">My Notes</h2>
          <p className="text-white/40 mt-1 text-sm">
            Manage your floating notes here
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onRefresh}
            className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white/70 font-medium hover:bg-white/10 transition flex items-center gap-2"
          >
            <FiRefreshCw size={14} />
            Refresh
          </button>
          <button
            onClick={onNewNote}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-cyan-500 text-black font-semibold hover:scale-105 transition shadow-lg shadow-cyan-500/20 flex items-center gap-2"
          >
            <FiPlus size={15} />
            New Note
          </button>
        </div>
      </div>

      <div className="mb-6">
        <input
          type="text"
          placeholder="Search notes..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full bg-[#181F2E] border border-white/10 rounded-xl px-5 py-3.5 outline-none focus:border-cyan-400/50 transition-colors text-sm placeholder:text-white/25"
        />
      </div>

      <div className="flex-1 overflow-auto custom-scrollbar">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 m-1">
          {notes.length > 0 ? (
            notes.map((note) => (
              <div
                key={note.id}
                className="note-card rounded-2xl p-5 flex flex-col cursor-default"
                style={{
                  background: note.color,
                  minHeight: 150,
                  boxShadow: `0 4px 16px -4px ${note.color}44`,
                }}
              >
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-base font-bold text-black truncate line-clamp-1 flex-1 mr-2">
                    {note.title}
                  </h3>

                  <button className="text-black/40 hover:text-black/70 transition-colors p-1 rounded-lg hover:bg-black/5">
                    <FiMoreVertical size={14} />
                  </button>
                </div>

                <p className="text-black/60 text-sm line-clamp-3 overflow-hidden flex-1 leading-relaxed">
                  {note.content}
                </p>

                <div className="mt-auto flex gap-2 pt-4">
                  <button
                    onClick={() => onOpenNote(note)}
                    className="px-3.5 py-1.5 rounded-lg bg-black/8 text-black/70 text-xs font-medium hover:bg-black/15 transition"
                  >
                    Open
                  </button>

                  <button
                    onClick={() => onEditNote(note)}
                    className="px-3.5 py-1.5 rounded-lg bg-black/8 text-black/70 text-xs font-medium hover:bg-black/15 transition"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => onDeleteNote(note.id)}
                    className="ml-auto px-3.5 py-1.5 rounded-lg bg-red-500/15 text-red-600/80 text-xs font-medium hover:bg-red-500/25 transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full rounded-2xl bg-[#181F2E] border border-white/10 p-10 text-center text-white/40 text-sm">
              No notes found. Create a new note to get started.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
