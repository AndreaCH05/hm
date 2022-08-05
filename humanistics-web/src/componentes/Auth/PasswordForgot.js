import React, { Component } from "react"
import { Layout, Input, Row, Col, Modal, Button, Form } from 'antd';
import { Redirect } from "react-router-dom";
const { Content } = Layout;
const axios = require('axios').default;
class PasswordForgot extends Component {

    constructor(props) {
        super(props)
        this.state = {
            return: false
        }
    }


    /**
 * @memberof PasswordForgot
 *
 * @method handleSubmit
 * @description  Envia los datos del formulario al Servidor
 *
 * @param values (array)
 * Contiene los campos del formulario para registrar al producto
 *
 * @returns response (array)
 **/
    handleSubmit = value => {
   
        axios.put("/password/recovery", { email: value.email })
            .then(res => {
 
                this.props.onCancel()
                Modal.success({
                    title: 'Correo',
                    content: 'El correo ha sido enviado. Revisa tu bandeja de entrada!',
                    // onOk: e => 
                });
            })
            .catch(res => {
         
                Modal.warning({
                    title: 'Error',
                    content: <div>
                        El correo no se ha podido enviar.<br/>Verifica que sea el mismo con el que te registraste.
                    </div>
                });
            });
    }

    formRef = React.createRef()

    render() {
        return (
            <div>
                <img src="/images/pass-forgot.png" className="img-center" alt="Password Forgot" />
                <Form ref={this.formRef} onFinish={this.handleSubmit} Layout={"vertical"} style={{ paddingTop: '1em', paddingLeft: '2em',paddingRight: '2em', }}>
                    <Form.Item name="email" rules={[{ required: true, message: 'Por favor ingresa nombre de producto' }]}>
                        <Input type="email" className="input-box" placeholder="Escribe tu correo electronico"></Input>
                    </Form.Item>
                </Form>
            </div>


        )
    }
}

export default function (props) {

    const passwordFormRef = React.createRef()



    return <Modal
        {...props}
        title="Restauración de Contraseña"

        okText="Recuperar"
        onOk={() => passwordFormRef.current.formRef.current.submit()}
        okButtonProps={{
            style: {
                background: '#F800FF',
                border: '2px solid rgba(255, 255, 255, 0.3)',
                boxShadow: 'rgb(95 157 231 / 48%) 4px 2px 9px, rgb(255 255 255) -4px -2px 9px',
                borderRadius: '5px',
                fontStyle: 'normal',
                fontWeight: '500',
                fontSize: '16px',
                lineHeight: '19px',
                textAlign: 'center',
                letterSpacing: '0.2px',
                color: '#FFFFFF'
            }
        }}


        cancelButtonProps={{
            style: {
                border: '2px solid white',
                boxShadow: 'rgb(95 157 231 / 48%) 4px 2px 9px, rgb(255 255 255) -4px -2px 9px',
                borderRadius: '5px',
                fontStyle: 'normal',
                fontWeight: '500',
                fontSize: '16px',
                lineHeight: '19px',
                textAlign: 'center',
                letterSpacing: '0.2px',
            }
        }}
    >
        <PasswordForgot  {...props} ref={passwordFormRef} />
    </Modal>
}
