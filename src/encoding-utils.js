/*! Encoding & Decoding Utilities - Runtime Dynamic Rendering */

(function() {
  'use strict';

  // ==================== BASE64 ENCODING/DECODING ====================

  const b64Encode = (str) => {
    try {
      return btoa(unescape(encodeURIComponent(str)));
    } catch (e) {
      console.error('[v0] B64 encode error:', e);
      return str;
    }
  };

  const b64Decode = (str) => {
    try {
      return decodeURIComponent(escape(atob(str)));
    } catch (e) {
      console.error('[v0] B64 decode error:', e);
      return str;
    }
  };

  // ==================== HEX ENCODING/DECODING ====================

  const hexEncode = (str) => {
    let hex = '';
    for (let i = 0; i < str.length; i++) {
      hex += ('0' + str.charCodeAt(i).toString(16)).slice(-2);
    }
    return hex;
  };

  const hexDecode = (hex) => {
    let str = '';
    for (let i = 0; i < hex.length; i += 2) {
      str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
    }
    return str;
  };

  // ==================== OBFUSCATED DATA STORAGE ====================

  window._SecureData = {
    _cache: new Map(),

    set: function(key, value, encoding = 'b64') {
      if (encoding === 'hex') {
        this._cache.set(key, hexEncode(value));
      } else {
        this._cache.set(key, b64Encode(value));
      }
    },

    get: function(key, encoding = 'b64') {
      const encoded = this._cache.get(key);
      if (!encoded) return null;
      
      if (encoding === 'hex') {
        return hexDecode(encoded);
      } else {
        return b64Decode(encoded);
      }
    },

    delete: function(key) {
      this._cache.delete(key);
    },

    clear: function() {
      this._cache.clear();
    }
  };

  // ==================== DYNAMIC HTML INJECTION ====================

  window._DOMRenderer = {
    renderFromEncoded: function(encodedHTML, targetSelector, encoding = 'b64') {
      const decodedHTML = encoding === 'hex' ? 
        hexDecode(encodedHTML) : 
        b64Decode(encodedHTML);
      
      const target = document.querySelector(targetSelector);
      if (!target) {
        console.error('[v0] Target selector not found:', targetSelector);
        return false;
      }

      try {
        target.innerHTML = decodedHTML;
        // Re-initialize event listeners after DOM injection
        this._initEventListeners(target);
        return true;
      } catch (e) {
        console.error('[v0] DOM render error:', e);
        return false;
      }
    },

    renderFromFunction: function(renderFunction, targetSelector) {
      const target = document.querySelector(targetSelector);
      if (!target) {
        console.error('[v0] Target selector not found:', targetSelector);
        return false;
      }

      try {
        const html = renderFunction();
        target.innerHTML = html;
        this._initEventListeners(target);
        return true;
      } catch (e) {
        console.error('[v0] DOM render error:', e);
        return false;
      }
    },

    _initEventListeners: function(container) {
      // Re-attach event listeners after DOM injection
      const buttons = container.querySelectorAll('[data-action]');
      buttons.forEach(btn => {
        const action = btn.getAttribute('data-action');
        btn.addEventListener('click', (e) => {
          if (window._EventHandler && window._EventHandler[action]) {
            e.preventDefault();
            window._EventHandler[action](e);
          }
        });
      });
    }
  };

  // ==================== ENVIRONMENT VARIABLE PROTECTION ====================

  window._EnvSecure = {
    data: {},

    set: function(key, value) {
      this.data[key] = b64Encode(value);
    },

    get: function(key) {
      const encoded = this.data[key];
      return encoded ? b64Decode(encoded) : null;
    },

    setMultiple: function(obj) {
      Object.keys(obj).forEach(key => {
        this.set(key, obj[key]);
      });
    }
  };

  // ==================== STRING OBFUSCATION ====================

  window._ObfuscateString = {
    encode: function(str, salt = 0) {
      let result = '';
      for (let i = 0; i < str.length; i++) {
        result += String.fromCharCode(str.charCodeAt(i) + salt);
      }
      return b64Encode(result);
    },

    decode: function(encoded, salt = 0) {
      const decoded = b64Decode(encoded);
      let result = '';
      for (let i = 0; i < decoded.length; i++) {
        result += String.fromCharCode(decoded.charCodeAt(i) - salt);
      }
      return result;
    }
  };

  // ==================== DEFER SENSITIVE FUNCTIONS ====================

  window._DeferredExecution = {
    tasks: [],

    add: function(fn, delay = 1000) {
      this.tasks.push(() => {
        setTimeout(fn, delay);
      });
    },

    executeAll: function() {
      this.tasks.forEach(task => task());
      this.tasks = [];
    }
  };

  // ==================== EXPORT FOR USE ====================

  // Make utilities available globally but hidden
  Object.defineProperty(window, '__SECURE_UTILS__', {
    value: {
      b64Encode,
      b64Decode,
      hexEncode,
      hexDecode
    },
    configurable: false,
    writable: false,
    enumerable: false
  });

})();
