const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function cleanupAttendance() {
  try {
    console.log('🧹 Cleaning corrupted attendance records...');
    
    // Delete attendance record 17 (has checkout, need to test fresh)
    const deleted = await prisma.attendance.deleteMany({
      where: {
        Attendance_ID: 17
      }
    });
    
    console.log(`✅ Deleted ${deleted.count} corrupted record(s)`);
    
    // Show remaining records for today
    const remaining = await prisma.attendance.findMany({
      where: {
        Member_Id: 7,
        Current_date: {
          gte: new Date('2025-12-22T00:00:00.000Z'),
          lt: new Date('2025-12-23T00:00:00.000Z')
        }
      }
    });
    
    console.log('\n📋 Remaining attendance records for Member 7 on 2025-12-22:');
    console.log(remaining);
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

cleanupAttendance();
