# Backend Integration Guide

This guide will help you set up and run the Node.js/Express backend for the Transport Services website.

## Prerequisites

Before you start, make sure you have:
- **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
- **npm** (comes with Node.js)
- **MongoDB** - [Download Community Edition](https://www.mongodb.com/try/download/community)
- **Git** - [Download](https://git-scm.com/)
- **Stripe Account** - [Sign up](https://stripe.com)
- **Gmail Account** - For sending emails

## Installation Steps

### 1. Clone/Download the Repository

```bash
git clone https://github.com/sid010997-dev/transport-services.git
cd transport-services
```

### 2. Install Dependencies

```bash
npm install
```

This will install all required packages listed in `package.json`:
- Express (web framework)
- Mongoose (MongoDB ODM)
- bcryptjs (password hashing)
- jsonwebtoken (JWT authentication)
- nodemailer (email service)
- stripe (payment processing)
- cors (cross-origin requests)
- dotenv (environment variables)

### 3. Setup Environment Variables

Create a `.env` file in the root directory by copying `.env.example`:

```bash
cp .env.example .env
```

Edit the `.env` file and add your actual credentials:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/transport-services

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production

# Stripe Payment Gateway
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key_here

# Email Configuration (Gmail)
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_specific_password_here

# Admin Email
ADMIN_EMAIL=admin@transportservices.com

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000
PRODUCTION_URL=https://sid010997-dev.github.io/transport-services/
```

### 4. Setup MongoDB

**Option A: Local MongoDB**

1. [Download and install MongoDB Community Edition](https://www.mongodb.com/try/download/community)
2. Start MongoDB:
   - **Windows**: `mongod`
   - **Mac**: `brew services start mongodb-community`
   - **Linux**: `sudo systemctl start mongod`
3. Default connection string: `mongodb://localhost:27017/transport-services`

**Option B: MongoDB Atlas (Cloud)**

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account
3. Create a cluster
4. Get your connection string (looks like: `mongodb+srv://username:password@cluster.mongodb.net/transport-services`)
5. Update `MONGODB_URI` in `.env`

### 5. Setup Stripe Account

1. Create a [Stripe account](https://stripe.com)
2. Go to Dashboard → API keys
3. Copy your **Secret Key** and **Publishable Key**
4. Update these in your `.env` file:
   ```env
   STRIPE_SECRET_KEY=sk_test_xxxxx
   STRIPE_PUBLISHABLE_KEY=pk_test_xxxxx
   ```

### 6. Setup Gmail for Email Sending

1. Go to [Google Account](https://myaccount.google.com/)
2. Enable 2-Factor Authentication
3. Generate an **App Password**:
   - Go to Security settings
   - Select "App passwords"
   - Choose Mail and Windows Computer (or your device)
   - Copy the generated password
4. Update `.env`:
   ```env
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASSWORD=your_app_specific_password
   ```

## Running the Server

### Development Mode (with auto-reload)

```bash
npm run dev
```

This uses **nodemon** which automatically restarts the server when files change.

### Production Mode

```bash
npm start
```

The server will start on `http://localhost:5000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Bookings
- `POST /api/bookings` - Create new booking
- `GET /api/bookings` - Get user's bookings (requires auth)
- `GET /api/bookings/:id` - Get specific booking
- `PUT /api/bookings/:id/status` - Update booking status

### Payments
- `POST /api/payments/create-intent` - Create payment intent
- `POST /api/payments/confirm` - Confirm payment
- `GET /api/payments` - Get payment history (requires auth)

### Contact
- `POST /api/contact` - Submit contact form
- `GET /api/contact` - Get all contact messages (admin)

### Tracking
- `GET /api/track/:trackingNumber` - Track booking

### Admin
- `GET /api/admin/stats` - Get dashboard statistics

## Testing the Backend

### Using Postman

1. [Download Postman](https://www.postman.com/downloads/)
2. Create requests for each endpoint
3. Test registration:
   ```
   POST http://localhost:5000/api/auth/register
   Body (JSON):
   {
     "name": "John Doe",
     "email": "john@example.com",
     "phone": "1234567890",
     "password": "password123",
     "confirmPassword": "password123"
   }
   ```

### Using cURL

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "1234567890",
    "password": "password123",
    "confirmPassword": "password123"
  }'
```

## Frontend Integration

The frontend (`script.js`) is already configured to communicate with the backend:

1. Update `API_BASE_URL` in `script.js` to match your server:
   ```javascript
   const API_BASE_URL = 'http://localhost:5000/api';
   ```

2. For production, update it to your deployed server URL:
   ```javascript
   const API_BASE_URL = 'https://your-backend-url.com/api';
   ```

## Deployment

### Option 1: Heroku

1. Create a [Heroku account](https://www.heroku.com)
2. Install Heroku CLI
3. Login: `heroku login`
4. Create app: `heroku create your-app-name`
5. Add environment variables: `heroku config:set KEY=value`
6. Deploy: `git push heroku main`

### Option 2: Railway

1. Go to [Railway.app](https://railway.app)
2. Connect your GitHub repository
3. Add environment variables
4. Deploy automatically

### Option 3: AWS/Azure/Google Cloud

Follow their respective deployment guides for Node.js applications.

## Database Backup

### MongoDB Local Backup

```bash
mongodump --db transport-services --out ./backup
```

### MongoDB Atlas Backup

Use the built-in backup feature in MongoDB Atlas dashboard.

## Troubleshooting

### Port Already in Use
```bash
# Kill process on port 5000
lsof -ti :5000 | xargs kill -9
```

### MongoDB Connection Error
- Ensure MongoDB is running
- Check connection string in `.env`
- Verify database name is correct

### Email Not Sending
- Verify Gmail credentials
- Check "Less secure app access" is enabled (or use App Password)
- Check internet connection

### CORS Error
- Update `FRONTEND_URL` in `.env`
- Ensure CORS middleware is enabled in `server.js`

## Security Best Practices

1. **Change JWT_SECRET** in production
2. **Use HTTPS** in production
3. **Store sensitive data** in environment variables
4. **Validate all inputs** on backend
5. **Use rate limiting** to prevent abuse
6. **Enable CORS** only for your domain
7. **Hash passwords** with bcrypt (already done)
8. **Expire tokens** regularly

## Database Schema

### Users Collection
```javascript
{
  name: String,
  email: String (unique),
  phone: String,
  password: String (hashed),
  createdAt: Date
}
```

### Bookings Collection
```javascript
{
  userId: ObjectId (reference to User),
  pickupLocation: String,
  dropoffLocation: String,
  pickupDate: Date,
  pickupTime: String,
  vehicleType: String,
  cargoWeight: Number,
  cargoType: String,
  description: String,
  contactPerson: String,
  phoneNumber: String,
  email: String,
  estimatedPrice: Number,
  status: String (pending, confirmed, in-transit, completed),
  paymentStatus: String (unpaid, paid, failed),
  trackingNumber: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Payments Collection
```javascript
{
  bookingId: ObjectId (reference to Booking),
  userId: ObjectId (reference to User),
  amount: Number,
  paymentMethod: String (card, upi, netbanking, wallet),
  stripePaymentId: String,
  status: String (pending, completed, failed),
  transactionId: String,
  createdAt: Date
}
```

### Contacts Collection
```javascript
{
  name: String,
  email: String,
  phone: String,
  subject: String,
  message: String,
  status: String (new, read, responded),
  createdAt: Date
}
```

## Next Steps

1. ✅ Install dependencies
2. ✅ Setup environment variables
3. ✅ Start MongoDB
4. ✅ Run the backend server
5. ✅ Update frontend API URL
6. ✅ Test API endpoints
7. ✅ Deploy to production

## Support

For issues or questions:
- Check error messages in console
- Review `.env` file configuration
- Verify all services are running
- Check MongoDB connection

---

**Last Updated:** 2024
**Version:** 1.0.0