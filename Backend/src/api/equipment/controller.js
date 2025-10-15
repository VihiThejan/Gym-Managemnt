const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const equipmentHandling = async (req, res) => {
  const { eName, qty, vendor, description, date,  } = req.body;

  try {
    await prisma.equipment.create({
      data: {
        EName: eName,
        Qty: parseInt(qty, 10),
        Vendor: vendor,
        Description: description,
        Date: new Date(date), 
        
      },
    });

    res.status(200).json({
      code: 200,
      message: 'Equipment added successfully',
    });
  } catch (ex) {
    res.status(500).json({
      code: 500,
      message: 'Internal Server Error',
      error: ex.message,
    });
  }
};



const equipmentList = async (req, res) => {
    try{
        const data = await prisma.equipment.findMany(
            {select: {
            Equipment_Id:true,
            EName: true,
            Qty: true,
            Vendor: true,
            Description: true,
            Date: true,
        },
        })
        res.status(200).json({
            code: 200,
            message: 'Equipment fetched successfully',
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



const equipmentDelete = async (req, res) => {
    try{
        const id = req.params.id
        const data = await prisma.equipment.delete({
            where: {
                Equipment_Id: parseInt(id)
            },
           
        })
        res.status(200).json({
            code: 200,
            message: 'Equipment deleted successfully',
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


const equipmentEdit = async (req, res) => {
  try {
      const id = req.params.id;
      const { EName, Qty, Vendor, Description, Date } = req.body;

      
      if (!EName || !Qty || !Vendor || !Description || !Date) {
          return res.status(400).json({
              code: 400,
              message: 'All fields are required',
          });
      }

      
      console.log("Updating equipment with ID:", id);
      console.log("Request body:", req.body);

      const data = await prisma.equipment.update({
          where: {
              Equipment_Id: parseInt(id),
          },
          data: {
              EName,
              Qty: parseInt(Qty, 10),
              Vendor,
              Description,
              Date: Date, 
          },
      });

      res.status(200).json({
          code: 200,
          message: 'Equipment updated successfully',
          data,
      });
  } catch (ex) {
      console.error("Error updating equipment:", ex.message); 
      res.status(500).json({
          code: 500,
          message: 'Internal Server Error',
          error: ex.message,
      });
  }
};

const equipmentGet = async (req, res) => {
    try {
      const id = req.params.id;
      const data = await prisma.equipment.findUnique({
        where: {
          Equipment_Id: parseInt(id),
        },
      });
      res.status(200).json({
        code: 200,
        message: 'Equipment fetched successfully',
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
    equipmentHandling,
    equipmentList,
    equipmentDelete,
    equipmentEdit,
    equipmentGet
};
