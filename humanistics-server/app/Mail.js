const nodemailer = require('nodemailer');
const hbs = require('nodemailer-express-handlebars');
// const PDF = require('../PDF')
const path = require('path');
const base32 = require('base32');






const register = function (Handlebars) {

    const helpers = {
        asset: function (asset) {
            console.log(`process.env.HOST + '/' + asset`, process.env.HOST + '/' + asset)
            return process.env.HOST + '/' + asset
        },
        
        storage: function (asset) {
            return process.env.URL + '/upload/' + asset
        },
        
        money: function (float) {
            return parseFloat(float).toFixed(2)
        },
        
        recovery: function (token, email) {
            return process.env.URL + `/recovery/email-${email}/token-${base32.encode(token)}`
        },
        
        welcome: function (token, email) {
            return process.env.URL + `/register/email-${email}/token-${base32.encode(token)}`
        },
        
        login: function () {
            return process.env.URL + `/login`
        },
        
        setPassword: function (email) {
            return process.env.URL + `/setPassword/email-${email}`
        },

        consoleLog: function (value) {
            console.log(value)
        }
    };

    if (Handlebars && typeof Handlebars.registerHelper === "function") {
        // register helpers
        for (var prop in helpers) {
            Handlebars.registerHelper(prop, helpers[prop]);
        }
    } else {
        // just return helpers object if we can't register helpers here
        return helpers;
    }

};

module.exports = class Mail {
    /**
     * Configuración de las vistas para handlearabrs
     * */
    status = null;

    configOptions = {
        viewEngine: {
            layoutsDir: path.join(__dirname, '../resources/views/mails/'),
            defaultLayout: 'bienvenida',
            partialsDir: path.join(__dirname, '../resources/views/mails/'),
            helpers: register(null)
        },
        viewPath: path.join(__dirname, '../resources/views/mails/'),

    };

    transporter = {
        host: 'smtp.zoho.com',
        port: 465,
        secure: true, //ssl
        auth: {
            user: 'notifications@humanistics.mx',
            pass: 'Iseeyoutech1$'
        }
    }


    mailOptions = {
        from: '"Humanistics" <notifications@humanistics.mx>',
        to: '',
        subject: '',
        template: '',
        context: {}
    };

    /**
     * Creates an instance of Mail.
     * @param {*} { subject, template, values, user, attachments = [], from_email = null}
     * 
     * @param {*} subject Asunto del correo
     * @param {*} template Nombre del template a utilizar
     * @param {*} values Valores a sustituir
     * @param {*} user Usuario a enviar el correo electronico
     * @param {*} attachments Arreglo de archivos a enviar
     * 
     * @param {*} from_email En caso de que se desee cambir el correo, se indica. Si existe al configuración se sustituyye por la del defecto. Caso contrario no. 
     */
    constructor({ subject, template, values, user, attachments = [], from_email = null }) {

        this.transporter = nodemailer.createTransport(this.transporter);

        this.configOptions.viewEngine.defaultLayout = template;

        this.mailOptions.template = template;
        this.mailOptions.context = {
            ...values,
            user: (user?.nombre != null && user?.nombre != undefined) ? user.toObject() : user
        };

        this.mailOptions.to = user.email;
        this.mailOptions.subject = subject;


        this.mailOptions.alternatives = [];
        this.mailOptions.attachments = attachments;


        this.transporter.use('compile', hbs(this.configOptions));
    }

    async send() {
        return this.transporter.sendMail(this.mailOptions);
    }
};