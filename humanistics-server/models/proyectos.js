const mongoose = require('mongoose');
const Estatus = require("./estatus");
let validate = require('mongoose-validator');
const mongoosePaginator = require('mongoose-paginate-v2');
const mongoosePaginatorAgregate = require('mongoose-aggregate-paginate-v2');

const Validator = require('./Validators/EstatusValidator');
const Schema = mongoose.Schema;

const Proyectos = new Schema(
    {

        /**
         * Informacion general del proyecto
        * */
        nombre: {
            type: String,
            required: true,
        },
        logo:{
            type:String,
        },
        color:{
            type:String,
        },
        producto_servicio: {
            type: String,
            //required: true,
        },
        
        /**
         * Información Especifica del proycto (step 2)
         * */
        industria_id: {
            type: Schema.Types.ObjectId,
            ref:'industrias',
        },

        descripcion_general: {
            type: String,
        },

        prospectos_deseados: {
            type: Number,
        },
        pagina_web: {
            type: String,
        },
        facebook: {
            type: String,
        },
        instagram: {
            type: String,
        },

        /**
         * Tercer status
        * */
        usuarios_id:{
            type:Schema.Types.ObjectId,
            ref:'usuarios',
        },
        activo: {
            type: Boolean,
            default: true
        },
    },{
        timestamps:true
    }
)
;

Proyectos.plugin(mongoosePaginator);
Proyectos.plugin(mongoosePaginatorAgregate);

module.exports = mongoose.model('proyectos',Proyectos);
