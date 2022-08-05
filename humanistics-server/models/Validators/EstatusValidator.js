let validate = require('mongoose-validator');

module.exports ={
    ponderacion: [
        validate({
            validator: function(val) {
                //val > 0
                return (val => 0) && (val <= 100)
            },
            message: 'El número debe ser porcentual (entre 1 y 100)',
        })
    ],
    color: [
        validate({
            validator: 'isHexColor',
            message: 'No es un color.',
        }),
    ],
};
