const express = require('express');
const PlanesController = require('../app/controller/PlanesController');
const router = express.Router();

const verificar = require('../app/middleware/TokenVerifier');
// const  = require('../app/middleware/Permisions/isAdmin');

module.exports = router
    .post('/planes/add',[
        verificar,
        // Permissions.isAdmin
    ],PlanesController.add)

    .put('/planes/update',[
        verificar,
        // Permissions.isAdmin
    ],PlanesController.update)

    .delete('/planes/delete',[
        verificar,
        // Permissions.isAdmin
    ],PlanesController.delete)

    .post('/planes/id',[
        verificar,
        // Permissions.isAdmin
    ],PlanesController.get)

    .get('/planes',[
        verificar,
        // Permissions.isAdmin
    ],PlanesController.list)
