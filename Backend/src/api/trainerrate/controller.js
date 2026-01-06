const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();


const trainerrateHandling = async (req, res) => {
    const { staffId, memberId,rating,comment } = req.body;

    try {
        await prisma.trainerrate.create({
            data: {
                Staff_ID: parseInt(staffId),
                Member_Id: parseInt(memberId),
                Rating: parseInt(rating),
                Comment: comment,
              
            }
        });

        res.status(200).json({
            code: 200,
            message: 'Traine rating make successfully',
            
        });

    } catch (ex) {
        console.error('Error creating rating:', ex.message);
        res.status(500).json({
            code: 500,
            message: 'Internal Server Error',
            error: ex.message
        });
    }
};


const trainerrateList = async (req, res) => {
    try{
        const data = await prisma.trainerrate.findMany(
            {select: {

                Rating_ID:true,
                Staff_ID: true,
                Member_Id: true,
                Rating: true,
                Comment: true,
                Date: true,
        
        },
        })
        res.status(200).json({
            code: 200,
            message: 'Rating fetched successfully',
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
    trainerrateHandling,
    trainerrateList
    
};
