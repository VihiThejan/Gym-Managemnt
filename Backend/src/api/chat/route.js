const chatRoute = require('express').Router();
const {chatHandling} = require('./controller');

chatRoute.post('/create', chatHandling);


module.exports = chatRoute;