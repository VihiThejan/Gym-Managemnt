const memberRoute = require('express').Router();
const {member,memberLogin, memberList,memberEdit, memberDelete,memberGet} = require('./controller');

memberRoute.post('/create', member);
memberRoute.get('/list', memberList);
memberRoute.delete('/delete/:id', memberDelete);
memberRoute.put('/update/:id', memberEdit);
memberRoute.post('/login', memberLogin);
memberRoute.get('/:id', memberGet);


module.exports = memberRoute;