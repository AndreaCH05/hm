const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const mongoosePaginator = require('mongoose-paginate-v2');
const mongoosePaginatorAgregate = require('mongoose-aggregate-paginate-v2');

const Prospectos = new Schema(
    {
        nombre: {
            type: String,
            required: true
        },
        telefono: {
            type: String,
            // unique: true
        },
        email: {
            type: String,
            // unique: true
        },
        fecha: {
            type: Date,
            default: new Date(),
        },
        
        // 1 creado en humanistics
        // 2 facebook
        // 3 instagram
        fuente: {
            type: Number,
            default: 1
        },

        descripcion: {
            type: String,
        },

        proyectos_id: {
            type: Schema.Types.ObjectId,
            ref: 'proyectos',
        },

        red_social_id: {
            type: Schema.Types.ObjectId,
            ref: 'redes_sociales',
        },


        usuarios_id: {
            type: Schema.Types.ObjectId,
            ref: 'usuarios',
        },
        /**
         * Asignado a *** pero lo nececite asi, asesor del prospecto
         * */
        asignado_por: {
            type: Schema.Types.ObjectId,
            ref: 'usuarios',
        },
        adjuntos:
            [
                {
                    type: String
                }
            ],
        actividad:
            [
                {
                    // feed de entradas en la bitacora o en el feed de este prospecto
                    entrada: String,
                    usuario: { type: Schema.Types.ObjectId },
                    timestamp: { type: Date, default: Date.now() },
                    comment: {
                        type: mongoose.Schema.Types.Boolean,
                        default: false
                    },
                    files:[String]

                }
            ],
        estatus: {
            type: Schema.Types.ObjectId,
            ref: 'estatus'
        },
        pasos: [{
            orden: {
                type: Number,
                default: null
            },
            nombre: {
                type: String,
                default: ""
            },
            descripcion: {
                type: String,
                default: null
            },
            hecho: {
                type: Boolean,
                default: false
            },
            fecha_hasta: {
                type: Date,
                default: new Date()
            },
            edicion: {
                type: Date,
                default: new Date()
            },
        }],
        fecha_completado: { //campo que indica la fecha en la que el prospecto se marco como completado
            type: Date,
        },


        fb_leadgen_id: {
            type: String,
        },

        fb_form_id: {
            type: String
        },

        segmentacion: [
            {
                segmento_id:{
                    type: Schema.Types.ObjectId,
                    ref: 'segmentos',
                },
                clase_id:{
                    type:Schema.Types.ObjectId,
                },
            }
        ],

    },
    { timestamps: true }
)

    ;


Prospectos.plugin(mongoosePaginator);
Prospectos.plugin(mongoosePaginatorAgregate);

module.exports = mongoose.model('prospectos', Prospectos);
