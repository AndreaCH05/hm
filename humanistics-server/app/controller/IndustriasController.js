const Industrias = require('../../models/industrias');
const Usuarios = require('../../models/usuarios');


const Proyectos = require('../../models/proyectos');

const MongooseValidationErrorHandler = require('../../utils/mongoose-validation-error-handler');

/**
 *
 *
 * @class SolicitudesController
 *
 * Sirve para agregar un proveedor
 */
class IndustriasController{


    /**
     * @static
     * @memberof IndustriasController
     *
     * @method add
     * @description Agregar una industria.
     *
     * @request Peticion enviada al servidor desde el front
     * @response Respuesta desde el servidor al front
     */
    static add = async (request, response)=>{
        let industria = new Industrias(request.body);
        industria.save()
            .then( industria =>{
                    response.status(201).json({
                        success:true,
                        id:industria._id,
                        message:'Industria creado.',
                    })
                }
            )
            .catch(error=>
                response.status(400).json({
                    success:false,
                    error: MongooseValidationErrorHandler(error, {humanize: true, capitalize: true}),
                })
            )
    };

    /**
     * @static
     * @memberof IndustriasController
     *
     * @method update
     * @description Actualiza una industria.
     *
     * @request Peticion enviada al servidor desde el front
     * @response Respuesta desde el servidor al front
     */
    static update = async (request, response)=>{

        Industrias.findOne({_id: request.body.id})
            .then(industry => {
                if (request.body.nombre !== undefined) industry.nombre = request.body.nombre;
                if (request.body.descripcion !== undefined) industry.descripcion = request.body.descripcion;
                industry.save()
                    .then(()=>{
                        response.status(200).json({
                            success:true,
                            message:'Industria Actualizado.'
                        })
                    })
                    .catch(error=>{
                        response.status(400).json({
                            success:false,
                            message:'Industria no actualizado.',
                            error: MongooseValidationErrorHandler(error, {humanize: true, capitalize: true}),
                        })
                    })

            })
            .catch(error =>
                response.status(400).json({
                    success:false,
                    error: MongooseValidationErrorHandler(error, {humanize: true, capitalize: true}),
                })
            );
    };

    /**
     * @static
     * @memberof IndustriasController
     *
     * @method delete
     * @description Elimina la industria segun el id.
     *
     * @request Si elimina un departamento ELMINARA A TODOS SUS USUARIOS!!!!
     * @response Respuesta desde el servidor al front
     */
    static delete = async (request, response)=>{
        Industrias.deleteOne({_id: request.body.id})
            .then(async industria =>{
                response.status(200).json({
                    success:true,
                    message:"Se ha eliminado la industria."
                })
            })
            .catch(error =>
                response.status(400).json({
                    success:false,
                    error: error
                    // error: MongooseValidationErrorHandler(error, {humanize: true, capitalize: true}),
                })
            );
    };

    /**
     * @static
     * @memberof IndustriasController
     *
     * @method get
     * @description Obtiene una industria
     *
     * @request Si elimina un departamento ELMINARA A TODOS SUS USUARIOS!!!!
     * @response Respuesta desde el servidor al front
     */
    static get = async (request, response)=>{
        Industrias.findOne({_id: request.body.id})
            .then(industria => {
                response.status(200).json({
                    success:false,
                    message:'Industria Encontrado.',
                    data: industria
                })
            })
            .catch(error =>
                response.status(400).json({
                    success:false,
                    error: MongooseValidationErrorHandler(error, {humanize: true, capitalize: true}),
                })
            );
    };

    /**
     * @static
     * @memberof IndustriasController
     *
     * @param search
     * @description para buscar en las industrias.
     *
     * @function pagination
     * @description Obtiene el paginado de departamentos.
     * */
    static list = async (request, response)=>{
        let body = request.query;

        let query = (body.search !== undefined)?{
            $or: [
                {
                    //new RegExp('Mongo', 'i')
                    nombre: new RegExp(body.search,'ig')
                },
                {
                    //new RegExp('Mongo', 'i')
                    descripcion: new RegExp(body.search,'ig')
                }
            ]
        }:{};
        if (body.paginate === undefined)
            Industrias.find(query)
                .then(success =>{
                        // console.log('success',success)
                        response.json({
                            success: true,
                            message: 'Lista de Industrias',
                            data: success
                        })
                    }
                )
                .catch(error => response.json({
                    success: false,
                    message: 'Lista de Industrias',
                    data: error
                }))
    };
}

module.exports = IndustriasController;

