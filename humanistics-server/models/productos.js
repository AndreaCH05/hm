const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const mongoosePaginatorAgregate = require('mongoose-aggregate-paginate-v2');

const Schema = mongoose.Schema;

const Productos = new Schema({
        nombre:{
            type:String,
            required:true
        },
        descripcion:{
            type:String,
            required:true
        },
        precio:{
            type:Schema.Types.Decimal128,
            required:true
        },
        imagenes:[String],
        activo:{
            type:Boolean,
            default:true,
        },
        proyecto_id:{
            type:Schema.Types.ObjectId,
            ref:'proyectos',
            required:true
        },
    },
    {timestamps:true}
)

mongoose.models = {};

Productos.plugin(mongoosePaginate);
Productos.plugin(mongoosePaginatorAgregate);


    module.exports = mongoose.model('productos',Productos);
