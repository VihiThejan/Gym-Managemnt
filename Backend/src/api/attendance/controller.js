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

    // Store the date as midnight UTC for consistent date-only comparison
    const dateOnly = new Date(currentDate + 'T00:00:00.000Z');

    // Use provided time or current local time
    const now = new Date();
    const timeToUse = inTime || `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;

    console.log('Input date string:', currentDate);
    console.log('Input time string:', inTime);
    console.log('Time to use:', timeToUse);

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

    // Build the In_time DateTime:
    // The frontend sends local time as HH:mm:ss. We must NOT append 'Z'
    // because that would treat local time as UTC.
    // Instead, use `new Date('YYYY-MM-DDTHH:mm:ss')` without Z — 
    // JS interprets it as local time on the server.
    const inDateTime = new Date(currentDate + 'T' + timeToUse);

    console.log('Check-in time (local):', timeToUse);
    console.log('Check-in DateTime stored:', inDateTime.toISOString());

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
  try {
    const data = await prisma.attendance.findMany(
      {
        select: {
          Attendance_ID: true,
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
  } catch (ex) {
    res.status(500).json({
      code: 500,
      message: 'Internal Server Error',
      error: ex.message
    })
  }
}

const attendanceDelete = async (req, res) => {
  try {
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
  } catch (ex) {
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

    // Store date as midnight UTC for consistent date-only storage
    const dateOnly = new Date(body.Current_date + 'T00:00:00.000Z');

    // Use provided time or current local time for checkout
    const now = new Date();
    const outTimeToUse = body.Out_time || `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;

    // Build DateTimes WITHOUT 'Z' — treats the time string as local time
    const inDateTime = new Date(body.Current_date + 'T' + body.In_time);
    const outDateTime = new Date(body.Current_date + 'T' + outTimeToUse);

    console.log('Input strings:', {
      date: body.Current_date,
      inTime: body.In_time,
      outTime: body.Out_time,
      outTimeToUse: outTimeToUse
    });
    console.log('Parsed dates (ISO):', {
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