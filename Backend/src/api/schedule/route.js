const scheduleRoute = require('express').Router();
const {scheduleHandling,scheduleList,scheduleDelete,scheduleEdit,scheduleGet} = require('./controller');

scheduleRoute.post('/create', scheduleHandling);
scheduleRoute.get('/list', scheduleList);
scheduleRoute.delete('/delete/:id', scheduleDelete);
scheduleRoute.put('/update/:id', scheduleEdit);
scheduleRoute.get('/:id', scheduleGet);

module.exports = scheduleRoute;