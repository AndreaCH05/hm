const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const Industrias = new Schema({
        nombre: {
            type: String,
            required:true,
            unique: true
        },
        descripcion: {
            type: String,
            required:true
        },
    },
    {timestamps:true},
)

module.exports = mongoose.model('industrias',Industrias);
