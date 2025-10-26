-- ============================================================
-- Gym Management System - Database Setup Script
-- ============================================================
-- This script creates the database and all required tables
-- for the Gym Management System on a new device
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
  `UserName` VARCHAR(255) NOT NULL,
  `Contact` VARCHAR(255),
  PRIMARY KEY (`User_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- Table: staffmember
-- Description: Staff members (trainers, cashiers, etc.)
-- ============================================================
CREATE TABLE `staffmember` (
  `Staff_ID` INT NOT NULL AUTO_INCREMENT,
  `FName` VARCHAR(255) NOT NULL,
  `DOB` DATETIME NOT NULL,
  `Address` VARCHAR(255) NOT NULL,
  `Gender` VARCHAR(50) NOT NULL,
  `Contact_No` VARCHAR(100) NOT NULL,
  `Email` VARCHAR(255) NOT NULL,
  `Job_Role` VARCHAR(100) NOT NULL,
  `UName` VARCHAR(255) NOT NULL,
  `Password` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`Staff_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- Table: member
-- Description: Gym members
-- ============================================================
CREATE TABLE `member` (
  `Member_Id` INT NOT NULL AUTO_INCREMENT,
  `FName` VARCHAR(255) NOT NULL,
  `DOB` DATETIME NOT NULL,
  `Gender` VARCHAR(50) NOT NULL,
  `Email` VARCHAR(255) NOT NULL,
  `Address` VARCHAR(255) NOT NULL,
  `Contact` VARCHAR(100) NOT NULL,
  `Package` VARCHAR(100) NOT NULL,
  `Weight` FLOAT NOT NULL,
  `Height` FLOAT NOT NULL,
  `UName` VARCHAR(255) NOT NULL,
  `Password` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`Member_Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- Table: announcement
-- Description: Announcements posted by admin
-- ============================================================
CREATE TABLE `announcement` (
  `Announcement_ID` INT NOT NULL AUTO_INCREMENT,
  `Staff_ID` INT NOT NULL,
  `Message` TEXT NOT NULL,
  `Date_Time` DATETIME NOT NULL,
  PRIMARY KEY (`Announcement_ID`),
  INDEX `Announcement_User_ID_fkey` (`Staff_ID`),
  CONSTRAINT `Announcement_User_ID_fkey` FOREIGN KEY (`Staff_ID`) REFERENCES `admin` (`User_ID`) ON DELETE RESTRICT ON UPDATE CASCADE
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
  PRIMARY KEY (`App_ID`),
  INDEX `Appointment_Member_Id_fkey` (`Member_Id`),
  INDEX `Appointment_Staff_ID_fkey` (`Staff_ID`),
  CONSTRAINT `Appointment_Member_Id_fkey` FOREIGN KEY (`Member_Id`) REFERENCES `member` (`Member_Id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `Appointment_Staff_ID_fkey` FOREIGN KEY (`Staff_ID`) REFERENCES `staffmember` (`Staff_ID`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- Table: attendance
-- Description: Member attendance records
-- ============================================================
CREATE TABLE `attendance` (
  `Attendance_ID` INT NOT NULL AUTO_INCREMENT,
  `Member_Id` INT NOT NULL,
  `Current_date` DATETIME NOT NULL,
  `In_time` DATETIME NOT NULL,
  `Out_time` DATETIME NOT NULL,
  PRIMARY KEY (`Attendance_ID`),
  INDEX `Attendance_User_ID_fkey` (`Member_Id`),
  CONSTRAINT `Attendance_User_ID_fkey` FOREIGN KEY (`Member_Id`) REFERENCES `admin` (`User_ID`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- Table: chat
-- Description: Chat messages in the system
-- ============================================================
CREATE TABLE `chat` (
  `Chat_ID` INT NOT NULL AUTO_INCREMENT,
  `User_ID` INT NOT NULL,
  `Message` TEXT NOT NULL,
  `Date` DATETIME NOT NULL,
  `Time` DATETIME NOT NULL,
  PRIMARY KEY (`Chat_ID`),
  INDEX `Chat_User_ID_fkey` (`User_ID`),
  CONSTRAINT `Chat_User_ID_fkey` FOREIGN KEY (`User_ID`) REFERENCES `admin` (`User_ID`) ON DELETE RESTRICT ON UPDATE CASCADE
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
  PRIMARY KEY (`Equipment_Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- Table: feedback
-- Description: Member feedback
-- ============================================================
CREATE TABLE `feedback` (
  `Feedback_ID` INT NOT NULL AUTO_INCREMENT,
  `Member_Id` INT NOT NULL,
  `Message` TEXT NOT NULL,
  `Date` DATETIME NOT NULL,
  PRIMARY KEY (`Feedback_ID`),
  INDEX `Feedback_User_ID_fkey` (`Member_Id`),
  CONSTRAINT `Feedback_User_ID_fkey` FOREIGN KEY (`Member_Id`) REFERENCES `admin` (`User_ID`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- Table: payment
-- Description: Payment records
-- ============================================================
CREATE TABLE `payment` (
  `Payment_ID` INT NOT NULL AUTO_INCREMENT,
  `Member_Id` INT NOT NULL,
  `Package_ID` INT NOT NULL,
  `Amount` FLOAT NOT NULL,
  `Date` DATETIME NOT NULL,
  PRIMARY KEY (`Payment_ID`),
  INDEX `Payment_User_ID_fkey` (`Member_Id`),
  CONSTRAINT `Payment_User_ID_fkey` FOREIGN KEY (`Member_Id`) REFERENCES `admin` (`User_ID`) ON DELETE RESTRICT ON UPDATE CASCADE
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
  PRIMARY KEY (`Schedule_ID`),
  INDEX `Schedule_Staff_ID_fkey` (`Staff_ID`),
  CONSTRAINT `Schedule_Staff_ID_fkey` FOREIGN KEY (`Staff_ID`) REFERENCES `staffmember` (`Staff_ID`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- Table: trainer
-- Description: Trainer assignments to schedules
-- ============================================================
CREATE TABLE `trainer` (
  `Trainer_ID` INT NOT NULL AUTO_INCREMENT,
  `Schedule_ID` INT NOT NULL,
  PRIMARY KEY (`Trainer_ID`),
  INDEX `Trainer_Schedule_ID_fkey` (`Schedule_ID`),
  CONSTRAINT `Trainer_Schedule_ID_fkey` FOREIGN KEY (`Schedule_ID`) REFERENCES `schedule` (`Schedule_ID`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- Table: trainerrate
-- Description: Trainer ratings by members
-- ============================================================
CREATE TABLE `trainerrate` (
  `Rating_ID` INT NOT NULL AUTO_INCREMENT,
  `Staff_ID` INT NOT NULL,
  `Member_Id` INT NOT NULL,
  `Rating` INT NOT NULL,
  `Comment` TEXT,
  PRIMARY KEY (`Rating_ID`),
  INDEX `TrainerRate_Staff_ID_fkey` (`Staff_ID`),
  CONSTRAINT `TrainerRate_Member_Id_fkey` FOREIGN KEY (`Rating_ID`) REFERENCES `member` (`Member_Id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- Table: otp
-- Description: OTP verification codes
-- ============================================================
CREATE TABLE `otp` (
  `ID` INT NOT NULL AUTO_INCREMENT,
  `Contact` VARCHAR(45) NOT NULL,
  `Otp` INT NOT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- Table: users
-- Description: Users for messaging system
-- ============================================================
CREATE TABLE `users` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(255) NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- Table: messages
-- Description: Messages between users
-- ============================================================
CREATE TABLE `messages` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `sender_id` INT,
  `receiver_id` INT,
  `message` TEXT,
  `file_url` VARCHAR(255),
  `voice_url` VARCHAR(255),
  `timestamp` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `sender_id` (`sender_id`),
  INDEX `receiver_id` (`receiver_id`),
  CONSTRAINT `messages_ibfk_1` FOREIGN KEY (`sender_id`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `messages_ibfk_2` FOREIGN KEY (`receiver_id`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- Insert Sample Data (Optional)
-- ============================================================

-- Sample Admin User
INSERT INTO `admin` (`Name`, `Password`, `UserName`, `Contact`) VALUES
('Admin User', '$2b$10$abcdefghijklmnopqrstuv', 'admin', '0771234567');

-- Sample Staff Member
INSERT INTO `staffmember` (`FName`, `DOB`, `Address`, `Gender`, `Contact_No`, `Email`, `Job_Role`, `UName`, `Password`) VALUES
('John Trainer', '1990-01-15 00:00:00', '123 Main St, Colombo', 'Male', '0777654321', 'john@gym.com', 'Trainer', 'johntrainer', '$2b$10$abcdefghijklmnopqrstuv');

-- Sample Member
INSERT INTO `member` (`FName`, `DOB`, `Gender`, `Email`, `Address`, `Contact`, `Package`, `Weight`, `Height`, `UName`, `Password`) VALUES
('Jane Member', '1995-05-20 00:00:00', 'Female', 'jane@email.com', '456 Park Ave, Colombo', '0771112233', 'Premium', 60.5, 165.0, 'janemember', '$2b$10$abcdefghijklmnopqrstuv');

-- Sample Equipment
INSERT INTO `equipment` (`EName`, `Qty`, `Vendor`, `Description`, `Date`) VALUES
('Treadmill', 5, 'FitnessCo', 'Professional treadmill for cardio', '2024-01-01 00:00:00'),
('Dumbbells', 20, 'WeightPro', 'Set of various weight dumbbells', '2024-01-01 00:00:00'),
('Bench Press', 3, 'FitnessCo', 'Heavy duty bench press', '2024-01-01 00:00:00');

-- ============================================================
-- Database Setup Complete
-- ============================================================

SELECT 'Database setup completed successfully!' AS Status;
SELECT 'Total tables created: 16' AS Info;

-- Show all tables
SHOW TABLES;
