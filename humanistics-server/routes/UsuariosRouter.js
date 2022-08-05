const UsuariosControlller = require('../app/controller/UsuariosController');
const express = require('express');

const router = express.Router();
const verificar = require('../app/middleware/TokenVerifier');

const {isEmpresa} = require('../app/middleware/Permissions');


// isAdminOnModifyUserRequest

module.exports = router

    .get('/usuarios',  UsuariosControlller.lista)

    .post('/usuarios',verificar,UsuariosControlller.list)
    
    .post('/usuarios/crear',verificar,UsuariosControlller.add)
    
    .post('/usuarios/update',verificar,UsuariosControlller.update)
    
    .post('/usuarios/delete',verificar,UsuariosControlller.delete)
    
    .post('/usuarios/get',verificar,UsuariosControlller.get)
    
    .get('/roles', UsuariosControlller.rolesList)

    .post('/status',verificar,UsuariosControlller.list)

    .get('/usuarios/asesores',verificar,UsuariosControlller.asesoresList)


    .post('/usuarios/cuentas',verificar,UsuariosControlller.CuentasList)

    .post('/usuarios/cuentaInfo',verificar,UsuariosControlller.CuentaProyectos)


;
