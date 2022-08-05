const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// "ad_id": "444444444",
// "form_id": "444444444444",
// "leadgen_id": "444444444444",
// "created_time": 1629838291,
// "page_id": "444444444444",
// "adgroup_id": "44444444444"

const Automatizaciones = new Schema({


    nombre: {
        type: String,
        required: true
    },


    // <Option value={1}>Notificar</Option>
    // <Option value={2}>Asignar</Option>
    accion: {
        type: Number,
        default: null,
        required: true
    },


    // <Option value={1}>Nuevo Lead</Option>
    // <Option value={2}>Cambio de Estatus</Option>
    // <Option value={3}>Venta Confirmada</Option>
    automatizacion: {
        type: Number,
    },
    

    //Tambien funciona como "Asignar a"
    notificar_a: [
        {
            type: Schema.Types.ObjectId,
            ref: 'usuarios',
            required: true
        }
    ],

    all_users: {
        type: Boolean,
        default: false
    },

    tipo_seleccion: {
        type: Number,
        default: false
    },

    proyecto_id: {
        type: Schema.Types.ObjectId,
        ref: 'proyectos',
        require: true
    },
    
    red_social_id: {
        type: Schema.Types.ObjectId,
        ref: 'redes_sociales',
    }, 
    
    fb_form_id: {
        type: String,
    },

    user_id: {
        type: Schema.Types.ObjectId,
        ref: 'usuarios',
        require: true
    },

    activo: {
        type: Boolean,
        required: true,
        default: false
    },

}, { timestamps: true });

module.exports = mongoose.model('automatizaciones', Automatizaciones);
