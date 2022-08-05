const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const To_dos = new Schema(
    {
        nombre:{type:String,required:true},
        prospectos_id:{
            type:Schema.Types.ObjectId,
            required:true
        },
        pasos:[{
            orden:Number,
            nombre:String,
            descripcion:String,
            hecho:Boolean,
            fecha_hasta:Date,
            edicion: { type:Date, default:Date.now()},
        }]
    },{
        timestamps:true,
    }
)

module.exports = mongoose.model('to_dos',To_dos);
