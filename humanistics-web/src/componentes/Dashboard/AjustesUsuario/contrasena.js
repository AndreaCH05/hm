import React, { Component } from 'react'
import { Row, Col, Form, Input, Button, Switch, Steps, Layout, message } from 'antd';
import { UserOutlined, LockOutlined, PhoneOutlined } from '@ant-design/icons';
import { Link, BrowserRouter } from "react-router-dom";
import { Redirect } from "react-router-dom";

const { Content } = Layout;
const { Step } = Steps;

const axios = require('axios');

class Contrasena extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userId: ''
        }
    }


    componentDidMount() {
        if ((sessionStorage.getItem('token') != null)) {
            axios.get('/usuario/logged', { headers: { Authorization: sessionStorage.getItem('token') } })
                .then((response) => {
                    if (response.status == 200) {
                        var dataUser = response.data.data[0];
                        this.setState({
                            userId: dataUser._id,
                        });
                    }
                })
                .catch((error) => {
                    console.log(error.response);
                })
        }
    }



    /**
  * @memberof EditarUsuario
  * @method handleSubmit
  * @description  Envia los datos del formulario al Servidor
  * @param values (array)
  * Contiene los campos del formulario
  * @returns response (array)
  **/
    handleSubmit = values => {

        axios({
            method: 'PUT',
            url: '/password/update',
            headers: { Authorization: sessionStorage.getItem('token') },
            data: {
                // id: this.state.userId,
                password_confirm: values.confirmPassword,
                password: values.password,
                old_password: values.oldPassword,
            }
        })

            .then((response) => {
                console.log(response);
                if (response.status == 200) {
                    message.success('Información actualizada correctamente.');
                    window.location.reload();
                }
                else {
                    message.error(response.data);
                }
            })
            .catch((error) => {
                console.log(error.response);
                message.error(error.response.data.message);
            })

    }

    render() {
        return (
            <Form name="control-ref" initialValues={{ remember: false }} onFinish={this.handleSubmit} layout={"vertical"} style={{ width: '100%' }}>
                <Row>
                    <Col span={24}>
                        <Form.Item label="Contraseña Actual" name="oldPassword" rules={[{ required: true, message: 'Por favor ingresa tu  contraseña actual' }, { min: 8, message: 'La contraseña actual.' }]}>
                            <Input prefix={<LockOutlined />} type="password" placeholder="Contraseña actual" className="input-box" />
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item label="Contraseña Nueva" name="password" rules={[{ required: true, message: 'Por favor ingresa tu nueva contraseña' }, { min: 8, message: 'La contraseña debe tener minimo 8 caracteres.' }]}>
                            <Input prefix={<LockOutlined />} type="password" placeholder="Contraseña nueva" className="input-box" />

                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item name="confirmPassword" label="Confirm Password" dependencies={['password']}

                            hasFeedback
                            rules={[
                                {
                                    required: true,
                                    message: 'Por favor comprueba tu contraseña!',
                                },
                                {
                                    min: 8,
                                    message: 'La contraseña debe tener minimo 8 caracteres.'
                                },
                                ({ getFieldValue }) => ({
                                    validator(rule, value) {
                                        if (!value || getFieldValue('password') === value) {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject('Las contraseñas no coinciden!');
                                    },
                                }),
                            ]}
                        >
                            <Input.Password placeholder="Confirmar contraseña" prefix={<LockOutlined />} className="input-box" />
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item>
                            <Button type="primary" htmlType="submit" className="btn btn-primary m-1" >Cambiar contraseña</Button>
                        </Form.Item>
                    </Col>
                </Row>
            </Form>

        )
    }
}


export default Contrasena;