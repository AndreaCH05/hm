const express = require('express');

const AutomatizacionesController = require('../app/controller/AutomatizacionesController');
const TokenVerifier = require('../app/middleware/TokenVerifier');

const router = express.Router()

module.exports = router
    .get('/automatizaciones/list',TokenVerifier, AutomatizacionesController.list)
    .get('/automatizaciones/id',TokenVerifier, AutomatizacionesController.get)
    .post('/automatizaciones/add', TokenVerifier, AutomatizacionesController.add)

    .delete('/automatizaciones/delete', TokenVerifier, AutomatizacionesController.delete)
    .put('/automatizaciones/update', TokenVerifier, AutomatizacionesController.update)


