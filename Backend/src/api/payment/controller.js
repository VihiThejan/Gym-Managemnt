const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const paymentHandling = async (req, res) => {
  const { memberId, packageId, amount, date } = req.body;

  console.log("Received payload:", { memberId, packageId, amount, date }); 

  try {
    await prisma.payment.create({
      data: {
        Member_Id: parseInt(memberId),
        Package_ID: parseInt(packageId),
        Amount: parseFloat(amount),
        Date: new Date(date),
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


module.exports = {
    paymentHandling,
    paymentList,
   
};



