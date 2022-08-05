const jwt = require('jsonwebtoken');
const base32 = require('base32')

const https = require('https');
const fs = require('fs');




var FB = require('fb').default;


const RedesSocialesController = require('./RedesSocialesController');
const UsuariosController = require('./UsuariosController');

const Usuarios = require('../../models/usuarios');
const Roles = require('../../models/roles');
const Planes = require('../../models/planes');
const Proyectos = require('../../models/proyectos');
const Estatus = require('../../models/estatus');
const Plantillas = require('../../models/plantillas');
const ErrorHandler = require('../../utils/mongoose-validation-error-handler/index');


const Mail = require('../../app/Mail');




// FB.options({ version: 'v10.0', appId: '817444782458138' });
FB.options({
    version: process.env.FB_VERSION,
    appId: process.env.FB_APP_ID
});
const storage = './storage/uploads/';

/**
 * @class AuthController.js
 * @description
 */
class AuthController {


    /**
     * @static
     * @memberof AuthController
     *
     * @method login
     * @description
     * */
    static login = async (request, response) => {
        const body = request.body

        if (!body) {
            return response.status(400).json({
                success: false,
                error: 'Formato de la solicitud invalida'
            })
        } else {
            Usuarios.login(body.email, body.password)
                .then(async success => {
                    response.header('Access-Control-Allow-Origin', '*');
                    response.header('Access-Control-Expose-Headers', 'Authorization');

                    return response.header('Authorization', success.token).status(200).json(success)
                })
                .catch(error => response.status(400).json(error));
        }
    };


    /**
     * @static
     * @memberof AuthController
     *
     * @method register
     * @description Registra un usuario. Inicia el step by step.
     * */
    static register = async (request, response) => {
        let body = request.body;
        /* La confirmacion de contrasenas coinciden */

        let user = new Usuarios(body);
        user.save()
            .then(user => {

                //Se envia correo de bienvenida
                let mail = new Mail({
                    subject: '¡Bienvenido, ' + user.nombre + '!',
                    template: 'bienvenido',
                    user,
                })

                mail.send(e => console.log(e)).then().catch(e => console.log(e))
                //Crear y asignar token y agregarlo al header
                Usuarios.login(user.email, body.password)
                    .then(async success => {
                        response.header('Access-Control-Allow-Origin', '*');
                        response.header('Access-Control-Expose-Headers', 'Authorization');
                        return response.header('Authorization', success.token).status(200).json(success)
                    })
                    .catch(error => {
                        return response.status(400).json({
                            success: false,
                            message: ErrorHandler(error, { capitalize: true, humanize: true })
                        })
                    })
            })
            .catch(error => {
                console.log(error);
                return response.status(400).json({
                    success: false,
                    message: ErrorHandler(error, { capitalize: true, humanize: true })
                })
            })
    };

    /**
     * @static
     * @memberof AuthController
     *
     * @method facebook
     * @description Registra o inicia sesion con facebook.
     * */

    static facebook = async (request, response) => {
        const { body } = request
        console.log('body', body);
        FB.options({ timeout: 6000 })
        RedesSocialesController.facebookLogin(request, response)
    }


    /**
 * @static
 * @memberof AuthController
 *
 * @method facebook
 * @description Registra o inicia sesion con facebook.
 * */
    static facebookPages = async ({ body }, response) => {
        FB.options({ timeout: 6000, accessToken: body.response.accessToken });

        FB.api('/me', 'GET', { "fields": "email,first_name,middle_name,last_name" }, async res => {

            if (res == undefined || res == null) {
                return response.status(400).json({
                    success: false,
                    message: "No está disponible la aplicación de facebook."
                })
            } else if (res.error) {
                return response.status(400).json({
                    success: false,
                    message: "Ha ocurrido un error al procesar su solicitud."
                })
            }

            const usuario = await Usuarios.findOne({
                email: res.email,
            }).populate('rol_id').select('-password');


            if (usuario == null) {
                let rol = await Roles.findOne({ nombre: "Empresa" });
                const usuario = new Usuarios({
                    nombre: ((res.first_name) ? res.first_name : '') + ' ' + ((res.last_name) ? res.last_name : ''),
                    email: res.email,
                    rol_id: rol._id,
                    facebook: body.response
                });
                usuario
                    .save()
                    .then(usuario => {
                        const token = usuario.token();
                        response.header('Access-Control-Allow-Origin', '*');
                        response.header('Access-Control-Expose-Headers', 'Authorization');
                        return response.header('Authorization', token).status(200).json({
                            success: true,
                            message: 'Se ha agregado el usuario exitosamente.',

                            token: token,
                            status: usuario.status,
                            rol: rol.nombre,
                            option: 1
                        })
                    })
                    .catch(error => {
                        console.log('error  AA', error);
                        return response.status(400).json({
                            success: false,
                            message: ErrorHandler(error, { capitalize: true, humanize: true })
                        })
                    })

            } else {
                let projects = await Proyectos.countDocuments({ usuarios_id: usuario._id })
                usuario.facebook = body.response;
                await usuario.save()

                const token = usuario.token();
                response.header('Access-Control-Allow-Origin', '*');
                response.header('Access-Control-Expose-Headers', 'Authorization');

                if (projects == 0) {
                    return response.header('Authorization', token).status(200).json({
                        success: true,
                        token: token,
                        status: usuario.status,
                        rol: usuario.rol_id.nombre,
                        option: 1
                    })
                }
                return response.header('Authorization', token).status(200).json({
                    success: true,
                    token: token,
                    status: usuario.status,
                    rol: usuario.rol_id.nombre,
                    option: 2
                })
            }
        });
    };






    /**
     * @static
     * @memberof AuthController
     *
     * @method avatar
     * @description Actualiza el avatar y el color
     * */
    static avatar = async (request, response) => {
        Usuarios.findOne({ _id: request.user }).select('-password')
            .then(async user => {
                if (request.body.avatar !== undefined && request.body.avatar !== "")
                    user.avatar = request.body.avatar;

                if (request.body.color !== undefined && request.body.color !== "")
                    user.color = request.body.color;


                user.status = 2;
                user.save()
                    .then(async user => {
                        response.status(200).json({
                            success: true,
                            message: "Se ha actualizado el avatar y el color."

                        })
                    })
                    .catch(error => response.status(400).json({
                        success: false,
                        message: ErrorHandler(error, { capitalize: true, humanize: true })
                    }));

            })
            .catch(error => {
                return response.status(400).json({
                    success: false,
                    message: ErrorHandler(error, { capitalize: true, humanize: true })
                })
            })
    };



    /**
     * @static
     * @memberof AuthController
     *
     * @method project
     * @description Agregar un proyecto simple al usuario registrado
     * */
    static project = async (request, response) => {
        let body = request.body;
        let loggedUser = await Usuarios.findOne({ _id: request.user }).select('-password');

        let proyecto = {};
        proyecto.nombre = body.nombre;
        proyecto.producto_servicio = body.producto_servicio;
        proyecto.logo = body.logo;
        proyecto.usuarios_id = loggedUser._id

        let proyectos = new Proyectos(proyecto)


        proyectos.save()
            .then(async proyecto => {
                loggedUser.status = 4;
                await loggedUser.save();
                response.status(200).json({
                    success: true,
                    message: "Se ha agregado el proyecto.",
                    data: proyecto
                })
            })
            .catch(error => response.status(200).json({
                success: false,
                message: "Ha ocurrido un error al procesar."
            }))
    };





    /**
     * @static
     * @memberof AuthController
     *
     * @method config
     * @description Configura el proyecto agregado en el paso anterior.
     * */
    static config = async (request, response) => {

        let loggedUser = await Usuarios.findOne({ _id: request.user }).select('-password');

        if (request.body.industria_id === undefined)
            return response.status(400).json({
                success: false,
                message: "Debe indicar una industria."
            });

        if (request.body.descripcion_general === undefined)
            return response.status(400).json({
                success: false,
                message: "Debe indicar una descripcion general."
            });

        if (request.body.prospectos_deseados === undefined)
            return response.status(400).json({
                success: false,
                message: "Debe indicar una cantidad aproximada de prospectos deseados."
            });

        if (request.body.facebook === undefined)
            return response.status(400).json({
                success: false,
                message: "Debe indicar el facebook del proyecto (para enlazarlo al API)."
            });


        Proyectos.findOne({ usuario_id: loggedUser._id })
            .then(proyecto => {
                proyecto.industria_id = request.body.industria_id;
                proyecto.descripcion_general = request.body.descripcion_general;
                proyecto.prospectos_deseados = request.body.prospectos_deseados;
                proyecto.pagina_web = request.body.pagina_web;
                proyecto.facebook = request.body.facebook;
                proyecto.instagram = request.body.instagram;

                proyecto.save()
                    .then(async proyecto => {
                        loggedUser.status = 5;
                        await loggedUser.save();
                        response.status(200).json({
                            success: false,
                            message: "Se ha concluirdo el terce paso de forma exitosa."
                        })
                    })
                    .catch(error => {
                        response.status(400).json({
                            success: false,
                            error: ErrorHandler(error, { capitalize: true, humanize: true })
                        })
                    });


            })
            .catch(error =>
                response.status(400).json({
                    success: false,
                    error: ErrorHandler(error, { capitalize: true, humanize: true })
                })
            )
    };



    /**
     * @static
     * @memberof AuthController
     *
     * @method status
     * @description Para agregar diferentes estatus
     * */
    static status = async ({ user, body }, response) => {
        let loggedUser = await Usuarios.findOne({ _id: user }).select('-password');

        const { status, proyecto_id, plantilla } = body
        Proyectos.findOne({ _id: proyecto_id })
            .then(async proyecto => {

                if (status !== undefined && Array.isArray(status))
                    for (let x = 0; x < status.length; x++) {
                        status[x].color.replace('#', '');
                        status[x].proyectos_id = proyecto._id;
                        status[x].usuarios_id = loggedUser._id;
                    }
                await Estatus.deleteMany({ proyectos_id: proyecto._id })
                Estatus.insertMany(status)
                    .then(async status => {
                        loggedUser.status = 5;
                        await loggedUser.save();
                        if (plantilla === true)
                            await Plantillas.saveEstatus(loggedUser._id, "Plantilla de " + proyecto.nombre, status);
                        response.status(200).json({

                            success: true,
                            message: "Se ha concluirdo el tercer paso de forma exitosa."
                        })
                    })
                    .catch(error => {
                        response.status(400).json({
                            success: false,
                            error: ErrorHandler(error, { capitalize: true, humanize: true })
                        })
                    })
            })
            .catch(error =>
                response.status(400).json({
                    success: false,
                    error: ErrorHandler(error, { capitalize: true, humanize: true })
                })
            )
    };



    /**
     * @static
     * @memberof AuthController
     *
     * @function userLogged
     * @description para obtener el objeto del usuario loggeado
     * */
    static userLogged = async (request, response) => {
        response.status(200).json({
            success: true,
            message: "Usuario Loggeado",
            data: await Usuarios.find({ _id: request.user }).select('-password').populate("rol_id")
        });
    };

    /**
     * @static
     * @memberof AuthController
     *
     * @function update
     * @description
     * */
    static update = async (request, response) => {
        return UsuariosController.update(request, response)
    };




    /**
     * @static
     * @memberof AuthController
     *
     * @function isAdmin
     * @description Retorna una respuesta del servidor si es admin o no.
     * */
    static isAdmin = async (request, response) => {
        let user = await Usuarios.findOne({ _id: request.user }).select('-password');
        response.status(200).json({
            success: await user.isAdmin(),
            message: "Si el usuario es administrador",
        });
    }


    /**
     * @static
     * @memberof AuthController
     *
     * @method login
     * @description
     * */
    static hasPermission = async (request, response) => {

        //Obtenemos el usuario
        let user = await Usuarios.aggregate([
            {
                $lookup: {
                    from: "roles",       // other table name
                    localField: "rol_id",   // name of users table field
                    foreignField: "_id", // name of userinfo table field
                    as: "rol"         // alias for userinfo table
                }
            },
            {
                $unwind: {
                    path: "$rol",
                    preserveNullAndEmptyArrays: true
                }
            },
        ]);
        response.status(200).json({
            success: true,
            message: "El usuario tiene una sesión iniciada.",
            rol: user[0].rol
        })
    };


    /**
     * @static
     * @memberof AuthController
     *
     * @method login
     * @description
     * */
    static logged = async (request, response) => {
        response.status(200).json({
            success: true,
            message: "Info del usuario loggead",
            data: request.user
        });
    };


    /**
     * @static
     * @memberof AuthController
     *
     * @function recovery
     * @description Controlador que llama a la generacion de un nuevo token.
     * */
    static recovery = async (request, response) => {
        console.log('RECOVERY')
        await Usuarios.recoveryToken(request.body.email).then(async ({ user, password }) => {
            console.log("user", user)
            console.log("password", password)


            // , , .toObject(), user
            let mail = new Mail({

                subject: 'Recuperación de Contraseña',
                template: 'recovery',
                values: {
                    hash: password.hash,
                    usuario:user.nombre
                },
                user
            })
            mail.send()
                .then(success => {
                    console.log('Se envio correo', success)
                })
                .catch(error => {
                    console.log(error)
                    console.log('No fue posible enviar el correo')

                })


            // await MailController.passwordRecovery(success.user,success.password);
            return response.status(200).json({
                success: true,
                message: "Revise su correo electrónico para proceder con la recuperación.",
            })
        })
            .catch(error => {
                console.log(error)
                return response.status(400).json(error)
            })
    };
    

    /**
     * @static
     * @memberof AuthController
     *
     * @function update
     * @description
     * */
    static updatePasswordTokenizer = async (request, response) => {
        let body = request.body;

        await Usuarios.updatePasswordTokenizer(body.email, body.password, base32.decode(body.token))
            .then(async success => {
                // console.log('success',success);
                return response.status(200).json({
                    success: true,
                    message: "Se ha actualizado la contraseña.",
                })
            })
            .catch(error => {
                return response.status(400).json(error)
            })
    };

}

module.exports = AuthController;
