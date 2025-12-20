const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();


const attendanceHandling = async (req, res) => {
  const { memberId, currentDate, inTime } = req.body;

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

      // Check if member already checked in today
      const today = new Date(currentDate + 'T00:00:00');
      const existingAttendance = await prisma.attendance.findFirst({
          where: {
              Member_Id: parseInt(memberId),
              Current_date: today,
          },
      });

      if (existingAttendance) {
          return res.status(400).json({
              code: 400,
              message: "You have already checked in today.",
          });
      }

      // Create date-time string for check-in
      const inDateTime = `${currentDate}T${inTime}`;
      
      await prisma.attendance.create({
          data: {
              Member_Id: parseInt(memberId),
              Current_date: today,
              In_time: new Date(inDateTime),
              Out_time: null, // No checkout time yet
          },
      });

      res.status(200).json({
          code: 200,
          message: "Checked in successfully!",
      });
  } catch (ex) {
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

    // Create date-time strings in local timezone format to avoid conversion issues
    const inDateTime = `${body.Current_date}T${body.In_time}`;
    const outDateTime = `${body.Current_date}T${body.Out_time}`;

    const data = await prisma.attendance.update({
      where: {
        Attendance_ID: parseInt(id),
      },
      data: {
        Member_Id: parseInt(body.Member_Id),
        Current_date: new Date(body.Current_date + 'T00:00:00'),
        In_time: new Date(inDateTime),
        Out_time: new Date(outDateTime),
      },
    });

    res.status(200).json({
      code: 200,
      message: 'Attendance updated successfully',
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