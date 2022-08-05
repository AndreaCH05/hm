const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const mongoosePaginate = require('mongoose-paginate-v2');
const mongoosePaginateAggregate = require('mongoose-aggregate-paginate-v2');

function getMoney(value) {
    if (typeof value !== 'undefined')
        return parseFloat(value.toString());

    return value;
}

const Pagos = new Schema({
        usuarios_id:{
            type:Schema.Types.ObjectId,
            ref:'usuarios'
        },
        proyecto_id:{
            type:Schema.Types.ObjectId,
            ref:'proyectos'
        },

        plan_id:{
            type:Schema.Types.ObjectId,
            ref:'planes'
        },
        // Mensual-1  Anual-2  
        tipo: Number, 
        //Solo cuandoi la cantidad de prospectos es definida por el usuario en un paquete personalizado.
        prospectos: Number, 
        status: {
            type: Boolean,
            default: true
        },
        subtotal:{
            type:Schema.Types.Decimal128,
            default: 0.0
        },
        iva:{
            type:Schema.Types.Decimal128,
            default: 0.0,
            get: getMoney
        },
        total:{
            type:Schema.Types.Decimal128,
            default: 0.0,
            get: getMoney
        },
        order_id:{
            type: Schema.Types.Number,
            default: null,
        },
        fecha_vencimiento:{
            type: Schema.Types.Date,
            default: null,
        },
    },
    {timestamps:true,  toJSON:{ getters:true,virtuals:true} , toObject:{ getters:true,virtuals:false} });

Pagos.plugin(mongoosePaginate);
Pagos.plugin(mongoosePaginateAggregate);

module.exports = mongoose.model('pagos',Pagos);
