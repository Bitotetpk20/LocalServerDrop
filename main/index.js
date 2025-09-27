const electron = require('electron');
const { app, BrowserWindow, ipcMain, shell, screen, Tray, Menu } = electron;
const path = require('path');
const crypto = require('crypto');

// Generate admin token and pass it to the server via env
const ADMIN_TOKEN = crypto.randomBytes(32).toString('hex');
process.env.LSD_ADMIN_TOKEN = ADMIN_TOKEN;

// start express server and get server reference
const { server } = require('../backend/server.js');

let tray = null;
let mainWindow = null;

const createWindow = () => {
  const isDev = !app.isPackaged;
  
  // hopefully this works on all platforms
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;
  
  mainWindow = new BrowserWindow({
    width: width,
    height: height,
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
  
  mainWindow.loadFile(htmlPath);
  mainWindow.setMenuBarVisibility(false);

  // minimize to tray probably wont work on macOS
  mainWindow.on('close', (event) => {
    if (!app.isQuiting) {
      event.preventDefault();
      mainWindow.hide();
    }
  });

  createTray();
}

const createTray = () => {
  const isDev = !app.isPackaged;
  const iconPath = isDev ? 
    path.join(__dirname, '../renderer/assets/icon.ico') :
    path.join(app.getAppPath(), 'renderer/assets/icon.ico');
    
  tray = new Tray(iconPath);
  
  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Show LocalServerDrop',
      click: () => {
        mainWindow.show();
        mainWindow.focus();
      }
    },
    {
      label: 'Hide',
      click: () => {
        mainWindow.hide();
      }
    },
    { type: 'separator' },
    {
      label: 'Quit',
      click: () => {
        app.isQuiting = true;
        app.quit();
      }
    }
  ]);
  
  tray.setToolTip('LocalServerDrop - File sharing server');
  tray.setContextMenu(contextMenu);
  
  tray.on('double-click', () => {
    if (mainWindow.isVisible()) {
      mainWindow.hide();
    } else {
      mainWindow.show();
      mainWindow.focus();
    }
  });
};

// IPC Handlers

ipcMain.handle('share-file', async (_event, filePath) => {
  shell.showItemInFolder(filePath);
});

ipcMain.handle('get-file-path', async (_event, filename) => {
  const isDev = !app.isPackaged;
  const SHARED_DIR = isDev ? 
    path.join(__dirname, '../backend/uploads') : 
    path.join(app.getPath('userData'), 'uploads');
  
  // Prevent path traversal attacks
  const filePath = path.join(SHARED_DIR, filename);
  if (!filePath.startsWith(SHARED_DIR)) {
    throw new Error('Invalid file path');
  }
  
  return filePath;
});

ipcMain.handle('open-external', async (_event, url) => {
  await shell.openExternal(url);
});

ipcMain.handle('delete-file', async (_event, filename) => {
  try {
    const response = await fetch(`http://localhost:8080/delete/${encodeURIComponent(filename)}`, {
      method: 'DELETE',
      headers: {
        'X-Admin-Token': ADMIN_TOKEN
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
  if (app.isQuiting) {
    shutdownServer();
    if (process.platform !== 'darwin') {
      app.quit();
    }
  }
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
  } else if (mainWindow) {
    mainWindow.show();
    mainWindow.focus();
  }
});
