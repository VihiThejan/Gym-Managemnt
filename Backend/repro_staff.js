
require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
    console.log('Starting reproduction script...');
    try {
        const password = 'TestPassword123!';
        const hashedPassword = await bcrypt.hash(password, 10);

        const staffData = {
            FName: 'Test Staff',
            DOB: new Date('1990-01-01'),
            Address: '123 Test St',
            Gender: 'Male',
            Contact_No: '0771234567',
            Email: 'test.staff@example.com',
            Job_Role: 'Trainer',
            UName: '0771234567',
            Password: hashedPassword
        };

        console.log('Attempting to create staff with data:', JSON.stringify(staffData, null, 2));

        // existing check logic I added in controller
        const existingStaff = await prisma.staffmember.findFirst({
            where: {
                OR: [
                    { Email: staffData.Email },
                    { Contact_No: staffData.Contact_No },
                    { UName: staffData.Contact_No } // UName is set to Contact_No
                ]
            }
        });

        if (existingStaff) {
            console.log('Bot: Staff already exists, cleaning up first...');
            await prisma.staffmember.delete({
                where: { Staff_ID: existingStaff.Staff_ID }
            });
            console.log('Bot: Cleaned up existing staff.');
        }


        const created = await prisma.staffmember.create({
            data: staffData
        });
        console.log('Staff created successfully:', created);

    } catch (e) {
        console.error('Full Error Object:', e);
        console.error('Error Message:', e.message);
        console.error('Error Code:', e.code);
        if (e.meta) console.error('Error Meta:', e.meta);
    } finally {
        await prisma.$disconnect();
    }
}

main();
