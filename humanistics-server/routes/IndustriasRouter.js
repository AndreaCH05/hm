const express = require('express');
const IndustriasController = require('../app/controller/IndustriasController');
const router = express.Router();

const verificar = require('../app/middleware/TokenVerifier');
// const  = require('../app/middleware/Permisions/isAdmin');

module.exports = router
    .post('/industrias/add',[
        verificar,
        // Permissions.isAdmin
    ],IndustriasController.add)

    .put('/industrias/update',[
        verificar,
        // Permissions.isAdmin
    ],IndustriasController.update)

    .delete('/industrias/delete',[
        verificar,
        // Permissions.isAdmin
    ],IndustriasController.delete)

    .post('/industrias/id',[
        verificar,
        // Permissions.isAdmin
    ],IndustriasController.get)

    .get('/industrias',[
        verificar,
        // Permissions.isAdmin
    ],IndustriasController.list)
