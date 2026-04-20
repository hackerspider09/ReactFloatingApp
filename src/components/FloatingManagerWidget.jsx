import { useEffect, useState } from 'react'
import { FiSettings, FiPlus, FiEye, FiMove, FiX } from 'react-icons/fi'

export default function FloatingManagerWidget() {
  const [expanded, setExpanded] = useState(false)

  useEffect(() => {
    function keepInsideScreen() {
      const padding = 12

      const x = window.screenX
      const y = window.screenY
      const width = window.outerWidth
      const screenWidth = window.screen.availWidth

      // when expanded and too close to right side
      if (expanded && x + width > screenWidth - padding) {
        window.moveTo(screenWidth - width - padding, y)
      }

      // if too far left
      if (x < padding) {
        window.moveTo(padding, y)
      }
    }

    keepInsideScreen()

    const timer = setTimeout(keepInsideScreen, 50)
    return () => clearTimeout(timer)
  }, [expanded])

  return (
    <div className="w-screen h-screen flex items-end justify-end p-2 pointer-events-none">
      <div
      className="pointer-events-auto"
    >
      <div
        className={`relative rounded-3xl bg-[#181F2E]/95 border border-white/10 backdrop-blur-xl shadow-2xl overflow-hidden transition-all duration-300 ${
          expanded ? 'w-[300px] h-[90px]' : 'w-[90px] h-[90px]'
        }`}
      >
        {/* Drag layer */}
        <div
          className="absolute inset-0"
          style={{ WebkitAppRegion: 'drag' }}
        />

        {expanded ? (
          <div className="relative z-10 h-full flex items-center gap-2 px-3">
            <button
              onClick={() => setExpanded(false)}
              className="w-10 h-10 rounded-2xl bg-cyan-400 text-black flex items-center justify-center flex-shrink-0 hover:scale-105 transition"
              style={{ WebkitAppRegion: 'no-drag' }}
              title="Collapse"
            >
              <FiSettings size={18} />
            </button>

            <button
              onClick={() => window.electronAPI.createQuickNoteWindow()}
              className="w-10 h-10 rounded-2xl bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition"
              style={{ WebkitAppRegion: 'no-drag' }}
              title="Create Note"
            >
              <FiPlus size={18} />
            </button>

            <button
              onClick={() => window.electronAPI.toggleNotesVisibility()}
              className="w-10 h-10 rounded-2xl bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition"
              style={{ WebkitAppRegion: 'no-drag' }}
              title="Show / Hide Notes"
            >
              <FiEye size={18} />
            </button>

            <button
              onClick={() => window.electronAPI.magnetNotes()}
              className="w-10 h-10 rounded-2xl bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition"
              style={{ WebkitAppRegion: 'no-drag' }}
              title="Magnet Notes"
            >
              <FiMove size={18} />
            </button>

            <button
              onClick={() => window.electronAPI.closeFloatingManager()}
              className="w-10 h-10 rounded-2xl bg-red-500/20 text-red-300 flex items-center justify-center hover:bg-red-500/30 transition"
              style={{ WebkitAppRegion: 'no-drag' }}
              title="Close Widget"
            >
              <FiX size={18} />
            </button>
          </div>
        ) : (
          <div className="relative z-10 w-full h-full flex items-center justify-center">
            <button
              onClick={() => setExpanded(true)}
              className="w-10 h-10 rounded-2xl bg-cyan-400 text-black flex items-center justify-center hover:scale-105 transition"
              style={{ WebkitAppRegion: 'no-drag' }}
              title="Open Controls"
            >
              <FiSettings size={18} />
            </button>
          </div>
        )}
      </div>
      </div>
    </div>
  )
}