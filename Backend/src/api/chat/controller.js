const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();


const chatHandling = async (req, res) => {
    const {userId,message,date,time} = req.body;
    try{
        await prisma.chat.create({
            data: {
                User_ID: parseInt(userId),
                Message:message,
                Date: date,
                Time:time
                

            }
        })
        res.status(200).json({
            code: 200,
            message: 'Chat created successfully',
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
    chatHandling
    
}