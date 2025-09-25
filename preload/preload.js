const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('shareAPI', {
    shareFile: (filePath) => {
        ipcRenderer.invoke('share-file', filePath);
    }
});

contextBridge.exposeInMainWorld('adminAPI', {
    deleteFile: (filename) => {
        return ipcRenderer.invoke('delete-file', filename);
    },
    isElectronApp: () => true
});
