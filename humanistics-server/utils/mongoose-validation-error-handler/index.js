"use strict";

var _utils = require("mongoose-validation-error-handler/dist/utils");

/**
 * Mongoose Error Kinds
 */
var mongoose_error_kinds = {
    BOOLEAN: "Boolean",
    BUFFER: "Buffer",
    CASTERROR: "CastError",
    DATE: "Date",
    ENUM: "enum",
    MAX: "max",
    MAXLENGTH: "maxlength",
    MIN: "min",
    MINLENGTH: "minlength",
    NUMBER: "Number",
    OBJECTID: "ObjectID",
    REQUIRED: "required",
    UNIQUE: "unique"
};
/**
 *
 * @param {*} error
 * @param {Object} options
 */

var transform_mongoose_error = function transform_mongoose_error(error, options) {
    var _parse_options = (0, _utils.parse_options)(options),
        capitalize_option = _parse_options.capitalize_option,
        humanize_option = _parse_options.humanize_option;

    var error_messages = [];

    if (error.name === "ValidationError") {
        console.log("Validation Error");
        var attributes = Object.keys(error.errors);
        attributes.forEach(function (attribute) {
            var kind = error.errors[attribute].kind;
            var value = error.errors[attribute].value;
            var message = error.errors[attribute].message;
            error_messages.push(process_error(kind, attribute, value, message, capitalize_option, humanize_option));
        });
    } else if (error.name === "MongoError" && (error.code === 11000 || error.code === 11001)) {
        console.log("Mongo Error");
        var message = error.message;
        /**
         * Extract attribute
         */

        var keyRegex = message.match(/index:\s+([^\s]+)/);
        var rawKey = keyRegex ? keyRegex[1] : '';
        var attribute = rawKey.substring(0, rawKey.lastIndexOf('_'));
        /**
         * Extract value
         */

        var valueRegex = message.match(/key:\s+{\s+:\s\"(.*)(?=\")/);
        var value = valueRegex ? valueRegex[1] : '';
        error_messages.push(process_error(mongoose_error_kinds.UNIQUE, attribute, error.keyValue[attribute], message, capitalize_option, humanize_option));
    } else if (error.name === "CastError") {
        console.log("Cast Error");
        var path = error.path;
        var _message = error.message;

        if (error.kind === "ObjectId") {
            /**
             * Extract Model
             */
            var modelRegex = _message.match(/\"(.*?)\"/g);
            var model = modelRegex ? modelRegex[modelRegex.length - 1] : '';
            error_messages.push(process_error(mongoose_error_kinds.CASTERROR, path, model, _message, capitalize_option, humanize_option));
        } else {
            error_messages.push(_message);
        }
    } else if (error.message) {
        console.log("Error Message");
        error_messages.push(error.message);
    } else {
        console.log("Error");
        error_messages.push(error);
    }

    return error_messages;
};
/**
 * Returns an Error Message Object
 *
 * Error Message Object Definition: {field: attribute_name, message: 'customized error message' }
 *
 * @param {String} kind Mongoose Validation Error Kind
 * @param {String} name Name
 * @param {String} value Value
 * @param {String} message Default Message
 * @param {Boolean} capitalize_option Capitalize Name
 * @param {Boolean} humanize_option Humanize Name
 * @returns {Object} Error Message Object
 */


var process_error = function process_error(kind, name, value, message, capitalize_option, humanize_option) {
    var error = {
        field: name,
        message: ""
    };
    name = capitalize_option ? (0, _utils.capitalize)(name) : name;
    name = humanize_option ? (0, _utils.humanize)(name) : name;

    switch (kind) {
        case mongoose_error_kinds.BOOLEAN:
            error.message = boolean_message(name);
            break;

        case mongoose_error_kinds.BUFFER:
            error.message = buffer_message(name);
            break;

        case mongoose_error_kinds.DATE:
            error.message = date_message(name);
            break;

        case mongoose_error_kinds.ENUM:
            error.message = enum_message(name, value);
            break;

        case mongoose_error_kinds.MAX:
            error.message = max_message(name, value);
            break;

        case mongoose_error_kinds.MAXLENGTH:
            error.message = maxlength_message(name);
            break;

        case mongoose_error_kinds.MIN:
            error.message = min_message(name, value);
            break;

        case mongoose_error_kinds.MINLENGTH:
            error.message = minlength_message(name);
            break;

        case mongoose_error_kinds.NUMBER:
            error.message = number_message(name);
            break;

        case mongoose_error_kinds.OBJECTID:
            error.message = object_id_message(name);
            break;

        case mongoose_error_kinds.REQUIRED:
            error.message = required_message(name);
            break;

        case mongoose_error_kinds.UNIQUE:
            error.message = unique_message(name, value);
            break;

        case mongoose_error_kinds.CASTERROR:
            error.message = cast_error_message(name, value);
            break;

        default:
            error.message = message;
    }

    return error;
};
/**
 * Returns Boolean Related Error Message
 *
 * @param {String} attribute Name of the attribute
 */


var boolean_message = function boolean_message(attribute) {
    return "\"".concat(attribute, "\" debe ser booleano.");
};
/**
 * Returns Buffer Related Error Message
 *
 * @param {String} attribute Name of the attribute
 */


var buffer_message = function buffer_message(attribute) {
    return "\"".concat(attribute, "\" debe ser un búfer.");
};
/**
 * Returns Cast Error Related to Object Id Message
 *
 * @param {String} model Name of the model
 */


var cast_error_message = function cast_error_message(name, model) {
    return "".concat(model, " con el proporcionado \"").concat(name, "\" no existe.");
};
/**
 * Returns Date Related Error Message
 *
 * @param {String} attribute Name of the attribute
 */


var date_message = function date_message(attribute) {
    return "\"".concat(attribute, "\" debe ser una fecha.");
};
/**
 * Returns Enum Related Error Message
 *
 * @param {String} attribute Name of the attribute
 */


var enum_message = function enum_message(attribute, value) {
    return "\"".concat(value, "\" es un valor invalido para el atributo \"").concat(attribute, "\".");
};
/**
 * Returns Maxlength Related Error Message
 *
 * @param {String} attribute Name of the attribute
 */


var maxlength_message = function maxlength_message(attribute) {
    return "\"".concat(attribute, "\" es mas grande de lo permitido.");
};
/**
 * Returns Max Related Error Message
 *
 * @param {String} attribute Name of the attribute
 */


var max_message = function max_message(attribute, value) {
    return value instanceof Date ? "\"".concat(attribute, "\" es posterior a la fecha máxima permitida.") : "\"".concat(attribute, "\" es mayor que el valor máximo permitido.");
};
/**
 * Returns Minlength Related Error Message
 *
 * @param {String} attribute Name of the attribute
 */


var minlength_message = function minlength_message(attribute) {
    return "\"".concat(attribute, "\" es más corta que la longitud mínima permitida.");
};
/**
 * Returns Min Related Error Message
 *
 * @param {String} attribute Name of the attribute
 */


var min_message = function min_message(attribute, value) {
    return value instanceof Date ? "\"".concat(attribute, "\" es antes de la fecha mínima permitida.") : "\"".concat(attribute, "\" es menor que el valor mínimo permitido.");
};
/**
 * Returns Number Related Error Message
 *
 * @param {String} attribute Name of the attribute
 */


var number_message = function number_message(attribute) {
    return "\"".concat(attribute, "\" tiene que ser un número.");
};
/**
 * Returns ObjectId Related Error Message
 *
 * @param {String} attribute Name of the attribute
 */


var object_id_message = function object_id_message(attribute) {
    return "\"".concat(attribute, "\" debe ser una objecto identificador (ObjectId)");
};
/**
 * Returns Required Related Error Message
 *
 * @param {String} attribute Name of the attribute
 */


var required_message = function required_message(attribute) {
    return "\"".concat(attribute, "\" Es requerido.");
};
/**
 * Returns Unique Related Error Message
 *
 * @param {String} attribute Name of the attribute
 * @param {String} value Value of the attribute
 */


var unique_message = function unique_message(attribute, value) {
    return "".concat(attribute, " \"").concat(value, "\" ya existe.");
};

module.exports = transform_mongoose_error;
