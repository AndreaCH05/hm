import React from 'react';
import { Layout } from 'antd'
import "antd/dist/antd.css"

import { Route } from 'react-router-dom';
import { SiderSuperAdmin } from '../componentes/Nav/nav'
// import Dashboard from "../componentes/Dashboard/dashboard";
import Dashboard from "../componentes/Dashboard/UserSuperAdmin/dashboard";

import Industrias from '../componentes/Dashboard/UserSuperAdmin/industrias/industrias';
import Industria from '../componentes/Dashboard/UserSuperAdmin/industrias/industria';

import Cuenta from '../componentes/Dashboard/UserSuperAdmin/cuentas/cuenta';
import Cuentas from '../componentes/Dashboard/UserSuperAdmin/cuentas/cuentas';


import Proyectos from '../componentes/Dashboard/UserSuperAdmin/proyectos/proyectos';
import Proyecto from '../componentes/Dashboard/UserSuperAdmin/proyectos/proyecto';

import ProyectoProspectos from '../componentes/Dashboard/UserSuperAdmin/proyectos/proyecto_prospectos';
import EditarProyecto from '../componentes/Dashboard/UserSuperAdmin/proyectos/editar_proyecto';


function SuperAdminRoutes() {

    return (
        <div className="admin" style={{ height: '100%' }}  >
            <Layout style={{ height: '100vh' }}  >
                <SiderSuperAdmin />
                <Route exact path="/superadmin/dashboard" component={Dashboard} />
                <Route exact path="/superadmin/industrias" component={Industrias} />
                <Route exact path="/superadmin/industrias/nueva" component={Industria} />
                <Route exact path="/superadmin/industrias/editar/:id" component={Industria} />


                <Route exact path="/superadmin/cuentas" component={Cuentas} />
                <Route exact path="/superadmin/cuentas/cuenta_detalle/:id" component={Cuenta} />


                
                <Route exact path="/superadmin/proyectos" component={Proyectos} />
                <Route exact path="/superadmin/proyectos/proyecto/:id" component={Proyecto} />
                <Route exact path="/superadmin/proyectos/:id/prospectos" component={ProyectoProspectos} />
                <Route exact path="/superadmin/proyectos/editar_proyecto/:id" component={EditarProyecto} />



            </Layout>
        </div>
    );

}

export default SuperAdminRoutes;
