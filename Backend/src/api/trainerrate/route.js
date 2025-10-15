const trainerrateRoute = require('express').Router();
const {trainerrateHandling,trainerrateList} = require('./controller');

trainerrateRoute.post('/create', trainerrateHandling);
trainerrateRoute.get('/list', trainerrateList);


module.exports = trainerrateRoute;