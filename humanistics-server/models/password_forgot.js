const mongoose = require('mongoose');
const Schema = mongoose.Schema;

Date.prototype.addDays = function(days) {
    var date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
};

const PasswordForgot = new Schema({
        usuarios_id:{
            type:Schema.Types.ObjectId,
            ref:'usuarios'
        },


        /**
         * Almacena el token encriptado por el JWT
         * */
        hash:{
            type: String,
            required:true,
        },

        /**
         * Almacena la contraseña de validacion aleatoria. Esta aun no ha sido encriptada por JWT
         * */
        chain:{
            type: String,
            required:true,
        },


        invalid:{
            type: Date,
            required:true,
            default: new Date(new Date().getTime() + 86400000)
        },
        status: {
            type:Boolean,
            default: true
        }
    },
    {timestamps:true});

module.exports = mongoose.model('password_forgot',PasswordForgot);