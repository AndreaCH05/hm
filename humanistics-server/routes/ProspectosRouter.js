const express = require('express');
const ProspectosController = require('../app/controller/ProspectosController');
const router = express.Router();

const verificar = require('../app/middleware/TokenVerifier');
// const  = require('../app/middleware/Permisions/isAdmin');

module.exports = router
    .post('/prospectos/add',[
        verificar,
        // Permissions.isAdmin
    ],ProspectosController.add)
    .put('/prospectos/update',[
        verificar,
        // Permissions.isAdmin
    ],ProspectosController.update)
    .get('/prospectos',[
        verificar,
        // Permissions.isAdmin
    ],ProspectosController.list)
    .post('/prospectos/csv',[
        verificar,  
        // Permissions.isAdmin
    ],ProspectosController.csv)
    .get('/prospectos/id',[
        verificar,
        // Permissions.isAdmin
    ],ProspectosController.get)