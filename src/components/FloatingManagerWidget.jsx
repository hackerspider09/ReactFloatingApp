import { useState } from 'react'
import { FiSettings, FiPlus, FiEye, FiMove, FiX } from 'react-icons/fi'

export default function FloatingManagerWidget() {
  const [expanded, setExpanded] = useState(false)

  return (
    <div className="w-screen h-screen flex items-end justify-end p-2">
      <div
        className="flex items-center"
        style={{ WebkitAppRegion: 'drag' }}
      >
        <div
          className={`flex items-center gap-2 rounded-3xl bg-[#181F2E]/95 border border-white/10 backdrop-blur-xl shadow-2xl overflow-hidden transition-all duration-300 p-2 ${
            expanded ? 'w-[300px] ' : 'w-[56px] '
          }`}
        >
          <button
            onClick={() => setExpanded((prev) => !prev)}
            className="w-10 h-10 rounded-2xl bg-cyan-400 text-black flex items-center justify-center flex-shrink-0"
            style={{ WebkitAppRegion: 'no-drag' }}
          >
            <FiSettings size={18} />
          </button>

          {expanded && (
            <>
              <button
                onClick={() => window.electronAPI.openManagerWindow()}
                className="w-10 h-10 rounded-2xl bg-white/10 text-white flex items-center justify-center hover:bg-white/20"
                style={{ WebkitAppRegion: 'no-drag' }}
              >
                <FiPlus size={18} />
              </button>

              <button
                onClick={() => window.electronAPI.toggleNotesVisibility()}
                className="w-10 h-10 rounded-2xl bg-white/10 text-white flex items-center justify-center hover:bg-white/20"
                style={{ WebkitAppRegion: 'no-drag' }}
              >
                <FiEye size={18} />
              </button>

              <button
                onClick={() => window.electronAPI.magnetNotes()}
                className="w-10 h-10 rounded-2xl bg-white/10 text-white flex items-center justify-center hover:bg-white/20"
                style={{ WebkitAppRegion: 'no-drag' }}
              >
                <FiMove size={18} />
              </button>

              <button
                onClick={() => window.electronAPI.closeFloatingManager()}
                className="w-10 h-10 rounded-2xl bg-red-500/20 text-red-300 flex items-center justify-center hover:bg-red-500/30"
                style={{ WebkitAppRegion: 'no-drag' }}
              >
                <FiX size={18} />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}