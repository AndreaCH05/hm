
/**
 * Validador del body.
 * */

module.exports =  function (request, response, next) {
    let body  = request.body;
    if(!body)
        return response.status(400).json({
            success:false,
            error:"La solicitud enviada no es valida."});
    next();
};

