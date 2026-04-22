// ========================================
// THEME TOGGLE FUNCTIONALITY
// ========================================

// Inisialisasi tema dari localStorage atau default ke light
document.addEventListener('DOMContentLoaded', function() {
    const themeToggle = document.getElementById('themeToggle');
    const currentTheme = localStorage.getItem('theme') || 'light';
    
    // Terapkan tema yang tersimpan
    document.documentElement.setAttribute('data-theme', currentTheme);
    updateThemeIcon(currentTheme);
    
    // Event listener untuk toggle tema
    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            
            // Terapkan tema baru
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            updateThemeIcon(newTheme);
        });
    }
});

// Update icon tema berdasarkan tema saat ini
function updateThemeIcon(theme) {
    const themeIcon = document.querySelector('.theme-icon');
    if (themeIcon) {
        themeIcon.textContent = theme === 'light' ? '🌙' : '☀️';
    }
}

// ========================================
// HAMBURGER MENU FUNCTIONALITY
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
        
        // Tutup menu saat link diklik
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
        
        // Tutup menu saat klik di luar
        document.addEventListener('click', function(e) {
            if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    }
});

// ========================================
// SMOOTH SCROLL TO TOP FUNCTIONALITY
// ========================================

function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// ========================================
// ORDER FORM POPUP FUNCTIONALITY
// ========================================

// Buka form pemesanan dengan detail layanan
function openOrderForm(serviceName, servicePrice) {
    const modal = document.getElementById('orderModal');
    const serviceNameInput = document.getElementById('serviceName');
    const servicePriceInput = document.getElementById('servicePrice');
    const bookingDate = document.getElementById('bookingDate');
    
    if (modal && serviceNameInput && servicePriceInput) {
        serviceNameInput.value = serviceName;
        servicePriceInput.value = servicePrice;
        
        // Set minimum date ke hari ini
        if (bookingDate) {
            const today = new Date().toISOString().split('T')[0];
            bookingDate.setAttribute('min', today);
        }
        
        modal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Cegah scroll background
    }
}

// Tutup form pemesanan
function closeOrderForm() {
    const modal = document.getElementById('orderModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = ''; // Kembalikan scroll
        
        // Reset form
        const form = document.getElementById('orderForm');
        if (form) {
            form.reset();
        }
    }
}

// Handle submit form pemesanan
document.addEventListener('DOMContentLoaded', function() {
    const orderForm = document.getElementById('orderForm');
    
    if (orderForm) {
        orderForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Ambil nilai dari form
            const serviceName = document.getElementById('serviceName').value;
            const servicePrice = document.getElementById('servicePrice').value;
            const customerName = document.getElementById('customerName').value;
            const bookingDate = document.getElementById('bookingDate').value;
            const orderNotes = document.getElementById('orderNotes').value;
            const discountCode = document.getElementById('discountCode').value;
            
            // Validasi field wajib
            if (!customerName.trim()) {
                alert('Mohon isi nama lengkap Anda');
                return;
            }
            
            if (!bookingDate) {
                alert('Mohon pilih tanggal booking');
                return;
            }
            
            // Format tanggal untuk pesan WhatsApp
            const formattedDate = new Date(bookingDate).toLocaleDateString('id-ID', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
            
            // Buat pesan WhatsApp
            let message = `Halo! Saya ingin memesan layanan:\n\n`;
            message += `📦 Layanan: ${serviceName}\n`;
            message += `💰 Harga: ${servicePrice}\n`;
            message += `👤 Nama: ${customerName}\n`;
            message += `📅 Tanggal Booking: ${formattedDate}\n`;
            
            if (discountCode.trim()) {
                message += `🎁 Kode Diskon: ${discountCode}\n`;
            }
            
            if (orderNotes.trim()) {
                message += `\n📝 Catatan:\n${orderNotes}\n`;
            }
            
            message += `\nMohon konfirmasi ketersediaan dan detail pembayaran. Terima kasih!`;
            
            // URL encode pesan
            const encodedMessage = encodeURIComponent(message);
            
            // Redirect ke WhatsApp
            const whatsappUrl = `https://wa.me/628123731343?text=${encodedMessage}`;
            window.open(whatsappUrl, '_blank');
            
            // Tutup modal setelah delay singkat
            setTimeout(() => {
                closeOrderForm();
            }, 500);
        });
    }
    
    // Tutup modal saat klik di luar
    const modal = document.getElementById('orderModal');
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeOrderForm();
            }
        });
    }
});

// ========================================
// BOOKING CALENDAR FUNCTIONALITY
// ========================================

/**
 * ============================================================================
 * PANDUAN MENAMBAHKAN DATA BOOKING BARU
 * ============================================================================
 * 
 * Untuk menambahkan booking baru ke kalender, cukup tambahkan objek baru
 * ke dalam array 'bookingData' di bawah ini.
 * 
 * FORMAT OBJEK BOOKING:
 * {
 *     tanggal: 'YYYY-MM-DD',      // Format: Tahun-Bulan-Tanggal (contoh: '2024-12-25')
 *     nama_klien: 'Nama Klien',   // Nama lengkap klien
 *     paket_layanan: 'Nama Paket' // Nama paket yang dipesan
 * }
 * 
 * CONTOH CARA MENAMBAHKAN BOOKING BARU:
 * 
 * 1. Scroll ke bagian 'bookingData' di bawah
 * 2. Tambahkan koma (,) setelah objek terakhir
 * 3. Tambahkan objek baru dengan format di atas
 * 
 * CONTOH:
 * const bookingData = [
 *     {
 *         tanggal: '2024-12-25',
 *         nama_klien: 'Budi Santoso',
 *         paket_layanan: 'TikTok + YouTube Combo (2 Revisi)'
 *     },
 *     {
 *         tanggal: '2024-12-26',
 *         nama_klien: 'Andi Wijaya',
 *         paket_layanan: 'Setup Server Minecraft'
 *     },
 *     // Tambahkan objek baru di sini dengan format yang sama
 *     {
 *         tanggal: '2024-12-27',
 *         nama_klien: 'Siti Nurhaliza',
 *         paket_layanan: 'Jasa Pembuatan Website'
 *     }
 * ];
 * 
 * PENTING:
 * - Pastikan tanggal dalam format 'YYYY-MM-DD' (contoh: '2024-12-31')
 * - Gunakan tanda kutip (') untuk semua nilai string
 * - Jangan lupa tanda koma (,) antara setiap objek
 * - Tanggal yang sama hanya bisa ada SATU booking
 * 
 * ============================================================================
 */

const bookingData = [
    // Contoh data booking - Anda bisa menghapus ini dan menambahkan data sendiri
    {
        tanggal: '2026-03-08',
        nama_klien: 'aeroblast',
        paket_layanan: 'TikTok (2 Revisi)'
    },
    // TAMBAHKAN BOOKING BARU DI BAWAH INI
    // Format:
    // {
    //     tanggal: 'YYYY-MM-DD',
    //     nama_klien: 'Nama Lengkap',
    //     paket_layanan: 'Nama Paket'
    // },
];

// State kalender
let currentDate = new Date();
let currentMonth = currentDate.getMonth();
let currentYear = currentDate.getFullYear();

// Inisialisasi kalender
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('calendarDays')) {
        renderCalendar(currentMonth, currentYear);
        
        // Tombol bulan sebelumnya
        const prevBtn = document.getElementById('prevMonth');
        if (prevBtn) {
            prevBtn.addEventListener('click', function() {
                currentMonth--;
                if (currentMonth < 0) {
                    currentMonth = 11;
                    currentYear--;
                }
                renderCalendar(currentMonth, currentYear);
            });
        }
        
        // Tombol bulan berikutnya
        const nextBtn = document.getElementById('nextMonth');
        if (nextBtn) {
            nextBtn.addEventListener('click', function() {
                currentMonth++;
                if (currentMonth > 11) {
                    currentMonth = 0;
                    currentYear++;
                }
                renderCalendar(currentMonth, currentYear);
            });
        }
    }
});

// Render kalender untuk bulan dan tahun tertentu
function renderCalendar(month, year) {
    const calendarDays = document.getElementById('calendarDays');
    const currentMonthElement = document.getElementById('currentMonth');
    
    if (!calendarDays || !currentMonthElement) return;
    
    // Bersihkan kalender sebelumnya
    calendarDays.innerHTML = '';
    
    // Update tampilan bulan/tahun
    const monthNames = [
        'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
        'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];
    currentMonthElement.textContent = `${monthNames[month]} ${year}`;
    
    // Dapatkan hari pertama bulan dan jumlah hari dalam bulan
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    // Dapatkan tanggal hari ini untuk perbandingan
    const today = new Date();
    const todayDate = today.getDate();
    const todayMonth = today.getMonth();
    const todayYear = today.getFullYear();
    
    // Tambahkan sel kosong untuk hari sebelum bulan dimulai
    for (let i = 0; i < firstDay; i++) {
        const emptyDay = document.createElement('div');
        emptyDay.classList.add('calendar-day', 'empty');
        calendarDays.appendChild(emptyDay);
    }
    
    // Tambahkan hari-hari dalam bulan
    for (let day = 1; day <= daysInMonth; day++) {
        const dayElement = document.createElement('div');
        dayElement.classList.add('calendar-day');
        dayElement.textContent = day;
        
        // Buat string tanggal untuk pengecekan booking
        const dateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        
        // Cek apakah tanggal ini ada dalam data booking
        const booking = bookingData.find(b => b.tanggal === dateString);
        
        // Cek apakah ini hari ini
        if (day === todayDate && month === todayMonth && year === todayYear) {
            dayElement.classList.add('today');
        }
        // Cek apakah tanggal ini sudah dibooking
        else if (booking) {
            dayElement.classList.add('booked');
            dayElement.title = 'Klik untuk lihat detail';
            
            // Tambahkan event listener untuk menampilkan modal detail
            dayElement.addEventListener('click', function() {
                showBookingDetail(dateString, booking);
            });
        }
        // Cek apakah tanggal sudah lewat
        else if (new Date(year, month, day) < new Date(todayYear, todayMonth, todayDate)) {
            // Tanggal masa lalu yang tidak ada booking tetap ditampilkan netral
            dayElement.classList.add('available');
            dayElement.style.opacity = '0.5';
            dayElement.title = 'Tanggal sudah lewat';
        }
        // Jika tidak, tanggal tersedia
        else {
            dayElement.classList.add('available');
            dayElement.title = 'Tersedia untuk booking';
        }
        
        calendarDays.appendChild(dayElement);
    }
}

// Tampilkan detail booking dalam modal
function showBookingDetail(dateString, booking) {
    const modal = document.getElementById('bookingDetailModal');
    const modalDate = document.getElementById('modalDate');
    const clientName = document.getElementById('clientName');
    const packageName = document.getElementById('packageName');
    
    if (modal && modalDate && clientName && packageName) {
        // Format tanggal untuk tampilan
        const date = new Date(dateString + 'T00:00:00');
        const formattedDate = date.toLocaleDateString('id-ID', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        
        // Set data ke modal
        modalDate.textContent = formattedDate;
        clientName.textContent = booking.nama_klien;
        packageName.textContent = booking.paket_layanan;
        
        // Tampilkan modal
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

// Tutup modal detail booking
function closeBookingDetail() {
    const modal = document.getElementById('bookingDetailModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// Tutup modal saat klik di luar
document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('bookingDetailModal');
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeBookingDetail();
            }
        });
    }
});

// ========================================
// SMOOTH SCROLL FOR ANCHOR LINKS
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Jangan prevent default untuk anchor kosong
            if (href === '#' || href === '') return;
            
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});

// ========================================
// NAVBAR SCROLL EFFECT
// ========================================

let lastScroll = 0;

window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        navbar.style.boxShadow = 'var(--shadow-md)';
    } else {
        navbar.style.boxShadow = 'none';
    }
    
    lastScroll = currentScroll;
});

// ========================================
// FORM INPUT ANIMATIONS
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    const inputs = document.querySelectorAll('.form-input, .form-textarea');
    
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });
        
        input.addEventListener('blur', function() {
            this.parentElement.classList.remove('focused');
        });
    });
});
