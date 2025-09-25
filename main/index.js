const electron = require('electron');
const { app, BrowserWindow, ipcMain, shell } = electron;
const path = require('path');

// start express server and get server reference
const { server } = require('../backend/server.js');

const createWindow = () => {
  const isDev = !app.isPackaged;
  
  const win = new BrowserWindow({
    width: 1600,
    height: 1200,
    icon: isDev ? 
      path.join(__dirname, '../renderer/assets/icon.ico') :
      path.join(app.getAppPath(), 'renderer/assets/icon.ico'),
    webPreferences: {
      preload: isDev ?
        path.join(__dirname, '../preload/preload.js') :
        path.join(app.getAppPath(), 'preload/preload.js'),
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  const htmlPath = isDev ? 
    path.join(__dirname, '../renderer/index.html') : 
    path.join(app.getAppPath(), 'renderer/index.html');
  
  win.loadFile(htmlPath);
  win.setMenuBarVisibility(false);
}

// IPC Handlers

ipcMain.handle('share-file', async (_event, filePath) => {
  shell.showItemInFolder(filePath);
});

ipcMain.handle('delete-file', async (_event, filename) => {
  try {
    const response = await fetch(`http://127.0.0.1:3000/delete/${encodeURIComponent(filename)}`, {
      method: 'DELETE',
      headers: {
        'X-Admin-Token': 'electron-host-admin'
      }
    });
    
    if (response.ok) {
      return { success: true };
    } else {
      const errorText = await response.text();
      return { success: false, error: errorText };
    }
  } catch (error) {
    return { success: false, error: error.message };
  }
});

app.whenReady().then(createWindow)

let serverShutdown = false;
const shutdownServer = () => {
  if (server && !serverShutdown) {
    serverShutdown = true;
    console.log('Shutting down Express server...');
    server.close(() => {
      console.log('Express server shut down successfully');
    });
  }
};

app.on('window-all-closed', () => {
  shutdownServer();
  if (process.platform !== 'darwin') {
    app.quit(); // exit completely
  }
  // macOS keep running in background
});

app.on('before-quit', () => {
  shutdownServer();
});

app.on('will-quit', (event) => {
  shutdownServer();
});

process.on('SIGINT', () => {
  console.log('Received SIGINT, shutting down gracefully...');
  shutdownServer();
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('Received SIGTERM, shutting down gracefully...');
  shutdownServer();
  process.exit(0);
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
