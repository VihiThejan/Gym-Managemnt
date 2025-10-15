const attendanceRoute = require('express').Router();
const {attendanceHandling,attendanceList,attendanceDelete,attendanceEdit,attendanceGet} = require('./controller');

attendanceRoute.post('/create', attendanceHandling);
attendanceRoute.get('/list', attendanceList);
attendanceRoute.delete('/delete/:id', attendanceDelete);
attendanceRoute.put('/update/:id', attendanceEdit); //
attendanceRoute.get('/:id', attendanceGet);


module.exports = attendanceRoute;