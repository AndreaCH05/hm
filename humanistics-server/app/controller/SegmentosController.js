const mongoose = require('mongoose');


const Segmentos = require('../../models/segmentos');

const { ObjectId } = mongoose.Types;

const jwt = require('jsonwebtoken');


class SegmentosController {

    /**
   * @memberof SegmentosController
   * @function add
   * @description Crea un registro de segmento
   * */

    static add = async (request, response) => {
        let body = request.body;
 
        let segmento = new Segmentos(request.body);

        segmento.save()

            .then(async user => {
                return response.status(200).json({
                    success: true,
                    message: 'Se ha creado el usuario exitosamente!',
                    data: user
                })
            })
            .catch(e => {

                return response.status(400).json({
                    success: false,
                    errors: e,
                    message: 'No es posible agregar el vendedor!',
                })
            });

    };



    /**
       * @static
       * @memberof SegmentosController
       * @function list
       * @description Trae la lista de todos los segmentos
       */
    static list = async (request, response) => {
        let usuario = request.user;
        let body = request.body;

        let pipeline = [
            {
                '$addFields': {
                    'title': '$nombre',
                    'key': '$_id',

                    'value': '$_id',
                    'label': '$nombre',
                    'isLeaf': false,

                    'clases_size': { '$size': '$clases' }
                }
            },
        ]

        // if (body.clases === undefined)
        //     pipeline.push({ '$unset': "clases" })


        // if (body.search)
        //     pipeline.push({
        //         '$match': {
        //             nombre: new RegExp(body.search, 'ig')
        //         }
        //     })
 
        Segmentos.aggregatePaginate(Segmentos.aggregate(pipeline), {
            page: (body.page == undefined) ? 1 : body.page,
            limit: (body.limit == undefined) ? 10 : body.limit,
            customLabels: {
                totalDocs: 'total',
                docs: 'data',
                limit: 'perPage',
                page: 'page',
                nextPage: 'next',
                prevPage: 'prev',
                totalPages: 'pages',
                pagingCounter: 'slNo',
                meta: 'paginator'
            },
            sort: ({ nombre: 1 })
        })
            .then(data => response.status(200).json({
                success: true,
                message: 'Lista de segmentos',
                data
            }))
            .catch(error => response.status(400).json({
                success: false,
                error,
                message: 'Error.',
            }))
       
    }



    /**
   * @memberof SegmentosController
   * @function update
   * @description Actualizar un registro de segmento
   * */

    static update = async (request, response) => {
        let body = request.body;
 
        Segmentos.findOne({ _id: body.id })
            .then(segmento => {
                if (request.body.nombre !== undefined) segmento.nombre = request.body.nombre;
                if (request.body.logo !== undefined) segmento.logo = request.body.logo;
                if (request.body.clases !== undefined) segmento.clases = request.body.clases;
                if (request.body.color !== undefined) segmento.color = request.body.color;

                segmento.save()
                    .then(() => {
                        response.status(200).json({
                            success: true,
                            message: 'Segmento Actualizado.'
                        })
                    })
                    .catch(error => {
                        console.log(error);
                        response.status(400).json({
                            success: false,
                            message: 'Segmento no actualizado.',
                            error: error,
                        })
                    })
            })
            .catch(error => {
                console.log(error);
                response.status(400).json({
                    success: false,
                    message: 'No es posible actualizar segmento!',
                })
            }
            );
    };



    /**
     * @memberof SegmentosController
     * @function delete
     * @description Elimina un registro de segmento
     * */
    static delete = async (request, response) => {
        let body = request.body;
 

        Segmentos.deleteOne({ _id: request.body.id })
            .then(async segmento => {
                response.status(200).json({
                    success: true,
                    message: "Se ha eliminado segmento."
                })
            })
            .catch(error =>
                response.status(400).json({
                    success: false,
                    error: error
                })
            );
    };


    /**
   * @memberof SegmentosController
   * @function get
   * @description Se consulta un registro de segmento
   * */

    static get = async (request, response) => {
        let body = request.body;
 
        let segmento = await Segmentos.findOne({ _id: body.id })

        if (segmento == null)
            return response.status(200).json({
                success: true,
                message: 'segmento no encontrado',
            })

        return response.status(200).json({
            success: true,
            message: 'segmento',
            data: segmento
        })

    };

}

module.exports = SegmentosController;
