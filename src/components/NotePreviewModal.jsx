export default function NotePreviewModal({
  open,
  note,
  onClose,
  onEdit,
}) {
  if (!open || !note) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div
        className="w-[550px] max-w-[90vw] rounded-3xl p-6 shadow-2xl"
        style={{ background: note.color }}
      >
        <div className="flex items-start justify-between mb-5">
          <h2 className="text-3xl font-bold text-black">
            {note.title}
          </h2>

          <button
            onClick={onClose}
            className="w-10 h-10 rounded-xl hover:bg-black/10 text-black"
          >
            ✕
          </button>
        </div>

        <div className="text-black/80 whitespace-pre-wrap leading-7 min-h-[150px]">
          {note.content}
        </div>

        <div className="flex justify-end gap-3 mt-8">
          <button
            onClick={() => onEdit(note)}
            className="px-5 py-2.5 rounded-2xl bg-black/10 text-black hover:bg-black/20"
          >
            Edit
          </button>

          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-2xl bg-black text-white hover:opacity-90"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}