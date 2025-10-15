const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();


const member = async (req, res) => {
    const {fName, dob,gender,email, address,contact,package,weight,height,password} = req.body;
    try{
        await prisma.member.create({
            data: {
                FName: fName,
                DOB:dob,
                Gender:gender,
                Email: email,
                Address:address,
                Contact:contact,
                Package:package,
                Weight: parseFloat(weight),
                Height:parseFloat(height),   
                UName:contact,
                Password:password
                
                

            }
        })
        res.status(200).json({
            code: 200,
            message: 'Member created successfully',
        })
    }catch(ex){
        res.status(500).json({
            code: 500,
            message: 'Internal Server Error',
            error: ex.message
        })
    }
}

const memberList = async (req, res) => {
    try{
        const data = await prisma.member.findMany(
            {select: {
            Member_Id:true,
                FName: true,
                DOB:true,
                Gender:true,
                Email: true,
                Address:true,
                Contact:true,
                Package:true,
                Weight: true,
                Height:true,  
                UName:true,
                Password:true,
        },
        })
        res.status(200).json({
            code: 200,
            message: 'Member fetched successfully',
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

const memberLogin = async (req, res) => {
    const {username, password} = req.body;
    try{
        const data = await prisma.member.findFirst({
            select: {
                Member_Id: true,
                FName: true
            },
            where:{
                UName: username,
                Password: password
            }
        });

        if(data!== null){
        res.status(200).json({
            code: 200,
            message: 'Login Success',
            data
        })
    }else{
        res.status(200).json({
            code: 400,
            message: 'Invalid username or password',
            data: null
        })
    }

    }
    catch(ex){
        res.status(500).json({
            code: 500,
            message: 'Internal Server Error',
            error: ex.message
        })
    }

};


const memberDelete = async (req, res) => {
    try{
        const id = req.params.id
        const data = await prisma.member.delete({
            where: {
                Member_Id: parseInt(id)
            },
           
        })
        res.status(200).json({
            code: 200,
            message: 'Member Delete successfully',
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

const memberEdit = async (req, res) => {
    try{
        const id = req.params.id
        const body=req.body
        const data = await prisma.member.update({
            where: {
                Member_Id : parseInt(id)
            },
            data: {

                FName:body?.FName,
                DOB: body?.DOB,
                Gender:body?.Gender ,
                Email:body?.Email,
                Address:body?.Address,
                Contact:body?.Contact,
                Package:body?.Package,
                Weight:body?.Weight,
                Height:body?.Height,
                UName:body?.UName,
                Password:body?.Password,
               

            }
        })
        res.status(200).json({
            code: 200,
            message: 'Member edit successfully',
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

const memberGet = async (req, res) => {
    try {
      const id = req.params.id;
      const data = await prisma.member.findUnique({
        where: {
            Member_Id: parseInt(id),
        },
      });
      res.status(200).json({
        code: 200,
        message: 'Member fetched successfully',
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
    member,
    memberList,
    memberDelete,
    memberLogin,
    memberEdit,
    memberGet
    
}