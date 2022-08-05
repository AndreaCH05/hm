const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Validator = require('../Validators/EstatusValidator');

const Estatus = new Schema({
    nombre:{
        type:String,
        required:true
    },
    descripcion:{
        type:String,
        required:true
    },
    color:{
        type: String,
        default: '#b32400',
        validate: Validator.color
    },
    ponderacion:{
        type:Schema.Types.Decimal128,
        required:true,
        validate: Validator.ponderacion
    },
    usuarios_id:{
        type:Schema.Types.ObjectId,
        ref:'usuarios',
        required: true
    },
}, {
    timestamps:true
});

module.exports = mongoose.model('estatus',Estatus);
