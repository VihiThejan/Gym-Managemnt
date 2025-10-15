const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const feedbackHandling = async (req, res) => {
  const { memberId,message,date } = req.body;

  try {
    await prisma.feedback.create({
      data: {
        Member_Id: parseInt(memberId),
        Message:message,
        Date: new Date(date), 
        
      },
    });

    res.status(200).json({
      code: 200,
      message: 'Feedback added successfully',
    });
  } catch (ex) {
    res.status(500).json({
      code: 500,
      message: 'Internal Server Error',
      error: ex.message,
    });
  }
};

const feedbackList = async (req, res) => {
    try{
        const data = await prisma.feedback.findMany(
            {select: {
                Feedback_ID:true,
                Member_Id: true,
                Message: true,
                Date: true,
        },
        })
        res.status(200).json({
            code: 200,
            message: 'Feedback fetched successfully',
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

const feedbackDelete = async (req, res) => {
    try{
        const id = req.params.id
        const data = await prisma.feedback.delete({
            where: {
                Feedback_ID: parseInt(id)
            },
           
        })
        res.status(200).json({
            code: 200,
            message: 'Feedback deleted successfully',
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

const feedbackEdit = async (req, res) => {
    try{
        const id = req.params.id
        const body=req.body
        const data = await prisma.feedback.update({
            where: {
                Feedback_ID : parseInt(id)
            },
            data: {

            Member_Id:body?.Member_Id,
            Message:body?.Message ,
            Date:body?.Date,

            }
        })
        res.status(200).json({
            code: 200,
            message: 'Feedback edit successfully',
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

const feedbackGet = async (req, res) => {
    try {
      const id = req.params.id;
      const data = await prisma.feedback.findUnique({
        where: {
            Feedback_ID: parseInt(id),
        },
      });
      res.status(200).json({
        code: 200,
        message: 'Feedback fetched successfully',
        data,
      });
    } catch (ex) {
      res.status(500).json({
        code: 500,
        message: 'Internal Server Error',
        error: ex.message,
      });
    }
  };




module.exports = {
    feedbackHandling,
    feedbackList,
    feedbackDelete,
    feedbackEdit,
    feedbackGet
};
