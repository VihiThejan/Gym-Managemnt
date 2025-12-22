const paymentRoute = require('express').Router();
const {paymentHandling, paymentList, upload } = require('./controller');

paymentRoute.post('/create', upload.single('paymentSlip'), paymentHandling);
paymentRoute.get('/list', paymentList);

paymentRoute.post("/payment/notify", (req, res) => {
    console.log("PayHere Notification Received:", req.body);
  
    if (req.body.status === "2") {
      console.log("Payment successful, updating database...");
      // Add logic to update the payment status in the database
    }
  
    res.sendStatus(200);
  });



module.exports = paymentRoute;


