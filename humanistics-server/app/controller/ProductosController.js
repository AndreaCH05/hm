const Productos = require('../../models/productos');
const Usuarios = require('../../models/usuarios');
const mongoose = require('mongoose');
const Proyectos = require('../../models/proyectos');
const ObjectId = mongoose.Types.ObjectId;
/**
 * @class UsuariosController
 * @description
 */
class ProductosController{

    /**
     * @static
     * @memberof ProductosController
     *
     * @function add
     * @description Registra un nuevo producto
     * */
    static add = async (request, response) =>{
        let body  = request.body;

        let producto = new Productos(body);

        producto.save()
            .then(async success => {
                return response.status(200).json({
                    success:true,
                    id:producto._id,
                    message:'Producto registrado.',
                    producto: success
                })
            })
            .catch(error => {
                console.log(error)
                return response.status(400).json({
                    succes:false,
                    message: ErrorHandler(error,{x:true, humanize: true})
                })
            })
    };

    /**
     * @static
     * @memberof ProductosController
     *
     * @function update
     * @description Actualiza un producto
     * */
    static update = async (request, response) =>{
        const body = request.body;
        Productos.findOne({_id: body.id})
            .then(async producto => {
                if (body.nombre !== undefined) producto.nombre = body.nombre;
                if (body.descripcion !== undefined) producto.descripcion = body.descripcion;
                if (body.precio !== undefined) producto.precio = body.precio;
                if (body.activo !== undefined) producto.activo = body.activo;
                if (body.imagenes !== undefined && Array.isArray(body.imagenes)) producto.imagenes = body.imagenes;
              
                producto.save()
                    .then(()=>{
                        return response.status(200).json({
                            success:true,
                            message:'Producto Actualizado!'
                        })
                    })
                    .catch(error=>{
                        return response.status(400).json({
                            success:false,
                            errors: ErrorHandler(error, {capitalize: true, humanize: true}),
                            message:'Producto no actualizado!',
                        })
                    })
            })
            .catch(error =>{
                return response.status(404).json({success:false,error,message:'Producto no encontrado!'});
            })
    };


     /**
     * @static
     * @memberof ProductosController
     *
     * @function cambioEstatus
     * @description Cambia estatus de un producto
     * */
    static cambioEstatus = async (request, response) =>{
        const body = request.body;
        Productos.findOne({_id: body.id})
            .then(async producto => {
 
                producto.activo = !(producto.activo);
                producto.save()
                    .then(()=>{
                        return response.status(200).json({
                            success:true,
                            message:'Estatus de producto Actualizado!'
                        })
                    })
                    .catch(error=>{
                        return response.status(400).json({
                            success:false,
                            errors: ErrorHandler(error, {capitalize: true, humanize: true}),
                            message:'Estatus de producto no actualizado!',
                        })
                    })
            })
            .catch(error =>{
                return response.status(404).json({success:false,error,message:'Producto no encontrado!'});
            })
    };



    


    /**
     * @static
     * @memberof ProductosController
     *
     * @function deleteImage
     * @description Elimina una imagen de un producto 
     * */
    static deleteImage = async (request, response) =>{
        const body = request.body;
        if (body.image_id === undefined) return response.status(404).json({success:false,message:'Debes indicar la imagen a borrar.'});
        Productos.findOne({_id : body.id})
            .then(producto => {
                console.log(                producto.imagenes.filter("body.image_id"))
            })
            .catch(error =>{
                return response.status(404).json({success:false,error,message:'Producto no encontrado!'});
            });
    };

    /**
     * @static
     * @memberof UsuariosController
     *
     * @function delete
     * @description Elimina un producto (Desactiva un producto)
     * */
    static delete = async (request, response) =>{
        const body = request.body;
        Productos.findOne({_id: body.id})
            .then(async producto => {
                producto.activo = 0;
                producto.save()
                    .then(()=>{
                       
                        return response.status(200).json({
                            success:true,
                            message:'Producto Eliminado!'
                        })
                    })
                    .catch(error=>{
                        return response.status(400).json({
                            success:false,
                            errors: ErrorHandler(error, {capitalize: true, humanize: true}),
                            message:'Producto no Eliminado!',
                        })
                    })
            })
            .catch(error =>{
                return response.status(404).json({success:false,error,message:'Producto no encontrado!'});
            })
    };

    /**
     * @static
     * @memberof UsuariosController
     *
     * @function get
     * @description Registra un nuevo producto
     * */
    static get = async (request, response) =>{
        let producto = await Productos.findOne({_id: request.body.id});
      
        if (producto == null)
            return response.status(400).json({
                success:false,
                message:'No existe el producto.',

            });

        return response.status(200).json({
            success:true,
            message:'Se ha encontrado el producto',
            data: {
                 producto,
            }
        })
    };

    /**
     * @static
     * @memberof ProductosController
     *
     * @function list
     * @description Registra un nuevo producto
     *
     *
     * Funciona dependiendo de como se le envien los datos.
     *
     * se pueden ordenar por precio, nombre y descripcion.
     * si se le envia precio = -1, entonces se ordenrada en orden descenedente, en caso contrario que precio = 1, se ordenaa de forma ascendente.
     *
     * Este se aplica a cualquier de precio, nombre y descripcion.}
     *
     * Para filtrar por categoria, solo se envia el ID de la categoria.
     *
     * */
    static list = async (request, response) => {
     
        let productos;
        let body = null;
        if (request.method == 'POST')
            body = request.body;
        else
            body = request.query;

        /*Declaramos las opciones del paginate*/
        const options = {
            page: (body.page == undefined )?1:body.page,
            limit: (body.limit == undefined)?10:body.limit,
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

        //productos= ProductosController.getQueryList(request);
        productos = [
            {
                $match:{ proyecto_id: ObjectId(request.body.proyecto_id)}
            }
        ]
        
        return response.status(200).json({
            success: true,
            message: "Productos asignados del usuario.",
            data: await Productos.aggregatePaginate(Productos.aggregate(productos), options),
            proyecto: await Proyectos.findOne({_id: request.body.proyecto_id}),
        });
    };


    static getQueryList = (request) => {

        let productos;
        switch (request.user.rol_id.nombre) {
            case 'Administrador':
                productos = [];
                break;
            case 'Empresa':
                
                productos = [
                    {
                        $match: {
                            proyecto_id: mongoose.Types.ObjectId(request.body.proyecto_id)
                        }
                    },
                    {
                        $lookup: {
                            from: 'usuarios',
                            localField: 'usuarios_id',
                            foreignField: '_id',
                            as: 'asesor'
                        }
                    },
                    {$unset: ["asesor.password", "asesor.telefono", "asesor.rol_id", "asesor.createdAt", "asesor.updatedAt"]},
                    {
                        $unwind:
                            {
                                path: "$asesor",
                                preserveNullAndEmptyArrays: true
                            }
                    },
                ];
                break;
            case 'Gerente':
                productos = [
                    {
                        $match: {
                            proyectos_id: mongoose.Types.ObjectId(request.body.proyecto_id)
                        }
                    }
                ]
                break;
            case 'Vendedor':
                productos = [
                    {
                        $match: {
                            usuarios_id: mongoose.Types.ObjectId(request.user._id),
                            proyectos_id: mongoose.Types.ObjectId(request.body.proyecto_id)
                        }
                    },
                    {
                        $lookup: {
                            from: 'usuarios',
                            localField: 'usuarios_id',
                            foreignField: '_id',
                            as: 'asesor'
                        }
                    },
                    {$unset: ["asesor.password", "asesor.telefono", "asesor.rol_id", "asesor.createdAt", "asesor.updatedAt"]},
                    {
                        $unwind:
                            {
                                path: "$asesor",
                                preserveNullAndEmptyArrays: true
                            }
                    }
                ]
                break;
        }
        return productos;

    }

    
    
}
module.exports = ProductosController;
