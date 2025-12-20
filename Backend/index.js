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

const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
});

app.use(express.json());
app.use(cors());

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

// Socket.IO connection handling
io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    // Handle incoming messages
    socket.on('sendMessage', (data) => {
        console.log('Message received:', data);
        // Broadcast message to all connected clients
        io.emit('receiveMessage', data);
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
