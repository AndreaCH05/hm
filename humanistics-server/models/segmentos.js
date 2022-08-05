const mongoose = require('mongoose');
const mongoosePaginator = require('mongoose-paginate-v2');
const mongoosePaginatorAgregate = require('mongoose-aggregate-paginate-v2');

const Schema = mongoose.Schema;

const Clases = new Schema(
    {

        nombre: String,
        color: String,
    },
    {
        timestamps:true
    }
);

const Segmentos = new Schema(
    {
        nombre: {
            type: String,
            required: true,
        },
        logo:{
            type:String,
        },
        clases: [Clases],
        color:{
            type: String
        },
       
    },
    {
        timestamps:true
    }
)
;

Segmentos.plugin(mongoosePaginator);
Segmentos.plugin(mongoosePaginatorAgregate);

module.exports = mongoose.model('segmentos',Segmentos);
