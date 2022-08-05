const Industrias = require('../../models/industrias');
const Usuarios = require('../../models/usuarios');


const Planes = require('../../models/planes');
const Pagos = require('../../models/pagos');
const MongooseValidationErrorHandler = require('../../utils/mongoose-validation-error-handler');

/**
 *
 *
 * @class PlanesController
 *
 * Sirve para administrar planes
 */
class PlanesController {


    /**
     * @static
     * @memberof PlanesController
     *
     * @method add
     * @description Agrega un nuevo plan.
     *
     * @request Peticion enviada al servidor desde el front
     * @response Respuesta desde el servidor al front
     */
    static add = async (request, response) => {
        let planes = new Planes(request.body);
        planes.save()
            .then(planes => {
                response.status(201).json({
                    success: true,
                    id: planes._id,
                    message: 'Plan creado.',
                })
            }
            )
            .catch(error =>
                response.status(400).json({
                    success: false,
                    error: MongooseValidationErrorHandler(error, { humanize: true, capitalize: true }),
                })
            )
    };

    /**
     * @static
     * @memberof PlanesController
     *
     * @method update
     * @description Actualiza una plan.
     *
     * @request Peticion enviada al servidor desde el front
     * @response Respuesta desde el servidor al front
     */
    static update = async (request, response) => {
        Planes.findOne({ _id: request.body.id })
            .then(plan => {
                if (request.body.nombre                 !== undefined) plan.nombre          = request.body.nombre;
                if (request.body.descripcion            !== undefined) plan.descripcion     = request.body.descripcion;
                if (request.body.personalizado          !== undefined) plan.personalizado   = request.body.personalizado;

                    //costos
                if (request.body.costo_anual    !== undefined) plan.costo_anual     = request.body.costo_anual;
                if (request.body.costo_mensual  !== undefined) plan.costo_mensual   = request.body.costo_mensual;

                // costos prospectos
                if (request.body.costo_prospecto_mensual     !== undefined) plan.costo_prospecto_mensual      = request.body.costo_prospecto_mensual;
                if (request.body.costo_prospecto_anual       !== undefined) plan.costo_prospecto_anual        = request.body.costo_prospecto_anual;

                // prospectos
                if (request.body.prospectos_mensuales     !== undefined) plan.costo_prospectos_mensual      = request.body.costo_prospectos_mensual;
                if (request.body.prospectos_anuales       !== undefined) plan.prospectos_anuales        = request.body.prospectos_anuales;

                if (request.body.usuarios       !== undefined) plan.usuarios        = request.body.usuarios;
                if (request.body.tipo           !== undefined) plan.tipo            = request.body.tipo;
                if (request.body.active         !== undefined) plan.active          = request.body.active;
                plan.save()
                    .then(() => {
                        response.status(200).json({
                            success: true,
                            message: 'Plan Actualizado.'
                        })
                    })
                    .catch(error => {
                        response.status(400).json({
                            success: false,
                            message: 'Plan no actualizado.',
                            error: MongooseValidationErrorHandler(error, { humanize: true, capitalize: true }),
                        })
                    })

            })
            .catch(error =>
                response.status(400).json({
                    success: false,
                    error: MongooseValidationErrorHandler(error, { humanize: true, capitalize: true }),
                })
            );
    };

    /**
     * @static
     * @memberof PlanesController
     *
     * @method delete
     * @description Elimina un plan.
     *
     * @request Si elimina un departamento ELMINARA A TODOS SUS USUARIOS!!!!
     * @response Respuesta desde el servidor al front
     */
    static delete = async (request, response) => {

        let count_pagos = await Pagos.countDocuments({ plan_id: request.body.id });

        console.log('pagos existentes del plan', count_pagos)
        if (count_pagos == 0) {
            Planes.deleteOne({ _id: request.body.id })
                .then(async plan => {
                    response.status(200).json({
                        success: true,
                        message: "Se ha eliminado el plan."
                    })
                })
                .catch(error =>
                    response.status(400).json({
                        success: false,
                        // error: error
                        error: MongooseValidationErrorHandler(error, { humanize: true, capitalize: true }),
                    })
                );
        }
        else {
            response.status(400).json({
                success: false,
                message: "El plan tiene pagos realizados. No se puede eliminar"
            })

        }
    };

    /**
     * @static
     * @memberof PlanesController
     *
     * @method get
     * @description Obtiene una plan
     *
     * @request Informacion de la solicitud
     * @response Respuesta desde el servidor al front
     */
    static get = async (request, response) => {
        Planes.findOne({ _id: request.body.id })
            .then(plan => {
                response.status(200).json({
                    success: false,
                    message: 'Plan Encontrada.',
                    data: plan
                })
            })
            .catch(error =>
                response.status(400).json({
                    success: false,
                    error: MongooseValidationErrorHandler(error, { humanize: true, capitalize: true }),
                })
            );
    };

    /**
     * @static
     * @memberof PlanesController
     *
     * @param search
     * @description permite buscar y generar la paginacion de planes.
     *
     * @function pagination
     * @description Obtiene el paginado de departamentos.
     * */
    static list = async (request, response) => {
        const body = request.query;
        let query = (body.search !== undefined) ? {
            $or: [{
                nombre: new RegExp(body.search, 'ig')
            },]
        } : {};

        if (body.active) {
            query.activo = true;
        }


        if (!(body.pagination)) {
            return response.status(200).json({
                success: true,
                message: 'Lista de plantillas',
                data: await Planes.paginate(query, {
                    page: (body.page == undefined) ? 1 : body.page,
                    limit: (body.limit == undefined) ? 10 : body.limit,
                    customLabels: {
                        totalDocs: 'itemCount',
                        docs: 'itemsList',
                        limit: 'perPage',
                        page: 'currentPage',
                        nextPage: 'next',
                        prevPage: 'prev',
                        totalPages: 'pageCount',
                        pagingCounter: 'slNo',
                        meta: 'paginator'
                    }
                })
            });
        } else {

            return response.status(200).json({
                success: true,
                message: 'Lista de plantillas',
                data: await Planes.find(query)
            });
        }

    };
}

module.exports = PlanesController;

