const staffMemberRoute = require('express').Router();
const {staffMember,staffList,staffDelete,staffEdit,staffLogin,staffGet} = require('./controller');

staffMemberRoute.post('/create', staffMember);
staffMemberRoute.get('/list', staffList);
staffMemberRoute.delete('/delete/:id', staffDelete);
staffMemberRoute.put('/update/:id', staffEdit);
staffMemberRoute.post('/login', staffLogin);
staffMemberRoute.get('/:id', staffGet);


module.exports = staffMemberRoute;