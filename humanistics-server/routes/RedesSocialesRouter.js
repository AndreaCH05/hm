const express = require('express');

const RedesSocialesController = require('../app/controller/RedesSocialesController');


const TokenVerifier = require('../app/middleware/TokenVerifier');
const router = express.Router();


module.exports = router

    .get('/redes-sociales', TokenVerifier, RedesSocialesController.listRedesSociales)
    
    .post('/redes-sociales/cuentas', TokenVerifier, RedesSocialesController.facebookPages)
    
    .get('/redes-sociales/forms', TokenVerifier, RedesSocialesController.getForms)


    .delete('/redes-sociales/delete', TokenVerifier, RedesSocialesController.delete)

    .put('/redes-sociales/relation', TokenVerifier, RedesSocialesController.relation)
    .put('/redes-sociales/proyecto', TokenVerifier, RedesSocialesController.proyecto)
    
    .post('/redes-sociales/prospecto', RedesSocialesController.prospectos)
    .get('/redes-sociales/prospecto', RedesSocialesController.prospectos)

    

    .post('/facebook/proyectos/page', TokenVerifier, RedesSocialesController.facebookToProject)
    .get('/facebook/page', TokenVerifier, RedesSocialesController.getFacebookPageByProject)
    

    
    .post('/facebook/adaccounts', TokenVerifier, RedesSocialesController.getAddAccounts)

    


    



