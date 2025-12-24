const paymentRoute = require('express').Router();
const {paymentHandling, paymentList, confirmPayment, createStripePaymentIntent, handleStripeWebhook, upload } = require('./controller');
const express = require('express');

paymentRoute.post('/create', upload.single('paymentSlip'), paymentHandling);
paymentRoute.get('/list', paymentList);
paymentRoute.put('/confirm/:id', confirmPayment);

// Stripe routes
paymentRoute.post('/create-payment-intent', createStripePaymentIntent);
paymentRoute.post('/stripe-webhook', express.raw({type: 'application/json'}), handleStripeWebhook);


module.exports = paymentRoute;


