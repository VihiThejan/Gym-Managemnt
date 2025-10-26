# Gym Management System - Backend Setup Guide

## 🚀 Quick Start on New Device

### Prerequisites
- Node.js (v14 or higher)
- MySQL Server (v8.0 or higher)
- npm or yarn package manager

### Step 1: Clone the Repository
```bash
git clone <your-repository-url>
cd "Gym Managemnt - Copy/Backend"
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Setup Database
Run the MySQL script to create the database and tables:
```bash
mysql -u root -p < setup_database.sql
```
Or import `setup_database.sql` using MySQL Workbench or phpMyAdmin.

### Step 4: Configure Environment Variables
1. Copy the example environment file:
```bash
cp example.env .env
```

2. Edit `.env` file and update the following **required** settings:
```env
DATABASE_URL="mysql://root:your_password@localhost:3306/gym_management"
JWT_SECRET=your_super_secret_jwt_key_here
PORT=5000
FRONTEND_URL=http://localhost:3000
```

3. Generate a secure JWT secret (optional but recommended):
```bash
# On Linux/Mac
openssl rand -base64 32

# On Windows PowerShell
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))
```

### Step 5: Run Prisma Migrations (if needed)
```bash
npx prisma generate
npx prisma db push
```

### Step 6: Start the Server
```bash
# Development mode
npm run dev

# Production mode
npm start
```

The backend server should now be running at `http://localhost:5000`

## 📁 Project Structure
```
Backend/
├── prisma/
│   ├── schema.prisma       # Database schema
│   └── migrations/         # Database migrations
├── src/
│   └── api/
│       ├── server.js       # Main server file
│       ├── announcement/   # Announcement routes
│       ├── appointment/    # Appointment routes
│       ├── attendance/     # Attendance routes
│       ├── chat/           # Chat routes
│       ├── equipment/      # Equipment routes
│       ├── feedback/       # Feedback routes
│       ├── login/          # Authentication routes
│       ├── member/         # Member routes
│       ├── payment/        # Payment routes
│       ├── schedule/       # Schedule routes
│       ├── staffmember/    # Staff routes
│       └── trainerrate/    # Trainer rating routes
├── index.js                # Entry point
├── setup_database.sql      # Database setup script
├── example.env             # Example environment variables
└── package.json            # Dependencies

```

## 🔧 Environment Variables

### Required Variables
- `DATABASE_URL` - MySQL connection string
- `JWT_SECRET` - Secret key for JWT tokens
- `PORT` - Server port (default: 5000)

### Optional Variables
- `EMAIL_USER` - Email for notifications
- `EMAIL_PASSWORD` - Email password
- `SMS_API_KEY` - SMS service API key
- `PAYMENT_API_KEY` - Payment gateway API key

See `example.env` for complete list of available variables.

## 🗄️ Database Information

**Database Name:** `gym_management`

**Tables:**
- admin - Admin users
- staffmember - Staff members (trainers, cashiers)
- member - Gym members
- announcement - Announcements
- appointment - Appointments
- attendance - Attendance records
- chat - Chat messages
- equipment - Equipment inventory
- feedback - Member feedback
- payment - Payment records
- schedule - Training schedules
- trainer - Trainer assignments
- trainerrate - Trainer ratings
- otp - OTP verification
- users - Messaging system users
- messages - User messages

## 📡 API Endpoints

Base URL: `http://localhost:5000/api/v1`

### Authentication
- POST `/login` - User login

### Members
- GET `/member/list` - Get all members
- POST `/member/create` - Create new member
- PUT `/member/update/:id` - Update member
- DELETE `/member/delete/:id` - Delete member

### Staff
- GET `/staffmember/list` - Get all staff
- POST `/staffmember/create` - Create new staff
- PUT `/staffmember/update/:id` - Update staff
- DELETE `/staffmember/delete/:id` - Delete staff

### Appointments
- GET `/appointment/list` - Get all appointments
- POST `/appointment/create` - Create appointment
- PUT `/appointment/update/:id` - Update appointment
- DELETE `/appointment/delete/:id` - Delete appointment

### Equipment
- GET `/equipment/list` - Get all equipment
- POST `/equipment/create` - Add equipment
- PUT `/equipment/update/:id` - Update equipment
- DELETE `/equipment/delete/:id` - Delete equipment

### Schedules
- GET `/schedule/list` - Get all schedules
- POST `/schedule/create` - Create schedule
- PUT `/schedule/update/:id` - Update schedule
- DELETE `/schedule/delete/:id` - Delete schedule

### Trainer Ratings
- GET `/trainerrate/list` - Get all ratings
- POST `/trainerrate/create` - Create rating
- DELETE `/trainerrate/delete/:id` - Delete rating

*(See individual route files for complete API documentation)*

## 🛠️ Troubleshooting

### Database Connection Issues
1. Verify MySQL is running
2. Check DATABASE_URL in .env
3. Ensure database exists: `SHOW DATABASES;`
4. Check user permissions

### Port Already in Use
Change PORT in .env or kill process:
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:5000 | xargs kill -9
```

### Prisma Issues
```bash
# Reset Prisma
npx prisma generate
npx prisma db push --force-reset
```

## 📝 Development Notes

### Sample Data
The setup script includes sample data:
- 1 Admin user (username: `admin`)
- 1 Staff member (username: `johntrainer`)
- 1 Member (username: `janemember`)
- 3 Equipment items

### Password Hashing
Passwords are hashed using bcrypt with 10 salt rounds.

### CORS
CORS is enabled for the frontend URL specified in .env.

## 🔐 Security Best Practices

1. Never commit `.env` file
2. Use strong JWT_SECRET
3. Enable HTTPS in production
4. Implement rate limiting
5. Validate all inputs
6. Use prepared statements (Prisma handles this)
7. Keep dependencies updated

## 📞 Support

For issues or questions:
- Email: info@megapowergym.com
- Phone: +94771234567

## 📄 License

Copyright © 2025 Mega Power Gym Management System
Created by K. Janith Chanuka
