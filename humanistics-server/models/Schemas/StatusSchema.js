const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Validator = require('../Validators/EstatusValidator');
const Estatus = new Schema(
    {
        nombre:{
            type:String,
            required:true
        },
        descripcion:{
            type:String,
        },
        color:{
            type:String,
            default:'#b32400',
            validate: Validator.color
        },
        ponderacion:{
            type:Schema.Types.Decimal128,
            validate: Validator.ponderacion
        }
    },
    {timestamps:true}
)


module.exports = Estatus;




