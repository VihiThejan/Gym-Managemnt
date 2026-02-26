const appoinmentRoute = require('express').Router();
const {Appoinmenthandling,AppoinmentList,AppoinmentDelete,AppoinmentEdit,AppoinmentGet,AppoinmentComplete,AppoinmentStart,AppoinmentConfirm,AppoinmentCancel} = require('./controller');

appoinmentRoute.post('/create', Appoinmenthandling);
appoinmentRoute.get('/list', AppoinmentList);
appoinmentRoute.delete('/delete/:id', AppoinmentDelete);
appoinmentRoute.put('/update/:id', AppoinmentEdit);
appoinmentRoute.put('/complete/:id', AppoinmentComplete);
appoinmentRoute.put('/start/:id', AppoinmentStart);
appoinmentRoute.put('/confirm/:id', AppoinmentConfirm);
appoinmentRoute.put('/cancel/:id', AppoinmentCancel);
appoinmentRoute.get('/:id', AppoinmentGet);



module.exports = appoinmentRoute;