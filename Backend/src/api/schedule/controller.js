const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Create Schedule
const scheduleHandling = async (req, res) => {
    const { staffId, memberId, eName, equipment, quantity, date } = req.body;

    try {
        await prisma.schedule.create({
            data: {
                Staff_ID: parseInt(staffId),
                Member_ID: parseInt(memberId),
                EName: eName,
                Equipment: equipment,
                Quantity: parseInt(quantity),
                Date_Time: new Date(date),
            }
        });

        res.status(200).json({
            code: 200,
            message: 'Schedule created successfully',
            
        });

    } catch (ex) {
        console.error('Error creating schedule:', ex.message);
        res.status(500).json({
            code: 500,
            message: 'Internal Server Error',
            error: ex.message
        });
    }
};


const scheduleList = async (req, res) => {
    try{
        const data = await prisma.schedule.findMany(
            {select: {
            Schedule_ID:true,
            Staff_ID: true,
            Member_ID: true,
            EName: true,
            Equipment: true,
            Quantity: true,
            Date_Time: true,

            
        },
        })
        res.status(200).json({
            code: 200,
            message: 'Schedule fetched successfully',
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




const scheduleEdit = async (req, res) => {
    try{
        const id = req.params.id
        const body=req.body
        const data = await prisma.schedule.update({
            where: {
                Schedule_ID : parseInt(id)
            },
            data: {

                Staff_ID:body?.Staff_ID,
                Member_ID: body?.Member_ID,
                EName:body?.EName,
                Equipment:body?.Equipment,
                Quantity:body?.Quantity,
                Date_Time:body?.Date_Time,

            }
        })
        res.status(200).json({
            code: 200,
            message: 'Schedule Edit successfully',
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



const scheduleGet = async (req, res) => {
    try {
      const id = req.params.id;
      const data = await prisma.schedule.findUnique({
        where: {
            Schedule_ID: parseInt(id),
        },
      });
      res.status(200).json({
        code: 200,
        message: 'Schedule fetched successfully',
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





const scheduleDelete = async (req, res) => {
    try{
        const id = req.params.id
        const data = await prisma.schedule.delete({
            where: {
                Schedule_ID: parseInt(id)
            },
           
        })
        res.status(200).json({
            code: 200,
            message: 'Schedule Delete successfully',
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
    scheduleHandling,
    scheduleList,
    scheduleDelete,
    scheduleEdit,
    scheduleGet
};
