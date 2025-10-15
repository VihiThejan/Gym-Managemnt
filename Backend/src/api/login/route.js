const loginRoute = require('express').Router();
const {userLogin, userRegister,forgetpw,verifyOtp, resetPw } = require('./controller');


loginRoute.post('/login', userLogin);
loginRoute.post('/register', userRegister);
loginRoute.post('/forgetpw', forgetpw);
loginRoute.post('/verify', verifyOtp);
loginRoute.post('/reset', resetPw);




module.exports = loginRoute;

