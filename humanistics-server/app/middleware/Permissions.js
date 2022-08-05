
const Roles = require('../../models/roles');
const Usuarios = require('../../models/usuarios');


async function isRoot(request, response, next){
    const user = request.user;
    if (request.user.rol_id.nombre == "Empresa"){
        next();
    }else{
        response.status(403).send('No tienes permisos para realizar esta acción.');
    }
}

async function isEmpresa(request, response, next){
    const user = request.user;
    if (request.user.rol_id.nombre == "Empresa"){
        next();
    }else{
        response.status(403).send('No tienes permisos para realizar esta acción.');
    }
}


async function isGerente(request, response, next){
    const user = request.user;
    if (request.user.rol_id.nombre == "Empresa"){
        next();
    }else{
        response.status(403).send('No tienes permisos para realizar esta acción.');
    }
}


async function isVendedor(request, response, next){
    const user = request.user;
    if (request.user.rol_id.nombre == "Empresa"){
        next();
    }else{
        response.status(403).send('No tienes permisos para realizar esta acción.');
    }
}



module.exports = {
    isRoot,
    isEmpresa,
    isGerente,
    isVendedor
};
