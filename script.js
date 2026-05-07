/* ============================================================
   HAYKAL SERVICE - Single Page Portfolio
   ============================================================ */

(function () {
    'use strict';

    // -------- Booking schedule data (past + future) ---------
    // Format tanggal: 'YYYY-MM-DD'
    // Pilihan status: 'selesai', 'pengerjaan', atau 'antrian'
    const scheduleData = [
        { tanggal: '2026-04-08', nama_klien: 'aeroblast', paket_layanan: 'TikTok (Tanpa Revisi)', status: 'selesai' },
        { tanggal: '2026-05-07', nama_klien: 'cloudsmp', paket_layanan: 'TikTok (Tanpa Revisi)', status: 'selesai' },
        { tanggal: '2026-04-15', nama_klien: 'potatosmp', paket_layanan: 'Jasa Pembuatan Website', status: 'selesai' },
    ];
   
    const WA_NUMBER = '628123731343';
    const monthsShort = ['JAN', 'FEB', 'MAR', 'APR', 'MEI', 'JUN', 'JUL', 'AGT', 'SEP', 'OKT', 'NOV', 'DES'];
    const monthsLong  = ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'];
    const weekdaysLong = ['Minggu','Senin','Selasa','Rabu','Kamis','Jumat','Sabtu'];

    function $(sel, ctx) { return (ctx || document).querySelector(sel); }
    function $$(sel, ctx) { return Array.from((ctx || document).querySelectorAll(sel)); }

    function parseDate(yyyyMmDd) {
        const [y, m, d] = yyyyMmDd.split('-').map(Number);
        return new Date(y, m - 1, d);
    }

    function formatLongDate(date) {
        return weekdaysLong[date.getDay()] + ', ' + date.getDate() + ' ' + monthsLong[date.getMonth()] + ' ' + date.getFullYear();
    }

    // -------- Hamburger menu --------
    function initHamburger() {
        const hamburger = $('#hamburger');
        const navMenu = $('#navMenu');
        if (!hamburger || !navMenu) return;

        function close() {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            hamburger.setAttribute('aria-expanded', 'false');
            hamburger.setAttribute('aria-label', 'Buka menu');
        }
        function open() {
            hamburger.classList.add('active');
            navMenu.classList.add('active');
            hamburger.setAttribute('aria-expanded', 'true');
            hamburger.setAttribute('aria-label', 'Tutup menu');
        }

        hamburger.addEventListener('click', function () {
            if (navMenu.classList.contains('active')) close(); else open();
        });

        $$('.nav-link, .nav-cta', navMenu).forEach(function (link) {
            link.addEventListener('click', close);
        });

        document.addEventListener('click', function (e) {
            if (!navMenu.classList.contains('active')) return;
            if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) close();
        });

        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && navMenu.classList.contains('active')) close();
        });
    }

    // -------- Navbar scroll state + active link --------
    function initNavbar() {
        const navbar = $('#navbar');
        const links = $$('.nav-link');
        const sections = links
            .map(function (l) { return document.querySelector(l.getAttribute('href')); })
            .filter(Boolean);

        function onScroll() {
            if (navbar) {
                if (window.scrollY > 24) navbar.classList.add('scrolled');
                else navbar.classList.remove('scrolled');
            }

            let current = sections[0] ? sections[0].id : '';
            const offset = 120;
            sections.forEach(function (sec) {
                const top = sec.getBoundingClientRect().top;
                if (top - offset <= 0) current = sec.id;
            });
            links.forEach(function (l) {
                const target = (l.getAttribute('href') || '').replace('#', '');
                l.classList.toggle('active', target === current);
            });
        }

        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();
    }

    // -------- Order Modal (Beli) --------
    function buildOrderText(packageName, price) {
        const pkg = packageName ? packageName : 'pilih paket';
        const priceLine = price ? price : 'pilih paket';
        return [
            'Halo Haykal Service!',
            'Saya ingin memesan layanan dengan detail berikut:',
            '',
            '• Nama        : [isi nama kamu]',
            '• Kontak (WA) : [isi nomor / username]',
            '• Paket       : ' + pkg + '   <-- pilih paket',
            '• Harga       : ' + priceLine,
            '• Tanggal     : [isi tanggal yang diinginkan]',
            '• Catatan     : [opsional]',
            '',
            'Mohon konfirmasi ketersediaan slot dan info pembayarannya.',
            'Terima kasih!'
        ].join('\n');
    }

    function initOrderModal() {
        const overlay = $('#orderModal');
        const closeBtn = $('#orderModalClose');
        const orderText = $('#orderText');
        const copyBtn = $('#copyOrderBtn');
        const copyLabel = $('#copyOrderLabel');
        const waBtn = $('#orderWaBtn');
        if (!overlay || !orderText) return;

        function open(packageName, price) {
            const text = buildOrderText(packageName, price);
            orderText.textContent = text;
            if (waBtn) {
                waBtn.href = 'https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(text);
            }
            overlay.hidden = false;
            // ensure CSS transition runs
            requestAnimationFrame(function () { overlay.classList.add('active'); });
            document.body.style.overflow = 'hidden';
            if (copyLabel) copyLabel.textContent = 'Salin Format';
        }

        function close() {
            overlay.classList.remove('active');
            document.body.style.overflow = '';
            window.setTimeout(function () { overlay.hidden = true; }, 250);
        }

        $$('.btn-buy').forEach(function (btn) {
            btn.addEventListener('click', function () {
                const pkg = btn.getAttribute('data-package') || '';
                const price = btn.getAttribute('data-price') || '';
                open(pkg, price);
            });
        });

        if (closeBtn) closeBtn.addEventListener('click', close);
        overlay.addEventListener('click', function (e) {
            if (e.target === overlay) close();
        });
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && !overlay.hidden) close();
        });

        if (copyBtn) {
            copyBtn.addEventListener('click', function () {
                const text = orderText.textContent || '';
                const finish = function () {
                    if (copyLabel) {
                        const original = 'Salin Format';
                        copyLabel.textContent = '✓ Tersalin';
                        window.setTimeout(function () { copyLabel.textContent = original; }, 1600);
                    }
                };
                if (navigator.clipboard && window.isSecureContext) {
                    navigator.clipboard.writeText(text).then(finish, fallbackCopy);
                } else {
                    fallbackCopy();
                }
                function fallbackCopy() {
                    const ta = document.createElement('textarea');
                    ta.value = text;
                    ta.setAttribute('readonly', '');
                    ta.style.position = 'absolute';
                    ta.style.left = '-9999px';
                    document.body.appendChild(ta);
                    ta.select();
                    try { document.execCommand('copy'); } catch (err) { /* noop */ }
                    document.body.removeChild(ta);
                    finish();
                }
            });
        }
    }

    // -------- Booking form --------
    function initBookingForm() {
        const form = $('#bookingForm');
        const success = $('#bookingSuccess');
        if (!form) return;

        form.addEventListener('submit', function (e) {
            e.preventDefault();

            const name = $('#bk-name').value.trim();
            const contact = $('#bk-contact').value.trim();
            const pkg = $('#bk-package').value;
            const date = $('#bk-date').value;
            const notes = $('#bk-notes').value.trim();

            if (!name || !contact || !pkg || !date) {
                form.classList.add('shake');
                window.setTimeout(function () { form.classList.remove('shake'); }, 400);
                form.reportValidity();
                return;
            }

            const dateObj = parseDate(date);
            const formattedDate = formatLongDate(dateObj);

            const lines = [
                'Halo Haykal Service!',
                'Saya ingin booking slot:',
                '',
                '• Nama    : ' + name,
                '• Kontak  : ' + contact,
                '• Paket   : ' + pkg,
                '• Tanggal : ' + formattedDate
            ];
            if (notes) {
                lines.push('• Catatan : ' + notes);
            }
            lines.push('');
            lines.push('Mohon konfirmasi ketersediaan slot tersebut. Terima kasih!');

            const url = 'https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(lines.join('\n'));
            window.open(url, '_blank', 'noopener');

            if (success) {
                success.hidden = false;
                window.setTimeout(function () { success.hidden = true; }, 6000);
            }
        });
    }

    // -------- Schedule list --------
    function renderSchedule() {
        const list = $('#scheduleList');
        if (!list) return;

        if (!scheduleData.length) {
            list.innerHTML = '<li class="schedule-empty">Belum ada slot terbooking.</li>';
            return;
        }

        // Sort ascending by date so the user sees full timeline (past + future together).
        const sorted = scheduleData.slice().sort(function (a, b) {
            return parseDate(a.tanggal) - parseDate(b.tanggal);
        });

        // Reference point: now (used only to mark visual "is-past" styling, never as text).
        const now = new Date();
        now.setHours(0, 0, 0, 0);

        const fragment = document.createDocumentFragment();
sorted.forEach(function (entry) {
            const d = parseDate(entry.tanggal);
            
            // 1. Tentukan Teks dan Warna (Class) berdasarkan status
            let statusText = 'sedang dalam pengerjaan';
            let statusClass = 'status-pengerjaan';

            if (entry.status === 'selesai') {
                statusText = 'sudah selesai';
                statusClass = 'status-selesai';
            } else if (entry.status === 'antrian') {
                statusText = 'menunggu antrian';
                statusClass = 'status-antrian';
            }

            // 2. Buat bungkus list, jika selesai, beri class 'is-past' agar meredup
            const li = document.createElement('li');
            li.className = 'schedule-item' + (entry.status === 'selesai' ? ' is-past' : '');

            const dateBox = document.createElement('div');
            dateBox.className = 'schedule-date';
            dateBox.innerHTML =
                '<span class="day">' + d.getDate() + '</span>' +
                '<span class="month">' + monthsShort[d.getMonth()] + '</span>';

            const info = document.createElement('div');
            info.className = 'schedule-info';
            const client = document.createElement('div');
            client.className = 'schedule-client';
            client.textContent = entry.nama_klien;
            const pkg = document.createElement('div');
            pkg.className = 'schedule-package';
            pkg.textContent = entry.paket_layanan + ' · ' + formatLongDate(d);
            info.appendChild(client);
            info.appendChild(pkg);

            // 3. Masukkan class warna dan teks statusnya ke dalam HTML
            const status = document.createElement('span');
            status.className = 'schedule-status ' + statusClass;
            status.textContent = statusText;

            li.appendChild(dateBox);
            li.appendChild(info);
            li.appendChild(status);
            fragment.appendChild(li);
        });

        list.innerHTML = '';
        list.appendChild(fragment);
    }

    // -------- Smooth scroll for anchor links (nav offset) --------
    function initSmoothScroll() {
        $$('a[href^="#"]').forEach(function (link) {
            link.addEventListener('click', function (e) {
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
    }
    function initCustomSelect() {
    const wrap = document.getElementById('pkgSelectWrap');
    const display = document.getElementById('pkgDisplay');
    const displayText = document.getElementById('pkgDisplayText');
    const dropdown = document.getElementById('pkgDropdown');
    const hiddenInput = document.getElementById('bk-package');
    if (!wrap || !display || !dropdown) return;

    function openDrop() {
        display.classList.add('open');
        dropdown.classList.add('open');
        display.setAttribute('aria-expanded', 'true');
    }
    function closeDrop() {
        display.classList.remove('open');
        dropdown.classList.remove('open');
        display.setAttribute('aria-expanded', 'false');
    }
    function toggle() {
        if (dropdown.classList.contains('open')) closeDrop(); else openDrop();
    }

    display.addEventListener('click', toggle);
    display.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); }
        if (e.key === 'Escape') closeDrop();
    });

    dropdown.querySelectorAll('.custom-select-option').forEach(function(opt) {
        opt.addEventListener('click', function() {
            const val = opt.getAttribute('data-value');
            const pkg = opt.getAttribute('data-pkg');
            hiddenInput.value = val;
            displayText.textContent = pkg;
            displayText.classList.remove('custom-select-placeholder');
            dropdown.querySelectorAll('.custom-select-option').forEach(function(o) { o.classList.remove('selected'); });
            opt.classList.add('selected');
            closeDrop();
        });
    });

    document.addEventListener('click', function(e) {
        if (!wrap.contains(e.target)) closeDrop();
    });
}
    // -------- Init --------
    document.addEventListener('DOMContentLoaded', function () {
        initHamburger();
        initNavbar();
        initOrderModal();
        initBookingForm();
        renderSchedule();
        initSmoothScroll();
        initCustomSelect();
    });
})();
