// Pricing calculation
const vehiclePrices = {
    'tempo': 50,
    'truck-6ton': 75,
    'truck-10ton': 100,
    'truck-20ton': 150,
    'container': 200
};

const distanceMultiplier = 1.5; // Price per km

// Modal Elements
const accountModal = document.getElementById('accountModal');
const paymentModal = document.getElementById('paymentModal');
const accountBtn = document.getElementById('accountBtn');
const closeButtons = document.querySelectorAll('.close');

// Account Modal Functions
accountBtn.addEventListener('click', (e) => {
    e.preventDefault();
    accountModal.style.display = 'block';
});

closeButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
        accountModal.style.display = 'none';
        paymentModal.style.display = 'none';
    });
});

window.addEventListener('click', (event) => {
    if (event.target === accountModal) {
        accountModal.style.display = 'none';
    }
    if (event.target === paymentModal) {
        paymentModal.style.display = 'none';
    }
});

// Account Tabs
const tabButtons = document.querySelectorAll('.tab-button');
const tabContents = document.querySelectorAll('.tab-content');

tabButtons.forEach(button => {
    button.addEventListener('click', () => {
        const tabName = button.getAttribute('data-tab');
        
        // Remove active class from all buttons and contents
        tabButtons.forEach(btn => btn.classList.remove('active'));
        tabContents.forEach(content => content.classList.remove('active'));
        
        // Add active class to clicked button and corresponding content
        button.classList.add('active');
        document.getElementById(tabName).classList.add('active');
    });
});

// Login Form
document.getElementById('loginForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    // Basic validation
    if (email && password) {
        alert(`Welcome back! You have logged in successfully.\nEmail: ${email}`);
        accountModal.style.display = 'none';
        document.getElementById('loginForm').reset();
    }
});

// Register Form
document.getElementById('registerForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('registerName').value;
    const email = document.getElementById('registerEmail').value;
    const phone = document.getElementById('registerPhone').value;
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('registerConfirmPassword').value;
    
    if (password !== confirmPassword) {
        alert('Passwords do not match!');
        return;
    }
    
    if (name && email && phone && password) {
        alert(`Account created successfully!\nWelcome, ${name}!\nEmail: ${email}`);
        accountModal.style.display = 'none';
        document.getElementById('registerForm').reset();
    }
});

// Booking Form
document.getElementById('bookingForm').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const pickupLocation = document.getElementById('pickupLocation').value;
    const dropoffLocation = document.getElementById('dropoffLocation').value;
    const pickupDate = document.getElementById('pickupDate').value;
    const pickupTime = document.getElementById('pickupTime').value;
    const vehicleType = document.getElementById('vehicleType').value;
    const cargoWeight = parseFloat(document.getElementById('cargoWeight').value);
    const cargoType = document.getElementById('cargoType').value;
    const contactPerson = document.getElementById('contactPerson').value;
    const phoneNumber = document.getElementById('phoneNumber').value;
    const email = document.getElementById('email').value;
    
    // Validate all fields
    if (!pickupLocation || !dropoffLocation || !pickupDate || !pickupTime || 
        !vehicleType || !cargoWeight || !cargoType || !contactPerson || 
        !phoneNumber || !email) {
        alert('Please fill in all required fields!');
        return;
    }
    
    // Store booking details
    const bookingDetails = {
        pickupLocation,
        dropoffLocation,
        pickupDate,
        pickupTime,
        vehicleType,
        cargoWeight,
        cargoType,
        contactPerson,
        phoneNumber,
        email,
        estimatedPrice: document.getElementById('estimatedPrice').textContent
    };
    
    // Save to localStorage
    localStorage.setItem('bookingDetails', JSON.stringify(bookingDetails));
    
    // Show payment modal
    paymentModal.style.display = 'block';
});

// Payment Form
document.getElementById('paymentForm').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const cardName = document.getElementById('cardName').value;
    const cardNumber = document.getElementById('cardNumber').value;
    const expiryDate = document.getElementById('expiryDate').value;
    const cvv = document.getElementById('cvv').value;
    const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked').value;
    
    // Basic card validation
    if (!cardName || !cardNumber || !expiryDate || !cvv) {
        alert('Please fill in all payment details!');
        return;
    }
    
    // Simple card number validation (basic check)
    if (cardNumber.replace(/\s/g, '').length !== 16) {
        alert('Card number must be 16 digits!');
        return;
    }
    
    // Validate expiry date format
    if (!/^\d{2}\/\d{2}$/.test(expiryDate)) {
        alert('Please enter expiry date in MM/YY format!');
        return;
    }
    
    // Validate CVV
    if (!/^\d{3}$/.test(cvv)) {
        alert('CVV must be 3 digits!');
        return;
    }
    
    // Get booking details
    const bookingDetails = JSON.parse(localStorage.getItem('bookingDetails'));
    
    alert(`Payment Successful!\n\nBooking Confirmation:\nVehicle: ${bookingDetails.vehicleType}\nPickup: ${bookingDetails.pickupLocation}\nDropoff: ${bookingDetails.dropoffLocation}\nDate: ${bookingDetails.pickupDate}\nAmount Paid: ${bookingDetails.estimatedPrice}\n\nThank you for using our service!`);
    
    // Reset forms
    document.getElementById('bookingForm').reset();
    document.getElementById('paymentForm').reset();
    paymentModal.style.display = 'none';
    
    // Clear localStorage
    localStorage.removeItem('bookingDetails');
});

// Contact Form
document.getElementById('contactForm').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const name = document.getElementById('contactName').value;
    const email = document.getElementById('contactEmail').value;
    const phone = document.getElementById('contactPhone').value;
    const subject = document.getElementById('subject').value;
    const message = document.getElementById('message').value;
    
    if (name && email && phone && subject && message) {
        alert(`Thank you for contacting us, ${name}!\n\nWe have received your message and will get back to you soon.\n\nYour Details:\nEmail: ${email}\nPhone: ${phone}\nSubject: ${subject}`);
        document.getElementById('contactForm').reset();
    }
});

// Calculate Estimated Price
function calculatePrice() {
    const vehicleType = document.getElementById('vehicleType').value;
    const distance = 10; // Default distance assumption in km
    
    if (vehicleType) {
        const basePrice = vehiclePrices[vehicleType];
        const totalPrice = basePrice + (distance * distanceMultiplier);
        document.getElementById('estimatedPrice').textContent = `$${totalPrice.toFixed(2)}`;
    } else {
        document.getElementById('estimatedPrice').textContent = '$0.00';
    }
}

// Event listeners for price calculation
document.getElementById('vehicleType').addEventListener('change', calculatePrice);
document.getElementById('pickupLocation').addEventListener('change', calculatePrice);
document.getElementById('dropoffLocation').addEventListener('change', calculatePrice);

// Card number formatting
document.getElementById('cardNumber').addEventListener('input', (e) => {
    let value = e.target.value.replace(/\s/g, '');
    let formattedValue = value.replace(/(\d{4})(?=\d)/g, '$1 ');
    e.target.value = formattedValue;
});

// Expiry date formatting
document.getElementById('expiryDate').addEventListener('input', (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length >= 2) {
        value = value.slice(0, 2) + '/' + value.slice(2, 4);
    }
    e.target.value = value;
});

// CVV number only
document.getElementById('cvv').addEventListener('input', (e) => {
    e.target.value = e.target.value.replace(/\D/g, '');
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#' && document.querySelector(href)) {
            e.preventDefault();
            document.querySelector(href).scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// Mobile hamburger menu toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    navMenu.style.display = navMenu.style.display === 'flex' ? 'none' : 'flex';
});

// Close menu when a link is clicked
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.style.display = 'none';
    });
});

// Date validation - prevent past dates
const today = new Date().toISOString().split('T')[0];
document.getElementById('pickupDate').setAttribute('min', today);

// Validate phone numbers
function validatePhoneNumber(phone) {
    return /^[\d\s\-\+\(\)]+$/.test(phone) && phone.replace(/\D/g, '').length >= 10;
}

document.getElementById('phoneNumber').addEventListener('blur', function() {
    if (this.value && !validatePhoneNumber(this.value)) {
        alert('Please enter a valid phone number!');
    }
});

document.getElementById('contactPhone').addEventListener('blur', function() {
    if (this.value && !validatePhoneNumber(this.value)) {
        alert('Please enter a valid phone number!');
    }
});

// Validate email
function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

document.getElementById('email').addEventListener('blur', function() {
    if (this.value && !validateEmail(this.value)) {
        alert('Please enter a valid email address!');
    }
});

document.getElementById('contactEmail').addEventListener('blur', function() {
    if (this.value && !validateEmail(this.value)) {
        alert('Please enter a valid email address!');
    }
});

// Initialize price on page load
window.addEventListener('load', () => {
    calculatePrice();
});