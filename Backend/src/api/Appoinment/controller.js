const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();


const Appoinmenthandling = async (req, res) => {
    const {memberid, staffid, date_time, contact, purpose, notes} = req.body;
    try{
        const newAppointment = await prisma.appointment.create({
            data: {
                Member_Id: parseInt(memberid),
                Staff_ID: parseInt(staffid),
                Date_and_Time: new Date(date_time),
                Contact: contact,
                Purpose: purpose || 'Consultation',
                Status: 'Scheduled',
                Notes: notes || null
            }
        });
        
        console.log('Created appointment:', newAppointment);
        
        res.status(200).json({
            code: 200,
            message: 'Appointment created successfully',
            data: newAppointment
        })
    }catch(ex){
        console.error('Error creating appointment:', ex);
        res.status(500).json({
            code: 500,
            message: 'Internal Server Error',
            error: ex.message
        })
    }
}

const AppoinmentList = async (req, res) => {
    try{
        const data = await prisma.appointment.findMany({
            select: {
                App_ID: true,
                Member_Id: true,
                Staff_ID: true,
                Date_and_Time: true,
                Contact: true,
                Purpose: true,
                Status: true,
                Notes: true,
                member: {
                    select: {
                        FName: true,
                        LName: true,
                        Email: true
                    }
                },
                staffmember: {
                    select: {
                        FName: true,
                        LName: true,
                        Job_Role: true
                    }
                }
            },
            orderBy: {
                Date_and_Time: 'desc'
            }
        });
        
        console.log(`Fetched ${data.length} appointments`);
        
        res.status(200).json({
            code: 200,
            message: 'Appointments fetched successfully',
            data
        })
    }catch(ex){
        console.error('Error fetching appointments:', ex);
        res.status(500).json({
            code: 500,
            message: 'Internal Server Error',
            error: ex.message
        })
    }
}


const AppoinmentDelete = async (req, res) => {
    try{
        const id = req.params.id
        const data = await prisma.appointment.delete({
            where: {
                App_ID: parseInt(id)
            },
           
        })
        res.status(200).json({
            code: 200,
            message: 'Appoinment fetched successfully',
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

const AppoinmentEdit = async (req, res) => {
    try {
      const id = req.params.id;
      const { Member_Id, Staff_ID, Date_and_Time, Contact } = req.body;
  
      if (!Member_Id || !Staff_ID || !Date_and_Time || !Contact) {
        return res.status(400).json({ code: 400, message: 'All fields are required.' });
      }
  
      if (isNaN(Member_Id) || isNaN(Staff_ID)) {
        return res.status(400).json({ code: 400, message: 'Member/Staff ID must be numeric.' });
      }
  
      const updatedAppointment = await prisma.appointment.update({
        where: { App_ID: parseInt(id) },
        data: {
          Member_Id: parseInt(Member_Id),
          Staff_ID: parseInt(Staff_ID),
          Date_and_Time: new Date(Date_and_Time),
          Contact: Contact,
        },
      });
  
      res.status(200).json({ code: 200, message: 'Appointment updated.', data: updatedAppointment });
    } catch (ex) {
      console.error("Error:", ex.message);
      res.status(500).json({ code: 500, message: 'Server error.', error: ex.message });
    }
  };


const AppoinmentGet = async (req, res) => {
    try {
      const id = req.params.id;
      const data = await prisma.appointment.findUnique({
        where: {
            App_ID: parseInt(id),
        },
      });
      res.status(200).json({
        code: 200,
        message: 'Appoinment fetched successfully',
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
    Appoinmenthandling,
    AppoinmentList,
    AppoinmentDelete,
    AppoinmentEdit,
    AppoinmentGet
    
}