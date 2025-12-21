// Script to remove foreign key constraints from messages table
require('dotenv').config();
const mysql = require('mysql2/promise');

async function fixMessagesTable() {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '1234',
        database: process.env.DB_NAME || 'gym_management'
    });

    console.log('🔧 Fixing messages table...');

    try {
        // Drop foreign key constraints
        const constraints = ['messages_ibfk_1', 'messages_ibfk_2', 'fk_messages_sender', 'fk_messages_receiver'];
        
        for (const constraint of constraints) {
            try {
                await connection.execute(`ALTER TABLE messages DROP FOREIGN KEY ${constraint}`);
                console.log(`✅ Dropped constraint: ${constraint}`);
            } catch (err) {
                if (err.code === 'ER_CANT_DROP_FIELD_OR_KEY') {
                    console.log(`⚠️  Constraint ${constraint} does not exist (already removed)`);
                } else {
                    console.log(`⚠️  Error dropping ${constraint}: ${err.message}`);
                }
            }
        }

        // Make columns NOT NULL
        await connection.execute(`ALTER TABLE messages MODIFY sender_id INT NOT NULL`);
        await connection.execute(`ALTER TABLE messages MODIFY receiver_id INT NOT NULL`);
        console.log('✅ Updated sender_id and receiver_id to NOT NULL');

        // Show table structure
        const [rows] = await connection.execute(`SHOW CREATE TABLE messages`);
        console.log('\n📋 Updated table structure:');
        console.log(rows[0]['Create Table']);

        console.log('\n✅ Messages table fixed successfully!');
    } catch (error) {
        console.error('❌ Error:', error.message);
        throw error;
    } finally {
        await connection.end();
    }
}

fixMessagesTable()
    .then(() => {
        console.log('\n✅ Done! You can now restart the server.');
        process.exit(0);
    })
    .catch((err) => {
        console.error('❌ Failed:', err.message);
        process.exit(1);
    });
