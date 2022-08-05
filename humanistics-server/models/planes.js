const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bcrypt = require('bcryptjs');
const mongoosePaginator = require('mongoose-paginate-v2');


const jwt = require('jsonwebtoken');

const Roles = require('../models/roles');

const Planes = new Schema({
        nombre: {
            type: String,
            required: true,
            unique: true,
        },
        descripcion: {
            type: String,
            required: true,

        },

        descripciones: [
            {
                type: String,
            }
        ],
        
        /*
        tipo
            1 -> Mensual
            2 -> Anual
            3 -> Mensual/Anual
        */
        tipo: {
            type: Number,
            required: true,
        },
        personalizado: {
            type: Boolean,
            default: false,
        },

        
        //Para normal, mensual
        prospectos_mensuales: {
            type: Number,
        },
        //Para normal, anual
        prospectos_anuales: {
            type: Number,
        },

        //Para tipo Mensual, o Mensual/Anual
        costo_mensual: {
            type: Schema.Types.Decimal128,
        },
        //Para tipo Mensual, o Mensual/Anual
        costo_anual: {
            type: Schema.Types.Decimal128,
        },

        //Para personalizado Mensual        
        costo_prospecto_mensual: {
            type: Schema.Types.Decimal128,
        },

        //Para personalizado Anual
        costo_prospecto_anual: {
            type: Schema.Types.Decimal128,
        },


        usuarios: {
            type: Number,
            required: true,
        },

        active: {
            type: Boolean,
            default: true
        },

        color1: String,

        color2: String,

    },{
            timestamps:true,
            emitIndexErrors: true,
    },
)

Planes.plugin(mongoosePaginator);

module.exports = mongoose.model('planes', Planes);
