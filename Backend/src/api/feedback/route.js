const feedbackRoute = require('express').Router();
const {feedbackHandling,feedbackList,feedbackDelete,feedbackEdit,feedbackGet} = require('./controller');

feedbackRoute.post('/create', feedbackHandling);
feedbackRoute.get('/list', feedbackList);
feedbackRoute.delete('/delete/:id', feedbackDelete);
feedbackRoute.put('/update/:id', feedbackEdit);
feedbackRoute.get('/:id', feedbackGet);


module.exports = feedbackRoute;