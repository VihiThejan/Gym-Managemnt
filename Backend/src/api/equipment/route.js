const equipmentRoute = require('express').Router();
const {equipmentHandling,equipmentList,equipmentDelete,equipmentEdit,equipmentGet } = require('./controller');

equipmentRoute.post('/create', equipmentHandling);
equipmentRoute.get('/list', equipmentList);
equipmentRoute.delete('/delete/:id', equipmentDelete);
equipmentRoute.put('/update/:id', equipmentEdit);
equipmentRoute.get('/:id', equipmentGet);


module.exports = equipmentRoute;