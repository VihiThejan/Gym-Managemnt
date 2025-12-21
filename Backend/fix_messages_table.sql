-- Fix messages table by removing foreign key constraints
USE gym_management;

-- Drop existing foreign key constraints
ALTER TABLE `messages` DROP FOREIGN KEY IF EXISTS `messages_ibfk_1`;
ALTER TABLE `messages` DROP FOREIGN KEY IF EXISTS `messages_ibfk_2`;
ALTER TABLE `messages` DROP FOREIGN KEY IF EXISTS `fk_messages_sender`;
ALTER TABLE `messages` DROP FOREIGN KEY IF EXISTS `fk_messages_receiver`;

-- Make sender_id and receiver_id NOT NULL
ALTER TABLE `messages` MODIFY `sender_id` INT NOT NULL;
ALTER TABLE `messages` MODIFY `receiver_id` INT NOT NULL;

-- Verify changes
SHOW CREATE TABLE `messages`;

SELECT 'Messages table constraints removed successfully!' AS Status;
