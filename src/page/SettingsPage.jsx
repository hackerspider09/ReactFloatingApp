export default function SettingsPage({ settings, onChange }) {
  return (
    <div className="flex-1 flex flex-col p-8 overflow-auto">
      <div className="mb-10">
        <h2 className="text-3xl font-bold text-white">Settings</h2>
        <p className="text-white/50 mt-2">
          Configure Floating Notes behavior and performance
        </p>
      </div>

      <div className="max-w-3xl space-y-6">
        <div className="bg-[#181F2E] border border-white/10 rounded-3xl p-6">
          <h3 className="text-xl font-semibold text-white mb-2">
            Floating Notes
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
      </div>
    </div>
  )
}