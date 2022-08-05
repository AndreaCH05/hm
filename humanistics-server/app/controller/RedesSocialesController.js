const jwt = require('jsonwebtoken');
const base32 = require('base32')

const https = require('https');
const fs = require('fs');




var FB = require('fb').default;


const Usuarios = require('../../models/usuarios');
const Roles = require('../../models/roles');
const Proyectos = require('../../models/proyectos');
const Estatus = require('../../models/estatus');

const Prospectos = require('../../models/prospectos');
const /*ProspectosCola */ ProspectosHistorial = require('../../models/prospectos_historial');

const RedesSociales = require('../../models/redes_sociales');
const Automatizaciones = require('../../models/automatizaciones');
const ErrorHandler = require('../../utils/mongoose-validation-error-handler/index');

const Mail = require('../Mail');
const { features } = require('process');

FB.options({
    version: process.env.FB_VERSION,
    appId: process.env.FB_APP_ID
});

const storage = './storage/uploads/';

/**
 * @class AuthController.js
 * @description
 */
module.exports = class FacebookController {


    /**
     * @static
     * @memberof AuthController
     *
     * @method listRedesSociales
     * @description Obtenemos las lista de redes sociales paginada.
     * */
    static listRedesSociales = async ({ query }, response) => {
        let filter = {}

        if (query.proyecto_id)
            filter.proyectos_id = query.proyecto_id


        console.log('query', query);
        console.log('filter', filter);
        RedesSociales.paginate(filter, {
            page: (query.page == undefined) ? 1 : query.page,
            limit: (query.limit == undefined) ? 10 : query.limit,
            populate: ['usuarios_id', 'proyectos_id'],
            customLabels: {
                totalDocs: 'total',
                docs: 'data',
                limit: 'limite',
                page: 'page',
                totalPages: 'total_pages',
            }
        })
            .then(data => response.send({
                success: true,
                data
            }))
            .catch(error => response.status(400).send({
                success: true,
                error
            }))

    }




    /**
     * @static
     * @memberof AuthController
     *
     * @method facebook
     * @description Registra o inicia sesion con facebook.
     * */
    static facebookLogin = async ({ body }, response) => {
        console.log('body', body)
        FB.options({ timeout: 6000, accessToken: body.response.accessToken })
        FB.api('/me', 'GET', { "fields": "email,first_name,middle_name,last_name" }, async res => {

            if (res == undefined || res == null) {
                return response.status(400).json({
                    success: false,
                    message: "No está disponible la aplicación de facebook."
                })
            } else if (res.error) {
                return response.status(400).json({
                    success: false,
                    message: "Ha ocurrido un error al procesar su solicitud."
                })
            }

            let usuario = await Usuarios.findOne({
                email: res.email,
            }).populate('rol_id').select('-password')


            if (usuario == null) {
                let rol = await Roles.findOne({ nombre: "Empresa" });
                const usuario = new Usuarios({
                    nombre: ((res.first_name) ? res.first_name : '') + ' ' + ((res.last_name) ? res.last_name : ''),
                    email: res.email,
                    rol_id: rol._id,
                    facebook: body.response
                });
                usuario.save()
                    .then(async usuario => {
                        await usuario.getLongToken()
                        const token = usuario.token();
                        response.header('Access-Control-Allow-Origin', '*');
                        response.header('Access-Control-Expose-Headers', 'Authorization');


                        // curl -i -X GET "https://graph.facebook.com/{graph-api-version}/oauth/access_token?  
                        // grant_type=fb_exchange_token&          
                        // client_id={app-id}&
                        // client_secret={app-secret}&
                        // fb_exchange_token={your-access-token}" 
                        // FB.api('/oauth/access_token', 'GET', { "fields": "email,first_name,middle_name,last_name" }, async res => {
                            


                        // })

                        return response.header('Authorization', token).status(200).json({
                            success: true,
                            message: 'Se ha agregado el usuario exitosamente.',
                            token,
                            status: usuario.status,
                            rol: rol.nombre,
                            option: 1
                        })
                    })
                    .catch(error => {
                        console.log('error  AA', error);
                        return response.status(400).json({
                            success: false,
                            message: ErrorHandler(error, { capitalize: true, humanize: true })
                        })
                    })


                    // curl -i -X GET "https://graph.facebook.com/{graph-api-version}/oauth/access_token?  
                    // grant_type=fb_exchange_token&          
                    // client_id={app-id}&
                    // client_secret={app-secret}&
                    // fb_exchange_token={your-access-token}" 

            } else {
                let projects = await Proyectos.countDocuments({ usuarios_id: usuario._id })
                usuario.facebook = body.response;
                await usuario.save()

                const token = usuario.token();
                await usuario.getLongToken()
                response.header('Access-Control-Allow-Origin', '*');
                response.header('Access-Control-Expose-Headers', 'Authorization');

                if (projects == 0) {
                    return response.header('Authorization', token).status(200).json({
                        success: true,
                        token: token,
                        status: usuario.status,
                        rol: usuario.rol_id.nombre,
                        option: 1
                    })
                }
                return response.header('Authorization', token).status(200).json({
                    success: true,
                    token: token,
                    status: usuario.status,
                    rol: usuario.rol_id.nombre,
                    option: 2
                })
            }
        });
    };


    /**
     * @static
     * @memberof AuthController
     *
     * @method facebook
     * @description Actualizamos la lista de páginas para el usuario.  
     * */
    static facebookPages = async ({ body, user }, response) => {


        if (typeof body.response.accessToken != "string" || !(FB)) {
            return response.status(400).json({
                success: false,
                message: "No está disponible la aplicación de facebook."
            })
        }


        user.facebook = body.response;
        await user.save();
        user = await user.getLongToken()
        
        FB.options({ timeout: 6000, accessToken: user.facebook.accessToken });
        //Obtenemos las cuentas de facebook.
        const facebookPages = await FB.api('/me/accounts', 'GET', { limit: 999 });

        //Si la respuesta es invalida
        if (facebookPages == undefined || facebookPages == null) {
            return response.status(400).json({
                success: false,
                message: "No está disponible la aplicación de facebook."
            })
        } else if (facebookPages.error) {
            return response.status(400).json({
                success: false,
                message: "Ha ocurrido un error al procesar su solicitud."
            })
        }

        let notIn = [];

        //Iteramos la lista de paginas de facebook del usuario, se actualiza en caso de que sea necesario
        if (Array.isArray(facebookPages.data))
            for (let facebookPageData of facebookPages.data) {
                // console.log('facebookPageData, ', facebookPageData)
                const filename = facebookPageData.id + ".jpg";

                let facebookPage = await RedesSociales.findOne({ id: facebookPageData.id })
                // console.log('facebookPage, ', facebookPage)
                if (facebookPage == null) {
                    facebookPageData.proyectos_id = body.proyecto_id
                    facebookPage = new RedesSociales(facebookPageData)
                } else {
                    facebookPage.tasks = facebookPageData.tasks
                    facebookPage.access_token = facebookPageData.access_token
                    facebookPage.category = facebookPageData.category
                    facebookPage.category_list = facebookPageData.category_list
                    facebookPage.name = facebookPageData.name
                }
                facebookPage.usuarios_id = user._id

                // await facebookPage.bindFacebookPage()                
                //Eliminamos el avatar anterior
                try {
                    fs.unlinkSync(storage + filename);
                } catch (error) {
                    console.log('Eliminar no existe', error);
                }
                //Actualizamos el avatar
                const facebookProfilePictureData = await FB.api('/' + facebookPageData.id + '/picture', 'GET', { "redirect": "false", height: 600 })
                if (facebookProfilePictureData.data.url)
                    https.get(facebookProfilePictureData.data.url, response => response.pipe(fs.createWriteStream(storage + filename)))
                facebookPage.avatar = filename;
                // await facebookPage.save()
                // notIn.push(facebookPage._id)
            }

        //Eliminamos las páginas de facebook que no son valida ya y no tienen proyecto Y no existe
        RedesSociales.find({ _id: { $nin: notIn }, usuarios_id: user._id })
            .then(facebookPages => facebookPages.forEach(facebookPage => {

                facebookPages.unbindFacebookPage()

                if (!(facebookPage.proyectos_id))
                    facebookPage.delete()
            }))




        return response.status(200).json({
            success: true,
            message: "Lista de Paginas de Facebook Actualizada."
        })
    }

    /**
     *
     *
     * @static
     * @param {*} { query, user }
     * @param {*} response
     * 
     * @method Obtenemos la lista de proyectos.
     */
    static getFacebookPages = async ({ query, user }, response) => {
        return response.status(200).json({
            success: true,
            message: "Lista de Paginas de Facebook Actualizada.",
            data: await RedesSociales.find({ usuarios_id: user._id })
        })
    }


    /**
     *
     *
     * @static
     * @param {request.body} facebookpage_id pagina a la cual se le asginará un proyecto
     * @param {request.body} proyecto_id ID del proycecto a asignar
     * @param {request.unset} unset Si es TRUE, deslinda la página de facebook.
     * @param {*} response
     * 
     * @method setRedesSocialesToProject
     * @description Establecemos una pagina de facebook a un proyecto
     */
    static facebookToProject = async ({ body, user }, response) => {

        RedesSociales.findOne({
            _id: body.facebookpage_id
        })
            .then(facebook_page => {


                if (body.unset) {
                    return RedesSociales.updateOne({ _id: body.facebookpage_id }, { $unset: { proyectos_id: 1 } })
                        .then(async e => {

                            facebook_page.unbindFacebookPage()
                                .then(res => {
                                    console.log('res', res);
                                    response.status(200).send({
                                        success: true,
                                        message: "Se deslindó correctamente."
                                    })
                                })
                                .catch(e => response.status(400).send({
                                    success: false,
                                    message: "No fue posible deslindar."
                                }))

                        })
                        .catch(e => response.status(400).send({
                            success: false,
                            message: "No es posible eliminar "
                        }))
                } else {
                    FB.api(`me/accounts`, {
                        access_token: user.facebook.accessToken
                    }, function (res) {

                        console.log('RES RES RES RES ', res);
                        facebook_page.proyectos_id = body.proyecto_id

                        // console.log('PRE SAVE REST', res);
                        if (!res || res.error) {
                            return reject(res)
                        }


                        if (Array.isArray(res.data)) {
                            console.log('res.data ', res.data);
                            let pagina = res.data.find(pagina => pagina.id.toString() === facebook_page.id)
                            if (pagina !== null) {
                                console.log('SE ACEPTO TOKEN DE LARGA DURACIÓN');
                                facebook_page.access_token = pagina.access_token
                            }

                        }

                        facebook_page.save()
                            .then(facebook_page => {

                                console.log('facebook_page', facebook_page);

                                facebook_page.bindFacebookPage()
                                    .then(res => {
                                        console.log('res', res);
                                        response.status(200).send({
                                            success: true,
                                            message: "Se vinculó correctamente."
                                        })
                                    })
                                    .catch(e => {

                                        console.log('er', e);
                                        response.status(400).send({
                                            success: false,
                                            message: "No fue posible vincular."
                                        })
                                    })

                            })
                            .catch(e => response.status(400).send({
                                success: false,
                                message: "No fue posible eliminar. ",
                                data: facebook_page
                            }))


                    })
                }
            })
            .catch(error => {
                response.status(400).send({
                    status: false,
                    message: "No es posible guardar"
                })
            })
    }


    /**
     *
     *
     * @static
     * @param request.query.proyectos_id Proyecto del cual se obtendrá la pagina.
     * @param {*} response
     * 
     * @method getFacebookPageByProject
     * @description Obtenemos una pagina de facebook
     */
    static getFacebookPageByProject = async ({ query, user }, response) => {
        RedesSociales.findOne({
            proyectos_id: query.proyectos_id,
            usuarios_id: user._id
        })
            .then(facebook_page => {
                response.status(200).send({
                    status: true,
                    data: facebook_page
                })
            })
            .catch(error => {
                response.status(400).send({
                    status: false,
                    message: "No es posible guardar"
                })
            })
    }

    /**
     *
     *
     * @static
     * @param 
     * @param {*} response
     * 
     * @method prospectos
     * @description Se ejecuta cuando facebook envia un prospecto.
     */
    static prospectos = async ({ body, query }, res) => {


        Usuarios.validarTokens()
        
        const util = require('util')
        if (query['hub.verify_token'] === process.env.FB_APP_ID_SECRET_VALIDATE)
            return res.send(query['hub.challenge'])

        console.log('verficaición pasada')
        if (Array.isArray(body.entry) && body.object === 'page') {

            console.log('llegó una entrada de prospecto')
            for (const fb_object of body.entry) {
                for (const change of fb_object.changes) {
                    console.log('iterando campos del prospecto')
                    if (change.field === "leadgen" && typeof change.value === "object") {


                        const { form_id, leadgen_id, created_time, page_id } = change.value

                        let facebookPage = await RedesSociales.findOne({ id: page_id })
                            .populate('usuarios_id')
                            .populate('proyectos_id')

                        if (facebookPage == null)
                            return res.status(400).send({
                                success: false,
                                message: "No se encontró la pagina de facebook. ¿La pagina si existe?"
                            })

                        FB.options({ timeout: 6000, accessToken: facebookPage.access_token })

                        FB.api(`/${change.value.leadgen_id}/`, async function (response) {

                            console.log('guardadndo campos')
                            if (response && !response.error) {
                                console.log(util.inspect(facebookPage, { showHidden: false, depth: null, colors: true }))
                                console.log(util.inspect(response, { showHidden: false, depth: null, colors: true }))
                                let data = {}
                                if (Array.isArray(response.field_data))
                                    for (const field of response.field_data) {
                                        let name = field['name']
                                        let values = field['values'][0]
                                        data[name] = values
                                    }
                                console.log(util.inspect({ data }, { showHidden: false, depth: null, colors: true }))
                                let { nombre, telefono, full_name, email, phone_number } = data

                                if (phone_number)
                                    telefono = phone_number

                                if (full_name)
                                    nombre = full_name                                

                                let estatus = await Estatus.findOne({ proyectos_id: facebookPage?.proyectos_id?._id, tipo: 1 })

                                console.log('estatus', estatus)
                                console.log('facebookPage', facebookPage)

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
                                    fb_leadgen_id: leadgen_id,
                                    fb_form_id: form_id,
                                    red_social_id: facebookPage._id,
                                    response_webhook: change.value,
                                    response_lead: response
                                })
                                    .then(() => res.send({ success: true }))
                                    .catch((error) => {
                                
                                        ProspectosHistorial.create({
                                            fuente: 2,
                                            usuarios_id: facebookPage?.usuarios_id,
                                            proyectos_id: facebookPage?.proyectos_id?._id,
    
                                            fb_leadgen_id: leadgen_id,
                                            fb_form_id: form_id,
                                            red_social_id: facebookPage._id,

                                            response_webhook: change.value,
                                            response_lead: response,
                                            error
                                        })
                                        .then(() => res.send({ success: true, message: "Hubo un error, se guardó en el historial" }))
                                        .catch(error => {
                                            console.log('error', error)
                                            res.send({ success: true, error })
                                        })

                                    })

                            }else{
                                
                                ProspectosHistorial.create({
                                    fuente: 2,
                                    usuarios_id: facebookPage?.usuarios_id,
                                    proyectos_id: facebookPage?.proyectos_id?._id,

                                    fb_leadgen_id: leadgen_id,
                                    fb_form_id: form_id,
                                    red_social_id: facebookPage._id,
                                })
                                .then(() => res.send({ success: true, message: "No se pudo guardar" }))
                                .catch(error => {
                                    console.log('error', error)
                                    res.send({ success: true, error })
                                })
                            }
                        }
                        );
                    }                   
                }
            }
        } else {
            return response.status(200).send(query['hub.challenge'])
        }
    };




    /**
     * @static
     * @memberof AuthController
     *
     * @method facebook
     * @description Registra o inicia sesion con facebook.
    * */
    static getAddAccounts = async ({ body, user }, response) => {
        FB.options({
            version: process.env.FB_VERSION,
            appId: process.env.FB_APP_ID,
            timeout: 6000
        });


        if (user?.facebook?.accessToken)
            return FB.api(`/me`, {
                fields: "adaccounts{account_id,name}",
                access_token: user.facebook.accessToken
            }, function (res) {
                console.log('res', res);
                if (!res || res.error) {
                    return response.status(400).send(res)
                }

                return response.status(200).send(res)
            });
        else return response.status(400).send({
            data: "Error",
            message: "Debe de haber iniciado sesión con facebook."
        })
    }



    /**
     * @static
     * @memberof AuthController
     *
     * @method facebook
     * @description Registra o inicia sesion con facebook.
    * */
    static getCampaigns = async ({ body, user }, response) => {

        console.log('body.add_account_id:', body);

        FB.options({
            version: process.env.FB_VERSION,
            appId: process.env.FB_APP_ID,
            timeout: 6000,
            accessToken: user?.facebook?.accessToken
        });
        // FB.options({ version: 'v11.0', appId: '359784655002061', timeout: 6000, accessToken: user?.facebook?.accessToken })
        // campaigns?fields=name
        if (user?.facebook?.accessToken)

            return FB.api(`/${body.add_account_id}/campaigns`, {
                fields: "name",
                access_token: user.facebook.accessToken
            }, function (res) {
                console.log('res', res);
                if (!res || res.error) {
                    return response.status(400).send(res)
                }
                return response.status(200).send(res)
            })
        else return response.status(400).send({
            data: "Error",
            message: "Debe de haber iniciado sesión con facebook."
        })
    }


    /**
     * @static
     * @memberof AuthController
     *
     * @method getForms
     * @description Obtenemos los formularios registrados para las automatizaciones. 
     * 
     * @param query.red_social_id ID de la red social
    * */
    static getForms = async ({ body, query, user }, response) => {

        console.log('query.red_social_id', query);
        RedesSociales.findOne({
            _id: query.red_social_id
        })
            .then(facebook_page => {
                FB.options({ accessToken: facebook_page.access_token })
                return FB.api(`/${facebook_page.id}/leadgen_forms`, {
                    fields: "name",
                    access_token: facebook_page.access_token
                }, function (res) {
                    if (!res || res.error) {
                        return response.status(400).send(res)
                    }
                    return response.status(200).send(res)
                })
            })
            .catch(error => {
                console.log('error', error);
                response.status(400).send({
                    status: false,
                    message: "No es posible guardar"
                })
            })
    }

    /**
     * @static
     * @memberof AuthController
     *
     * @method delete
     * @description Eliminamos y deslindamos la red social. 
     * 
     * @param query.red_social_id ID de la red social
    * */
    static delete = async ({ query }, response) => {
        RedesSociales.findOne({
            _id: query.red_social_id
        })
            .then(facebook_page => {
                FB.options({ accessToken: facebook_page.access_token })
                facebook_page.unbindFacebookPage()
                    .then(x => {
                        facebook_page.delete()
                            .then(() => {
                                response.status(200).send({
                                    status: true,
                                    message: "Eliminado y Deslindando de facebook correctamente."
                                })
                            })
                            .catch(x => {
                                response.status(400).send({
                                    status: false,
                                    message: "No es posible eliminar."
                                })
                            })
                    })
                    .catch(x => {

                        response.status(400).send({
                            status: false,
                            message: "No es posible deslindar de facebook."
                        })
                    })
            })
            .catch(error => {
                console.log('error', error);
                response.status(400).send({
                    status: false,
                    message: "No es posible obtener la red social."
                })
            })



    }

    /**
     * @static
     * @memberof AuthController
     *
     * @method relation
     * @description Permite deslindar o realcionar la pagina. Al deslindarla, se desactiva el webhook. Al activar, se activa el webhook.
     * 
     * @param query.red_social_id ID de la red social
    * */
    static relation = async ({ body }, response) => {


        RedesSociales.findOne({
            _id: body.red_social_id
        })
            .then(facebook_page => {
                FB.options({ accessToken: facebook_page.access_token })
                if (body.relation === true)
                    facebook_page.bindFacebookPage()
                        .then(x => {
                            response.status(200).send({
                                status: true,
                                message: "Relacionado correctamente."
                            })
                        })
                        .catch(x => {

                            response.status(400).send({
                                status: false,
                                message: "No es posible deslindar de facebook."
                            })
                        })
                else
                    facebook_page.unbindFacebookPage()
                        .then(x => {
                            response.status(200).send({
                                status: false,
                                message: "Desrelacionado correctamente."
                            })
                        })
                        .catch(x => {
                            response.status(400).send({
                                status: false,
                                message: "No es posible deslindar."
                            })
                        })
            })
            .catch(error => {
                console.log('error', error);
                response.status(400).send({
                    status: false,
                    message: "No es posible obtener la red social."
                })
            })
    }


    /**
     * @static
     * @memberof AuthController
     *
     * @method validate_social
     * @description Permite deslindar o realcionar la pagina. Al deslindarla, se desactiva el webhook. Al activar, se activa el webhook.
     * 
     * @param query.red_social_id ID de la red social
    * */
    static proyecto = async ({ body, query }, response) => {
        RedesSociales.findOne({
            _id: body.red_social_id
        })
            .then(facebook_page => {

                FB.options({ accessToken: facebook_page.access_token })

                if (body.proyecto_id) {
                    Proyectos.findOne({ _id: body.proyecto_id })
                        .then(proyecto => {

                            facebook_page.proyectos_id = proyecto._id;
                            facebook_page.save()
                                .then(facebook_page => {
                                    facebook_page.bindFacebookPage()
                                        .then(() => response.status(200).send({
                                            status: false,
                                            message: "Enlazado Correctamente."
                                        }))
                                        .catch(error => {
                                            return response.status(400).send({
                                                status: false,
                                                message: "No fue posible enalzar."
                                            })
                                        })
                                })
                                .catch(error => {
                                    return response.status(400).send({
                                        status: false,
                                        message: "No fue posible enalzar."
                                    })
                                })


                        })
                        .catch(error => {
                            return response.status(400).send({
                                status: false,
                                message: "No es existe el proyecto."
                            })
                        })
                } else {
                    
                    facebook_page.proyectos_id = null;

                    facebook_page.save()
                        .then(facebook_page => {
                            facebook_page.unbindFacebookPage()
                                .then(() => response.status(200).send({
                                    status: false,
                                    message: "Enlazado Correctamente."
                                }))
                                .catch(error => {
                                    return response.status(400).send({
                                        status: false,
                                        message: "No fue posible enalzar."
                                    })
                                })
                        })
                        .catch(error => {
                            return response.status(400).send({
                                status: false,
                                message: "No fue posible enalzar."
                            })
                        })
                    


                }





                // if (body.relation === true)
                //     facebook_page.bindFacebookPage()
                //         .then(x => {
                //             response.status(200).send({
                //                 status: true,
                //                 message: "Relacionado correctamente."
                //             })
                //         })
                //         .catch(x => {

                // response.status(400).send({
                //     status: false,
                //     message: "No es posible deslindar de facebook."
                // })
                //         })
                // else
                //     facebook_page.unbindFacebookPage()
                //         .then(x => {
                // response.status(200).send({
                //     status: false,
                //     message: "Desrelacionado correctamente."
                // })
                //         })
                //         .catch(x => {
                //             response.status(400).send({
                //                 status: false,
                //                 message: "No es posible deslindar."
                //             })
                //         })
            })
            .catch(error => {
                console.log('error', error);
                response.status(400).send({
                    status: false,
                    message: "No es posible obtener la red social."
                })
            })


        // response.send(query['hub.challenge'])
    }




}



