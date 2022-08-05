const mongoose = require('mongoose');


const Usuarios = require('../../models/usuarios');
const Prospectos = require('../../models/prospectos');
const Proyectos = require('../../models/proyectos');
const Estatus = require('../../models/estatus');

const csv = require('csv');
const qs = require('qs');
const Mail = require('../../app/Mail');

const MongooseValidationErrorHandler = require('../../utils/mongoose-validation-error-handler');
const usuarios_proyectos = require('../../models/usuarios_proyectos');
const moment = require('moment')
const bizSdk = require('facebook-nodejs-business-sdk');
const ErrorHandler = require('../../utils/mongoose-validation-error-handler/index');

const { ObjectId } = mongoose.Types

/**
 *
 *
 * @class ProspectosController
 *
 * Sirve para administrar prospectos
 */
class ProspectosController {



    /**
     * @static
     * @memberof ProspectosController
     *
     * @method add
     * @description Agrega un nuevo prospecto.
     *
     * @request Peticion enviada al servidor desde el front
     * @response Respuesta desde el servidor al front
     */
    static add = async (request, response) => {

        let prospecto = new Prospectos(request.body);

        console.log('---------AGREGAR PROSPECTO', request.body)

        const user = request.user;

        prospecto.actividad = [{
            usuario: request.user._id,
            entrada: "Se ha creado el prospecto."
        }];

        prospecto.usuarios_id = request.user._id;
        prospecto.asignado_por = request.user._id;


        let estatus = await Estatus.findOne({ _id: request.body.estatus });
        let proyecto = await Proyectos.findOne({ _id: request.body.proyectos_id })

        prospecto.save()
            .then(prospecto => {

                //Se envia correo de bienvenida
                let mail = new Mail({
                    subject: 'Nuevo Prospecto, ' + user.nombre + '!',
                    template: 'nuevo_prospecto',
                    values: {
                        proyecto: proyecto.nombre,
                        logo_proyecto:proyecto.logo,
                        proyecto_inits:proyecto?.nombre.split(/\s/).reduce((response, word) => response += word.slice(0, 1), ''),
                        color_proyecto:(proyecto.color)?proyecto.color:'#dadada',
                        estatus: estatus.nombre,
                        color_estatus: estatus.color,
                        usuario: request.user.nombre
                    },
                    user: request.user
                })

                mail.send(e => console.log(e)).then().catch(e => console.log(e))
                return response.status(200).json({
                    success: true,
                    message: 'Prospecto creado.',
                    id: prospecto._id,
                })
            })
            .catch(error => {
                console.log('error', error)
                response.status(400).json({
                    success: false,
                    error:  ErrorHandler(error, { capitalize: true, humanize: true }),

                })
            })
    };
    /**
     * @static
     * @memberof ProspectosController
     *
     * @method update
     * @description Actualiza una prospecto.
     *
     * @request Peticion enviada al servidor desde el front
     * @response Respuesta desde el servidor al front
     */
    static update = async (request, response) => {


        console.log('request body', request.body)
        Prospectos.findOne({ _id: request.body.id })
            .then(async prospecto => {

                let history = [];

                if (request.body.nombre !== undefined && request.body.nombre !== prospecto.nombre) {
                    history.push({
                        entrada: `Se ha actualizado el nombre de ${prospecto.nombre} a ${request.body.nombre}.`,
                        usuario: request.user._id,
                    })
                    prospecto.nombre = request.body.nombre;
                }

                if (request.body.telefono !== undefined && request.body.telefono !== prospecto.telefono) {
                    history.push({
                        entrada: `Se ha actualizado el telefono de ${prospecto.telefono} a ${request.body.telefono}.`,
                        usuario: request.user._id,
                    });
                    prospecto.telefono = request.body.telefono;
                }

                if (request.body.fuente !== undefined && request.body.fuente !== prospecto.fuente) {

                    let fuentes = {
                        1: 'Humanistics',
                        2: 'Facebook',
                        3: 'Instagram',
                    }

                    history.push({
                        entrada: `Se ha actualizado la fuente de ${fuentes[prospecto.fuente]} a ${fuentes[request.body.fuente]}.`,
                        usuario: request.user._id,
                    });
                    prospecto.fuente = request.body.fuente;
                }

                if (request.body.fecha !== undefined && request.body.fecha !== prospecto.fecha) {
                    history.push({
                        entrada: `Se ha actualizado la fecha de ${moment(prospecto.fecha).format('DD-MM-YY')} a ${moment(request.body.fecha).format('DD-MM-YY')}.`,
                        usuario: request.user._id,
                    });
                    prospecto.fecha = request.body.fecha;
                }

                if (request.body.email !== undefined && request.body.email !== prospecto.email) {
                    history.push({
                        entrada: `Se ha actualizado el email de ${prospecto.email} a ${request.body.email}.`,
                        usuario: request.user._id,
                    });
                    prospecto.email = request.body.email;
                }

                if (request.body.estatus !== undefined && request.body.estatus.toString() !== prospecto.estatus?.toString()) {

                    let estatus_ant = prospecto.estatus ? (await Estatus.findOne({ _id: prospecto.estatus })).nombre : 'N/A'

                    history.push({
                        entrada: `Se ha actualizado el estatus de ${estatus_ant} a ${(await Estatus.findOne({ _id: request.body.estatus })).nombre}.`,
                        usuario: request.user._id,
                    });

                    prospecto.estatus = request.body.estatus;

                    let asignado_a = await Usuarios.findOne({ _id: prospecto.usuarios_id });
                    let estatus = await Estatus.findOne({ _id: prospecto.estatus });
                    let proyecto = await Proyectos.findOne({ _id: prospecto.proyectos_id });
                    let mail;
                    // if (estatus.ponderacion?.toString() == '100') {

                    //     prospecto.fecha_completado = new Date()

                    //     mail = new Mail({
                    //         subject: 'Felicidades! Prospecto Concluido',
                    //         template: 'felicidades',
                    //         values: {
                    //             usuario: asignado_a.nombre,
                    //             realizado_por: request.user.nombre,
                    //             prospecto: prospecto.nombre,
                    //             estatus: estatus.nombre,
                    //             color: estatus.color,
                    //         },
                    //         user: asignado_a
                    //     })
                    // } else {

                    //     prospecto.fecha_completado = null

                    //     mail = new Mail({
                    //         subject: 'Estatus actualizado',
                    //         template: 'cambio_estatus',
                    //         values: {
                    //             realizado_por: request.user.nombre,
                    //             prospecto: prospecto.nombre,
                    //             estatus: estatus.nombre,
                    //             color: estatus.color,
                    //             proyecto: proyecto.nombre,
                    //         },
                    //         user: asignado_a
                    //     })
                    //     mail.send();
                    // }


                }

                if (request.body.pasos !== undefined) {
                    if (JSON.stringify(request.body.pasos) !== JSON.stringify(prospecto.pasos)) {
                        history.push({
                            entrada: `Se ha actualizado la lista de tareas.`,
                            usuario: request.user._id,
                        });
                        prospecto.pasos = request.body.pasos;
                    }
                }

                console.log('usuario anterior', prospecto.usuarios_id)
                if (request.body.asignado_a !== undefined && (prospecto.usuarios_id == null || request.body.asignado_a !== prospecto.usuarios_id)) {

                    let asignado_de = await Usuarios.findOne({ _id: prospecto.usuarios_id }).select('-password')
                    let asignado_a = await Usuarios.findOne({ _id: request.body.asignado_a }).select('-password')


                    let estatus = await Estatus.findOne({ _id: prospecto.estatus });
                    let proyecto = await Proyectos.findOne({ _id: prospecto.proyectos_id });

                    history.push({
                        entrada: `Se ha actualizado el usuario asignado de ${asignado_de.nombre} a ${asignado_a.nombre}.`,
                        usuario: request.user._id,
                    });

                    prospecto.usuarios_id = request.user._id;
                    prospecto.asignado_por = request.body.asignado_a;

                    let mail = new Mail({
                        subject: 'Nuevo Prospecto Asignado',
                        template: 'cambio_prospecto',
                        values: {
                            asignado_a: asignado_a.nombre,
                            color: estatus?.color,
                            estatus: estatus?.nombre,
                            proyecto: proyecto.nombre,
                        },
                        user: asignado_a
                    })
                    //mail.send();

                }

                if (request.body.descripcion !== undefined && request.body.descripcion !== prospecto.descripcion) {
                    history.push({
                        entrada: `Se ha actualizado la descripcion de ${prospecto.descripcion} a ${request.body.descripcion}.`,
                        usuario: request.user._id,
                    });
                    prospecto.descripcion = request.body.descripcion;
                }

                //actualizar los comentarios del Prospecto
                if (request.body.comment !== undefined && request.body.adjuntos) {

                    history.push({
                        entrada: request.body.comment,
                        usuario: request.user._id,
                        comment: true,
                        files: request.body.adjuntos
                    });

                    prospecto.adjuntos.push(request.body.adjuntos[0])


                } else if (request.body.comment !== undefined) {

                    history.push({
                        entrada: request.body.comment,
                        usuario: request.user._id,
                        comment: true
                    });

                    let asignado_a = await Usuarios.findOne({ _id: prospecto.usuarios_id }).select('-password')
                    let mail;


                    mail = new Mail({
                        subject: 'Ha comentado en Prospecto',
                        template: 'cambio_estatus',
                        values: {
                            realizado_por: request.user.nombre,
                            prospecto: prospecto.nombre,
                        },
                        user: asignado_a
                    });

                    //mail.send();
                }

                // segmentos
                if (request.body.segmentos) {
                    let segmentos = prospecto.segmentacion
                    let segmento_id = Object.keys(request.body.segmentos)[0]
                    let clase_id = Object.values(request.body.segmentos)[0]

                    let index = segmentos.findIndex(s => s.segmento_id.toString() == segmento_id.toString())

                    if (index == -1)
                        segmentos.push({ segmento_id, clase_id })
                    else
                        segmentos[index].clase_id = clase_id

                }


                prospecto.actividad = prospecto.actividad.concat(history);

                prospecto.save()
                    .then(async () => {

                        response.status(200).json({
                            success: true,
                            message: 'Prospecto Actualizado.'
                        })
                    })
                    .catch(error => {
                        console.log('error', error)
                        response.status(400).json({
                            success: false,
                            message: 'Prospecto no actualizado.',
                            error: MongooseValidationErrorHandler(error, { humanize: true, capitalize: true }),
                        })
                    })

            })
            .catch(error => {
                console.log('error', error)
                response.status(400).json({
                    success: false,
                    error: MongooseValidationErrorHandler(error, { humanize: true, capitalize: true }),
                })
            }
            );
    };

    /**
     * @static
     * @memberof ProspectosController
     *
     * @method delete
     * @description Elimina un prospecto.
     *
     */
    static delete = async (request, response) => {
        Prospectos.deleteOne({ _id: request.body.id })
            .then(async plan => {
                response.status(200).json({
                    success: true,
                    message: "Se ha eliminado el prospecto."
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
     * @memberof ProspectosController
     *
     * @method get
     * @description Obtiene una prospecto
     *
     * @request Informacion de la solicitud
     * @response Respuesta desde el servidor al front
     */
    static get = async (request, response) => {
        Prospectos.findOne({ _id: request.query.id })
            .populate(
                {
                    path: 'actividad',
                    populate: {
                        path: 'usuario',
                        model: 'usuarios'
                    }
                }
            ).populate('estatus')
            .then(prospecto => {
                // let pro = JSON.parse(JSON.stringify(prospecto));
                // pro.actividad = pro.actividad.map(actividad => {
                //     if (actividad.usuario._id == request.user._id)
                //         actividad.isUser = true;
                //     else
                //         actividad.isUser = false;
                //     return actividad;

                // });
                return response.status(200).send({
                    success: true, data: prospecto
                })
            })
            .catch(error => {
                console.log(error)
                return response.status(400).send({
                    success: false,
                    error: error
                })
            })
    };

    /**
     * @static
     * @memberof ProspectosController
     *
     * @param search Text
     * @param segmento_id ObjectId
     * @param proyecto_id ObjectId
     * @param estatus_id  ObjectId
     * @param plain 
     * @param start Date
     * @param end Date
     * @param asesor_id OBjectId
     * @param fuente String
     * @description permite buscar y generar la paginacion de planes.
     *
     * @function list
     * @description Obtiene el paginado de prospectos.
     * */
    static list = async (request, response) => {
        let body = request.query;

        // console.log('body', body)
        let buscar = (body.search == undefined) ? '.*' : body.search + '.*'

        const options = {
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
        };


        let pipeline = []


        if (body.segmento_id) {

            const segmentacion = qs.parse(body.segmento_id)

            for (const [segmento_key, segmento_values] of Object.entries(segmentacion)) {

                pipeline.push({
                    '$match': {
                        'segmentacion.segmento_id': mongoose.Types.ObjectId(segmento_key)
                    }
                })

                if (typeof segmento_values === "object") {

                    for (const [clases_key, clases_values] of Object.entries(segmento_values)) {
                        pipeline.push({
                            '$match': {
                                'segmentacion.clase_id': mongoose.Types.ObjectId(clases_key)
                            }
                        })
                    }

                }
            }




        }


        if (body.proyecto_id)
            pipeline.push({
                '$match': {
                    'proyectos_id': mongoose.Types.ObjectId(body.proyecto_id)
                }
            })

        if (body.estatus_id)
            pipeline.push({
                '$match': {
                    'estatus': Array.isArray(body.estatus_id) ? { '$in': body.estatus_id.map(e => ObjectId(e)) } : mongoose.Types.ObjectId(body.estatus_id)
                }
            })


        pipeline.push(
            {
                '$lookup': {
                    'from': 'usuarios',
                    'localField': 'asignado_por',
                    'foreignField': '_id',
                    'as': 'asesor'
                }
            },
            {
                '$lookup': {
                    'from': 'proyectos',
                    'localField': 'proyectos_id',
                    'foreignField': '_id',
                    'as': 'proyectos'
                }
            },

            {
                '$addFields': {
                    'asesor': {
                        '$arrayElemAt': [
                            '$asesor', 0
                        ]
                    },
                    'proyecto': {
                        '$arrayElemAt': [
                            '$proyectos', 0
                        ]
                    },

                }
            }, {
            '$project': {
                '_id': 1,
                'nombre': 1,
                'telefono': 1,
                'email': 1,
                'estatus': 1,
                'fuente': 1,
                'fecha': 1,
                'createdAt': 1,
                'asesor._id': 1,
                'asesor.nombre': 1,
                'asesor.color': 1,
                'proyecto': 1
            }
        }, {
            $sort: {
                createdAt: -1
            }
        }
        )


        /**
         * 0 -> Perdido
         * 1 -> Activo
         * 2-> Completado
         * */
        if (body.plain)
            pipeline.push({
                '$lookup': {
                    'from': 'estatuses',
                    'localField': 'estatus',
                    'foreignField': '_id',
                    'as': 'estatuses'
                }
            },
                {
                    '$addFields': {
                        'estatuses': { '$arrayElemAt': ['$estatuses', 0] }
                    }
                },
                {
                    '$match': {
                        '$or': [
                            { 'estatuses.tipo': { '$eq': 0 } },
                            { 'estatuses.tipo': { '$eq': 3 } }
                        ]
                    }
                })


        if (body.start || body.end) {
            if (body.start)
                pipeline.push({
                    '$match': {
                        'createdAt': {
                            $gte: new Date(body.start),

                        }
                    }
                })

            if (body.end)
                pipeline.push({
                    '$match': {
                        'createdAt': {
                            $lte: new Date(body.end)
                        }
                    }
                })
        }


        if (body.asesor_id) {
            if (Array.isArray(body.asesor_id)) {
                if (body.asesor_id.length > 0)
                    pipeline.push({
                        '$match': {
                            'asesor._id': { '$in': body.asesor_id.map(a => mongoose.Types.ObjectId(a)), }
                        }
                    })
            } else pipeline.push({
                '$match': {
                    'asesor._id': mongoose.Types.ObjectId(body.asesor_id),
                }
            })

        }

        if (body.fuente) {

            pipeline.push({
                '$match': {
                    'fuente': parseInt(body.fuente),
                }
            })
        }


        // let prospectos_aggregate = await Prospectos.aggregate(pipeline)
        // let prospectos = await Prospectos.aggregatePaginate(prospectos_aggregate, options)
        // console.log('- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - ',body)
        // console.log('- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - ')
        // console.log('- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - ')
        // console.log('- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - ')
        // console.log('- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - ')
        // console.log(require('util').inspect(pipeline, false, null, true /* enable colors */))
        return response.status(200).json({
            success: true,
            message: 'lista de prospectos',
            data: await Prospectos.aggregatePaginate(Prospectos.aggregate(pipeline), options)//(body.plain) ?  : await Prospectos.aggregate(pipeline)
        })


        
    };






    static csv = async (request, response) => {
        const body = request.body;
        let prospectos = ProspectosController.getQueryList(request);


        prospectos.push({
            $project: {
                nombre: '$nombre',
                email: '$email',
                telefono: '$telefono',
                asesor: '$asesor.nombre',
                fecha: '$createdAt',
            }
        });
        prospectos = await Prospectos.aggregate(prospectos);

        csv.stringify([
            { a: '1', b: '2' },
            { a: '2', b: '5' },
            { a: '3', b: '6' },
        ], {
            columns: ['a', 'b']
        }, function (err, data) {

        })



        csv.stringify(prospectos, {
            columns: [
                { key: '_id' },
                { key: 'nombre' },
                { key: 'email' },
                { key: 'telefono' },
                { key: 'asesor' },
                { key: 'fecha' },
            ]
        }, function (err, data) {

            return response.status(200).json({
                success: true,
                message: "Prospectos asignados del usuario.",
                data: prospectos
            });

        })


    };



}

module.exports = ProspectosController;
