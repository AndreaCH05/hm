
/**
 * Modulo para Crear Controladores, modelos y rutas
 *
 *
 * Para ejecutar el modulo de control, se ejecuta el siguiente comando:
 *
 *
 * npm run command + Parametros
 *
 *
 * -- Parametros y comandos --
 *
 * Crear controlador
 * ´create-controler=NameController´
 *
 *
 * Crear Modelo
 * create-model=Name
 *
 *
 * Crear Ruteador
 * create-router=RouterName
 *
 * */
const fs = require('fs');
let app = require('./app');


process.argv.forEach(async function (val, index, array) {
    let parameters = val.split("=");
    let command = parameters[0];
    let value = parameters[1];
    switch (command) {
        case 'create-controller':
            console.log("Creating Controller " + value + '.js');
            await createController(value);
            break;
        case 'create-model':
            console.log("Creating Mongoose Model " + value + '.js');
            await createModel(value);
            break;
        case 'create-router':
            console.log("Creating Router " + value + '.js');
            await createRouter(value);
            break;

        case 'routes':
            app._router.stack.forEach(function(r){
                if (r.route && r.route.path){
                    console.log(r.route.path)
                }
            })
            break;
    }

});

async function createController(value) {

    let stream = fs.createWriteStream('./controllers/' +value + ".js");
    stream.once('open', function(fd) {
        stream.write
(`/**
 * @class `+ value +`.js
 * @description 
 */
class `+ value +`{

    /**
     * @static
     * @memberof `+ value +`
     * 
     * @method add
     * @description
     * */
    static add = async (request, response) =>{

    };
}
module.exports = `+ value +`;
`);
        // stream.write("My first row\n");
        // stream.write("My second row\n");
        stream.end();
    });
    console.log("Created Controller " + value+ ".js!")
}
async function createModel(value) {
    let valueU = value.slice(0,1).toUpperCase() + value.slice(1,value.length );
    let stream = fs.createWriteStream('./models/' +value + ".js");
    stream.once('open', function(fd) {
        stream.write
        (`
const Mongoose = require('mongoose');

const `+ valueU +` = new Mongoose.Schema(
    {
        nombre: {
            type: String,
            required: true,
        },
    },{
        timestamps:true,
    },
);

module.exports = mongoose.model('`+ value +`',`+ valueU +`);`);
        // stream.write("My first row\n");
        // stream.write("My second row\n");
        stream.end();
        console.log("Model Created " + value+ ".js!")
    });

}
async function createRouter(value) {

    let stream = fs.createWriteStream('./routes/' +value + ".js");
    stream.once('open', function(fd) {
        stream.write
        (`const express = require('express');
const router = express.Router();

/*
    Rutas de acceso para las URLs del servidor
*/
router.get('/',function(request, response){
    return response.status(200).json({
        message:'Usuario registrado!'
    })
});

module.exports = router;
`);
        stream.end();
    });
    console.log("Router created " + value+ ".js!")

}
