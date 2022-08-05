const mongoose = require('mongoose');

const Usuarios = require('../../models/usuarios');
const UsuariosProyectos = require('../../models/usuarios_proyectos');
const Roles = require('../../models/roles');
const Proyectos = require('../../models/proyectos');
const Pagos = require('../../models/pagos');
const Prospectos = require('../../models/prospectos');
const { ObjectId } = mongoose.Types;
const Mail = require('../../app/Mail');

const Rol = require('../Rol');

const jwt = require('jsonwebtoken');
const proyectos = require('../../models/proyectos');


class UsuariosController {


    static add = async (request, response) => {
        /*
        Se ocupa de un rol algo para continuar
        * */

        let body = request.body;

        let rol = await Roles.findOne({ _id: request.body.rol_id });

        if (rol == null) return response.status(400).json({ message: 'No Existe el rol' });


        let proyecto = await Proyectos.findOne({ _id: request.body.proyectos_id });
        let proyectos = [];

        let hasPermission = false;
        if (request.user.rol_id.nombre === 'Administrador')
            hasPermission = true;
        else if (request.user.rol_id.nombre === 'Empresa') {

            if (proyecto !== null) hasPermission = (proyecto.usuarios_id.toString() === request.user._id.toString());
            else hasPermission = true;

        }
        else if (request.user.rol_id.nombre === 'Gerente') {
            if (proyecto !== null)
                hasPermission = (await UsuariosProyectos.countDocuments({ usuarios_id: request.user._id, proyectos_id: proyecto._id }) > 0);
            else hasPermission = true;
        } else {
            return response.status(400).json({
                success: false,
                message: 'No tiene permisos para realizar dicha accion.',
            });
        }

        if (rol == null || proyecto == null) {
            return response.status(400).json({
                success: false,
                message: 'La informacion que envío es invalida. Revise que el proyecto o el rol indicados sean correctos.',
            });
        }

        if (request.user.status !== 1) {
            request.user.status = 1;
            await request.user.save();
        }

        if (body.parent_user) {
            request.body.parent_user = request.user._id
        }


        if (body.proyectos_id) {
            proyectos = body.proyectos_id;
        }


        let usuario = new Usuarios(request.body);



        if (hasPermission) {
            usuario.save()
                .then(async user => {

                    //Un objeto proyecto
                    if (proyecto != null) {
                        await UsuariosProyectos.create({
                            usuarios_id: user._id,
                            proyectos_id: proyecto._id,
                        });

                    }

                    //Lista de id's de proyecto
                    for (let index = 0; index < proyectos.length; index++) {

                        let proyectoId = proyectos[index];

                        await UsuariosProyectos.create({
                            usuarios_id: user._id,
                            proyectos_id: ObjectId(proyectoId)
                        });

                        let rol = await Roles.findOne({ _id: user.rol_id });
                        let _proyecto = await Proyectos.findOne({ _id: ObjectId(proyectoId) });
                        let mail = new Mail({
                            subject: '¡Te han invitado a participar en ' + proyecto.nombre + '!',
                            template: 'nuevo_proyecto',
                            values: {
                                nombre: user.nombre,
                                proyecto: _proyecto.nombre,
                                logo_proyecto: _proyecto.logo,
                                proyecto_inits:_proyecto?.nombre.split(/\s/).reduce((response, word) => response += word.slice(0, 1), ''),
                                color_proyecto: (_proyecto.color) ? _proyecto.color : '#dadada',
                                rol: rol.nombre
                            },
                            user: usuario
                        });

                        mail.send();
                    }


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
        }
        else return response.status(400).json({
            success: false,
            message: 'No es posible realizar dicha accion. No tiene permiso sobre el proyecto.',
        })


    };

    /**
     * @static
     * @memberof UsuariosController
     *
     * @function delete
     * @description Elimina un usuario
     * */
    static delete = async (request, response) => {


        let hasPermission = false;

        if (request.user.rol_id.nombre === 'Administrador')
            hasPermission = true;
        else if (request.user.rol_id.nombre === 'Empresa')
            hasPermission = true;
        else if (request.user._id === request.body.id) {
            hasPermission = true;
        } else return response.status(400).json({
            success: false,
            message: 'No es posible realizar dicha accion. No tiene permiso sobre el proyecto.',
        })

        //No se puede elimnar el usuario de tipo empresa
        let usuario = await Usuarios.findOne({ _id: request.body.id }).populate('rol_id').populate()

        if (usuario.rol_id.nombre == 'Empresa') return response.status(400).json({
            success: false,
            message: 'No es posible realizar dicha accion. El usuario es tipo Empresa.',
        })

        if (hasPermission) {

            await UsuariosProyectos.deleteMany({ "usuarios_id": ObjectId(usuario._id) });

            Usuarios.deleteOne({ _id: request.body.id })
                .then(e => {

                    response.status(200).json({
                        success: true,
                        message: 'Usuario Eliminado.',
                    })
                })
                .catch(e => {

                    response.status(400).json({
                        success: false,
                        message: 'No es posible eliminar.',
                    })
                })
        } else
            return response.status(400).json({
                success: false,
                message: 'No es posible realizar dicha accion. No tiene permiso sobre el proyecto.',
            })
    };



    /**
     *
     *
     * @static
     * @memberof UsuariosController
     * 
     * @method updatePassword
     * @description Actualiza la contraseña del usuario
     */
    static update = async (request, response) => {
        var body = request.body

        //Si no hay body request
        if (!body) {
            return response.status(400).json({
                success: false,
                error: 'Campos incorrectos para el usuario'
            })
        }


        //Consultamos el objeto a la base de datos.

        let usuario = await Usuarios.findOne({ _id: body.id }).select('-password')

        if (usuario == null) {
            return response.status(404).json({ message: 'Usuario no encontrado!' })
        }


        if (request.body.nombre !== undefined) usuario.nombre = request.body.nombre;
        if (request.body.email !== undefined) usuario.email = request.body.email;
        if (request.body.telefono !== undefined) usuario.telefono = request.body.telefono;
        if (request.body.avatar !== undefined) usuario.avatar = request.body.avatar;
        if (request.body.color !== undefined) usuario.color = request.body.color;
        if (request.body.status !== undefined) usuario.status = request.body.status;
        if (request.body.rol_id !== undefined) usuario.rol_id = request.body.rol_id;

        usuario.save()
            .then(async () => {
                if (body.proyectos_id !== null && body.proyectos_id !== undefined) {
                    await this.actualizarProyectosUsuario(usuario, body.proyectos_id)
                }
                return response.status(200).json({
                    success: true,
                    message: 'Usuario Actualizado!'
                })
            })
            .catch(error => {

                return response.status(400).json({
                    success: false,
                    errors: schemaValidator(error, { capitalize: true, humanize: true }),
                    message: 'Usuario no actualizado!',
                })
            })

    }



    /**
     *
     *
     * @static
     * @memberof UsuariosController
     * @description Actualiza los proyectos asignados a un usuario y envia las invitaciones a los proyectos nuevos
     * 
     * @param usuario Object
     * @param arrayProyectosId Array[ObjectId]
     */
    static actualizarProyectosUsuario = async (usuario, arrayProyectosId) => {
        var proyectos_nuevos = arrayProyectosId;

        await UsuariosProyectos.deleteMany({ "usuarios_id": ObjectId(usuario._id) });

        for (let index = 0; index < proyectos_nuevos.length; index++) {
            var proyectoId = proyectos_nuevos[index];
            var registrado = await UsuariosProyectos.findOne({ usuarios_id: ObjectId(usuario._id), proyectos_id: ObjectId(proyectoId) });

            if (registrado === null) {

                await UsuariosProyectos.create({
                    usuarios_id: ObjectId(usuario._id),
                    proyectos_id: ObjectId(proyectoId)
                });

                let rol = await Roles.findOne({ _id: usuario.rol_id });
                let _proyecto = await Proyectos.findOne({ _id: ObjectId(proyectoId) });
                let mail = new Mail({
                    subject: '¡Te han invitado a participar en ' + proyecto.nombre + '!',
                    template: 'nuevo_proyecto',
                    values: {
                        nombre: usuario.nombre,
                        proyecto: _proyecto.nombre,
                        logo_proyecto: _proyecto.logo,
                        proyecto_inits:_proyecto?.nombre.split(/\s/).reduce((response, word) => response += word.slice(0, 1), ''),
                        color_proyecto: (_proyecto.color) ? _proyecto.color : '#dadada',
                        rol: rol.nombre
                    },
                    user: usuario
                });

                mail.send();
              
            }
        }


    }



    /**
     * @static
     * @memberof UsuariosController
     *
     * @function get
     * @description Retorna un usuario
     * */
    static get = async (request, response) => {
        var body = request.body

        //Si no hay body request
        if (!body) {
            return response.status(400).json({
                success: false,
                error: 'Campos incorrectos para la consulta'
            })

        }

        let usuario = await Usuarios.findOne({ _id: body.id }).select('-password').populate('rol_id');

        if (usuario === null) {
            return response.status(200).json({
                success: true,
                message: 'Usuario no encontrado',
            })
        }
        else {

            let proyectos = await UsuariosProyectos.find({ usuarios_id: usuario._id }).populate('proyectos_id');

            return response.status(200).json({
                success: true,
                message: 'Usuario',
                data: usuario,
                proyectos: proyectos
            })
        }
    }



    /**
     * @static
     * @memberof AuthController
     *
     * @function recovery
     * @description Controlador que llama a la generacion de un nuevo token.
     * */
    static recovery = async (request, response) => {
        console.log('RECOVERY')
        await Usuarios.recoveryToken(request.body.email)
            .then(async ({ user, password }) => {
                console.log("user", user)
                console.log("password", password)

                let mail = new Mail('Recuperación de Contraseña', 'recovery', password.toObject(), user)
                mail.send()
                    .then(success => {
                        console.log('Se envio correo', success)
                    })
                    .catch(error => {
                        console.log(error)
                        console.log('No fue posible enviar el correo')

                    })

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
* @memberof UsuariosController
*
* @function setPassword
* @description Actualiza la contrasena de un usuario invitado, siempre y cuando no tenga una contraseña asignada anteriormente.
* */
    static setPassword = async (request, response) => {
        let body = request.body;

        if (body.password !== body.confirm) {
            return response.status(400).json({
                success: false,
                error: 'Las contraseña nueva no coincide con la confirmación de la contraseña.'
            });
        }

        Usuarios.findOne({ email: body.email }, async (err, usuario) => {
            if (usuario == null)
                return response.status(404).json({ err, message: 'Contraseña no encontrada!' });

            try {
                if (usuario.password === undefined) {
                    usuario.password = body.password;
                    usuario.save()
                        .then(() => response.status(200).json({ success: true, message: 'Contraseña de usuario Actualizada!' }))
                        .catch(error => response.status(400).json({
                            success: false,
                            errors: ErrorHandler(error, { capitalize: true, humanize: true }),
                            message: 'Contraseña no actualizada!',
                        })
                        )

                }
                else {
                    return response.status(404).json({ success: false, message: 'El usuario ya tiene una contraseña.' });
                }
            }
            catch (e) {
                return response.status(400).json({
                    success: false,
                    message: "Error al guardar contraseña."
                })
            }

        })
    };



    // async static list(request, response){
    static list = async (request, response) => {

        if (request.user.status !== 1) {
            request.user.status = 1;
            await request.user.save();
        }


        let data;
        const body = request.query;
        const options = {
            page: (body.page == undefined) ? 1 : body.page,
            limit: (body.limit == undefined) ? 10 : body.limit,
            populate: ["rol_id"],
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



        switch (request.user.rol_id.nombre) {

            case Rol.Administrador:
                let query = (body.search !== undefined) ? {
                    $or: [
                        {
                            nombre: new RegExp(body.search, 'ig')
                        },
                        {
                            email: new RegExp(body.search, 'ig')
                        }
                    ]
                } : {};

                data = await Usuarios.paginate(query, options);
                break;
            case Rol.Empresa:
                let queryAggregate = [
                    {
                        $match: {
                            $or: [
                                { parent_user: request.user._id },
                                { _id: request.user._id }
                            ]
                        }
                    },
                    {
                        $lookup: {
                            from: 'usuarios',
                            localField: 'parent_user',
                            foreignField: '_id',
                            as: 'parent_user'
                        }
                    },
                    {
                        $lookup: {
                            from: 'roles',
                            localField: 'rol_id',
                            foreignField: '_id',
                            as: 'rol_id'
                        }
                    },

                ];
                if (request.body.un_wind !== undefined && request.body.un_wind === true)
                    queryAggregate.push({
                        $unwind: "$parent_user"
                    });

                let aggregate = Usuarios.aggregate(queryAggregate);



                if (request.body.paginate == false)
                    data = await Usuarios.aggregate(queryAggregate)
                else
                    data = await Usuarios.aggregatePaginate(aggregate, options);

                break;
            case Rol.Gerente:

                let queryAggregateManager = [
                    {
                        /* Buscamos gerentes y vendedores directos de los gerentes */
                        $match: {
                            parent_user: request.user._id
                        }
                    },
                    {
                        $lookup: {
                            from: 'usuarios',
                            localField: 'parent_user',
                            foreignField: '_id',
                            as: 'parent_user'
                        }
                    },
                    {
                        $lookup: {
                            from: 'roles',
                            localField: 'rol_id',
                            foreignField: '_id',
                            as: 'rol_id'
                        }
                    },

                ];
                if (request.body.un_wind !== undefined && request.body.un_wind === true)
                    queryAggregate.push({
                        $unwind: "$parent_user"
                    });
                let aggregateManager = Usuarios.aggregate(queryAggregateManager);
                data = await Usuarios.aggregatePaginate(aggregateManager, options);

                break;
            default:
                return response.status(400).json({
                    success: false,
                    message: 'No tiene permisos suficientes.!',
                });
        }

        return response.status(200).json({
            success: true,
            message: 'Proyectos del usuario',
            data: data,
            proyecto: await Proyectos.findOne({ _id: body.proyecto_id }),
        });

    };



    static rolesList = async (request, response) => {
        return response.status(200).json({
            success: true,
            message: 'Roles del sistema',
            data: await Roles.find({ nombre: { $ne: "Administrador" } })
        });
    }



    /**
     *
     *
     * @static
     * @memberof UsuariosController
     */
    static asesoresList = async (request, response) => {


        let usuario = request.user;
        let body = request.query;

        let query =
            [
                // {
                //     '$match': {
                //         'parent_user': new ObjectId(usuario._id)
                //     }
                // },
                {
                    '$lookup': {
                        'from': 'usuarios',
                        'localField': 'parent_user',
                        'foreignField': '_id',
                        'as': 'parent_user'
                    }
                },
                {
                    '$lookup': {
                        'from': 'roles',
                        'localField': 'rol_id',
                        'foreignField': '_id',
                        'as': 'rol_id'
                    }
                },
                {
                    '$lookup': {
                        'from': 'prospectos',
                        'localField': '_id',
                        'foreignField': 'asignado_por',
                        'as': 'prospectos'
                    }
                },
                {
                    '$addFields': {
                        'prospectos': { '$size': "$prospectos" }
                    }
                }
            ];

        if (body.search) {
            query.push({
                '$match': {
                    '$or': [
                        {
                            'nombre': new RegExp(body.search, 'ig')
                        },
                        {
                            'email': new RegExp(body.search, 'ig')
                        }
                    ]
                }
            })
        }




        if (body.sort) {
            switch (body.sort) {
                case '1':
                    query.push({ $sort: { createdAt: -1 } })
                    break;
                case '2':
                    query.push({ $sort: { createdAt: 1 } })
                    break;
                case '3':
                    query.push({ $sort: { nombre: 1 } })
                    break;
                case '4':
                    query.push({ $sort: { status: 1 } })
                    break;
            }
        }
        const options = {
            page: (body.page == undefined) ? 1 : body.page,
            limit: (body.limit == undefined) ? 10 : body.limit,
            populate: ["rol_id"],
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
        }
        response.status(200).json({
            success: true,
            message: "Lista de asesores",
            data: await Usuarios.aggregatePaginate(Usuarios.aggregate(query), options)
        });
    }


    static status = async (request, response) => {
        request.user.status = 1;
        request.user.save();
        return response.status(200).send({})

    }





    /**
     *
     *
     * @static
     * @memberof UsuariosController
     */
    static CuentasList = async (request, response) => {


        let usuario = request.user;
        let body = request.body;

        let dataUsuarios = [];
        let dataCuentas = [];
        let dataProyectos = [];

        let rolEmpresa = await Roles.findOne({ nombre: "Empresa" });

        let query =
            [
                {
                    '$lookup': {
                        'from': 'roles',
                        'localField': 'rol_id',
                        'foreignField': '_id',
                        'as': 'rol'
                    }
                }, {
                    '$unwind': {
                        'path': '$rol',
                        'preserveNullAndEmptyArrays': true
                    }
                }
            ];

        if (body.search !== undefined && body.search !== null && body.search !== '') {

            query.push({
                '$match': {
                    '$or': [
                        {
                            'nombre': new RegExp(body.search, 'ig')
                        }, {
                            'email': new RegExp(body.search, 'ig')
                        }, {
                            'telefono': new RegExp(body.search, 'ig')
                        }
                    ]
                }
            });
        }

        query.push(

            {
                '$sort':
                {
                    "nombre": 1
                }
            }
        );


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
            },
            populate: ['rol_id'],
        };

        //Se consultan to2 los usuarios
        dataUsuarios = await Usuarios.aggregate(query);


        for (let index = 0; index < dataUsuarios.length; index++) {
            const element = dataUsuarios[index];
            let proyectos = [];

            let consulta = [
                {
                    '$match': {
                        'usuarios_id': ObjectId(element._id)
                    }
                }, {
                    '$lookup': {
                        'from': 'proyectos',
                        'localField': 'proyectos_id',
                        'foreignField': '_id',
                        'as': 'proyecto'
                    }
                }, {
                    '$unwind': {
                        'path': '$proyecto',
                        'preserveNullAndEmptyArrays': true
                    }
                }
            ]

            //Se buscan los proyectos unidos directamente con el usuario
            let proyectos_1 = await Proyectos.aggregate(consulta);

            if (proyectos_1.length > 0) {
                for (let p1 = 0; p1 < proyectos_1.length; p1++) {

                    var guardado = false;
                    var p_1 = proyectos_1[p1];
                    var p_1_id = p_1._id.toString();

                    for (let a = 0; a < proyectos.length; a++) {
                        var p_a = proyectos[a];
                        var p_a_id = p_a._id.toString();

                        if (p_1_id === p_a_id) {
                            guardado = true;
                            break;
                        }
                    }

                    if (!guardado) {
                        proyectos.push(p_1);
                    }
                }
            }

            //Se buscan los proyectos unidos por tabla union proyectos-usuarios
            let proyectos_2 = await Proyectos.find({ usuarios_id: element._id });
            if (proyectos_2.length > 0) {

                for (let p2 = 0; p2 < proyectos_2.length; p2++) {
                    var nuevo = false;

                    var p_2 = proyectos_2[p2];
                    var p_2_id = p_2._id.toString();

                    for (let b = 0; b < proyectos.length; b++) {
                        var p_b = proyectos[b];
                        var p_b_id = p_b._id.toString();

                        if (p_b_id === p_2_id) {
                            nuevo = true;
                            break;
                        }
                    }


                    if (!nuevo) {
                        proyectos.push(p_2);
                    }
                }
            }


            //Si hay proyectos unidos al usuario se agregan a arreglo
            if (proyectos.length > 0) {

                dataProyectos.push({
                    user_id: element._id._id,
                    proyectos
                });

                dataCuentas.push(element._id._id);
            }
        }


        let _query = {};
        if (Array.isArray(dataCuentas) && dataCuentas.length > 0) {
            _query._id = { $in: dataCuentas.map(id => ObjectId(id)) }
        }

        //Consulta paginada de usuarios con proyectos
        let data_Cuentas = await Usuarios.paginate(_query, options);

        response.status(200).json({
            success: true,
            message: "Lista de asesores",
            data: data_Cuentas,
            dataProyectos
        });
    }




    /**
     *
     *
     * @static
     * @memberof UsuariosController
     */
    static CuentaProyectos = async (request, response) => {
        let usuario = request.user;
        let body = request.body;

        let dataUsuarios = [];
        let proyectos = [];
        let _query = {};
        let data_usuarios = [];
        let data_proyectos = [];

        let query =
            [
                {
                    '$match': {
                        '_id': ObjectId(body.cuentaId)
                    }
                },

                {
                    '$lookup': {
                        'from': 'roles',
                        'localField': 'rol_id',
                        'foreignField': '_id',
                        'as': 'rol'
                    }
                }, {
                    '$unwind': {
                        'path': '$rol',
                        'preserveNullAndEmptyArrays': true
                    }
                }, {
                    '$lookup': {
                        'from': 'usuarios',
                        'localField': 'parent_user',
                        'foreignField': '_id',
                        'as': 'admin'
                    }
                }, {
                    '$unwind': {
                        'path': '$admin',
                        'preserveNullAndEmptyArrays': true
                    }
                }
            ];

        if (body.search !== undefined && body.search !== null && body.search !== '') {

            query.push({
                '$match': {
                    '$or': [
                        {
                            'nombre': new RegExp(body.search, 'ig')
                        }, {
                            'email': new RegExp(body.search, 'ig')
                        }, {
                            'telefono': new RegExp(body.search, 'ig')
                        }
                    ]
                }
            });
        }

        //Se consultan to2 los usuarios
        dataUsuarios = await Usuarios.aggregate(query);

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
            },
            populate: ['rol_id'],
        };

        let consulta = [
            {
                '$match': {
                    'usuarios_id': ObjectId(body.cuentaId)
                }
            }, {
                '$lookup': {
                    'from': 'proyectos',
                    'localField': 'proyectos_id',
                    'foreignField': '_id',
                    'as': 'proyecto'
                }
            }, {
                '$unwind': {
                    'path': '$proyecto',
                    'preserveNullAndEmptyArrays': true
                }
            }
        ]


        //Se buscan los proyectos unidos directamente con el usuario
        let proyectos_1 = await Proyectos.aggregate(consulta);

        if (proyectos_1.length > 0) {

            for (let p1 = 0; p1 < proyectos_1.length; p1++) {
                var guardado = false;
                var p_1 = proyectos_1[p1];

                var p_1_id = p_1._id.toString();
                for (let a = 0; a < proyectos.length; a++) {
                    var p_a = proyectos[a];
                    var p_a_id = p_a.toString();

                    if (p_1_id === p_a_id) {
                        guardado = true;
                        break;
                    }
                }

                if (!guardado) {
                    proyectos.push(p_1_id);
                }
            }
        }

        //Se buscan los proyectos unidos por tabla union proyectos-usuarios
        let proyectos_2 = await Proyectos.find({ usuarios_id: ObjectId(body.cuentaId) });

        if (proyectos_2.length > 0) {

            for (let p2 = 0; p2 < proyectos_2.length; p2++) {
                var nuevo = false;

                var p_2 = proyectos_2[p2];
                var p_2_id = p_2._id.toString();

                for (let b = 0; b < proyectos.length; b++) {
                    var p_b = proyectos[b];
                    var p_b_id = p_b.toString();

                    if (p_b_id === p_2_id) {
                        nuevo = true;
                        break;
                    }
                }

                if (!nuevo) {
                    proyectos.push(p_2._id);
                }
            }
        }


        //Si hay proyectos unidos al usuario se agregan a arreglo
        if (Array.isArray(proyectos) && proyectos.length > 0) {
            _query._id = { $in: proyectos.map(id => ObjectId(id)) }
        }


        //Consulta paginada de proyectos
        let array_proyectos = await Proyectos.paginate(_query, options);



        for (let index = 0; index < array_proyectos.itemsList.length; index++) {
            const p = array_proyectos.itemsList[index];


            let plan = "N/A";
            let consultaPlan = [

                {
                    '$match': {
                        'proyecto_id': ObjectId(p._id)
                    }
                }, {
                    '$lookup': {
                        'from': 'planes',
                        'localField': 'plan_id',
                        'foreignField': '_id',
                        'as': 'plan'
                    }
                }, {
                    '$unwind': {
                        'path': '$plan',
                        'preserveNullAndEmptyArrays': false
                    }
                }, {
                    '$sort': {
                        'createdAt': -1
                    }
                }, {
                    '$group': {
                        '_id': null,
                        'plan': {
                            '$first': {
                                'pago_id': '$_id',
                                'pago_total': '$total',
                                'order_id': '$order_id',
                                'plan_id': '$plan._id',
                                'plan_nombre': '$plan.nombre',
                                'plan_descripcion': '$plan.descripcion'
                            }
                        }
                    }
                }
            ];


            let dataPlan = await Pagos.aggregate(consultaPlan);



            if (Array.isArray(dataPlan) && dataPlan.length > 0) {
                plan = dataPlan[0].plan.plan_nombre;
            }

            let prospectosCount = (await Prospectos.find({ proyectos_id: ObjectId(p._id) })).length;

            data_proyectos.push({
                _id: p._id,
                logo: p.logo,
                nombre: p.nombre,
                fechaCreacion: p.createdAt,
                plan: plan,
                prospectos: prospectosCount
            });
        }


        let data_user = (Array.isArray(dataUsuarios) && dataUsuarios.length > 0) ? dataUsuarios[0] : [];

        let proyectosCount = proyectos.length;

        if (data_user.rol != null) {
            if (data_user.rol.nombre === "Empresa" || data_user.rol.nombre === "Administrador") {
                var queryAdm = [];
                queryAdm.push(
                    {
                        '$match': {
                            '_id': ObjectId(data_user._id)
                        }
                    },
                    {
                        '$graphLookup': {
                            'from': 'usuarios',
                            'startWith': '$_id',
                            'connectFromField': '_id',
                            'connectToField': 'parent_user',
                            'as': 'usuarios',
                            'maxDepth': 1000,
                            'depthField': 'nivel'
                        }
                    }, {
                    '$unwind': {
                        'path': '$usuarios'
                    }
                },
                    {
                        '$match': {
                            'usuarios._id': {
                                '$nin': [
                                    ObjectId(data_user._id)
                                ]
                            }
                        }
                    }


                );

                data_usuarios = await Usuarios.aggregate(queryAdm);
            }



            else {
                data_usuarios = await Usuarios.aggregate([
                    {
                        '$match': {
                            '_id': ObjectId(body.cuentaId)
                        }
                    }, {
                        '$lookup': {
                            'from': 'usuarios',
                            'localField': '_id',
                            'foreignField': 'parent_user',
                            'as': 'usuarios'
                        }
                    }, {
                        '$unwind': {
                            'path': '$usuarios',
                            'preserveNullAndEmptyArrays': true
                        }
                    }
                ])
            }
        }



        let usuariosCount = data_usuarios.length;


        response.status(200).json({
            success: true,
            message: "Lista de proyectos por cuenta",
            data_proyectos,
            data_user,
            proyectosCount,
            usuariosCount,
            pagination: array_proyectos.paginator
        });
    }


    /**
       *
       *
       * @static
       * @memberof UsuariosController
       */
    static lista = async (request, response) => {
        let data;
        const body = request.query;
        const options = {
            page: (body.page == undefined) ? 1 : body.page,
            limit: (body.limit == undefined) ? 10 : body.limit,
            populate: ["rol_id"],
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


        let query = (body.search !== undefined) ? {
            $or: [
                {
                    nombre: new RegExp(body.search, 'ig')
                },
                {
                    email: new RegExp(body.search, 'ig')
                }
            ]
        } : {};

        data = await Usuarios.paginate(query, options);



        return response.status(200).json({
            success: true,
            message: 'Lista de usuarios',
            data: data,
            proyecto: await Proyectos.findOne({ _id: body.proyecto_id }),
        });

    };


}

module.exports = UsuariosController;
