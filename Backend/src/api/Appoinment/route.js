const appoinmentRoute = require('express').Router();
const {Appoinmenthandling,AppoinmentList,AppoinmentDelete,AppoinmentEdit,AppoinmentGet,AppoinmentComplete} = require('./controller');

appoinmentRoute.post('/create', Appoinmenthandling);
appoinmentRoute.get('/list', AppoinmentList);
appoinmentRoute.delete('/delete/:id', AppoinmentDelete);
appoinmentRoute.put('/update/:id', AppoinmentEdit);
appoinmentRoute.put('/complete/:id', AppoinmentComplete);
appoinmentRoute.get('/:id', AppoinmentGet);



module.exports = appoinmentRoute;