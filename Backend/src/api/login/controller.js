const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
var ShoutoutClient = require('shoutout-sdk');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');



var apiKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIyMWVlZTJjMC03N2UzLTExZWYtOWFlNy1kOWUyMGU0YjE1ZTIiLCJzdWIiOiJTSE9VVE9VVF9BUElfVVNFUiIsImlhdCI6MTcyNjkwMDI4OCwiZXhwIjoyMDQyNDMzMDg4LCJzY29wZXMiOnsiYWN0aXZpdGllcyI6WyJyZWFkIiwid3JpdGUiXSwibWVzc2FnZXMiOlsicmVhZCIsIndyaXRlIl0sImNvbnRhY3RzIjpbInJlYWQiLCJ3cml0ZSJdfSwic29fdXNlcl9pZCI6IjU3NTMwOSIsInNvX3VzZXJfcm9sZSI6InVzZXIiLCJzb19wcm9maWxlIjoiYWxsIiwic29fdXNlcl9uYW1lIjoiIiwic29fYXBpa2V5Ijoibm9uZSJ9.uG9ZYAx5lpWKi-JR1h_pYfhBGxIaFQDHxp4xHUrGXcA';

var debug = true, verifySSL = false;

var client = new ShoutoutClient(apiKey, debug, verifySSL);

const userLogin = async (req, res) => {
    const { username, password } = req.body;
    try {
        const data = await prisma.admin.findFirst({
            select: {
                User_ID: true,
                Name: true,
                Password: true
            },
            where: {
                UserName: username
            }
        });

        if (data !== null) {
            // Compare the provided password with the hashed password
            const isMatch = await bcrypt.compare(password, data.Password);

            if (isMatch) {
                // Remove password from response
                const { Password, ...userData } = data;
                res.status(200).json({
                    code: 200,
                    message: 'Login Success',
                    data: userData
                })
            } else {
                res.status(200).json({
                    code: 400,
                    message: 'Invalid username or password',
                    data: null
                })
            }
        } else {
            res.status(200).json({
                code: 400,
                message: 'Invalid username or password',
                data: null
            })
        }

    }
    catch (ex) {
        res.status(500).json({
            code: 500,
            message: 'Internal Server Error',
            error: ex.message
        })
    }

};

const userRegister = async (req, res) => {
    const { name, password, contact } = req.body;
    try {
        console.log('Registration request received:', { name, contact, passwordLength: password?.length });

        // Hash the password before storing
        const hashedPassword = await bcrypt.hash(password, 10);

        await prisma.admin.create({
            data: {
                UserName: contact,
                Name: name,
                Password: hashedPassword,
                Contact: contact,
            }
        })

        console.log('Admin registered successfully');

        res.status(200).json({
            code: 200,
            message: 'User created successfully',
        })
    } catch (ex) {
        console.error('Registration error:', ex.message);
        console.error('Full error:', ex);
        
        // Handle unique constraint violation
        if (ex.code === 'P2002') {
            return res.status(400).json({
                code: 400,
                message: 'This contact number is already registered. Please use a different contact number.',
            });
        }
        
        res.status(500).json({
            code: 500,
            message: 'Internal Server Error',
            error: ex.message
        })
    }
}

const forgetpw = async (req, res) => {
    const { contact } = req.body;

    console.log('=== Forget Password Request ===');
    console.log('Received contact:', contact);

    // Validate contact field
    if (!contact || contact.trim() === '') {
        console.log('❌ Contact number is missing');
        return res.status(400).json({
            code: 400,
            message: 'Contact number is required',
        });
    }

    try {
        // Normalize phone number - create multiple variants to match different formats
        const normalizedContact = contact.replace(/\s+/g, '').replace(/[()-]/g, ''); // Remove spaces and special chars
        
        // Generate all possible variants of the phone number
        const contactVariants = [];
        
        // Add the original normalized format
        contactVariants.push(normalizedContact);
        
        // Add version with '+' prefix
        if (!normalizedContact.startsWith('+')) {
            contactVariants.push(`+${normalizedContact}`);
        } else {
            // Add version without '+'
            contactVariants.push(normalizedContact.substring(1));
        }
        
        // For Sri Lankan numbers specifically (94)
        if (normalizedContact.startsWith('94')) {
            contactVariants.push(`+${normalizedContact}`);
        } else if (normalizedContact.startsWith('+94')) {
            contactVariants.push(normalizedContact.substring(1));
        } else if (normalizedContact.startsWith('0')) {
            // Convert 077... to 94...
            contactVariants.push(`94${normalizedContact.substring(1)}`);
            contactVariants.push(`+94${normalizedContact.substring(1)}`);
        }

        console.log('Searching for user with contact variants:', contactVariants);

        // Check if user exists in any table before sending OTP - use OR with contains for more flexibility
        const adminUser = await prisma.admin.findFirst({
            where: { 
                OR: contactVariants.map(variant => ({
                    Contact: { contains: variant.replace(/^\+/, '') }
                }))
            }
        });

        const memberUser = await prisma.member.findFirst({
            where: { 
                OR: contactVariants.map(variant => ({
                    Contact: { contains: variant.replace(/^\+/, '') }
                }))
            }
        });

        const staffUser = await prisma.staffmember.findFirst({
            where: { 
                OR: contactVariants.map(variant => ({
                    Contact_No: { contains: variant.replace(/^\+/, '') }
                }))
            }
        });

        console.log('Search results - Admin:', !!adminUser, 'Member:', !!memberUser, 'Staff:', !!staffUser);

        if (!adminUser && !memberUser && !staffUser) {
            console.log('❌ User not found with contact:', contact);
            console.log('Tried variants:', contactVariants);
            return res.status(200).json({
                code: 400,
                message: 'No account found with this contact number. Please check the number and try again.',
            });
        }

        console.log('✅ User found - generating OTP for contact:', normalizedContact);
        const otp = crypto.randomInt(100000, 999999);
        console.log('\n🔑 ═══════════════════════════════════════');
        console.log('🔑  YOUR OTP CODE: ' + otp);
        console.log('🔑 ═══════════════════════════════════════\n');

        // Set OTP expiration time to 10 minutes from now
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
        console.log('OTP expires at:', expiresAt);

        // Delete any existing OTP for this contact to avoid confusion - use flexible search
        await prisma.otp.deleteMany({
            where: { 
                OR: contactVariants.map(variant => ({
                    Contact: variant
                }))
            }
        });
        console.log('Deleted old OTP records');

        // Save OTP to database first
        const otpRecord = await prisma.otp.create({
            data: {
                Contact: normalizedContact,
                Otp: otp.toString(),
                Expires_At: expiresAt,
            }
        });

        console.log('✅ OTP saved to database with ID:', otpRecord.ID);

        // Prepare SMS message - ensure phone number is in correct format
        const smsDestination = normalizedContact.startsWith('+') ? normalizedContact : `+${normalizedContact}`;
        
        var message = {
            source: 'ShoutDEMO',
            destinations: [smsDestination],
            content: {
                sms: `Your Gym Management OTP is ${otp}. Valid for 10 minutes. Do not share this code.`
            },
            transports: ['sms']
        };

        console.log('Attempting to send SMS to:', smsDestination);

        // Track SMS delivery status
        let smsDelivered = false;
        let smsError = null;

        // Send SMS asynchronously
        client.sendMessage(message, (error, result) => {
            if (error) {
                console.error('❌ SMS sending error:', error);
                console.error('SMS error details:', JSON.stringify(error, null, 2));
                console.warn('⚠️  SMS delivery failed. Use OTP from console logs above.');
                smsError = error;
            } else {
                console.log('✅ SMS sent successfully');
                console.log('SMS Result:', JSON.stringify(result, null, 2));
                smsDelivered = true;
            }
        });

        // Wait a moment to check SMS status
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Return success even if SMS fails (OTP is saved in DB)
        console.log('✅ Returning success response to client\n');
        
        const isDevelopment = process.env.NODE_ENV === 'development';
        const smsHasError = smsError !== null;
        
        res.status(200).json({
            code: 200,
            message: smsDelivered 
                ? 'OTP sent successfully to your phone.' 
                : 'OTP generated. ' + (isDevelopment ? 'Check console for OTP code.' : 'Please contact support if you did not receive it.'),
            smsDelivered: smsDelivered,
            // Always show OTP in development mode OR when SMS fails
            otp: (isDevelopment || smsHasError) ? otp : undefined,
            // Additional info for development
            debug: isDevelopment ? {
                smsStatus: smsDelivered ? 'sent' : 'failed',
                smsError: smsError ? (smsError.message?.description || 'Unknown error') : null,
                note: 'OTP is visible because NODE_ENV=development or SMS failed'
            } : undefined
        })
    } catch (ex) {
        console.error('❌ forgetpw error:', ex);
        console.error('Error stack:', ex.stack);
        res.status(500).json({
            code: 500,
            message: 'Internal Server Error. Please try again later.',
            error: process.env.NODE_ENV === 'development' ? ex.message : undefined
        })
    }
}

const verifyOtp = async (req, res) => {
    const { otp, contact } = req.body;

    console.log('=== Verify OTP Request ===');
    console.log('Contact:', contact, 'OTP:', otp);

    // Validate inputs
    if (!otp || !contact) {
        console.log('❌ Missing OTP or contact');
        return res.status(400).json({
            code: 400,
            message: 'OTP and contact are required',
        });
    }

    try {
        // Normalize phone number - create multiple variants to match different formats
        const normalizedContact = contact.replace(/\s+/g, '').replace(/[()-]/g, '');
        
        // Generate all possible variants
        const contactVariants = [];
        contactVariants.push(normalizedContact);
        
        if (!normalizedContact.startsWith('+')) {
            contactVariants.push(`+${normalizedContact}`);
        } else {
            contactVariants.push(normalizedContact.substring(1));
        }
        
        if (normalizedContact.startsWith('94')) {
            contactVariants.push(`+${normalizedContact}`);
        } else if (normalizedContact.startsWith('+94')) {
            contactVariants.push(normalizedContact.substring(1));
        } else if (normalizedContact.startsWith('0')) {
            contactVariants.push(`94${normalizedContact.substring(1)}`);
            contactVariants.push(`+94${normalizedContact.substring(1)}`);
        }

        console.log('Searching for OTP with contact variants:', contactVariants);

        const isvalid = await prisma.otp.findFirst({
            select: {
                ID: true,
                Expires_At: true,
                Contact: true,
            },
            where: {
                Contact: { in: contactVariants },
                Otp: otp.toString(),
            },
            orderBy: {
                Expires_At: 'desc' // Get the most recent OTP
            }
        });

        if (!isvalid) {
            console.log('❌ Invalid OTP or contact mismatch');
            return res.status(200).json({
                code: 400,
                message: 'Invalid OTP. Please check and try again.',
                data: null
            });
        }

        console.log('Found OTP record:', isvalid);

        // Check if OTP has expired
        const now = new Date();
        if (isvalid.Expires_At < now) {
            console.log('❌ OTP has expired');
            return res.status(200).json({
                code: 400,
                message: 'OTP has expired. Please request a new OTP.',
                data: null
            });
        }

        console.log('✅ OTP verified successfully');

        // Delete the used OTP to prevent reuse
        await prisma.otp.delete({
            where: { ID: isvalid.ID }
        });
        console.log('Used OTP deleted');

        res.status(200).json({
            code: 200,
            message: 'User verified successfully',
            data: { verified: true }
        });
    } catch (ex) {
        console.error('❌ verifyOtp error:', ex);
        console.error('Error stack:', ex.stack);
        res.status(500).json({
            code: 500,
            message: 'Internal Server Error',
            error: process.env.NODE_ENV === 'development' ? ex.message : undefined
        })
    }
}

const resetPw = async (req, res) => {
    const { password, confirmPassword, contact } = req.body;

    console.log('Reset password request received:', { contact, passwordLength: password?.length });

    // Validate inputs
    if (!password || !confirmPassword || !contact) {
        return res.status(400).json({
            code: 400,
            message: 'Password, confirm password, and contact are required',
        });
    }

    try {
        if (password !== confirmPassword) {
            return res.status(200).json({
                code: 300,
                message: 'Passwords do not match',
            });
        }

        // Hash the password before storing
        const hashedPassword = await bcrypt.hash(password, 10);
        console.log('Password hashed successfully');

        // Normalize phone number - create multiple variants to match different formats
        const normalizedContact = contact.replace(/\s+/g, '').replace(/[()-]/g, '');
        
        // Generate all possible variants of the phone number
        const contactVariants = [];
        contactVariants.push(normalizedContact);
        
        if (!normalizedContact.startsWith('+')) {
            contactVariants.push(`+${normalizedContact}`);
        } else {
            contactVariants.push(normalizedContact.substring(1));
        }
        
        if (normalizedContact.startsWith('94')) {
            contactVariants.push(`+${normalizedContact}`);
        } else if (normalizedContact.startsWith('+94')) {
            contactVariants.push(normalizedContact.substring(1));
        } else if (normalizedContact.startsWith('0')) {
            contactVariants.push(`94${normalizedContact.substring(1)}`);
            contactVariants.push(`+94${normalizedContact.substring(1)}`);
        }

        console.log('Searching for user with contact variants for reset:', contactVariants);

        // Try to find user in admin table first - use flexible search
        let adminUser = await prisma.admin.findFirst({
            select: {
                User_ID: true,
                Contact: true
            },
            where: {
                OR: contactVariants.map(variant => ({
                    Contact: { contains: variant.replace(/^\+/, '') }
                }))
            }
        });

        // Try to find user in member table if not found in admin
        let memberUser = await prisma.member.findFirst({
            select: {
                Member_Id: true,
                Contact: true
            },
            where: {
                OR: contactVariants.map(variant => ({
                    Contact: { contains: variant.replace(/^\+/, '') }
                }))
            }
        });

        // Try to find user in staffmember table if not found in admin or member
        let staffUser = await prisma.staffmember.findFirst({
            select: {
                Staff_ID: true,
                Contact_No: true
            },
            where: {
                OR: contactVariants.map(variant => ({
                    Contact_No: { contains: variant.replace(/^\+/, '') }
                }))
            }
        });

        console.log('Admin user lookup result:', adminUser);
        console.log('Member user lookup result:', memberUser);
        console.log('Staff user lookup result:', staffUser);

        if (!adminUser && !memberUser && !staffUser) {
            console.log('User not found with contact:', contact);
            return res.status(200).json({
                code: 400,
                message: 'User not found with this contact number',
                data: null
            });
        }

        // Update password based on user type
        if (adminUser) {
            console.log('Updating password for admin user:', adminUser.User_ID);
            await prisma.admin.update({
                data: {
                    Password: hashedPassword
                },
                where: {
                    User_ID: adminUser.User_ID
                }
            });
            console.log('Admin password updated successfully');
        } else if (memberUser) {
            console.log('Updating password for member user:', memberUser.Member_Id);
            await prisma.member.update({
                data: {
                    Password: hashedPassword
                },
                where: {
                    Member_Id: memberUser.Member_Id
                }
            });
            console.log('Member password updated successfully');
        } else if (staffUser) {
            console.log('Updating password for staff user:', staffUser.Staff_ID);
            await prisma.staffmember.update({
                data: {
                    Password: hashedPassword
                },
                where: {
                    Staff_ID: staffUser.Staff_ID
                }
            });
            console.log('Staff password updated successfully');
        }

        // Delete the OTP after successful password reset
        const deleteOtpResult = await prisma.otp.deleteMany({
            where: {
                Contact: contact
            }
        });

        console.log('OTPs deleted:', deleteOtpResult.count);

        res.status(200).json({
            code: 200,
            message: 'Password reset successfully'
        });

    } catch (ex) {
        console.error('resetPw error:', ex);
        console.error('Error stack:', ex.stack);
        res.status(500).json({
            code: 500,
            message: 'Internal Server Error',
            error: ex.message
        });
    }
}


module.exports = {
    userLogin,
    userRegister,
    forgetpw,
    verifyOtp,
    resetPw



}

