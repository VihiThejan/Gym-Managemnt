require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const { initializeDatabase } = require('./src/config/database');
const loginRoute = require('./src/api/login/route');
const appoinmentRoute = require('./src/api/Appoinment/route');
const equipmentRoute = require('./src/api/equipment/route');
const announcementRoute = require('./src/api/announcement/route');
const attendanceRoute = require('./src/api/attendance/route');
const chatRoute = require('./src/api/chat/route');
const staffMemberRoute = require('./src/api/staffmember/route');
const memberRoute = require('./src/api/member/route');
const scheduleRoute = require('./src/api/schedule/route');
const trainerrateRoute = require('./src/api/trainerrate/route');
const feedbackRoute = require('./src/api/feedback/route');
const paymentRoute = require('./src/api/payment/route');
const multer = require('multer');
const path = require('path');

const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: ["http://localhost:3000", "http://localhost:3001"],
        methods: ["GET", "POST"]
    }
});

app.use(express.json());
app.use(cors());

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, 'uploads'));
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// File upload endpoint for chat
app.post('/api/v1/chat/upload', upload.single('file'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                code: 400,
                message: 'No file uploaded'
            });
        }

        const fileUrl = `/uploads/${req.file.filename}`;
        res.json({
            code: 200,
            message: 'File uploaded successfully',
            fileUrl: fileUrl
        });
    } catch (error) {
        console.error('File upload error:', error);
        res.status(500).json({
            code: 500,
            message: 'File upload failed',
            error: error.message
        });
    }
});

app.use('/api/v1/auth', loginRoute);
app.use('/api/v1/appointment', appoinmentRoute);
app.use('/api/v1/equipment', equipmentRoute);
app.use('/api/v1/announcement', announcementRoute);
app.use('/api/v1/attendance', attendanceRoute);
app.use('/api/v1/chat', chatRoute);
app.use('/api/v1/staffmember', staffMemberRoute);
app.use('/api/v1/member', memberRoute);
app.use('/api/v1/schedule', scheduleRoute);
app.use('/api/v1/trainerrate', trainerrateRoute);
app.use('/api/v1/feedback', feedbackRoute);
app.use('/api/v1/payment', paymentRoute);

// API endpoint to get message history between two users
app.get('/api/v1/messages/:userId/:receiverId', async (req, res) => {
    try {
        const { PrismaClient } = require('@prisma/client');
        const prisma = new PrismaClient();

        const userId = parseInt(req.params.userId);
        const receiverId = parseInt(req.params.receiverId);

        const messages = await prisma.messages.findMany({
            where: {
                OR: [
                    { AND: [{ sender_id: userId }, { receiver_id: receiverId }] },
                    { AND: [{ sender_id: receiverId }, { receiver_id: userId }] }
                ]
            },
            orderBy: {
                timestamp: 'asc'
            }
        });

        await prisma.$disconnect();

        res.json({
            code: 200,
            message: 'Messages fetched successfully',
            data: messages
        });
    } catch (error) {
        console.error('Error fetching messages:', error);
        res.status(500).json({
            code: 500,
            message: 'Failed to fetch messages',
            error: error.message
        });
    }
});

// Socket.IO connection handling
io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    // Handle incoming messages
    socket.on('sendMessage', async (data) => {
        console.log('Message received:', data);

        try {
            const { PrismaClient } = require('@prisma/client');
            const prisma = new PrismaClient();

            // Save message to messages table (not chat table)
            await prisma.messages.create({
                data: {
                    sender_id: parseInt(data.sender_id),
                    receiver_id: parseInt(data.receiver_id),
                    message: data.message || '',
                    file_url: data.file_url || null,
                    voice_url: data.voice_url || null,
                }
            });

            await prisma.$disconnect();

            // Broadcast message to all connected clients
            io.emit('receiveMessage', data);
        } catch (error) {
            console.error('Error saving message:', error);
            socket.emit('messageError', { error: 'Failed to save message' });
        }
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

// Initialize database and start server
async function startServer() {
    try {
        // Initialize database (will create if not exists)
        await initializeDatabase();

        // Start the server
        const PORT = process.env.PORT || 5000;
        server.listen(PORT, () => {
            console.log('═══════════════════════════════════════════════');
            console.log('🏋️  Mega Power Gym Management System');
            console.log('═══════════════════════════════════════════════');
            console.log(`🚀 Server is listening on port ${PORT}`);
            console.log(`🌐 API Base URL: http://localhost:${PORT}/api/v1`);
            console.log(`💬 Socket.IO is ready for connections`);
            console.log('═══════════════════════════════════════════════');
        });
    } catch (error) {
        console.error('❌ Failed to start server:', error.message);
        console.error('Please check your database configuration and try again.');
        process.exit(1);
    }
}

// Handle graceful shutdown
process.on('SIGINT', async () => {
    console.log('\n⚠️  Shutting down gracefully...');
    const { closeDatabase } = require('./src/config/database');
    await closeDatabase();
    process.exit(0);
});

// Start the server
startServer();

// Database reset trigger 1 - forcing restart
