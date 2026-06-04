# API Documentation

Complete documentation for all Transport Services API endpoints.

## Base URL
```
http://localhost:5000/api
```

For production, replace with your deployed server URL.

## Authentication

Most protected endpoints require a JWT token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

---

## 🔐 Authentication Endpoints

### 1. Register User
**POST** `/auth/register`

Register a new user account.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "1234567890",
  "password": "password123",
  "confirmPassword": "password123"
}
```

**Success Response (201):**
```json
{
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "1234567890"
  }
}
```

**Error Response (400):**
```json
{
  "message": "User already exists"
}
```

---

### 2. Login User
**POST** `/auth/login`

Login with existing credentials.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Success Response (200):**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "1234567890"
  }
}
```

**Error Response (400):**
```json
{
  "message": "Invalid credentials"
}
```

---

## 📦 Booking Endpoints

### 3. Create Booking
**POST** `/bookings`

Create a new transportation booking.

**Request Body:**
```json
{
  "pickupLocation": "123 Main St, New York",
  "dropoffLocation": "456 Park Ave, Los Angeles",
  "pickupDate": "2024-12-20",
  "pickupTime": "09:00",
  "vehicleType": "truck-10ton",
  "cargoWeight": 500,
  "cargoType": "Industrial Equipment",
  "description": "Fragile machinery",
  "contactPerson": "John Doe",
  "phoneNumber": "1234567890",
  "email": "john@example.com",
  "estimatedPrice": 150
}
```

**Success Response (201):**
```json
{
  "message": "Booking created",
  "booking": {
    "_id": "507f1f77bcf86cd799439012",
    "pickupLocation": "123 Main St, New York",
    "dropoffLocation": "456 Park Ave, Los Angeles",
    "pickupDate": "2024-12-20T00:00:00.000Z",
    "pickupTime": "09:00",
    "vehicleType": "truck-10ton",
    "cargoWeight": 500,
    "cargoType": "Industrial Equipment",
    "status": "pending",
    "paymentStatus": "unpaid",
    "trackingNumber": "TRK1640019234567",
    "createdAt": "2024-12-20T10:20:34.567Z"
  }
}
```

---

### 4. Get User Bookings
**GET** `/bookings`

Retrieve all bookings for authenticated user.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Success Response (200):**
```json
[
  {
    "_id": "507f1f77bcf86cd799439012",
    "userId": "507f1f77bcf86cd799439011",
    "pickupLocation": "123 Main St, New York",
    "dropoffLocation": "456 Park Ave, Los Angeles",
    "vehicleType": "truck-10ton",
    "status": "pending",
    "paymentStatus": "unpaid",
    "trackingNumber": "TRK1640019234567",
    "createdAt": "2024-12-20T10:20:34.567Z"
  }
]
```

---

### 5. Get Booking by ID
**GET** `/bookings/:id`

Get details of a specific booking.

**URL Parameters:**
- `id` (string) - Booking ID

**Success Response (200):**
```json
{
  "_id": "507f1f77bcf86cd799439012",
  "pickupLocation": "123 Main St, New York",
  "dropoffLocation": "456 Park Ave, Los Angeles",
  "pickupDate": "2024-12-20T00:00:00.000Z",
  "pickupTime": "09:00",
  "vehicleType": "truck-10ton",
  "cargoWeight": 500,
  "cargoType": "Industrial Equipment",
  "status": "pending",
  "paymentStatus": "unpaid",
  "trackingNumber": "TRK1640019234567",
  "estimatedPrice": 150,
  "createdAt": "2024-12-20T10:20:34.567Z",
  "updatedAt": "2024-12-20T10:20:34.567Z"
}
```

---

### 6. Update Booking Status
**PUT** `/bookings/:id/status`

Update the status of a booking (Admin only).

**URL Parameters:**
- `id` (string) - Booking ID

**Request Body:**
```json
{
  "status": "confirmed"
}
```

**Allowed Status Values:**
- `pending`
- `confirmed`
- `in-transit`
- `completed`

**Success Response (200):**
```json
{
  "message": "Booking updated",
  "booking": {
    "_id": "507f1f77bcf86cd799439012",
    "status": "confirmed",
    "updatedAt": "2024-12-20T11:20:34.567Z"
  }
}
```

---

## 💳 Payment Endpoints

### 7. Create Payment Intent
**POST** `/payments/create-intent`

Create a Stripe payment intent.

**Request Body:**
```json
{
  "bookingId": "507f1f77bcf86cd799439012",
  "amount": 150
}
```

**Success Response (200):**
```json
{
  "clientSecret": "pi_1234567890_secret_1234567890"
}
```

---

### 8. Confirm Payment
**POST** `/payments/confirm`

Confirm and process payment for a booking.

**Request Body:**
```json
{
  "bookingId": "507f1f77bcf86cd799439012",
  "paymentMethod": "card",
  "stripePaymentId": "pi_1234567890_secret_1234567890",
  "amount": 150
}
```

**Allowed Payment Methods:**
- `card`
- `upi`
- `netbanking`
- `wallet`

**Success Response (200):**
```json
{
  "message": "Payment successful",
  "payment": {
    "_id": "507f1f77bcf86cd799439013",
    "bookingId": "507f1f77bcf86cd799439012",
    "amount": 150,
    "paymentMethod": "card",
    "status": "completed",
    "transactionId": "TXN1640019234567",
    "createdAt": "2024-12-20T10:25:34.567Z"
  }
}
```

---

### 9. Get Payment History
**GET** `/payments`

Get payment history for authenticated user.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Success Response (200):**
```json
[
  {
    "_id": "507f1f77bcf86cd799439013",
    "bookingId": "507f1f77bcf86cd799439012",
    "amount": 150,
    "paymentMethod": "card",
    "status": "completed",
    "transactionId": "TXN1640019234567",
    "createdAt": "2024-12-20T10:25:34.567Z"
  }
]
```

---

## 📧 Contact Endpoints

### 10. Submit Contact Form
**POST** `/contact`

Submit a contact inquiry message.

**Request Body:**
```json
{
  "name": "Jane Smith",
  "email": "jane@example.com",
  "phone": "9876543210",
  "subject": "Bulk Shipping Inquiry",
  "message": "I have a large shipment that needs transport."
}
```

**Success Response (201):**
```json
{
  "message": "Message sent successfully"
}
```

---

### 11. Get Contact Messages
**GET** `/contact`

Get all contact form submissions (Admin only).

**Success Response (200):**
```json
[
  {
    "_id": "507f1f77bcf86cd799439014",
    "name": "Jane Smith",
    "email": "jane@example.com",
    "phone": "9876543210",
    "subject": "Bulk Shipping Inquiry",
    "message": "I have a large shipment that needs transport.",
    "status": "new",
    "createdAt": "2024-12-20T10:30:34.567Z"
  }
]
```

---

## 🔍 Tracking Endpoints

### 12. Track Booking
**GET** `/track/:trackingNumber`

Get tracking information using tracking number (public endpoint).

**URL Parameters:**
- `trackingNumber` (string) - Tracking number (e.g., TRK1640019234567)

**Success Response (200):**
```json
{
  "_id": "507f1f77bcf86cd799439012",
  "trackingNumber": "TRK1640019234567",
  "pickupLocation": "123 Main St, New York",
  "dropoffLocation": "456 Park Ave, Los Angeles",
  "status": "in-transit",
  "pickupDate": "2024-12-20T00:00:00.000Z",
  "vehicleType": "truck-10ton",
  "estimatedPrice": 150,
  "createdAt": "2024-12-20T10:20:34.567Z"
}
```

**Error Response (404):**
```json
{
  "message": "Booking not found"
}
```

---

## 📊 Admin Endpoints

### 13. Get Dashboard Statistics
**GET** `/admin/stats`

Get dashboard statistics (Admin only).

**Success Response (200):**
```json
{
  "totalBookings": 45,
  "totalUsers": 28,
  "totalRevenue": 5250.50,
  "pendingBookings": 8
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "message": "All fields required"
}
```

### 401 Unauthorized
```json
{
  "message": "No token provided"
}
```

### 404 Not Found
```json
{
  "message": "Booking not found"
}
```

### 500 Server Error
```json
{
  "message": "Server error",
  "error": "Error details here"
}
```

---

## Testing with cURL

### Register User
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

### Login User
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Create Booking
```bash
curl -X POST http://localhost:5000/api/bookings \
  -H "Content-Type: application/json" \
  -d '{
    "pickupLocation": "123 Main St, New York",
    "dropoffLocation": "456 Park Ave, Los Angeles",
    "pickupDate": "2024-12-20",
    "pickupTime": "09:00",
    "vehicleType": "truck-10ton",
    "cargoWeight": 500,
    "cargoType": "Industrial Equipment",
    "description": "Fragile machinery",
    "contactPerson": "John Doe",
    "phoneNumber": "1234567890",
    "email": "john@example.com",
    "estimatedPrice": 150
  }'
```

### Get User Bookings (with token)
```bash
curl -X GET http://localhost:5000/api/bookings \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Track Booking
```bash
curl -X GET http://localhost:5000/api/track/TRK1640019234567
```

---

## Rate Limiting

API endpoints are rate-limited to prevent abuse:
- **Default**: 100 requests per 15 minutes per IP

---

## Pagination (Coming Soon)

Future updates will include pagination for large datasets.

---

**Last Updated:** 2024
**API Version:** 1.0.0