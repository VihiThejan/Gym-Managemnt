const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const announcementHandling = async (req, res) => {
    const { staff_id, message, date_time } = req.body;
    try {
        await prisma.announcement.create({
            data: {
                Staff_ID: parseInt(staff_id),
                Message: message,
                Date_Time: new Date(date_time),
            }
        });

        res.status(200).json({
            code: 200,
            message: 'Announcement created successfully',
        });
    } catch (ex) {
        res.status(500).json({
            code: 500,
            message: 'Internal Server Error',
            error: ex.message
        });
    }
};

const announcementList = async (req, res) => {
    try {
        const data = await prisma.announcement.findMany({
            select: {
                Announcement_ID: true,
                Staff_ID: true,
                Message: true,
                Date_Time: true,
            }
        });

        res.status(200).json({
            code: 200,
            message: 'Announcement fetched successfully',
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

const announcementDelete = async (req, res) => {
    try{
        const id = req.params.id
        const data = await prisma.announcement.delete({
            where: {
                Announcement_ID: parseInt(id)
            },
           
        })
        res.status(200).json({
            code: 200,
            message: 'Announcement fetched successfully',
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

const announcementEdit = async (req, res) => {
    try {
        const id = req.params.id;
        const { Staff_ID, Message, Date_Time } = req.body;

        
        if (!Staff_ID || !Message || !Date_Time) {
            return res.status(400).json({
                code: 400,
                message: 'All fields are required: Staff_ID, Message, Date_Time',
            });
        }

        
        console.log("Updating announcement with ID:", id);
        console.log("Request body:", req.body);

        
        const updatedAnnouncement = await prisma.announcement.update({
            where: {
                Announcement_ID: parseInt(id),
            },
            data: {
                Staff_ID: parseInt(Staff_ID),
                Message,
                Date_Time: new Date(Date_Time),
            },
        });

        
        res.status(200).json({
            code: 200,
            message: 'Announcement updated successfully',
            data: updatedAnnouncement,
        });
    } catch (ex) {
        console.error("Error updating announcement:", ex.message);
        res.status(500).json({
            code: 500,
            message: 'Internal Server Error',
            error: ex.message,
        });
    }
};
  
  
const announcementGet = async (req, res) => {
    try {
      const id = req.params.id;
      const data = await prisma.announcement.findUnique({
        where: {
            Announcement_ID: parseInt(id),
        },
      });
      res.status(200).json({
        code: 200,
        message: 'Announcement fetched successfully',
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
    announcementHandling,
    announcementList,
    announcementDelete,
    announcementEdit,
    announcementGet
};
