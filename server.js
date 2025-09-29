// Simple development server for Chrome Extension
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 5000;

// MIME types
const mimeTypes = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

const server = http.createServer((req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  let filePath = '.' + req.url;
  if (filePath === './') {
    filePath = './index.html';
  }

  const extname = String(path.extname(filePath)).toLowerCase();
  const mimeType = mimeTypes[extname] || 'application/octet-stream';

  fs.readFile(filePath, (error, content) => {
    if (error) {
      if (error.code === 'ENOENT') {
        // Serve development instructions page
        if (req.url === '/' || req.url === '/index.html') {
          const instructionsHTML = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Smart Translator - Chrome Extension Development</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            background: #f5f5f5;
            color: #333;
        }
        .header {
            background: #0078d4;
            color: white;
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 20px;
            text-align: center;
        }
        .card {
            background: white;
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 20px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .step {
            margin-bottom: 15px;
            padding: 15px;
            background: #f8f9fa;
            border-left: 4px solid #0078d4;
            border-radius: 4px;
        }
        .step-number {
            font-weight: bold;
            color: #0078d4;
            margin-right: 8px;
        }
        code {
            background: #e9ecef;
            padding: 2px 6px;
            border-radius: 3px;
            font-family: 'Courier New', monospace;
        }
        .warning {
            background: #fff3cd;
            border: 1px solid #ffeaa7;
            color: #856404;
            padding: 12px;
            border-radius: 4px;
            margin-bottom: 20px;
        }
        .success {
            background: #d4edda;
            border: 1px solid #c3e6cb;
            color: #155724;
            padding: 12px;
            border-radius: 4px;
            margin-bottom: 20px;
        }
        .feature-list {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 15px;
            margin-top: 20px;
        }
        .feature {
            background: #f8f9fa;
            padding: 15px;
            border-radius: 6px;
            text-align: center;
        }
        .feature-icon {
            font-size: 24px;
            margin-bottom: 8px;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>🌐 Smart Translator</h1>
        <p>Chrome Extension Development Server</p>
    </div>

    <div class="success">
        ✅ Development server is running successfully on port ${PORT}
    </div>

    <div class="card">
        <h2>📦 How to Install the Chrome Extension</h2>
        
        <div class="step">
            <span class="step-number">1.</span>
            Open Chrome and go to <code>chrome://extensions/</code>
        </div>
        
        <div class="step">
            <span class="step-number">2.</span>
            Enable "Developer mode" by toggling the switch in the top right corner
        </div>
        
        <div class="step">
            <span class="step-number">3.</span>
            Click "Load unpacked" button
        </div>
        
        <div class="step">
            <span class="step-number">4.</span>
            Select the current project directory (the folder containing manifest.json)
        </div>
        
        <div class="step">
            <span class="step-number">5.</span>
            The Smart Translator extension should now appear in your extensions list
        </div>
    </div>

    <div class="card">
        <h2>🚀 How to Use the Extension</h2>
        
        <div class="step">
            <span class="step-number">1.</span>
            Navigate to any webpage with text content
        </div>
        
        <div class="step">
            <span class="step-number">2.</span>
            Select any text by highlighting it with your mouse
        </div>
        
        <div class="step">
            <span class="step-number">3.</span>
            A Metro-style popup will appear showing the translation
        </div>
        
        <div class="step">
            <span class="step-number">4.</span>
            Click elsewhere or press ESC to close the popup
        </div>
    </div>

    <div class="warning">
        ⚠️ <strong>API Connection:</strong> Make sure your translation API at 
        <code>https://x142xfvk-7027.asse.devtunnels.ms/api</code> is accessible and running.
    </div>

    <div class="card">
        <h2>✨ Extension Features</h2>
        <div class="feature-list">
            <div class="feature">
                <div class="feature-icon">🎯</div>
                <h3>Smart Selection</h3>
                <p>Automatically detects text selection on any webpage</p>
            </div>
            <div class="feature">
                <div class="feature-icon">🚀</div>
                <h3>Instant Translation</h3>
                <p>Fast translation using your existing API endpoint</p>
            </div>
            <div class="feature">
                <div class="feature-icon">🎨</div>
                <h3>Metro Design</h3>
                <p>Clean, modern interface with smooth animations</p>
            </div>
            <div class="feature">
                <div class="feature-icon">🌐</div>
                <h3>Universal Support</h3>
                <p>Works on all websites with proper permissions</p>
            </div>
        </div>
    </div>

    <div class="card">
        <h2>📁 Extension Files</h2>
        <ul>
            <li><strong>manifest.json</strong> - Extension configuration</li>
            <li><strong>content.js/css</strong> - Handles text selection and popup</li>
            <li><strong>background.js</strong> - Service worker for API communication</li>
            <li><strong>popup.html/css/js</strong> - Extension popup interface</li>
            <li><strong>icons/</strong> - Extension icons (16px, 48px, 128px)</li>
        </ul>
    </div>

    <div class="card">
        <h2>🔧 Development Tips</h2>
        <ul>
            <li>Reload the extension in chrome://extensions/ after making changes</li>
            <li>Use Chrome DevTools to debug content scripts</li>
            <li>Check the extension popup by right-clicking the extension icon</li>
            <li>Monitor API calls in the Network tab</li>
            <li>Use console.log() in background.js for service worker debugging</li>
        </ul>
    </div>
</body>
</html>`;
          res.writeHead(200, { 'Content-Type': 'text/html' });
          res.end(instructionsHTML);
        } else {
          res.writeHead(404, { 'Content-Type': 'text/plain' });
          res.end('404 Not Found');
        }
      } else {
        res.writeHead(500);
        res.end('Server Error: ' + error.code);
      }
    } else {
      res.writeHead(200, { 'Content-Type': mimeType });
      res.end(content, 'utf-8');
    }
  });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Smart Translator Development Server running at http://localhost:${PORT}`);
  console.log('📦 Chrome Extension files are ready for installation');
  console.log('🌐 Open the URL above for installation instructions');
});

// Handle server shutdown gracefully
process.on('SIGINT', () => {
  console.log('\n⏹️  Shutting down development server...');
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});