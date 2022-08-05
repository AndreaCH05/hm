const mongoose = require('mongoose');
const dotenv = require('dotenv');

//Configura las variables del .env para acceder a ellas.
dotenv.config();


//Conexion a la base de dtos
mongoose
        .connect(process.env.DB_CONNECT,{ useNewUrlParser:true })
        .catch(e=>{
            console.log('Error de conexion:',e.message)
        })

const db = mongoose.connection;
//Esta linea es para que los decimales se transformet a strings.
mongoose.Types.Decimal128.prototype.toJSON = function (){
    return parseFloat(this.toString());
};


mongoose.Types.Decimal128.prototype.toFloat = function (){
    return parseFloat(this.toString());
};





module.exports = db;
