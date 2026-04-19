import electron from 'electron'

const { contextBridge } = electron

contextBridge.exposeInMainWorld('electronAPI', {
  appName: 'Floating Notes',
})