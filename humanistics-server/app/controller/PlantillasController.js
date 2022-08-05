const Industrias = require('../../models/industrias');
const Usuarios = require('../../models/usuarios');


const Plantillas = require('../../models/plantillas');
const Estatus = require('../../models/estatus');

const MongooseValidationErrorHandler = require('../../utils/mongoose-validation-error-handler');

/**
 *
 *
 * @class SolicitudesController
 *
 * Sirve para agregar un proveedor
 */
class PlantillasController{


    /**
     * @static
     * @memberof SolicitudesController
     *
     * @method add
     * @description Agregar una nueva plantilla.
     *
     * @request Peticion enviada al servidor desde el front
     * @response Respuesta desde el servidor al front
     */
    static add = async (request, response)=>{
        let loggedUser = await Usuarios.findOne({_id: request.user}).select('-password')
        let estatus = request.body.estatus;
        for (let x = 0; x < estatus.length; x++) estatus[x].usuarios_id = loggedUser._id;
        Estatus.insertMany(estatus)
            .then(async estatus => {
                Plantillas.saveEstatus(loggedUser._id, request.body.nombre, estatus)
                    .then( plantilla =>{
                            response.status(201).json({
                                success: true,
                                id: plantilla._id,
                                message: 'Plantilla creada.',
                            })
                        }
                    )
                    .catch(error=>
                        response.status(400).json({
                            success:false,
                            error: MongooseValidationErrorHandler(error, {humanize: true, capitalize: true}),
                        })
                    )

            })
            .catch(error=>{
                response.status(400).json({
                    success: false,
                    error: ErrorHandler(error, {capitalize: true, humanize: true})
                })
            })
    };

    /**
     * @static
     * @memberof SolicitudesController
     *
     * @method update
     * @description Actualiza una plantilla.
     *
     * @request Peticion enviada al servidor desde el front
     * @response Respuesta desde el servidor al front
     */
    static update = async (request, response)=>{
        let loggedUser = await Usuarios.findOne({_id: request.user}).select('-password');
        let estatus = request.body.estatus;
        let plantilla = await Plantillas.findOne({_id: request.body.id});

        await Estatus.deleteMany({ "_id": { "$in": plantilla.estatus_id  } })

        Estatus.insertMany(estatus)
            .then(async estatus => {

                Plantillas.updateStatus(plantilla, loggedUser._id, request.body.nombre, estatus)
                    .then( plantilla =>{
                            response.status(201).json({
                                success: true,
                                id: plantilla._id,
                                message: 'Plantilla actualizada.',
                            })
                        }
                    )
                    .catch(error=>
                        response.status(400).json({
                            success:false,
                            error: MongooseValidationErrorHandler(error, {humanize: true, capitalize: true}),
                        })
                    )

            })
            .catch(error=>{
                response.status(400).json({
                    success: false,
                    error: ErrorHandler(error, {capitalize: true, humanize: true})
                })
            })


    };

    /**
     * @static
     * @memberof SolicitudesController
     *
     * @method delete
     * @description Elimina la plantilla en cuestion.
     *
     * @request Si elimina un departamento ELMINARA A TODOS SUS USUARIOS!!!!
     * @response Respuesta desde el servidor al front
     */
    static delete = async (request, response)=>{
        Plantillas.findOne({_id: request.body.id})
            .then(async plantilla =>{
                await Estatus.deleteMany({ "_id": { "$in": plantilla.estatus_id  } })
                await Plantillas.deleteOne({_id: request.body.id});
                response.status(200).json({
                    success:true,
                    message:"Se ha eliminado la plantilla."
                })
            })
            .catch(error =>
                response.status(400).json({
                    success:false,
                    // error: error
                    error: MongooseValidationErrorHandler(error, {humanize: true, capitalize: true}),
                })
            );
    };

    /**
     * @static
     * @memberof PlantillasController
     *
     * @method get
     * @description Obtiene una plantilla
     *
     * @request Informacion de la solicitud
     * @response Respuesta desde el servidor al front
     */
    static get = async (request, response)=>{
        Plantillas.findOne({_id: request.body.id}).populate('estatus_id')
            .then(plantilla => {
                response.status(200).json({
                    success:false,
                    message:'Plantilla Encontrada.',
                    data: plantilla
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
     * @memberof Plantillas Controller
     *
     * @param search
     * @description permite buscar y generar la paginacion de plantillas.
     *
     * @function pagination
     * @description Obtiene el paginado de departamentos.
     * */
    static list = async (request, response) =>{
        const body = request.query;
        let query = (body.search !== undefined)?{
            $or: [{
                    nombre: new RegExp(body.search,'ig')
            },]
        }:{};
        return response.status(200).json({
            success:true,
            message:'Lista de plantillas',
            data: await Plantillas.paginate(query, {
                page: (body.page == undefined )?1:body.page,
                limit: (body.limit == undefined)?10:body.limit,
                populate: ['estatus_id'],
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
    };
}

module.exports = PlantillasController;

