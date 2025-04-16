import path from 'path'
import * as fs from 'fs';
import { app, BrowserWindow, dialog, ipcMain } from 'electron'

process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true'
// The built directory structure
//
// ├─┬ dist
// │ ├─┬ electron
// │ │ ├── main.js
// │ │ └── preload.js
// │ ├── index.html
// │ ├── ...other-static-files-from-public
// │
process.env.DIST = path.join(__dirname, '../dist')
process.env.VITE_PUBLIC = app.isPackaged
  ? process.env.DIST
  : path.join(process.env.DIST, '../public')

if (!app.requestSingleInstanceLock()) {
  app.quit()
  process.exit(0)
}

// For sqlite3 initialize of Renderer process
ipcMain.handle('get-database-path', () => path.join(app.getPath('userData'), 'database.sqlite3'))

let win: BrowserWindow | null

function createWindow() {
  win = new BrowserWindow({
    icon: path.join(process.env.VITE_PUBLIC, 'logo.svg'),
    webPreferences: {
      preload: path.join(__dirname, './preload.js'),
      nodeIntegration: false, // Отключено для безопасности
      contextIsolation: true, // Включено для изоляции
      webSecurity: false, // Allow Ajax cross
    },
  })

  // Test active push message to Renderer-process.
  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', (new Date).toLocaleString())
  })

  if (process.env.VITE_DEV_SERVER_URL) {
    win.loadURL(process.env.VITE_DEV_SERVER_URL)
    win.webContents.openDevTools()
  } else {
    // win.loadFile('dist/index.html')
    win.loadFile(path.join(process.env.DIST, 'index.html'))
  }
}

app.on('window-all-closed', () => {
  app.quit()
  win = null
})

app.whenReady().then(createWindow)

// Обработчик запроса от рендерера
ipcMain.on('open-file', (event) => {
  dialog.showOpenDialog(win, {
    properties: ['openFile'],
    filters: [{ name: 'Типы файлов', extensions: ['json', 'geojson'] }]
  }).then(result => {
    if (!result.canceled && result.filePaths.length > 0) {
      const filePath = result.filePaths[0];
      const content = fs.readFileSync(filePath, 'utf-8');
      event.reply('file-open', {content: content, name: filePath}); // Отправляем путь обратно
    }
  });
});