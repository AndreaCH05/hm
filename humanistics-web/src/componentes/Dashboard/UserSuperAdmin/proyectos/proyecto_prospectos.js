import React, { Component } from "react";
import { Table, Layout, Select, Row, Col, Modal, Form, Input, Button, Avatar } from 'antd';
import { RightOutlined, UserOutlined, LockOutlined, MailOutlined, PhoneOutlined, PlusOutlined, MinusOutlined, BorderOutlined, PaperClipOutlined, SendOutlined } from '@ant-design/icons';

import EstatusCarousel from './Estatus'

const { Header, Content } = Layout;
const { Option } = Select;
const { TextArea } = Input;

const data = [
    {
        id: '{{Numero}}',
        nombre: '{{Nombre}}',
        email: ' {{email}}',
        telefono: '{{telefono}}',
        asesor: '{{asesor}}',
        fecha: '{{fecha}}'


    },
    {
        id: '{{Numero}}',
        nombre: '{{Nombre}}',
        email: ' {{email}}',
        telefono: '{{telefono}}',
        asesor: '{{asesor}}',
        fecha: '{{fecha}}'


    },
    {
        id: '{{Numero}}',
        nombre: '{{Nombre}}',
        email: ' {{email}}',
        telefono: '{{telefono}}',
        asesor: '{{asesor}}',
        fecha: '{{fecha}}'


    },
    {
        id: '{{Numero}}',
        nombre: '{{Nombre}}',
        email: ' {{email}}',
        telefono: '{{telefono}}',
        asesor: '{{asesor}}',
        fecha: '{{fecha}}'


    },
    {
        id: '{{Numero}}',
        nombre: '{{Nombre}}',
        email: ' {{email}}',
        telefono: '{{telefono}}',
        asesor: '{{asesor}}',
        fecha: '{{fecha}}'


    },
    {
        id: '{{Numero}}',
        nombre: '{{Nombre}}',
        email: ' {{email}}',
        telefono: '{{telefono}}',
        asesor: '{{asesor}}',
        fecha: '{{fecha}}'


    },
    {
        id: '{{Numero}}',
        nombre: '{{Nombre}}',
        email: ' {{email}}',
        telefono: '{{telefono}}',
        asesor: '{{asesor}}',
        fecha: '{{fecha}}'


    },
    {
        id: '{{Numero}}',
        nombre: '{{Nombre}}',
        email: ' {{email}}',
        telefono: '{{telefono}}',
        asesor: '{{asesor}}',
        fecha: '{{fecha}}'


    },
    {
        id: '{{Numero}}',
        nombre: '{{Nombre}}',
        email: ' {{email}}',
        telefono: '{{telefono}}',
        asesor: '{{asesor}}',
        fecha: '{{fecha}}'


    },
    {
        id: '{{Numero}}',
        nombre: '{{Nombre}}',
        email: ' {{email}}',
        telefono: '{{telefono}}',
        asesor: '{{asesor}}',
        fecha: '{{fecha}}'


    },



];

class ProyectoProspectos extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false
        }
    }

    onCreate = (values) => {
     
        this.setState({ visible: false });
    };

    onCancel = () => {
        this.setState({ visible: false });
    }

    onOk = () => {
        this.setState({ visible: false });
    };
    ShowModal = () => {
      
        this.setState({ visible: true });
    }

    render() {
        const columns = [
            {
                title: '#',
                dataIndex: 'id',
                key: 'id',

            },
            {
                title: 'Nombre(s)',
                dataIndex: 'nombre',
                key: 'nombre',

            },
            {
                title: 'Email',
                dataIndex: 'email',
                key: 'email',

            },
            {
                title: 'Teléfono',
                dataIndex: 'telefono',
                key: 'telefono',

            },
            {
                title: 'Asesor',
                dataIndex: 'asesor',
                key: 'asesor',

            },
            {
                title: 'Fecha',
                dataIndex: 'fecha',
                key: 'fecha',

            },
            {
                title: 'Acciones',
                key: 'actions',
                render: (text, record) => (
                    <span className="spnAccionesUsu" onClick={this.ShowModal} >
                        <a title="Editar" className="purple-icon"   ><RightOutlined /> </a>
                    </span>
                ),
            },
        ];
        const columnsModal = [
            {
                title: '#',
                dataIndex: 'id',
                render: (text, record) => (
                    <span className="spnAccionesUsu" >
                        <a title="Editar" className="purple-icon" style={{ color: 'transparent' }}> <BorderOutlined /> </a>
                    </span>
                ),

            },
            {
                title: 'Nombre',
                dataIndex: 'nombre',
                key: 'nombre',

            },
            {
                title: 'Fecha Limite',
                dataIndex: 'fecha',
                key: 'fecha',

            },

            {
                title: 'Acciones',
                key: 'actions',
                render: (text, record) => (
                    <span className="spnAccionesUsu" >
                        <a title="Editar" className="purple-icon"   ><RightOutlined /> </a>
                    </span>
                ),
            },
        ];
        return (
            <Layout className="bg-white">
                <Header className="bg-white" style={{ height: 100 }}>
                    <h3 className="up font_color">Estatus</h3>
                    <Row className="status-prospectos " align="middle" >
                        <EstatusCarousel />
                    </Row>
                </Header>

                <Content className="pd-2" style={{ marginTop: "50px" }}>
                    <Row style={{ marginTop: '15px' }}>
                        <Col span={18} >
                            <h3 className="up font_color">Prospectos</h3>
                        </Col>

                        <Col span={4} offset={1} style={{ float: 'right' }} >
                            <Select placeholder="Más recientes" className="input-box" style={{ float: 'right', width: '100%', marginTop: '0px' }} >
                                <Option value="1">Más recientes</Option>
                                <Option value="2">Más antiguos</Option>
                                <Option value="3">A - Z</Option>
                                <Option value="4">Estatus</Option>

                            </Select>

                        </Col>
                    </Row>

                    <div className="divForm">

                        <div className="div-contenedor">

                            <Table columns={columns} dataSource={data} scroll={{ x: 500, y: 300 }} className="blankTheme" />
                        </div>
                    </div>

                </Content>

                <Modal
                    title='Prospecto}}'
                    visible={this.state.visible}
                    onCancel={this.onCancel}
                    onOk={this.onOk}
                    okText="Guardar"
                    className="mdl-prospecto"
                    okButtonProps={{ className: "btn-guardar" }}
                    cancelButtonProps={{ className: "btn-cancel" }}
                >

                    <Row >
                        <Col xs={24} lg={12}>
                            <Col xs={24} sm={24} className="">
                                <Row>
                                    <Form layout={"vertical"} style={{ width: "100%" }}>

                                        <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                                            <Form.Item
                                                name=""
                                                label="Estatus"
                                                rules={[{ required: true, message: 'Por favor selecciona una opción' }]}
                                            >
                                                <Select placeholder="Más recientes" className="input-box" defaultValue={"Nuevo"} style={{ float: 'right', width: '100%', marginTop: '0px' }} >
                                                    <Option value="1">Nuevo</Option>
                                                </Select>
                                            </Form.Item>
                                        </Col>

                                        <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                                            <Form.Item
                                                name=""
                                                label="Descripción"
                                                rules={[{ required: true, message: 'Por favor ingresa tu Descripción' }]}
                                            >
                                                <Input.TextArea className="input-box" placeholder="Descripción" />
                                            </Form.Item>
                                        </Col>

                                        <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                                            <Form.Item label="Información prospecto">
                                                <Row>

                                                    <Col xs={24} sm={24} md={12}>
                                                        <Form.Item
                                                            name="email"
                                                            rules={[{ required: true, message: 'Por favor ingrsa tu  correo' }]}>
                                                            <Input
                                                                prefix={<MailOutlined />}
                                                                placeholder="E-mail"
                                                                className="input-box"
                                                            />
                                                        </Form.Item>
                                                    </Col>

                                                    <Col xs={24} sm={24} md={12}>
                                                        <Form.Item
                                                            name="telefono"
                                                            rules={[{ required: true, message: 'Por favor ingresa tu teléfono' }]}>
                                                            <Input
                                                                prefix={<PhoneOutlined />}
                                                                placeholder="Teléfono"
                                                                className="input-box"
                                                            />
                                                        </Form.Item>
                                                    </Col>
                                                </Row>
                                            </Form.Item>
                                        </Col>
                                    </Form>
                                </Row>

                            </Col>
                            <Col xs={24} sm={24} className="">
                                <Col span={24}>
                                    <Row>
                                        <Col span={24}>
                                            <h2 style={{ width: 'calc(100% - 50px)', float: 'left' }}>Recordatorios</h2>
                                            <Button
                                                type="primary"
                                                htmlType="button"
                                                className="btn btn-plus btn-morado"
                                                onClick={this.ShowModal}>
                                                <PlusOutlined />
                                            </Button>
                                        </Col>
                                        <Col span={24}>
                                            <div className="group-recordatorio">
                                                <Table columns={columnsModal} dataSource={data} scroll={{ y: 100 }} className="blankTheme" />
                                            </div>
                                        </Col>
                                    </Row>

                                </Col>
                            </Col>
                        </Col>

                        <Col xs={24} lg={12} className="col-div-chat pd-1">
                            <h1 className="titulo-chat">Actualizaciones</h1>
                            <div className="div-chat">
                                <div className="div-chat-mensajes">
                                    <div className="row-mensaje">
                                        <Col span={24} className="col-mensaje">
                                            <div className="contenedor-mensaje contenedor-shadow">
                                                timestamp}}
                                                </div>
                                            <div className="contenedor-avatar">
                                                <Avatar shape="square" size="large" icon={<UserOutlined />} />
                                            </div>
                                        </Col>

                                        <Col span={24} className="col-respuesta">
                                            <div className="contenedor-mensaje contenedor-shadow">
                                                timestamp}}
                                                </div>
                                            <div className="contenedor-avatar">
                                                <Avatar shape="square" size="large" icon={<UserOutlined />} />
                                            </div>
                                        </Col>
                                    </div>
                                </div>
                                <Row className="div-chat-acciones">
                                    <div className="chat-clip">
                                        <Button>
                                            <PaperClipOutlined />
                                        </Button>
                                    </div>
                                    <div className="chat-text">
                                        <TextArea rows={4} />
                                    </div>

                                    <div className="chat-send">
                                        <Button>
                                            <SendOutlined />
                                        </Button>
                                    </div>
                                </Row>
                            </div>
                        </Col>
                    </Row>
                </Modal>

            </Layout>
        );
    }
}

export default ProyectoProspectos;
