//IMPORTACION DE LIBRERIAS
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const fileupload = require("express-fileupload");
// const a = require('nodemailer-express-handlebars');



//Configuraciones locales
const authRouter = require('./routes/AuthRouter');
const FilesRouter = require('./routes/FilesRouter');
const UsuariosRouter = require('./routes/UsuariosRouter');
const PlantillasRouter = require('./routes/PlantillasRouter');
const ProjectsRouter = require('./routes/ProjectsRouter');
const ProspectosRouter = require('./routes/ProspectosRouter');
const IndustriasRouter = require('./routes/IndustriasRouter');
const PlanesRouter = require('./routes/PlanesRouter');
const DashboardRouter = require('./routes/DashboardRouter');
const PagosRouter = require('./routes/PagosRouter');
const AutomatizacionesRouter = require('./routes/AutomatizacionesRouter');
const ProductosRouter = require('./routes/ProductosRouter');
const EstatusRouter = require('./routes/EstatusRouter');
const RedesSocialesRouter = require('./routes/RedesSocialesRouter');

const SegmentosRouter = require('./routes/SegmentosRouter');

// const FacebookCampaignsRouter = require('./routes/FacebookCampaignsRouter');


const BodyChecker = require('./app/middleware/BodyChecker');




app.use(cors());
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

app.use(fileupload());

app.use(BodyChecker);


app.use(express.static('public'))


/* TESTING STUFF */
app.get('/',(request,response)=>{
    response.send('Humanistics SERVER 0.1.0 !!')
});


// app.get('/mail',(request,response)=>{

//     const View = require('./app/View')

//     response.send(View.render('mails/token_vencido').output)
// });



//Agregamos las al servidor
app.use(
    authRouter,
    UsuariosRouter,
    FilesRouter,
    IndustriasRouter,
    PlantillasRouter,
    PlanesRouter,
    ProjectsRouter,
    ProspectosRouter,
    DashboardRouter,
    PagosRouter,
    AutomatizacionesRouter,
    ProductosRouter,
    EstatusRouter,
    RedesSocialesRouter,
    SegmentosRouter,

    // FacebookCampaignsRouter
);
// app.use();


module.exports = app;

