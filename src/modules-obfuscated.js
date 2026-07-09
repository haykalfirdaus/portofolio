/*! Obfuscated Modules - All functionality compiled and minified */

// ==================== MODULE 1: LOADING SCREEN ====================
(function() {
  const a = document.getElementById('loadingScreen');
  if (!a) return;
  const b = 2200;
  const c = Date.now();
  function d() {
    const e = Date.now() - c;
    const f = Math.max(0, b - e);
    setTimeout(function() {
      a.classList.add('ls-out');
      setTimeout(function() { a.remove(); }, 700);
    }, f);
  }
  if (document.readyState === 'complete') {
    d();
  } else {
    window.addEventListener('load', d);
  }
})();

// ==================== MODULE 2: SECURED DATA ====================
(function() {
  'use strict';

  // Encode sensitive data with base64
  const scheduleDataEncoded = window._SecureData ? window._SecureData.get('scheduleData', 'b64') : null;
  const waNumberEncoded = window._SecureData ? window._SecureData.get('WA_NUMBER', 'b64') : null;

  const $ = (sel, ctx) => (ctx || document).querySelector(sel);
  const $$ = (sel, ctx) => Array.from((ctx || document).querySelectorAll(sel));

  const m = ['JAN', 'FEB', 'MAR', 'APR', 'MEI', 'JUN', 'JUL', 'AGT', 'SEP', 'OKT', 'NOV', 'DES'];
  const n = ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'];
  const o = ['Minggu','Senin','Selasa','Rabu','Kamis','Jumat','Sabtu'];

  const p = (d) => {
    const [y, x, z] = d.split('-').map(Number);
    return new Date(y, x - 1, z);
  };

  const q = (date) => {
    return o[date.getDay()] + ', ' + date.getDate() + ' ' + n[date.getMonth()] + ' ' + date.getFullYear();
  };

  // Hamburger Menu
  (function() {
    const r = $('#hamburger');
    const s = $('#navMenu');
    if (!r || !s) return;

    const close = () => {
      r.classList.remove('active');
      s.classList.remove('active');
      r.setAttribute('aria-expanded', 'false');
    };

    const open = () => {
      r.classList.add('active');
      s.classList.add('active');
      r.setAttribute('aria-expanded', 'true');
    };

    r.addEventListener('click', () => {
      if (s.classList.contains('active')) close(); else open();
    });

    $$('.nav-link, .nav-cta', s).forEach(link => {
      link.addEventListener('click', close);
    });

    document.addEventListener('click', (e) => {
      if (!s.classList.contains('active')) return;
      if (!r.contains(e.target) && !s.contains(e.target)) close();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && s.classList.contains('active')) close();
    });
  })();

  // Navbar Scroll
  (function() {
    const t = $('#navbar');
    const u = $$('.nav-link');
    const v = u.map(l => document.querySelector(l.getAttribute('href'))).filter(Boolean);

    const scroll = () => {
      if (t) {
        if (window.scrollY > 24) t.classList.add('scrolled');
        else t.classList.remove('scrolled');
      }

      let w = v[0] ? v[0].id : '';
      const x = 120;
      v.forEach(sec => {
        const y = sec.getBoundingClientRect().top;
        if (y - x <= 0) w = sec.id;
      });

      u.forEach(l => {
        const z = (l.getAttribute('href') || '').replace('#', '');
        l.classList.toggle('active', z === w);
      });
    };

    window.addEventListener('scroll', scroll, { passive: true });
    scroll();
  })();

  // Smooth Scroll
  (function() {
    $$('a[href^="#"]').forEach(link => {
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        if (!href || href === '#') return;
        const target = document.querySelector(href);
        if (!target) return;
        e.preventDefault();
        const navH = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 72;
        const top = target.getBoundingClientRect().top + window.scrollY - navH + 1;
        window.scrollTo({ top: top, behavior: 'smooth' });
      });
    });
  })();

  // Custom Select
  (function() {
    const A = document.getElementById('pkgSelectWrap');
    const B = document.getElementById('pkgDisplay');
    const C = document.getElementById('pkgDisplayText');
    const D = document.getElementById('pkgDropdown');
    const E = document.getElementById('bk-package');
    if (!A || !B || !D) return;

    const open = () => {
      B.classList.add('open');
      D.classList.add('open');
      B.setAttribute('aria-expanded', 'true');
    };

    const close = () => {
      B.classList.remove('open');
      D.classList.remove('open');
      B.setAttribute('aria-expanded', 'false');
    };

    const toggle = () => {
      if (D.classList.contains('open')) close(); else open();
    };

    B.addEventListener('click', toggle);
    B.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); }
      if (e.key === 'Escape') close();
    });

    D.querySelectorAll('.custom-select-option').forEach(opt => {
      opt.addEventListener('click', () => {
        const F = opt.getAttribute('data-value');
        const G = opt.getAttribute('data-pkg');
        E.value = F;
        C.textContent = G;
        C.classList.remove('custom-select-placeholder');
        D.querySelectorAll('.custom-select-option').forEach(o => o.classList.remove('selected'));
        opt.classList.add('selected');
        close();
      });
    });

    document.addEventListener('click', (e) => {
      if (!A.contains(e.target)) close();
    });
  })();

  // Schedule Toggle
  (function() {
    const H = $('#toggleScheduleBtn');
    if (!H) return;

    window.showAllSchedule = false;

    H.addEventListener('click', () => {
      window.showAllSchedule = !window.showAllSchedule;
      if (window.showAllSchedule) {
        H.textContent = 'Sembunyikan Jadwal Lama';
        H.style.borderColor = 'var(--red-500)';
      } else {
        H.textContent = 'Lihat Semua Jadwal';
        H.style.borderColor = '';
      }
      renderSchedule();
    });
  })();

  // Render Schedule
  const renderSchedule = (I) => {
    const J = I || $('#scheduleList');
    if (!J) return;

    // Decode schedule data if encoded
    const K = scheduleDataEncoded ? 
      JSON.parse(window._SecureData.get('scheduleData', 'b64')) : [];

    if (!K.length) {
      J.innerHTML = '<li class="schedule-empty">Belum ada slot ter-booking.</li>';
      return;
    }

    const L = K.slice().sort((a, b) => p(a.tanggal) - p(b.tanggal));
    const M = window.showAllSchedule ? L : L.slice(-3);
    const N = document.createDocumentFragment();

    M.forEach(entry => {
      const O = p(entry.tanggal);
      let P = 'sedang dalam pengerjaan';
      let Q = 'status-pengerjaan';
      if (entry.status === 'selesai') {
        P = 'sudah selesai';
        Q = 'status-selesai';
      } else if (entry.status === 'antrian') {
        P = 'menunggu antrian';
        Q = 'status-antrian';
      }

      const R = document.createElement('li');
      R.className = 'schedule-item' + (entry.status === 'selesai' ? ' is-past' : '');
      R.innerHTML = `
        <div class="schedule-date">
          <span class="day">${O.getDate()}</span>
          <span class="month">${m[O.getMonth()]}</span>
        </div>
        <div class="schedule-info">
          <div class="schedule-client">${entry.nama_klien}</div>
          <div class="schedule-package">${entry.paket_layanan} · ${q(O)}</div>
        </div>
        <span class="schedule-status ${Q}">${P}</span>`;
      N.appendChild(R);
    });

    J.innerHTML = '';
    J.appendChild(N);
  };

  window.renderSchedule = renderSchedule;

})();

// ==================== MODULE 3: ORDER & BOOKING ====================
(function() {
  const $ = (sel, ctx) => (ctx || document).querySelector(sel);
  const $$ = (sel, ctx) => Array.from((ctx || document).querySelectorAll(sel));

  const waNum = window._EnvSecure ? window._EnvSecure.get('WA_NUMBER') : '628123731343';

  const buildOrderText = (pkgName, price) => {
    const S = pkgName ? pkgName : 'pilih paket';
    const T = price ? price : 'pilih paket';
    return [
      'Halo Haykal Service!',
      'Saya ingin memesan layanan dengan detail berikut:',
      '',
      '• Nama        : [isi nama kamu]',
      '• Kontak (WA) : [isi nomor / username]',
      '• Paket       : ' + S + '   <-- pilih paket',
      '• Harga       : ' + T,
      '• Tanggal     : [isi tanggal yang diinginkan]',
      '• Catatan     : [opsional]',
      '',
      'Mohon konfirmasi ketersediaan slot dan info pembayarannya.',
      'Terima kasih!'
    ].join('\n');
  };

  // Order Modal
  (function() {
    const U = $('#orderModal');
    const V = $('#orderModalClose');
    const W = $('#orderText');
    const X = $('#copyOrderBtn');
    const Y = $('#copyOrderLabel');
    const Z = $('#orderWaBtn');
    if (!U || !W) return;

    const open = (pkgName, price) => {
      const text = buildOrderText(pkgName, price);
      W.textContent = text;
      if (Z) {
        Z.href = 'https://wa.me/' + waNum + '?text=' + encodeURIComponent(text);
      }
      U.hidden = false;
      requestAnimationFrame(() => U.classList.add('active'));
      document.body.style.overflow = 'hidden';
      if (Y) Y.textContent = 'Salin Format';
    };

    const close = () => {
      U.classList.remove('active');
      document.body.style.overflow = '';
      setTimeout(() => { U.hidden = true; }, 250);
    };

    $$('.btn-buy').forEach(btn => {
      btn.addEventListener('click', () => {
        const pkg = btn.getAttribute('data-package') || '';
        const price = btn.getAttribute('data-price') || '';
        if (pkg === 'Skin Minecraft Custom') {
          if (window.openSkinModal) window.openSkinModal();
          return;
        }
        open(pkg, price);
      });
    });

    if (V) V.addEventListener('click', close);
    U.addEventListener('click', (e) => {
      if (e.target === U) close();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !U.hidden) close();
    });

    if (X) {
      X.addEventListener('click', () => {
        const text = W.textContent || '';
        const finish = () => {
          if (Y) {
            const orig = 'Salin Format';
            Y.textContent = '✓ Tersalin';
            setTimeout(() => { Y.textContent = orig; }, 1600);
          }
        };
        if (navigator.clipboard && window.isSecureContext) {
          navigator.clipboard.writeText(text).then(finish, fallback);
        } else {
          fallback();
        }
        function fallback() {
          const ta = document.createElement('textarea');
          ta.value = text;
          ta.setAttribute('readonly', '');
          ta.style.position = 'absolute';
          ta.style.left = '-9999px';
          document.body.appendChild(ta);
          ta.select();
          try { document.execCommand('copy'); } catch (err) {}
          document.body.removeChild(ta);
          finish();
        }
      });
    }
  })();

  // Booking Form
  (function() {
    const AA = $('#bookingForm');
    const AB = $('#bookingSuccess');
    if (!AA) return;

    AA.addEventListener('submit', (e) => {
      e.preventDefault();

      const AC = $('#bk-name').value.trim();
      const AD = $('#bk-contact').value.trim();
      const AE = $('#bk-package').value;
      const AF = $('#bk-date').value;
      const AG = $('#bk-notes').value.trim();

      if (!AC || !AD || !AE || !AF) {
        AA.classList.add('shake');
        setTimeout(() => { AA.classList.remove('shake'); }, 400);
        AA.reportValidity();
        return;
      }

      const AH = new Date(...AF.split('-').map(Number));
      AH.setDate(AH.getDate() + 1);
      const AI = ['Minggu','Senin','Selasa','Rabu','Kamis','Jumat','Sabtu'];
      const AJ = ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'];
      const formattedDate = AI[AH.getDay()] + ', ' + AH.getDate() + ' ' + AJ[AH.getMonth()] + ' ' + AH.getFullYear();

      const lines = [
        'Halo Haykal Service!',
        'Saya ingin booking slot:',
        '',
        '• Nama    : ' + AC,
        '• Kontak  : ' + AD,
        '• Paket   : ' + AE,
        '• Tanggal : ' + formattedDate
      ];
      if (AG) lines.push('• Catatan : ' + AG);
      lines.push('');
      lines.push('Mohon konfirmasi ketersediaan slot tersebut. Terima kasih!');

      const url = 'https://wa.me/' + waNum + '?text=' + encodeURIComponent(lines.join('\n'));
      window.open(url, '_blank', 'noopener');

      if (AB) {
        AB.hidden = false;
        setTimeout(() => { AB.hidden = true; }, 6000);
      }
    });
  })();

})();

// ==================== MODULE 4: SKIN MODAL ====================
(function() {
  const $ = (sel, ctx) => (ctx || document).querySelector(sel);

  const waNum = window._EnvSecure ? window._EnvSecure.get('WA_NUMBER') : '628123731343';

  window.openSkinModal = function() {
    const AK = $('#skinModal');
    if (!AK) return;
    AK.removeAttribute('hidden');
    requestAnimationFrame(() => {
      AK.classList.add('active');
    });
    document.body.style.overflow = 'hidden';
  };

  (function() {
    const AL = $('#skinModal');
    const AM = $('#skinModalClose');
    if (!AL || !AM) return;

    const close = () => {
      AL.classList.remove('active');
      document.body.style.overflow = '';
      setTimeout(() => {
        AL.setAttribute('hidden', '');
      }, 250);
    };

    AM.addEventListener('click', close);

    AL.addEventListener('click', (e) => {
      if (e.target === AL) close();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !AL.hasAttribute('hidden')) close();
    });

    const AN = $('#skinOrderBtn');
    if (AN) {
      AN.addEventListener('click', () => {
        const message = encodeURIComponent(
          '🎮 *PEMESANAN SKIN MINECRAFT*\n\n' +
          '👤 Nama: \n' +
          '📦 Paket: Skin Minecraft Custom\n' +
          '💰 Budget: (sesuaikan dengan kerumitan)\n' +
          '📝 Deskripsi Skin:\n' +
          '   - Style: (misal: anime, realistic, chibi, dll)\n' +
          '   - Warna dominan: \n' +
          '   - Detail khusus: \n' +
          '   - Referensi (jika ada): \n\n' +
          '⏱️ Deadline: \n' +
          '📱 Kontak: '
        );
        window.open('https://wa.me/' + waNum + '?text=' + message, '_blank', 'noopener');
      });
    }
  })();

})();
