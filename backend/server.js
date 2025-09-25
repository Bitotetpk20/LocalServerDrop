const express = require('express');
const path = require('path');
const multer = require('multer');
const fs = require('fs');
const { app: electronApp } = require('electron');
const expressApp = express();

const PORT = 3000; //some places are hardcoded to this port, change if needed

const isDev = !electronApp || !electronApp.isPackaged;
const SHARED_DIR = isDev ? 
  path.join(__dirname, 'uploads') : 
  path.join(electronApp.getPath('userData'), 'uploads');

// enable CORS
expressApp.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    //add admin token header for delete requests on browser console
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

if (!fs.existsSync(SHARED_DIR)) {
    fs.mkdirSync(SHARED_DIR, { recursive: true });
}

// multer setup for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, SHARED_DIR),
    filename: (req, file, cb) => cb(null, file.originalname)
});
const upload = multer({ storage });

const rendererPath = isDev ? 
  path.join(__dirname, '../renderer') : 
  path.join(electronApp.getAppPath(), 'renderer');

expressApp.use(express.static(rendererPath));
expressApp.use('/files', express.static(SHARED_DIR));

// Upload
expressApp.post('/upload', upload.single('file'), (req, res) => {
    if (!req.file) return res.status(400).send('No file uploaded.');
    res.send('File uploaded successfully.');
});

// Endpoint to list files
expressApp.get('/list', (req, res) => {
    fs.readdir(SHARED_DIR, (err, files) => {
        if (err) return res.status(500).send('Error reading files.');
        res.json(files);
    });
});

// Delete endpoint
expressApp.delete('/delete/:filename', (req, res) => {
    const adminToken = req.headers['x-admin-token'];
    if (adminToken !== 'electron-host-admin') {
        return res.status(403).send('Forbidden: Admin access required');
    }
    
    const filename = req.params.filename;
    const filePath = path.join(SHARED_DIR, filename);
    
    // filepath traversal protection
    if (!filePath.startsWith(SHARED_DIR)) {
        return res.status(400).send('Invalid file path');
    }
    
    fs.unlink(filePath, (err) => {
        if (err) {
            if (err.code === 'ENOENT') {
                return res.status(404).send('File not found');
            }
            return res.status(500).send('Error deleting file');
        }
        res.send('File deleted successfully');
    });
});

expressApp.get('/', (req, res) => {
    const indexPath = path.join(rendererPath, 'index.html');
    res.sendFile(indexPath);
});

// start server
const server = expressApp.listen(PORT, '127.0.0.1', () => {
    console.log(`Server started at http://127.0.0.1:${PORT}`);
    console.log(`Uploads directory: ${SHARED_DIR}`);
});

module.exports = { server, expressApp };
