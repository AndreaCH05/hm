import React, { Component } from "react";
import { Table, Layout, Select, Row, Col, Modal, Input, Button, Tabs, Card, List, PageHeader, message, Spin, Pagination, Typography, Tag } from 'antd';
import {
    RightOutlined, PlusOutlined, BorderOutlined, DownloadOutlined,

} from '@ant-design/icons';

import ProspectoModalNuevo from "./../../prospectos/ProspectoModalNuevo";

import ProspectoModal from "./../../prospectos/ProspectoModal";

import './../../../../css/proyectos.css'


const { Content } = Layout;
const { Option } = Select;

const { Title, Text } = Typography;

const axios = require("axios").default;
const moment = require('moment');


export default class S_Proyecto extends Component {
    constructor(props) {
        super(props);
        this.state = {

            visible: false,
            loading: true,
            cargando: false,
            tipoVista: "list",


            pr_id: "",
            pr_logo: "",
            pr_nombre: "",

            pr_fechaCreacion: "",
            pr_prospectosDeseados: "",
            pr_prospectosActuales: " ",
            pr_cuenta: " ",


            dataProspectos: [],

            /* Paginado */
            itemCount: 0,
            pageCount: 1,
            currentPage: 1,
            page: 1,
            limit: 10,
            sort: { field: "createdAt", order: "descend" },
            filter: '',
            search: '',
        }
    }


    componentDidMount() {
 
        this.setState({
            loading: true,
            pr_id: this.props.match.params.id
        });

        setTimeout(() => {
            this.getProspectos();
        }, 200);
    }



    onChangeDropdownFilter = async (event) => {

        //console.log('event', event)
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

        //console.log('sort', sort)
        this.getProspectos(1, 10, sort = sort);

        // this.props.onChangeDropdownFilter(sort);


    }



    getProspectos = async (
        page = this.state.currentPage,
        limit = this.state.limit,
        sort = this.state.sort,
        search = this.state.search,
    ) => {
        var pr_id = this.state.pr_id;
 

        if (pr_id !== null) {

            axios({
                method: 'post',
                url: '/prospectos',
                headers: { Authorization: sessionStorage.getItem('token') },
                data: {

                    proyecto_id: pr_id,
                    filter: sort,
                    byProyecto_id: true,
                    search: search,
                    page,
                    limit
                }
            })
                .then((response) => {
          

                    if (response.data.success) {
                        let dataTable = response.data.data.itemsList;
                        let paginator = response.data.data;
                        let proyecto = response.data.proyecto;

                        this.setState({
                            pr_nombre: proyecto.nombre,
                            pr_logo: proyecto.logo,

                            pr_fechaCreacion: moment(proyecto.createdAt).format("DD-MM-YYYY"),
                            pr_prospectosDeseados: proyecto.prospectos_deseados,
                            pr_prospectosActuales: paginator.itemCount,
                            pr_cuenta: "Cuenta",

                            estatus: response.data.estatus,

                            usuarios: response.data.usuarios,
                            asesores: response.data.asesores,

                            dataProspectos: dataTable,

                            itemCount: paginator.itemCount,
                            currentPage: paginator.currentPage,
                            pageCount: paginator.pageCount,
                            loading: false,
                            filtroSearch: search
                        })
                    }
                })
                .catch((error) => {

                    //  console.log("error  ", error.response);
                    message.error("Error.");
                })
        }
    }

    onCancel = () => {
        this.setState({
            ModalProspectoNuevoVisible: false,
            ModalProspectoVisible: false
        });
        this.getProspectos();
    };


    setProspecto = async (prospecto) => {
        setTimeout(() => {

            this.setState({
                prospecto_update: prospecto,
                ModalProspectoVisible: true,
            })
        }, 250);
    }



    renderAsesor(text) {
 
        let record_id = false;

        let opciones = this.state.usuarios.map(grupo_usuarios => (
            <Select.OptGroup label={grupo_usuarios._id}>
                {grupo_usuarios.usuarios.map(usuario => {

                    if (usuario._id === text.usuarios_id) record_id = true;
                    return (
                        <Option value={usuario._id}>{usuario.nombre}</Option>
                    );
                })}
            </Select.OptGroup>
        ));

        return (
            <Select
                key={text._id}
                className='estatus-select'
                defaultValue={(record_id) ? text.usuarios_id : 'Sin Asignar'}
                bordered={false}
                showArrow={true}
                onChange={e => this.actualizarUsuarioProspecto(text._id, e)}
                notFoundContent={"Asigne el prospecto."}
            >
                <Option disabled={true}>Sin Asignar</Option>
                {opciones}

            </Select>
        )
    }

    actualizarUsuarioProspecto = async (id, event) => {
 
        axios.put('prospectos/update',
            {
                id: id,
                asignado_a: event
            }, {
            headers: {
                Authorization: sessionStorage.getItem('token')
            }
        })

            .then((response) => {
           
                message.success("Se actualizó prospecto");
            })

            .catch(error => Modal.warning({
                title: 'Ha ocurrido un error al guardar',
                content: 'No es posible actualizar la información del prospecto. Contacte a soporte tecnico.',
            })
            ).finally(() => this.setState({
                titleLoading: false
            }))
    }



    render() {
        let { pr_id, pr_nombre, pr_logo,
            pr_fechaCreacion,
            pr_prospectosDeseados,
            pr_prospectosActuales,
            pr_cuenta,
        } = this.state;

        return (<Layout className="bg-white layout-proyectos">
            <Content className="cnt-proyecto">
                <PageHeader
                    title={"PROYECTO " + pr_nombre}
                    className="title custom btns-proyectos"
                    extra={[
                        <div style={{ height: "55px", display: "flex", paddingTop: "3px", }}>
                            <Button
                                onClick={() => { this.setState({ ModalProspectoNuevoVisible: true }) }}

                                htmlType="button"
                                className="purple-icon "
                                key="1"
                                style={{ width: "38px", height: "37px", margin: "5px" }}
                                title="" ><PlusOutlined />
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

                    <Row className="status-prospectos header-container" align="middle" style={{ width: "100%", padding: "10px 0px 0px 0px" }}>
                        <Col xs={24} xl={4}  >
                            <div className="contenedor-logo" style={{ background: "#C4C4C4", maxWidth: "100px", height: "100px", borderRadius: "15px" }}>
                                {(this.state.pr_logo != '') ?
                                    <img src={axios.defaults.baseURL + 'upload/' + pr_logo}
                                        alt="avatar" style={{
                                            width: 'auto',
                                            height: '100%',
                                            borderRadius: '10px'
                                        }} id="logo-empresa" />
                                    :
                                    <h1 className="up center" style={{ marginTop: "20px" }}>LOGO PROYECTO</h1>
                                }
                            </div>
                        </Col>
                        <Col xs={24} md={12} xl={5}  >
                            <Title>CREACION PROYECTO</Title>
                            <Text>{pr_fechaCreacion}</Text>
                        </Col>
                        <Col xs={24} md={12} xl={5}  >
                            <Title>PROSPECTOS / MES</Title>
                            <Text>{pr_prospectosDeseados}</Text>
                        </Col>
                        <Col xs={24} md={12} xl={5}  >
                            <Title>PROSPECTOS ACTUALES</Title>
                            <Text>{pr_prospectosActuales}</Text>
                        </Col>
                        <Col xs={24} md={12} xl={5}  >
                            <Title>CUENTA</Title>
                            <Text>{pr_cuenta}</Text>

                        </Col>
                    </Row>

                    <Row className="cnt-proyecto" style={{ minWidth: "500px", marginTop: "20px", maxHeight: "none", maxWidth: "calc(100% - 5px)" }}>

                        <Row style={{ width: '100%', marginBottom: "30px" }}>
                            <Col xs={20} xl={18} span={20} style={{ float: 'left' }} >
                                <PageHeader
                                    title="PROSPECTOS"
                                    className="title custom"
                                    style={{ paddingLeft: "0px" }}
                                />
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


                        <Row className="cnt-list-prospectos" >



                            <Row style={{ width: '100%', padding: "0px" }} className="row-list-prospectos">
                                <List
                                    className="component-list list-prospectos"
                                    itemLayout="horizontal"
                                    loading={this.state.loading}
                                    dataSource={this.state.dataProspectos}


                                    header={
                                        <Row align="middle" className="pr-1 pl-1" style={{ width: '100%' }} className="row-titleList" >
                                            <Col span={5} className="center ">
                                                <Title level={5}>Nombre</Title>
                                            </Col>
                                            <Col span={4} className="center ">
                                                <Title level={5}>Email</Title>
                                            </Col>
                                            <Col span={3} className="center ">
                                                <Title level={5}>Teléfono</Title>
                                            </Col>
                                            <Col span={3} className="center ">
                                                <Title level={5}>Fecha</Title>
                                            </Col>
                                            <Col span={4} className="center">
                                                <Title level={5}>Asesor</Title>
                                            </Col>
                                            <Col span={3} className="center ">
                                                <Title level={5}>Estatus</Title>
                                            </Col>
                                            <Col span={2} className="center">
                                                <Title level={5}>Opciones</Title>
                                            </Col>

                                        </Row>
                                    }

                                    renderItem={item => (
                                        <List.Item className="component-list-item">
                                            <Card className="card-list">
                                                <Row align="middle" style={{ width: '100%' }} className="">
                                                    <Col span={5} className="center ">
                                                        <Text type="secondary">{item.nombre}</Text>
                                                    </Col>
                                                    <Col span={4} className="center ">
                                                        <Text type="secondary">{item.email}</Text>

                                                    </Col>
                                                    <Col span={3} className="center ">
                                                        <Text type="secondary">{item.telefono}</Text>
                                                    </Col>
                                                    <Col span={3} className="center ">
                                                        <Text type="secondary">{moment(item.createdAt).format("DD-MM-YYYY")}</Text>
                                                    </Col>
                                                    <Col span={4} className="center ">
                                                        <Text>{this.renderAsesor(item)}</Text>
                                                    </Col>
                                                    <Col span={3} className="center ">
                                                        {this.state.estatus?.map(estatus => {
                                                            if (item.estatus == estatus._id) {
                                                                return <Tag className="tag-estatus" color={'#' + estatus.color} key={estatus.nombre} style={{ cursor: "default" }}>
                                                                    {estatus.nombre.toUpperCase()} {estatus.ponderacion}%
                                                                </Tag>
                                                            }
                                                        })}
                                                    </Col>
                                                    <Col span={2} className="center ">
                                                        <span className="spnAccionesUsu center"
                                                            style={{ marginLeft: "35%" }}
                                                        /*onClick={this.ShowModal} */
                                                        >
                                                            <Button className="purple-icon" icon={<RightOutlined />}
                                                                onClick={() => this.setProspecto(item)}
                                                            />
                                                        </span>
                                                    </Col>

                                                </Row>
                                            </Card>
                                        </List.Item>
                                    )}
                                />
                            </Row>

                            <Row style={{ width: '100%' }} className="">
                                <Pagination
                                    current={this.state.currentPage}
                                    total={this.state.itemCount}
                                    defaultPageSize={this.state.limit}
                                    showSizeChanger={false}
                                    onChange={(page) => {
                                        this.getProspectos(page)
                                    }}
                                />
                            </Row>
                        </Row>
                    </Row>

                </Spin>


                <ProspectoModal
                    onCancel={this.onCancel}
                    estatus={this.state.estatus}
                    visible={this.state.ModalProspectoVisible}
                    prospecto={this.state.prospecto_update}
                />

                <ProspectoModalNuevo
                    onCancel={this.onCancel}
                    estatus={this.state.estatus}
                    visible={this.state.ModalProspectoNuevoVisible}
                    proyecto_id={this.state.pr_id}
                />

            </Content>
        </Layout>
        );
    }
}


class ProspectosList extends Component {

    constructor(props) {
        super(props)
        this.state = {
            visible: false,
            loading: true,
            dataProyectos: [],
            dataProspectos: [],


            proyecto_id: "",

            /* Paginado */
            itemCount: 0,
            pageCount: 1,
            currentPage: 1,
            page: 1,
            limit: 10,
            sort: { field: "createdAt", order: "descend" },
            filter: '',
            search: '',

        }
    }

    componentDidMount() {
        this.setState({
            loading: false,

        });

        this.getProspectos();
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


    getProspectos = async (
        page = this.state.currentPage,
        limit = this.state.limit,
        sort = this.state.sort,
        search = this.state.search,
    ) => {


        var pr_id = this.props.proyecto_id;
   
        if (pr_id !== null) {
 
            axios({
                method: 'post',
                url: '/prospectos',
                headers: { Authorization: sessionStorage.getItem('token') },
                data: {

                    proyecto_id: pr_id,
                    filter: sort,
                    byProyecto_id: true,
                    search: search,
                    page,
                    limit
                }
            })
                .then((response) => {
    
                    if (response.data.success) {
                        let dataTable = response.data.data.itemsList;
                        let paginator = response.data.data;

                        this.setState({
                            dataProspectos: dataTable,

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
    }



    onChangeDropdownFilter = async (event) => {

        //console.log('event', event)
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

        //console.log('sort', sort)
        this.getProspectos(1, 10, sort = sort);

        // this.props.onChangeDropdownFilter(sort);


    }

    render() {

        const columns = [
            {
                title: 'Nombre(s)',
                dataIndex: 'nombre',
                key: 'nombre',
                width: "70%"

            },
            {
                title: 'Fecha',
                dataIndex: 'fecha',
                width: "20%",
                key: 'fecha',

                render: (text, record) => (
                    moment(record.createdAt).toISOString().substr(0, 10)
                ),
            },
            {
                title: 'Acciones',
                key: 'actions',
                width: "10%",
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


        return (
            <Content className="cnt-proyecto" style={{ minWidth: "500px", marginTop: "20px", maxHeight: "none", maxWidth: "calc(100% - 20px)" }}>
                <Row style={{ width: '100%', marginBottom: "30px" }}>
                    <Col xs={20} xl={18} span={20} style={{ float: 'left' }} >
                        <PageHeader
                            title="PROSPECTOS"
                            className="title custom"
                            style={{ paddingLeft: "0px" }}
                        />
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

                <Row style={{ width: '100%', marginBottom: "30px", }} >

                    <Row style={{ width: '100%' }} className="title-list">
                        <Col span={6} className="center ">
                            <Title level={5}>Nombre</Title>
                        </Col>
                        <Col span={8} className="center ">
                            <Title level={5}>Email</Title>
                        </Col>
                        <Col span={4} className="center ">
                            <Title level={5}>Teléfono</Title>
                        </Col>
                        <Col span={4} className="center ">
                            <Title level={5}>Fecha</Title>
                        </Col>
                        <Col span={2} className="center">
                            <Title level={5}>Opciones</Title>
                        </Col>
                    </Row>


                    <Row style={{ width: '100%', padding: "0px" }} className="row-list-prospectos">
                        <List
                            className="component-list list-prospectos"
                            itemLayout="horizontal"
                            loading={this.state.loading}
                            dataSource={this.state.dataProspectos}
                            renderItem={item => (
                                <List.Item className="component-list-item">
                                    <Card className="card-list">
                                        <Row style={{ width: '100%' }} className="">
                                            <Col span={6} className="center ">
                                                <Text type="secondary">{item.nombre}</Text>

                                            </Col>
                                            <Col span={8} className="center ">
                                                <Text type="secondary">{item.email}</Text>

                                            </Col>
                                            <Col span={4} className="center ">
                                                <Text type="secondary">{item.telefono}</Text>

                                            </Col>

                                            <Col span={4} className="center ">
                                                <Text type="secondary">{moment(item.createdAt).format("DD-MM-YYYY")}</Text>

                                            </Col>
                                            <Col span={2} className="center">
                                                <span className="spnAccionesUsu center"
                                                    style={{ marginLeft: "35%" }}
                                                /*onClick={this.ShowModal} */
                                                >
                                                    <a title="Opciones" className="purple-icon"  >
                                                        <RightOutlined /> </a>
                                                </span>
                                            </Col>
                                        </Row>
                                    </Card>
                                </List.Item>
                            )}
                        />
                    </Row>

                    <Row style={{ width: '100%' }} className="">
                        <Pagination
                            current={this.state.currentPage}
                            total={this.state.itemCount}
                            defaultPageSize={this.state.limit}
                            showSizeChanger={false}
                            onChange={(page) => {
                                this.getProspectos(page)
                            }}
                        />
                    </Row>
                </Row>

            </Content>
        )
    }
}
