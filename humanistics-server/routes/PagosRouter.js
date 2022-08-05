const express = require('express');
const PagosController = require('../app/controller/PagosController');
const router = express.Router();

const verificar = require('../app/middleware/TokenVerifier');
const {isEmpresa} = require('../app/middleware/Permissions');

module.exports = router
    .post('/checkout',[
        verificar,
    ],PagosController.checkout)

    .get('/checkout/list',[
        verificar,
    ],PagosController.list)

    .post('/checkout/id',[
        verificar,
    ],PagosController.get)
