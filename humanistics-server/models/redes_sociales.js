const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var FB = require('fb').default;
var axios = require('axios')

const mongoosePaginator = require('mongoose-paginate-v2');
const mongoosePaginatorAgregate = require('mongoose-aggregate-paginate-v2');

// FB.options({ version: , appId: '359784655002061', timeout: 6000, });

FB.options({
    version: process.env.FB_VERSION,
    appId: process.env.FB_APP_ID,
    timeout: 6000,
});

const RedesSociales = new Schema(
    {

        usuarios_id: {
            type: Schema.Types.ObjectId,
            ref: 'usuarios',
            require: true
        },

        proyectos_id: {
            type: Schema.Types.ObjectId,
            ref: 'proyectos',
        },



        access_token: {
            type: String,
            required: true
        },

        id: {
            type: String,
            required: true
        },


        avatar: String,
        category: String,
        category_list: [
            {
                id: String,
                name: String,
            }
        ],
        name: String,
        tasks: [String],

        
        usuarios_id: {
            type: Schema.Types.ObjectId,
            ref: 'usuarios'
        },


        tipo: {
            type: String,
            default: "facebook"
        },


        relationed: {
            type: Boolean,
            default: false,
        }
    },
    { timestamps: true }
)


RedesSociales.methods.bindFacebookPage = function () {

    console.log('* ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** *')
    console.log('* ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** *')
    console.log('* ** ** ** **  ** *bindFacebookPage** ** ** ** ** ** ** *')
    console.log('* ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** *')
    let facebook_page = this
    let { access_token, id } = facebook_page

    return new Promise((resolve, reject) => {
        FB.api(`${id}/subscribed_apps`, 'post', {
            subscribed_fields: "leadgen",
            access_token
        }, function (res) {
            
            console.log('bindFacebookPage response', res);
            
            if (!res || res.error) {
                console.log('NO SE RELACiONÓ')
            }else{
                facebook_page.relationed = true
            }

            facebook_page.save()
                .then(() => resolve(res))
                .then(() => reject(res))
        });
    })
}


RedesSociales.methods.unbindFacebookPage = function () {

    console.log('* ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** *')
    console.log('* ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** *')
    console.log('* ** ** ** **  ** *unbindFacebookPage** ** ** ** ** ** ** *')
    console.log('* ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** *')
    const facebook_page = this
    const { access_token, id } = facebook_page
    
    return new Promise((resolve, reject) => {
        FB.api(`${id}/subscribed_apps`, 'delete', {
            subscribed_fields: "leadgen",
            access_token
        }, function (res) {
            console.log('unbindFacebookPage response', res);
            
            if (!res || res.error) {
                console.log('NO SE DESLINDÓ')
            }else{
                facebook_page.relationed = false
            }

            facebook_page.save()
                .then(() => resolve(res))
                .then(() => reject(res))
        });
    })
}


// RedesSociales.methods.updateProspectos = function () {

//     console.log('* ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** *')
//     console.log('* ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** *')
//     console.log('* ** ** ** **  **  agregarProspectos  ** ** ** ** ** ** *')
//     console.log('* ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** *')
//     const facebook_page = this
//     const { access_token, id } = facebook_page


//     return new Promise((resolve, reject) => {
//         FB.api(`${id}/subscribed_apps`, 'delete', {
//             subscribed_fields: "leadgen",
//             access_token
//         }, function (res) {
//             console.log('res', res);
//             if (!res || res.error) {

//                 return reject(res)
//             }

//             resolve(res)
//         });
//     })
// }



RedesSociales.methods.updateProspectos = async function () {

    console.log('* ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** *')
    console.log('* ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** *')
    console.log('* ** ** ** **  **  agregarProspectos  ** ** ** ** ** ** *')
    console.log('* ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** ** *')
    
    const prospectos = await this.model('prospectos_cola', { red_social_id: this._id })
    

    FB.options({ timeout: 6000, accessToken: facebookPage.access_token })

    for (const prospecto of prospectos) {
        
        FB.api(`/${prospecto.fb_leadgen_id}/`, async function (response) {
            
            if (response && !response.error) {


                let data = {}

                if (Array.isArray(response.field_data))
                    for (const field of response.field_data) {
                        let name = field['name']
                        let values = field['values'][0]
                        data[name] = values
                    }
                let { nombre, telefono, full_name, email, phone_number } = data

                if (phone_number)
                    telefono = phone_number

                // fuente: 2,
                // usuarios_id: facebookPage?.usuarios_id,
                // proyectos_id: facebookPage?.proyectos_id?._id,
                // estatus: estatus._id,
                // fb_leadgen_id: leadgen_id,
                // fb_form_id: form_id,
                // red_social_id: facebookPage._id,

                let estatus = await this.model('estatuses').findOne({ proyectos_id: (
                    (this?.proyectos_id?._id) ? this?.proyectos_id?._id : this?.proyectos_id
                ), tipo: 1 })
                //Asignar A 
                Prospectos.create({
                    nombre,
                    telefono,
                    email,
                    fuente: 2,
                    usuarios_id: facebookPage?.usuarios_id,
                    proyectos_id: facebookPage?.proyectos_id?._id,
                    asignado_por: null,
                    actividad: [{ entrada: "Creado mediante Facebook. " }],
                    estatus: estatus._id,
                    fb_leadgen_id: prospecto.fb_leadgen_id,
                    fb_form_id: prospecto.fb_leadgen_id,
                    red_social_id: prospecto.fb_leadgen_id,
                })

            }
        });


    }
}





RedesSociales.plugin(mongoosePaginator);
RedesSociales.plugin(mongoosePaginatorAgregate);
module.exports = mongoose.model('redes_sociales', RedesSociales);

