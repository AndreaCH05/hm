import React from 'react';
import { Route, Switch } from "react-router-dom";

import Index from "../componentes/Landing/index"
import Login from "../componentes/Auth/login";

import { Register } from "../componentes/Auth/register";

import PasswordForgot from "../componentes/Auth/PasswordForgot"
import PasswordRecovery from "../componentes/Auth/PasswordRecovery"

// import SetUpProyectos from "../componentes/Auth/SetupProyecto/setup"

import { Plan } from '../componentes/Dashboard/UserAdmin/Ajustes/plan'

import "antd/dist/antd.css"

function PublicRoutes() {
    return (
        <Switch>
            <Route exact path="/" component={Index} />
            <Route exact path="/login" component={Login} />
            <Route exact path="/register" component={Register} />
            <Route exact path="/password/recovery" component={PasswordRecovery} />


            <Route
                exact
                path="/recovery/email-:email/token-:token"
                component={PasswordRecovery}
            />

            <Route
                exact
                path="/register/email-:email/token-:token"
                render={(props) => <PasswordRecovery {...props} title="Bienvenido" />}
            />



            <Route
                exact
                path="/setPassword/email-:email"
                render={(props) => <PasswordRecovery {...props} title="Bienvenido" setPassword={true} />}
            />
            {/* <Route exact path="/setup/proyectos/:nuevo" component={SetUpProyectos} /> */}

            <Route exact path="/admin/plan/:id" component={Plan} />


            <Route exact path="/privacidad" component={Plan} />
            <Route exact path="/terminos" component={Plan} />

        </Switch>
    )
}


export default PublicRoutes;
