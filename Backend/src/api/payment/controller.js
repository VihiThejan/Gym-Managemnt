const { PrismaClient } = require('@prisma/client');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
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


module.exports = {
    paymentHandling,
    paymentList,
    confirmPayment,
    upload, // Export upload middleware
};



