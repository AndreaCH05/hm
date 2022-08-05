const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Validator = require('./Validators/EstatusValidator');

const mongoosePaginator = require('mongoose-paginate-v2');

const Plantillas = new Schema({
    nombre:{
        type:String,
        required:true
    },
    usuarios_id:{
        type:Schema.Types.ObjectId,
        ref:'usuarios',
        default: null
    },

    estatus_id: [{
            type:Schema.Types.ObjectId,
            ref:'estatus',
            required: true
    }],
}, {
    timestamps:true
});

/**
 * @statics saveEstatus
 *
 * @param usuarios_id
 * ID del usuario al cual pertenence la plantilla
 *
 * @param nombre
 * Nombre de la plantilla
 *
 * @param estatus []
 * Arreglo de Estatus los cuales pertenencen a la plantilla.
 *
 * */
Plantillas.statics.saveEstatus = async function (usuario_id, nombre, estatus) {
    let plantilla = new this({
        nombre: nombre,
        usuarios_id: usuario_id
    });
    let array = [];

    for (let x = 0; x < estatus.length; x++)
        array.push(estatus[x]._id)
    plantilla.estatus_id = array;
    return await plantilla.save()
};


/**
 * @statics saveEstatus
 *
 * @param usuarios_id
 * ID del usuario al cual pertenence la plantilla
 *
 * @param nombre
 * Nombre de la plantilla
 *
 * @param estatus []
 * Arreglo de Estatus los cuales pertenencen a la plantilla.
 *
 * */
Plantillas.statics.updateStatus = async function (plantilla, usuario_id, nombre, estatus) {

    let array = [];

    for (let x = 0; x < estatus.length; x++)
        array.push(estatus[x]._id)
    plantilla.estatus_id = array;
    return await plantilla.save()
};


Plantillas.plugin(mongoosePaginator);

module.exports = mongoose.model('plantillas',Plantillas);
