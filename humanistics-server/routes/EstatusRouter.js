const express = require('express');

const EstatusController = require('../app/controller/EstatusController');
const TokenVerifier = require('../app/middleware/TokenVerifier');

const router = express.Router();


module.exports = router
    .get('/estatus/project/list',TokenVerifier, EstatusController.projectsList)
    .post('/estatus/project/upadate', TokenVerifier, EstatusController.update)
    
    

