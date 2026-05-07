// ========================================
// HAYKAL SERVICE - PREMIUM DARK PORTFOLIO
// ========================================

// ============================================================================
// 📅 DATA BOOKING - TAMBAHKAN DATA KLIEN YANG SUDAH BOOKING DI SINI
// ============================================================================
//
// CARA MENAMBAHKAN BOOKING BARU:
//   1. Scroll ke array 'bookingData' di bawah ini
//   2. Copy template di bawah, lalu paste sebelum tanda '];'
//   3. Isi tanggal, nama klien, dan paket layanan
//   4. Simpan file, lalu refresh halaman booking.html
//
// TEMPLATE (copy-paste ini lalu isi datanya):
//
//     {
//         tanggal: 'YYYY-MM-DD',
//         nama_klien: 'Nama Lengkap Klien',
//         paket_layanan: 'Nama Paket Layanan'
//     },
//
// CONTOH:
//
//     {
//         tanggal: '2026-06-15',
//         nama_klien: 'Budi Santoso',
//         paket_layanan: 'TikTok + YouTube Combo (2 Revisi)'
//     },
//     {
//         tanggal: '2026-06-20',
//         nama_klien: 'Andi Wijaya',
//         paket_layanan: 'Setup Server Minecraft'
//     },
//
// PENTING:
//   - Format tanggal HARUS 'YYYY-MM-DD' (contoh: '2026-12-31')
//   - Gunakan tanda kutip (') untuk semua nilai
//   - Jangan lupa tanda koma (,) setelah tanda kurung kurawal tutup (})
//   - Satu tanggal hanya bisa punya SATU booking
//
// ============================================================================

// ========================================
// HAMBURGER MENU
// ========================================
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', function() {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });

        document.addEventListener('click', function(e) {
            if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    }
});

// ========================================
// NAVBAR SCROLL EFFECT
// ========================================
window.addEventListener('scroll', function() {
    const navbar = document.getElementById('navbar');
    if (navbar) {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }
});

// ========================================
// SMOOTH SCROLL TO TOP
// ========================================
function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ========================================
// SCROLL REVEAL ANIMATIONS
// ========================================
document.addEventListener('DOMContentLoaded', function() {
    const revealElements = document.querySelectorAll('.reveal, .reveal-stagger');

    const revealObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));
});

// ========================================
// COUNTER ANIMATION (Stats)
// ========================================
document.addEventListener('DOMContentLoaded', function() {
    const statNumbers = document.querySelectorAll('.stat-number[data-target]');

    if (statNumbers.length === 0) return;

    let animated = false;

    const counterObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting && !animated) {
                animated = true;
                statNumbers.forEach(num => {
                    const target = parseInt(num.getAttribute('data-target'));
                    const suffix = num.querySelector('span') ? num.querySelector('span').textContent : '';
                    let current = 0;
                    const increment = target / 40;
                    const duration = 1500;
                    const stepTime = duration / 40;

                    const timer = setInterval(function() {
                        current += increment;
                        if (current >= target) {
                            current = target;
                            clearInterval(timer);
                        }
                        num.textContent = Math.floor(current);
                        if (suffix) {
                            const span = document.createElement('span');
                            span.textContent = suffix;
                            num.appendChild(span);
                        }
                    }, stepTime);
                });
            }
        });
    }, { threshold: 0.3 });

    const statsSection = document.querySelector('.stats-section');
    if (statsSection) {
        counterObserver.observe(statsSection);
    }
});

// ========================================
// CONTACT FORM (WhatsApp)
// ========================================
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');

    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const name = document.getElementById('contactName').value;
            const email = document.getElementById('contactEmail').value;
            const subject = document.getElementById('contactSubject').value;
            const message = document.getElementById('contactMessage').value;

            if (!name.trim() || !subject.trim() || !message.trim()) {
                alert('Mohon isi semua field yang wajib');
                return;
            }

            let waMessage = `Halo! Saya ingin menghubungi Anda.\n\n`;
            waMessage += `👤 Nama: ${name}\n`;
            if (email.trim()) waMessage += `📧 Email: ${email}\n`;
            waMessage += `📋 Subjek: ${subject}\n`;
            waMessage += `\n📝 Pesan:\n${message}\n`;
            waMessage += `\nTerima kasih!`;

            const encodedMessage = encodeURIComponent(waMessage);
            window.open(`https://wa.me/628123731343?text=${encodedMessage}`, '_blank');
        });
    }
});

// ========================================
// ORDER FORM POPUP
// ========================================
function openOrderForm(serviceName, servicePrice) {
    const modal = document.getElementById('orderModal');
    const serviceNameInput = document.getElementById('serviceName');
    const servicePriceInput = document.getElementById('servicePrice');
    const bookingDate = document.getElementById('bookingDate');

    if (modal && serviceNameInput && servicePriceInput) {
        serviceNameInput.value = serviceName;
        servicePriceInput.value = servicePrice;

        if (bookingDate) {
            const today = new Date().toISOString().split('T')[0];
            bookingDate.setAttribute('min', today);
        }

        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeOrderForm() {
    const modal = document.getElementById('orderModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
        const form = document.getElementById('orderForm');
        if (form) form.reset();
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const orderForm = document.getElementById('orderForm');

    if (orderForm) {
        orderForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const serviceName = document.getElementById('serviceName').value;
            const servicePrice = document.getElementById('servicePrice').value;
            const customerName = document.getElementById('customerName').value;
            const bookingDate = document.getElementById('bookingDate').value;
            const orderNotes = document.getElementById('orderNotes').value;
            const discountCode = document.getElementById('discountCode').value;

            if (!customerName.trim()) {
                alert('Mohon isi nama lengkap Anda');
                return;
            }
            if (!bookingDate) {
                alert('Mohon pilih tanggal booking');
                return;
            }

            const formattedDate = new Date(bookingDate).toLocaleDateString('id-ID', {
                weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
            });

            let message = `Halo! Saya ingin memesan layanan:\n\n`;
            message += `📦 Layanan: ${serviceName}\n`;
            message += `💰 Harga: ${servicePrice}\n`;
            message += `👤 Nama: ${customerName}\n`;
            message += `📅 Tanggal Booking: ${formattedDate}\n`;
            if (discountCode.trim()) message += `🎁 Kode Diskon: ${discountCode}\n`;
            if (orderNotes.trim()) message += `\n📝 Catatan:\n${orderNotes}\n`;
            message += `\nMohon konfirmasi ketersediaan dan detail pembayaran. Terima kasih!`;

            const encodedMessage = encodeURIComponent(message);
            window.open(`https://wa.me/628123731343?text=${encodedMessage}`, '_blank');

            setTimeout(() => closeOrderForm(), 500);
        });
    }

    const modal = document.getElementById('orderModal');
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) closeOrderForm();
        });
    }
});

// ========================================
// BOOKING CALENDAR
// ========================================
const bookingData = [
    {
        tanggal: '2026-03-08',
        nama_klien: 'aeroblast',
        paket_layanan: 'TikTok (2 Revisi)'
    },
    {
        tanggal: '2026-03-29',
        nama_klien: 'aeroblast',
        paket_layanan: 'TikTok + Youtube (tanpa revisi)'
    },
];

let currentDate = new Date();
let currentMonth = currentDate.getMonth();
let currentYear = currentDate.getFullYear();

document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('calendarDays')) {
        renderCalendar(currentMonth, currentYear);

        const prevBtn = document.getElementById('prevMonth');
        if (prevBtn) {
            prevBtn.addEventListener('click', function() {
                currentMonth--;
                if (currentMonth < 0) { currentMonth = 11; currentYear--; }
                renderCalendar(currentMonth, currentYear);
            });
        }

        const nextBtn = document.getElementById('nextMonth');
        if (nextBtn) {
            nextBtn.addEventListener('click', function() {
                currentMonth++;
                if (currentMonth > 11) { currentMonth = 0; currentYear++; }
                renderCalendar(currentMonth, currentYear);
            });
        }
    }
});

function renderCalendar(month, year) {
    const calendarDays = document.getElementById('calendarDays');
    const currentMonthElement = document.getElementById('currentMonth');
    if (!calendarDays || !currentMonthElement) return;

    calendarDays.innerHTML = '';

    const monthNames = [
        'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
        'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];
    currentMonthElement.textContent = `${monthNames[month]} ${year}`;

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const today = new Date();
    const todayDate = today.getDate();
    const todayMonth = today.getMonth();
    const todayYear = today.getFullYear();

    for (let i = 0; i < firstDay; i++) {
        const emptyDay = document.createElement('div');
        emptyDay.classList.add('calendar-day', 'empty');
        calendarDays.appendChild(emptyDay);
    }

    for (let day = 1; day <= daysInMonth; day++) {
        const dayElement = document.createElement('div');
        dayElement.classList.add('calendar-day');
        dayElement.textContent = day;

        const dateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const booking = bookingData.find(b => b.tanggal === dateString);

        if (day === todayDate && month === todayMonth && year === todayYear) {
            dayElement.classList.add('today');
        } else if (booking) {
            dayElement.classList.add('booked');
            dayElement.title = 'Klik untuk lihat detail';
            dayElement.addEventListener('click', function() {
                showBookingDetail(dateString, booking);
            });
        } else if (new Date(year, month, day) < new Date(todayYear, todayMonth, todayDate)) {
            dayElement.classList.add('available');
            dayElement.style.opacity = '0.4';
            dayElement.title = 'Tanggal sudah lewat';
        } else {
            dayElement.classList.add('available');
            dayElement.title = 'Tersedia untuk booking';
        }

        calendarDays.appendChild(dayElement);
    }
}

function showBookingDetail(dateString, booking) {
    const modal = document.getElementById('bookingDetailModal');
    const modalDate = document.getElementById('modalDate');
    const clientName = document.getElementById('clientName');
    const packageName = document.getElementById('packageName');

    if (modal && modalDate && clientName && packageName) {
        const date = new Date(dateString + 'T00:00:00');
        const formattedDate = date.toLocaleDateString('id-ID', {
            weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
        });

        modalDate.textContent = formattedDate;
        clientName.textContent = booking.nama_klien;
        packageName.textContent = booking.paket_layanan;

        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeBookingDetail() {
    const modal = document.getElementById('bookingDetailModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('bookingDetailModal');
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) closeBookingDetail();
        });
    }
});

// ========================================
// SMOOTH SCROLL FOR ANCHOR LINKS
// ========================================
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#' || href === '') return;
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
});

// ========================================
// FORM INPUT FOCUS ANIMATIONS
// ========================================
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.form-input, .form-textarea').forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });
        input.addEventListener('blur', function() {
            this.parentElement.classList.remove('focused');
        });
    });
});
