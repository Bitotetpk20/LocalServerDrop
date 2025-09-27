const input = document.getElementById('fileInput');
const info = document.getElementById('fileInfo');

function getServerUrl() {
  if (window.location.protocol === 'file:' || window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    return 'http://localhost:8080';
  }
  return `http://${window.location.hostname}:8080`;
}

function getFileIcon(extension) {
  const iconMap = {
    'pdf': '📄', 'doc': '📝', 'docx': '📝', 'txt': '📄',
    'jpg': '🖼️', 'jpeg': '🖼️', 'png': '🖼️', 'gif': '🖼️', 'svg': '🖼️',
    'mp4': '🎬', 'avi': '🎬', 'mov': '🎬', 'mkv': '🎬',
    'mp3': '🎵', 'wav': '🎵', 'flac': '🎵', 'm4a': '🎵',
    'zip': '📦', 'rar': '📦', '7z': '📦', 'tar': '📦',
    'js': '⚡', 'html': '🌐', 'css': '🎨', 'json': '⚙️',
    'exe': '⚙️', 'dmg': '⚙️', 'deb': '⚙️', 'rpm': '⚙️'
  };
  return iconMap[extension.toLowerCase()] || '📁';
}

function getFileColor(extension) {
  const colorMap = {
    'pdf': 'from-red-500 to-red-600',
    'doc': 'from-blue-500 to-blue-600', 'docx': 'from-blue-500 to-blue-600',
    'jpg': 'from-green-500 to-green-600', 'jpeg': 'from-green-500 to-green-600', 'png': 'from-green-500 to-green-600',
    'mp4': 'from-purple-500 to-purple-600', 'avi': 'from-purple-500 to-purple-600',
    'mp3': 'from-pink-500 to-pink-600', 'wav': 'from-pink-500 to-pink-600',
    'zip': 'from-orange-500 to-orange-600', 'rar': 'from-orange-500 to-orange-600',
    'js': 'from-yellow-500 to-yellow-600', 'html': 'from-indigo-500 to-indigo-600'
  };
  return colorMap[extension.toLowerCase()] || 'from-slate-500 to-slate-600';
}

function formatFileSize(mb) {
  if (mb < 1) return `${(mb * 1024).toFixed(0)} KB`;
  return `${mb.toFixed(1)} MB`;
}

input.addEventListener('change', () => {
  const file = input.files && input.files[0];
  if (!file) {
    info.innerHTML = '';
    return;
  }
  
  const fileIcon = getFileIcon(file.name.split('.').pop());
  const fileSize = formatFileSize(file.size / (1024 * 1024));
  
  info.innerHTML = `
    <div class="flex items-center justify-center space-x-3 p-3 bg-purple-100/70 rounded-lg border border-purple-200/50">
      <div class="w-10 h-10 rounded-lg bg-gradient-to-r ${getFileColor(file.name.split('.').pop())} flex items-center justify-center">
        <span class="text-lg">${fileIcon}</span>
      </div>
      <div class="flex-1 text-left">
        <p class="text-purple-800 font-semibold text-sm">${file.name}</p>
        <p class="text-purple-600 text-xs">${fileSize} • ${file.type || 'Unknown type'}</p>
      </div>
      <div class="flex items-center space-x-2">
        <div class="w-2 h-2 bg-purple-500 rounded-full"></div>
        <span class="text-purple-600 font-medium text-sm">Uploading...</span>
      </div>
    </div>
  `;

  const formData = new FormData();
  formData.append('file', file);

  fetch(`${getServerUrl()}/upload`, {
    method: 'POST',
    body: formData
  })
  .then(res => res.text())
  .then(msg => {
    info.innerHTML = `
      <div class="flex items-center justify-center space-x-3 p-3 bg-green-100/70 rounded-lg border border-green-300/50">
        <div class="w-10 h-10 rounded-lg bg-gradient-to-r ${getFileColor(file.name.split('.').pop())} flex items-center justify-center">
          <span class="text-lg">${fileIcon}</span>
        </div>
        <div class="flex-1 text-left">
          <p class="text-green-800 font-semibold text-sm">${file.name}</p>
          <p class="text-green-700 text-xs">✅ ${msg}</p>
        </div>
        <div class="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
          <span class="text-white text-xs">✓</span>
        </div>
      </div>
    `;
    loadFiles();
  })
  .catch(err => {
    info.innerHTML = `
      <div class="flex items-center justify-center space-x-3 p-3 bg-red-100/70 rounded-lg border border-red-300/50">
        <div class="w-10 h-10 rounded-lg bg-gradient-to-r from-red-500 to-red-600 flex items-center justify-center">
          <span class="text-lg">⚠️</span>
        </div>
        <div class="flex-1 text-left">
          <p class="text-red-800 font-semibold text-sm">${file.name}</p>
          <p class="text-red-700 text-xs">❌ Upload failed: ${err}</p>
        </div>
        <button onclick="info.innerHTML=''" class="w-6 h-6 rounded-full bg-red-500 hover:bg-red-400 flex items-center justify-center transition-colors">
          <span class="text-white text-xs">x</span>
        </button>
      </div>
    `;
  });
});

function loadFiles() {
  fetch(`${getServerUrl()}/list`)
    .then(res => res.json())
    .then(files => {
      const tbody = document.getElementById('filesTable').querySelector('tbody');
      tbody.innerHTML = '';
      
      if (files.length === 0) {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td colspan="3" class="px-6 py-12 text-center">
            <div class="flex flex-col items-center space-y-3">
              <div class="w-16 h-16 rounded-full bg-gradient-to-r from-purple-300 to-violet-300 flex items-center justify-center opacity-60">
                <span class="text-xl">📭</span>
              </div>
              <p class="text-purple-600 font-medium text-base">No files shared yet</p>
              <p class="text-purple-500 text-sm">Upload your first file to get started</p>
            </div>
          </td>
        `;
        tbody.appendChild(row);
        return;
      }
      
      files.forEach((file, index) => {
        const row = document.createElement('tr');
        const isElectron = window.adminAPI && window.adminAPI.isElectronApp();
        
        row.className = `
          hover:bg-purple-100/40 transition-all duration-300 group/row
          border-l-4 border-transparent hover:border-purple-400/50
          animate-fade-in
        `.replace(/\s+/g, ' ').trim();
        row.style.animationDelay = `${index * 100}ms`;
        
        const fileName = typeof file === 'string' ? file : file.name;
        const fileSize = typeof file === 'string' ? 0 : file.size;
        
        const fileExt = fileName.split('.').pop().toLowerCase();
        const fileIcon = getFileIcon(fileExt);
        
        row.innerHTML = `
          <td class="px-6 py-4 border-r border-purple-200/30">
            <div class="flex items-center space-x-3">
              <div class="w-8 h-8 rounded-lg bg-gradient-to-r ${getFileColor(fileExt)} flex items-center justify-center shadow-md">
                <span class="text-sm">${fileIcon}</span>
              </div>
              <div class="flex-1">
                <p class="text-purple-800 font-semibold group-hover/row:text-purple-900 transition-colors duration-200 text-sm">${fileName}</p>
                <p class="text-purple-600 text-xs">File • ${formatFileSize(fileSize / (1024 * 1024))}</p>
              </div>
            </div>
          </td>
          <td class="px-6 py-4 border-r border-purple-200/30">
            <a href="${getServerUrl()}/files/${encodeURIComponent(fileName)}" download>
              <button class="group/btn relative overflow-hidden px-4 py-2 bg-gradient-to-r from-purple-500 to-violet-500 hover:from-purple-600 hover:to-violet-600 rounded-lg transition-all duration-300 text-white font-semibold shadow-md hover:shadow-purple-500/25 hover:scale-105 text-sm">
                <div class="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-500"></div>
                <div class="relative flex items-center space-x-1">
                  <span class="text-xs">⬇️</span>
                  <span>Download</span>
                </div>
              </button>
            </a>
          </td>
          <td class="px-6 py-4 ${isElectron ? 'border-r border-purple-200/30' : ''}">
            <button onclick="shareFile('${fileName}')" class="group/btn relative overflow-hidden px-4 py-2 bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 rounded-lg transition-all duration-300 text-white font-semibold shadow-md hover:shadow-violet-500/25 hover:scale-105 text-sm">
              <div class="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-500"></div>
              <div class="relative flex items-center space-x-1">
                <span class="text-xs">🔗</span>
                <span>Share</span>
              </div>
            </button>
          </td>
          ${isElectron ? `
            <td class="px-6 py-4">
              <button onclick="deleteFile('${fileName}')" class="group/btn relative overflow-hidden px-4 py-2 bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 rounded-lg transition-all duration-300 text-white font-semibold shadow-md hover:shadow-red-500/25 hover:scale-105 text-sm">
                <div class="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-500"></div>
                <div class="relative flex items-center space-x-1">
                  <span class="text-xs">🗑️</span>
                  <span>Delete</span>
                </div>
              </button>
            </td>
          ` : ''}
        `;
        tbody.appendChild(row);
      });
    })
    .catch(err => {
      console.error('Failed to load files:', err);
      const tbody = document.getElementById('filesTable').querySelector('tbody');
      tbody.innerHTML = `
        <td colspan="3" class="px-6 py-12 text-center">
          <div class="flex flex-col items-center space-y-3">
            <div class="w-16 h-16 rounded-full bg-gradient-to-r from-red-500 to-rose-500 flex items-center justify-center opacity-80">
              <span class="text-xl">⚠️</span>
            </div>
            <p class="text-red-600 font-semibold text-base">Failed to load files</p>
            <p class="text-purple-600 text-sm">Check your connection and try again</p>
            <button onclick="loadFiles()" class="mt-3 px-3 py-2 bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-400 hover:to-rose-400 rounded-lg text-white font-medium transition-all duration-200 text-sm">
              Try Again
            </button>
          </div>
        </td>
      `;
    });
}

function shareFile(filename) {
  if (window.shareAPI && window.shareAPI.shareFile) {
    // in electron
    window.shareAPI.getFilePath(filename)
      .then(filePath => {
        window.shareAPI.shareFile(filePath);
      })
      .catch(err => {
        alert(`Failed to get file path: ${err}`);
      });
  } else {
    const fileUrl = `${getServerUrl()}/files/${encodeURIComponent(filename)}`;
    navigator.clipboard.writeText(fileUrl).then(() => {
      alert(`File URL copied to clipboard: ${fileUrl}`);
    }).catch(() => {
      // fallback for older browsers
      prompt('Copy this URL to share the file:', fileUrl);
    });
  }
}

function deleteFile(filename) {
  if (!window.adminAPI || !window.adminAPI.isElectronApp()) {
    alert('Delete function only available in app');
    return;
  }
  
  window.adminAPI.deleteFile(filename)
    .then(result => {
      if (result.success) {
        loadFiles();
      } else {
        alert(`Failed to delete file: ${result.error}`);
      }
    })
    .catch(err => {
      alert(`Error deleting file: ${err}`);
    });
}

function updateTableHeaders() {
  const table = document.getElementById('filesTable');
  const headerRow = table.querySelector('thead tr');
  const isElectron = window.adminAPI && window.adminAPI.isElectronApp();
  
  if (isElectron && headerRow.children.length === 3) {
    const deleteHeader = document.createElement('th');
    deleteHeader.className = 'px-6 py-4 text-left text-xs font-bold text-purple-700 uppercase tracking-wider';
    deleteHeader.innerHTML = `
      <div class="flex items-center space-x-2">
        <span>🗑️</span>
        <span>Delete</span>
      </div>
    `;
    headerRow.appendChild(deleteHeader);
  }
}

function openInBrowser(url) {
  if (window.browserAPI && window.browserAPI.openExternal) {
    window.browserAPI.openExternal(url);
  } else {
    window.open(url, '_blank');
  }
}

async function getDeviceIP() {
  try {
    
    const pc = new RTCPeerConnection({iceServers: []});
    const noop = () => {};
    
    pc.createDataChannel('');
    pc.createOffer().then(pc.setLocalDescription.bind(pc), noop);
    
    return new Promise((resolve) => {
      pc.onicecandidate = (ice) => {
        if (!ice || !ice.candidate || !ice.candidate.candidate) return;
        const myIP = /([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/.exec(ice.candidate.candidate);
        if (myIP) {
          resolve(myIP[1]);
          pc.onicecandidate = noop;
        }
      };
    });
  } catch (e) {
    return 'localhost';
  }
}

async function updateServerUrlDisplay() {
  const serverUrlText = document.getElementById('serverUrlText');
  if (serverUrlText) {
    const deviceIP = await getDeviceIP();
    if (deviceIP && deviceIP !== 'localhost') {
      serverUrlText.textContent = `${deviceIP}:8080`;
    } else {
      serverUrlText.textContent = 'localhost:8080';
    }
  }
}

async function openServerUrl() {
  const deviceIP = await getDeviceIP();
  const serverUrl = deviceIP && deviceIP !== 'localhost' ? 
    `http://${deviceIP}:8080` : 
    'http://localhost:8080';
  openInBrowser(serverUrl);
}

window.addEventListener('load', () => {
  updateTableHeaders();
  loadFiles();
  updateServerUrlDisplay();
});