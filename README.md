# LocalServerDrop

A cross-platform Electron desktop application for local file sharing with a built-in web server. Share files effortlessly across your local network with a modern, intuitive interface.

## 🎯 What is LocalServerDrop?

LocalServerDrop combines the convenience of a desktop application with the accessibility of a web server to create a seamless file-sharing solution. Upload files through the desktop app or web interface, and share them instantly across your local network. Perfect for quick file transfers between devices without cloud dependencies or complex setup.

## ✨ Key Features

- **Drag & Drop Upload**: Simple file uploading with visual feedback
- **Cross-Platform**: Works on Windows, macOS, and Linux
- **Local Network Sharing**: Access files via web browser at `localhost:3000`
- **Real-time File Management**: View, download, and delete files instantly
- **Modern UI**: Beautiful dark theme with gradient effects and smooth animations
- **File Type Recognition**: Visual icons and color coding for different file types
- **Security**: Admin-only file deletion with token authentication
- **No External Dependencies**: Everything runs locally on your machine

## 🛠️ Technology Stack

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

## 📁 Project Structure

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

## 🚀 Getting Started

### Prerequisites

- **Node.js**
- **npm**

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/KristupasJon/LocalServerDrop.git
   cd LocalServerDrop
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Build CSS (if making style changes)**
   ```bash
   npm run buildcss
   ```

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

## 📦 Building for Distribution

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

## 🌐 Usage

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

## 🔒 Security Features

- **Local Network Only**: Server binds to localhost by default
- **Admin Token Authentication**: File deletion requires admin token
- **Path Traversal Protection**: Prevents unauthorized file access
- **Sandboxed Frontend**: Electron security best practices implemented

## 🎨 UI Features

- **Responsive Design**: Works well on different screen sizes
- **File Type Icons**: Visual representation for different file formats
- **Smooth Animations**: Polished user experience with CSS transitions
- **Custom Scrollbars**: Styled to match the app's aesthetic
- **Gradient Effects**: Modern visual design with glass morphism elements

## 📋 API Endpoints

- `POST /upload` - Upload a file
- `GET /list` - List all uploaded files
- `GET /files/:filename` - Download a specific file
- `DELETE /delete/:filename` - Delete a file (admin token required)
- `GET /` - Serve the web interface

## ⚙️ Configuration

The server runs on port 3000 by default. To change this:
1. Edit `PORT` variable in `backend/server.js`
2. Update hardcoded references in other files as needed (Sorry :^)

## 📄 License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**KristupasJon** - [GitHub Profile](https://github.com/KristupasJon)

## 🚀 Why Use LocalServerDrop?

- **Privacy First**: No cloud services, everything stays on your network
- **Simple Setup**: No configuration required, works out of the box
- **Cross-Device Compatible**: Access from any device with a web browser
- **Lightweight**: Minimal resource usage, fast performance
- **Professional UI**: Modern design that's pleasant to use
- **Developer Friendly**: Clean, well-structured codebase for easy modification

Perfect for developers, designers, content creators, or anyone who needs to quickly share files across devices without the hassle of cloud services or complex network setup.