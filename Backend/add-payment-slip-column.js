const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function addPaymentSlipColumn() {
  try {
    console.log('🔧 Adding Payment_Slip column to payment table...');
    
    // Add Payment_Slip column
    await prisma.$executeRawUnsafe(`
      ALTER TABLE payment 
      ADD COLUMN Payment_Slip VARCHAR(255) NULL AFTER Payment_Method
    `);
    
    console.log('✅ Successfully added Payment_Slip column');
    
    // Show the updated schema
    const schema = await prisma.$queryRawUnsafe(`DESCRIBE payment`);
    console.log('\n📋 Updated payment table schema:');
    console.table(schema);
    
  } catch (error) {
    if (error.message.includes('Duplicate column name')) {
      console.log('ℹ️  Payment_Slip column already exists');
    } else {
      console.error('❌ Error:', error);
    }
  } finally {
    await prisma.$disconnect();
  }
}

addPaymentSlipColumn();
