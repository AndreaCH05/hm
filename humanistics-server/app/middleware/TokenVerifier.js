const jwt = require('jsonwebtoken')

const Usuario = require('../../models/usuarios');

/**
 * @function authCheck
 * Verifica si el token enviado para la solicitud es valido
 * @request peticion enviado desde el front al servidor
 * @respuesta Respuesta desde el servidor al front end
 *
 */
module.exports = async function authCheck(request, response, next){
    const token = request.header('Authorization');
    if(!token) return response.status(401).send('Acceso denegado');
    try {
        const verificado = jwt.verify(token.split(' ')[1],process.env.SECRET);
        /**
         * A cualquier peticion, se verifica si el usuario existe (omitiendo el campo contraseña)
         * si no existe, devuelve un mensaje de "token invalido" en caso de que la clave de seguridad haya sido violentada.
         * */
        const user = await Usuario.findOne({_id: verificado._id}).select('-password').populate('rol_id');
        if(!user)
            return response.status(401).json({
                success:false,
                message: 'El token es inválido.'
            });
        request.user = user;
        next();

    } catch (err) {
        response.status(401).send({
            success:false,
            message: 'Debe iniciar sesión para continuar.'
        });
    }

}
