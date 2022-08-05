const Espanol = {
    email:{
        name: "Correo Electronico",
        ValidationRules: {
            isRequired: "Se requiere el correo electronico para continua"
        },
        placeholder: "usuario@dominio.com"
    },
    telefono:{
        name: "Número Telefónico",
        ValidationRules: {
            isRequired: "Se require de un número telefonico para continuar"
        },
        placeholder: "+526649874343"
    },
    nombre:{
        name: "Nombre(s) y Apellidos(s)",
        ValidationRules: {
            isRequired: "Se require de un nombre"
        },
    },
    apellido:{
        name: "Apellidos (s)",
        ValidationRules: {
            isRequired: "Se require de un apellido"
        },
    },
    direccion:{
        name: "Dirección de Envio",
        ValidationRules: {
            isRequired: "Debe indicar al menos una linea de dirección."
        },
    },
    codigo_postal:{
        name: "Codigo Postal",
        ValidationRules: {
            isRequired: "Debe indicar el codigo postal"
        },
    },
    ciudad:{
        name: "Ciudad",
        ValidationRules: {
            isRequired: "La Ciudad es necesaria."
        },
    },
    estado:{
        name: "Estado",
        ValidationRules: {
            isRequired: "El estado es necesario"
        },
    },
    pais:{
        name: "País",
        ValidationRules: {
            isRequired: "El país es necesario."
        },
    },
    linea_direccion:{
        name: "Dirección",
        ValidationRules: {
            isRequired: "Es necesario tener la dirección completa."
        },
    },

    password:{
        name: "Contraseña",
        ValidationRules: {
            isRequired: "Es necesario tener una contraseña para registrarse."
        },
    },
    confirm_password:{
        name: "Confirmar Contraseña",
        ValidationRules: {
            isRequired: "Es necesario confirmar la contraseña.",
            passwordNotMatch: "Las contraseñas no coinciden."
        },
    },



    direccion_add:"+ Añadir Otra Línea"

};
export {
    Espanol
};
