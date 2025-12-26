const paymentRoute = require('express').Router();
const { paymentHandling, paymentList, confirmPayment, createStripePaymentIntent, handleStripeWebhook, upload } = require('./controller');
const express = require('express');
const multer = require('multer');

paymentRoute.post('/create', (req, res, next) => {
    upload.single('paymentSlip')(req, res, (err) => {
        if (err) {
            return res.status(400).json({
                code: 400,
                message: err.message || 'File upload error'
            });
        }
        next();
    });
}, paymentHandling);

paymentRoute.get('/list', paymentList);
paymentRoute.put('/confirm/:id', confirmPayment);

// Stripe routes
paymentRoute.post('/create-payment-intent', createStripePaymentIntent);
paymentRoute.post('/stripe-webhook', express.raw({ type: 'application/json' }), handleStripeWebhook);


module.exports = paymentRoute;


