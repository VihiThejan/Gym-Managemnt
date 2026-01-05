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
        res.status(500).json({
            code: 500,
            message: 'Internal Server Error',
            error: ex.message
        })
    }
}

const forgetpw = async (req, res) => {
    const { contact } = req.body;

    // Validate contact field
    if (!contact || contact.trim() === '') {
        return res.status(400).json({
            code: 400,
            message: 'Contact number is required',
        });
    }

    try {
        // Check if user exists in any table before sending OTP
        const adminUser = await prisma.admin.findFirst({
            where: { Contact: contact }
        });

        const memberUser = await prisma.member.findFirst({
            where: { Contact: contact }
        });

        const staffUser = await prisma.staffmember.findFirst({
            where: { Contact_No: contact }
        });

        if (!adminUser && !memberUser && !staffUser) {
            console.log('User not found with contact:', contact);
            return res.status(200).json({
                code: 400,
                message: 'No account found with this contact number',
            });
        }

        console.log('User found - generating OTP for contact:', contact);
        const otp = crypto.randomInt(100000, 999999);
        console.log('Generated OTP:', otp);

        // Set OTP expiration time to 10 minutes from now
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
        console.log('OTP expires at:', expiresAt);

        // Save OTP to database first
        const otpRecord = await prisma.otp.create({
            data: {
                Contact: contact,
                Otp: otp.toString(),
                Expires_At: expiresAt,
            }
        });

        console.log('OTP saved to database:', otpRecord);

        // Prepare SMS message
        var message = {
            source: 'ShoutDEMO',
            destinations: [contact],
            content: {
                sms: 'Your OTP is ' + otp
            },
            transports: ['sms']
        };

        // Send SMS asynchronously (don't wait for response)
        client.sendMessage(message, (error, result) => {
            if (error) {
                console.error('SMS sending error:', error);
            } else {
                console.log('SMS sent successfully. Result:', result);
            }
        });

        res.status(200).json({
            code: 200,
            message: 'OTP sent successfully',
        })
    } catch (ex) {
        console.error('forgetpw error:', ex);
        console.error('Error stack:', ex.stack);
        res.status(500).json({
            code: 500,
            message: 'Internal Server Error',
            error: ex.message
        })
    }
}

const verifyOtp = async (req, res) => {
    const { otp, contact } = req.body;

    // Validate inputs
    if (!otp || !contact) {
        return res.status(400).json({
            code: 400,
            message: 'OTP and contact are required',
        });
    }

    try {
        const isvalid = await prisma.otp.findFirst({
            select: {
                ID: true,
                Expires_At: true,
            },
            where: {
                Contact: contact,
                Otp: otp.toString(),
            }
        });

        if (!isvalid) {
            return res.status(200).json({
                code: 400,
                message: 'Invalid OTP',
                data: null
            });
        }

        // Check if OTP has expired
        const now = new Date();
        if (isvalid.Expires_At < now) {
            return res.status(200).json({
                code: 400,
                message: 'OTP has expired. Please request a new OTP.',
                data: null
            });
        }

        res.status(200).json({
            code: 200,
            message: 'User verified successfully',
            data: isvalid
        });
    } catch (ex) {
        console.error('verifyOtp error:', ex);
        res.status(500).json({
            code: 500,
            message: 'Internal Server Error',
            error: ex.message
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

        // Try to find user in admin table first
        let adminUser = await prisma.admin.findFirst({
            select: {
                User_ID: true,
                Contact: true
            },
            where: {
                Contact: contact
            }
        });

        // Try to find user in member table if not found in admin
        let memberUser = await prisma.member.findFirst({
            select: {
                Member_Id: true,
                Contact: true
            },
            where: {
                Contact: contact
            }
        });

        // Try to find user in staffmember table if not found in admin or member
        let staffUser = await prisma.staffmember.findFirst({
            select: {
                Staff_ID: true,
                Contact_No: true
            },
            where: {
                Contact_No: contact
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

