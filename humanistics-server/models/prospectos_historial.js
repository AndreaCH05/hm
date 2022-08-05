const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const mongoosePaginator = require('mongoose-paginate-v2');
const mongoosePaginatorAgregate = require('mongoose-aggregate-paginate-v2');

const ProspectosCola = new Schema(
    {
        // 1 creado en humanistics
        // 2 facebook
        // 3 instagram
        fuente: {
            type: Number,
            default: 1
        },

        proyectos_id: {
            type: Schema.Types.ObjectId,
            ref: 'proyectos',
            required: true
        },

        /**
         * Asignado a *** pero lo nececite asi, asesor del prospecto
         * */
        asignado_por: {
            type: Schema.Types.ObjectId,
            ref: 'usuarios',
        },

        fb_leadgen_id: {
            type: String,
        },

        fb_form_id: {
            type: String
        },

        red_social_id: {
            type: Schema.Types.ObjectId,
            ref: 'redes_sociales',
            required: true
        },

        error: Object,
        response_webhook: Object,
        response_lead: Object
    },
    { timestamps: true }
)
    ;

ProspectosCola.plugin(mongoosePaginator);
ProspectosCola.plugin(mongoosePaginatorAgregate);

module.exports = mongoose.model('prospectos_cola', ProspectosCola);
