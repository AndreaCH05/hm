import React, { Component } from "react";
import { Select, Row, Col, Modal, message, Spin, PageHeader, Tag, Form, Input, Button, DatePicker, Popconfirm } from 'antd';



import 'react-multi-carousel/lib/styles.css';
import '../../../../css/modals.css'

const moment = require('moment');

const axios = require('axios').default;
const { Option } = Select;
const { TextArea } = Input;

export default class modalUser extends Component {

    UserForm = React.createRef();
    constructor(props) {
        super(props);
        this.state = {
            roles: [],
            nombreVista: "Usuario",
            loading:false
        };
    }




    componentDidMount() {
        axios.defaults.headers.common['Authorization'] = sessionStorage.getItem('token');
        this.GetRoles()
    }


    /** 
     * @method componentDidUpdate
     *
    */
    componentDidUpdate = (prevProps) => {
        if(this.props.usuario_id !== undefined && this.props.usuario_id !== prevProps.usuario_id){
            this.loadUser(this.props.usuario_id)
        }
    }


    /** 
     * @method GetRoles
     * @description Obtiene los roles de los usuarios
    */
    GetRoles = () => {
        axios.get("/roles",{})
        .then(res => {
            this.setState({ roles: res.data.data });
        })
        .catch(error => {
            message.error("No se han podido cargar los roles");
        })
    }

     /**
     * @memberof Usuarios
     * @description Obtiene la info del usuario
     *
     */
    loadUser = (user_id) => {
        this.setState({loading: true})
        axios.post('/usuarios/id',{ 
            id: user_id 
        }).then((response) => {
            this.setState({ usuario: response.data.data});
            this.UserForm.current.setFieldsValue({
                nombre: response.data.data.nombre,
                email: response.data.data.email,
                rol: response.data.data.rol_id
            })

        })
        .catch((error) => {
            console.log("error", error);
            if (error.status >= 300) {
                Modal.info({
                    title: error.response.status,
                    content: error.response.data
                })
            }
        }).finally(()=>{this.setState({loading: false})})
    }



    /** 
     * @method onFinish
     * @description Se ejecuta al dar aceptar en el formulario
    */
    onFinish = async (values) => {
        if(this.props.usuario_id !== undefined){
            this.updateUser(values)
        }else{
            this.addUser(values)
        }
    }

    /** 
     * @method addUser
     * @description Añade un usuario
    */
    addUser = (values) => {
        axios.post("/usuarios/crear", {
            nombre: values.nombre,
            email: values.email,
            rol_id: values.rol,
            proyectos_id: this.props.proyecto_id,
            status: 1,
            parent_user: true
        },
            { headers: { Authorization: sessionStorage.getItem('token') } })
            .then(res => {
                message.success("Registro almacenado correctamente.");
                this.setState({ loading: false, })
                this.props.onCancel();
            })
            .catch(error => {
                console.log(error);
                message.error("No se ha podido crear registro, verifique que el email ingresado sea valido y no este registrado.");
            })

    }


    /** 
     * @method addUser
     * @description Actualiza la info de un usuario
    */
    updateUser = (values) => {
        axios.put('/usuarios/update', {
            id: this.props.usuario_id,
            nombre: values.nombre,
            email: values.email,
            rol_id: values.rol,
        }).then(res => {
            message.success("Usuario actualizado correctamente.");
            this.setState({ loading: false, })
            this.props.onCancel();
        })
        .catch(error => {
            console.log(error);
            message.error("No se Actualizo el usuario.");
        })

    }






    modalOkButon = () => this.UserForm.current.submit();


    render() {
        let data = [];
        return (
            <Modal
                visible={this.props.visible}
                closable={false}
                title={null}
                onOk={this.modalOkButon}
                okText="Guardar"
                okButtonProps={{ className: 'btn-continue' }}
                cancelText="Cancelar"
                onCancel={this.props.onCancel}
                cancelButtonProps={{ className: 'nView' }}
                className="mdl-crearUsuario box-table mdl-NuevoMiembro"
                destroyOnClose={true}
            >
                <Row>
                    <Form
                        layout={"vertical"}
                        style={{ width: "100%" }}
                        ref={this.UserForm}
                        name='main-info'
                        onFinish={e => {
                            this.onFinish(e);
                        }}
                    >
                        <Row>
                            <Col span={24} className="center">
                                <p className="modal-title">{this.props.nombreVista}</p>
                            </Col>
                        </Row>

                        <Spin spinning={this.state.loading}>

                            <Row className="mt-10">
                                <Col span={24}>
                                    <h4 className="lbl-title">Nombre<span className="cmp-required">*</span> </h4>
                                    <Form.Item label="" name="nombre" rules={[{
                                        required: true,
                                        message: 'Por favor escribe un nombre'
                                    }]}>
                                        <Input type="text" className="input-box" placeholder="Nombre"></Input>
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row className="mt-10">
                                <Col span={24}>
                                    <h4 className="lbl-title">Email<span className="cmp-required">*</span> </h4>
                                    <Form.Item label="" name="email" rules={[{
                                        required: true,
                                        message: 'Por favor escribe un email'
                                    }]}>
                                        <Input type="email" className="input-box" placeholder="Email"></Input>
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row className="mt-10">
                                <Col span={24}>
                                    <h4 className="lbl-title">Tipo de Usuario<span className="cmp-required">*</span> </h4>
                                    <Form.Item label="" name="rol" rules={[{
                                        required: true,
                                        message: 'Por favor selecciona un perfil'
                                    }]}>
                                        <Select placeholder="Seleccionar opción" className="input-box">
                                            <Option value="0" disabled>Seleccionar...</Option>
                                            {this.state.roles.map(function (rol, index) {
                                                return <Option value={rol._id}>{rol.nombre}</Option>
                                            })
                                            }
                                        </Select>
                                    </Form.Item>
                                </Col>
                            </Row>


                        </Spin>
                    </Form>
                </Row>
            </Modal>
        );
    }
};


