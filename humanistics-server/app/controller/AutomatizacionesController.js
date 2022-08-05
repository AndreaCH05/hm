const Automatizaciones = require('../../models/automatizaciones');
const Usuarios = require('../../models/usuarios');
const Proyectos = require('../../models/proyectos');

const Rol = require('../Rol');

const MongooseValidationErrorHandler = require('../../utils/mongoose-validation-error-handler');

/**
 *
 *
 * @class SolicitudesController
 *
 * Sirve para agregar un proveedor
 */
class AutomatizacionesController {


    /**
     * @static
     * @memberof AutomatizacionesController
     *
     * @method add
     * @description Agregar una automatizacion.
     *
     * @request Peticion enviada al servidor desde el front
     * @response Respuesta desde el servidor al front
     */
    static add = async ({body, user}, response) => {

        switch (user.rol_id.nombre) {
            case Rol.Administrador:
                body.user_id = user._id
                break;
            case Rol.Empresa:
                body.user_id = user._id

                break;
            case Rol.Gerente:
                body.user_id = user.parent_user
                break;
            case Rol.Vendedor:
                body.user_id = user.parent_user
                break;
        }
        

        console.log('body', body) 

        // let automatizacion = new Automatizaciones(body);
        // return ;
        let automatizacion = new Automatizaciones(body);
        automatizacion.save()
            .then(automatizacion => {
                response.status(201).json({
                    success: true,
                    id: automatizacion._id,
                    message: 'automatizacion creada.',
                })
            })
            .catch(error =>{
                console.log('error', error);
                response.status(400).json({
                    success: false,
                    error: MongooseValidationErrorHandler(error, { humanize: true, capitalize: true }),
                })
            })
    };

    /**
     * @static
     * @memberof AutomatizacionesController
     *
     * @method update
     * @description Actualiza una automatizacion.
     *
     * @request Peticion enviada al servidor desde el front
     * @response Respuesta desde el servidor al front
     */
    static update = async (request, response) => {


        console.log('request',request.body);
        
        Automatizaciones.findOne({ _id: request.body.id })
            .then(automatizacion => {

                if (request.body.nombre !== undefined) automatizacion.nombre = request.body.nombre;
                if (request.body.accion !== undefined) automatizacion.accion = request.body.accion;
                if (request.body.automatizacion !== undefined) automatizacion.automatizacion = request.body.automatizacion;
                
                if (request.body.notificar_a !== undefined) automatizacion.notificar_a = request.body.notificar_a;
                if (request.body.all_users !== undefined) automatizacion.all_users = request.body.all_users;
                if (request.body.tipo_seleccion !== undefined) automatizacion.tipo_seleccion = request.body.tipo_seleccion;
                if (request.body.fb_form_id !== undefined) automatizacion.fb_form_id = request.body.fb_form_id;
                
                
                if (request.body.activo !== undefined) automatizacion.activo = request.body.activo;


                automatizacion.save()
                    .then(() => {
                        response.status(200).json({
                            success: true,
                            message: 'Automatizacion Actualizada.'
                        })
                    })
                    .catch(error => {

                        console.log('error', error);
                        response.status(400).json({
                            success: false,
                            message: 'Automatizacion no actualizada.',
                            error: MongooseValidationErrorHandler(error, { humanize: true, capitalize: true }),
                        })
                    })

            })
            .catch(error =>{
                console.log('error', error);
                response.status(400).json({
                    success: false,
                    error: MongooseValidationErrorHandler(error, { humanize: true, capitalize: true }),
                })
            });
    };

    /**
     * @static
     * @memberof AutomatizacionesController
     *
     * @method delete
     * @description Elimina una automatizacion segun el id.
     *
     * @response Respuesta desde el servidor al front
     */
    static delete = async (request, response) => {
        Automatizaciones.deleteOne({ _id: request.query.id })
            .then(async automatizacion => {
                response.status(200).json({
                    success: true,
                    message: "Se ha eliminado la automatizacion."
                })
            })
            .catch(error =>
                response.status(400).json({
                    success: false,
                    // error: error
                    error: MongooseValidationErrorHandler(error, { humanize: true, capitalize: true }),
                })
            );
    };

    /**
     * @static
     * @memberof AutomatizacionesController
     *
     * @method get
     * @description Obtiene una automatizacion
     *
     * @response Respuesta desde el servidor al front
     */
    static get = async (request, response) => {

        console.log('request.query.id',request.query.id);
        Automatizaciones.findOne({ _id: request.query.id })
            .then(automatizacion => {
                response.status(200).json({
                    success: false,
                    message: 'automatizacion encontrada.',
                    data: automatizacion
                })
            })
            .catch(error =>
                response.status(400).json({
                    success: false,
                    error: MongooseValidationErrorHandler(error, { humanize: true, capitalize: true }),
                })
            )

    };

    /**
     * @static
     * @memberof AutomatizacionesController
     *
     * @param search
     * @description para buscar en las automatizacion.
     *
     * Se busca por nombre de automatizacion o usuario a notificar
     * */
    static list = async ({query, user}, response) => {
        let body = query;
        query = (body.search !== undefined) ? {
            $or: [
                {
                    nombre: new RegExp(body.search, 'ig')
                },
                {
                    notificar_a: new RegExp(body.search, 'ig')
                }
            ]
        } : {};

        switch (user.rol_id.nombre) {
            case Rol.Administrador:
                //Todas
                break;
            case Rol.Empresa:
                query.user_id = user._id
                break;
            case Rol.Gerente:
                query.user_id = user.parent_user
                break;
            case Rol.Vendedor:
                query.user_id = user.parent_user
                break;
        }
        
        Automatizaciones.find(query)
            .populate('proyecto_id')
            .populate('red_social_id')
            .then(success => {
                response.json({
                    success: true,
                    message: 'Lista de Automatizaciones',
                    data: success
                })
            }
            )
            .catch(error => response.json({
                success: false,
                message: 'Lista de Automatizaciones',
                data: MongooseValidationErrorHandler(error, { humanize: true, capitalize: true }),
            }))
    };
}

module.exports = AutomatizacionesController;

