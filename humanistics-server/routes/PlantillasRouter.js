const express = require('express');
const PlantillasController = require('../app/controller/PlantillasController');
const router = express.Router();

const verificar = require('../app/middleware/TokenVerifier');
// const  = require('../app/middleware/Permisions/isAdmin');

module.exports = router
    .post('/plantillas/add',[
        verificar,
        // Permissions.isAdmin
    ],PlantillasController.add)

    .put('/plantillas/update',[
        verificar,
        // Permissions.isAdmin
    ],PlantillasController.update)
    //
    .delete('/plantillas/delete',[
        verificar,
        // Permissions.isAdmin
    ],PlantillasController.delete)
    //
    .post('/plantillas/id',[
        verificar,
        // Permissions.isAdmin
    ],PlantillasController.get)
    //
    .get('/plantillas',[
        verificar,
        // Permissions.isAdmin
    ],PlantillasController.list)
