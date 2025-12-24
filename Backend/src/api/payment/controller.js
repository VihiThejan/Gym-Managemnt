const { PrismaClient } = require('@prisma/client');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const prisma = new PrismaClient();

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, '../../../uploads/payment-slips');
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'slip-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|pdf/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Only images (JPG, PNG) and PDF files are allowed!'));
  }
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: fileFilter
});

const paymentHandling = async (req, res) => {
  const { memberId, packageId, amount, date, paymentMethod } = req.body;
  const paymentSlip = req.file ? req.file.filename : null;

  console.log("Received payload:", { memberId, packageId, amount, date, paymentMethod, paymentSlip }); 

  try {
    // Validate that bank transfer requires a payment slip
    if (paymentMethod === 'bank' && !paymentSlip) {
      return res.status(400).json({
        code: 400,
        message: 'Payment slip is required for bank transfer',
      });
    }

    await prisma.payment.create({
      data: {
        Member_Id: parseInt(memberId),
        Package_ID: parseInt(packageId),
        Amount: parseFloat(amount),
        Date: new Date(date),
        Payment_Method: paymentMethod || 'cash',
        Payment_Slip: paymentSlip,
        Status: paymentMethod === 'bank' ? 'Pending' : 'Completed', // Bank transfers pending until verified
      },
    });

    res.status(200).json({
      code: 200,
      message: 'Payment added successfully',
    });
  } catch (ex) {
    console.error("Error creating payment:", ex); 
    res.status(500).json({
      code: 500,
      message: 'Internal Server Error',
      error: ex.message,
    });
  }
};



const paymentList = async (req, res) => {
    try{
        const data = await prisma.payment.findMany(
            {select: {
              Payment_ID:true,
              Member_Id: true,
              Package_ID: true,
              Amount: true,
              Date: true,
              Payment_Method: true,
              Payment_Slip: true,
              Status: true,
        },
        })
        res.status(200).json({
            code: 200,
            message: 'Payment fetched successfully',
            data
        })
    }catch(ex){
        res.status(500).json({
            code: 500,
            message: 'Internal Server Error',
            error: ex.message
        })
    }
}

const confirmPayment = async (req, res) => {
    try {
        const paymentId = parseInt(req.params.id);
        
        // Update payment status to Completed
        const updatedPayment = await prisma.payment.update({
            where: {
                Payment_ID: paymentId
            },
            data: {
                Status: 'Completed'
            }
        });
        
        res.status(200).json({
            code: 200,
            message: 'Payment confirmed successfully',
            data: updatedPayment
        });
    } catch (ex) {
        console.error('Error confirming payment:', ex);
        res.status(500).json({
            code: 500,
            message: 'Internal Server Error',
            error: ex.message
        });
    }
}

// Create Stripe Payment Intent
const createStripePaymentIntent = async (req, res) => {
    try {
        const { amount, memberId, packageId, currency = 'lkr' } = req.body;

        if (!amount || !memberId || !packageId) {
            return res.status(400).json({
                code: 400,
                message: 'Amount, memberId, and packageId are required'
            });
        }

        // Create a PaymentIntent with Stripe
        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(amount * 100), // Stripe expects amount in cents
            currency: currency,
            metadata: {
                memberId: memberId.toString(),
                packageId: packageId.toString()
            },
            automatic_payment_methods: {
                enabled: true,
            },
        });

        res.status(200).json({
            code: 200,
            clientSecret: paymentIntent.client_secret,
            paymentIntentId: paymentIntent.id
        });
    } catch (ex) {
        console.error('Error creating Stripe payment intent:', ex);
        res.status(500).json({
            code: 500,
            message: 'Failed to create payment intent',
            error: ex.message
        });
    }
};

// Stripe Webhook Handler
const handleStripeWebhook = async (req, res) => {
    const sig = req.headers['stripe-signature'];
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    let event;

    try {
        event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
    } catch (err) {
        console.error('Webhook signature verification failed:', err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    switch (event.type) {
        case 'payment_intent.succeeded':
            const paymentIntent = event.data.object;
            console.log('PaymentIntent was successful!', paymentIntent.id);
            
            // Save payment to database
            try {
                await prisma.payment.create({
                    data: {
                        Member_Id: parseInt(paymentIntent.metadata.memberId),
                        Package_ID: parseInt(paymentIntent.metadata.packageId),
                        Amount: paymentIntent.amount / 100, // Convert from cents
                        Date: new Date(),
                        Payment_Method: 'stripe',
                        Transaction_ID: paymentIntent.id,
                        Status: 'Completed'
                    }
                });
                console.log('Payment saved to database');
            } catch (dbError) {
                console.error('Error saving payment to database:', dbError);
            }
            break;

        case 'payment_intent.payment_failed':
            const failedPayment = event.data.object;
            console.log('PaymentIntent failed:', failedPayment.id);
            break;

        default:
            console.log(`Unhandled event type ${event.type}`);
    }

    res.json({ received: true });
};


module.exports = {
    paymentHandling,
    paymentList,
    confirmPayment,
    createStripePaymentIntent,
    handleStripeWebhook,
    upload, // Export upload middleware
};



