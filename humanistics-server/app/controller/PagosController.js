// const { require } = require('app-root-path');
const mongoose = require('mongoose');
const { ObjectId } = mongoose.Types;

const Industrias = require('../../models/industrias');
const Usuarios = require('../../models/usuarios');
const Proyectos = require('../../models/proyectos');
const Prospectos = require('../../models/prospectos');

const UsuariosProyectos = require('../../models/usuarios_proyectos');
const Estatus = require('../../models/estatus');
const Pagos = require('../../models/pagos');
const Planes = require('../../models/planes');
const Rol = require('../Rol');

const stripe = require('stripe')('sk_test_51ITHARLGHRnMCNIkQ29DMOLUnr3UqWsCruCFFtCAeJxu3YAQrxptbkQmttjiW4oNjKtnkHYz0R5ClGluyPEl22D600DYwtdA47');



function addMonths(date, months) {
    var d = date.getDate();
    date.setMonth(date.getMonth() + +months);
    if (date.getDate() != d) {
        date.setDate(0);
    }
    return date;
}
/**
 *
 *
 * @class ProjectsController
 *
 * Sirve para administrar proyectos
 */
class PagosController {


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
    static checkout = async ({ body, user }, response) => {



        if (user.rol_id.nombre !== Rol.Empresa)
            return response.status(400).json({
                success: false,
                message: 'No tienes permisos para ejecutar un pago.',
            });

        user = await Usuarios.findOne({ _id: user }).select('-password');
        const {
            plan,
            proyecto_id,
            token
        } = body

        Proyectos.findOne({ _id: proyecto_id })
            .then(async proyecto => {
                Planes.findOne({ _id: plan._id })
                    .then(plan_model => {
                        //Obtenemos el costo
                        let costo;
                        let prospectos;
                        let tipo;


                        switch (plan_model.tipo) {
                            case 1:
                                tipo = "Mensual"

                                if (plan_model.personalizado == true) {

                                    costo = parseFloat(plan_model.cantidad_prospectos) * parseFloat(plan_model.costo_prospecto_mensual)
                                    costo = isNaN(costo) ? 0 : costo

                                } else {
                                    costo = parseFloat(plan_model.costo_mensual)
                                }

                                prospectos = plan_model.prospectos_mensuales

                                break;

                            case 2:
                                tipo = "Anual"
                                if (plan_model.personalizado == true) {
                                    costo = parseFloat(plan_model.cantidad_prospectos) * parseFloat(plan_model.costo_prospecto_anual)
                                    costo = isNaN(costo) ? 0 : costo
                                } else {
                                    costo = parseFloat(plan_model.costo_anual)
                                }

                                prospectos = plan_model.prospectos_anuales

                                break;
                            case 3:
                                switch (plan.plan_tipo) {
                                    case 1:
                                        tipo = "Mensual"
                                        if (plan_model.personalizado == true) {
                                            costo = parseFloat(plan.cantidad_prospectos) * parseFloat(plan_model.costo_prospecto_mensual)
                                            costo = isNaN(costo) ? 0 : costo
                                        } else {
                                            costo = parseFloat(plan_model.costo_mensual)
                                        }


                                        break;
                                    case 2:
                                        tipo = "Anual"
                                        if (plan_model.personalizado == true) {
                                            costo = parseFloat(plan.cantidad_prospectos) * parseFloat(plan_model.costo_prospecto_anual) * 12
                                            costo = isNaN(costo) ? 0 : costo
                                        } else {
                                            costo = parseFloat(plan_model.costo_anual)
                                        }
                                        break;
                                    default:
                                        tipo = "Mensual"
                                        if (plan_model.personalizado == true) {
                                            costo = parseFloat(plan.cantidad_prospectos) * parseFloat(plan_model.costo_prospecto_mensual)
                                            costo = isNaN(costo) ? 0 : costo
                                        } else {
                                            costo = plan_model.costo_mensual
                                        }
                                        break;
                                }
                                prospectos = (plan_model.plan_tipo == 2) ? plan_model.prospectos_anuales : plan_model.prospectos_mensuales//plan.prospectos_anuales
                                break;

                        }
                        //pagar completo

                        
                        async function pagar(err, charge) {
                            if (err) {
                                return response.status(200).json({
                                    success: false,
                                    message: 'No se pudo realizar el pago.',
                                    message: err.raw.message,
                                    err
                                })
                            } else {
                                let ultimoPago = await Pagos.findOne({}).sort({ 'createdAt': -1 })
                                let pago = new Pagos();
                                pago.usuarios_id = user._id;
                                pago.proyecto_id = proyecto_id;
                                pago.plan_id = plan._id;
                                pago.status = true;
                                pago.subtotal = costo;
                                pago.iva = 0;
                                pago.total = costo;
                                pago.order_id = (ultimoPago == null) ? 1 : parseInt(ultimoPago.order_id) + 1;
                                pago.fecha_vencimiento = addMonths(new Date(), ((tipo == "Anual") ? 12 : 1)).toString();

                                pago.save();

                                if (user.status !== 1) {
                                    user.status = 6;
                                    await user.save()
                                }


                                // pago.usuarios_id
                            }
                        }



                        if (costo == 0) {

                            pagar();
                        } else

                            
                        stripe.charges.create({
                            amount: costo * 100,
                            currency: 'MXN',
                            source: body.token.token.id,
                            description: `HUMANISTICS PLAN ${plan_model.nombre} ${costo / 100} `
                        }, pagar);


                            return response.status(200).json({
                                success: true,
                                data: charge,
                                message: 'Ejecutado.',
                            });;

                   
                    })
                    .catch(error => {
                        console.log('error', error);
                        response.status(400).json({
                            success: false,
                            error
                        })
                    })
            })
            .catch(error =>
                response.status(400).json({
                    success: false,
                    error
                })
            )














        //"Mensual"


    };



    /**
    * @static
    * @memberof PagosController
    *
    * @method get
    * @description Obtiene el ultimo registro de pagos o una lista de pagos segun el perfil de usuario que lo solicite
    * la busqueda puede ser por
    * -id del plan
    * -user_id del usuario logeado
    * -proyecto_id del proyecto seleccionado
    *
    * @params
    * @request Peticion enviada al servidor desde el front (user [json],user_id [id],proyecto_id [id])
    * @response Respuesta desde el servidor al front
    */

    static get = async (request, response) => {
        let query = {};
        let data = null;
        let json = {}

        switch (request.user.rol_id.nombre) {
            case Rol.Administrador:
                if (request.body.id != undefined && request.body.user_id != undefined && request.body.proyecto_id != undefined) {
                    query = {
                        _id: request.body.id,
                        usuarios_id: request.body.user_id,
                        proyecto_id: request.body.proyecto_id
                    };
                }
                else if (request.body.user_id != undefined && request.body.proyecto_id != undefined) {
                    query = {

                        usuarios_id: request.body.user_id,
                        proyecto_id: request.body.proyecto_id
                    };
                }
                else if (request.body.proyecto_id != undefined) {
                    query = {
                        proyecto_id: request.body.proyecto_id
                    };
                }

                data = await Pagos.findOne(query).populate('usuarios_id').populate('proyecto_id').populate('plan_id');
             
                let prospectosActuales = 0;

                let costo = 0;
                let prospectos = 0;
                let tipo = 0;
                let tipoPlan = "Mensual";

                if (data != null) {
                    prospectosActuales = (await Prospectos.find({ proyectos_id: ObjectId(data.proyecto_id._id) })).length;
                    let plan_model = data.plan_id;

                    switch (plan_model.tipo) {
                        case 1:
                            tipo = "Mensual"

                            if (plan_model.personalizado == true) {

                                costo = parseFloat(plan_model.cantidad_prospectos) * parseFloat(plan_model.costo_prospecto_mensual)
                                costo = isNaN(costo) ? 0 : costo

                            } else {
                                costo = parseFloat(plan_model.costo_mensual)
                            }

                            prospectos = plan_model.prospectos_mensuales

                            break;

                        case 2:
                            tipo = "Anual"
                            if (plan_model.personalizado == true) {
                                costo = parseFloat(plan_model.cantidad_prospectos) * parseFloat(plan_model.costo_prospecto_anual)
                                costo = isNaN(costo) ? 0 : costo
                            } else {
                                costo = parseFloat(plan_model.costo_anual)
                            }

                            prospectos = plan_model.prospectos_anuales

                            break;
                        case 3:
                            switch (plan_model.plan_tipo) {
                                case 1:
                                    tipo = "Mensual"
                                    if (plan_model.personalizado == true) {
                                        costo = parseFloat(plan.cantidad_prospectos) * parseFloat(plan_model.costo_prospecto_mensual)
                                        costo = isNaN(costo) ? 0 : costo
                                    } else {
                                        costo = parseFloat(plan_model.costo_mensual)
                                    }


                                    break;
                                case 2:
                                    tipo = "Anual"
                                    if (plan_model.personalizado == true) {
                                        costo = parseFloat(plan.cantidad_prospectos) * parseFloat(plan_model.costo_prospecto_anual) * 12
                                        costo = isNaN(costo) ? 0 : costo
                                    } else {
                                        costo = parseFloat(plan_model.costo_anual)
                                    }
                                    break;
                                default:
                                    tipo = "Mensual"
                                    if (plan_model.personalizado == true) {
                                        costo = parseFloat(plan.cantidad_prospectos) * parseFloat(plan_model.costo_prospecto_mensual)
                                        costo = isNaN(costo) ? 0 : costo
                                    } else {
                                        costo = plan_model.costo_mensual
                                    }
                                    break;
                            }
                            prospectos = (plan_model.plan_tipo == 2) ? plan_model.prospectos_anuales : plan_model.prospectos_mensuales//plan.prospectos_anuales
                            break;

                    }

                    
                }

                json = response.status(200).json({
                    success: true,
                    message: 'Lista de pagos',
                    data: data,
                    prospectosActuales,
                    tipo,
                    prospectos,
                    costo

                });
                break;

            case Rol.Empresa:
                query = {
                    _id: request.body.id,
                    usuario_id: request.body.user_id,
                    proyecto_id: request.body.proyecto_id
                };

                if (request.body.id === undefined) {
                    query = {};
                }

                data = await Pagos.findOne(query).populate('usuarios_id').populate('proyecto_id').populate('plan_id').sort([['createdAt', -1]]); //(['updatedAt', 1]);

                json = response.status(200).json({
                    success: true,
                    message: 'Ultimo pago registrado',
                    data: data
                })

                if (data == null)
                    return response.status(400).json({
                        success: false,
                        message: "No hay ningún plan activado"
                    });
                if (data.fecha_vencimiento.getTime() >= (new Date()).getTime()) {
                    data.status = false;
                }
                await data.save();
                break;
            default:
                return response.status(400).json({
                    success: false,
                    message: "No tiene permiso."
                });
                break;
        }

        return json;
    };


    /**
    * @static
    * @memberof PagosController
    *
    * @method list
    * @description Obtiene una lista de los pagos del usuario logeado.
    *
    * @request Peticion enviada al servidor desde el front
    * @response Respuesta desde el servidor al front
    * @paginate El metodo esta paginado
    */
    static list = async (request, response) => {
        const body = request.query;

        let query = {};

        switch (request.user.rol_id.nombre) {
            case Rol.Administrador:
                query = {
                    proyecto_id: request.body.proyecto_id
                };
                break;

            case Rol.Empresa:
                query = {
                    usuarios_id: request.user._id
                };
                break;
            default:
                return response.status(400).json({
                    success: false,
                    message: "No tiene permiso."
                });
                break;
        }

        let data = await Pagos.paginate({}, {
            page: (body.page == undefined) ? 1 : body.page,
            limit: (body.limit == undefined) ? 10 : body.limit,
            populate: ["usuarios_id", "proyecto_id", "plan_id"],
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
        });



        console.log(data)

        return response.status(200).json({
            success: true,
            message: 'Lista de pagos',
            data: data

        });
    }
}

module.exports = PagosController;

