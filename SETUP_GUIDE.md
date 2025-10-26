# 🏋️ Mega Power Gym Management System - Complete Setup Guide

## 📋 Table of Contents
1. [System Requirements](#system-requirements)
2. [Quick Start](#quick-start)
3. [Backend Setup](#backend-setup)
4. [Frontend Setup](#frontend-setup)
5. [Database Configuration](#database-configuration)
6. [Running the Application](#running-the-application)
7. [Troubleshooting](#troubleshooting)
8. [Project Structure](#project-structure)
9. [API Documentation](#api-documentation)
10. [Deployment](#deployment)

---

## 🖥️ System Requirements

### Prerequisites
- **Node.js**: v14.0.0 or higher
- **npm**: v6.0.0 or higher (comes with Node.js)
- **MySQL**: v8.0 or higher
- **Git**: Latest version
- **Code Editor**: VS Code (recommended) or any preferred editor

### Recommended System Specs
- **RAM**: 4GB minimum, 8GB recommended
- **Storage**: 5GB free space
- **OS**: Windows 10/11, macOS 10.15+, or Linux

---

## 🚀 Quick Start

### Step 1: Clone the Repository
```bash
git clone https://github.com/VihiThejan/Gym-Managemnt.git
cd "Gym Managemnt - Copy"
```

### Step 2: Install Node.js Dependencies
```bash
# Install backend dependencies
cd Backend
npm install

# Install frontend dependencies
cd ../megapower-react-app
npm install
```

### Step 3: Setup Database
```bash
cd ../Backend
mysql -u root -p < setup_database.sql
```

### Step 4: Configure Environment
```bash
# In Backend folder
cp example.env .env
# Edit .env with your database credentials
```

### Step 5: Start the Application
```bash
# Terminal 1 - Start Backend (from Backend folder)
npm run dev

# Terminal 2 - Start Frontend (from megapower-react-app folder)
npm start
```

**Access the Application:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

---

## 🔧 Backend Setup

### 1. Navigate to Backend Directory
```bash
cd Backend
```

### 2. Install Dependencies
```bash
npm install
```

This will install all required packages:
- Express.js - Web framework
- Prisma - Database ORM
- MySQL2 - MySQL driver
- bcrypt - Password hashing
- jsonwebtoken - JWT authentication
- cors - Cross-origin resource sharing
- dotenv - Environment variables

### 3. Database Setup

#### Option A: Using MySQL Command Line
```bash
# Login to MySQL
mysql -u root -p

# Run the setup script
source setup_database.sql

# Or in one command
mysql -u root -p < setup_database.sql
```

#### Option B: Using MySQL Workbench
1. Open MySQL Workbench
2. Connect to your MySQL server
3. Go to **File → Open SQL Script**
4. Select `Backend/setup_database.sql`
5. Click **Execute** (⚡ icon)

#### Option C: Using phpMyAdmin
1. Open phpMyAdmin in browser
2. Click on **Import** tab
3. Choose file: `Backend/setup_database.sql`
4. Click **Go** button

### 4. Configure Environment Variables

Create `.env` file from example:
```bash
cp example.env .env
```

Edit `.env` file with your settings:
```env
# Database Configuration
DATABASE_URL="mysql://root:your_mysql_password@localhost:3306/gym_management"

# Server Configuration
PORT=5000
NODE_ENV=development

# JWT Secret (generate a secure random string)
JWT_SECRET=your_super_secret_jwt_key_here_change_this

# Frontend URL
FRONTEND_URL=http://localhost:3000

# Optional: Email Configuration
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_email_app_password
```

**Generate Secure JWT Secret:**
```bash
# On Windows PowerShell
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))

# On Linux/Mac
openssl rand -base64 32
```

### 5. Initialize Prisma
```bash
npx prisma generate
npx prisma db push
```

### 6. Start Backend Server
```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

Server will start at: **http://localhost:5000**

---

## 🎨 Frontend Setup

### 1. Navigate to Frontend Directory
```bash
cd megapower-react-app
```

### 2. Install Dependencies
```bash
npm install
```

This will install:
- React 18.3.1 - UI framework
- React Router DOM - Routing
- Ant Design 5.x - UI components
- Axios - HTTP client
- Moment.js - Date formatting
- React Phone Input 2 - International phone input

### 3. Configure API Endpoint (if needed)

If your backend is running on a different port or host, update API URLs in the source files.

Create `.env` in `megapower-react-app` folder:
```env
REACT_APP_API_URL=http://localhost:5000
```

### 4. Start Frontend Development Server
```bash
npm start
```

Application will open at: **http://localhost:3000**

The page will automatically reload when you make changes.

---

## 🗄️ Database Configuration

### Database Schema

**Database Name:** `gym_management`

**Main Tables:**
- `admin` - Admin users (system administrators)
- `staffmember` - Staff members (trainers, cashiers)
- `member` - Gym members
- `appointment` - Appointments between members and staff
- `attendance` - Member attendance tracking
- `equipment` - Gym equipment inventory
- `schedule` - Training schedules
- `payment` - Payment records
- `feedback` - Member feedback
- `announcement` - System announcements
- `trainerrate` - Trainer ratings by members
- `chat` / `messages` / `users` - Messaging system
- `otp` - OTP verification codes

### Sample Data Included
The setup script includes sample data:
- 1 Admin user (username: `admin`)
- 1 Staff member (username: `johntrainer`)
- 1 Member (username: `janemember`)
- 3 Equipment items (Treadmill, Dumbbells, Bench Press)

### Database Backup
To backup your database:
```bash
mysqldump -u root -p gym_management > backup_$(date +%Y%m%d).sql
```

To restore from backup:
```bash
mysql -u root -p gym_management < backup_20250126.sql
```

---

## ▶️ Running the Application

### Development Mode

**Terminal 1 - Backend:**
```bash
cd Backend
npm run dev
```
Backend runs at: http://localhost:5000

**Terminal 2 - Frontend:**
```bash
cd megapower-react-app
npm start
```
Frontend runs at: http://localhost:3000

### Production Mode

**Backend:**
```bash
cd Backend
npm start
```

**Frontend:**
```bash
cd megapower-react-app
npm run build
# Serve the build folder using a static server
npx serve -s build -p 3000
```

---

## 🐛 Troubleshooting

### Issue 1: Database Connection Failed
**Error:** `Can't connect to MySQL server`

**Solutions:**
1. Verify MySQL is running:
   ```bash
   # Windows
   net start MySQL80
   
   # Linux/Mac
   sudo systemctl start mysql
   ```

2. Check DATABASE_URL in `.env`:
   ```env
   DATABASE_URL="mysql://root:YOUR_PASSWORD@localhost:3306/gym_management"
   ```

3. Test connection:
   ```bash
   mysql -u root -p
   SHOW DATABASES;
   ```

### Issue 2: Port Already in Use
**Error:** `Port 5000 is already in use`

**Solutions:**
1. Kill the process using the port:
   ```bash
   # Windows
   netstat -ano | findstr :5000
   taskkill /PID <PID> /F
   
   # Linux/Mac
   lsof -ti:5000 | xargs kill -9
   ```

2. Or change the port in `.env`:
   ```env
   PORT=5001
   ```

### Issue 3: CORS Errors
**Error:** `Access to XMLHttpRequest has been blocked by CORS policy`

**Solution:**
Update `FRONTEND_URL` in Backend `.env`:
```env
FRONTEND_URL=http://localhost:3000
```

### Issue 4: npm Install Fails
**Error:** `npm ERR! code ENOENT`

**Solutions:**
1. Clear npm cache:
   ```bash
   npm cache clean --force
   ```

2. Delete node_modules and reinstall:
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

### Issue 5: Prisma Errors
**Error:** `Prisma Client could not locate the Prisma schema file`

**Solution:**
```bash
cd Backend
npx prisma generate
npx prisma db push
```

### Issue 6: React Compilation Errors
**Error:** `Module not found: Can't resolve...`

**Solutions:**
1. Install missing dependencies:
   ```bash
   npm install
   ```

2. Clear React cache:
   ```bash
   rm -rf node_modules/.cache
   npm start
   ```

---

## 📁 Project Structure

```
Gym-Managemnt/
│
├── Backend/
│   ├── prisma/
│   │   ├── schema.prisma           # Database schema
│   │   └── migrations/             # Database migrations
│   ├── src/
│   │   └── api/
│   │       ├── server.js           # Express server setup
│   │       ├── announcement/       # Announcement routes
│   │       ├── appointment/        # Appointment routes
│   │       ├── attendance/         # Attendance routes
│   │       ├── chat/               # Chat routes
│   │       ├── equipment/          # Equipment routes
│   │       ├── feedback/           # Feedback routes
│   │       ├── login/              # Authentication routes
│   │       ├── member/             # Member routes
│   │       ├── payment/            # Payment routes
│   │       ├── schedule/           # Schedule routes
│   │       ├── staffmember/        # Staff routes
│   │       └── trainerrate/        # Trainer rating routes
│   ├── index.js                    # Entry point
│   ├── setup_database.sql          # Database setup script
│   ├── example.env                 # Environment variables template
│   ├── package.json                # Dependencies
│   └── README.md                   # Backend documentation
│
└── megapower-react-app/
    ├── public/
    │   ├── index.html              # HTML template
    │   └── manifest.json           # PWA manifest
    ├── src/
    │   ├── components/
    │   │   └── Layout/
    │   │       └── MainLayout.jsx  # Main layout component
    │   ├── Admin.jsx               # Admin dashboard
    │   ├── Dashboard.jsx           # Main dashboard
    │   ├── MemberDashboard.jsx     # Member dashboard
    │   ├── staffDashboard.jsx      # Staff dashboard
    │   ├── Login.jsx               # Login page
    │   ├── Forgotpw.jsx           # Forgot password
    │   ├── Resetpw.jsx            # Reset password
    │   ├── Member.jsx              # Member registration
    │   ├── MemberTable.jsx         # Member list
    │   ├── staff.jsx               # Staff registration
    │   ├── staffTable.jsx          # Staff list
    │   ├── Appoinment.jsx          # Appointment form
    │   ├── Appoinmenttable.jsx     # Appointment list
    │   ├── Attendance.jsx          # Attendance form
    │   ├── Attendancetable.jsx     # Attendance list
    │   ├── Equipment.jsx           # Equipment form
    │   ├── Equipmenttable.jsx      # Equipment list
    │   ├── Schedule.jsx            # Schedule form
    │   ├── Scheduletable.jsx       # Schedule list
    │   ├── Payment.jsx             # Payment form
    │   ├── Paymenttable.jsx        # Payment list
    │   ├── Announcement.jsx        # Announcement form
    │   ├── Announcementtable.jsx   # Announcement list
    │   ├── Feedback.jsx            # Feedback form
    │   ├── Feedbacktable.jsx       # Feedback list
    │   ├── Trainerrate.jsx         # Trainer rating form
    │   ├── Trainerratetable.jsx    # Trainer rating list
    │   ├── Chat.jsx                # Chat interface
    │   ├── App.js                  # Main app component
    │   ├── App.css                 # Global styles
    │   └── index.js                # React entry point
    ├── package.json                # Dependencies
    └── README.md                   # Frontend documentation
```

---

## 📡 API Documentation

### Base URL
```
http://localhost:5000/api/v1
```

### Authentication
Most endpoints require JWT authentication. Include token in headers:
```
Authorization: Bearer <your_jwt_token>
```

### Main Endpoints

#### **Authentication**
- `POST /login` - User login

#### **Members**
- `GET /member/list` - Get all members
- `POST /member/create` - Create new member
- `PUT /member/update/:id` - Update member
- `DELETE /member/delete/:id` - Delete member

#### **Staff**
- `GET /staffmember/list` - Get all staff
- `POST /staffmember/create` - Create new staff
- `PUT /staffmember/update/:id` - Update staff
- `DELETE /staffmember/delete/:id` - Delete staff

#### **Appointments**
- `GET /appointment/list` - Get all appointments
- `POST /appointment/create` - Create appointment
- `PUT /appointment/update/:id` - Update appointment
- `DELETE /appointment/delete/:id` - Delete appointment

#### **Attendance**
- `GET /attendance/list` - Get all attendance
- `POST /attendance/create` - Mark attendance
- `PUT /attendance/update/:id` - Update attendance
- `DELETE /attendance/delete/:id` - Delete attendance

#### **Equipment**
- `GET /equipment/list` - Get all equipment
- `POST /equipment/create` - Add equipment
- `PUT /equipment/update/:id` - Update equipment
- `DELETE /equipment/delete/:id` - Delete equipment

#### **Schedules**
- `GET /schedule/list` - Get all schedules
- `POST /schedule/create` - Create schedule
- `PUT /schedule/update/:id` - Update schedule
- `DELETE /schedule/delete/:id` - Delete schedule

#### **Payments**
- `GET /payment/list` - Get all payments
- `POST /payment/create` - Record payment
- `PUT /payment/update/:id` - Update payment
- `DELETE /payment/delete/:id` - Delete payment

#### **Announcements**
- `GET /announcement/list` - Get all announcements
- `POST /announcement/create` - Create announcement
- `PUT /announcement/update/:id` - Update announcement
- `DELETE /announcement/delete/:id` - Delete announcement

#### **Feedback**
- `GET /feedback/list` - Get all feedback
- `POST /feedback/create` - Submit feedback
- `DELETE /feedback/delete/:id` - Delete feedback

#### **Trainer Ratings**
- `GET /trainerrate/list` - Get all ratings
- `POST /trainerrate/create` - Submit rating
- `DELETE /trainerrate/delete/:id` - Delete rating

---

## 🚀 Deployment

### Deploying Backend

#### Option 1: Heroku
1. Install Heroku CLI
2. Create Heroku app:
   ```bash
   heroku create gym-management-api
   ```
3. Add MySQL addon:
   ```bash
   heroku addons:create jawsdb:kitefin
   ```
4. Set environment variables:
   ```bash
   heroku config:set JWT_SECRET=your_secret
   ```
5. Deploy:
   ```bash
   git push heroku main
   ```

#### Option 2: AWS EC2
1. Launch Ubuntu EC2 instance
2. Install Node.js and MySQL
3. Clone repository
4. Setup environment variables
5. Use PM2 for process management:
   ```bash
   npm install -g pm2
   pm2 start index.js --name gym-backend
   ```

### Deploying Frontend

#### Option 1: Vercel
1. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```
2. Deploy:
   ```bash
   cd megapower-react-app
   vercel
   ```

#### Option 2: Netlify
1. Build the app:
   ```bash
   npm run build
   ```
2. Drag and drop `build` folder to Netlify

#### Option 3: GitHub Pages
```bash
npm install gh-pages --save-dev
npm run build
npm run deploy
```

---

## 🔐 Security Best Practices

1. **Never commit `.env` files** - Add to `.gitignore`
2. **Use strong JWT secrets** - At least 32 characters
3. **Enable HTTPS in production** - Use SSL certificates
4. **Implement rate limiting** - Prevent brute force attacks
5. **Validate all inputs** - Prevent SQL injection
6. **Keep dependencies updated** - Run `npm audit` regularly
7. **Use environment-specific configs** - Different secrets for dev/prod
8. **Implement proper CORS** - Only allow trusted origins
9. **Hash passwords** - Use bcrypt with salt rounds ≥ 10
10. **Regular database backups** - Automate backup process

---

## 📞 Support & Contact

### Project Information
- **Name**: Mega Power Gym Management System
- **Version**: 1.0.0
- **Author**: K. Janith Chanuka
- **Repository**: https://github.com/VihiThejan/Gym-Managemnt

### Contact
- **Email**: info@megapowergym.com
- **Phone**: +94 77 123 4567

### Reporting Issues
1. Check existing issues on GitHub
2. Create detailed bug report with:
   - Steps to reproduce
   - Expected vs actual behavior
   - Screenshots (if applicable)
   - Environment details

---

## 📝 Additional Resources

### Documentation
- [React Documentation](https://react.dev/)
- [Ant Design Components](https://ant.design/components/overview/)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Express.js Guide](https://expressjs.com/)
- [MySQL Documentation](https://dev.mysql.com/doc/)

### Tutorials
- [React Router Tutorial](https://reactrouter.com/en/main/start/tutorial)
- [JWT Authentication](https://jwt.io/introduction)
- [RESTful API Design](https://restfulapi.net/)

---

## ✅ Checklist for New Setup

- [ ] Node.js installed (v14+)
- [ ] MySQL installed and running
- [ ] Repository cloned
- [ ] Backend dependencies installed
- [ ] Frontend dependencies installed
- [ ] Database created using setup script
- [ ] `.env` file configured in Backend
- [ ] JWT secret generated
- [ ] Backend server starts successfully
- [ ] Frontend server starts successfully
- [ ] Can access frontend at localhost:3000
- [ ] Can access backend API at localhost:5000
- [ ] Test login functionality
- [ ] Database connection working

---

## 🎉 You're All Set!

Your Mega Power Gym Management System is now ready to use!

**Default Access:**
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000/api/v1

**Sample Credentials:**
- Admin: `admin` / (hashed password)
- Staff: `johntrainer` / (hashed password)
- Member: `janemember` / (hashed password)

*Note: Update passwords after first login for security*

---

**Last Updated**: October 26, 2025  
**Version**: 1.0.0  
**License**: Copyright © 2025 Mega Power Gym
