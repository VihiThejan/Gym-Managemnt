// Quick test script to check phone numbers and test OTP functionality
require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function testPhoneNumbers() {
    console.log('=== Checking Phone Numbers in Database ===\n');
    
    try {
        // Check Admin table
        const admins = await prisma.admin.findMany({
            select: { Name: true, Contact: true }
        });
        console.log('📱 Admin Users:');
        admins.forEach(admin => {
            console.log(`   - ${admin.Name}: ${admin.Contact}`);
        });
        
        // Check Member table (first 10)
        const members = await prisma.member.findMany({
            select: { FName: true, LName: true, Contact: true },
            take: 10
        });
        console.log('\n📱 Member Users (first 10):');
        members.forEach(member => {
            console.log(`   - ${member.FName} ${member.LName}: ${member.Contact}`);
        });
        
        // Check Staff table
        const staff = await prisma.staffmember.findMany({
            select: { FName: true, LName: true, Contact_No: true }
        });
        console.log('\n📱 Staff Users:');
        staff.forEach(s => {
            console.log(`   - ${s.FName} ${s.LName}: ${s.Contact_No}`);
        });
        
        // Check recent OTP records
        const otps = await prisma.otp.findMany({
            take: 5,
            orderBy: { Expires_At: 'desc' }
        });
        console.log('\n🔐 Recent OTP Records:');
        if (otps.length === 0) {
            console.log('   No OTP records found');
        } else {
            otps.forEach(otp => {
                const isExpired = new Date(otp.Expires_At) < new Date();
                console.log(`   - Contact: ${otp.Contact}, OTP: ${otp.Otp}, Expired: ${isExpired}`);
            });
        }
        
        console.log('\n✅ Test completed!');
        
    } catch (error) {
        console.error('\n❌ Error:', error.message);
    } finally {
        await prisma.$disconnect();
        process.exit(0);
    }
}

testPhoneNumbers();
