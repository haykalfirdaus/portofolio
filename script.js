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
        { tanggal: '2026-02-02', nama_klien: 'aeoblast', paket_layanan: 'Jasa Pembuatan Website', status: 'selesai' },
        { tanggal: '2026-05-09', nama_klien: 'cloudsmp', paket_layanan: 'TikTok (Tanpa Revisi)', status: 'selesai' },
        { tanggal: '2026-05-10', nama_klien: 'minervax', paket_layanan: 'TikTok (Tanpa Revisi)', status: 'selesai' },
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
                // ✅ FIX: Jika paket Skin Minecraft, buka skin modal, bukan order modal
                if (pkg === 'Skin Minecraft Custom') {
                    openSkinModal();
                    return;
                }
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

        const sorted = scheduleData.slice().sort(function (a, b) {
            return parseDate(a.tanggal) - parseDate(b.tanggal);
        });

        const jadwalYangDitampilkan = window.showAllSchedule ? sorted : sorted.slice(-3);

        const now = new Date();
        now.setHours(0, 0, 0, 0);

        const fragment = document.createDocumentFragment();

        jadwalYangDitampilkan.forEach(function (entry) {
            const d = parseDate(entry.tanggal);

            let statusText = 'sedang dalam pengerjaan';
            let statusClass = 'status-pengerjaan';

            if (entry.status === 'selesai') {
                statusText = 'sudah selesai';
                statusClass = 'status-selesai';
            } else if (entry.status === 'antrian') {
                statusText = 'menunggu antrian';
                statusClass = 'status-antrian';
            }

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

    // -------- Custom Package Dropdown --------
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
        display.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); }
            if (e.key === 'Escape') closeDrop();
        });

        dropdown.querySelectorAll('.custom-select-option').forEach(function (opt) {
            opt.addEventListener('click', function () {
                const val = opt.getAttribute('data-value');
                const pkg = opt.getAttribute('data-pkg');
                hiddenInput.value = val;
                displayText.textContent = pkg;
                displayText.classList.remove('custom-select-placeholder');
                dropdown.querySelectorAll('.custom-select-option').forEach(function (o) { o.classList.remove('selected'); });
                opt.classList.add('selected');
                closeDrop();
            });
        });

        document.addEventListener('click', function (e) {
            if (!wrap.contains(e.target)) closeDrop();
        });
    }

    // -------- Toggle Schedule --------
    function initScheduleToggle() {
        const btn = $('#toggleScheduleBtn');
        if (!btn) return;

        window.showAllSchedule = false;

        btn.addEventListener('click', function () {
            window.showAllSchedule = !window.showAllSchedule;

            if (window.showAllSchedule) {
                btn.textContent = 'Sembunyikan Jadwal Lama';
                btn.style.borderColor = 'var(--red-500)';
            } else {
                btn.textContent = 'Lihat Semua Jadwal';
                btn.style.borderColor = '';
            }

            renderSchedule();
        });
    }

    // -------- Skin Modal --------
    // ✅ FIX: openSkinModal didefinisikan di sini sebelum initPreview dipanggil
    window.openSkinModal = function () {
        const modal = $('#skinModal');
        if (!modal) return;
        modal.removeAttribute('hidden');
        // requestAnimationFrame agar CSS transition pointer-events aktif
        requestAnimationFrame(function () {
            modal.classList.add('active');
        });
        document.body.style.overflow = 'hidden';
    };

    function initSkinModal() {
        const modal = $('#skinModal');
        const closeBtn = $('#skinModalClose');
        if (!modal || !closeBtn) return;

        function close() {
            modal.classList.remove('active');
            document.body.style.overflow = '';
            // Tunggu transisi selesai baru sembunyikan elemen
            setTimeout(function () {
                modal.setAttribute('hidden', '');
            }, 250);
        }

        closeBtn.addEventListener('click', close);

        // Klik di luar modal (overlay) untuk menutup
        modal.addEventListener('click', function (e) {
            if (e.target === modal) close();
        });

        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && !modal.hasAttribute('hidden')) close();
        });

        const orderBtn = $('#skinOrderBtn');
        if (orderBtn) {
            orderBtn.addEventListener('click', function () {
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
                window.open('https://wa.me/' + WA_NUMBER + '?text=' + message, '_blank', 'noopener');
            });
        }
    }

    // -------- Preview Section --------
    const previewVideos = [
        {
            id: 'pv1',
            url: 'https://haykal.web.id/pv1.mp4',
            thumb: 'https://haykal.web.id/pv1g.png',
            title: 'Preview #1',
            desc: 'Contoh hasil pertama.',
            tag: 'Video',
            type: 'video'
        },
        {
            id: 'pv2',
            url: 'https://store.aeroblast.my.id',
            thumb: 'https://haykal.web.id/pv2g.png',
            title: 'Preview #2',
            desc: 'Contoh hasil pembuatan website.',
            tag: 'Website',
            type: 'website'
        },
        {
            id: 'pv3',
            url: '#',
            thumb: 'https://haykal.web.id/pv3g.png',
            title: 'Skin Minecraft',
            desc: 'Jasa pembuatan skin Minecraft custom.',
            tag: 'Skin',
            type: 'skin'
        },
    ];

    function initPreview() {
        const grid = $('#previewGrid');
        if (!grid) return;

        previewVideos.forEach(function (item) {
            const isWebsite = item.type === 'website';
            const isSkin = item.type === 'skin';
            const card = document.createElement('article');
            card.className = 'preview-card';
            card.setAttribute('tabindex', '0');
            card.setAttribute('role', 'link');

            const ariaLabel = isWebsite ? 'Buka website ' : (isSkin ? 'Lihat preview ' : 'Tonton ');
            card.setAttribute('aria-label', ariaLabel + item.title);

            let playIcon;
            if (isSkin) {
                playIcon = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"/><path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7Z"/></svg>';
            } else {
                playIcon = isWebsite
                    ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3"/></svg>'
                    : '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg>';
            }

            const footLabel = isSkin
                ? 'Mulai dari Rp 5.000'
                : (isWebsite ? 'store.aeroblast.my.id' : 'haykal.web.id/' + item.id + '.mp4');

            const actionLabel = isSkin ? 'Lihat' : (isWebsite ? 'Buka' : 'Tonton');

            card.innerHTML =
                '<div class="preview-thumb">' +
                    '<img src="' + item.thumb + '" alt="Thumbnail ' + item.title + '" loading="lazy">' +
                    '<div class="preview-thumb-overlay">' +
                        '<div class="preview-play-btn">' + playIcon + '</div>' +
                    '</div>' +
                    '<span class="preview-badge">' + item.tag + '</span>' +
                '</div>' +
                '<div class="preview-card-body">' +
                    '<div class="preview-card-title">' + item.title + '</div>' +
                    '<div class="preview-card-desc">' + item.desc + '</div>' +
                '</div>' +
                '<div class="preview-card-foot">' +
                    '<span class="preview-card-tag">' + footLabel + '</span>' +
                    '<span class="preview-card-link">' +
                        actionLabel + '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M13 5l7 7-7 7"/></svg>' +
                    '</span>' +
                '</div>';

            function openItem() {
                if (isSkin) {
                    // ✅ openSkinModal sudah pasti ada karena didefinisikan sebelum initPreview
                    window.openSkinModal();
                } else {
                    window.open(item.url, '_blank', 'noopener');
                }
            }

            card.addEventListener('click', openItem);
            card.addEventListener('keydown', function (e) {
                if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openItem(); }
            });

            grid.appendChild(card);
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
        initScheduleToggle();
        initSkinModal();   // ✅ FIX: initSkinModal SEBELUM initPreview
        initPreview();
    });
})();
