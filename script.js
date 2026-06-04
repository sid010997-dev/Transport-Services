// API Configuration
const API_BASE_URL = 'http://localhost:5000/api';

// Token Management
function setToken(token) {
    localStorage.setItem('authToken', token);
}

function getToken() {
    return localStorage.getItem('authToken');
}

function removeToken() {
    localStorage.removeItem('authToken');
}

// API Helper Function
async function apiCall(endpoint, method = 'GET', data = null) {
    const options = {
        method,
        headers: {
            'Content-Type': 'application/json'
        }
    };

    const token = getToken();
    if (token) {
        options.headers['Authorization'] = `Bearer ${token}`;
    }

    if (data && (method === 'POST' || method === 'PUT')) {
        options.body = JSON.stringify(data);
    }

    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'API Error');
        }
        return await response.json();
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}

// ==================== Pricing calculation ====================
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

// ==================== Modal Management ====================

accountBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const token = getToken();
    if (token) {
        alert('You are already logged in!');
    } else {
        accountModal.style.display = 'block';
    }
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

// ==================== Account Tabs ====================

const tabButtons = document.querySelectorAll('.tab-button');
const tabContents = document.querySelectorAll('.tab-content');

tabButtons.forEach(button => {
    button.addEventListener('click', () => {
        const tabName = button.getAttribute('data-tab');
        
        tabButtons.forEach(btn => btn.classList.remove('active'));
        tabContents.forEach(content => content.classList.remove('active'));
        
        button.classList.add('active');
        document.getElementById(tabName).classList.add('active');
    });
});

// ==================== Login Form ====================

document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    try {
        const response = await apiCall('/auth/login', 'POST', { email, password });
        
        setToken(response.token);
        alert(`Welcome back, ${response.user.name}!`);
        accountModal.style.display = 'none';
        document.getElementById('loginForm').reset();
        updateUIAfterLogin();
    } catch (error) {
        alert('Login failed: ' + error.message);
    }
});

// ==================== Register Form ====================

document.getElementById('registerForm').addEventListener('submit', async (e) => {
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
    
    try {
        const response = await apiCall('/auth/register', 'POST', {
            name, email, phone, password, confirmPassword
        });
        
        setToken(response.token);
        alert(`Account created successfully! Welcome, ${response.user.name}!`);
        accountModal.style.display = 'none';
        document.getElementById('registerForm').reset();
        updateUIAfterLogin();
    } catch (error) {
        alert('Registration failed: ' + error.message);
    }
});

// ==================== Update UI After Login ====================

function updateUIAfterLogin() {
    const token = getToken();
    if (token) {
        accountBtn.textContent = 'Logout';
        accountBtn.onclick = (e) => {
            e.preventDefault();
            removeToken();
            alert('You have been logged out!');
            accountBtn.textContent = 'Account';
            updateUIAfterLogin();
        };
    }
}

// Call on page load
window.addEventListener('load', updateUIAfterLogin);

// ==================== Booking Form ====================

document.getElementById('bookingForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const pickupLocation = document.getElementById('pickupLocation').value;
    const dropoffLocation = document.getElementById('dropoffLocation').value;
    const pickupDate = document.getElementById('pickupDate').value;
    const pickupTime = document.getElementById('pickupTime').value;
    const vehicleType = document.getElementById('vehicleType').value;
    const cargoWeight = parseFloat(document.getElementById('cargoWeight').value);
    const cargoType = document.getElementById('cargoType').value;
    const description = document.getElementById('description').value;
    const contactPerson = document.getElementById('contactPerson').value;
    const phoneNumber = document.getElementById('phoneNumber').value;
    const email = document.getElementById('email').value;
    
    if (!pickupLocation || !dropoffLocation || !pickupDate || !pickupTime || 
        !vehicleType || !cargoWeight || !cargoType || !contactPerson || 
        !phoneNumber || !email) {
        alert('Please fill in all required fields!');
        return;
    }
    
    const estimatedPrice = document.getElementById('estimatedPrice').textContent.replace('$', '');
    
    const bookingData = {
        pickupLocation, dropoffLocation, pickupDate, pickupTime,
        vehicleType, cargoWeight, cargoType, description,
        contactPerson, phoneNumber, email,
        estimatedPrice: parseFloat(estimatedPrice)
    };
    
    try {
        const response = await apiCall('/bookings', 'POST', bookingData);
        
        // Store booking details in localStorage
        localStorage.setItem('bookingDetails', JSON.stringify({
            ...bookingData,
            bookingId: response.booking._id,
            trackingNumber: response.booking.trackingNumber
        }));
        
        alert(`Booking created! Tracking Number: ${response.booking.trackingNumber}`);
        paymentModal.style.display = 'block';
    } catch (error) {
        alert('Booking failed: ' + error.message);
    }
});

// ==================== Payment Form ====================

document.getElementById('paymentForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const cardName = document.getElementById('cardName').value;
    const cardNumber = document.getElementById('cardNumber').value;
    const expiryDate = document.getElementById('expiryDate').value;
    const cvv = document.getElementById('cvv').value;
    const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked').value;
    
    if (!cardName || !cardNumber || !expiryDate || !cvv) {
        alert('Please fill in all payment details!');
        return;
    }
    
    if (cardNumber.replace(/\s/g, '').length !== 16) {
        alert('Card number must be 16 digits!');
        return;
    }
    
    if (!/^\d{2}\/\d{2}$/.test(expiryDate)) {
        alert('Please enter expiry date in MM/YY format!');
        return;
    }
    
    if (!/^\d{3}$/.test(cvv)) {
        alert('CVV must be 3 digits!');
        return;
    }
    
    try {
        const bookingDetails = JSON.parse(localStorage.getItem('bookingDetails'));
        const amount = bookingDetails.estimatedPrice;
        
        // Create payment intent on backend
        const paymentIntentResponse = await apiCall('/payments/create-intent', 'POST', {
            bookingId: bookingDetails.bookingId,
            amount
        });
        
        // In production, use Stripe to process the actual payment
        // For now, we'll simulate the payment
        const paymentResponse = await apiCall('/payments/confirm', 'POST', {
            bookingId: bookingDetails.bookingId,
            paymentMethod,
            stripePaymentId: paymentIntentResponse.clientSecret,
            amount
        });
        
        alert(`Payment Successful!\n\nBooking Confirmation:\nTracking: ${bookingDetails.trackingNumber}\nVehicle: ${bookingDetails.vehicleType}\nAmount Paid: $${amount}\n\nThank you for using our service!`);
        
        document.getElementById('bookingForm').reset();
        document.getElementById('paymentForm').reset();
        paymentModal.style.display = 'none';
        localStorage.removeItem('bookingDetails');
        calculatePrice();
    } catch (error) {
        alert('Payment failed: ' + error.message);
    }
});

// ==================== Contact Form ====================

document.getElementById('contactForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const name = document.getElementById('contactName').value;
    const email = document.getElementById('contactEmail').value;
    const phone = document.getElementById('contactPhone').value;
    const subject = document.getElementById('subject').value;
    const message = document.getElementById('message').value;
    
    if (!name || !email || !phone || !subject || !message) {
        alert('Please fill in all fields!');
        return;
    }
    
    try {
        const response = await apiCall('/contact', 'POST', {
            name, email, phone, subject, message
        });
        
        alert(`Thank you for contacting us, ${name}!\n\nWe have received your message and will get back to you soon.`);
        document.getElementById('contactForm').reset();
    } catch (error) {
        alert('Failed to send message: ' + error.message);
    }
});

// ==================== Price Calculation ====================

function calculatePrice() {
    const vehicleType = document.getElementById('vehicleType').value;
    const distance = 10; // Default distance in km
    
    if (vehicleType) {
        const basePrice = vehiclePrices[vehicleType];
        const totalPrice = basePrice + (distance * distanceMultiplier);
        document.getElementById('estimatedPrice').textContent = `$${totalPrice.toFixed(2)}`;
    } else {
        document.getElementById('estimatedPrice').textContent = '$0.00';
    }
}

document.getElementById('vehicleType').addEventListener('change', calculatePrice);
document.getElementById('pickupLocation').addEventListener('change', calculatePrice);
document.getElementById('dropoffLocation').addEventListener('change', calculatePrice);

// ==================== Card Formatting ====================

document.getElementById('cardNumber').addEventListener('input', (e) => {
    let value = e.target.value.replace(/\s/g, '');
    let formattedValue = value.replace(/(\d{4})(?=\d)/g, '$1 ');
    e.target.value = formattedValue;
});

document.getElementById('expiryDate').addEventListener('input', (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length >= 2) {
        value = value.slice(0, 2) + '/' + value.slice(2, 4);
    }
    e.target.value = value;
});

document.getElementById('cvv').addEventListener('input', (e) => {
    e.target.value = e.target.value.replace(/\D/g, '');
});

// ==================== Smooth Scrolling ====================

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

// ==================== Mobile Menu ====================

const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

if (hamburger) {
    hamburger.addEventListener('click', () => {
        navMenu.style.display = navMenu.style.display === 'flex' ? 'none' : 'flex';
    });
}

document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        if (navMenu) navMenu.style.display = 'none';
    });
});

// ==================== Date Validation ====================

const today = new Date().toISOString().split('T')[0];
if (document.getElementById('pickupDate')) {
    document.getElementById('pickupDate').setAttribute('min', today);
}

// ==================== Phone Validation ====================

function validatePhoneNumber(phone) {
    return /^[\d\s\-\+\(\)]+$/.test(phone) && phone.replace(/\D/g, '').length >= 10;
}

document.getElementById('phoneNumber')?.addEventListener('blur', function() {
    if (this.value && !validatePhoneNumber(this.value)) {
        alert('Please enter a valid phone number!');
    }
});

document.getElementById('contactPhone')?.addEventListener('blur', function() {
    if (this.value && !validatePhoneNumber(this.value)) {
        alert('Please enter a valid phone number!');
    }
});

// ==================== Email Validation ====================

function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

document.getElementById('email')?.addEventListener('blur', function() {
    if (this.value && !validateEmail(this.value)) {
        alert('Please enter a valid email address!');
    }
});

document.getElementById('contactEmail')?.addEventListener('blur', function() {
    if (this.value && !validateEmail(this.value)) {
        alert('Please enter a valid email address!');
    }
});

// ==================== Initialize ====================

window.addEventListener('load', () => {
    calculatePrice();
    updateUIAfterLogin();
});