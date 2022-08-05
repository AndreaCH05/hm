import React, { Component } from 'react'
import { Alert, Row, Col, Form, Input, Button, Steps, Layout, message } from 'antd';
import { UserOutlined, MailOutlined } from '@ant-design/icons';



const axios = require('axios');

class Nombre extends Component {
    formRef = React.createRef();
    constructor(props) {
        super(props);
        this.state = {


        }
    }

    componentDidMount() {

        var token = sessionStorage.getItem('token')

        if ((token != null)) {
            axios.get('/user/logged', { headers: { Authorization: token } })
                .then((response) => {
                    var data = response.data.data;
                    this.setState({ userId: data._id })
                    this.formRef.current.setFieldsValue({
                        nombre: data.nombre,
                        email: data.email,
                        telefono: data.telefono
                    });

                })
                .catch((error) => {
                    console.log(error.response);
                    message.error('Ha ocurrido un problema.');
                })
        }
    }

    /**
     * @memberof EditarUsuario
     *
     * @method handleSubmit
     * @description  Envia los datos del formulario al Servidor
     *
     * @param values (array)
     * Contiene los campos del formulario
     *
     * @returns response (array)
     **/
    handleSubmit = values => {
        axios.put('/usuarios/update', {
            id: this.state.userId,
            nombre: values.nombre,
            email: values.email,
            telefono: values.telefono
        },
            { headers: { Authorization: sessionStorage.getItem('token') } }
        )
            .then((response) => {
                console.log(response);
                if (response.status == 200) {
                    message.success('Información actualizada correctamente.');
                }
                else {
                    message.error(response.data);

                }
            })
            .catch((error) => {
                console.log(error.response);
                message.error('Ha ocurrido un problema.');
            })
    }



    render() {

        return (
            <Form ref={this.formRef} initialValues={{ remember: true }} onFinish={this.handleSubmit} layout={"vertical"} className=" center" >
                <Row align="center">
                    <Col span={24}>
                        <Form.Item name="nombre" label="Nombre" rules={[{ required: true, message: 'Por favor ingresa tu nombre' }]}>
                            <Input prefix={<UserOutlined />} placeholder="Nombre completo" className="input-box" />
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item name="email" label="Email" rules={[{ required: true, message: 'Por favor ingresa tu correo' }]}>
                            <Input prefix={<MailOutlined />} placeholder="Email" className="input-box" />
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item name="telefono" label="Telefono" rules={[{ required: true, message: 'Por favor ingresa tu telefono' }]}>
                            <Input prefix={<MailOutlined />} placeholder="Telefono" className="input-box" />
                        </Form.Item>
                    </Col>
                    <Col span={24}>
                        <Form.Item>
                            <Button type="primary" htmlType="submit" className="btn btn-primary m-1" style={{ minWidth: '200px' }} >Guardar </Button>
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        )
    }
}


export default Nombre;