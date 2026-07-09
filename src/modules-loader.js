/*! Module Loader - Loads modularized functionality */

(function() {
  'use strict';

  // ==================== MODULE REGISTRY ====================

  const _a = {};
  const _b = [];
  
  window._ModuleLoader = {
    register: function(name, fn) {
      _a[name] = fn;
    },
    
    load: function(name) {
      if (_a[name]) {
        _a[name]();
        _b.push(name);
      }
    },
    
    loadAll: function() {
      Object.keys(_a).forEach((name) => {
        this.load(name);
      });
    },
    
    getLoaded: function() {
      return _b;
    }
  };

  // ==================== GLOBAL UTILITIES (REFACTORED) ====================

  window._Utils = {
    $_: function(sel, ctx) { return (ctx || document).querySelector(sel); },
    
    $$$: function(sel, ctx) { return Array.from((ctx || document).querySelectorAll(sel)); },
    
    parseDate: function(yyyyMmDd) {
      const [y, m, d] = yyyyMmDd.split('-').map(Number);
      return new Date(y, m - 1, d);
    },
    
    formatLongDate: function(date) {
      const weekdays = ['Minggu','Senin','Selasa','Rabu','Kamis','Jumat','Sabtu'];
      const months = ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'];
      return weekdays[date.getDay()] + ', ' + date.getDate() + ' ' + months[date.getMonth()] + ' ' + date.getFullYear();
    }
  };

  // ==================== INITIALIZATION ====================

  document.addEventListener('DOMContentLoaded', function() {
    // Register all modules (they will be defined in separate files)
    // For now, just provide the infrastructure
    console.log('[v0] Module loader ready. Waiting for modules...');
  });

})();
