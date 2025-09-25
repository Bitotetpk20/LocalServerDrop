const input = document.getElementById('fileInput');
const info = document.getElementById('fileInfo');

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
    <div class="flex items-center justify-center space-x-4 p-4 bg-slate-800/50 rounded-xl border border-slate-600/50">
      <div class="w-12 h-12 rounded-xl bg-gradient-to-r ${getFileColor(file.name.split('.').pop())} flex items-center justify-center">
        <span class="text-xl">${fileIcon}</span>
      </div>
      <div class="flex-1 text-left">
        <p class="text-slate-200 font-semibold">${file.name}</p>
        <p class="text-slate-400 text-sm">${fileSize} • ${file.type || 'Unknown type'}</p>
      </div>
      <div class="flex items-center space-x-2">
        <div class="w-3 h-3 bg-blue-400 rounded-full animate-pulse"></div>
        <span class="text-blue-400 font-medium">Uploading...</span>
      </div>
    </div>
  `;

  const formData = new FormData();
  formData.append('file', file);

  fetch('http://127.0.0.1:3000/upload', {
    method: 'POST',
    body: formData
  })
  .then(res => res.text())
  .then(msg => {
    info.innerHTML = `
      <div class="flex items-center justify-center space-x-4 p-4 bg-emerald-900/30 rounded-xl border border-emerald-500/50">
        <div class="w-12 h-12 rounded-xl bg-gradient-to-r ${getFileColor(file.name.split('.').pop())} flex items-center justify-center">
          <span class="text-xl">${fileIcon}</span>
        </div>
        <div class="flex-1 text-left">
          <p class="text-emerald-200 font-semibold">${file.name}</p>
          <p class="text-emerald-300 text-sm">✅ ${msg}</p>
        </div>
        <div class="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center">
          <span class="text-white text-sm">✓</span>
        </div>
      </div>
    `;
    loadFiles();
  })
  .catch(err => {
    info.innerHTML = `
      <div class="flex items-center justify-center space-x-4 p-4 bg-red-900/30 rounded-xl border border-red-500/50">
        <div class="w-12 h-12 rounded-xl bg-gradient-to-r from-red-500 to-red-600 flex items-center justify-center">
          <span class="text-xl">⚠️</span>
        </div>
        <div class="flex-1 text-left">
          <p class="text-red-200 font-semibold">${file.name}</p>
          <p class="text-red-300 text-sm">❌ Upload failed: ${err}</p>
        </div>
        <button onclick="info.innerHTML=''" class="w-8 h-8 rounded-full bg-red-500 hover:bg-red-400 flex items-center justify-center transition-colors">
          <span class="text-white text-sm">x</span>
        </button>
      </div>
    `;
  });
});

function loadFiles() {
  fetch('http://127.0.0.1:3000/list')
    .then(res => res.json())
    .then(files => {
      const tbody = document.getElementById('filesTable').querySelector('tbody');
      tbody.innerHTML = '';
      
      if (files.length === 0) {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td colspan="3" class="px-8 py-16 text-center">
            <div class="flex flex-col items-center space-y-4">
              <div class="w-20 h-20 rounded-full bg-gradient-to-r from-slate-700 to-slate-600 flex items-center justify-center opacity-50">
                <span class="text-2xl">📭</span>
              </div>
              <p class="text-slate-400 font-medium text-lg">No files shared yet</p>
              <p class="text-slate-500 text-sm">Upload your first file to get started</p>
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
          hover:bg-slate-800/30 transition-all duration-300 group/row
          border-l-4 border-transparent hover:border-violet-500/50
          animate-fade-in
        `.replace(/\s+/g, ' ').trim();
        row.style.animationDelay = `${index * 100}ms`;
        
        const fileName = typeof file === 'string' ? file : file.name;
        const fileSize = typeof file === 'string' ? 0 : file.size;
        
        const fileExt = fileName.split('.').pop().toLowerCase();
        const fileIcon = getFileIcon(fileExt);
        
        row.innerHTML = `
          <td class="px-8 py-6 border-r border-slate-700/30">
            <div class="flex items-center space-x-4">
              <div class="w-10 h-10 rounded-xl bg-gradient-to-r ${getFileColor(fileExt)} flex items-center justify-center shadow-lg">
                <span class="text-lg">${fileIcon}</span>
              </div>
              <div class="flex-1">
                <p class="text-slate-200 font-semibold group-hover/row:text-white transition-colors duration-200">${fileName}</p>
                <p class="text-slate-500 text-xs">File • ${formatFileSize(fileSize / (1024 * 1024))}</p>
              </div>
            </div>
          </td>
          <td class="px-8 py-6 border-r border-slate-700/30">
            <a href="http://127.0.0.1:3000/files/${encodeURIComponent(fileName)}" download>
              <button class="group/btn relative overflow-hidden px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 rounded-xl transition-all duration-300 text-white font-semibold shadow-lg hover:shadow-blue-500/25 hover:scale-105">
                <div class="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-500"></div>
                <div class="relative flex items-center space-x-2">
                  <span>⬇️</span>
                  <span>Download</span>
                </div>
              </button>
            </a>
          </td>
          <td class="px-8 py-6 ${isElectron ? 'border-r border-slate-700/30' : ''}">
            <button onclick="shareFile('${fileName}')" class="group/btn relative overflow-hidden px-6 py-3 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 rounded-xl transition-all duration-300 text-white font-semibold shadow-lg hover:shadow-emerald-500/25 hover:scale-105">
              <div class="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-500"></div>
              <div class="relative flex items-center space-x-2">
                <span>🔗</span>
                <span>Share</span>
              </div>
            </button>
          </td>
          ${isElectron ? `
            <td class="px-8 py-6">
              <button onclick="deleteFile('${fileName}')" class="group/btn relative overflow-hidden px-6 py-3 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 rounded-xl transition-all duration-300 text-white font-semibold shadow-lg hover:shadow-red-500/25 hover:scale-105">
                <div class="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-500"></div>
                <div class="relative flex items-center space-x-2">
                  <span>🗑️</span>
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
        <td colspan="3" class="px-8 py-16 text-center">
          <div class="flex flex-col items-center space-y-4">
            <div class="w-20 h-20 rounded-full bg-gradient-to-r from-red-600 to-rose-600 flex items-center justify-center opacity-80">
              <span class="text-2xl">⚠️</span>
            </div>
            <p class="text-red-400 font-semibold text-lg">Failed to load files</p>
            <p class="text-slate-400 text-sm">Check your connection and try again</p>
            <button onclick="loadFiles()" class="mt-4 px-4 py-2 bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-400 hover:to-rose-400 rounded-lg text-white font-medium transition-all duration-200">
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
    const fileUrl = `http://127.0.0.1:3000/files/${encodeURIComponent(filename)}`;
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
    deleteHeader.className = 'px-8 py-6 text-left text-sm font-bold text-slate-300 uppercase tracking-wider';
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
    // In Electron app - open in system browser
    window.browserAPI.openExternal(url);
  } else {
    // Fallback for web browser
    window.open(url, '_blank');
  }
}

window.addEventListener('load', () => {
  updateTableHeaders();
  loadFiles();
});