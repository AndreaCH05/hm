const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const Template_estatus = new Schema(
    {
        nombre: String,
        list_estatus: [{ type: Schema.Types.ObjectId}],
        color : String,
        usuarios_id:{
            type:Schema.Types.ObjectId,
            ref:'usuarios',
        },

    }
    ,{timestamps:true}
)


module.exports = mongoose.model('template_estatus',Template_estatus);
