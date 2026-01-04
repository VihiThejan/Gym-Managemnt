const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcryptjs');


const staffMember = async (req, res) => {
    const { FName, dob, address, gender, contactNo, email, jobRole, password } = req.body;

    console.log('Received staff registration data:', { ...req.body, password: '***' }); // Don't log password

    try {
        if (!FName || !dob || !address || !gender || !contactNo || !email || !jobRole || !password) {
            return res.status(400).json({
                code: 400,
                message: 'All fields are required'
            });
        }

        const dateOfBirth = new Date(dob);
        if (isNaN(dateOfBirth.getTime())) {
            return res.status(400).json({
                code: 400,
                message: 'Invalid Date of Birth'
            });
        }

        // Check if staff with same email or contact number already exists
        const existingStaff = await prisma.staffmember.findFirst({
            where: {
                OR: [
                    { Email: email },
                    { Contact_No: contactNo },
                    { UName: contactNo }
                ]
            }
        });

        if (existingStaff) {
            console.log('Staff member already exists with email or contact:', email, contactNo);
            return res.status(409).json({
                code: 409,
                message: 'Staff member with this Email or Contact Number already exists.',
                existingFields: {
                    emailMatch: existingStaff.Email === email,
                    contactMatch: existingStaff.Contact_No === contactNo || existingStaff.UName === contactNo
                }
            });
        }

        // Hash the password before storing
        const hashedPassword = await bcrypt.hash(password, 10);

        await prisma.staffmember.create({
            data: {

                FName: FName,
                DOB: dateOfBirth,
                Address: address,
                Gender: gender,
                Contact_No: contactNo,
                Email: email,
                Job_Role: jobRole,
                UName: contactNo,
                Password: hashedPassword



            }
        })
        console.log('Staff member created successfully');

        // Fetch the created staff to return (excluding password)
        const createdStaff = await prisma.staffmember.findFirst({
            where: { Contact_No: contactNo },
            select: {
                Staff_ID: true,
                FName: true,
                Email: true,
                Job_Role: true,
                Contact_No: true,
                Gender: true,
                DOB: true,
                Address: true
            }
        });

        res.status(200).json({
            code: 200,
            message: 'Staff member created successfully',
            data: createdStaff
        })
    } catch (ex) {
        console.error('Error creating staff member:', ex);
        // Check for Prisma unique constraint error code
        if (ex.code === 'P2002') {
            return res.status(409).json({
                code: 409,
                message: 'A user with this unique field already exists (Email or Contact)',
                error: ex.message,
                meta: ex.meta
            })
        }
        res.status(500).json({
            code: 500,
            message: 'Internal Server Error',
            error: ex.message,
            stack: ex.stack // Include stack trace for debugging
        })
    }
}

const staffLogin = async (req, res) => {
    const { username, password } = req.body;

    console.log('Staff login attempt:', { username, passwordLength: password?.length });

    try {
        // Find staff by Contact_No (used as username)
        const data = await prisma.staffmember.findFirst({
            select: {
                Staff_ID: true,
                FName: true,
                Password: true,
                Contact_No: true
            },
            where: {
                Contact_No: username
            }
        });

        console.log('Staff found:', data ? 'Yes' : 'No');

        if (data !== null) {
            // Compare the provided password with the hashed password
            const isMatch = await bcrypt.compare(password, data.Password);

            console.log('Password match:', isMatch);

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
            console.log('User not found with contact:', username);
            res.status(200).json({
                code: 400,
                message: 'Invalid username or password',
                data: null
            })
        }

    }
    catch (ex) {
        console.error('Staff login error:', ex);
        res.status(500).json({
            code: 500,
            message: 'Internal Server Error',
            error: ex.message
        })
    }

};

const staffList = async (req, res) => {
    try {
        const data = await prisma.staffmember.findMany({
            select: {
                Staff_ID: true,
                FName: true,
                DOB: true,
                Address: true,
                Gender: true,
                Contact_No: true,
                Email: true,
                Job_Role: true,
                UName: true,
                Password: true
            }


        });
        res.status(200).json({
            code: 200,
            message: 'Staff Members fetched successfully',
            data
        });
    } catch (ex) {
        res.status(500).json({
            code: 500,
            message: 'Internal Server Error',
            error: ex.message
        });
    }
};

const staffDelete = async (req, res) => {
    try {
        const id = req.params.id
        const staffId = parseInt(id)

        // Check if staff has related appointments or schedules
        const appointments = await prisma.appointment.count({
            where: { Staff_ID: staffId }
        })

        const schedules = await prisma.schedule.count({
            where: { Staff_ID: staffId }
        })

        if (appointments > 0 || schedules > 0) {
            return res.status(400).json({
                code: 400,
                message: 'Cannot delete staff member. This staff has associated appointments or schedules. Please remove them first.',
                details: {
                    appointments,
                    schedules
                }
            })
        }

        // If no related records, proceed with deletion
        const data = await prisma.staffmember.delete({
            where: {
                Staff_ID: staffId
            }
        })

        res.status(200).json({
            code: 200,
            message: 'Staff member deleted successfully',
            data
        })
    } catch (ex) {
        res.status(500).json({
            code: 500,
            message: 'Failed to delete staff member',
            error: ex.message
        })
    }
}


const staffEdit = async (req, res) => {
    try {
        const id = req.params.id;
        const { FName, DOB, Address, Gender, Contact_No, Email, Job_Role } = req.body;


        if (!FName && !DOB && !Address && !Gender && !Contact_No && !Email && !Job_Role) {
            return res.status(400).json({
                code: 400,
                message: 'At least one field is required for update',
            });
        }


        const updateData = {};
        if (FName) updateData.FName = FName;
        if (DOB) updateData.DOB = new Date(DOB);
        if (Address) updateData.Address = Address;
        if (Gender) updateData.Gender = Gender;
        if (Contact_No) updateData.Contact_No = Contact_No;
        if (Email) updateData.Email = Email;
        if (Job_Role) updateData.Job_Role = Job_Role;


        const data = await prisma.staffmember.update({
            where: {
                Staff_ID: parseInt(id),
            },
            data: updateData,
        });

        res.status(200).json({
            code: 200,
            message: 'Staff member updated successfully',
            data,
        });
    } catch (ex) {
        console.error("Error updating staff member:", ex.message);
        res.status(500).json({
            code: 500,
            message: 'Internal Server Error',
            error: ex.message,
        });
    }
};

const staffGet = async (req, res) => {
    try {
        const id = req.params.id;
        const data = await prisma.staffmember.findUnique({
            where: {
                Staff_ID: parseInt(id),
            },
        });
        res.status(200).json({
            code: 200,
            message: 'Staff fetched successfully',
            data,
        });
    } catch (ex) {
        res.status(500).json({
            code: 500,
            message: 'Internal Server Error',
            error: ex.message,
        });
    }
};


module.exports = {
    staffList,
    staffMember,
    staffDelete,
    staffEdit,
    staffGet,
    staffLogin
};
