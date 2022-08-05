const Estatus = require('../../models/estatus');
const Prospectos = require('../../models/prospectos');

const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

/**
 *
 *
 * @class EstatusController
 * @description Contiene todo el CRUD del modelo de Estatus
 *
 */
class EstatusController {

    /**
     * @static
     * @memberof EstatusController
     *
     * @method add
     * @useless
     */
    static add = async (request, response) => {

    };

    /**
     * @static
     * @memberof EstatusController
     *
     * @method update
     * @description Actualiza un estatus.
     *
     * @request Peticion enviada al servidor desde el front
     * @response Respuesta desde el servidor al front
     */
    static update = async (request, response) => {
        let body = request.body
        //buscamos los estatus del proyecto
        let estatus_proyecto = await Estatus.find({ proyectos_id: ObjectId(body.proyecto_id) })

        //actualiza cada estatus registrado con los que envia el usuario
        await body.status.forEach(async estatus_new => {

            let index = estatus_proyecto.findIndex(est => (est._id).toString() === (estatus_new._id).toString())

            //let index = estatus_proyecto.findIndex(est => est._id.toString() === estatus_new._id.toString())

            if (index !== -1) {
                if (estatus_new.nombre !== undefined) estatus_proyecto[index].nombre = estatus_new.nombre
                if (estatus_new.ponderacion !== undefined) estatus_proyecto[index].ponderacion = estatus_new.ponderacion
                if (estatus_new.color !== undefined) estatus_proyecto[index].color = estatus_new.color
                if (estatus_new.tipo !== undefined) estatus_proyecto[index].tipo = estatus_new.tipo
                if (estatus_new.salida !== undefined) estatus_proyecto[index].salida = estatus_new.salida

                estatus_proyecto[index].save().then().catch(error => {
                    return response.status(404).json({
                        success: false,
                        message: 'No se pudieron actualizar los estatus',
                    })
                })
            } else {
                //si no esta en el arreglo de estatus_proyecto, se tiene que agregar
                let estatus = new Estatus({
                    nombre: estatus_new.nombre,
                    ponderacion: estatus_new.ponderacion,
                    color: estatus_new.color,
                    tipo: estatus_new.tipo,
                    salida: estatus_new.salida,
                    proyectos_id: body.proyecto_id,
                    usuarios_id: request.user._id,
                })
                estatus.save().then().catch(error => {
                    return response.status(404).json({
                        success: false,
                        message: 'No se pudieron añadir los nuevos estatus',
                    })
                })
            }
        })

        //recorremos el arreglo de estatus registrados y comparamos con el que envio el usuario, para verificar si se elimino algun estatus
        await Promise.all(estatus_proyecto.map(async estatus_reg => {

            let index = body.status.findIndex(est => (est._id).toString() === estatus_reg._id.toString())

            //let index = body.status.findIndex(est => est._id.toString() === estatus_reg._id.toString())

            //si el index es -1 significa que el usuario elimino el estatus
            if (index == -1) {
                //verificamos que el estatus que el usuario quiere eliminar no lo este usuando algun prospecto
                let prospectos = await Prospectos.find({ estatus: estatus_reg._id })
                if (prospectos.length > 0) {
                    return response.status(404).json({
                        success: false,
                        message: 'No se puede eliminar el estatus, esta asignado a algun prospecto',
                    })
                } else {
                    Estatus.deleteOne({ _id: ObjectId(estatus_reg._id) }).then().catch(error => {
                        return response.status(404).json({
                            success: false,
                            message: 'No se pudo eliminar el estatus',
                        })
                    })
                }
            }
        }))

        try {
            return response.status(200).json({
                success: true,
                message: 'Estatuses actualizados',
            })
        } catch (e) {
        }



    };

    /**
     * @static
     * @memberof EstatusController
     *
     * @method delete
     * @description Elimina estatus.
     *
     * @response Respuesta desde el servidor al front
     * @useless
     */
    static delete = async (request, response) => {

    };

    /**
     * @static
     * @memberof EstatusController
     *
     * @method get
     * @description Obtiene un estatus
     *
     * @response Respuesta desde el servidor al front
     * @useless
     */
    static get = async (request, response) => {

    };

    /**
     * @static
     * @memberof EstatusController
     *
     *@method projectList
     * @description Lista de Estatus por proyecto
     * */
    static projectsList = async ({ query, user }, response) => {
        const { proyecto_id, id, ignore_empty_estatus } = query
        let pipeline = [];

        if (proyecto_id) {

            pipeline.push({
                '$match': {
                    'proyectos_id': mongoose.Types.ObjectId(proyecto_id),
                }
            })


            if (ignore_empty_estatus)
                pipeline.push({
                    '$lookup': {
                        'from': 'prospectos',
                        'localField': '_id',
                        'foreignField': 'estatus',
                        'as': 'prospectos'
                    }
                }, {
                    '$addFields': {
                        'prospectos': {
                            '$size': '$prospectos'
                        }
                    }
                }, {
                    '$match': {
                        'prospectos': {
                            '$ne': 0
                        }
                    }
                })


            if (id) {
                pipeline.push({
                    '$match': {
                        '_id': mongoose.Types.ObjectId(id)
                    }
                })

            }
        } else {

            pipeline.push(
                {
                    '$group': {
                        '_id': '$nombre',
                        'ids': {
                            '$push': '$_id'
                        },
                        'estatus': {
                            '$first': '$$ROOT'
                        }
                    }
                }, {
                '$addFields': {
                    'estatus._id': '$ids'
                }
            }, {
                '$replaceRoot': {
                    'newRoot': '$estatus'
                }
            }
            )

            if (ignore_empty_estatus) {
                pipeline.push({
                    '$lookup': {
                        'from': 'prospectos',
                        'let': {
                            'estatus_ids': '$_id'
                        },
                        'pipeline': [
                            {
                                '$match': {
                                    '$expr': {
                                        '$and': [
                                            {
                                                '$in': [
                                                    '$estatus', '$$estatus_ids'
                                                ]
                                            }
                                        ]
                                    }
                                }
                            }
                        ],
                        'as': 'prospectos'
                    }
                }, {
                    '$addFields': {
                        'prospectos': {
                            '$size': '$prospectos'
                        }
                    }
                }, {
                    '$match': {
                        'prospectos': {
                            '$ne': 0
                        }
                    }
                })
            }


        }



        let data = await Estatus.aggregate(pipeline);

        return response.status(200).json({
            success: true,
            message: 'lista  por status por proyecto',
            data: data
        })
    };
}

module.exports = EstatusController;

