# ⚡ Quick Start - Stripe Integration

## Installation Steps

### 1. Install Backend Dependencies
```bash
cd Backend
npm install
```

### 2. Install Frontend Dependencies
```bash
cd megapower-react-app
npm install
```

### 3. Configure Environment Variables

#### Backend: Create `Backend/.env`
```env
DATABASE_URL="mysql://root:your_password@localhost:3306/gym_management"
PORT=5000
NODE_ENV=development

# Stripe Keys
STRIPE_SECRET_KEY=sk_test_51QaVRvP0f7H4rE6bNl7W5yE9bMmqWdw6zxYQh3qH4pC0mNtFjZ1KvvNO0fXjZx9oNR8K1vWjZ7hB6kMqWzXyZ000
STRIPE_PUBLISHABLE_KEY=pk_test_51QaVRvP0f7H4rE6bxxxxxxxxxxxxxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxxxxxxxxxxxxx
```

#### Frontend: Create `megapower-react-app/.env`
```env
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_51QaVRvP0f7H4rE6bxxxxxxxxxxxxxxxx
REACT_APP_API_URL=http://localhost:5000/api/v1
REACT_APP_SOCKET_URL=http://localhost:5000
```

### 4. Get Your Stripe Keys

1. Visit: https://dashboard.stripe.com/register
2. Create a free account
3. Go to: **Developers → API keys**
4. Copy:
   - **Publishable key** → Use in both `.env` files
   - **Secret key** → Use in Backend `.env` only

### 5. Start the Application

Terminal 1 (Backend):
```bash
cd Backend
npm start
```

Terminal 2 (Frontend):
```bash
cd megapower-react-app
npm start
```

## Testing Payments

### Test Cards (Use in Development Mode)
✅ **Success**: `4242 4242 4242 4242`
❌ **Decline**: `4000 0000 0000 0002`

- Expiry: Any future date (e.g., 12/25)
- CVC: Any 3 digits (e.g., 123)
- ZIP: Any 5 digits (e.g., 12345)

## What Was Changed?

✅ **Removed PayHere**
- Removed PayHere script from `public/index.html`
- Removed PayHere payment handling code
- Removed PayHere webhook endpoint

✅ **Added Stripe**
- Added Stripe payment intent API
- Added Stripe webhook handler
- Added Stripe.js script loading
- Updated payment UI to use Stripe

## Payment Methods Available

1. **Stripe** (Online Card Payment) - Instant ✅
2. **Bank Transfer** - Requires Admin Confirmation ⏳
3. **Cash** - Pay at Counter 💵

## Need Help?

- Full Guide: [STRIPE_INTEGRATION_GUIDE.md](./STRIPE_INTEGRATION_GUIDE.md)
- Stripe Docs: https://stripe.com/docs
- Test Cards: https://stripe.com/docs/testing

---
**Ready to accept payments! 🚀**
