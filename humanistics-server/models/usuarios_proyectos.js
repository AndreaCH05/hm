const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bcrypt = require('bcryptjs');
const mongoosePaginator = require('mongoose-paginate-v2');
const jwt = require('jsonwebtoken');


const mongoosePaginatorAgregate = require('mongoose-aggregate-paginate-v2');
const UsuariosProyectos = new Schema({
        usuarios_id: {
            type:Schema.Types.ObjectId,
            ref:'usuarios',
        },

        proyectos_id: {
            type:Schema.Types.ObjectId,
            ref:'proyectos',
        },

    },{
            timestamps:true,
            emitIndexErrors: true,

    },
)


;



UsuariosProyectos.plugin(mongoosePaginatorAgregate);
module.exports = mongoose.model('usuarios_proyectos',UsuariosProyectos);
