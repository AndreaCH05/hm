const Prospectos = require('./prospectos');
const mongoose = require('mongoose');

const bcrypt = require('bcryptjs');

const base64url = require('base64url');
const crypto = require('crypto');
const mongoosePaginator = require('mongoose-paginate-v2');
const mongoosePaginatorAgregate = require('mongoose-aggregate-paginate-v2');

const jwt = require('jsonwebtoken');
const Roles = require('../models/roles');
const PasswordForgot = require('../models/password_forgot');
const https = require('https');
const fs = require('fs');

const Mail = require('../app/Mail');

const FB = require('fb').default;

FB.options({
    version: process.env.FB_VERSION,
    appId: process.env.FB_APP_ID
})

const storage = './storage/uploads/';

const Rol = require('../app/Rol')

const Schema = mongoose.Schema;

const Usuarios = new Schema({

    /**
     * Primer registro
     * */
    nombre: {
        type: String,
        required: true,

    },
    telefono: {
        type: String,
    },
    password: {
        type: String,
        // required:true,
        // select:false,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        index: true,
    },

    /**
     * Actualizar avatar y color
     * */
    avatar: {
        type: String,
        default: ''
    },

    color: {
        type: String,
        default: '#cccccc'
    },
    /*
    7 -> El usuario esta agragando usuarios
    6 -> El usuario ha seleccionado un paquete (y realizado el pago en cuestion)
    5 -> El usuario ha agrado estatus al proyecto
    4 -> El usuario ha configurado un proyecto
    3 -> El usuario ha agragado un proyecto
    2 -> El usuario ha actualizado el avatar
    1 -> El usuario se ha registrado
    
    0 -> El usuario ha desactivado su cuenta
    * */
    status: {
        type: Schema.Types.Number,
        default: 1,
    },

    rol_id: {
        type: Schema.Types.ObjectId,
        ref: 'roles'
    },


    facebook: {
        type: Object,

        default: {
            accessToken: String,
            data_access_expiration_time: String,
            grantedScopes: String,
            graphDomain: String,
            signedRequest: String,
            userID: String,
            updateOn: Date,

        },
    },


    // Es la cuenta de empresa que creo esta cuenta. Si esta vacia, es que es una cuenta de empresa.-
    parent_user: {
        type: Schema.Types.ObjectId,
        ref: 'usuarios',
        default: null,
        required: false
    },

    // access_token: "EAALndjHhxRoBAGAr8zimMKnUrNuTaZAeUm15fPBJA4reYKeBA0Lsm431xfv9RfryOl4laTJZAs430ZBUZAkchZB48Gq9nN6nhZBx3SKvVbvZARsLTQdbIiVqvyyf3GNKeq7zGIpU3KN89qNb8ZArrxFwAQCpW8ktWiZBPbbzElqy5TqEwgAB7vsjJID0XQ66cG515OCgLVVAccYZBuT9WVZCTZCZA"
    // category: "Belleza, cosmética y cuidado personal"
    // category_list: Array(1)
    // 0:
    // id: "139225689474222"
    // name: "Belleza, cosmética y cuidado personal"
    // __proto__: Object
    // length: 1
    // __proto__: Array(0)
    // id: "111887391004333"
    // name: "Ejemplo de Página"
    // tasks: Array(6)
    // 0: "ANALYZE"
    // 1: "ADVERTISE"
    // 2: "MESSAGING"
    // 3: "MODERATE"
    // 4: "CREATE_CONTENT"
    // 5: "MANAGE"
    pages_list: [
        {
            id: String,
            avatar: String,
            access_token: String,
            category: String,
            category_list: [
                {
                    id: String,
                    name: String,
                }
            ],
            name: String,
            tasks: [
                String
            ],
        }
    ],


    mensaje_enviado: {
        type: Boolean,
        default: false
    }



}, {
    timestamps: true,
    emitIndexErrors: true,
},
)

    /**
     * @callback pre "SAVE"
     * @description Se ejecuta antes de guardar en la base de datos.
     * Se asegura de:
     *   1) Realizar el hashing en la base de datos.
     *   2) Obtener y asignar un ID general.
     *
     * */
    .pre('save', async function () {
        if (this.password !== undefined && this.password !== "") {
            console.log('Se edito')
            console.log('Editando PASS')
            const salt = await bcrypt.genSalt(8); //Semilla para el hashing
            const hashPassword = await bcrypt.hash(this.password, salt);
            this.password = hashPassword;
        }
    })


    /**
     * @callback pre "find"
     * @description Se ejecuta antes de traer multiples elementos de la base de datos. Elimina la contraseña al traer la informacion.
     * */
    .pre('find', async function () {
        this.select("-password")
    })



Usuarios.methods.token = function () {
    return 'Bearer ' + jwt.sign({ _id: this._id }, process.env.SECRET, { expiresIn: '24h' });
};


/**
 * @static
 * @methods
 * @function login
 *
 * @description Verifica si el usuario esta registrado y la contraseña sea corercta. Retorna el token de acceso en caso correcto. Si no, arroja una excepecion,
 *
 * @param email
 * Correo del usuario
 *
 * @param password
 * Contraseña
 *
 * */
Usuarios.statics.login = async function (email, password, logged = false) {
    const user = await this.model('usuarios').findOne({ email: email });
    console.log(user);
    const rol = await this.model('roles').findOne({ _id: user.rol_id }).select('-createdAt').select('-updatedAt').select('-__v');


    if (!user)
        throw {
            success: false,
            message: "Credenciales incorrectas o usuario no registrado.",
        };
    if (await bcrypt.compare(password, user.password)) {
        const token = user.token()
        return {
            success: true,
            message: "Sesion iniciada correctamente",
            token: token,
            status: user.status,
            user: user,
            rol: rol
        }
    } else {
        throw {
            success: false,
            message: "Credenciales incorrectas o usuario no registrado.",
        }
    }
};


/**
 * @static
 * @methods
 * @function recoveryToken
 *
 * @description Genera un token de validacion de contraseña
 *
 * @param email
 * Correo del usuario
 *
 * */
Usuarios.statics.recoveryToken = async function (email) {

    /* El token  que se genera */
    let user = await this.model('usuarios').findOne({ email: email }).select('-password');
    //Usuario no existe


    if (user == null) throw {
        success: false,
        message: 'Error al procesar la transacción.'
    };


    const chain = base64url(crypto.randomBytes(32));

    const salt = await bcrypt.genSalt(8); //Semilla para el hashing
    //Token encriptado por bcrypt


    //Contraseña aletoria para realizar la validacion
    const hash = await bcrypt.hash(chain, salt);
    //Se debe retornar el token ENCRIPTADO, no se retorna la contraseña real.

    let password = await PasswordForgot.create({
        usuarios_id: user._id,
        chain: chain,
        hash: hash
    })

    return {
        user,
        password
    };

};

/**
 * @static
 * @methods
 * @function updatePasswordTokenizer
 *
 * @description Verifica el codigo de validacion de contraseña
 *
 * @param email
 * Correo del usuario
 *
 * */
Usuarios.statics.updatePasswordTokenizer = async function (email, password, token) {

    console.log('modelo method');

    let user = await this.model('usuarios').findOne({ email: email });
    console.log('usuario encontrado', user);
    if (user == null)
        throw {
            success: false,
            message: "No es posible recuperar la contraseña (El usuario no existe)"
        };

    let forgotPassword = await PasswordForgot.findOne({
        usuarios_id: user._id,
        hash: token,
        status: true
    }).sort({ createdAt: -1 })

    if (forgotPassword == null)
        throw {
            success: false,
            message: "No es posible recuperar la contraseña (No se encontro la solicitud.)"
        };
    console.log('token', token)

    if (await bcrypt.compare(forgotPassword.chain, token)) {
        user.password = password;
        forgotPassword.status = false;
        await user.save();
        await forgotPassword.save();
        return {
            success: true,
            message: "Actualizada Cprrectamente",
        }
    }

    throw {
        success: false,
        message: "No se puede actualizar..",
    }

};

/**
 * @static
 * @methods
 * @function updatePasswordTokenizer
 *
 * @description Obtiene todos los usuarios, por proyecto.
 *
 * @param email
 * Correo del usuario
 *
 * */
Usuarios.methods.getUsers = async function (proyecto_id) {
    let rol = await this.model('roles').findOne({ _id: (this.rol_id._id !== undefined) ? this.rol_id._id : this.rol_id });

    let id;



    if (rol.nombre == Rol.Empresa || rol.nombre == Rol.Administrador) {

        id = this._id;
    }

    else if (rol.nombre == Rol.Gerente) {

        id = await this.model('usuarios').findOne({ _id: (this.parent_user._id !== undefined) ? this.parent_user._id : this.rol_id });
        id = id._id
    }
    else {
        return [];
    }


    if (proyecto_id === undefined) {
        return this.model('usuarios').aggregate([
            {
                '$graphLookup': {
                    'from': 'usuarios',
                    'startWith': '$_id',
                    'connectFromField': '_id',
                    'connectToField': 'parent_user',
                    'as': 'usuarios'
                }
            }, {
                '$match': {
                    '_id': mongoose.Types.ObjectId(this._id)
                }
            }, {
                '$unwind': {
                    'path': '$usuarios'
                }
            }, {
                '$replaceRoot': {
                    'newRoot': '$usuarios'
                }
            }, {
                '$lookup': {
                    'from': 'roles',
                    'localField': 'rol_id',
                    'foreignField': '_id',
                    'as': 'rol_id'
                }
            }, {
                '$unwind': {
                    'path': '$rol_id'
                }
            }, {
                '$group': {
                    '_id': '$rol_id.nombre',
                    'usuarios': {
                        '$push': {
                            '_id': '$_id',
                            'nombre': '$nombre',
                            'telefono': '$telefono',
                            'email': '$email',
                            'color': '$color',
                            'status': '$status',
                            'rol_id': '$rol_id'
                        }
                    }
                }
            }
        ]);

    }
    else {
        let usuarios = await this.model('usuarios_proyectos').aggregate([
            {
                $match:
                {
                    proyectos_id: mongoose.Types.ObjectId(proyecto_id)
                }
            },
            {
                $lookup: {
                    from: 'usuarios',
                    localField: 'usuarios_id',
                    foreignField: '_id',
                    as: 'usuarios'
                }
            },
            {
                $unwind:
                {
                    path: '$usuarios'
                }
            },
            {
                '$project': {
                    '_id': '$usuarios._id',
                    'usuarios_id': '$usuarios_id',
                    'proyectos_id': '$proyectos_id',
                    'usuarios': '$usuarios',
                }
            },
            {
                $replaceRoot: {
                    newRoot: {
                        $mergeObjects: [
                            '$usuarios'
                            // {

                            // $arrayElemAt: [
                            //     "$usuarios", 0]
                            // }
                            , "$$ROOT"]
                    }
                }
            },
            {
                '$lookup': {
                    'from': 'roles',
                    'localField': 'rol_id',
                    'foreignField': '_id',
                    'as': 'rol_id'
                }
            }, {
                '$unwind': {
                    'path': '$rol_id'
                }
            }, {
                '$group': {
                    '_id': '$rol_id.nombre',
                    'usuarios': {
                        '$push': {
                            '_id': '$_id',
                            'nombre': '$nombre',
                            'telefono': '$telefono',
                            'email': '$email',
                            'color': '$color',
                            'status': '$status',
                            'rol_id': '$rol_id'
                        }
                    }
                }
            }
        ]);
        // array1.findIndex(element => element == 58);
        //
        // 1: {_id: "Vendedor",…}
        // usuarios: [{_id: "5ee8e6c31b64fb51dc6acba1", nombre: "Alberto Virrey", telefono: "6647639393",…}]



        return usuarios;


    }
};

/**
 * @static
 * @methods
 * @function updatePasswordTokenizer
 *
 * @description Obtiene todos los usuarios, por proyecto.
 *
 * @param email
 * Correo del usuario
 *
 * */
Usuarios.methods.updateFacebookPages = async function (FB) {

    //Obtenemos las cuentas de facebook.
    const facebookPages = await FB.api('/me/accounts', 'GET', { limit: 999 });

    //Si la respuesta es invalida
    if (facebookPages == undefined || facebookPages == null)
        throw "No está disponible la aplicación de facebook."
    else if (facebookPages.error)
        throw "Ha ocurrido un error al procesar su solicitud."

    let notIn = [];

    //Iteramos la lista de paginas de facebook del usuario, se actualiza en caso de que sea necesario
    if (Array.isArray(facebookPages.data))
        for (const facebookPageData of facebookPages.data) {
            const filename = facebookPageData.id + ".jpg";
            let facebookPage = await this.model('facebook_pages').findOne({ id: facebookPageData.id })

            if (facebookPage == null) {
                facebookPage = new this.model('facebook_pages')(facebookPageData)
            } else {

                facebookPage.tasks = facebookPage.tasks
                facebookPage.access_token = facebookPage.access_token
                facebookPage.category = facebookPage.category
                facebookPage.category_list = facebookPage.category_list
                facebookPage.name = facebookPage.name
                facebookPage.id = facebookPage.id
                facebookPage.usuarios_id = user._id

            }

            //Eliminamos el avatar anterior
            try {
                fs.unlinkSync(storage + filename);
            } catch (error) {
                console.log('Eliminar no existe', error);
            }
            //Actualizamos el avatar
            const facebookProfilePictureData = await FB.api('/' + facebookPageData.id + '/picture', 'GET', { "redirect": "false", height: 600 })
            if (facebookProfilePictureData.data.url)
                https.get(facebookProfilePictureData.data.url, response => response.pipe(fs.createWriteStream(storage + filename)))
            facebookPage.avatar = filename;
            await facebookPage.save()
            notIn.push(facebookPage._id)
        }

    //Eliminamos las páginas de facebook que no son valida ya y no tienen proyecto Y no existe
    this.model('facebook_pages').find({ _id: { $nin: notIn }, usuarios_id: user._id })

        .then(facebookPages => facebookPages.map(facebookPage => {
            if (!(facebookPage.proyectos_id))
                facebookPage.delete()
        }))

    return response.status(200).json({
        success: true,
        message: "Lista de Paginas de Facebook Actualizada."
    })
}

Usuarios.methods.getLongToken = async function () {

    if (this.facebook.accessToken) {

        const options = {
            'fields': "email,first_name,middle_name,last_name",
            'grant_type': 'fb_exchange_token',
            'client_id': process.env.FB_APP_ID,
            'client_secret': process.env.FB_APP_ID_SECRET,
            'fb_exchange_token': this.facebook.accessToken
        }

        let thisUser = this;


        return new Promise((resolve, reject) => {

            FB.api(
                '/oauth/access_token',
                'GET',
                options,
                async res => {
                    if (res) {

                        console.log(' - -  - -  - -  - -  - -  - -  - -  - -  - -  - -  - - ')
                        console.log(' - -  - -  - -  - -  - -  - -  - -  - -  - -  - -  - - ')
                        console.log(' - -  - -  - -  - -  - -  - -  - -  - -  - -  - -  - - ')
                        console.log(' - -  - -  - -  - -  - -  - -  - -  - -  - -  - -  - - ')
                        console.log(' - -  - -  - -  - -  - -  - -  - -  - -  - -  - -  - - ')
                        console.log(' - -  - -  - -  - -  - -  - -  - -  - -  - -  - -  - - ')
                        console.log(' - -  - -  - -  - -  - -  - -  - -  - -  - -  - -  - - ')
                        console.log(' - -  - -  - -  - -  - -  - -  - -  - -  - -  - -  - - ')
                        console.log('res', res)

                        let valoresToken = {
                            'facebook.accessToken': res.access_token,
                            mensaje_enviado: false
                        }

                        if (res.expires_in) {
                            console.log('res.expires_in', res.expires_in)
                            valoresToken['facebook.expiresIn'] = res.expires_in
                            valoresToken['facebook.updateOn'] = new Date()
                        }

                        thisUser.model('usuarios').updateOne({ _id: thisUser._id }, valoresToken)
                            .then(result => thisUser.model('usuarios').findOne({ _id: thisUser._id }).select('-password').populate('rol_id')
                                .then(user => resolve(user))
                                .catch(error => reject(error))
                            )
                            .catch(error => reject())
                    } else {
                        reject();
                    }
                })

            // setTimeout(() => {
            //     resolve('foo');
            // }, 300);
        });

    }
}

Usuarios.statics.validarTokens = async function () {



    const pipeline = [
        {
            '$match': {
                '$and': [
                    {
                        '$or': [
                            {
                                'mensaje_enviado': null
                            }, {
                                'mensaje_enviado': false
                            }
                        ]
                    }, {
                        '$and': [
                            {
                                'facebook': {
                                    '$ne': null
                                }
                            }, {
                                'facebook.accessToken': {
                                    '$ne': null
                                }
                            }
                        ]
                    }
                ]
            }
        }, {
            '$addFields': {
                'vencimiento_token': {
                    '$add': [
                        '$facebook.updateOn', {
                            '$multiply': [
                                '$facebook.expiresIn', 1000
                            ]
                        }
                    ]
                }
            }
        }, {
            '$match': {
                'vencimiento_token': {
                    '$lte': new Date()
                }
            }
        }
    ]
    
    this.model('usuarios').aggregate(pipeline)
        .then(async usuarios => {
            for (const usuario of usuarios) {
                let user = await this.model('usuarios').findOne({ _id: usuario._id })
                let mail = new Mail({
                    subject: `${user.nombre}, se ha vencido la sesión de facebook en Humanistics. Ingresa para volver a iniciar sesión.`,
                    template: 'token_vencido',
                    user,
                })

                mail.send(e => console.log(e))
                    .then(e => {

                        user.mensaje_enviado = true;
                        user.save();
                    })
                    .catch(e => console.log(e))

            }

        })
        .catch(error => {
            console.log('Error al obtener los usuarios con tokens vencidos.', error)
        })

}

Usuarios.plugin(mongoosePaginator);
Usuarios.plugin(mongoosePaginatorAgregate);

module.exports = mongoose.model('usuarios', Usuarios);
