export default function SettingsPage({ settings, onChange }) {
  return (
    <div className="flex-1 flex flex-col p-8 overflow-auto custom-scrollbar">
      <div className="mb-10">
        <h2 className="text-3xl font-bold text-white">Settings</h2>
        <p className="text-white/50 mt-2">
          Configure FloatNote behavior and performance
        </p>
      </div>

      <div className="max-w-3xl space-y-6">
        <div className="bg-[#181F2E] border border-white/10 rounded-3xl p-6">
          <h3 className="text-xl font-semibold text-white mb-2">
            FloatNote
          </h3>

          <p className="text-white/50 text-sm mb-6">
            Control how many floating note widgets appear on the desktop.
          </p>

          <div className="mb-4">
            <label className="block text-white/80 mb-3">
              Maximum floating notes on desktop
            </label>

            <input
              type="range"
              min="1"
              max="12"
              value={settings.maxFloatingNotes}
              onChange={(e) =>
                onChange({
                  ...settings,
                  maxFloatingNotes: Number(e.target.value),
                })
              }
              className="w-full accent-cyan-400"
            />

            <div className="flex items-center justify-between mt-3">
              <span className="text-cyan-400 font-semibold text-lg">
                {settings.maxFloatingNotes} notes
              </span>

              <span className="text-white/40 text-sm">
                Recommended: 3–6
              </span>
            </div>

            <p className="text-white/50 text-sm mt-4 leading-6">
              Lower values use less memory and make the application lighter.
              Maximum limit is 12 notes to avoid performance issues.
            </p>
          </div>
        </div>

        <div className="bg-[#181F2E] border border-white/10 rounded-3xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold text-white mb-2">
                Delete Confirmation
              </h3>
              <p className="text-white/50 text-sm">
                Show a confirmation prompt before deleting a note.
              </p>
            </div>

            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={settings.confirmDelete}
                onChange={(e) =>
                  onChange({
                    ...settings,
                    confirmDelete: e.target.checked,
                  })
                }
              />
              <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-500"></div>
            </label>
          </div>
        </div>

        <div className="bg-[#181F2E] border border-white/10 rounded-3xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold text-white mb-2">
                Launch on Startup
              </h3>
              <p className="text-white/50 text-sm">
                Automatically start FloatNote when your computer boots up.
              </p>
            </div>

            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={settings.launchOnStartup}
                onChange={(e) => {
                  const enabled = e.target.checked
                  onChange({
                    ...settings,
                    launchOnStartup: enabled,
                  })
                  window.electronAPI.setAutoLaunch(enabled)
                }}
              />
              <div className="w-11 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-500"></div>
            </label>
          </div>
        </div>

        <div className="bg-[#181F2E] border border-white/10 rounded-3xl p-6">
          <h3 className="text-xl font-semibold text-white mb-2">
            Floating Controls
          </h3>

          <p className="text-white/50 text-sm mb-6">
            If you've closed the floating widgets, you can reactivate them here.
          </p>

          <button
            onClick={() => window.electronAPI.openFloatingManager()}
            className="px-6 py-3 rounded-2xl bg-cyan-500 text-black font-bold hover:scale-105 transition shadow-lg shadow-cyan-500/20"
          >
            Activate Floating Manager
          </button>
        </div>
      </div>
    </div>
  )
}