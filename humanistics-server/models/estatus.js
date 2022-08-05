const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Validator = require('./Validators/EstatusValidator');
const Estatus = new Schema({
    nombre: {
        type: String,
        required: true
    },
    descripcion: {
        type: String,
    },
    color: {
        type: String,
        default: 'b32400',
        validate: Validator.color,
        set: function (value) { return value.replace('#', '') }

    },
    ponderacion: {
        type: Schema.Types.Decimal128,
        validate: Validator.ponderacion
    },

    /**
     * 0 -> Perdido
     * 1 -> Inicio
     * 2 -> Pregreso
     * 3 -> Completado
     * 
     * */
    tipo: Number,


    /**
     * Si es TRUE, quiere decir que es estatus de salida.
     * */
    salida: {
        type: mongoose.Schema.Types.Boolean,
    },


    proyectos_id: {
        type: Schema.Types.ObjectId,
        ref: 'proyectos'
    },
    usuarios_id: {
        type: Schema.Types.ObjectId,
        ref: 'usuarios'
    }
},
    { timestamps: true }
)

module.exports = mongoose.model('estatus', Estatus);



