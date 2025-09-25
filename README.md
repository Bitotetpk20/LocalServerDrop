# LocalServerDrop

A cross-platform Electron desktop application that will act as a local file server sharing with a built-in Express web server, with Multer storage. Share files fast across your local network.

## What is LocalServerDrop?

LocalServerDrop combines the convenience of a desktop application with the accessibility of a web server to create a seamless filesharing solution. Upload files through the desktop app or web interface, and share them instantly across your local network. Perfect for quick file transfers between devices without cloud dependencies or complex setup.

<img width="1463" height="1084" alt="Screenshot 2025-09-25 172102" src="https://github.com/user-attachments/assets/9e1fdd7c-3c17-4c5c-8604-b7963a2f9111" />
<img width="2047" height="884" alt="Screenshot 2025-09-25 172226" src="https://github.com/user-attachments/assets/bcf20018-3e3c-48cc-9114-e127fe068118" />



## Why Use LocalServerDrop?

- **Privacy First**: No cloud services, everything stays on your network.
- **Simple Setup**: No configuration required, works out of the box.
- **Cross-Device Compatible**: Access from any device with a web browser or run the application which is also multiplatform (Electron)
- **Fast**: Local network speeds should be blazing fast, much MUCH faster than any online provider.
- **Professional UI**: Modern design that's pleasant to use.
- **Secure**: Only users with the admin token can delete files, ensuring unauthorized users cannot remove shared content. IPC handlers and correct filepath resolution make it much safer than most other available solutions that usually offer little to no security.
- **Developer Friendly**: Clean codebase for easy modification.

Perfect for developers, designers, content creators, or anyone who needs to quickly share files across devices without the hassle of cloud services or complex network setup.

## Key Features

- **Drag & Drop Upload**: Simple file uploading with visual feedback
- **Cross-Platform**: Works on Windows, macOS, and Linux
- **Local Network Sharing**: Access files via web browser at `localhost:3000` (Or setup port forwarding for public use)
- **Real-time File Management**: View, download, and delete files instantly
- **Modern UI**: Beautiful dark theme with gradient effects and smooth animations
- **File Type Recognition**: Visual icons and color coding for different file types
- **Security**: Admin-only file deletion with token authentication
- **No External Dependencies**: Everything runs locally on your machine

## Technology Stack

### Frontend
- **Electron**: Cross-platform desktop app framework
- **HTML5/CSS3**: Modern web standards
- **Tailwind CSS**: Utility-first CSS framework for rapid styling
- **Vanilla JavaScript**: Lightweight, no heavy frameworks

### Backend
- **Node.js**: JavaScript runtime for server-side logic
- **Express.js**: Web framework for handling HTTP requests
- **Multer**: Middleware for handling file uploads
- **File System API**: Native file operations

### Development Tools
- **Electron Builder**: Package and distribute the app
- **Nodemon**: Auto-restart development server
- **Tailwind CLI**: CSS compilation and optimization

## Project Structure

```
LocalServerDrop/
├── main/                   # Electron main process
│   └── index.js           # App initialization and IPC handlers
├── renderer/              # Frontend UI
│   ├── index.html         # Main application interface
│   ├── css/              
│   │   ├── input.css      # Custom styles and Tailwind imports
│   │   └── output.css     # Compiled Tailwind CSS
│   ├── js/
│   │   └── app.js         # Frontend JavaScript logic
│   └── assets/
│       ├── favicon.svg
│       └── icon.ico
├── preload/               # Electron security layer
│   └── preload.js         # IPC communication bridge
├── backend/               # Express server
│   ├── server.js          # HTTP server and API endpoints
│   └── uploads/           # File storage directory
└── package.json           # Dependencies and build configuration
```

## Getting Started

### Prerequisites

- **Node.js**
- **npm**

### Installation
1. Download the installer
2. Run as administrator (for proper installation)
3. Follow the setup wizard
4. Launch from Start Menu or desktop shortcut

> [!TIP]
> Run the installer as administrator to ensure proper installation and avoid permission issues.

### Running with Node.js runtime (No installation)

1. **Clone the repository**
   ```bash
   git clone https://github.com/KristupasJon/LocalServerDrop.git
   cd LocalServerDrop
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Build CSS (required - output.css is not tracked in git)**
   ```bash
   npm run buildcss
   ```

   > [!NOTE]
   > The CSS build step is required because `output.css` is not tracked in git. You must run this command before starting the application.

4. **Start the application**
   ```bash
   npm start
   ```

### Development Mode

For development with auto-reload:
```bash
npm run dev
```

This watches for changes in `main`, `renderer`, `preload`, and `backend` directories.

## Building for Distribution

Build for your current platform:
```bash
npm run build
```

Build for specific platforms:
```bash
npm run build:win    # Windows
npm run build:mac    # macOS
npm run build:linux  # Linux
```

Built applications will be available in the `dist/` directory.

## Usage

### Desktop App
1. Launch LocalServerDrop
2. Drag and drop files onto the upload zone, or click to browse
3. Files are automatically uploaded to the local server
4. Use the "File Vault" section to manage uploaded files
5. Click the "localhost:3000" button to open the web interface

### Web Interface
1. Open any web browser
2. Navigate to `http://localhost:3000`
3. Upload and download files through the web interface
4. Perfect for sharing with other devices on your network

### Network Sharing
- Other devices on your network can access files by visiting `http://[YOUR-IP]:3000`
- Find your IP address using `ipconfig` (Windows) or `ifconfig` (Mac/Linux)

> [!TIP]
> To share files across your network, replace `[YOUR-IP]` with your actual IP address. Use `ipconfig` on Windows or `ifconfig` on Mac/Linux to find your IP.

## Security Features

- **Local Network Only**: Server binds to localhost by default
- **Admin Token Authentication**: File deletion requires admin token
- **Path Traversal Protection**: Prevents unauthorized file access
- **Sandboxed Frontend**: Electron security best practices implemented

> [!NOTE]
> **Security Notes:**
> - **Per-session admin token**: A new admin token is generated on each app start and passed to the server via `X-Admin-Token` header for delete operations. Restarting the app changes the token.
> - **Upload safety**: Filenames are sanitized to their basename (no path components) with a 100 MB size limit (configurable in code).

## UI Features

- **Responsive Design**: Works well on different screen sizes
- **File Type Icons**: Visual representation for different file formats
- **Smooth Animations**: Polished user experience with CSS transitions
- **Custom Scrollbars**: Styled to match the app's aesthetic
- **Gradient Effects**: Modern visual design with glass morphism elements

## API Endpoints

- `POST /upload` - Upload a file
- `GET /list` - List all uploaded files
   - Returns an array of objects: `{ name: string, size: number }` (`size` in bytes)
- `GET /files/:filename` - Download a specific file
- `DELETE /delete/:filename` - Delete a file (admin token required)
   - Requires header: `X-Admin-Token: <token>`
- `GET /` - Serve the web interface

## API Usage

You can interact with LocalServerDrop's API programmatically for automation or integration purposes. Below are examples using curl and JavaScript fetch.

### Upload a File
```bash
curl -X POST -F "file=@/path/to/your/file.txt" http://localhost:3000/upload
```

### List Uploaded Files
```bash
curl http://localhost:3000/list
```
Response: `[{"name": "file.txt", "size": 1024}]`

### Download a File
```bash
curl -O http://localhost:3000/files/file.txt
```

### Delete a File
```bash
# Replace TOKEN_HERE with your actual admin token
curl -X DELETE "http://localhost:3000/delete/file.txt" \
     -H "X-Admin-Token: TOKEN_HERE"
```

### JavaScript Examples
```javascript
// Upload
const formData = new FormData();
formData.append('file', fileInput.files[0]);
fetch('http://localhost:3000/upload', {
  method: 'POST',
  body: formData
});

// List files
fetch('http://localhost:3000/list')
  .then(res => res.json())
  .then(files => console.log(files));

// Download
window.open('http://localhost:3000/files/filename.ext');

// Delete
const token = 'your-admin-token';
fetch(`http://localhost:3000/delete/filename.ext`, {
  method: 'DELETE',
  headers: { 'X-Admin-Token': token }
});
```

> [!NOTE]
> The admin token for delete operations is generated per app session. For programmatic access, you may need to extract it from the running Electron app or set `LSD_ADMIN_TOKEN` environment variable when running the server standalone.

## Configuration

- The server runs on port 3000 by default. To change this, you need to edit `PORT` in `backend/server.js` and update hardcoded references where applicable. (I will change later when not lazy)
- Binding host can be configured via environment variable:
   - `LSD_BIND_HOST` (default: `127.0.0.1`)
   - Note: Keeping it on `127.0.0.1` restricts access to the local machine only.
- Admin token is managed automatically by the Electron app:
   - `LSD_ADMIN_TOKEN` is set by the Electron main process per run. You typically do not need to set this manually unless you’re driving the server outside the app.

### Test delete from a browser console or external tools
If you need to verify delete via browser, open `http://127.0.0.1:3000` and in the DevTools console run:

```js
const TOKEN = 'paste-the-admin-token-here';
const NAME = 'existing-file.ext';
fetch(`http://127.0.0.1:3000/delete/${encodeURIComponent(NAME)}`, {
   method: 'DELETE',
   headers: { 'X-Admin-Token': TOKEN }
}).then(async r => ({ status: r.status, text: await r.text() }))
   .then(console.log);
```

For testing with **Postman** or **curl**:
```bash
# Replace TOKEN_HERE with your actual admin token
curl -X DELETE "http://127.0.0.1:3000/delete/filename.ext" \
     -H "X-Admin-Token: TOKEN_HERE"
```

<img width="885" height="448" alt="Screenshot 2025-09-25 155349" src="https://github.com/user-attachments/assets/e4665baa-e3ea-4f74-8530-74990f74ea68" />


> [!NOTE]
> The server's CORS configuration specifically allows the `X-Admin-Token` header for browser console testing and external API tools. Since the token is per-session and managed by the app, delete actions should generally be performed via the Electron UI. Manual testing requires the exact token for that run.

## Troubleshooting

- 403 Forbidden on delete:
   - The admin token likely doesn’t match. Restart the Electron app and try the delete again from within the app UI.
   - If testing manually, ensure you’re sending the correct `X-Admin-Token` for the current session.
- CSS not applying after clone:
   - Run `npm run buildcss` to generate `renderer/css/output.css` (it is not tracked in git).
