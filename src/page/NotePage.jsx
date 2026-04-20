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
          <h2 className="text-3xl font-bold">My Notes</h2>
          <p className="text-white/50 mt-1">
            Manage your floating notes here
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onRefresh}
            className="px-5 py-3 rounded-2xl bg-white/5 border border-white/10 text-white font-semibold hover:bg-white/10 transition"
          >
            Refresh
          </button>
          <button
            onClick={onNewNote}
            className="px-5 py-3 rounded-2xl bg-cyan-400 text-black font-semibold hover:scale-105 transition"
          >
            + New Note
          </button>
        </div>
      </div>

      <div className="mb-6">
        <input
          type="text"
          placeholder="Search notes..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full bg-[#181F2E] border border-white/10 rounded-2xl px-5 py-4 outline-none focus:border-cyan-400"
        />
      </div>

      <div className="flex-1 overflow-auto custom-scrollbar">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 m-1">
          {notes.length > 0 ? (
            notes.map((note) => (
              <div
                key={note.id}
                className="rounded-3xl p-4 shadow-xl hover:scale-[1.02] transition flex flex-col"
                style={{ background: note.color, minHeight: 155 }}
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
                    onClick={() => onOpenNote(note)}
                    className="px-3 py-1.5 rounded-xl bg-black/10 text-black text-sm hover:bg-black/20"
                  >
                    Open
                  </button>

                  <button
                    onClick={() => onEditNote(note)}
                    className="px-3 py-1.5 rounded-xl bg-black/10 text-black text-sm hover:bg-black/20"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => onDeleteNote(note.id)}
                    className="ml-auto px-3 py-1.5 rounded-xl bg-red-500/20 text-red-500 text-sm hover:bg-red-500/30 transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full rounded-3xl bg-[#181F2E] border border-white/10 p-8 text-center text-white/70">
              No notes found. Create a new note to get started.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
