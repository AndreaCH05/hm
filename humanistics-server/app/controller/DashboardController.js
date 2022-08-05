const Proyectos = require('../../models/proyectos');
const Estatus = require('../../models/estatus');
const Prospectos = require('../../models/prospectos');
const UsuariosProyectos = require('../../models/usuarios_proyectos');
const Pagos = require('../../models/pagos');
const Usuarios = require('../../models/usuarios');


const mongoose = require('mongoose');
const Rol = require('../Rol');
const usuarios = require('../../models/usuarios');

const ObjectId = mongoose.Types.ObjectId;


/**
 * @class DashboardController.js
 * @description Para el control de inicio
 */
class DashboardController {


    static getProspectoActuales = async ({ query, user }, response) => {



        let pipeline = []
        if (query.proyecto_id) {

            pipeline.push(
                {
                    '$match': {
                        '_id': new ObjectId(query.proyecto_id)
                    }
                }, {
                '$lookup': {
                    'from': 'prospectos',
                    'localField': '_id',
                    'foreignField': 'proyectos_id',
                    'as': 'prospectos'
                }
            }, {
                '$unwind': {
                    'path': '$prospectos',
                    'preserveNullAndEmptyArrays': true
                }
            })

            if (query.start && query.end) {
                let start = new Date(query.start)
                let end = new Date(query.end)
                pipeline.push(
                    {
                        $match: {
                            'prospectos.createdAt': { $gte: start, $lte: end }
                        }
                    }
                )
            }

            pipeline.push({
                '$group': {
                    '_id': '$prospectos.estatus',
                    'total': {
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
                        '$arrayElemAt': [
                            '$estatus', 0
                        ]
                    }
                }
            }, {
                '$addFields': {
                    'estatus.total': '$total'
                }
            }, {
                '$replaceRoot': {
                    'newRoot': '$estatus'
                }
            })

        } else {
            pipeline.push(
                {
                    '$lookup': {
                        'from': 'prospectos',
                        'localField': '_id',
                        'foreignField': 'proyectos_id',
                        'as': 'total'
                    }
                }, {
                '$addFields': {
                    'total': {
                        '$size': '$total'
                    }
                }
            }
            )

        }

        Proyectos.aggregate(pipeline)
            .then(data => response.status(200).json({
                success: true,
                message: "Informacion del dashboard",
                data
            }))
            .catch(error => response.status(400).json({
                success: true,
                error
            }))


    }



    static getVentasPorProyecto = async ({ query, user }, response) => {
        let pipeline = []
        if (user.rol_id.nombre === Rol.Administrador) {
            //Realizamos el paginado normal

        } else if (user.rol_id.nombre === Rol.Empresa) {

            pipeline.push({
                $match: {
                    usuarios_id: user._id
                }
            })

        } else if (user.rol_id.nombre === Rol.Vendedor || user.rol_id.nombre === Rol.Gerente) {

            pipeline.push({
                $match: {
                    usuarios_id: user.parent_user
                }
            })
        }


        pipeline.push({
            '$lookup': {
                'from': 'prospectos',
                'localField': '_id',
                'foreignField': 'proyectos_id',
                'as': 'prospectos'
            }
        }, {
            '$unwind': {
                'path': '$prospectos',
                'preserveNullAndEmptyArrays': true
            }
        })


        if (query.start && query.end) {
            let start = new Date(query.start)
            let end = new Date(query.end)
            pipeline.push(
                {
                    '$match': {
                        'prospectos.createdAt': { $gte: start, $lte: end }
                    }
                }
            )
        }



        pipeline.push( {
            '$lookup': {
                'from': 'estatuses',
                'localField': 'prospectos.estatus',
                'foreignField': '_id',
                'as': 'estatus'
            }
        }, {
            '$addFields': {
                'estatus': {
                    '$cond': {
                        'if': {
                            '$isArray': '$estatus'
                        },
                        'then': {
                            '$arrayElemAt': [
                                '$estatus', 0
                            ]
                        },
                        'else': null
                    }
                }
            }
        }, {
            '$group': {
                '_id': '$_id',
                'proyecto': {
                    '$first': '$$ROOT'
                },
                'ganados': {
                    '$sum': {
                        '$cond': {
                            'if': {
                                '$eq': [
                                    '$estatus.tipo', 2
                                ]
                            },
                            'then': 1,
                            'else': 0
                        }
                    }
                },
                'perdidos': {
                    '$sum': {
                        '$cond': {
                            'if': {
                                '$eq': [
                                    '$estatus.tipo', 0
                                ]
                            },
                            'then': 1,
                            'else': 0
                        }
                    }
                },
                'activos': {
                    '$sum': {
                        '$cond': {
                            'if': {
                                '$eq': [
                                    '$estatus.tipo', 1
                                ]
                            },
                            'then': 1,
                            'else': 0
                        }
                    }
                }
            }
        })
        Proyectos.aggregate(pipeline)
            .then(data => response.status(200).json({
                success: true,
                message: "Informacion del dashboard",
                data
            }))
            .catch(error => response.status(400).json({
                success: true,
                error
            }))
    }


    static getFuentedeProspectos = async ({ user, query }, response) => {

        let pipeline = []


        if (query.proyecto_id)
            pipeline.push({
                '$match': {
                    '_id': new ObjectId(query.proyecto_id)
                }
            })

        if (user.rol_id.nombre === Rol.Administrador) {
            //Realizamos el paginado normal

        } else if (user.rol_id.nombre === Rol.Empresa) {

            // pipeline.push({
            //     $match: {
            //         usuarios_id: user._id
            //     }
            // })

        } else if (user.rol_id.nombre === Rol.Vendedor || user.rol_id.nombre === Rol.Gerente) {

            // pipeline.push({
            //     $match: {
            //         usuarios_id: user.parent_user
            //     }
            // })
        }
        if (query.start && query.end) {
            let start = new Date(query.start)
            let end = new Date(query.end)
            pipeline.push(
                {
                    $match: {
                        createdAt: { $gte: start, $lte: end }
                    }
                }
            )
        }

        pipeline.push({
            '$group': {
                '_id': '$fuente',
                'nombre': {
                    '$first': {
                        '$switch': {
                            'branches': [
                                {
                                    'case': {
                                        '$eq': [
                                            '$fuente', 1
                                        ]
                                    },
                                    'then': 'Creado en humanistics'
                                }, {
                                    'case': {
                                        '$eq': [
                                            '$fuente', 2
                                        ]
                                    },
                                    'then': 'Facebook'
                                }, {
                                    'case': {
                                        '$eq': [
                                            '$fuente', 3
                                        ]
                                    },
                                    'then': 'Instagram'
                                }
                            ]
                        }
                    }
                },
                'color': {
                    '$first': {
                        '$switch': {
                            'branches': [
                                {
                                    'case': {
                                        '$eq': [
                                            '$fuente', 1
                                        ]
                                    },
                                    'then': '#EACDCB'
                                }, {
                                    'case': {
                                        '$eq': [
                                            '$fuente', 2
                                        ]
                                    },
                                    'then': '#3b5998'
                                }, {
                                    'case': {
                                        '$eq': [
                                            '$fuente', 3
                                        ]
                                    },
                                    'then': '#fbad50'
                                }
                            ]
                        }
                    }
                },
                'total': {
                    '$sum': 1
                }
            }
        }, {
            '$sort': {
                'total': 1
            }
        })


        Prospectos.aggregate(pipeline)
            .then(data => response.status(200).json({
                success: true,
                message: "Informacion del dashboard",
                data
            }))
            .catch(error => response.status(400).json({
                success: true,
                error
            }))
    }


    static getProspectosporMes = async ({ query }, response) => {
        
        let pipeline = []

        if (query.proyecto_id)
            pipeline.push({
                '$match': {
                    '_id': new ObjectId(query.proyecto_id)
                }
            })
        
        
        pipeline.push({
            '$addFields': {
                'mes': {
                    '$month': '$createdAt'
                }
            }
        }, {
            '$group': {
                '_id': '$mes',
                'total': {
                    '$sum': 1
                }
            }
        })

        if (query.start && query.end) {
            let start = new Date(query.start)
            let end = new Date(query.end)
            pipeline.push(
                {
                    $match: {
                        createdAt: { $gte: start, $lte: end }
                    }
                }
            )
        }

        Prospectos.aggregate(pipeline)
            .then(data => response.status(200).json({
                success: true,
                message: "Informacion de prospectos por mes.",
                data
            }))
            .catch(error => response.status(400).json({
                success: true,
                error
            }))
    }

}
module.exports = DashboardController;
