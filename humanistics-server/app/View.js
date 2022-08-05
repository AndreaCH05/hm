const handlebars = require('handlebars');
const path = require('path');
const fs = require('fs');
const base32 = require('base32')

const appRoot = require('app-root-path');
const moment = require('moment')


const sharp = require('sharp');
const mime = require('mime');
let arreglos = {}

/**
 * @class View
 * @description Genera una vista de Handlebears
 */
module.exports = class View {

    /**
     * @memberOf View
     * @var views_path
     * @description Localizacion para obtener las vistas de handlebars
     * */
    views_path = path.join(__dirname, '../resources/views/');

    /**
     * @memberOf View
     * @var values
     * @description Son los valores a substituir
     * */
    values = {};

    /**
     * @memberOf View
     * @var source
     * @description Archivo de Handlebars sin procesar
     * */
    source = null;

    /**
     * @memberOf View
     * @var template
     * @description Archivo de Handlebars procesado
     * */
    template = () => { };


    /**
     * @memberOf View
     * @var template
     * @description Archivo de Handlebars con los valores sustituidos.
     * */
    output = null;

    constructor(template = '', values = {}) {
        this.registerHelpers();
        this.source = fs.readFileSync(this.views_path + template + '.handlebars', 'utf-8');
        this.values = {
            ...values,
        };
    }


    /**
     * @methodOf View
     *
     * @function registerHelpers
     * @description Registra helpers como los assets y jalar archivos del storage
     *
     * */
    registerHelpers() {

        /**
         * @helper asset
         * @function Obtiene un archivo IMAGEN desde el public path
         * */
        handlebars.registerHelper('asset', function (asset) {
            return process.env.URL + '/' + asset
        });


        /**
         * @helper asset
         * @function Obtiene del servidor un asset, de la carpeta publica.
         * */
        handlebars.registerHelper('_asset', function (asset) {
            return process.env.HOST + '/' + asset
        });


        /**
         * @helper asset
         * @function Obtiene del servidor un asset, de la carpeta publica.
         * */
        handlebars.registerHelper('recovery', function (asset) {
            return ''
        });


         /**
         * @helper asset
         * @function Obtiene ruta primer login
         * */
          handlebars.registerHelper('setPassword', function(){
            return ''
        });



            /**
         * @helper login
         * @function Obtiene ruta para login
         * */
             handlebars.registerHelper('login', function () {
                return process.env.HOST + '/login'
            });
    

        /**
     * @helper serverAsset
     * @function Obtiene del servidor un asset, de la carpeta publica.
     * */
        handlebars.registerHelper('reduceImageServerAsset', function (asset) {
            filename = `./storage/uploads/${filename}`;
            if (fs.existsSync(asset)) {
                sharp(asset)
                    .rotate()
                    .resize(1000)
                    .toBuffer()
                    .then(data => response
                        .header("Content-Type", mime.getType(data))
                        .status(200)
                        .end(data)
                    )
                    .catch(err => {
                        console.log('err')
                    });
            } else {
                return response
                    .status(403)
                    .end("Forbidden.");
            }
        });


        /**
         * @helper serverAsset
         * @function Obtiene del servidor un asset, de la carpeta publica.
         * */
        handlebars.registerHelper('serverAsset', function (asset) {
            return path.join('file://', appRoot.path + '\\public\\', asset)
        });


        /**
         * @helper font
         * @function Obtiene una fuente
         * */
        handlebars.registerHelper('font', function (asset) {
            
            return path.join('file://', appRoot.path + '\\public\\fonts\\', asset)

        });

        /**
         * @helper storage
         * @function Obtiene una imagen del storage
         * */
        handlebars.registerHelper('storage', function (asset) {

            return process.env.HOST + '/upload/' + asset
            // return path.join('file://', appRoot.path + '\\storage\\uploads\\', 'A-' + asset)
        });

        /**
         * @helper moment
         * @function Obtiene formatea una fecha al formato recibido
         * */
        handlebars.registerHelper('moment', (date, format) => moment(date).format(format));

        handlebars.registerHelper('length', (value) => value.length);

        handlebars.registerHelper('consoleLog', (value, name) => console.log('\n', name, value));

        handlebars.registerHelper('index', e => parseInt(e) + 1);

        handlebars.registerHelper('notFirst', e => e != 0)
        handlebars.registerHelper('ver_encuesta', id => process.env.URL + '/admin/ver-encuesta/' + id);
        handlebars.registerHelper('encuesta', id => process.env.URL + '/encuesta/' + id);
        handlebars.registerHelper('money', function (float) { return parseFloat(float).toFixed(2) });


        handlebars.registerHelper('setImagenes', function (imagenes) {
            arreglos = {};
            for (const imagen of imagenes) {

                if (arreglos.primero == undefined) {
                    arreglos.primero = imagen.votos
                }
                else if (arreglos.segundo == undefined && arreglos.primero !== imagen.votos) {
                    arreglos.segundo = imagen.votos
                } else if (arreglos.tercero == undefined && arreglos.segundo !== imagen.votos) {
                    arreglos.tercero = imagen.votos
                }
            }



        });

        handlebars.registerHelper('setImagenescantidad', function (imagenes) {
            arreglos = {};
            for (const imagen of imagenes) {
                if (arreglos.primero == undefined) {
                    arreglos.primero = imagen.resultados
                } else if (arreglos.segundo == undefined && arreglos.primero !== imagen.resultados) {
                    arreglos.segundo = imagen.resultados
                } else if (arreglos.segundo != undefined && arreglos.tercero == undefined && arreglos.segundo !== imagen.resultados) {
                    arreglos.tercero = imagen.resultados
                }
            }
           
        });

        handlebars.registerHelper('tipoImagen', function (votos) {


            // <!-- BORDE GRIS PARA IMAGENES X -->
            // <!--BACKGOUND-->
            // <!--    1 er background-color: #B9DEC4-->
            // <!--    2 er background-color: #ACC3FB-->
            // <!--    3 er background-color: #E8C3B0-->

            switch (votos) {
                case arreglos.primero:
                    return "background-color: #B9DEC4";
                    break;
                case arreglos.segundo:
                    return "background-color: #ACC3FB";
                    break;
                case arreglos.tercero:
                    return "background-color: #E8C3B0";
                    break;
                default:
                    return "border: 2px solid #C4C4C4";
                    break;
            }
        });

        handlebars.registerHelper('qr', function (token) {
            return process.env.HOST + '/qrs/get?token=' + token
        });

        handlebars.registerHelper('welcome', function (token, email) {
            return process.env.URL + `/register/email-${email}/token-${(token)}`
        });


    }




    /**
     * @methodOf View
     *
     * @function generate
     * @description Genera la vista con base a los parametros indicados.
     * */
    static render(template, values) {
        let view = new View(template, values);
        view.render()
        return view;
    }


    /**
     * @methodOf View
     *
     * @function generate
     * @description Genera la vista con base a los parametros indicados.
     * */
    render() {
        this.template = handlebars.compile(this.source);
        this.output = this.template(this.values);
        return this.output;
    }



};
