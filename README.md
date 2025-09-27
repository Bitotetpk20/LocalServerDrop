# LocalServerDrop

A cross-platform Electron desktop application that will act as a local file sharing server using Express web server, with Multer storage. Share files fast across your local network.

## What is LocalServerDrop?

LocalServerDrop combines the convenience of a desktop application with the accessibility of a web server to create a seamless filesharing solution. Upload files through the desktop app or web interface, and share them instantly across your local network. Perfect for quick file transfers between devices without cloud dependencies or complex setup.

<img width="1191" height="666" alt="image" src="https://github.com/user-attachments/assets/2f74e96c-e5cc-4bc7-bc0e-6cf34bcf22af" />
<img width="1489" height="510" alt="image" src="https://github.com/user-attachments/assets/827b7e99-1b10-4e1e-bb6b-ab558c6769ea" />

## Why LocalServerDrop?

- **Privacy First**: No cloud services, everything stays on your private network.
- **Simple Setup**: No configuration required, install and use.
- **Cross-Device Compatible**: Access from any device with a web browser or run the application which is also multiplatform (Electron).
- **Fast**: Local network speeds should be blazing fast, much MUCH faster than any online provider.
- **Secure**: Only users with the admin token can delete files, ensuring unauthorized users cannot remove shared content. IPC handlers and correct filepath resolution make it much safer than most other available solutions that usually offer little to no security.
- **Developer Friendly**: Clean codebase for easy modification.

Perfect for developers, designers, content creators, or anyone who needs to quickly share files across devices without the hassle of cloud services or complex network setup.

## Key Features

- **Drag & Drop Upload**: Simple file uploading with visual feedback
- **Cross-Platform**: Works on Windows, macOS, and Linux
- **Local Network Sharing**: Access files via web browser at `localhost:8080` (Or use your device IPv4 shown in the app for LAN access)
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
5. Click the server button to open the web interface — the button shows your device IPv4 (for example, `192.168.1.50:8080`) inside Electron; on the same machine it may show `localhost:8080`

### Web Interface
1. Open any web browser
2. Navigate to `http://localhost:8080` on the same machine, or `http://<your-device-ip>:8080` from other devices on the same network
3. Upload and download files through the web interface
4. Perfect for sharing with other devices on your network

### Network Sharing
- The Electron UI shows your device IPv4 so others can connect (for example, `http://192.168.1.50:8080`)
- Other devices on your network can access files by visiting `http://[YOUR-IP]:8080`
- Find your IP address using `ipconfig` (Windows) or `ifconfig` (Mac/Linux)

> [!IMPORTANT]
> Windows Firewall may block inbound connections the first time the server runs. Approve the prompt when Windows asks to allow access. If needed, you can add a rule to allow TCP 8080.

<img width="554" height="517" alt="image" src="https://github.com/user-attachments/assets/ab4372dd-e65a-47bf-8d71-becde517d125" />

Windows PowerShell (run as Administrator):

```powershell
New-NetFirewallRule -DisplayName "LocalServerDrop 8080" -Direction Inbound -Action Allow -Protocol TCP -LocalPort 8080
```

To remove later:

```powershell
Remove-NetFirewallRule -DisplayName "LocalServerDrop 8080"
```

> [!TIP]
> To share files across your network, replace `[YOUR-IP]` with your actual IP address. Use `ipconfig` on Windows or `ifconfig` on Mac/Linux to find your IP.

## Security Features

- **Local Network Ready**: Server binds to `0.0.0.0` by default (listens on all interfaces). Use a trusted network or change binding to `127.0.0.1` to restrict to the local machine only.
- **Admin Token Authentication**: File deletion requires admin token
- **Path Traversal Protection**: Prevents unauthorized file access
- **Sandboxed Frontend**: Electron security best practices implemented

> [!NOTE]
> **Security Notes:**
> - **Per-session admin token**: A new admin token is generated on each app start and passed to the server via `X-Admin-Token` header for delete operations. Restarting the app changes the token.
> - **Upload safety**: Filenames are sanitized to their basename (no path components). No explicit file size limit is enforced by default; add a Multer limit in code if you need one.

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
curl -X POST -F "file=@/path/to/your/file.txt" http://localhost:8080/upload
```

### List Uploaded Files
```bash
curl http://localhost:8080/list
```
Response: `[{"name": "file.txt", "size": 1024}]`

### Download a File
```bash
curl -O http://localhost:8080/files/file.txt
```

### Delete a File
```bash
# Replace TOKEN_HERE with your actual admin token
curl -X DELETE "http://localhost:8080/delete/file.txt" \
   -H "X-Admin-Token: TOKEN_HERE"
```

### JavaScript Examples
```javascript
// Upload
const formData = new FormData();
formData.append('file', fileInput.files[0]);
fetch('http://localhost:8080/upload', {
  method: 'POST',
  body: formData
});

// List files
fetch('http://localhost:8080/list')
  .then(res => res.json())
  .then(files => console.log(files));

// Download
window.open('http://localhost:8080/files/filename.ext');

// Delete
const token = 'your-admin-token';
fetch(`http://localhost:8080/delete/filename.ext`, {
  method: 'DELETE',
  headers: { 'X-Admin-Token': token }
});
```

> [!NOTE]
> The admin token for delete operations is generated per app session. For programmatic access, you may need to extract it from the running Electron app or set `LSD_ADMIN_TOKEN` environment variable when running the server standalone.

## Configuration

- Port can be configured via environment variable:
   - `LSD_PORT` (default: `8080`)
- Binding host can be configured via environment variable:
   - `LSD_BIND_HOST` (default: `0.0.0.0` to listen on all interfaces)
   - Set to `127.0.0.1` to restrict access to the local machine only
- Admin token is managed automatically by the Electron app:
   - `LSD_ADMIN_TOKEN` is set by the Electron main process per run. You typically do not need to set this manually unless you’re running the server outside the app.

Windows PowerShell (per-session env var):

```powershell
$env:LSD_PORT = 9000
$env:LSD_BIND_HOST = "127.0.0.1"
```

Windows Command Prompt:

```bat
set LSD_PORT=9000
set LSD_BIND_HOST=127.0.0.1
```

### Test delete from a browser console or external tools
If you need to verify delete via browser, open `http://127.0.0.1:8080` and in the DevTools console run:

```js
const TOKEN = 'paste-the-admin-token-here';
const NAME = 'existing-file.ext';
fetch(`http://127.0.0.1:8080/delete/${encodeURIComponent(NAME)}`, {
   method: 'DELETE',
   headers: { 'X-Admin-Token': TOKEN }
}).then(async r => ({ status: r.status, text: await r.text() }))
   .then(console.log);
```

For testing with **Postman** or **curl**:
```bash
# Replace TOKEN_HERE with your actual admin token
curl -X DELETE "http://127.0.0.1:8080/delete/filename.ext" \
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
