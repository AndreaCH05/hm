import React from 'react';
import {BrowserRouter, Route, Switch,Redirect } from "react-router-dom";

/**
 * Rutas Publicas
 * */
import PublicRoutes from './PublicRoutes';
import AdminRoutes from './AdminRoutes.js';
import SuperAdminRoutes from './SuperAdminRoutes.js';


import StepsRoutes from './StepsRoutes';

import Auth from "./Middlewares/Auth";

import "antd/dist/antd.css"

const PrivateRoute = ({ component: Component, ...rest }) => (
    <Route {...rest} render={(props) => (
      Auth === true
        ? <Component {...props} />
        : <Redirect to='/login' />
    )} />
  )

  
const Root = () => {


    return (
        <Switch>
            {/* <PrivateRoute  path='/steps'  >
                <StepsRoutes />
            </PrivateRoute> */}
            <PrivateRoute  path='/admin'  >
                <AdminRoutes />
            </PrivateRoute>
            <PrivateRoute  path='/superadmin'  >
                <SuperAdminRoutes />
            </PrivateRoute>
            {/* <PrivateRoute  path='/asesor'  >
                <AsesorRoutes />
            </PrivateRoute> */}
            <PublicRoutes />
        </Switch>
    )
}

function AppRoutes(){

    return(

            <BrowserRouter>
                <Root/>
            </BrowserRouter>

    )
}

export default AppRoutes;