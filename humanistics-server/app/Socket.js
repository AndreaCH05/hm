const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const Mail = require('../app/Mail');
let SocketIOFileUpload = require("socketio-file-upload");
const { ObjectId } = mongoose.Types
const Usuarios = require('./../models/usuarios');

let io;
let sockets = {}
let users = []

async function serverSocket(https) {

    io = require('socket.io')(https, {
        cors: {
            origin: '*',
            methods: ["GET", "POST"]
        }
    });

    io.on('connect', (socket) => {
        //console.log('new connection', socket.id);

        /**
         * 
         * @on start
         * @description Para iniciar, verifica el token y envia el id del usuario al front
         */
        socket.on('start', (data) => {
            verifyToken(data.token)
        });

         /**
         * 
         * @on enter-prospecto
         * @description cuando un usuario entre a ver el detalle de un prospecto, se busca un grupo llamado como el id ,
         * del prospecto, para que se una a la sala,
         */
        socket.on('enter-prospecto', (data) => {
            socket.join(data.prospecto_id)
        });

        /**
         * 
         * @on send-msg-prospecto
         * @description envia un mensaje a todos los integrantesde una sala de un prospecto
         */
        socket.on('send-msg-prospecto',(data) => {
            socket.to(data.prospecto_id).emit('recived-msg-propspectos',{
                msg: data.msg,
            });
        })

        /**
         * 
         * @on leave-prospecto
         * @description cuando un usuario deja de ver el prospecto, se sale de la sala del mismo
         */
        socket.on('leave-prospecto',(data) => {
            socket.leave(data.prospecto_id)
        })

         /**
         * 
         * @on connect
         * @description Verifica el token enviado al crear una conexion, retorna el id del usuario
         */
        const verifyToken = (token) => {

            try {
                const verificado = jwt.verify(token.split(' ')[1], process.env.SECRET);
                Usuarios.findOne({ _id: verificado._id })
                    .select('-password')
                    .then(async usuario => {
                        if (usuario == null) throw "El Token no es válido."
                        socket.emit("success",{user_id: usuario._id})
                    })
                    .catch(error => {
                        socket.emit("error", {
                            status: false,
                            error_code: "invalid-token",
                            message: "El token no es valido"
                        })
                    })
            } catch (error) {
                console.log(error)
                socket.emit("error", {
                    status: false,
                    error_code: "invalid-token",
                    message: "El token no es valido"
                })
            }

        }

    });
}

/**
 *
 * @class NotificacionesController
 * @description Clase para administrar las notificaciones mediante websockets (Push)
 */
class Notificaciones {
    /**
     *
     * Crea un objeto notificacion sin leer para el usuario
     * @param evento Informacion a mostrar a en la notificacion
     * @param detalle Especificacion de la notificacion, puede ser el grupo, o informacion relevante a mostrar
     * @param usuarios_destino [ARREGLO] Ids de los usuarios que reciben la notificacion
     * @param objeto_id objeto que hace referencia al evento
     * @param proyecto_id Id hace referencia al proyecto del cual surge la notificacion (OPTIONAL)
     * @param coleccion coleccion para el diccionario de enlaces en la vista
     * @param tipo Tipo de la notificacion // 1.- Notificacion 2.- Autorizacion 3.- Recordatorio  4.- FinanzasNominas
     *
     */
    static crearNotificacion = async (evento, detalle, usuarios_destino, objeto_id, coleccion, usuario_id) => {

        let notificacion = new Notificaciones();
        notificacion.evento = evento;
        notificacion.detalle = detalle;
        notificacion.usuarios_destino = usuarios_destino;

        if (objeto_id !== null) notificacion.objeto_id = objeto_id;
        notificacion.coleccion = coleccion;
        notificacion.usuario_id = usuario_id;
        await notificacion.save()
        this.enviarNotificaciones(usuarios_destino);
    };

    /**
     *
     * Emite la lista de notificaciones que no ha leido el usuario
     * @param usuarios_destino Usuarios que van a leer las notificaciones
     */
    static enviarNotificaciones = async (usuarios_destino) => {
        usuarios_destino.map(async usuarios_id => {

            try {

                if (sockets[usuarios_id.usuario_id]) {
                    let destino = sockets[usuarios_id.usuario_id];

                    let notificaciones = await Notificaciones.aggregatePaginate(Notificaciones.aggregate([
                        {
                            '$unwind': '$usuarios_destino'
                        }, {
                            '$match': {
                                'usuarios_destino.usuario_id': new ObjectId(usuarios_id.usuario_id)
                            }
                        }, {
                            '$sort': {
                                'usuarios_destino.leido': -1,
                                'createdAt': -1
                            }
                        }, {
                            '$lookup': {
                                'from': 'usuarios',
                                'localField': 'usuario_id',
                                'foreignField': '_id',
                                'as': 'usuario_id'
                            }
                        }, {
                            '$addFields': {
                                'usuario_id': {
                                    '$arrayElemAt': [
                                        '$usuario_id', 0
                                    ]
                                }
                            }
                        }
                    ]), {
                        page: 1, //1(body.page == undefined) ? 1 : body.page,
                        limit: 25, //(body.limit == undefined) ? 10 : body.limit,
                        customLabels: {
                            totalDocs: 'total',
                            docs: 'data',
                            limit: 'limit',
                            page: 'page',
                            totalPages: 'totalPages',
                        }
                    })

                    destino.emit('notificaciones', {
                        notificaciones,
                        count: await Notificaciones.countDocuments(
                            { usuarios_destino: { $elemMatch: { usuario_id: usuarios_id.usuario_id, leido: false } } }
                        )
                    });
                }
            } catch (error) {
                console.log('error', error);
            }

        })
    }

    /**
     *
     * @static
     * @memberof NotificacionesController
     *
     * @description Cambia el esatus de una notificacion a leida.
     * @param req Recibe un id en el body que pertenece a una notificacion
     */
    static leerNotificacion = (req, res) => {
        Notificaciones.findOne({ _id: req.body.id }, (err, notif) => {
            if (err) return handleError(err);
            for (var i = 0; i < notif.usuarios_destino.length; i++) {
                if (notif.usuarios_destino[i].usuario_id.toString() === req.body.user_id.toString()) {
                    notif.usuarios_destino[i].leido = true
                    notif.save()
                        .then(result => {
                            console.log('se actualizo la notificacion')
                        })
                        .catch(error => {
                            console.log('Error', error)
                        })
                }
            }
            let usuario = []
            usuario.push({ usuario_id: req.body.user_id })

            this.enviarNotificaciones(usuario)
            return res.status(200).json({
                succes: true,
                message: 'Notificacion leida correctamente'
            })
        })

    }


    /**
     *
     * @static
     * @memberof NotificacionesController
     *
     * @description Cambia el esatus de una notificacion a leida.
     * @param req Recibe un id en el body que pertenece a una notificacion
     */
    static consultarNotificaciones = async (request, response) => {
        const body = request.body;
        let notificaciones = [];
        (await Notificaciones.find().elemMatch("usuarios_destino", { "usuario_id": request.user._id, "leido": body.leidas }).
            populate(["usuarios_destino.usuario_id", "proyecto_id"]))
            .forEach(
                elemento => {
                    notificaciones.push(elemento)
                })


        return response.status(200).json({
            success: true,
            message: 'info',
            nuevas: body.leidas,
            data: notificaciones
        })
    }

}



module.exports = {

    serverSocket,
    Notificaciones,
    sockets,
    io
} 