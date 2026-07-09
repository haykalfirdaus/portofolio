/*! Security Shield - DevTools & Inspection Blocker */

(function() {
  'use strict';

  // ==================== DEBUGGER DETECTION ====================
  let devToolsOpen = false;
  let devToolsWarned = false;

  // Detect DevTools opening via timing
  const detectDevTools = () => {
    const threshold = 160;
    let start = performance.now();
    debugger;
    let end = performance.now();
    
    if (end - start > threshold) {
      devToolsOpen = true;
      handleDevToolsDetected();
    }
  };

  // Run detection periodically
  setInterval(() => {
    try {
      const start = console.time.toString().length;
      if (start > 30) {
        devToolsOpen = true;
        handleDevToolsDetected();
      }
    } catch (e) {}
  }, 1000);

  // ==================== EVENT BLOCKING ====================

  // Block F12 key
  document.addEventListener('keydown', (e) => {
    if (e.keyCode === 123) {
      e.preventDefault();
      e.stopImmediatePropagation();
      showWarning('DevTools tidak diizinkan');
      return false;
    }

    // Block Ctrl+Shift+I (Inspect Element)
    if (e.ctrlKey && e.shiftKey && e.keyCode === 73) {
      e.preventDefault();
      e.stopImmediatePropagation();
      showWarning('Inspect Element tidak diizinkan');
      return false;
    }

    // Block Ctrl+Shift+C (Inspect Element - Firefox)
    if (e.ctrlKey && e.shiftKey && e.keyCode === 67) {
      e.preventDefault();
      e.stopImmediatePropagation();
      showWarning('Inspect Element tidak diizinkan');
      return false;
    }

    // Block Ctrl+Shift+J (Console - Firefox)
    if (e.ctrlKey && e.shiftKey && e.keyCode === 74) {
      e.preventDefault();
      e.stopImmediatePropagation();
      showWarning('Console tidak diizinkan');
      return false;
    }

    // Block Ctrl+U (View Source)
    if (e.ctrlKey && e.keyCode === 85) {
      e.preventDefault();
      e.stopImmediatePropagation();
      showWarning('View Source tidak diizinkan');
      return false;
    }

    // Block Cmd+Option+I (Mac - DevTools)
    if (e.metaKey && e.altKey && e.keyCode === 73) {
      e.preventDefault();
      e.stopImmediatePropagation();
      showWarning('DevTools tidak diizinkan');
      return false;
    }

    // Block Cmd+Option+U (Mac - View Source)
    if (e.metaKey && e.altKey && e.keyCode === 85) {
      e.preventDefault();
      e.stopImmediatePropagation();
      showWarning('View Source tidak diizinkan');
      return false;
    }
  }, true);

  // Block Right Click
  document.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    e.stopImmediatePropagation();
    showWarning('Klik kanan tidak diizinkan');
    return false;
  }, true);

  // ==================== CONSOLE PROTECTION ====================

  // Override console methods
  const blockedMethods = ['log', 'info', 'warn', 'error', 'debug'];
  
  blockedMethods.forEach(method => {
    console[method] = function() {
      if (devToolsOpen) {
        return;
      }
    };
  });

  // Block console.table
  console.table = function() {};

  // Block console.group
  console.group = function() {};
  console.groupEnd = function() {};

  // ==================== DEVTOOLS DETECTION & WARNING ====================

  function showWarning(message) {
    if (!devToolsWarned) {
      devToolsWarned = true;
      
      // Create warning overlay
      const warning = document.createElement('div');
      warning.id = 'dev-tools-warning';
      warning.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.9);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 999999;
        font-family: 'Arial', sans-serif;
      `;
      
      const content = document.createElement('div');
      content.style.cssText = `
        background: #1a1a1a;
        border: 2px solid #ff4444;
        color: #fff;
        padding: 40px;
        border-radius: 8px;
        text-align: center;
        max-width: 500px;
      `;
      
      content.innerHTML = `
        <h2 style="color: #ff4444; margin: 0 0 20px 0; font-size: 24px;">Akses Ditolak</h2>
        <p style="margin: 10px 0; font-size: 16px;">${message}</p>
        <p style="margin: 10px 0; font-size: 14px; color: #aaa;">Halaman ini dilindungi. Akses DevTools tidak diizinkan.</p>
        <button id="close-warning" style="
          margin-top: 20px;
          padding: 10px 30px;
          background: #ff4444;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
          font-weight: bold;
        ">Tutup Peringatan</button>
      `;
      
      warning.appendChild(content);
      document.body.appendChild(warning);
      
      // Close button handler
      document.getElementById('close-warning').addEventListener('click', () => {
        warning.remove();
        devToolsWarned = false;
      });
      
      // Auto remove after 5 seconds
      setTimeout(() => {
        if (warning.parentNode) {
          warning.remove();
          devToolsWarned = false;
        }
      }, 5000);
    }
  }

  function handleDevToolsDetected() {
    if (!devToolsOpen) return;
    
    const message = 'DevTools terdeteksi! Akses tidak diizinkan.';
    showWarning(message);
    
    // Optional: Redirect or disable features
    // window.location.href = 'about:blank';
  }

  // ==================== OBJECT PROPERTY PROTECTION ====================

  // Prevent access to devtools-related objects
  const protectProperty = (obj, prop) => {
    try {
      Object.defineProperty(obj, prop, {
        get() {
          handleDevToolsDetected();
          return undefined;
        },
        set(value) {
          handleDevToolsDetected();
        }
      });
    } catch (e) {}
  };

  // Protect __proto__ and constructor
  try {
    Object.freeze(Object.prototype);
    Object.freeze(Function.prototype);
  } catch (e) {}

  // ==================== INITIALIZATION ====================

  window.addEventListener('load', () => {
    // Initial DevTools check
    detectDevTools();
    
    // Periodically check for DevTools
    setInterval(detectDevTools, 2000);
  });

  // Prevent code minification removal
  console.log = function() {};

})();
