import React, { Component } from 'react';
import { BrowserRouter, Redirect, Route } from 'react-router-dom';
import { Layout } from 'antd';
import 'antd/dist/antd.css'
// Routes
import PublicRoutes from "./Routes/PublicRoutes";
import AuthVerify from "./Routes/Middlewares/Auth";
import AdminRoutes from "./Routes/AdminRoutes";
import SuperAdminRoutes from "./Routes/SuperAdminRoutes"
import StepsRoutes from "./Routes/StepsRoutes"

import axios from 'axios'


import Logged from './Hooks/Logged'


const PrivateRoute = ({ component: Component, ...rest }) => (
    <Route {...rest} render={(props) => (
        AuthVerify === true
            ? <Component {...props} />
            : <Redirect to='/login' />
    )} />
);


class App extends Component {


    constructor(props) {
        super(props);

        this.state = {
            user: 0
            //0 => Se está esperando por una sesion,
            //Undeinfed =>  no hay sesion
            //Object => hay una sesion

        }
    }


    /**
     *
     *
     * @memberof App
     * @description Obtenemos la información del usuario que tiene un token guardado
     */
    componentDidMount() {
        axios.get('/user/logged', {
            headers: { Authorization: sessionStorage.getItem('token') }
        })
            .then(({ data }) => this.setUser(data.data))
            .catch((error) => {
            })
    }

    setUser = (user) => {
        this.setState({ user })
    };

    render() {
        const { setUser } = this;
        const { user } = this.state;

        return (
            <BrowserRouter>
                <Logged.Provider value={user}>
                    <Layout className="layout">
                        <PrivateRoute path='/register/steps'  >
                            <StepsRoutes setUser={setUser} />
                        </PrivateRoute>
                        <PrivateRoute path='/admin'  >
                            <AdminRoutes setUser={setUser} />
                        </PrivateRoute>
                        <PrivateRoute path='/superadmin'  >
                            <SuperAdminRoutes setUser={setUser} />
                        </PrivateRoute>
                        <PublicRoutes setUser={setUser} />
                    </Layout>
                </Logged.Provider>
            </BrowserRouter>

        );
    }


}

export default (App);

