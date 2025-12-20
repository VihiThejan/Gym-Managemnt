// Test database connection and initialization
require('dotenv').config();
const { initializeDatabase, closeDatabase } = require('./src/config/database');

async function testDatabase() {
    console.log('🧪 Testing Database Connection...\n');
    
    try {
        const db = await initializeDatabase();
        console.log('\n✅ Database test successful!');
        console.log('📝 Running a test query...\n');
        
        const [rows] = await db.query('SELECT COUNT(*) as member_count FROM member');
        console.log(`👥 Total members in database: ${rows[0].member_count}`);
        
        const [tables] = await db.query(`
            SELECT TABLE_NAME 
            FROM INFORMATION_SCHEMA.TABLES 
            WHERE TABLE_SCHEMA = 'gym_management' 
            ORDER BY TABLE_NAME
        `);
        
        console.log(`\n📊 Total tables: ${tables.length}`);
        console.log('📋 Tables:');
        tables.forEach((table, index) => {
            console.log(`   ${index + 1}. ${table.TABLE_NAME}`);
        });
        
        await closeDatabase();
        console.log('\n✅ Test completed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('\n❌ Database test failed:', error.message);
        process.exit(1);
    }
}

testDatabase();
