const mongoose = require('mongoose');

const Industrias = require('../../models/industrias');
const Usuarios = require('../../models/usuarios');

const RedesSociales = require('../../models/redes_sociales');

const Proyectos = require('../../models/proyectos');
const Prospectos = require('../../models/prospectos');
const UsuariosProyectos = require('../../models/usuarios_proyectos');
const Estatus = require('../../models/estatus');


const Rol = require('../Rol');

const MongooseValidationErrorHandler = require('../../utils/mongoose-validation-error-handler');
const { query } = require('express-validator');

const { ObjectId } = mongoose.Types

/**
 *
 *
 * @class ProjectsController
 *
 * Sirve para administrar proyectos
 */
class ProjectsController {


    /**
     * @static
     * @memberof ProjectsController
     *
     * @method add
     * @description Agrega un nuevo proyecto.
     *
     * @request Peticion enviada al servidor desde el front
     * @response Respuesta desde el servidor al front
     */
    static add = async (request, response) => {

        request.body.usuarios_id = request.user;

        let proyecto = new Proyectos(request.body);

        proyecto.save()
            .then(async proyecto => {

                if (request.body.estatus != undefined) {

                    for (let x = 0; x < request.body.estatus.length; x++) {
                        request.body.estatus[x].proyectos_id = proyecto._id;
                        request.body.estatus[x].usuarios_id = request.user._id;
                        request.body.estatus[x].tipo = (request.body.estatus[x].tipo == undefined ? 1 : request.body.estatus[x].tipo)
                    }

                    Estatus.insertMany(request.body.estatus)
                        .then(estatus => {
                            console.log("Estatus : ", estatus)

                        })
                        .catch(error => {
                            console.log("Error : ", error)

                            response.status(400).json({
                                success: false,
                                message: "Error al guardar los estatus del proyecto.",
                                error: error
                            })
                        }
                        )
                }



                let usuario_proyecto = new UsuariosProyectos({
                    "usuarios_id": request.user,
                    "proyectos_id": proyecto._id,
                });

                await usuario_proyecto.save()

                return response.status(200).json({
                    success: true,
                    message: "Se guardo proyecto.",
                    proyecto: proyecto,
                })
            })
            .catch(error => {

                console.log("Error : ", error)
                response.status(400).json({
                    success: false,
                    message: "Error al guardar el proyecto",
                    error: MongooseValidationErrorHandler(error, { humanize: true, capitalize: true }),
                })
            }
            )
    };

    /**
     * @static
     * @memberof ProjectsController
     *
     * @method update
     * @description Actualiza una proyecto.
     *
     * @request Peticion enviada al servidor desde el front
     * @response Respuesta desde el servidor al front
     */
    static update = async (request, response) => {

        console.log('edit', request.body)

        Proyectos.findOne({ _id: request.body.id })
            .then(proyecto => {

                if (request.body.nombre !== undefined) proyecto.nombre = request.body.nombre;
                if (request.body.logo !== undefined) proyecto.logo = request.body.logo;
                if (request.body.producto_servicio !== undefined) proyecto.producto_servicio = request.body.producto_servicio;

                if (request.body.industria_id !== undefined) proyecto.industria_id = request.body.industria_id;
                if (request.body.descripcion_general !== undefined) proyecto.descripcion_general = request.body.descripcion_general;
                if (request.body.prospectos_deseados !== undefined) proyecto.prospectos_deseados = request.body.prospectos_deseados;

                if (request.body.pagina_web !== undefined) proyecto.pagina_web = request.body.pagina_web;
                if (request.body.facebook !== undefined) proyecto.facebook = request.body.facebook;
                if (request.body.instagram !== undefined) proyecto.instagram = request.body.instagram;
                if (request.body.color !== undefined) proyecto.color = request.body.color;

                if (request.body.activo !== undefined) proyecto.activo = request.body.activo;

                proyecto.save()

                    .then(async proyecto => {

                        let no_borrar_estos = []
                        let estatus_inicio = null
                        if (Array.isArray(request.body.estatus)) {


                            for (let estatusActualización of request.body.estatus) {

                                console.log('estatusActualización', estatusActualización)

                                let estatus;
                                estatusActualización.proyectos_id = proyecto._id;
                                estatusActualización.usuarios_id = request.user._id;
                                if (estatusActualización._id)
                                    estatus = await Estatus.findById(estatusActualización._id)

                                if (estatus && estatus !== null) {
                                    if (estatusActualización.nombre)
                                        estatus.nombre = estatusActualización.nombre

                                    if (estatusActualización.tipo)
                                        estatus.tipo = estatusActualización.tipo

                                    if (estatusActualización.color)
                                        estatus.color = estatusActualización.color

                                } else
                                    estatus = new Estatus(estatusActualización)
                                    
                                await estatus.save()
                                no_borrar_estos.push(estatus._id)

                                if (estatus.tipo === 3)
                                    estatus_inicio = estatus
                            }
                        }
                        
                        await Estatus.deleteMany({ "proyectos_id": proyecto._id, _id: {$nin: no_borrar_estos}  })


                        if (estatus_inicio === null)
                            estatus_inicio = await Estatus.findOne({ "proyectos_id": proyecto._id })

                        await Prospectos.updateMany({ "proyectos_id": proyecto._id, _id: { $nin: no_borrar_estos }}, {$set: { estatus: estatus_inicio._id }})
                        
                        return response.status(200).json({
                            success: true,
                            message: "Proyecto actualizado",
                        })
                        // return;

                        // if (request.body.estatus != undefined) {


                        //     for (let x = 0; x < request.body.estatus.length; x++) {
                        //         request.body.estatus[x].proyectos_id = proyecto._id;
                        //         request.body.estatus[x].usuarios_id = request.user._id;
                        //     }

                        //     await Estatus.deleteMany({ "proyectos_id": proyecto._id })
                        //     Estatus.insertMany(request.body.estatus)
                        //         .then(estatus => {
      
                        //         })
                        //         .catch(error =>
                        //             response.status(400).json({
                        //                 success: false,
                        //                 message: "Error al actualizar los estatus del proyecto.",
                        //                 error: error
                        //                 // error: MongooseValidationErrorHandler(error, {humanize: true, capitalize: true}),
                        //             })
                        //         )
                        // }
                        // else {
                        //     response.status(200).json({
                        //         success: true,
                        //         message: "Proyecto actualizado",
                        //         proyecto: proyecto
                        //     })
                        // }
                    })
                    .catch(error =>{
                        console.log('S', error)
                        response.status(400).json({
                            success: false,
                            message: "Error al actualizar el proyecto",
                            error: MongooseValidationErrorHandler(error, { humanize: true, capitalize: true }),
                        })
                    }

                    )


            })
            .catch(error =>
                response.status(400).json({
                    success: false,
                    message: "Error al guardar el proyecto",
                    error: MongooseValidationErrorHandler(error, { humanize: true, capitalize: true }),
                })
            )

    };

    /**
     * @static
     * @memberof ProjectsController
     *
     * @method delete
     * @description Elimina un proyecto y sus estatus.
     *
     * @request Si elimina un departamento ELMINARA A TODOS SUS USUARIOS!!!!
     * @response Respuesta desde el servidor al front
     */
    static delete = async (request, response) => {
        console.log("DELETE");
        console.log(request.body.id);

        Proyectos.findOne({ _id: request.body.id })
            .then(async plantilla => {
                await Estatus.deleteMany({ proyectos_id: plantilla._id })
                await Proyectos.deleteOne({ _id: request.body.id });
                response.status(200).json({
                    success: true,
                    message: "Se ha eliminado el proyecto."
                })
            })
            .catch(error => {

                console.log(error)
                response.status(400).json({
                    success: false,
                    // error: error
                    error: MongooseValidationErrorHandler(error, { humanize: true, capitalize: true }),
                })
            }
            );
    };

    /**
     * @static
     * @memberof ProjectsController
     *
     * @method get
     * @description Obtiene una proyecto
     *
     * @request Informacion de la solicitud
     * @response Respuesta desde el servidor al front
     */
    static get = async (request, response) => {

        let body = request.body
        console.log(body)

        let pipeline = [
            {
                $match: {
                    _id: ObjectId(body.id)
                }
            }, {
                $lookup: {
                    from: 'estatuses',
                    let: { proyecto_id: '$_id' },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $eq: ['$proyectos_id', '$$proyecto_id']
                                }
                            }
                        }, {
                            $sort: {
                                tipo: 1,
                                createAt: 1
                            }
                        }, {
                            $project: {
                                color: { $concat: ['#', '$color'] },
                                ponderacion: 1,
                                tipo: 1,
                                nombre: 1,
                            }
                        }
                    ],
                    as: 'estatus'
                }
            }
        ]

        let proyecto = await Proyectos.aggregate(pipeline)

        if (proyecto && proyecto.length > 0)
            return response.status(200).json({
                success: true,
                message: 'Proyecto Encontrado',
                data: proyecto[0]
            })
        else
            return response.status(400).json({
                success: false,
                message: 'Proyecto NO Encontrado',
            })

    };

    /**
     * @static
     * @memberof ProjectsController
     *
     * @param search
     * @description permite buscar y generar la paginacion de proyectos.
     *
     * @function pagination
     * @description Obtiene el paginado de departamentos.
     * */
    static list = async (request, response) => {
        let data = null;
        let queryAggregate;
        const body = request.query;


        const options = {
            page: (body.page == undefined) ? 1 : body.page,
            limit: (body.limit == undefined) ? 10 : body.limit,
            populate: ["industria_id", "usuarios_id"],
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


        console.log('Rol.Administrador', request.user.rol_id.nombre)
        if (request.user.rol_id.nombre === Rol.Administrador) {
            //Realizamos el paginado normal
            let query = (body.search !== undefined) ? {
                $or: [
                    {
                        nombre: new RegExp(body.search, 'ig')
                    },
                    {
                        producto_servicio: new RegExp(body.search, 'ig')
                    },
                    {
                        descripcion_general: new RegExp(body.search, 'ig')
                    },
                    {
                        prospectos_deseados: new RegExp(body.search, 'ig')
                    },
                    {
                        pagina_web: new RegExp(body.search, 'ig')
                    },
                    {
                        facebook: new RegExp(body.search, 'ig')
                    },
                    {
                        instagram: new RegExp(body.search, 'ig')
                    },
                ]
            } : {};
            data = await Proyectos.paginate(query, options);
        } else if (request.user.rol_id.nombre === Rol.Empresa) {
            /*Obtenemos los proyectos asignados a esa empresa*/
            queryAggregate = [
                {
                    $match: {
                        usuarios_id: request.user._id
                    }
                },
                {
                    $lookup: {
                        from: 'industrias',
                        localField: 'industria_id',
                        foreignField: '_id',
                        as: 'industria_id'
                    }
                },
            ];
            data = await Proyectos.aggregatePaginate(Proyectos.aggregate(queryAggregate), options);
        } else if (request.user.rol_id.nombre === Rol.Vendedor || request.user.rol_id.nombre === Rol.Gerente) {
            queryAggregate = [
                {
                    /* Buscamos gerentes y vendedores directos de los gerentes */
                    $match: {
                        usuarios_id: request.user._id
                    }
                },
                {
                    $lookup: {
                        from: 'proyectos',
                        localField: 'proyectos_id',
                        foreignField: '_id',
                        as: 'proyectos_id'
                    }
                },
                {
                    $replaceRoot: {
                        newRoot: {
                            $mergeObjects: [
                                {
                                    $arrayElemAt: [
                                        "$proyectos_id", 0]
                                }, "$$ROOT"]
                        }
                    }
                },
                {
                    $unset: "proyectos_id"
                }
            ];
            data = await UsuariosProyectos.aggregatePaginate(UsuariosProyectos.aggregate(queryAggregate), options);
        } else
            return response.status(400).json({
                success: true,
                message: 'No tiene permisos',
                data: data
            });

        return response.status(200).json({
            success: true,
            message: 'Lista de proyectos',
            data: data
        });

    };

    static paginado = async (request, response) => {

        let data = null;
        let queryAggregate;
        const body = request.body;


        const options = {
            page: (request.body.page == undefined) ? 1 : request.body.page,
            limit: (request.body.limit == undefined) ? 10 : request.body.limit,
            populate: [
                "industria_id",
                "usuarios_id"],
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

        if (request.user.rol_id.nombre === Rol.Administrador) {

            let proyectos = [
                {
                    '$lookup': {
                        'from': 'prospectos',
                        'let': {
                            'proyectoid': '$_id'
                        },
                        'pipeline': [
                            {
                                '$match': {
                                    '$expr': {
                                        '$and': [
                                            {
                                                '$eq': [
                                                    '$proyectos_id', '$$proyectoid'
                                                ]
                                            }
                                        ]
                                    }
                                }
                            }, {
                                '$group': {
                                    '_id': '$estatus',
                                    'cantidadProspectos': {
                                        '$sum': 1
                                    }
                                }
                            }, {
                                '$lookup': {
                                    'from': 'estatuses',
                                    'localField': '_id',
                                    'foreignField': '_id',
                                    'as': 'estatus'
                                }
                            }, {
                                '$addFields': {
                                    'estatus': {
                                        '$arrayElemAt': ['$estatus', 0]
                                    }
                                }
                            }, {
                                '$sort': {
                                    'cantidadProspectos': -1
                                }
                            }
                        ],
                        'as': 'prospectos'
                    }
                }, {
                    '$addFields': {
                        'estatus': {
                            '$arrayElemAt': ['$prospectos', 0]
                        }
                    }
                }, {
                    '$project': {
                        '_id': '$_id',
                        'logo': '$logo',
                        'activo': '$activo',
                        'nombre': '$nombre',
                        'producto_servicio': '$producto_servicio',
                        'descripcion_general': '$descripcion_general',
                        'prospectos_deseados': '$prospectos_deseados',
                        'pagina_web': '$pagina_web',
                        'facebook': '$facebook',
                        'instagram': '$instagram',
                        'createdAt': '$createdAt',
                        'estatus_id': '$estatus.estatus._id',
                        'estatus_nombre': '$estatus.estatus.nombre',
                        'estatus_tipo': '$estatus.estatus.tipo'
                    }
                }
            ];

            //Realizamos el paginado normal
            if (request.body.search !== undefined) {
                proyectos.push({
                    '$match': {
                        'nombre': {
                            '$regex': request.body.search,
                            '$options': 'i'
                        }
                    }
                })
            }


            //data = await Proyectos.paginate(query, options);

            if (request.body.sort !== undefined && Object.keys(request.body.sort).length > 0) {
                let query;
                let order = (request.body.sort.order == 'ascend') ? 1 : (-1);
                switch (request.body.sort.field) {
                    case 'nombre':
                        query = { nombre: order };
                        break;

                    case 'createdAt':
                        query = { createdAt: order };
                        break;

                    case 'estatus':
                        query = { 'estatus_nombre': order };
                        break;
                }

                proyectos.push({
                    '$sort': query
                })
            }


            if (body.filtro_estatus !== undefined && body.filtro_estatus !== "") {
                proyectos.push({
                    '$match': {
                        'estatus_tipo': body.filtro_estatus
                    }
                });
            }

            data = await Proyectos.aggregatePaginate(Proyectos.aggregate(proyectos), options);

        }

        else if (request.user.rol_id.nombre === Rol.Empresa) {
            /*Obtenemos los proyectos asignados a esa empresa*/
            queryAggregate = [
                {
                    $match: {
                        usuarios_id: request.user._id
                    }
                },
                {
                    $lookup: {
                        from: 'industrias',
                        localField: 'industria_id',
                        foreignField: '_id',
                        as: 'industria_id'
                    }
                },
            ];

            data = await Proyectos.aggregatePaginate(Proyectos.aggregate(queryAggregate), options);
        }
        else if (request.user.rol_id.nombre === Rol.Vendedor || request.user.rol_id.nombre === Rol.Gerente) {
            queryAggregate = [
                {
                    /* Buscamos gerentes y vendedores directos de los gerentes */
                    $match: {
                        usuarios_id: request.user._id
                    }
                },
                {
                    $lookup: {
                        from: 'proyectos',
                        localField: 'proyectos_id',
                        foreignField: '_id',
                        as: 'proyectos_id'
                    }
                },
                {
                    $replaceRoot: {
                        newRoot: {
                            $mergeObjects: [
                                {
                                    $arrayElemAt: [
                                        "$proyectos_id", 0]
                                }, "$$ROOT"]
                        }
                    }
                },
                {
                    $unset: "proyectos_id"
                }
            ];

            data = await UsuariosProyectos.aggregatePaginate(UsuariosProyectos.aggregate(queryAggregate), options);
        }
        else {
            return response.status(400).json({
                success: true,
                message: 'No tiene permisos',
                data: data
            });
        }








        return response.status(200).json({
            success: true,
            message: 'Lista de proyectos',
            data: data
        });

    };


    static users = async (request, response) => {

        let queryAggregate = [
            {
                $match: {
                    proyectos_id: mongoose.Types.ObjectId(request.body.id),
                    usuarios_id: { $ne: mongoose.Types.ObjectId(request.user._id) }
                }
            },
            {
                $lookup: {
                    from: 'usuarios',
                    localField: 'usuarios_id',
                    foreignField: '_id',
                    as: 'usuarios_id'
                }
            }, {
                $unwind: '$usuarios_id'
            }, {
                $lookup: {
                    from: 'roles',
                    localField: 'usuarios_id.rol_id',
                    foreignField: '_id',
                    as: 'usuarios_id.rol_id'
                }
            }, {
                $unwind: '$usuarios_id.rol_id'
            }, {
                $project: {
                    '_id': '$usuarios_id._id',
                    'nombre': '$usuarios_id.nombre',
                    'email': '$usuarios_id.email',
                    'rol_id.nombre': '$usuarios_id.rol_id.nombre',
                    'rol_id._id': '$usuarios_id.rol_id._id',
                }
            }
        ];
        return response.status(200).json({
            success: true,
            message: 'Lista de asesores',
            data: await UsuariosProyectos.aggregate(queryAggregate)
        });
    };




    static lista = async (request, response) => {
        let data = [];
        const body = request.query;


        const options = {
            page: (body.page == undefined) ? 1 : body.page,
            limit: (body.limit == undefined) ? 10 : body.limit,
            populate: ["industria_id", "usuarios_id"],
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


        //Realizamos el paginado normal
        let query = (body.search !== undefined) ? {
            $or: [
                {
                    nombre: new RegExp(body.search, 'ig')
                },
                {
                    producto_servicio: new RegExp(body.search, 'ig')
                },
                {
                    descripcion_general: new RegExp(body.search, 'ig')
                },
                {
                    prospectos_deseados: new RegExp(body.search, 'ig')
                },
                {
                    pagina_web: new RegExp(body.search, 'ig')
                },
                {
                    facebook: new RegExp(body.search, 'ig')
                },
                {
                    instagram: new RegExp(body.search, 'ig')
                },
            ]
        } : {};
        data = (body.paginate) ? (await Proyectos.find(query)) : (await Proyectos.paginate(query, options))
        return response.status(200).json({
            success: true,
            message: 'Lista de proyectos',
            data: data
        });

    };
}

module.exports = ProjectsController;

