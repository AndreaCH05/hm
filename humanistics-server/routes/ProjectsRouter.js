const express = require('express');
const ProjectsController = require('../app/controller/ProjectsController');
const router = express.Router();

const verificar = require('../app/middleware/TokenVerifier');
const {isEmpresa} = require('../app/middleware/Permissions');

module.exports = router
    .post('/projects/add',[
        verificar,
        // Permissions.isAdmin
    ],ProjectsController.add)

    .post('/projects/update',[
        verificar,
        // Permissions.isAdmin
    ],ProjectsController.update)

    .post('/projects/delete',[
        verificar,
        isEmpresa
    ],ProjectsController.delete)

    .post('/projects/get',[
        verificar,
    ],ProjectsController.get)

    .get('/projects',[
        verificar,
    ],ProjectsController.list)



    .post('/projects/paginado',[
        verificar,
    ],ProjectsController.paginado)


    .post('/projects/id/users',[
        verificar,
    ],ProjectsController.users)


    .get('/projectsList',[
    ],ProjectsController.lista)


