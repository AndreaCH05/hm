    const http = require('http');
const https = require('https');
const fs = require('fs');

const db = require('./db');
let app = require('./app');
let io = require('socket.io')


console.log(require('fb'));

//CONEXION A LA BASE DE DATOS
db.once('open', function(){
    console.log('Conexion abierta a la base de datos.')
});
db.on('error', console.error.bind(console,'Error de conexion en la base de datos.'));

const PORT = 4001; //Puerto en el que se ejecuta el servidor
const PORT_SSH = 8000; //Puerto en el que se ejecuta el servidor HTTPS



/**
 * Creamos la aplicacion HTTP
 */
let httpServer = null;

/**
 * Creamos la aplicacion y esperamos respuesta del servidor.
 */
if (require('./package.json').ssl){

    /**
     * Importamos las llaves
     */
    let options = {
        key: fs.readFileSync('/etc/letsencrypt/live/humanistics.mx/privkey.pem'),
        cert: fs.readFileSync('/etc/letsencrypt/live/humanistics.mx/cert.pem'),
        ca: fs.readFileSync('/etc/letsencrypt/live/humanistics.mx/chain.pem')
    };

    httpServer = https.createServer(options, app);
    httpServer.listen(PORT, () => {
        console.log('HTTPS Server running on port '+PORT);
    });
}else{
    httpServer = http.createServer(app);
    httpServer.listen(PORT, () => {
        console.log('HTTP Server running on port '+PORT);
    });
}

require('./app/Socket').serverSocket(httpServer)

//PREGUNTAR POR LOS SEEDERS
const readline = require("readline");
const rl = readline.createInterface({input: process.stdin, output: process.stdout});


(new Promise(resolve => setTimeout(resolve, 1000))).then(() =>
    rl.question(`Indica "Y" para ejecutar los seeders: `, function (answer) {
        if (answer == "Y") require('./db/Seeders/Seeder')();
        else console.log("Gracias, no se ejecutaron los seeders")
    }))
