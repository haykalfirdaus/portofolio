// ========================================
// THEME TOGGLE FUNCTIONALITY
// ========================================

// Initialize theme from localStorage or default to light
document.addEventListener('DOMContentLoaded', function() {
    const themeToggle = document.getElementById('themeToggle');
    const currentTheme = localStorage.getItem('theme') || 'light';
    
    // Apply saved theme
    document.documentElement.setAttribute('data-theme', currentTheme);
    updateThemeIcon(currentTheme);
    
    // Theme toggle click handler
    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            
            // Apply new theme
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            updateThemeIcon(newTheme);
        });
    }
});

// Update theme icon based on current theme
function updateThemeIcon(theme) {
    const themeIcon = document.querySelector('.theme-icon');
    if (themeIcon) {
        themeIcon.textContent = theme === 'light' ? '🌙' : '☀️';
    }
}

// ========================================
// ORDER FORM POPUP FUNCTIONALITY
// ========================================

// Open order form modal with service details
function openOrderForm(serviceName, servicePrice) {
    const modal = document.getElementById('orderModal');
    const serviceNameInput = document.getElementById('serviceName');
    const servicePriceInput = document.getElementById('servicePrice');
    
    if (modal && serviceNameInput && servicePriceInput) {
        serviceNameInput.value = serviceName;
        servicePriceInput.value = servicePrice;
        modal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }
}

// Close order form modal
function closeOrderForm() {
    const modal = document.getElementById('orderModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = ''; // Restore scrolling
        
        // Reset form
        const form = document.getElementById('orderForm');
        if (form) {
            form.reset();
        }
    }
}

// Handle order form submission
document.addEventListener('DOMContentLoaded', function() {
    const orderForm = document.getElementById('orderForm');
    
    if (orderForm) {
        orderForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const serviceName = document.getElementById('serviceName').value;
            const servicePrice = document.getElementById('servicePrice').value;
            const customerName = document.getElementById('customerName').value;
            const customerEmail = document.getElementById('customerEmail').value;
            const orderNotes = document.getElementById('orderNotes').value;
            
            // Validate required fields
            if (!customerName.trim()) {
                alert('Please enter your name');
                return;
            }
            
            // Build WhatsApp message
            let message = `Hello! I would like to order:\n\n`;
            message += `📦 Service: ${serviceName}\n`;
            message += `💰 Price: ${servicePrice}\n`;
            message += `👤 Name: ${customerName}\n`;
            
            if (customerEmail.trim()) {
                message += `📧 Email: ${customerEmail}\n`;
            }
            
            if (orderNotes.trim()) {
                message += `\n📝 Notes:\n${orderNotes}\n`;
            }
            
            message += `\nPlease provide more details about this service. Thank you!`;
            
            // URL encode the message
            const encodedMessage = encodeURIComponent(message);
            
            // Redirect to WhatsApp
            const whatsappUrl = `https://wa.me/628123731343?text=${encodedMessage}`;
            window.open(whatsappUrl, '_blank');
            
            // Close modal after brief delay
            setTimeout(() => {
                closeOrderForm();
            }, 500);
        });
    }
    
    // Close modal when clicking outside
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
 * IMPORTANT: HOW TO MARK DATES AS FULLY BOOKED
 * 
 * To mark a date as fully booked, simply add the date string to the array below.
 * Date format: 'YYYY-MM-DD' (e.g., '2024-12-25' for December 25, 2024)
 * 
 * Example:
 * const fullyBookedDates = [
 *     '2024-12-25',  // Christmas
 *     '2024-12-31',  // New Year's Eve
 *     '2025-01-01',  // New Year's Day
 *     '2025-01-15',  // Custom booked date
 * ];
 * 
 * The calendar will automatically display these dates in red with an X mark.
 */

const fullyBookedDates = [
    // Add your fully booked dates here in 'YYYY-MM-DD' format
    // Example dates (you can delete these and add your own):
    '2024-12-25',  // Example: Christmas
    '2024-12-31',  // Example: New Year's Eve
    '2025-01-01',  // Example: New Year's Day
    '2026-04-21',
];

// Calendar state
let currentDate = new Date();
let currentMonth = currentDate.getMonth();
let currentYear = currentDate.getFullYear();

// Initialize calendar
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('calendarDays')) {
        renderCalendar(currentMonth, currentYear);
        
        // Previous month button
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
        
        // Next month button
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

// Render calendar for given month and year
function renderCalendar(month, year) {
    const calendarDays = document.getElementById('calendarDays');
    const currentMonthElement = document.getElementById('currentMonth');
    
    if (!calendarDays || !currentMonthElement) return;
    
    // Clear previous calendar
    calendarDays.innerHTML = '';
    
    // Update month/year display
    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];
    currentMonthElement.textContent = `${monthNames[month]} ${year}`;
    
    // Get first day of month and number of days
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    // Get today's date for comparison
    const today = new Date();
    const todayDate = today.getDate();
    const todayMonth = today.getMonth();
    const todayYear = today.getFullYear();
    
    // Add empty cells for days before month starts
    for (let i = 0; i < firstDay; i++) {
        const emptyDay = document.createElement('div');
        emptyDay.classList.add('calendar-day', 'empty');
        calendarDays.appendChild(emptyDay);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
        const dayElement = document.createElement('div');
        dayElement.classList.add('calendar-day');
        dayElement.textContent = day;
        
        // Create date string for checking if booked
        const dateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        
        // Check if this date is today
        if (day === todayDate && month === todayMonth && year === todayYear) {
            dayElement.classList.add('today');
        }
        // Check if this date is fully booked
        else if (fullyBookedDates.includes(dateString)) {
            dayElement.classList.add('booked');
            dayElement.title = 'Fully Booked';
        }
        // Check if date is in the past
        else if (new Date(year, month, day) < new Date(todayYear, todayMonth, todayDate)) {
            dayElement.classList.add('booked');
            dayElement.title = 'Past Date';
        }
        // Otherwise, it's available
        else {
            dayElement.classList.add('available');
            dayElement.title = 'Available for Booking';
        }
        
        calendarDays.appendChild(dayElement);
    }
}

// ========================================
// SMOOTH SCROLL FOR ANCHOR LINKS
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Don't prevent default for empty anchors
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
