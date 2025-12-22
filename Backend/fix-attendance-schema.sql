-- Fix attendance table to use DATETIME instead of TIME for In_time and Out_time
USE gym_management;

-- Alter the table to change TIME to DATETIME
ALTER TABLE `attendance` 
  MODIFY COLUMN `In_time` DATETIME NOT NULL,
  MODIFY COLUMN `Out_time` DATETIME NULL;

-- Verify the changes
DESCRIBE `attendance`;

SELECT 'Attendance table schema updated successfully!' AS message;
