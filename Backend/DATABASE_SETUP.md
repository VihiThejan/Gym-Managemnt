# Database Auto-Initialization

## Overview
The backend now automatically checks and creates the database when it starts up. You no longer need to manually run SQL scripts!

## How It Works

1. **On Server Start**: The backend automatically:
   - ✅ Checks if MySQL connection is available
   - ✅ Checks if the `gym_management` database exists
   - ✅ Checks if database tables exist
   - ✅ Creates database and tables if missing (using `setup_database.sql`)
   - ✅ Creates sample data automatically

2. **Database Configuration**: 
   - Edit `.env` file with your MySQL credentials:
   ```env
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=1234
   DB_NAME=gym_management
   DB_PORT=3306
   ```

## Usage

### Start the Backend
```bash
cd Backend
npm start
```

### What You'll See

**If database doesn't exist:**
```
📦 Database not found or incomplete. Initializing database...
✅ Connected to MySQL server
📄 Reading SQL file from: setup_database.sql
✅ SQL file loaded successfully
🔄 Executing database setup script...
✅ Database created successfully!
═══════════════════════════════════════════════
🏋️  Mega Power Gym Management System
═══════════════════════════════════════════════
🚀 Server is listening on port 5000
🌐 API Base URL: http://localhost:5000/api/v1
💬 Socket.IO is ready for connections
═══════════════════════════════════════════════
```

**If database already exists:**
```
✅ Database 'gym_management' exists
✅ Database tables verified
✅ Database connection pool created successfully
🚀 Connected to database: gym_management
═══════════════════════════════════════════════
🏋️  Mega Power Gym Management System
═══════════════════════════════════════════════
🚀 Server is listening on port 5000
🌐 API Base URL: http://localhost:5000/api/v1
💬 Socket.IO is ready for connections
═══════════════════════════════════════════════
```

## Features

### ✨ Automatic Database Creation
- No manual SQL execution needed
- Creates all 22 tables automatically
- Includes sample data for testing
- Creates indexes and views

### 📊 Database Includes
- **22 Tables**: All gym management tables
- **6 Views**: Pre-built queries for reports
- **7 Stored Procedures**: Common operations
- **3 Triggers**: Automatic updates
- **Sample Data**: Test members, staff, workouts, etc.

### 🔄 Smart Reconnection
- Automatically reconnects on connection loss
- Connection pooling for better performance
- Graceful shutdown handling

## Troubleshooting

### Error: Cannot connect to MySQL
**Solution**: Make sure MySQL is running
```bash
# Check MySQL status
mysql --version

# Start MySQL service (Windows)
net start MySQL80

# Or use XAMPP/WAMP control panel
```

### Error: Access denied
**Solution**: Check your credentials in `.env`
```env
DB_USER=root
DB_PASSWORD=your_actual_password
```

### Error: setup_database.sql not found
**Solution**: Make sure the SQL file exists at:
```
Backend/setup_database.sql
```

## Manual Database Creation (Optional)

If you prefer manual setup:

1. Open MySQL:
```bash
mysql -u root -p
```

2. Run the setup script:
```sql
source path/to/Backend/setup_database.sql
```

## Database Tables Created

### Core Tables (19)
1. `admin` - Admin users
2. `member` - Gym members
3. `staffmember` - Staff/trainers
4. `announcement` - Announcements
5. `appointment` - Member appointments
6. `attendance` - Attendance records
7. `equipment` - Gym equipment
8. `feedback` - Member feedback
9. `payment` - Payment records
10. `schedule` - Training schedules
11. `trainer` - Trainer assignments
12. `trainerrate` - Trainer ratings
13. `chat` - Chat messages
14. `otp` - OTP codes
15. `users` - Messaging users
16. `messages` - User messages
17. `packages` - Membership packages
18. `sessions` - User sessions
19. `audit_log` - Audit trail

### Workout Tracking Tables (3)
20. `workouts` - Workout sessions
21. `workout_exercises` - Exercise details
22. `personal_records` - Personal records/PRs

## Sample Login Credentials

After automatic setup, you can login with:

### Admin
- Username: `admin`
- Password: `Admin@123`

### Staff
- Username: `johntrainer`
- Password: `Staff@123`

### Member
- Username: `janesmith`
- Password: `Member@123`

## Next Steps

1. ✅ Start the backend: `npm start`
2. ✅ Backend auto-creates database
3. ✅ Start the frontend: `cd megapower-react-app && npm start`
4. ✅ Login and test the system!

## Notes

- Database auto-creation runs on **every server start**
- Existing data is **preserved** (no data loss)
- Safe to restart the server anytime
- Connection pool handles multiple requests efficiently
