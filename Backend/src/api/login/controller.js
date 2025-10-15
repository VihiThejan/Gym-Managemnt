const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
var ShoutoutClient = require('shoutout-sdk');
const crypto = require('crypto');



var apiKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIyMWVlZTJjMC03N2UzLTExZWYtOWFlNy1kOWUyMGU0YjE1ZTIiLCJzdWIiOiJTSE9VVE9VVF9BUElfVVNFUiIsImlhdCI6MTcyNjkwMDI4OCwiZXhwIjoyMDQyNDMzMDg4LCJzY29wZXMiOnsiYWN0aXZpdGllcyI6WyJyZWFkIiwid3JpdGUiXSwibWVzc2FnZXMiOlsicmVhZCIsIndyaXRlIl0sImNvbnRhY3RzIjpbInJlYWQiLCJ3cml0ZSJdfSwic29fdXNlcl9pZCI6IjU3NTMwOSIsInNvX3VzZXJfcm9sZSI6InVzZXIiLCJzb19wcm9maWxlIjoiYWxsIiwic29fdXNlcl9uYW1lIjoiIiwic29fYXBpa2V5Ijoibm9uZSJ9.uG9ZYAx5lpWKi-JR1h_pYfhBGxIaFQDHxp4xHUrGXcA';

var debug = true, verifySSL = false;

var client = new ShoutoutClient(apiKey, debug, verifySSL);

const userLogin = async (req, res) => {
    const {username, password} = req.body;
    try{
        const data = await prisma.admin.findFirst({
            select: {
                User_ID: true,
                Name: true
            },
            where:{
                UserName: username,
                Password: password
            }
        });

        if(data!== null){
        res.status(200).json({
            code: 200,
            message: 'Login Success',
            data
        })
    }else{
        res.status(200).json({
            code: 400,
            message: 'Invalid username or password',
            data: null
        })
    }

    }
    catch(ex){
        res.status(500).json({
            code: 500,
            message: 'Internal Server Error',
            error: ex.message
        })
    }

};

const userRegister = async (req, res) => {
    const {name,  password,contact} = req.body;
    try{
        await prisma.admin.create({
            data: {
                UserName: contact,
                Name: name,
                Password: password,
                Contact:contact,
            }
        })
        res.status(200).json({
            code: 200,
            message: 'User created successfully',
        })
    }catch(ex){
        res.status(500).json({
            code: 500,
            message: 'Internal Server Error',
            error: ex.message
        })
    }
}

const forgetpw = async (req, res) => {
    const {contact} = req.body;
    try{
        const otp = crypto.randomInt(100000, 999999);

        var message = {
            source: 'ShoutDEMO',
            destinations: [contact],
            content: {
                sms: 'Your OTP is '+otp
            },
            transports: ['sms']
        };
        
          console.log(otp)
        await prisma.otp.create({
            data: {
                Contact: contact,
                Otp: otp,
              
            }
        })
        client.sendMessage(message, (error, result) => {
            if (error) {
                console.error('error ', error);
            } else {
                console.log('result ', result);
            }
        });   

        res.status(200).json({
            code: 200,
            message: 'OTP sent successfully',
        })
    }catch(ex){
        res.status(500).json({
            code: 500,
            message: 'Internal Server Error',
            error: ex.message
        })
    }
}

const verifyOtp = async (req, res) => {
    const {otp,contact} = req.body;
    try{

       const isvalid= await prisma.otp.findFirst({
            select: {
                ID: true,
                
            },where:{
                Contact:contact,
                Otp:parseInt(otp),
            }
        })
        res.status(200).json({
            code: 200,
            message: 'User verified successfully',
            data:isvalid
        })
    }catch(ex){
        res.status(500).json({
            code: 500,
            message: 'Internal Server Error',
            error: ex.message
        })
    }
}

const resetPw = async (req, res) => {
    const {password, confirmPassword, contact} = req.body;
    try{
        if(password != confirmPassword){
            res.status(200).json({
                code:300,
                message: 'Password doesn\'t match',
            })
        }
        else{
           const userId = await prisma.admin.findFirst({
                select: {
                    User_ID: true
                },
                where:{
                    Contact: contact
                }
            })
            console.log(userId)
            const data = await prisma.admin.update({
                data: {
                    Password: password
                },
                where: {
                    User_ID: userId?.User_ID
                }
            })
            res.status(200).json({
                code: 200,
                message: 'Password reset successfully'
            })
        }
       
    }catch(ex){
        res.status(500).json({
            code: 500,
            message: 'Internal Server Error',
            error: ex.message
        })
    }
}


module.exports = {
    userLogin,
    userRegister,
    forgetpw,
    verifyOtp,
    resetPw
    
   
  
}

