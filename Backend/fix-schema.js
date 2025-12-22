const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function fixAttendanceSchema() {
  try {
    console.log('🔧 Fixing attendance table schema...');
    
    // Change In_time and Out_time from TIME to DATETIME
    await prisma.$executeRawUnsafe(`
      ALTER TABLE attendance 
      MODIFY COLUMN In_time DATETIME NOT NULL,
      MODIFY COLUMN Out_time DATETIME NULL
    `);
    
    console.log('✅ Successfully changed In_time and Out_time to DATETIME type');
    
    // Show the updated schema
    const schema = await prisma.$queryRawUnsafe(`DESCRIBE attendance`);
    console.log('\n📋 Updated attendance table schema:');
    console.table(schema);
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

fixAttendanceSchema();
