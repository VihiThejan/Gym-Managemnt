const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcryptjs');


const member = async (req, res) => {
    const {fName, dob,gender,email, address,contact,package,weight,height,password} = req.body;
    
    // Log received data for debugging
    console.log('Received member registration data:', req.body);
    
    try{
        // Validate required fields
        if (!fName || !email || !contact || !password || !dob || !gender || !address || !package || !height || !weight) {
            return res.status(400).json({
                code: 400,
                message: 'Missing required fields',
                received: req.body
            });
        }

        // Check if email already exists
        const existingEmail = await prisma.member.findFirst({
            where: { Email: email }
        });
        
        if (existingEmail) {
            return res.status(200).json({
                code: 400,
                message: 'Email already exists. Please use a different email address.',
            });
        }

        // Check if contact already exists
        const existingContact = await prisma.member.findFirst({
            where: { Contact: contact }
        });
        
        if (existingContact) {
            return res.status(200).json({
                code: 400,
                message: 'Contact number already exists. Please use a different contact number.',
            });
        }

        // Hash the password before storing
        const hashedPassword = await bcrypt.hash(password, 10);
        console.log('Password hashed for member registration');

        await prisma.member.create({
            data: {
                FName: fName,
                DOB: new Date(dob),
                Gender: gender,
                Email: email,
                Address: address,
                Contact: contact,
                Package: package,
                Weight: parseFloat(weight),
                Height: parseFloat(height),   
                UName: contact,
                Password: hashedPassword
            }
        })
        console.log('Member created successfully with hashed password');
        
        res.status(200).json({
            code: 200,
            message: 'Member created successfully',
        })
    }catch(ex){
        console.error('Error creating member:', ex);
        res.status(500).json({
            code: 500,
            message: 'Internal Server Error',
            error: ex.message,
            details: ex.stack
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
    
    console.log('Member login attempt:', { username, passwordLength: password?.length });
    
    try{
        // Find member by Contact number (used as username)
        const data = await prisma.member.findFirst({
            select: {
                Member_Id: true,
                FName: true,
                Password: true,
                Contact: true
            },
            where:{
                Contact: username
            }
        });

        console.log('Member found:', data ? 'Yes' : 'No');

        if(data !== null){
            // Compare the provided password with the hashed password
            const isMatch = await bcrypt.compare(password, data.Password);
            
            console.log('Password match:', isMatch);
            
            if(isMatch){
                // Remove password from response
                const { Password, ...userData } = data;
                res.status(200).json({
                    code: 200,
                    message: 'Login Success',
                    data: userData
                })
            }else{
                res.status(200).json({
                    code: 400,
                    message: 'Invalid username or password',
                    data: null
                })
            }
        }else{
            console.log('User not found with contact:', username);
            res.status(200).json({
                code: 400,
                message: 'Invalid username or password',
                data: null
            })
        }

    }
    catch(ex){
        console.error('Member login error:', ex);
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
        const memberId = parseInt(id);
        
        // Delete related records first to avoid foreign key constraint violations
        // Delete appointments
        await prisma.appointment.deleteMany({
            where: {
                Member_Id: memberId
            }
        });
        
        // Delete attendance records
        await prisma.attendance.deleteMany({
            where: {
                Member_Id: memberId
            }
        });
        
        // Delete trainer ratings
        await prisma.trainerrate.deleteMany({
            where: {
                Member_Id: memberId
            }
        });
        
        // Now delete the member
        const data = await prisma.member.delete({
            where: {
                Member_Id: memberId
            },
           
        })
        res.status(200).json({
            code: 200,
            message: 'Member deleted successfully',
            data
        })
    }catch(ex){
        console.error('Error deleting member:', ex);
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