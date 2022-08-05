import React, { Component } from "react";
import { Table, Layout, Select, Row, Col, Modal, Form, Input, Button, Avatar, Tabs, Card, List, PageHeader, message, Spin, Pagination, Typography } from 'antd';
import {
    RightOutlined, UserOutlined, MailOutlined, PhoneOutlined, PlusOutlined, BorderOutlined, PaperClipOutlined, SendOutlined, AppstoreOutlined, DownloadOutlined,

} from '@ant-design/icons';

import { FaListUl } from "react-icons/fa";

import './../../../../css/proyectos.css'


const { Content } = Layout;
const { Option } = Select;
const { TextArea } = Input;

const { Title, Text } = Typography;

const { TabPane } = Tabs;

const axios = require("axios").default;
const moment = require('moment');


const data = [
];


class S_Proyectos extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            cargando: false,
            tipoVista: "list"
        }
    }

    onChangeTypeView() {
        if (!this.state.cargando) {
            var tipo = this.state.tipoVista;

            if (tipo == "cards") {
                this.setState({
                    tipoVista: "list",
                    cargando: true
                });
            }
            else {
                this.setState({
                    tipoVista: "cards",
                    cargando: true
                });
            }

            setTimeout(async () => {
                this.setState({
                    cargando: false,
                });
            }, 1500);
        }
        else {
            message.warning("Espere un momento.")
        }
    }

    render() {

        return (<Layout className="bg-white layout-proyectos">
            <Content className="cnt-proyectos">
                <PageHeader
                    title="PROYECTOS"
                    className="title custom btns-proyectos"
                    extra={[
                        <div style={{ height: "55px", display: "flex", paddingTop: "3px", }}>

                            <Button
                                htmlType="button"
                                className="purple-icon "
                                key="1"
                                style={{ width: "38px", height: "37px", margin: "5px" }}
                                title={(this.state.tipoVista != "list") ? "Ver como lista" : "Ver como cards"}
                                onClick={() => this.onChangeTypeView()}
                            >

                                {(this.state.tipoVista != "list") ?
                                    <FaListUl style={{ marginTop: "6px" }} />
                                    :
                                    <AppstoreOutlined style={{ margin: "0px" }}
                                    />}
                            </Button>

                            <Button
                                htmlType="button"
                                className="purple-icon "
                                key="2"
                                style={{ width: "38px", height: "37px", margin: "5px" }}
                                title="" ><DownloadOutlined />
                            </Button>
                        </div>
                    ]}
                />

                <Spin spinning={this.state.cargando} >

                    <Row style={{ maxHeight: "88vh", overflow: "auto" }}>
                        {this.state.tipoVista == "list" ? <S_ProyectosList /> : <S_ProyectosCards />}
                    </Row>
                </Spin>
            </Content>
        </Layout>
        );
    }
}


class S_ProyectosList extends Component {

    constructor(props) {
        super(props)
        this.state = {
            visible: false,
            loading: true,
            dataProyectos: [],

            /* Paginado */
            itemCount: 0,
            pageCount: 1,
            currentPage: 1,
            page: 1,
            limit: 10,
            sort: { field: "createdAt", order: "descend" },
            filter: '',
            search: '',
            filtro_estatus: ""

        }
    }

    componentDidMount() {
        this.getProyectos();
        this.setState({ loading: false });
    }

    onCreate = (values) => {
        //  console.log('Received values of form: ', values);
        this.setState({ visible: false });
    };

    onCancel = () => {
        this.setState({ visible: false });
    }

    onOk = () => {
        this.setState({ visible: false });
    };

    ShowModal = () => {
        //  console.log("mostrando modal");
        this.setState({ visible: true });
    }

    getProyectos = async (
        page = this.state.currentPage,
        limit = this.state.limit,
        sort = this.state.sort,
        search = this.state.search,
    ) => {


        axios({
            method: 'post',
            url: '/projects/paginado',
            headers: { Authorization: sessionStorage.getItem('token') },
            data: {
                page, limit, sort, search,
                filtro_estatus: this.state.filtro_estatus
            }
        })
            .then((response) => {
       

                if (response.data.success) {
                    let dataTable = response.data.data.itemsList;
                    let paginator = response.data.data;

                    this.setState({
                        dataProyectos: dataTable,

                        itemCount: paginator.itemCount,
                        currentPage: paginator.currentPage,
                        pageCount: paginator.pageCount,
                        filtroSearch: search
                    })
                }
            })
            .catch((error) => {

                //  console.log("error  ", error.response);
                message.error("Error.");
            })
    }


    onChangeDropdownFilter = async (event) => {
 
        let sort;

        switch (event) {
            //mas recientes
            case "recientes":
                sort = {
                    field: "createdAt",
                    order: "descend"
                };
                break;
            //mas antiguos
            case "antiguos":
                sort = {
                    field: "createdAt",
                    order: "ascend"
                };
                break;

            //mas AZ
            case "a-z":
                sort = {
                    field: "nombre",
                    order: "ascend"
                };
                break;

            //mas AZ
            case "z-a":
                sort = {
                    field: "nombre",
                    order: "descend"
                };
                break;
        }
     
        this.getProyectos(1, 10, sort = sort);

        // this.props.onChangeDropdownFilter(sort);


    }

    onChangeFiltroEstatus = async (filtro) => {
        console.log(filtro)
        this.setState({
            filtro_estatus: filtro
        });
        setTimeout(() => {
            this.getProyectos(1);
        }, 250);
    }

    render() {

        return (
            <Content className="pd-2" style={{ minWidth: "500px", overflow: "auto" }}>
                <Row style={{ width: '100%', marginBottom: "30px" }}>
                    <Col xs={20} xl={18} span={20} style={{ float: 'left' }} >
                        <Row className="status-prospectos" align="middle" style={{ width: "100%", padding: "10px 0px 0px 0px" }}>
                            <Col xs={24} md={11} xl={5} xxl={3} offset={1}>
                                <div className="box-prospectos">
                                    <Button onClick={(e) => this.onChangeFiltroEstatus(2)}>
                                        <div className="box-prospectos-color shadow" style={{ background: "#64FF00" }}>

                                        </div>
                                    </Button>
                                    <div className="box-prospectos-data">
                                        <span className="box-prospectos-numero">
                                            Completos
                                            </span>
                                    </div>
                                </div>
                            </Col>
                            <Col xs={24} md={11} xl={5} xxl={3} offset={1}  >
                                <div className="box-prospectos">
                                    <Button onClick={(e) => this.onChangeFiltroEstatus(1)}>
                                        <div className="box-prospectos-color shadow" style={{ background: "#EBFF00" }}></div>
                                    </Button>
                                    <div className="box-prospectos-data">
                                        <span className="box-prospectos-numero">En Progreso</span>
                                    </div>
                                </div>
                            </Col>
                            <Col xs={24} md={11} xl={5} xxl={3} offset={1}  >
                                <div className="box-prospectos">
                                    <Button onClick={(e) => this.onChangeFiltroEstatus(0)}>
                                        <div className="box-prospectos-color shadow" style={{ background: "#FF0000" }}></div>
                                    </Button>
                                    <div className="box-prospectos-data">
                                        <span className="box-prospectos-numero">No alcanzo</span>
                                    </div>
                                </div>
                            </Col>
                            <Col xs={24} md={11} xl={5} xxl={3} offset={1}  >
                                <div className="box-prospectos">
                                    <Button onClick={(e) => this.onChangeFiltroEstatus("")}>
                                        <div className="box-prospectos-color shadow" style={{ background: "#0066FF" }}></div>
                                    </Button>
                                    <div className="box-prospectos-data">
                                        <span className="box-prospectos-numero">Sin Plan</span>
                                    </div>
                                </div>
                            </Col>
                            <Col xs={24} md={11} xl={5} xxl={3} offset={1}  >
                                <div className="box-prospectos">
                                    <Button onClick={(e) => this.onChangeFiltroEstatus("")}>
                                        <div className="box-prospectos-color shadow" style={{ background: "#51FE00" }}></div>
                                    </Button>
                                    <div className="box-prospectos-data">
                                        <span className="box-prospectos-numero">Sin Prospectos</span>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                    </Col>
                    <Col xs={10} xl={5} span={3} offset={1} style={{ float: 'right', paddingTop: "25px" }} >
                        <Select placeholder="Más recientes" defaultValue={"recientes"} className="input-box" style={{ float: 'right', width: '100%', marginTop: '0px' }} onChange={this.onChangeDropdownFilter} >
                            <Option value="recientes">Más recientes</Option>
                            <Option value="antiguos">Más antiguos</Option>
                            <Option value="a-z">A - Z</Option>
                            <Option value="z-a">Z - A</Option>
                        </Select>
                    </Col>
                </Row>

                <Row style={{ width: '100%', marginBottom: "30px ", }} >

                    <Row style={{ width: '100%' }} className="row-list-proyectos">
                        <List
                            className="component-list list-proyectos"
                            itemLayout="horizontal"
                            loading={this.state.loading}
                            dataSource={this.state.dataProyectos}
                            header={
                                <Row align="middle" className="pr-1 pl-1" style={{ width: '100%' }} className="row-titleList" >
                                    <Col span={6} className="center ">
                                        <Title level={5}>Nombre</Title>
                                    </Col>
                                    <Col span={5} className="center ">
                                        <Title level={5}>Descripción</Title>
                                    </Col>
                                    <Col span={4} className="center ">
                                        <Title level={5}>Prospectos Deseados</Title>
                                    </Col>
                                    <Col span={3} className="center ">
                                        <Title level={5}>Fecha</Title>
                                    </Col>
                                    <Col span={3} className="center ">
                                        <Title level={5}>Estatus</Title>
                                    </Col>
                                    <Col span={3} className="center">
                                        <Title level={5}>Opciones</Title>
                                    </Col>
                                </Row>
                            }


                            renderItem={item => {
                                var tipo = "";
                                switch (item.estatus_tipo) {
                                    case 0:
                                        tipo = "No alcanzo";
                                        break;
                                    case 1:
                                        tipo = "En progreso";
                                        break;
                                    case 2:
                                        tipo = "Completos";
                                        break;

                                    default:
                                        break;
                                }
                                return <List.Item className="component-list-item">
                                    <Card className="card-list">
                                        <Row style={{ width: '100%' }} className="">
                                            <Col span={6} className="center ">
                                                <Text type="secondary">{item.nombre}</Text>

                                            </Col>
                                            <Col span={5} className="center ">
                                                <Text type="secondary">{item.descripcion_general}</Text>

                                            </Col>
                                            <Col span={4} className="center ">
                                                <Text type="secondary">{item.prospectos_deseados}</Text>

                                            </Col>

                                            <Col span={3} className="center ">
                                                <Text type="secondary">{moment(item.createdAt).toISOString().substr(0, 10)}</Text>

                                            </Col>
                                            <Col span={3} className="center ">
                                                <Text type="secondary"> {tipo}</Text>

                                            </Col>
                                            <Col span={3} className="center">
                                                <span className="spnAccionesUsu"
                                                /*onClick={this.ShowModal} */
                                                >
                                                    <a title="Ver" className="purple-icon" href={`/superadmin/proyectos/proyecto/${item._id}`} ><RightOutlined /> </a>
                                                </span>
                                            </Col>
                                        </Row>
                                    </Card>
                                </List.Item>
                            }}
                        />
                    </Row>

                    <Row style={{ width: '100%' }} className="">
                        <Pagination
                            current={this.state.currentPage}
                            total={this.state.itemCount}
                            defaultPageSize={this.state.limit}
                            showSizeChanger={false}
                            onChange={(page) => {
                                this.getProyectos(page)
                            }}
                        />
                    </Row>
                </Row>


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
                                <Col span={24} style={{ margin: "15px 0px" }}>
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
                                            <div className="group-recordatorio blankTheme">
                                                <Row className="row-encabezados" align="center">
                                                    <Col span={1}>#</Col>
                                                    <Col span={9}>Nombre</Col>
                                                    <Col span={7}>Fecha Limite</Col>
                                                    <Col span={7}>Acciones</Col>
                                                </Row>

                                                <div className="row-contenedor" align="center">
                                                    {
                                                        data.map((item, index) => {
                                                            return <Row className="row-contenido">
                                                                <Col span={1}>{(index + 1)}</Col>
                                                                <Col span={9}>{item.nombre}}</Col>
                                                                <Col span={7}>{item.fecha}}</Col>
                                                                <Col span={7}> <span className="spnAccionesUsu" >
                                                                    <a title="Editar" className="purple-icon"   ><RightOutlined /> </a>   </span>
                                                                </Col>
                                                            </Row>
                                                        })
                                                    }

                                                </div>
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
            </Content>
        )
    }
}


class S_ProyectosCards extends Component {

    constructor(props) {
        super(props)
        this.state = {

            visible: false,
            loading: true,
            dataProyectos: [],

            /* Paginado */
            itemCount: 0,
            pageCount: 1,
            currentPage: 1,
            page: 1,
            limit: 10,
            sort: { field: "createdAt", order: "descend" },
            filter: '',
            search: '',


            data: [
                {
                    _id: 1,
                    name: "nombreCompleto"
                },
                {
                    _id: 2,
                    name: "nombreCompleto"
                },
                {
                    _id: 3,
                    name: "nombreCompleto"
                },
                {
                    _id: 4,
                    name: "nombreCompleto"
                }
            ]

        }
    }

    componentDidMount() {
        this.getProyectos();
        this.setState({ loading: false });
    }

    getProyectos = async (
        page = this.state.currentPage,
        limit = this.state.limit,
        sort = this.state.sort,
        search = this.state.search,
    ) => {
        axios({
            method: 'post',
            url: '/projects/paginado',
            headers: { Authorization: sessionStorage.getItem('token') },
            data: { page, limit: 1000, sort, search }
        })
            .then((response) => {
          
                if (response.data.success) {
                    let dataTable = response.data.data.itemsList;
                    let paginator = response.data.data;

                    this.setState({
                        dataProyectos: dataTable,
                        itemCount: paginator.itemCount,
                        currentPage: paginator.currentPage,
                        pageCount: paginator.pageCount,
                        filtroSearch: search
                    })
                }
            })
            .catch((error) => {

                console.log("error  ", error.response);
                message.error("Error.");
            })
    }

    render() {

        let data_completos = [], data_enProgreso = [], data_noAlcanzo = [], data_sinPlan = [], data_e = [];
        let dataProyectos = this.state.dataProyectos;

        for (let index = 0; index < dataProyectos.length; index++) {
            var proyecto = dataProyectos[index], tipo = "";
 

            switch (proyecto.estatus_tipo) {
                case 0:
                    tipo = "No alcanzo";
                    data_noAlcanzo.push(proyecto);
                    break;

                case 1:
                    tipo = "En progreso";
                    data_enProgreso.push(proyecto);
                    break;
                case 2:
                    tipo = "Completos";
                    data_completos.push(proyecto);
                    break;

                default:
                    break;
            }


        }

        return (
            <Content className="pd-2" style={{ minWidth: "500px", overflow: "auto" }}>
                <Row style={{ width: '100%' }} className="row-cards-proyectos">

                    {/* Completos */}
                    <Col xs={12} xl={8} className="component-card-item">
                        <Card
                            title={
                                <Row>
                                    <Text level={1} strong style={{ textAlign: "left", color: "#FFF", fontSize: "28px" }}>
                                        Completos
                                    </Text>
                                </Row>
                            }
                            bordered
                            hoverable
                            loading={this.state.loading}
                            className="card-proyecto crd-estatus-A"
                            style={{ width: 240, height: 300, Background: "white", borderRadius: "20px 20px" }}
                        >
                            <Row style={{ width: '100%' }} className="row-list-estatus">
                                <List
                                    className="component-list list-proyectos"
                                    itemLayout="horizontal"
                                    loading={this.state.loading}
                                    dataSource={data_completos}
                                    renderItem={sta => (
                                        <List.Item className="component-list-item">
                                            <Card className="card-list">
                                                <Row style={{ width: '100%' }} className="">
                                                  
                                                    <Col span={20} className="center ">
                                                        <Text type="secondary">{sta.nombre}</Text>
                                                    </Col>

                                                    <Col span={4} className="center">
                                                        <span className="spnAccionesUsu" >
                                                            <a title="Ver" href={`/superadmin/proyectos/proyecto/${sta._id}`} className="purple-icon" > <RightOutlined /> </a>
                                                        </span>
                                                    </Col>
                                                </Row>
                                            </Card>
                                        </List.Item>
                                    )}
                                />
                            </Row>

                        </Card>
                    </Col>

                    {/* En Progreso */}
                    <Col xs={12} xl={8} className="component-card-item">
                        <Card
                            title={
                                <Row>
                                    <Text level={1} strong style={{ textAlign: "center", color: "#FFF", fontSize: "28px" }}>
                                        En Progreso
                                    </Text>
                                </Row>
                            }
                            bordered
                            hoverable
                            loading={this.state.loading}
                            className="card-proyecto crd-estatus-B"
                            style={{ width: 240, height: 300, Background: "white", borderRadius: "20px 20px" }}
                        >
                            <Row style={{ width: '100%' }} className="row-list-estatus">
                                <List
                                    className="component-list list-proyectos"
                                    itemLayout="horizontal"
                                    loading={this.state.loading}
                                    dataSource={data_enProgreso}
                                    renderItem={sta => (
                                        <List.Item className="component-list-item">
                                            <Card className="card-list">
                                                <Row style={{ width: '100%' }} className="">
                                                    
                                                    <Col span={20} className="center ">
                                                        <Text type="secondary">{sta.nombre}</Text>
                                                    </Col>

                                                    <Col span={4} className="center">
                                                        <span className="spnAccionesUsu"

                                                        >
                                                            <a title="Ver" href={`/superadmin/proyectos/proyecto/${sta._id}`} className="purple-icon" > <RightOutlined /> </a>
                                                        </span>
                                                    </Col>
                                                </Row>
                                            </Card>
                                        </List.Item>
                                    )}
                                />
                            </Row>

                        </Card>
                    </Col>

                    {/* No Alcanzo */}
                    <Col xs={12} xl={8} className="component-card-item">
                        <Card
                            title={
                                <Row>
                                    <Text level={1} strong style={{ textAlign: "center", color: "#FFF", fontSize: "28px" }}>
                                        No Alcanzo
                                    </Text>
                                </Row>
                            }
                            bordered
                            hoverable
                            loading={this.state.loading}
                            className="card-proyecto crd-estatus-C"
                            style={{ width: 240, height: 300, Background: "white", borderRadius: "20px 20px" }}
                        >
                            <Row style={{ width: '100%' }} className="row-list-estatus">
                                <List
                                    className="component-list list-proyectos"
                                    itemLayout="horizontal"
                                    loading={this.state.loading}
                                    dataSource={data_noAlcanzo}
                                    renderItem={sta => (
                                        <List.Item className="component-list-item">
                                            <Card className="card-list">
                                                <Row style={{ width: '100%' }} className="">
                                                 
                                                    <Col span={20} className="center ">
                                                        <Text type="secondary">{sta.nombre}</Text>
                                                    </Col>

                                                    <Col span={4} className="center">
                                                        <span className="spnAccionesUsu"

                                                        >
                                                            <a title="Ver" href={`/superadmin/proyectos/proyecto/${sta._id}`} className="purple-icon" > <RightOutlined /> </a>
                                                        </span>
                                                    </Col>
                                                </Row>
                                            </Card>
                                        </List.Item>
                                    )}
                                />
                            </Row>

                        </Card>
                    </Col>

                    {/* Sin Plan */}
                    <Col xs={12} xl={8} className="component-card-item">
                        <Card
                            title={
                                <Row>
                                    <Text level={1} strong style={{ textAlign: "center", color: "#FFF", fontSize: "28px" }}>
                                        Sin Plan
                                    </Text>
                                </Row>
                            }
                            bordered
                            hoverable
                            loading={this.state.loading}
                            className="card-proyecto crd-estatus-D"
                            style={{ width: 240, height: 300, Background: "white", borderRadius: "20px 20px" }}
                        >
                            <Row style={{ width: '100%' }} className="row-list-estatus">
                                <List
                                    className="component-list list-proyectos"
                                    itemLayout="horizontal"
                                    loading={this.state.loading}
                                    dataSource={data_sinPlan}
                                    renderItem={sta => (
                                        <List.Item className="component-list-item">
                                            <Card className="card-list">
                                                <Row style={{ width: '100%' }} className="">
                                                    
                                                    <Col span={20} className="center ">
                                                        <Text type="secondary">{sta.nombre}</Text>
                                                    </Col>

                                                    <Col span={4} className="center">
                                                        <span className="spnAccionesUsu"
                                                        >
                                                            <a title="Ver" href={`/superadmin/proyectos/proyecto/${sta._id}`} className="purple-icon" > <RightOutlined /> </a>
                                                        </span>
                                                    </Col>
                                                </Row>
                                            </Card>
                                        </List.Item>
                                    )}
                                />
                            </Row>

                        </Card>
                    </Col>

                    {/* <List
                        className="cards-proyectos"
                        itemLayout="horizontal"
                        loading={this.state.loading}
                        dataSource={this.state.dataProyectos}
                        renderItem={item => (
                            <Col xs={12} xl={8} className="component-card-item">

                                <a title="Ver" href={`/superadmin/proyectos/proyecto/${item._id}`} >
                                    <Card
                                        title={
                                            <Row>
                                                <Avatar style={{ width: "10px !important", height: "auto", marginLeft: "0%" }} src={(item.logo != "" ? (axios.defaults.baseURL + 'upload/' + item.logo) : "/logo192.png")} />
                                                <Text level={1} strong style={{ textAlign: "center", color: "#6084b3" }}> {item.nombre} </Text>
                                            </Row>
                                        }
                                        bordered
                                        hoverable
                                        loading={this.state.loading}
                                        className="card-proyecto"
                                        style={{ width: 240, height: 300, Background: "white", borderRadius: "20px 20px" }}
                                    >

                                        <Row style={{ width: '100%' }} className="row-info-proyecto">
                                            <Col span={24}>
                                                <Text strong > Descripción: </Text>
                                                <Text > {item.descripcion_general}</Text>
                                            </Col>
                                            <Col span={24}>
                                                <Text strong >Prospectos deseados: </Text>
                                                <Text > {item.prospectos_deseados}</Text>
                                            </Col>
                                            <Col span={24} >
                                                <Text strong >Fecha: </Text>
                                                <Text > {moment(item.createdAt).toISOString().substr(0, 10)}</Text>
                                            </Col>

                                            <Col span={24} >
                                                <Text strong>Estatus: </Text>
                                            </Col>

                                        </Row>

                                        <Row style={{ width: '100%' }} className="row-list-estatus">
                                            <List
                                                className="component-list list-proyectos"
                                                itemLayout="horizontal"
                                                loading={this.state.loading}
                                                dataSource={item.estatuses}
                                                renderItem={sta => (
                                                    <List.Item className="component-list-item">
                                                        <Card className="card-list">
                                                            <Row style={{ width: '100%' }} className="">
                                                                <Col span={4} className="center ">
                                                                    <div className="box-prospectos">
                                                                        <div className="box-prospectos-color shadow" style={{ background: "#" + sta.color }}></div>
                                                                    </div>
                                                                </Col>
                                                                <Col span={15} className="center ">
                                                                    <Text type="secondary">{sta.nombre}</Text>
                                                                </Col>

                                                                <Col span={4} className="center">
                                                                    <span className="spnAccionesUsu"

                                                                    >
                                                                        <a title="Opciones" className="purple-icon"   >
                                                                            <RightOutlined /> </a>
                                                                    </span>
                                                                </Col>
                                                            </Row>
                                                        </Card>
                                                    </List.Item>
                                                )}
                                            />
                                        </Row>

                                    </Card>

                                </a>
                            </Col>
                        )}
                    /> */}
                </Row>

                <Row style={{ width: '100%' }} className="">
                    <Pagination
                        current={this.state.currentPage}
                        total={this.state.itemCount}
                        defaultPageSize={this.state.limit}
                        showSizeChanger={false}
                        onChange={(page) => {
                            this.getProyectos(page)
                        }}
                    />
                </Row>
            </Content>
        )
    }
}

export default S_Proyectos;
