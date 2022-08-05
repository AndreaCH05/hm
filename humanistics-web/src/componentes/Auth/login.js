import React, { Component } from 'react'
import { Row, Col, Form, Input, Button, Modal, Spin, Divider, Typography, Image } from 'antd';
import { Redirect, Link } from "react-router-dom";


import PasswordForgot from "./PasswordForgot";

import FacebookLogin from "../Widgets/FacebookLogin/FacebookLogin";


import '../../css/auth.css';


const axios = require("axios").default;
const { FB } = window;
const { Text } = Typography

const IconMail = () => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M15.4688 5.15625C15.8125 5.46875 16 5.84375 16 6.3125V14.5C16 14.9375 15.8438 15.2812 15.5625 15.5625C15.25 15.875 14.9062 16 14.5 16H1.5C1.0625 16 0.71875 15.875 0.4375 15.5625C0.125 15.2812 0 14.9375 0 14.5V6.28125C0 5.84375 0.1875 5.4375 0.5625 5.125C1.375 4.4375 2.78125 3.3125 4.78125 1.75L5.09375 1.46875C5.625 1.03125 6.0625 0.71875 6.375 0.5C6.9375 0.1875 7.5 0 8 0C8.5 0 9.03125 0.1875 9.625 0.5C9.9375 0.71875 10.375 1.03125 10.9062 1.46875L11.2188 1.75C13.2812 3.40625 14.7188 4.53125 15.4688 5.15625ZM14.5 14.3125V6.375C14.5 6.34375 14.4688 6.3125 14.4375 6.25C12.75 4.875 11.3438 3.78125 10.2812 2.90625L9.96875 2.65625C9.53125 2.3125 9.21875 2.0625 9 1.90625C8.59375 1.65625 8.25 1.5 8 1.5C7.71875 1.5 7.375 1.65625 7 1.90625C6.75 2.0625 6.4375 2.3125 6.03125 2.65625L1.5625 6.25C1.5 6.28125 1.5 6.3125 1.5 6.375V14.3125C1.5 14.375 1.5 14.4062 1.5625 14.4375C1.59375 14.5 1.625 14.5 1.6875 14.5H14.3125C14.3438 14.5 14.375 14.5 14.4375 14.4375C14.4688 14.4062 14.5 14.375 14.5 14.3125ZM13.5 8.4375L13.0312 7.875C12.9688 7.8125 12.875 7.75 12.7812 7.75C12.6562 7.75 12.5625 7.75 12.5 7.8125L9.96875 9.84375C9.53125 10.2188 9.21875 10.4688 9 10.5938C8.59375 10.875 8.25 11 8 11C7.71875 11 7.375 10.875 7 10.5938C6.75 10.4688 6.4375 10.2188 6.03125 9.84375L3.5 7.8125C3.40625 7.75 3.3125 7.75 3.21875 7.75C3.09375 7.75 3.03125 7.8125 2.96875 7.875L2.5 8.4375C2.4375 8.53125 2.40625 8.625 2.40625 8.71875C2.40625 8.84375 2.46875 8.90625 2.5625 8.96875L5.09375 11.0312C5.59375 11.4688 6.03125 11.8125 6.375 12C6.9375 12.3438 7.5 12.5 8 12.5C8.5 12.5 9.03125 12.3438 9.625 12C9.9375 11.8125 10.3438 11.4688 10.9062 11.0312L13.4375 8.96875C13.5 8.90625 13.5625 8.84375 13.5625 8.71875C13.5625 8.625 13.5625 8.53125 13.5 8.4375Z" fill="#A1C1EB" />
    </svg>
)

const IconPassword = () => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M10 1.5C9.1875 1.5 8.4375 1.71875 7.75 2.125C7.0625 2.53125 6.5 3.0625 6.09375 3.75C5.6875 4.4375 5.5 5.1875 5.5 6C5.5 6.4375 5.5625 6.875 5.6875 7.3125L1.5 11.5V14.5H4.5V13H6V11.5H7L8.3125 10.1875C8.84375 10.4062 9.40625 10.5 10 10.5C10.8125 10.5 11.5625 10.3125 12.25 9.90625C12.9375 9.5 13.4688 8.9375 13.875 8.25C14.2812 7.5625 14.5 6.8125 14.5 6C14.5 5.1875 14.2812 4.4375 13.875 3.75C13.4688 3.0625 12.9375 2.53125 12.25 2.125C11.5625 1.71875 10.8125 1.5 10 1.5ZM10 0C11.0625 0 12.0625 0.28125 13 0.8125C13.9062 1.375 14.625 2.09375 15.1875 3C15.7188 3.9375 16 4.9375 16 6C16 7.09375 15.7188 8.09375 15.1875 9C14.625 9.9375 13.9062 10.6562 13 11.1875C12.0625 11.75 11.0625 12 10 12C9.5625 12 9.15625 11.9688 8.75 11.875L7.5 13.125V13.75C7.5 13.9688 7.40625 14.1562 7.28125 14.2812C7.125 14.4375 6.9375 14.5 6.75 14.5H6V15.25C6 15.4688 5.90625 15.6562 5.78125 15.7812C5.625 15.9375 5.4375 16 5.25 16H0.75C0.53125 16 0.34375 15.9375 0.21875 15.7812C0.0625 15.6562 0 15.4688 0 15.25V11.1875C0 11 0.0625 10.8125 0.21875 10.6562L4.0625 6.8125C4 6.5625 4 6.28125 4 6C4 4.9375 4.25 3.9375 4.8125 3C5.34375 2.09375 6.0625 1.375 7 0.8125C7.90625 0.28125 8.90625 0 10 0ZM10 4.5C10 4.09375 10.125 3.75 10.4375 3.4375C10.7188 3.15625 11.0625 3 11.5 3C11.9062 3 12.25 3.15625 12.5625 3.4375C12.8438 3.75 13 4.09375 13 4.5C13 4.9375 12.8438 5.28125 12.5625 5.5625C12.25 5.875 11.9062 6 11.5 6C11.0625 6 10.7188 5.875 10.4375 5.5625C10.125 5.28125 10 4.9375 10 4.5Z" fill="#A1C1EB" />
    </svg>

)

/**
 *
 *
 * @class Login
 * @extends {Component}
 */
class Login extends Component {

    script = React.createRef();

    redirectLink = "/admin/dashboard";

    constructor(props) {
        super(props);
        this.state = {
            log: false,
            loading: false,

            statusLoading: 0
        }
    }

    componentDidMount() {
        //FB.getLoginStatus(this.setLoginStatus);
    }


 
    /**
     * @memberof Login
     *
     * @method handleSubmit
     * @description  Envia los datos del formulario al Servidor
     *
     * @param values (array)
     * Contiene los campos del formulario para registrar al usuario
     *
     * @returns response (array)
     **/
    handleSubmit = (values) => {
        this.setState({ loading: true })
        axios.post('/login', {
            email: values.email,
            password: values.password
        })
            .then((response) => {
                const { setUser } = this.props;

                axios.defaults.headers.post["Authorization"] = response.headers.authorization;

                sessionStorage.setItem('token', axios.defaults.headers.post["Authorization"]);
                sessionStorage.setItem('rol', (response.data.rol.nombre));
                sessionStorage.setItem('userId', (response.data.user._id));



                if (response.data.status !== 1) this.redirectTo('/register/steps');
                else this.setState({ log: true });
            })
            .catch((error) => {
                Modal.warning({
                    title: 'Error',
                    content: error.response?.data.message
                });
            })
            .finally(f => {
                this.setState({ loading: false });
            })
    };


    /**
     * @memberof Login
     *
     * @method renderRedirect
     * @description  Activa el redireccionamiento si el formulario se envio con exito
     *
     **/
    renderRedirect = () => {
        if (this.state.log)
            if (sessionStorage.getItem('rol') === 'Administrador') {
                return <Redirect to="/superadmin/dashboard" />
            } else {
                return <Redirect to={this.redirectLink} />
            }
    };


    /**
     * @memberof Login
     *
     * @method redirectTo
     * @description  Redirecciona a cierto link.
     *
     **/
    redirectTo = (to) => {
        this.redirectLink = to;
        this.setState({ log: true });
    };

    
    /**
       *
       *
       * @memberof Login
       * 
       * @description Inicia sesión el sistema con facebook.
       */
    loginFacebook = () => {
 
        let element = this;
        FB.login(response => this.setLoginStatus(response, true), { scope: 'public_profile,email' });
    };


       /**
     *
     *
     * @param {*} response Es la respuesta que nos trae el SDK de facebook.
     * @param {boolean} [redirect=false] En caos de que se quiera redirijir a los steps  
     * 
     * @memberof Login
     * 
     * @description Iniciamos sesión en facebook con base al login o al checker. 
     */
        setLoginStatus = (response, redirect = false) => {        
 
            this.setState({ statusLoading: 2 })
            const element = this;
            FB.api('/me', 'GET', { "fields": "email,first_name,middle_name,last_name" },
                (me) => {
                    switch (response.status) {
                        case 'connected':
                            FB.api('/' + response.authResponse.userID + '/picture', 'GET', { "redirect": "false", height: 400 },
                                (image) => {
                                    axios.post('/facebook', {
                                        ...me,
                                        image: image?.data?.url,
                                        response: response.authResponse
                                    })
                                        .then(response => {
                                            axios.defaults.headers.post["Authorization"] = response.headers.authorization;
                                            sessionStorage.setItem('token', axios.defaults.headers.post["Authorization"]);
                                            sessionStorage.setItem('rol', response.data.rol.nombre);
    
                                            if (redirect == true) {
                                                switch (response.data.option) {
                                                    case 1:
                                                        element.redirectTo('/register/steps')
    
                                                        break;
                                                    case 2:
                                                        element.redirectTo('/admin/dashboard')
                                                        break;
                                                }
                                            }
    
                                            this.setState({ statusLoading: 1 })
                                        })
                                        .catch(error => {
                                            this.setState({ statusLoading: 0 })
                                        })
                                }
                            );
                            break;
                        default:
                            this.setState({ statusLoading: 0 })
                            break;
                    }
                }
            );
            this.setState({ facebookLoading: false })
        }
    
    

    render() {


        const { statusLoading } = this.state;
        return (

            <div className="login bg-white" >
                {this.renderRedirect()}
                <Row style={{ height: 'inherit' }}>
                    <Col xs={{ span: 22, order: 2 }} sm={{ span: 21, order: 2 }} md={{ span: 20, order: 2 }} lg={{ span: 13, order: 1 }} xl={{ span: 13, order: 1 }} xxl={{ span: 13, order: 1 }}  >
                        <div className="bg-lightblue pd-1" style={{ borderRadius: 10, margin: '2rem', height: 'calc(100vh - 4rem)' }}>
                            <Image src={'images/logo-h.png'} wrapperClassName="center" style={{ width: '70%' }} preview={false} />
                            <div className="center pd-2 ">
                                <img src={"images/img1.png"} alt="logo" ></img>
                            </div>
                        </div>
                    </Col>
                    <Col xs={{ span: 22, order: 1 }} sm={{ span: 21, order: 1 }} md={{ span: 20, order: 1 }} lg={{ span: 11, order: 2 }} xl={{ span: 11, order: 2 }} xxl={{ span: 11, order: 2 }} >
                        <Spin spinning={this.state.loading}>
                            <Row justify="center">
                                <Col span={24} className="login-form">
                                    <Row justify="center">
                                        <Col xs={{ span: 24, offset: 0 }} sm={{ span: 21, offset: 0 }} md={{ span: 20, offset: 0 }} lg={{ span: 11, offset: 0 }} xl={{ span: 12, offset: 0 }} xxl={{ span: 12, offset: 0 }} className="mt-10">
                                            <h3 className="login-form-title">Iniciar Sesión</h3>
                                            <Form onFinish={this.handleSubmit} layout={"vertical"}>
                                                <Form.Item name="email" label="Email" rules={[{ required: true, message: 'Por favor ingresa tu  correo' }]}>
                                                    <Input prefix={<IconMail />} placeholder="E-mail" className="input-box" />
                                                </Form.Item>
                                                <Form.Item label="Contraseña" name="password" rules={[{ required: true, message: 'Por favor ingresa tu  contraseña' }]}>
                                                    <Input prefix={<IconPassword />} type="password" placeholder="Contraseña" className="input-box" />
                                                </Form.Item>
                                                <Link className="login-form-link" onClick={() => this.setState({ modalVisible: true })}> Olvide mi contraseña </Link>
                                                <br />
                                                <Link className="login-form-link" to="/register"> Registrarse </Link>
                                                <Form.Item>
                                                    <Button type="primary" htmlType="submit" className="btn btn-primary mt-10" style={{ fontWeight: "600" }} block >Iniciar sesión </Button>
                                                </Form.Item>
                                                <Divider />
                                            </Form>


                                            <FacebookLogin onClick={this.loginFacebook} status={statusLoading} />
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                        </Spin>
                    </Col>
                </Row >
                <PasswordForgot
                    visible={this.state.modalVisible}
                    onCancel={() => this.setState({ modalVisible: false })}
                />
            </div >
        )
    }
}




export default Login;
