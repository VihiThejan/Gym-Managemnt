const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();


const staffMember = async (req, res) => {
    const {FName, dob, address,gender,contactNo,email,jobRole,password} = req.body;
    try{
        await prisma.staffmember.create({
            data: {
                
                FName: FName,
                DOB:dob,
                Address:address,
                Gender:gender,
                Contact_No:contactNo,
                Email: email,
                Job_Role:jobRole,
                UName:contactNo,
                Password:password
                
                

            }
        })
        res.status(200).json({
            code: 200,
            message: 'Staff member created successfully',
        })
    }catch(ex){
        res.status(500).json({
            code: 500,
            message: 'Internal Server Error',
            error: ex.message
        })
    }
}

const staffLogin = async (req, res) => {
    const {username, password} = req.body;
    try{
        const data = await prisma.staffmember.findFirst({
            select: {
                Staff_ID: true,
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

const staffList = async (req, res) => {
    try {
        const data = await prisma.staffmember.findMany({
            select: {
                Staff_ID: true,
                FName: true,
                DOB: true,
                Address: true,
                Gender: true,
                Contact_No: true,
                Email: true,
                Job_Role: true,
                UName: true,
                Password: true
            }
              
           
        });
        res.status(200).json({
            code: 200,
            message: 'Staff Members fetched successfully',
            data
        });
    } catch (ex) {
        res.status(500).json({
            code: 500,
            message: 'Internal Server Error',
            error: ex.message
        });
    }
};

const staffDelete = async (req, res) => {
    try{
        const id = req.params.id
        const data = await prisma.staffmember.delete({
            where: {
                    Staff_ID : parseInt(id)
                        
            },
           
        })
        res.status(200).json({
            code: 200,
            message: 'Staff Member fetched successfully',
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


const staffEdit = async (req, res) => {
    try {
        const id = req.params.id;
        const { FName, DOB, Address, Gender, Contact_No, Email, Job_Role } = req.body;

        
        if (!FName && !DOB && !Address && !Gender && !Contact_No && !Email && !Job_Role) {
            return res.status(400).json({
                code: 400,
                message: 'At least one field is required for update',
            });
        }

        
        const updateData = {};
        if (FName) updateData.FName = FName;
        if (DOB) updateData.DOB = new Date(DOB); 
        if (Address) updateData.Address = Address;
        if (Gender) updateData.Gender = Gender;
        if (Contact_No) updateData.Contact_No = Contact_No;
        if (Email) updateData.Email = Email;
        if (Job_Role) updateData.Job_Role = Job_Role;

        
        const data = await prisma.staffmember.update({
            where: {
                Staff_ID: parseInt(id),
            },
            data: updateData,
        });

        res.status(200).json({
            code: 200,
            message: 'Staff member updated successfully',
            data,
        });
    } catch (ex) {
        console.error("Error updating staff member:", ex.message);
        res.status(500).json({
            code: 500,
            message: 'Internal Server Error',
            error: ex.message,
        });
    }
};

const staffGet = async (req, res) => {
    try {
      const id = req.params.id;
      const data = await prisma.staffmember.findUnique({
        where: {
            Staff_ID: parseInt(id),
        },
      });
      res.status(200).json({
        code: 200,
        message: 'Staff fetched successfully',
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
    staffList,
    staffMember,
    staffDelete,
    staffEdit,
    staffGet,
    staffLogin
};
