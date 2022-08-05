const express = require('express')




const AuthController = require('../app/controller/AuthController');
//
const TokenVerifier = require('../app/middleware/TokenVerifier');

const router = express.Router();



module.exports = router
    .post('/login', AuthController.login)

    /** Se agregar la informacion del avatar y el color **/
    .post('/facebook', AuthController.facebook)

    /** Step by Step **/
    /** Registro del Usuario **/

    .post('/register', AuthController.register)
    .get('/logged', TokenVerifier, AuthController.hasPermission)

    /** Se agregar la informacion del avatar y el color **/
    .post('/register/avatar', TokenVerifier, AuthController.avatar)

    /** Se agregar la información restante del primer proyecto **/
    .post('/register/project', TokenVerifier, AuthController.project)

    /** Se agrega la informacion del primer proyecto pero del siguiente paso.  */
    .post('/register/config', TokenVerifier, AuthController.config)

    /** Se agrega los status de los proyectos.  */
    .post('/register/status', TokenVerifier, AuthController.status)

    /** Se agrega los status de los proyectos.  */
    // .post('/register/prospectos', TokenVerifier,AuthController.prospectos)

    // .put('/usuario/update',[TokenVerifier,], AuthController.update)

    .get('/usuario/admin', [TokenVerifier,], AuthController.isAdmin)
    
    // .put('/password/recovery', AuthController.recovery)

    // .put('/password/recovery/update', AuthController.updatePasswordTokenizer)

    // .put('/password/update', [TokenVerifier,], AuthController.updatePassword)

    // .put('/password/setPassword', AuthController.setPassword)

    .get('/user/logged', [TokenVerifier,], AuthController.logged)

    .put('/password/recovery',  AuthController.recovery)
    .put('/password/recovery/update',  AuthController.updatePasswordTokenizer)

module.exports = router;
