import React from 'react';
import { Layout } from 'antd'
import "antd/dist/antd.css"

import { Route } from 'react-router-dom';
import { SiderAsesor } from '../componentes/Nav/nav'
import Dashboard from "../componentes/dashboard";


function AsesorRoutes() {

    return (
        <div className="admin" style={{ height: '100%' }}  >

            <Layout style={{ height: '100vh' }}  >
                <SiderAsesor />
                <Route  path="/admin/dashboard" component={Dashboard} />
                {/* <Route  path="/admin/prospectos" component={A_Prospectos} /> */}
              
                {/* <Route exact path="/admin/usuario" component={<InformacionPersonal />}/> */}
                {/*   <Route exact path="/superadmin/ajustes" component={Ajustes}  /> */}
            </Layout>
        </div>
    );

}

export default AsesorRoutes;
