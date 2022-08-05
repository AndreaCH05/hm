const express = require('express');

const DashboardController = require('../app/controller/DashboardController');
const TokenVerifier = require('../app/middleware/TokenVerifier');

const router = express.Router();


module.exports = router
    

    .get('/dashboard/prospectos-actuales',TokenVerifier, DashboardController.getProspectoActuales)
    .get('/dashboard/ventas-proyecto',TokenVerifier, DashboardController.getVentasPorProyecto)
    .get('/dashboard/fuente-prospectos',TokenVerifier, DashboardController.getFuentedeProspectos)

    
    .get('/dashboard/prospectos-mes',TokenVerifier, DashboardController.getProspectosporMes)


    // .get('/dashboard/fuente-prospectos',TokenVerifier, DashboardController.getFuentedeProspectos)
    // .get('/dashboard/prospectos-mes',TokenVerifier, DashboardController.getProspectosporMes)
