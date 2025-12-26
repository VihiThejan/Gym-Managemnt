-- ============================================================
-- Gym Management System - FIXED Database Setup Script
-- ============================================================
-- This script creates the database with corrected relationships
-- and all required tables for the Gym Management System
-- ============================================================

-- Create Database
DROP DATABASE IF EXISTS gym_management;
CREATE DATABASE gym_management CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE gym_management;

-- ============================================================
-- Table: admin
-- Description: Admin users who manage the gym system
-- ============================================================
CREATE TABLE `admin` (
  `User_ID` INT NOT NULL AUTO_INCREMENT,
  `Name` VARCHAR(255) NOT NULL,
  `Password` VARCHAR(255) NOT NULL,
  `UserName` VARCHAR(255) NOT NULL UNIQUE,
  `Contact` VARCHAR(255),
  `Email` VARCHAR(255),
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`User_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- Table: member
-- Description: Gym members
-- ============================================================
CREATE TABLE `member` (
  `Member_Id` INT NOT NULL AUTO_INCREMENT,
  `FName` VARCHAR(255) NOT NULL,
  `LName` VARCHAR(255),
  `DOB` DATETIME NOT NULL,
  `Gender` VARCHAR(50) NOT NULL,
  `Email` VARCHAR(255) NOT NULL UNIQUE,
  `Address` VARCHAR(255) NOT NULL,
  `Contact` VARCHAR(100) NOT NULL,
  `Package` VARCHAR(100) NOT NULL,
  `Weight` FLOAT NOT NULL,
  `Height` FLOAT NOT NULL,
  `UName` VARCHAR(255) NOT NULL UNIQUE,
  `Password` VARCHAR(255) NOT NULL,
  `Status` VARCHAR(50) DEFAULT 'Active',
  `Registration_Date` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`Member_Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- Table: staffmember
-- Description: Staff members (trainers, cashiers, etc.)
-- ============================================================
CREATE TABLE `staffmember` (
  `Staff_ID` INT NOT NULL AUTO_INCREMENT,
  `FName` VARCHAR(255) NOT NULL,
  `LName` VARCHAR(255),
  `DOB` DATETIME NOT NULL,
  `Address` VARCHAR(255) NOT NULL,
  `Gender` VARCHAR(50) NOT NULL,
  `Contact_No` VARCHAR(100) NOT NULL,
  `Email` VARCHAR(255) NOT NULL UNIQUE,
  `Job_Role` VARCHAR(100) NOT NULL,
  `UName` VARCHAR(255) NOT NULL UNIQUE,
  `Password` VARCHAR(255) NOT NULL,
  `Status` VARCHAR(50) DEFAULT 'Active',
  `Salary` DECIMAL(10,2),
  `Hire_Date` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`Staff_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- Table: announcement
-- Description: Announcements posted by admin/staff
-- ============================================================
CREATE TABLE `announcement` (
  `Announcement_ID` INT NOT NULL AUTO_INCREMENT,
  `Staff_ID` INT NOT NULL,
  `Message` TEXT NOT NULL,
  `Title` VARCHAR(255),
  `Date_Time` DATETIME NOT NULL,
  `Status` VARCHAR(50) DEFAULT 'Active',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`Announcement_ID`),
  INDEX `idx_staff_id` (`Staff_ID`),
  INDEX `idx_date_time` (`Date_Time`),
  CONSTRAINT `fk_announcement_staff` FOREIGN KEY (`Staff_ID`) REFERENCES `staffmember` (`Staff_ID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- Table: appointment
-- Description: Appointments between members and staff
-- ============================================================
CREATE TABLE `appointment` (
  `App_ID` INT NOT NULL AUTO_INCREMENT,
  `Member_Id` INT NOT NULL,
  `Staff_ID` INT NOT NULL,
  `Date_and_Time` DATETIME NOT NULL,
  `Contact` VARCHAR(100) NOT NULL,
  `Purpose` VARCHAR(255),
  `Status` VARCHAR(50) DEFAULT 'Scheduled',
  `Notes` TEXT,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`App_ID`),
  INDEX `idx_member_id` (`Member_Id`),
  INDEX `idx_staff_id` (`Staff_ID`),
  INDEX `idx_date_time` (`Date_and_Time`),
  CONSTRAINT `fk_appointment_member` FOREIGN KEY (`Member_Id`) REFERENCES `member` (`Member_Id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_appointment_staff` FOREIGN KEY (`Staff_ID`) REFERENCES `staffmember` (`Staff_ID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- Table: attendance
-- Description: Member attendance records (FIXED: Now references member table)
-- ============================================================
CREATE TABLE `attendance` (
  `Attendance_ID` INT NOT NULL AUTO_INCREMENT,
  `Member_Id` INT NOT NULL,
  `Current_date` DATE NOT NULL,
  `In_time` DATETIME NOT NULL,
  `Out_time` DATETIME,
  `Duration_Minutes` INT,
  `Notes` TEXT,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`Attendance_ID`),
  INDEX `idx_member_id` (`Member_Id`),
  INDEX `idx_date` (`Current_date`),
  CONSTRAINT `fk_attendance_member` FOREIGN KEY (`Member_Id`) REFERENCES `member` (`Member_Id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- Table: equipment
-- Description: Gym equipment inventory
-- ============================================================
CREATE TABLE `equipment` (
  `Equipment_Id` INT NOT NULL AUTO_INCREMENT,
  `EName` VARCHAR(255) NOT NULL,
  `Qty` INT NOT NULL,
  `Vendor` VARCHAR(255) NOT NULL,
  `Description` TEXT NOT NULL,
  `Date` DATETIME NOT NULL,
  `Purchase_Cost` DECIMAL(10,2),
  `Status` VARCHAR(50) DEFAULT 'Active',
  `Maintenance_Date` DATE,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`Equipment_Id`),
  INDEX `idx_name` (`EName`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- Table: feedback
-- Description: Member feedback (FIXED: Now references member table)
-- ============================================================
CREATE TABLE `feedback` (
  `Feedback_ID` INT NOT NULL AUTO_INCREMENT,
  `Member_Id` INT NOT NULL,
  `Message` TEXT NOT NULL,
  `Date` DATETIME NOT NULL,
  `Rating` INT,
  `Category` VARCHAR(100),
  `Status` VARCHAR(50) DEFAULT 'Pending',
  `Response` TEXT,
  `Response_Date` DATETIME,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`Feedback_ID`),
  INDEX `idx_member_id` (`Member_Id`),
  INDEX `idx_date` (`Date`),
  CONSTRAINT `fk_feedback_member` FOREIGN KEY (`Member_Id`) REFERENCES `member` (`Member_Id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- Table: payment
-- Description: Payment records (FIXED: Now references member table + added Status)
-- ============================================================
CREATE TABLE `payment` (
  `Payment_ID` INT NOT NULL AUTO_INCREMENT,
  `Member_Id` INT NOT NULL,
  `Package_ID` INT NOT NULL,
  `Amount` DECIMAL(10,2) NOT NULL,
  `Date` DATETIME NOT NULL,
  `Status` VARCHAR(50) DEFAULT 'Pending',
  `Payment_Method` VARCHAR(50),
  `Payment_Slip` VARCHAR(255),
  `Transaction_ID` VARCHAR(255),
  `Receipt_Number` VARCHAR(100),
  `Notes` TEXT,
  `Due_Date` DATE,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`Payment_ID`),
  INDEX `idx_member_id` (`Member_Id`),
  INDEX `idx_date` (`Date`),
  INDEX `idx_status` (`Status`),
  CONSTRAINT `fk_payment_member` FOREIGN KEY (`Member_Id`) REFERENCES `member` (`Member_Id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- Table: schedule
-- Description: Training schedules
-- ============================================================
CREATE TABLE `schedule` (
  `Schedule_ID` INT NOT NULL AUTO_INCREMENT,
  `Staff_ID` INT NOT NULL,
  `Member_ID` INT NOT NULL,
  `EName` VARCHAR(255) NOT NULL,
  `Equipment` VARCHAR(255) NOT NULL,
  `Quantity` INT NOT NULL,
  `Date_Time` DATETIME NOT NULL,
  `Duration_Minutes` INT,
  `Status` VARCHAR(50) DEFAULT 'Scheduled',
  `Notes` TEXT,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`Schedule_ID`),
  INDEX `idx_staff_id` (`Staff_ID`),
  INDEX `idx_member_id` (`Member_ID`),
  INDEX `idx_date_time` (`Date_Time`),
  CONSTRAINT `fk_schedule_staff` FOREIGN KEY (`Staff_ID`) REFERENCES `staffmember` (`Staff_ID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_schedule_member` FOREIGN KEY (`Member_ID`) REFERENCES `member` (`Member_Id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- Table: trainer
-- Description: Trainer assignments to schedules
-- ============================================================
CREATE TABLE `trainer` (
  `Trainer_ID` INT NOT NULL AUTO_INCREMENT,
  `Schedule_ID` INT NOT NULL,
  `Staff_ID` INT,
  `Notes` TEXT,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`Trainer_ID`),
  INDEX `idx_schedule_id` (`Schedule_ID`),
  INDEX `idx_staff_id` (`Staff_ID`),
  CONSTRAINT `fk_trainer_schedule` FOREIGN KEY (`Schedule_ID`) REFERENCES `schedule` (`Schedule_ID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_trainer_staff` FOREIGN KEY (`Staff_ID`) REFERENCES `staffmember` (`Staff_ID`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- Table: trainerrate
-- Description: Trainer ratings by members (FIXED: Corrected relationships)
-- ============================================================
CREATE TABLE `trainerrate` (
  `Rating_ID` INT NOT NULL AUTO_INCREMENT,
  `Staff_ID` INT NOT NULL,
  `Member_Id` INT NOT NULL,
  `Rating` INT NOT NULL CHECK (`Rating` >= 1 AND `Rating` <= 5),
  `Comment` TEXT,
  `Reply` TEXT,
  `Reply_Date` DATETIME,
  `Reply_By_Staff_ID` INT,
  `Date` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`Rating_ID`),
  INDEX `idx_staff_id` (`Staff_ID`),
  INDEX `idx_member_id` (`Member_Id`),
  INDEX `idx_reply_by` (`Reply_By_Staff_ID`),
  CONSTRAINT `fk_trainerrate_staff` FOREIGN KEY (`Staff_ID`) REFERENCES `staffmember` (`Staff_ID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_trainerrate_member` FOREIGN KEY (`Member_Id`) REFERENCES `member` (`Member_Id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_trainerrate_reply_staff` FOREIGN KEY (`Reply_By_Staff_ID`) REFERENCES `staffmember` (`Staff_ID`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- Table: workouts
-- Description: Member workout sessions
-- ============================================================
CREATE TABLE `workouts` (
  `Workout_ID` INT NOT NULL AUTO_INCREMENT,
  `Member_Id` INT NOT NULL,
  `Workout_Date` DATE NOT NULL,
  `Workout_Time` TIME NOT NULL,
  `Total_Duration_Minutes` INT,
  `Total_Calories` INT,
  `Notes` TEXT,
  `Status` VARCHAR(50) DEFAULT 'Completed',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`Workout_ID`),
  INDEX `idx_member_id` (`Member_Id`),
  INDEX `idx_date` (`Workout_Date`),
  CONSTRAINT `fk_workouts_member` FOREIGN KEY (`Member_Id`) REFERENCES `member` (`Member_Id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- Table: workout_exercises
-- Description: Individual exercises logged in workout sessions
-- ============================================================
CREATE TABLE `workout_exercises` (
  `Exercise_ID` INT NOT NULL AUTO_INCREMENT,
  `Workout_ID` INT NOT NULL,
  `Exercise_Name` VARCHAR(255) NOT NULL,
  `Category` VARCHAR(100) NOT NULL,
  `Sets` INT,
  `Reps` INT,
  `Weight` DECIMAL(10,2),
  `Duration_Minutes` INT,
  `Calories_Burned` INT,
  `Distance` DECIMAL(10,2),
  `Notes` TEXT,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`Exercise_ID`),
  INDEX `idx_workout_id` (`Workout_ID`),
  INDEX `idx_exercise_name` (`Exercise_Name`),
  INDEX `idx_category` (`Category`),
  CONSTRAINT `fk_exercises_workout` FOREIGN KEY (`Workout_ID`) REFERENCES `workouts` (`Workout_ID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- Table: personal_records
-- Description: Member personal records for exercises
-- ============================================================
CREATE TABLE `personal_records` (
  `PR_ID` INT NOT NULL AUTO_INCREMENT,
  `Member_Id` INT NOT NULL,
  `Exercise_Name` VARCHAR(255) NOT NULL,
  `Category` VARCHAR(100) NOT NULL,
  `Max_Weight` DECIMAL(10,2),
  `Max_Reps` INT,
  `Max_Distance` DECIMAL(10,2),
  `Best_Time_Minutes` INT,
  `Achievement_Date` DATE NOT NULL,
  `Workout_ID` INT,
  `Notes` TEXT,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`PR_ID`),
  INDEX `idx_member_id` (`Member_Id`),
  INDEX `idx_exercise_name` (`Exercise_Name`),
  INDEX `idx_category` (`Category`),
  UNIQUE KEY `unique_member_exercise` (`Member_Id`, `Exercise_Name`),
  CONSTRAINT `fk_pr_member` FOREIGN KEY (`Member_Id`) REFERENCES `member` (`Member_Id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_pr_workout` FOREIGN KEY (`Workout_ID`) REFERENCES `workouts` (`Workout_ID`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- Table: chat
-- ============================================================
-- Table: chat
-- Description: Legacy chat table (deprecated - use messages table instead)
-- Note: Kept for backward compatibility with old Prisma schema
-- ============================================================
CREATE TABLE `chat` (
  `Chat_ID` INT NOT NULL AUTO_INCREMENT,
  `User_ID` INT NOT NULL,
  `User_Type` VARCHAR(50) NOT NULL,
  `Message` TEXT NOT NULL,
  `Date` DATE NOT NULL,
  `Time` TIME NOT NULL,
  `Room_ID` VARCHAR(100),
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`Chat_ID`),
  INDEX `idx_user_id` (`User_ID`),
  INDEX `idx_date_time` (`Date`, `Time`),
  INDEX `idx_room` (`Room_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Legacy table - use messages table for new implementation';

-- ============================================================
-- Table: otp
-- Description: OTP verification codes for password reset
-- ============================================================
CREATE TABLE `otp` (
  `ID` INT NOT NULL AUTO_INCREMENT,
  `Contact` VARCHAR(45) NOT NULL,
  `Email` VARCHAR(255),
  `Otp` VARCHAR(10) NOT NULL,
  `User_Type` VARCHAR(50),
  `Expires_At` DATETIME NOT NULL,
  `Is_Used` BOOLEAN DEFAULT FALSE,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`ID`),
  INDEX `idx_contact` (`Contact`),
  INDEX `idx_email` (`Email`),
  INDEX `idx_expires` (`Expires_At`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- Table: users (for messaging system)
-- Description: Users for real-time chat/messaging
-- ============================================================
CREATE TABLE `users` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(255) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255),
  `user_type` VARCHAR(50),
  `reference_id` INT,
  `status` VARCHAR(50) DEFAULT 'Active',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_username` (`username`),
  INDEX `idx_user_type_ref` (`user_type`, `reference_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- Table: messages
-- Description: Messages between users in chat system
-- Note: sender_id and receiver_id can reference Member_Id, Staff_ID, or User_ID
--       No foreign key constraints to allow flexibility across user types
-- ============================================================
CREATE TABLE `messages` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `sender_id` INT NOT NULL,
  `receiver_id` INT NOT NULL,
  `message` TEXT,
  `file_url` VARCHAR(255),
  `voice_url` VARCHAR(255),
  `message_type` VARCHAR(50) DEFAULT 'text',
  `is_read` BOOLEAN DEFAULT FALSE,
  `timestamp` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_sender` (`sender_id`),
  INDEX `idx_receiver` (`receiver_id`),
  INDEX `idx_timestamp` (`timestamp`),
  INDEX `idx_conversation` (`sender_id`, `receiver_id`, `timestamp`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- Table: packages
-- Description: Membership packages available
-- ============================================================
CREATE TABLE `packages` (
  `Package_ID` INT NOT NULL AUTO_INCREMENT,
  `Package_Name` VARCHAR(100) NOT NULL,
  `Duration_Months` INT NOT NULL,
  `Price` DECIMAL(10,2) NOT NULL,
  `Description` TEXT,
  `Features` TEXT,
  `Status` VARCHAR(50) DEFAULT 'Active',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`Package_ID`),
  INDEX `idx_status` (`Status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- Table: sessions
-- Description: User sessions for authentication
-- ============================================================
CREATE TABLE `sessions` (
  `Session_ID` INT NOT NULL AUTO_INCREMENT,
  `User_ID` INT NOT NULL,
  `User_Type` VARCHAR(50) NOT NULL,
  `Token` VARCHAR(500) NOT NULL,
  `IP_Address` VARCHAR(45),
  `User_Agent` VARCHAR(255),
  `Expires_At` DATETIME NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`Session_ID`),
  INDEX `idx_token` (`Token`(255)),
  INDEX `idx_user_type_id` (`User_Type`, `User_ID`),
  INDEX `idx_expires` (`Expires_At`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- Table: audit_log
-- Description: Audit trail for important system actions
-- ============================================================
CREATE TABLE `audit_log` (
  `Log_ID` INT NOT NULL AUTO_INCREMENT,
  `User_ID` INT,
  `User_Type` VARCHAR(50),
  `Action` VARCHAR(255) NOT NULL,
  `Table_Name` VARCHAR(100),
  `Record_ID` INT,
  `Old_Values` TEXT,
  `New_Values` TEXT,
  `IP_Address` VARCHAR(45),
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`Log_ID`),
  INDEX `idx_user_type_id` (`User_Type`, `User_ID`),
  INDEX `idx_action` (`Action`),
  INDEX `idx_table` (`Table_Name`),
  INDEX `idx_created` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- Insert Sample Data
-- ============================================================

-- Sample Admin User (password: Admin@123)
INSERT INTO `admin` (`Name`, `Password`, `UserName`, `Contact`, `Email`) VALUES
('System Admin', '$2b$10$rF8YJZJzEp5vKHmZIJUO7ePPqMKlQkYhVx8xGxJyGfQzXJYqJYqJY', 'admin', '0771234567', 'admin@megapowergym.com');

-- Sample Staff Members (password: Staff@123)
INSERT INTO `staffmember` (`FName`, `LName`, `DOB`, `Address`, `Gender`, `Contact_No`, `Email`, `Job_Role`, `UName`, `Password`, `Salary`, `Hire_Date`) VALUES
('John', 'Trainer', '1990-01-15 00:00:00', '123 Main St, Colombo', 'Male', '0777654321', 'john.trainer@megapowergym.com', 'Trainer', 'johntrainer', '$2b$10$rF8YJZJzEp5vKHmZIJUO7ePPqMKlQkYhVx8xGxJyGfQzXJYqJYqJY', 50000.00, '2024-01-01 00:00:00'),
('Sarah', 'Instructor', '1992-03-20 00:00:00', '456 Park Ave, Colombo', 'Female', '0777654322', 'sarah.instructor@megapowergym.com', 'Trainer', 'sarahinstructor', '$2b$10$rF8YJZJzEp5vKHmZIJUO7ePPqMKlQkYhVx8xGxJyGfQzXJYqJYqJY', 48000.00, '2024-02-01 00:00:00'),
('Mike', 'Reception', '1988-07-10 00:00:00', '789 Lake Rd, Colombo', 'Male', '0777654323', 'mike.reception@megapowergym.com', 'Receptionist', 'mikereception', '$2b$10$rF8YJZJzEp5vKHmZIJUO7ePPqMKlQkYhVx8xGxJyGfQzXJYqJYqJY', 35000.00, '2024-01-15 00:00:00');

-- Sample Members (password: Member@123)
INSERT INTO `member` (`FName`, `LName`, `DOB`, `Gender`, `Email`, `Address`, `Contact`, `Package`, `Weight`, `Height`, `UName`, `Password`, `Registration_Date`) VALUES
('Jane', 'Smith', '1995-05-20 00:00:00', 'Female', 'jane.smith@email.com', '456 Park Ave, Colombo', '0771112233', 'Premium', 60.5, 165.0, 'janesmith', '$2b$10$rF8YJZJzEp5vKHmZIJUO7ePPqMKlQkYhVx8xGxJyGfQzXJYqJYqJY', '2024-01-10 00:00:00'),
('David', 'Johnson', '1993-08-15 00:00:00', 'Male', 'david.johnson@email.com', '789 Ocean Blvd, Colombo', '0771112234', 'Gold', 75.0, 180.0, 'davidjohnson', '$2b$10$rF8YJZJzEp5vKHmZIJUO7ePPqMKlQkYhVx8xGxJyGfQzXJYqJYqJY', '2024-01-15 00:00:00'),
('Emily', 'Brown', '1997-11-25 00:00:00', 'Female', 'emily.brown@email.com', '321 Hill St, Colombo', '0771112235', 'Silver', 55.0, 160.0, 'emilybrown', '$2b$10$rF8YJZJzEp5vKHmZIJUO7ePPqMKlQkYhVx8xGxJyGfQzXJYqJYqJY', '2024-02-01 00:00:00');

-- Sample Packages
INSERT INTO `packages` (`Package_Name`, `Duration_Months`, `Price`, `Description`, `Features`) VALUES
('Silver', 1, 5000.00, 'Basic monthly package', 'Access to gym equipment, Basic facilities'),
('Gold', 3, 14000.00, '3-month package with trainer support', 'Access to gym equipment, Personal trainer (2 sessions/week), Nutrition guidance'),
('Premium', 6, 25000.00, '6-month premium package', 'Access to gym equipment, Personal trainer (4 sessions/week), Nutrition plan, Group classes'),
('Platinum', 12, 45000.00, 'Annual platinum membership', 'All Premium features, Priority booking, Guest passes, Locker facility');

-- Sample Equipment
INSERT INTO `equipment` (`EName`, `Qty`, `Vendor`, `Description`, `Date`, `Purchase_Cost`, `Maintenance_Date`) VALUES
('Treadmill', 5, 'Big Bosa Gym Fitness Equipment', 'Professional treadmill for cardio exercises', '2024-01-01 00:00:00', 150000.00, '2024-07-01'),
('Dumbbell', 20, 'Eser Marketing International', 'Set of various weight dumbbells (5kg to 50kg)', '2024-01-01 00:00:00', 80000.00, '2024-06-01'),
('Bench', 3, 'GS Sports', 'Heavy duty bench press with safety bars', '2024-01-01 00:00:00', 75000.00, '2024-08-01'),
('Cable Machine', 2, 'Mansa Fitness Equipment', 'Multi-function cable machine', '2024-01-15 00:00:00', 200000.00, '2024-07-15'),
('Leg Press Machines', 2, 'Big Bosa Gym Fitness Equipment', 'Professional leg press equipment', '2024-01-20 00:00:00', 180000.00, '2024-07-20'),
('Rowing Machine', 3, 'Eser Marketing International', 'Indoor rowing machine for cardio', '2024-02-01 00:00:00', 120000.00, '2024-08-01');

-- Sample Payments
INSERT INTO `payment` (`Member_Id`, `Package_ID`, `Amount`, `Date`, `Status`, `Payment_Method`, `Receipt_Number`) VALUES
(1, 3, 25000.00, '2024-01-10 10:00:00', 'Completed', 'Cash', 'REC-2024-001'),
(2, 2, 14000.00, '2024-01-15 11:30:00', 'Completed', 'Card', 'REC-2024-002'),
(3, 1, 5000.00, '2024-02-01 09:00:00', 'Completed', 'Online', 'REC-2024-003'),
(1, 3, 25000.00, '2024-06-10 10:00:00', 'Pending', 'Cash', 'REC-2024-004');

-- Sample Attendance Records
INSERT INTO `attendance` (`Member_Id`, `Current_date`, `In_time`, `Out_time`, `Duration_Minutes`) VALUES
(1, '2024-06-01', '2024-06-01 07:00:00', '2024-06-01 09:00:00', 120),
(2, '2024-06-01', '2024-06-01 08:00:00', '2024-06-01 10:30:00', 150),
(3, '2024-06-01', '2024-06-01 18:00:00', '2024-06-01 20:00:00', 120),
(1, '2024-06-02', '2024-06-02 07:15:00', '2024-06-02 09:15:00', 120),
(2, '2024-06-02', '2024-06-02 08:30:00', '2024-06-02 10:30:00', 120);

-- Sample Announcements
INSERT INTO `announcement` (`Staff_ID`, `Message`, `Title`, `Date_Time`) VALUES
(1, 'The gym will be closed on public holidays. Please plan your workouts accordingly.', 'Holiday Notice', '2024-06-01 08:00:00'),
(2, 'New yoga classes starting next week! Sign up at reception.', 'New Classes Available', '2024-06-05 10:00:00'),
(1, 'Maintenance work scheduled for next Sunday. Limited equipment available.', 'Maintenance Notice', '2024-06-10 09:00:00');

-- Sample Appointments
INSERT INTO `appointment` (`Member_Id`, `Staff_ID`, `Date_and_Time`, `Contact`, `Purpose`, `Status`) VALUES
(1, 1, '2024-06-15 10:00:00', '0771112233', 'Personal Training Session', 'Scheduled'),
(2, 2, '2024-06-16 14:00:00', '0771112234', 'Fitness Consultation', 'Scheduled'),
(3, 1, '2024-06-17 09:00:00', '0771112235', 'Workout Plan Discussion', 'Scheduled');

-- Sample Schedules
INSERT INTO `schedule` (`Staff_ID`, `Member_ID`, `EName`, `Equipment`, `Quantity`, `Date_Time`, `Duration_Minutes`, `Status`) VALUES
(1, 1, 'Cardio Workout', 'Treadmill', 1, '2024-06-15 10:00:00', 60, 'Scheduled'),
(1, 2, 'Strength Training', 'Bench', 1, '2024-06-16 14:00:00', 90, 'Scheduled'),
(2, 3, 'Full Body Workout', 'Cable Machine', 1, '2024-06-17 09:00:00', 75, 'Scheduled');

-- Sample Trainer Ratings
INSERT INTO `trainerrate` (`Staff_ID`, `Member_Id`, `Rating`, `Comment`, `Date`) VALUES
(1, 1, 5, 'Excellent trainer! Very professional and motivating.', '2024-06-05 00:00:00'),
(1, 2, 4, 'Great sessions, learned a lot about proper form.', '2024-06-06 00:00:00'),
(2, 3, 5, 'Amazing instructor! Very patient and knowledgeable.', '2024-06-07 00:00:00');

-- Sample Feedback
INSERT INTO `feedback` (`Member_Id`, `Message`, `Date`, `Rating`, `Category`, `Status`) VALUES
(1, 'The gym facilities are excellent. Very clean and well-maintained.', '2024-06-01 00:00:00', 5, 'Facilities', 'Reviewed'),
(2, 'Would love to see more cardio equipment during peak hours.', '2024-06-03 00:00:00', 4, 'Equipment', 'Pending'),
(3, 'Staff is very friendly and helpful. Great experience overall!', '2024-06-05 00:00:00', 5, 'Service', 'Reviewed');

-- Sample Workouts
INSERT INTO `workouts` (`Member_Id`, `Workout_Date`, `Workout_Time`, `Total_Duration_Minutes`, `Total_Calories`, `Notes`) VALUES
(1, '2024-12-01', '07:00:00', 60, 450, 'Great morning cardio session'),
(1, '2024-12-02', '07:15:00', 75, 520, 'Strength training day'),
(1, '2024-12-03', '18:00:00', 45, 380, 'Evening HIIT workout'),
(2, '2024-12-01', '08:00:00', 90, 650, 'Full body workout'),
(2, '2024-12-04', '08:30:00', 60, 480, 'Upper body focus'),
(3, '2024-12-02', '19:00:00', 50, 420, 'Yoga and flexibility');

-- Sample Workout Exercises
INSERT INTO `workout_exercises` (`Workout_ID`, `Exercise_Name`, `Category`, `Sets`, `Reps`, `Weight`, `Duration_Minutes`, `Calories_Burned`) VALUES
(1, 'Running', 'Cardio', NULL, NULL, NULL, 30, 250),
(1, 'Cycling', 'Cardio', NULL, NULL, NULL, 30, 200),
(2, 'Bench Press', 'Strength', 4, 10, 80.0, NULL, 180),
(2, 'Squats', 'Strength', 4, 12, 100.0, NULL, 220),
(2, 'Deadlift', 'Strength', 3, 8, 120.0, NULL, 120),
(3, 'Burpees', 'HIIT', 5, 15, NULL, NULL, 180),
(3, 'Jump Rope', 'HIIT', NULL, NULL, NULL, 15, 200),
(4, 'Bench Press', 'Strength', 5, 8, 85.0, NULL, 200),
(4, 'Pull-ups', 'Strength', 4, 10, NULL, NULL, 150),
(4, 'Lunges', 'Strength', 3, 12, 40.0, NULL, 300),
(5, 'Shoulder Press', 'Strength', 4, 10, 50.0, NULL, 180),
(5, 'Bicep Curls', 'Strength', 3, 12, 30.0, NULL, 150),
(5, 'Tricep Dips', 'Strength', 3, 15, NULL, NULL, 150),
(6, 'Vinyasa Flow', 'Yoga', NULL, NULL, NULL, 50, 420);

-- Sample Personal Records
INSERT INTO `personal_records` (`Member_Id`, `Exercise_Name`, `Category`, `Max_Weight`, `Max_Reps`, `Achievement_Date`, `Workout_ID`) VALUES
(1, 'Bench Press', 'Strength', 80.0, 10, '2024-12-02', 2),
(1, 'Squats', 'Strength', 100.0, 12, '2024-12-02', 2),
(1, 'Deadlift', 'Strength', 120.0, 8, '2024-12-02', 2),
(2, 'Bench Press', 'Strength', 85.0, 8, '2024-12-04', 5),
(2, 'Pull-ups', 'Strength', NULL, 10, '2024-12-01', 4),
(2, 'Shoulder Press', 'Strength', 50.0, 10, '2024-12-04', 5);

-- ============================================================
-- Create Views for Common Queries
-- ============================================================

-- View: Active Members with Payment Status
CREATE VIEW `view_active_members` AS
SELECT 
    m.Member_Id,
    m.FName,
    m.LName,
    m.Email,
    m.Contact,
    m.Package,
    m.Status,
    m.Registration_Date,
    COALESCE(MAX(p.Date), m.Registration_Date) AS Last_Payment_Date,
    COALESCE(SUM(CASE WHEN p.Status = 'Completed' THEN p.Amount ELSE 0 END), 0) AS Total_Paid
FROM member m
LEFT JOIN payment p ON m.Member_Id = p.Member_Id
WHERE m.Status = 'Active'
GROUP BY m.Member_Id;

-- View: Staff Performance
CREATE VIEW `view_staff_performance` AS
SELECT 
    s.Staff_ID,
    s.FName,
    s.LName,
    s.Job_Role,
    s.Email,
    COUNT(DISTINCT a.App_ID) AS Total_Appointments,
    COUNT(DISTINCT sc.Schedule_ID) AS Total_Schedules,
    COALESCE(AVG(tr.Rating), 0) AS Average_Rating,
    COUNT(DISTINCT tr.Rating_ID) AS Total_Ratings
FROM staffmember s
LEFT JOIN appointment a ON s.Staff_ID = a.Staff_ID
LEFT JOIN schedule sc ON s.Staff_ID = sc.Staff_ID
LEFT JOIN trainerrate tr ON s.Staff_ID = tr.Staff_ID
WHERE s.Status = 'Active'
GROUP BY s.Staff_ID;

-- View: Monthly Revenue
CREATE VIEW `view_monthly_revenue` AS
SELECT 
    DATE_FORMAT(Date, '%Y-%m') AS Month,
    COUNT(DISTINCT Member_Id) AS Total_Members_Paid,
    COUNT(*) AS Total_Transactions,
    SUM(CASE WHEN Status = 'Completed' THEN Amount ELSE 0 END) AS Completed_Revenue,
    SUM(CASE WHEN Status = 'Pending' THEN Amount ELSE 0 END) AS Pending_Revenue,
    SUM(Amount) AS Total_Revenue
FROM payment
GROUP BY DATE_FORMAT(Date, '%Y-%m')
ORDER BY Month DESC;

-- View: Attendance Summary
CREATE VIEW `view_attendance_summary` AS
SELECT 
    m.Member_Id,
    m.FName,
    m.LName,
    m.Email,
    COUNT(*) AS Total_Visits,
    SUM(a.Duration_Minutes) AS Total_Minutes,
    AVG(a.Duration_Minutes) AS Avg_Duration_Minutes,
    MAX(a.Current_date) AS Last_Visit_Date
FROM member m
LEFT JOIN attendance a ON m.Member_Id = a.Member_Id
WHERE m.Status = 'Active'
GROUP BY m.Member_Id;

-- View: Member Workout Summary
CREATE VIEW `view_member_workout_summary` AS
SELECT 
    m.Member_Id,
    m.FName,
    m.LName,
    m.Email,
    COUNT(DISTINCT w.Workout_ID) AS Total_Workouts,
    COUNT(DISTINCT DATE_FORMAT(w.Workout_Date, '%Y-%m')) AS Active_Months,
    COALESCE(SUM(w.Total_Calories), 0) AS Total_Calories_Burned,
    COALESCE(AVG(w.Total_Duration_Minutes), 0) AS Avg_Workout_Duration,
    MAX(w.Workout_Date) AS Last_Workout_Date,
    COUNT(DISTINCT pr.PR_ID) AS Total_Personal_Records
FROM member m
LEFT JOIN workouts w ON m.Member_Id = w.Member_Id
LEFT JOIN personal_records pr ON m.Member_Id = pr.Member_Id
WHERE m.Status = 'Active'
GROUP BY m.Member_Id;

-- View: Exercise Popularity
CREATE VIEW `view_exercise_popularity` AS
SELECT 
    we.Exercise_Name,
    we.Category,
    COUNT(DISTINCT we.Workout_ID) AS Times_Performed,
    COUNT(DISTINCT w.Member_Id) AS Unique_Members,
    AVG(we.Weight) AS Avg_Weight,
    AVG(we.Reps) AS Avg_Reps,
    AVG(we.Duration_Minutes) AS Avg_Duration,
    SUM(we.Calories_Burned) AS Total_Calories
FROM workout_exercises we
JOIN workouts w ON we.Workout_ID = w.Workout_ID
GROUP BY we.Exercise_Name, we.Category
ORDER BY Times_Performed DESC;

-- ============================================================
-- Create Stored Procedures
-- ============================================================

-- Procedure: Get Dashboard Statistics
CREATE PROCEDURE `sp_get_dashboard_stats`()
BEGIN
    SELECT 
        (SELECT COUNT(*) FROM member WHERE Status = 'Active') AS total_members,
        (SELECT COUNT(*) FROM staffmember WHERE Status = 'Active') AS total_staff,
        (SELECT COUNT(*) FROM equipment WHERE Status = 'Active') AS total_equipment,
        (SELECT COALESCE(SUM(Amount), 0) FROM payment WHERE Status = 'Completed' 
            AND MONTH(Date) = MONTH(CURRENT_DATE()) AND YEAR(Date) = YEAR(CURRENT_DATE())) AS monthly_revenue,
        (SELECT COUNT(DISTINCT Member_Id) FROM attendance 
            WHERE `Current_date` = CURRENT_DATE()) AS today_attendance,
        (SELECT COUNT(*) FROM payment WHERE Status = 'Pending') AS pending_payments;
END;

-- Procedure: Register New Member
CREATE PROCEDURE `sp_register_member`(
    IN p_fname VARCHAR(255),
    IN p_lname VARCHAR(255),
    IN p_dob DATETIME,
    IN p_gender VARCHAR(50),
    IN p_email VARCHAR(255),
    IN p_address VARCHAR(255),
    IN p_contact VARCHAR(100),
    IN p_package VARCHAR(100),
    IN p_weight FLOAT,
    IN p_height FLOAT,
    IN p_username VARCHAR(255),
    IN p_password VARCHAR(255)
)
BEGIN
    DECLARE v_member_id INT;
    
    INSERT INTO member (FName, LName, DOB, Gender, Email, Address, Contact, Package, Weight, Height, UName, Password)
    VALUES (p_fname, p_lname, p_dob, p_gender, p_email, p_address, p_contact, p_package, p_weight, p_height, p_username, p_password);
    
    SET v_member_id = LAST_INSERT_ID();
    SELECT v_member_id AS Member_Id, 'Member registered successfully' AS Message;
END;

-- Procedure: Mark Attendance
CREATE PROCEDURE `sp_mark_attendance`(
    IN p_member_id INT,
    IN p_date DATE,
    IN p_in_time DATETIME,
    IN p_out_time DATETIME
)
BEGIN
    DECLARE v_duration INT;
    
    SET v_duration = TIMESTAMPDIFF(MINUTE, p_in_time, p_out_time);
    
    INSERT INTO attendance (Member_Id, `Current_date`, In_time, Out_time, Duration_Minutes)
    VALUES (p_member_id, p_date, p_in_time, p_out_time, v_duration);
    
    SELECT 'Attendance marked successfully' AS Message, v_duration AS Duration_Minutes;
END;

-- Procedure: Process Payment
CREATE PROCEDURE `sp_process_payment`(
    IN p_member_id INT,
    IN p_package_id INT,
    IN p_amount DECIMAL(10,2),
    IN p_method VARCHAR(50),
    IN p_transaction_id VARCHAR(255)
)
BEGIN
    DECLARE v_payment_id INT;
    DECLARE v_receipt_no VARCHAR(100);
    
    SET v_receipt_no = CONCAT('REC-', YEAR(CURRENT_DATE()), '-', 
        LPAD((SELECT COUNT(*) + 1 FROM payment), 4, '0'));
    
    INSERT INTO payment (Member_Id, Package_ID, Amount, Date, Status, Payment_Method, Transaction_ID, Receipt_Number)
    VALUES (p_member_id, p_package_id, p_amount, NOW(), 'Completed', p_method, p_transaction_id, v_receipt_no);
    
    SET v_payment_id = LAST_INSERT_ID();
    SELECT v_payment_id AS Payment_ID, v_receipt_no AS Receipt_Number, 'Payment processed successfully' AS Message;
END;

-- Procedure: Log Workout Session
CREATE PROCEDURE `sp_log_workout`(
    IN p_member_id INT,
    IN p_date DATE,
    IN p_time TIME,
    IN p_duration INT,
    IN p_calories INT,
    IN p_notes TEXT
)
BEGIN
    DECLARE v_workout_id INT;
    
    INSERT INTO workouts (Member_Id, Workout_Date, Workout_Time, Total_Duration_Minutes, Total_Calories, Notes)
    VALUES (p_member_id, p_date, p_time, p_duration, p_calories, p_notes);
    
    SET v_workout_id = LAST_INSERT_ID();
    SELECT v_workout_id AS Workout_ID, 'Workout logged successfully' AS Message;
END;

-- Procedure: Add Exercise to Workout
CREATE PROCEDURE `sp_add_exercise`(
    IN p_workout_id INT,
    IN p_exercise_name VARCHAR(255),
    IN p_category VARCHAR(100),
    IN p_sets INT,
    IN p_reps INT,
    IN p_weight DECIMAL(10,2),
    IN p_duration INT,
    IN p_calories INT,
    IN p_distance DECIMAL(10,2)
)
BEGIN
    DECLARE v_exercise_id INT;
    
    INSERT INTO workout_exercises (Workout_ID, Exercise_Name, Category, Sets, Reps, Weight, Duration_Minutes, Calories_Burned, Distance)
    VALUES (p_workout_id, p_exercise_name, p_category, p_sets, p_reps, p_weight, p_duration, p_calories, p_distance);
    
    SET v_exercise_id = LAST_INSERT_ID();
    
    -- Check if this is a new personal record
    CALL sp_check_personal_record(p_workout_id, v_exercise_id);
    
    SELECT v_exercise_id AS Exercise_ID, 'Exercise added successfully' AS Message;
END;

-- Procedure: Check and Update Personal Records
CREATE PROCEDURE `sp_check_personal_record`(
    IN p_workout_id INT,
    IN p_exercise_id INT
)
BEGIN
    DECLARE v_member_id INT;
    DECLARE v_exercise_name VARCHAR(255);
    DECLARE v_category VARCHAR(100);
    DECLARE v_weight DECIMAL(10,2);
    DECLARE v_reps INT;
    DECLARE v_distance DECIMAL(10,2);
    DECLARE v_duration INT;
    DECLARE v_date DATE;
    DECLARE v_current_pr_weight DECIMAL(10,2);
    DECLARE v_current_pr_reps INT;
    
    -- Get workout and exercise details
    SELECT w.Member_Id, w.Workout_Date, we.Exercise_Name, we.Category, we.Weight, we.Reps, we.Distance, we.Duration_Minutes
    INTO v_member_id, v_date, v_exercise_name, v_category, v_weight, v_reps, v_distance, v_duration
    FROM workout_exercises we
    JOIN workouts w ON we.Workout_ID = w.Workout_ID
    WHERE we.Exercise_ID = p_exercise_id;
    
    -- Check existing PR
    SELECT Max_Weight, Max_Reps INTO v_current_pr_weight, v_current_pr_reps
    FROM personal_records
    WHERE Member_Id = v_member_id AND Exercise_Name = v_exercise_name;
    
    -- Update or insert PR if new record achieved
    IF v_current_pr_weight IS NULL OR v_weight > v_current_pr_weight OR v_reps > v_current_pr_reps THEN
        INSERT INTO personal_records (Member_Id, Exercise_Name, Category, Max_Weight, Max_Reps, Max_Distance, Best_Time_Minutes, Achievement_Date, Workout_ID)
        VALUES (v_member_id, v_exercise_name, v_category, v_weight, v_reps, v_distance, v_duration, v_date, p_workout_id)
        ON DUPLICATE KEY UPDATE
            Max_Weight = GREATEST(Max_Weight, v_weight),
            Max_Reps = GREATEST(Max_Reps, v_reps),
            Max_Distance = GREATEST(COALESCE(Max_Distance, 0), COALESCE(v_distance, 0)),
            Best_Time_Minutes = LEAST(COALESCE(Best_Time_Minutes, 999999), COALESCE(v_duration, 999999)),
            Achievement_Date = v_date,
            Workout_ID = p_workout_id;
    END IF;
END;

-- ============================================================
-- Create Triggers
-- ============================================================

-- Trigger: Update member status based on payment
CREATE TRIGGER `trg_update_member_status_after_payment`
AFTER INSERT ON `payment`
FOR EACH ROW
BEGIN
    IF NEW.Status = 'Completed' THEN
        UPDATE member SET Status = 'Active' WHERE Member_Id = NEW.Member_Id;
    END IF;
END;

-- Trigger: Audit log for member updates
CREATE TRIGGER `trg_audit_member_update`
AFTER UPDATE ON `member`
FOR EACH ROW
BEGIN
    INSERT INTO audit_log (User_ID, User_Type, Action, Table_Name, Record_ID, Old_Values, New_Values)
    VALUES (
        NEW.Member_Id,
        'Member',
        'UPDATE',
        'member',
        NEW.Member_Id,
        CONCAT('Status: ', OLD.Status, ', Package: ', OLD.Package),
        CONCAT('Status: ', NEW.Status, ', Package: ', NEW.Package)
    );
END;

-- Trigger: Update workout totals when exercise is added
CREATE TRIGGER `trg_update_workout_totals`
AFTER INSERT ON `workout_exercises`
FOR EACH ROW
BEGIN
    UPDATE workouts
    SET Total_Calories = (
        SELECT COALESCE(SUM(Calories_Burned), 0)
        FROM workout_exercises
        WHERE Workout_ID = NEW.Workout_ID
    ),
    Total_Duration_Minutes = (
        SELECT COALESCE(SUM(Duration_Minutes), 0)
        FROM workout_exercises
        WHERE Workout_ID = NEW.Workout_ID
    )
    WHERE Workout_ID = NEW.Workout_ID;
END;

-- ============================================================
-- Create Indexes for Performance
-- ============================================================

-- Additional indexes for better query performance
CREATE INDEX idx_member_email ON member(Email);
CREATE INDEX idx_member_status ON member(Status);
CREATE INDEX idx_staff_email ON staffmember(Email);
CREATE INDEX idx_payment_status_date ON payment(Status, Date);
CREATE INDEX idx_attendance_member_date ON attendance(Member_Id, `Current_date`);
CREATE INDEX idx_appointment_datetime ON appointment(Date_and_Time);
CREATE INDEX idx_workout_member_date ON workouts(Member_Id, Workout_Date);
CREATE INDEX idx_exercise_workout ON workout_exercises(Workout_ID, Exercise_Name);
CREATE INDEX idx_pr_member_exercise ON personal_records(Member_Id, Exercise_Name);

-- ============================================================
-- Grant Permissions (Adjust as needed)
-- ============================================================

-- Create application user (uncomment and modify as needed)
-- CREATE USER IF NOT EXISTS 'gym_app'@'localhost' IDENTIFIED BY 'YourSecurePassword123!';
-- GRANT SELECT, INSERT, UPDATE, DELETE ON gym_management.* TO 'gym_app'@'localhost';
-- FLUSH PRIVILEGES;

-- ============================================================
-- Database Setup Complete
-- ============================================================

SELECT 'Database setup completed successfully!' AS Status;
SELECT 'Total tables created: 22' AS Info;
SELECT 'Total views created: 6' AS Info;
SELECT 'Total stored procedures created: 7' AS Info;
SELECT 'Total triggers created: 3' AS Info;

-- Show all tables
SHOW TABLES;

-- Show table counts
SELECT 
    'Admin' AS Entity, COUNT(*) AS Count FROM admin
UNION ALL
SELECT 'Members' AS Entity, COUNT(*) AS Count FROM member
UNION ALL
SELECT 'Staff' AS Entity, COUNT(*) AS Count FROM staffmember
UNION ALL
SELECT 'Equipment' AS Entity, COUNT(*) AS Count FROM equipment
UNION ALL
SELECT 'Payments' AS Entity, COUNT(*) AS Count FROM payment
UNION ALL
SELECT 'Attendance' AS Entity, COUNT(*) AS Count FROM attendance
UNION ALL
SELECT 'Announcements' AS Entity, COUNT(*) AS Count FROM announcement
UNION ALL
SELECT 'Appointments' AS Entity, COUNT(*) AS Count FROM appointment
UNION ALL
SELECT 'Schedules' AS Entity, COUNT(*) AS Count FROM schedule
UNION ALL
SELECT 'Packages' AS Entity, COUNT(*) AS Count FROM packages
UNION ALL
SELECT 'Workouts' AS Entity, COUNT(*) AS Count FROM workouts
UNION ALL
SELECT 'Workout Exercises' AS Entity, COUNT(*) AS Count FROM workout_exercises
UNION ALL
SELECT 'Personal Records' AS Entity, COUNT(*) AS Count FROM personal_records;
