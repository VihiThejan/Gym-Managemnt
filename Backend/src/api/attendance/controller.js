const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();


const attendanceHandling = async (req, res) => {
  const { memberId, currentDate, inTime } = req.body;

  console.log('Check-in request:', { memberId, currentDate, inTime });

  try {
      
      const existingMember = await prisma.member.findUnique({
          where: {
              Member_Id: parseInt(memberId),
          },
      });

      if (!existingMember) {
          return res.status(400).json({
              code: 400,
              message: "Error: Member ID does not exist.",
          });
      }

      // Use UTC to prevent timezone conversion issues
      // Input format: YYYY-MM-DD (e.g., "2025-12-22")
      const dateOnly = new Date(currentDate + 'T00:00:00.000Z');
      
      // Use provided time or current time
      const now = new Date();
      const timeToUse = inTime || `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
      
      console.log('Input date string:', currentDate);
      console.log('Input time string:', inTime);
      console.log('Time to use:', timeToUse);
      console.log('Parsed date for check-in (UTC):', dateOnly.toISOString());

      // Check if member already has an active check-in (not checked out yet)
      const existingAttendance = await prisma.attendance.findFirst({
          where: {
              Member_Id: parseInt(memberId),
              Current_date: {
                gte: new Date(currentDate + 'T00:00:00.000Z'),
                lt: new Date(new Date(currentDate + 'T00:00:00.000Z').getTime() + 24 * 60 * 60 * 1000)
              },
              Out_time: null // Only check for records without checkout
          },
      });

      if (existingAttendance) {
          return res.status(200).json({
              code: 400,
              message: "You have an active check-in. Please check out first before checking in again.",
          });
      }

      // Store time as DateTime using the date + time combination
      const inDateTime = new Date(currentDate + 'T' + timeToUse + '.000Z');
      
      console.log('Combined date-time string:', currentDate + 'T' + timeToUse + '.000Z');
      console.log('Check-in time parsed:', inDateTime.toISOString());
      
      const newAttendance = await prisma.attendance.create({
          data: {
              Member_Id: parseInt(memberId),
              Current_date: dateOnly,
              In_time: inDateTime,
              Out_time: null, // No checkout time yet
          },
      });

      console.log('Created attendance:', {
        id: newAttendance.Attendance_ID,
        date: newAttendance.Current_date,
        inTime: newAttendance.In_time
      });

      res.status(200).json({
          code: 200,
          message: "Checked in successfully!",
      });
  } catch (ex) {
      console.error('Check-in error:', ex);
      res.status(500).json({
          code: 500,
          message: "Internal Server Error",
          error: ex.message,
      });
  }
};

const attendanceList = async (req, res) => {
    try{
        const data = await prisma.attendance.findMany(
            {select: {
            Attendance_ID:true,
            Member_Id: true,
            Current_date: true,
            In_time: true,
            Out_time: true,
            
        },
        })
        res.status(200).json({
            code: 200,
            message: 'Attendance fetched successfully',
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

const attendanceDelete = async (req, res) => {
    try{
        const id = req.params.id
        const data = await prisma.attendance.delete({
            where: {
                Attendance_ID: parseInt(id)
            },
           
        })
        res.status(200).json({
            code: 200,
            message: 'Attendance Delete successfully',
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

const attendanceEdit = async (req, res) => {
  try {
    const id = req.params.id;
    const body = req.body;

    console.log('Check-out request:', { id, body });

    // Use UTC to prevent timezone conversion
    const dateOnly = new Date(body.Current_date + 'T00:00:00.000Z');
    
    // Use provided time or current time for checkout
    const now = new Date();
    const outTimeToUse = body.Out_time || `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
    
    const inDateTime = new Date(body.Current_date + 'T' + body.In_time + '.000Z');
    const outDateTime = new Date(body.Current_date + 'T' + outTimeToUse + '.000Z');

    console.log('Input strings:', { 
      date: body.Current_date, 
      inTime: body.In_time, 
      outTime: body.Out_time,
      outTimeToUse: outTimeToUse
    });
    console.log('Parsed dates:', { 
      dateOnly: dateOnly.toISOString(), 
      inDateTime: inDateTime.toISOString(), 
      outDateTime: outDateTime.toISOString() 
    });

    const data = await prisma.attendance.update({
      where: {
        Attendance_ID: parseInt(id),
      },
      data: {
        Member_Id: parseInt(body.Member_Id),
        Current_date: dateOnly,
        In_time: inDateTime,
        Out_time: outDateTime,
      },
    });

    console.log('Updated attendance:', {
      id: data.Attendance_ID,
      date: data.Current_date,
      inTime: data.In_time,
      outTime: data.Out_time
    });

    res.status(200).json({
      code: 200,
      message: 'Attendance updated successfully',
      data,
    });
  } catch (ex) {
    console.error('Check-out error:', ex);
    res.status(500).json({
      code: 500,
      message: 'Internal Server Error',
      error: ex.message,
    });
  }
};


const attendanceGet = async (req, res) => {
    try {
      const id = req.params.id;
      const data = await prisma.attendance.findUnique({
        where: {
            Attendance_ID: parseInt(id),
        },
      });
      res.status(200).json({
        code: 200,
        message: 'Attendance fetched successfully',
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
    attendanceHandling,
    attendanceList,
    attendanceDelete,
    attendanceEdit,
    attendanceGet
    
}