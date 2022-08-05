import React, { Component } from "react";
import { Table, Modal, Row, Col, List, Button, Card, Select, Input, Spin, message, Typography } from 'antd';
import {
    FormOutlined,
    ExclamationCircleOutlined,
    LeftOutlined,
    PlusOutlined,
    MinusOutlined,
    RightOutlined
} from '@ant-design/icons';
import { getConfirmLocale } from "antd/lib/modal/locale";

import ModalUsuario from './modalUsuario'

import { Redirect, Link } from "react-router-dom";

import { IconPlusPurple, IconMinusPurple } from '../../../Widgets/Iconos';

import '../../../../css/Steps/Usuarios.css'

const axios = require("axios").default;

const { confirm } = Modal;
const { Option } = Select;
const { Title, Paragraph, Text, } = Typography;


export default class Usuarios extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modalUsuarios: false,
            redirect: false,
            modalShowToggle: false,
            usuarios:[],
            nombreVista: 'Nuevo Miembro',
        }
    }


    /**
     *
     *
     * @memberof Usuarios
     */
    componentDidMount() {
        axios.defaults.headers.common['Authorization'] = sessionStorage.getItem('token');
    }



    /**
    * @memberof Usuarios
    *
    * @method componentDidUpdate
    * @description Se actualiza info de proyecto desde propiedad dataProject
    */
    componentDidUpdate = (prevProps) => {
        const pid = this.props;
        if(this.props.dataProject !== undefined && this.props.selected === 7 && prevProps.selected !== 7){
            this.receivedData()
        }
    }


    /**
     * @memberof Usuarios
     * @description Trae los usuarios que estan asociados al proyecto excepto el que hace la peticion
     *
     */
    receivedData = page => {
        axios.post('/projects/id/users',{
            id: this.props.dataProject._id
        }).then(response => {
            this.setState({
                usuarios: response.data.data,
                loading: false
            })
        }).catch(error => {
            console.log(error)
        })
    }


    /**
     * @memberof Usuarios
     * @description Elimina un usuario
     *
     */
    showDeleteConfirm = (empleado) => {
        const item_name = empleado.nombre;
        const item_id = empleado._id;

        confirm({
            title: 'Eliminar registro',
            icon: <ExclamationCircleOutlined />,
            content: '¿Estas seguro que deseas eliminar a ' + item_name + ' ?',
            okText: 'Continuar',
            okType: 'danger',
            cancelText: 'Cancelar',
            onOk() {
                axios({
                    method: 'delete',
                    url: '/usuarios/delete',
                    headers: { Authorization: sessionStorage.getItem('token') },
                    data: { id: item_id, status: 0 }
                })
                .then((response) => {
                    message.success("Registro eliminado correctamente.");
                    this.receivedData()
                })
                .catch((error) => {
                    console.log("error al borrar el usuario", error.response);
                    if (error.response.status >= 300) {
                        message.error(error.response?.data?.message);
                    }else
                        message.error("Registro No se elimino.");
                })
            },

        });
    }



    /**
     *
     *
     * @memberof Usuarios
     */

    finish() {
        this.setState({ redirect: true });
    }

    renderRedirect = () => {
        if (this.state.redirect) {
            return <Redirect to="/admin/dashboard" />
        }
    }


    render() {

        let pr_logo = this.props.dataProject.logo;

        return (
            <div>
                {this.renderRedirect()}
                <Row className="">
                    <Col xs={24} className="center pd-2">
                        <div className="contenedor-logo">
                            {(this.state.pr_logo != '') ?
                                <img src={axios.defaults.baseURL + 'upload/' + pr_logo}
                                    alt="avatar" style={{
                                        width: 'auto',
                                        height: '100%',
                                        borderRadius: '10px'
                                    }} id="logo-empresa" /> :
                                <h2 className="up center">LOGO EMPRESA</h2>
                            }
                        </div>

                    </Col>
                    <Col xs={24} sm={24} md={24} lg={24} xl={24} className="center">
                        <Paragraph className="parragraph step-subtitle">
                            Aqui puedes incluir asesores, socios o personas que te van a ayudar a llevar el seguimiento de tus prospectos y proceso de venta.
                    </Paragraph>
                    </Col>

                </Row>

                <Row span={24}>
                    <Col span={23} style={{ margin: "auto", marginTop: "1rem" }} className="">
                        <Spin tip="Cargando..." spinning={this.state.loading}>
                            <Row float="right">
                                <Col span={24}>
                                    <Button type="primary" htmlType="button" className="text-white btn btn-gral-morado nView"
                                        style={{
                                            float: "right",
                                            width: '45px'
                                        }}
                                        onClick={this.receivedData}
                                        id="btnReloadTable"> </Button>

                                    <Button type="primary"
                                        htmlType="button"
                                        className="text-white  btn-IconPlusPurple"
                                        style={{ float: "right" }}
                                        onClick={()=>{this.setState({modalUsuarios: true, nombreVista: 'Nuevo Miembro'})}}>
                                        <IconPlusPurple />
                                    </Button>
                                </Col>
                            </Row>


                            <Row>
                                <List
                                    itemLayout="horizontal"
                                    dataSource={this.state.usuarios}
                                    className="list-employees"
                                    locale={"Sin Usuarios"}
                                    header={
                                        <Row style={{ width: '100%' }}>
                                            <Col span={6} className="center">
                                                <Text className="txt-Titulo">Nombre</Text>
                                            </Col>

                                            <Col span={7} className="center">
                                                <Text className="txt-Titulo">Email</Text>
                                            </Col>

                                            <Col span={5} className="center">
                                                <Text className="txt-Titulo">Tipo</Text>
                                            </Col>

                                            <Col span={3} className="center">
                                                <Text className="txt-Titulo">Editar</Text>
                                            </Col>
                                            <Col span={3} className="center">
                                                <Text className="txt-Titulo">Eliminar</Text>
                                            </Col>
                                        </Row>

                                    }
                                    renderItem={(empleado, index) => (
                                        <List.Item className="component-list-item">
                                                <Card className="card-list">
                                                    <Row style={{ width: '100%' }}>
                                                        <Col span={6} className="center">
                                                            <Text strong>{empleado.nombre}</Text>
                                                        </Col>
                                                        <Col span={7} className="center">

                                                            <Text strong>{empleado.email}</Text>
                                                        </Col>
                                                        <Col span={5} className="center">
                                                            <Text >{empleado?.rol_id.nombre}</Text>
                                                        </Col>
                                                        <Col span={3} className="center">
                                                            <Button type="primary"
                                                                htmlType="button"
                                                                className="text-white  btn-IconMinusPurple"
                                                                onClick={()=>this.setState({modalUsuarios: true, usuario_id: empleado._id, nombreVista: 'Editar Miembro'})}
                                                            >
                                                                <IconMinusPurple title="Editar" className="IconMinusPurple" />
                                                            </Button>
                                                        </Col>
                                                        <Col span={3} className="center">
                                                            <span className="actions-col">
                                                                <Button type="primary"
                                                                    htmlType="button"
                                                                    className="text-white  btn-IconMinusPurple"
                                                                    onClick={()=>this.showDeleteConfirm(empleado)}
                                                                >
                                                                    <IconMinusPurple title="Eliminar" className="IconMinusPurple" />
                                                                </Button>
                                                            </span>
                                                        </Col>
                                                    </Row>
                                                </Card>

                                            
                                        </List.Item>)}
                                />
                            </Row>
                        </Spin>
                    </Col>
                </Row>
                <Row className="mt-10" align="center">
                    <Button type="primary" htmlType="submit" 
                    className="btn-continue"
                    style={{ marginTop: "15px" }} 
                    onClick={() => this.finish()}>Termine</Button>
                </Row>

                <Row className="mt-10" style={{ padding: "15px" }} >
                    <Button type="primary" className="btn btn-gral-morado nView" onClick={this.props.back}><LeftOutlined />Atras</Button>
                </Row>




                <ModalUsuario
                    visible={this.state.modalUsuarios}
                    proyecto_id={this.props.dataProject._id}
                    footer={false}
                    nombreVista={this.state.nombreVista}
                    usuario_id={this.state.usuario_id}
                    onCancel={() => { 
                        this.setState({modalUsuarios: false, usuario_id: undefined})
                        this.receivedData()
                    }}
                />


            </div>
        )
    }


}

