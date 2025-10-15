const announcementRoute = require('express').Router();
const {announcementHandling,announcementList,announcementDelete,announcementEdit,announcementGet} = require('./controller');

announcementRoute.post('/create', announcementHandling);
announcementRoute.get('/list', announcementList);
announcementRoute.delete('/delete/:id', announcementDelete);
announcementRoute.put('/Update/:id', announcementEdit);
announcementRoute.get('/:id', announcementGet);

module.exports = announcementRoute;