/*
  Warnings:

  - You are about to drop the `user` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE `user`;

-- CreateTable
CREATE TABLE `StaffMember` (
    `Staff_ID` INTEGER NOT NULL AUTO_INCREMENT,
    `FName` VARCHAR(191) NOT NULL,
    `DOB` DATETIME(3) NOT NULL,
    `Address` VARCHAR(191) NOT NULL,
    `Gender` VARCHAR(191) NOT NULL,
    `Contact_No` VARCHAR(191) NOT NULL,
    `Email` VARCHAR(191) NOT NULL,
    `Job_Role` VARCHAR(191) NOT NULL,
    `UName` VARCHAR(191) NOT NULL,
    `Password` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`Staff_ID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Admin` (
    `User_ID` INTEGER NOT NULL AUTO_INCREMENT,
    `Name` VARCHAR(191) NOT NULL,
    `Password` VARCHAR(191) NOT NULL,
    `UserName` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`User_ID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Attendance` (
    `Attendance_ID` INTEGER NOT NULL AUTO_INCREMENT,
    `User_ID` INTEGER NOT NULL,
    `Current_date` DATETIME(3) NOT NULL,
    `In_time` DATETIME(3) NOT NULL,
    `Out_time` DATETIME(3) NOT NULL,

    PRIMARY KEY (`Attendance_ID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Equipment` (
    `Equipment_Id` INTEGER NOT NULL AUTO_INCREMENT,
    `EName` VARCHAR(191) NOT NULL,
    `Qty` INTEGER NOT NULL,
    `Vendor` VARCHAR(191) NOT NULL,
    `Description` VARCHAR(191) NOT NULL,
    `Date` DATETIME(3) NOT NULL,
    `Staff_ID` INTEGER NOT NULL,

    PRIMARY KEY (`Equipment_Id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TrainerRate` (
    `Member_Id` INTEGER NOT NULL,
    `Staff_ID` INTEGER NOT NULL,
    `Rating` INTEGER NOT NULL,
    `Comment` VARCHAR(191) NULL,

    PRIMARY KEY (`Member_Id`, `Staff_ID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Schedule` (
    `Schedule_ID` INTEGER NOT NULL AUTO_INCREMENT,
    `Name` VARCHAR(191) NOT NULL,
    `Equipment` VARCHAR(191) NOT NULL,
    `Quantity` INTEGER NOT NULL,
    `Staff_ID` INTEGER NOT NULL,

    PRIMARY KEY (`Schedule_ID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Trainer` (
    `Trainer_ID` INTEGER NOT NULL AUTO_INCREMENT,
    `Schedule_ID` INTEGER NOT NULL,

    PRIMARY KEY (`Trainer_ID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Member` (
    `Member_Id` INTEGER NOT NULL AUTO_INCREMENT,
    `FName` VARCHAR(191) NOT NULL,
    `DOB` DATETIME(3) NOT NULL,
    `Gender` VARCHAR(191) NOT NULL,
    `Email` VARCHAR(191) NOT NULL,
    `Address` VARCHAR(191) NOT NULL,
    `Contact` VARCHAR(191) NOT NULL,
    `Progress_date` DATETIME(3) NULL,
    `Package` VARCHAR(191) NOT NULL,
    `Weight` DOUBLE NOT NULL,
    `Height` DOUBLE NOT NULL,
    `Status` VARCHAR(191) NOT NULL,
    `Attendance_count` INTEGER NOT NULL,
    `UName` VARCHAR(191) NOT NULL,
    `Password` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`Member_Id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Appointment` (
    `App_ID` INTEGER NOT NULL AUTO_INCREMENT,
    `Member_Id` INTEGER NOT NULL,
    `Staff_ID` INTEGER NOT NULL,
    `Date_and_Time` DATETIME(3) NOT NULL,
    `Contact` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`App_ID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Payment` (
    `Payment_ID` INTEGER NOT NULL AUTO_INCREMENT,
    `User_ID` INTEGER NOT NULL,
    `Package_ID` INTEGER NOT NULL,
    `Amount` DOUBLE NOT NULL,
    `Alert` BOOLEAN NOT NULL,

    PRIMARY KEY (`Payment_ID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Feedback` (
    `Feedback_ID` INTEGER NOT NULL AUTO_INCREMENT,
    `User_ID` INTEGER NOT NULL,
    `Name` VARCHAR(191) NOT NULL,
    `Date_and_Time` DATETIME(3) NOT NULL,
    `Message` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`Feedback_ID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Announcement` (
    `Announcement_ID` INTEGER NOT NULL AUTO_INCREMENT,
    `User_ID` INTEGER NOT NULL,
    `Date` DATETIME(3) NOT NULL,
    `Message` VARCHAR(191) NOT NULL,
    `Time` DATETIME(3) NOT NULL,

    PRIMARY KEY (`Announcement_ID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Chat` (
    `Chat_ID` INTEGER NOT NULL AUTO_INCREMENT,
    `User_ID` INTEGER NOT NULL,
    `Message` VARCHAR(191) NOT NULL,
    `Date` DATETIME(3) NOT NULL,
    `Time` DATETIME(3) NOT NULL,

    PRIMARY KEY (`Chat_ID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Attendance` ADD CONSTRAINT `Attendance_User_ID_fkey` FOREIGN KEY (`User_ID`) REFERENCES `Admin`(`User_ID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Equipment` ADD CONSTRAINT `Equipment_Staff_ID_fkey` FOREIGN KEY (`Staff_ID`) REFERENCES `StaffMember`(`Staff_ID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TrainerRate` ADD CONSTRAINT `TrainerRate_Member_Id_fkey` FOREIGN KEY (`Member_Id`) REFERENCES `Member`(`Member_Id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TrainerRate` ADD CONSTRAINT `TrainerRate_Staff_ID_fkey` FOREIGN KEY (`Staff_ID`) REFERENCES `StaffMember`(`Staff_ID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Schedule` ADD CONSTRAINT `Schedule_Staff_ID_fkey` FOREIGN KEY (`Staff_ID`) REFERENCES `StaffMember`(`Staff_ID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Trainer` ADD CONSTRAINT `Trainer_Schedule_ID_fkey` FOREIGN KEY (`Schedule_ID`) REFERENCES `Schedule`(`Schedule_ID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Appointment` ADD CONSTRAINT `Appointment_Member_Id_fkey` FOREIGN KEY (`Member_Id`) REFERENCES `Member`(`Member_Id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Appointment` ADD CONSTRAINT `Appointment_Staff_ID_fkey` FOREIGN KEY (`Staff_ID`) REFERENCES `StaffMember`(`Staff_ID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Payment` ADD CONSTRAINT `Payment_User_ID_fkey` FOREIGN KEY (`User_ID`) REFERENCES `Admin`(`User_ID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Feedback` ADD CONSTRAINT `Feedback_User_ID_fkey` FOREIGN KEY (`User_ID`) REFERENCES `Admin`(`User_ID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Announcement` ADD CONSTRAINT `Announcement_User_ID_fkey` FOREIGN KEY (`User_ID`) REFERENCES `Admin`(`User_ID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Chat` ADD CONSTRAINT `Chat_User_ID_fkey` FOREIGN KEY (`User_ID`) REFERENCES `Admin`(`User_ID`) ON DELETE RESTRICT ON UPDATE CASCADE;
