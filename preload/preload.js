const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('shareAPI', {
    shareFile: (filePath) => {
        ipcRenderer.invoke('share-file', filePath);
    },
    getFilePath: (filename) => {
        return ipcRenderer.invoke('get-file-path', filename);
    }
});

contextBridge.exposeInMainWorld('adminAPI', {
    deleteFile: (filename) => {
        return ipcRenderer.invoke('delete-file', filename);
    },
    isElectronApp: () => true
});

contextBridge.exposeInMainWorld('browserAPI', {
    openExternal: (url) => {
        return ipcRenderer.invoke('open-external', url);
    }
});
