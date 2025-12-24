# Stripe Payment Integration Guide

## Overview
This project has been updated to use **Stripe** as the payment gateway, replacing PayHere. Stripe provides a secure, modern, and globally accepted payment solution.

## What Changed?

### Removed
- ❌ PayHere payment gateway integration
- ❌ PayHere script from `public/index.html`
- ❌ PayHere notification endpoint
- ❌ All PayHere-related code and references

### Added
- ✅ Stripe payment gateway integration
- ✅ Stripe.js library loading
- ✅ Stripe payment intent API
- ✅ Stripe webhook handler for payment confirmations
- ✅ Environment variables for Stripe configuration

## Setup Instructions

### 1. Install Dependencies

#### Backend
```bash
cd Backend
npm install stripe
```

#### Frontend
```bash
cd megapower-react-app
npm install @stripe/stripe-js @stripe/react-stripe-js
```

### 2. Get Stripe API Keys

1. Go to [Stripe Dashboard](https://dashboard.stripe.com/)
2. Create a free account or login
3. Navigate to **Developers → API keys**
4. Copy your **Publishable key** (starts with `pk_test_`)
5. Copy your **Secret key** (starts with `sk_test_`)

### 3. Configure Environment Variables

#### Backend (.env)
```env
STRIPE_SECRET_KEY=sk_test_your_secret_key_here
STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
```

#### Frontend (.env)
```env
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
```

### 4. Setup Stripe Webhooks (for production)

1. Go to [Stripe Webhooks](https://dashboard.stripe.com/webhooks)
2. Click **Add endpoint**
3. Enter your webhook URL: `https://yourdomain.com/api/v1/payment/stripe-webhook`
4. Select events: `payment_intent.succeeded` and `payment_intent.payment_failed`
5. Copy the **Signing secret** and add it to your backend `.env` file

### 5. Test the Integration

1. Start the backend server:
   ```bash
   cd Backend
   npm start
   ```

2. Start the frontend:
   ```bash
   cd megapower-react-app
   npm start
   ```

3. Login as a member and navigate to the Payment page
4. Select a package and payment method
5. Use Stripe test cards:
   - Success: `4242 4242 4242 4242`
   - Decline: `4000 0000 0000 0002`
   - Any future expiry date, any CVC

## Payment Flow

### Member Payment Process
1. Member selects a membership package (Gold, Silver, or Bronze)
2. Member chooses payment method:
   - **Stripe** (Credit/Debit Card) - Instant online payment
   - **Bank Transfer** - Requires payment slip upload
   - **Cash** - Pay at gym counter
3. For Stripe payments:
   - Payment intent is created on the backend
   - Member enters card details
   - Payment is processed securely via Stripe
   - Confirmation is sent via webhook
   - Database is updated automatically

### Admin Confirmation
- Bank transfer payments show as "Pending" until admin confirms
- Cash payments can be marked as "Completed" by admin
- Stripe payments are automatically marked as "Completed" upon successful payment

## API Endpoints

### Create Payment Intent
```
POST /api/v1/payment/create-payment-intent
Body: {
  amount: number,
  memberId: number,
  packageId: number,
  currency: string (default: 'lkr')
}
```

### Stripe Webhook
```
POST /api/v1/payment/stripe-webhook
Headers: stripe-signature
```

### Create Payment (Bank/Cash)
```
POST /api/v1/payment/create
Form Data: {
  memberId, packageId, amount, date, paymentMethod, paymentSlip (file)
}
```

### List Payments
```
GET /api/v1/payment/list
```

### Confirm Payment
```
PUT /api/v1/payment/confirm/:id
```

## Database Schema

The `payment` table now supports Stripe with the following fields:
- `Payment_Method`: Can be 'stripe', 'bank', or 'cash'
- `Transaction_ID`: Stores Stripe payment intent ID
- `Status`: 'Completed' (Stripe/Cash) or 'Pending' (Bank Transfer)

## Security Notes

⚠️ **Important Security Practices:**
- Never commit `.env` files to version control
- Use test keys during development
- Use production keys only in production environment
- Validate webhook signatures to prevent fraud
- Store API keys securely on your server
- Enable HTTPS in production

## Testing

### Test Cards
Use these test cards in development mode:

| Card Number | Description |
|-------------|-------------|
| 4242 4242 4242 4242 | Success |
| 4000 0000 0000 0002 | Card declined |
| 4000 0000 0000 9995 | Insufficient funds |
| 4000 0027 6000 3184 | Requires 3D Secure authentication |

All test cards:
- Use any future expiration date
- Use any 3-digit CVC
- Use any billing postal code

## Troubleshooting

### Stripe.js not loading
- Check your internet connection
- Verify the Stripe script is loading in browser DevTools
- Clear browser cache

### Payment intent creation fails
- Verify `STRIPE_SECRET_KEY` is set in backend `.env`
- Check backend console for error messages
- Ensure amount is a positive number

### Webhook not receiving events
- Verify webhook URL is publicly accessible
- Check `STRIPE_WEBHOOK_SECRET` is correct
- Review Stripe Dashboard → Webhooks → Logs

## Support

- Stripe Documentation: https://stripe.com/docs
- Stripe API Reference: https://stripe.com/docs/api
- Test Mode: https://stripe.com/docs/testing

## Currency Support

Current setup uses **LKR (Sri Lankan Rupee)**. To change currency:
1. Update the `currency` parameter in payment intent creation
2. Ensure your Stripe account supports the currency
3. Update amount formatting in frontend displays

---

**Migration Complete!** 🎉 Your gym management system now uses Stripe for secure online payments.
