# Transport Services Website

A professional website for heavy vehicle transportation services using tempos, trucks, and other commercial vehicles.

## Features

✅ **Introduction Section** - Information about the transport service company
✅ **Services Section** - Display of various transportation services offered
✅ **Booking & Reservation** - Complete booking form with vehicle selection
✅ **Contact Form** - Customer inquiry and contact form
✅ **Map Integration** - Google Maps integration to show location
✅ **User Accounts** - Login and Registration functionality
✅ **Payment Gateway** - Secure payment processing for bookings
✅ **Responsive Design** - Fully responsive for mobile, tablet, and desktop
✅ **Real-time Price Estimation** - Dynamic pricing based on vehicle type

## Project Structure

```
transport-services/
├── index.html       # Main HTML file with complete website structure
├── styles.css       # Complete CSS styling
├── script.js        # JavaScript functionality and interactions
└── README.md        # Project documentation
```

## Services Offered

1. **General Cargo Transport** - Transport of various goods and merchandise
2. **Construction Material Transport** - Sand, gravel, steel, and building materials
3. **Household Shifting** - Residential and office relocation services
4. **Industrial Equipment Transport** - Safe transportation of heavy machinery
5. **Long Distance Delivery** - Interstate transportation with GPS tracking
6. **Same Day Delivery** - Quick delivery services within city limits

## Vehicle Types

- **Tempo** (3-5 Ton) - Small local deliveries
- **Small Truck** (6-8 Ton) - Medium shipments
- **Medium Truck** (10-12 Ton) - Larger cargo
- **Large Truck** (18-20 Ton) - Heavy loads
- **Container Truck** - Bulk transportation

## Booking Process

1. Fill in the booking form with:
   - Pickup and dropoff locations
   - Pickup date and time
   - Vehicle type selection
   - Cargo weight and type
   - Contact information

2. System calculates estimated price automatically

3. Proceed to payment with:
   - Card payment
   - UPI transfer
   - Net Banking
   - Digital Wallet

## Features Detail

### User Accounts
- **Login** - Existing users can log in with email and password
- **Register** - New users can create an account with their details
- Account information stored securely

### Payment Options
- Credit/Debit Card
- UPI (Unified Payments Interface)
- Net Banking
- Digital Wallets

### Contact Information
- Phone support
- Email contact
- Physical office location
- Business hours
- Google Maps integration

## Technologies Used

- **HTML5** - Semantic markup
- **CSS3** - Advanced styling with animations
- **JavaScript (Vanilla)** - Interactive functionality without external dependencies
- **Font Awesome Icons** - Professional icons
- **Google Maps API** - Location integration
- **Responsive Web Design** - Mobile-first approach

## Browser Compatibility

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers

## Customization

### Colors
Edit the CSS variables in `styles.css`:
```css
:root {
    --primary-color: #1e40af;
    --secondary-color: #f59e0b;
    --text-color: #333;
}
```

### Prices
Modify vehicle prices in `script.js`:
```javascript
const vehiclePrices = {
    'tempo': 50,
    'truck-6ton': 75,
    'truck-10ton': 100,
    'truck-20ton': 150,
    'container': 200
};
```

### Contact Information
Update contact details in `index.html` in the Contact section

### Map Location
Replace the Google Maps iframe src with your location coordinates

## Installation

1. Clone or download this repository
2. Open `index.html` in your web browser
3. No backend or server required for basic functionality
4. For production, integrate with:
   - Payment gateway API
   - Email service
   - Database for storing bookings
   - SMS notifications

## Deployment

This website can be deployed to:
- **GitHub Pages** - Free hosting
- **Netlify** - Easy deployment
- **Vercel** - Fast performance
- **Traditional Web Hosting** - Any hosting provider

## Form Validation

All forms include:
- Required field validation
- Email format validation
- Phone number validation
- Card number validation
- Date validation (no past dates)
- Password confirmation

## Local Storage

- User booking details are stored in browser's local storage
- Payment information is validated before processing
- Data persists during the booking session

## Future Enhancements

- Backend API integration
- Real database for storing bookings
- Actual payment gateway integration (Stripe, PayPal, Razorpay)
- Email notifications
- SMS updates
- Admin dashboard
- Driver tracking
- Customer support chat
- Multiple languages support

## License

This project is open source and available under the MIT License.

## Support

For questions or support, contact:
- Email: info@transportservices.com
- Phone: +1 (800) 123-4567
- Website: https://sid010997-dev.github.io/transport-services/

## Notes

- This is a frontend-only implementation
- For production use, integrate with a backend server
- Payment processing requires PCI compliance
- Store sensitive data securely
- Implement proper authentication and authorization

---

**Last Updated:** 2024
**Version:** 1.0.0