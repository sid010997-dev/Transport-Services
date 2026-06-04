const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const nodemailer = require('nodemailer');
const stripe = require('stripe');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/transport-services')
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log('MongoDB connection error:', err));

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key_here';

// Stripe initialization
const stripeClient = stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_your_key');

// ==================== Database Schemas ====================

// User Schema
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    password: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

// Booking Schema
const bookingSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    pickupLocation: { type: String, required: true },
    dropoffLocation: { type: String, required: true },
    pickupDate: { type: Date, required: true },
    pickupTime: { type: String, required: true },
    vehicleType: { type: String, required: true },
    cargoWeight: { type: Number, required: true },
    cargoType: { type: String, required: true },
    description: String,
    contactPerson: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    email: { type: String, required: true },
    estimatedPrice: { type: Number, required: true },
    status: { type: String, enum: ['pending', 'confirmed', 'in-transit', 'completed'], default: 'pending' },
    paymentStatus: { type: String, enum: ['unpaid', 'paid', 'failed'], default: 'unpaid' },
    trackingNumber: String,
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

// Contact Schema
const contactSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    subject: { type: String, required: true },
    message: { type: String, required: true },
    status: { type: String, enum: ['new', 'read', 'responded'], default: 'new' },
    createdAt: { type: Date, default: Date.now }
});

// Payment Schema
const paymentSchema = new mongoose.Schema({
    bookingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    amount: { type: Number, required: true },
    paymentMethod: { type: String, enum: ['card', 'upi', 'netbanking', 'wallet'], required: true },
    stripePaymentId: String,
    status: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' },
    transactionId: String,
    createdAt: { type: Date, default: Date.now }
});

// Create Models
const User = mongoose.model('User', userSchema);
const Booking = mongoose.model('Booking', bookingSchema);
const Contact = mongoose.model('Contact', contactSchema);
const Payment = mongoose.model('Payment', paymentSchema);

// ==================== Email Configuration ====================

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});

// Send Email Function
async function sendEmail(to, subject, htmlContent) {
    try {
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to,
            subject,
            html: htmlContent
        });
        console.log('Email sent successfully');
    } catch (error) {
        console.log('Email error:', error);
    }
}

// ==================== Authentication Routes ====================

// Register
app.post('/api/auth/register', async (req, res) => {
    try {
        const { name, email, phone, password, confirmPassword } = req.body;

        // Validate
        if (!name || !email || !phone || !password) {
            return res.status(400).json({ message: 'All fields required' });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({ message: 'Passwords do not match' });
        }

        // Check if user exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user
        const user = new User({
            name,
            email,
            phone,
            password: hashedPassword
        });

        await user.save();

        // Send welcome email
        await sendEmail(email, 'Welcome to Transport Services', 
            `<h2>Welcome ${name}!</h2><p>Your account has been created successfully.</p>`);

        // Create JWT token
        const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '7d' });

        res.status(201).json({
            message: 'User registered successfully',
            token,
            user: { id: user._id, name, email, phone }
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Login
app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password required' });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '7d' });

        res.json({
            message: 'Login successful',
            token,
            user: { id: user._id, name: user.name, email: user.email, phone: user.phone }
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// ==================== Middleware ====================

// Auth Middleware
const authMiddleware = (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }

        const decoded = jwt.verify(token, JWT_SECRET);
        req.userId = decoded.userId;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Invalid token' });
    }
};

// ==================== Booking Routes ====================

// Create Booking
app.post('/api/bookings', async (req, res) => {
    try {
        const {
            pickupLocation, dropoffLocation, pickupDate, pickupTime,
            vehicleType, cargoWeight, cargoType, description,
            contactPerson, phoneNumber, email, estimatedPrice
        } = req.body;

        const booking = new Booking({
            userId: req.headers.authorization ? jwt.verify(req.headers.authorization.split(' ')[1], JWT_SECRET).userId : null,
            pickupLocation, dropoffLocation, pickupDate, pickupTime,
            vehicleType, cargoWeight, cargoType, description,
            contactPerson, phoneNumber, email, estimatedPrice,
            trackingNumber: 'TRK' + Date.now()
        });

        await booking.save();

        // Send confirmation email
        await sendEmail(email, 'Booking Confirmation',
            `<h2>Booking Confirmed!</h2>
            <p>Your tracking number: ${booking.trackingNumber}</p>
            <p>Estimated Price: $${estimatedPrice}</p>
            <p>Status: Pending Payment</p>`);

        res.status(201).json({ message: 'Booking created', booking });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Get User Bookings
app.get('/api/bookings', authMiddleware, async (req, res) => {
    try {
        const bookings = await Booking.find({ userId: req.userId });
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Get Booking by ID
app.get('/api/bookings/:id', async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);
        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }
        res.json(booking);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Update Booking Status (Admin)
app.put('/api/bookings/:id/status', async (req, res) => {
    try {
        const { status } = req.body;
        const booking = await Booking.findByIdAndUpdate(
            req.params.id,
            { status, updatedAt: Date.now() },
            { new: true }
        );
        res.json({ message: 'Booking updated', booking });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// ==================== Payment Routes ====================

// Create Payment Intent
app.post('/api/payments/create-intent', async (req, res) => {
    try {
        const { bookingId, amount } = req.body;

        const paymentIntent = await stripeClient.paymentIntents.create({
            amount: Math.round(amount * 100), // Convert to cents
            currency: 'usd',
            metadata: { bookingId }
        });

        res.json({ clientSecret: paymentIntent.client_secret });
    } catch (error) {
        res.status(500).json({ message: 'Payment error', error: error.message });
    }
});

// Confirm Payment
app.post('/api/payments/confirm', async (req, res) => {
    try {
        const { bookingId, paymentMethod, stripePaymentId, amount } = req.body;

        const payment = new Payment({
            bookingId,
            userId: req.headers.authorization ? jwt.verify(req.headers.authorization.split(' ')[1], JWT_SECRET).userId : null,
            amount,
            paymentMethod,
            stripePaymentId,
            status: 'completed',
            transactionId: 'TXN' + Date.now()
        });

        await payment.save();

        // Update booking payment status
        await Booking.findByIdAndUpdate(bookingId, { paymentStatus: 'paid' });

        res.json({ message: 'Payment successful', payment });
    } catch (error) {
        res.status(500).json({ message: 'Payment error', error: error.message });
    }
});

// Get Payment History
app.get('/api/payments', authMiddleware, async (req, res) => {
    try {
        const payments = await Payment.find({ userId: req.userId });
        res.json(payments);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// ==================== Contact Routes ====================

// Submit Contact Form
app.post('/api/contact', async (req, res) => {
    try {
        const { name, email, phone, subject, message } = req.body;

        if (!name || !email || !subject || !message) {
            return res.status(400).json({ message: 'Required fields missing' });
        }

        const contact = new Contact({
            name, email, phone, subject, message
        });

        await contact.save();

        // Send confirmation email
        await sendEmail(email, 'We received your message',
            `<h2>Hello ${name},</h2><p>Thank you for contacting us. We will respond shortly.</p>`);

        // Send notification to admin
        await sendEmail(process.env.EMAIL_USER, 'New Contact Form Submission',
            `<h3>New Message from ${name}</h3>
            <p>Email: ${email}</p>
            <p>Phone: ${phone}</p>
            <p>Subject: ${subject}</p>
            <p>Message: ${message}</p>`);

        res.status(201).json({ message: 'Message sent successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Get Contact Messages (Admin)
app.get('/api/contact', async (req, res) => {
    try {
        const contacts = await Contact.find().sort({ createdAt: -1 });
        res.json(contacts);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// ==================== Tracking Routes ====================

// Track Booking
app.get('/api/track/:trackingNumber', async (req, res) => {
    try {
        const booking = await Booking.findOne({ trackingNumber: req.params.trackingNumber });
        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }
        res.json(booking);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// ==================== Admin Routes ====================

// Get Dashboard Stats
app.get('/api/admin/stats', async (req, res) => {
    try {
        const totalBookings = await Booking.countDocuments();
        const totalUsers = await User.countDocuments();
        const totalRevenue = await Payment.aggregate([
            { $group: { _id: null, total: { $sum: '$amount' } } }
        ]);
        const pendingBookings = await Booking.countDocuments({ status: 'pending' });

        res.json({
            totalBookings,
            totalUsers,
            totalRevenue: totalRevenue[0]?.total || 0,
            pendingBookings
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// ==================== Error Handling ====================

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Internal server error' });
});

// ==================== Start Server ====================

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});