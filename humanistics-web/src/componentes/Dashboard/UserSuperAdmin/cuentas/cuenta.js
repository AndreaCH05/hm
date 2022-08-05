import React, { Component } from "react";
import { Layout, Card, Row, Col, PageHeader, Switch, List, message, Pagination, Image, Button, Spin, Modal, Avatar, Typography } from "antd";
import { Redirect, Link } from "react-router-dom";
import { FormOutlined, DeleteOutlined,  EyeOutlined, ExclamationCircleOutlined, PlusOutlined } from '@ant-design/icons';

import { Plan, PlanesList } from "./cuenta_plan";

import './../../../../css/cuentas.css'

const axios = require("axios").default;
const moment = require('moment');


const { Header, Content } = Layout;
const { Text, Title } = Typography;
const gridStyle = {
    width: '25%',
    textAlign: 'left',
    textTransform: 'uppercase'
};


class S_Cuenta extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: true,

            proyectoSeleccionado:"",

            cuentaNombre: "",

            cuentaFechaInicio: "",
            cuentaAdmin: "",
            cuentaEstatus: false,


            proyectosCount: 0,
            usuariosCount: 0,

            data_user: [],
            dataProyectos: [],
            dataCuentas: [],

            modalPlanInfo: false,

            /* Paginado */
            itemCount: 0,
            pageCount: 1,
            currentPage: 1,
            page: 1,
            limit: 10,
            sort: { field: "createdAt", order: "descend" },
            filter: '',
            search: '',

            cuentas: [
                {
                    _id: 1
                }, {
                    _id: 2
                },
                {
                    _id: 3
                },
                {
                    _id: 4
                },
                {
                    _id: 5
                },
                {
                    _id: 6
                },
                {
                    _id: 7
                },
                {
                    _id: 8
                },
                {
                    _id: 9
                },
                {
                    _id: 10
                },
            ]
        }
    }

    componentDidMount() {
        this.getCuentaInfo();

        this.setState({ loading: false,
            proyectoSeleccionado : "606d0efe53df5a2e79632440"
        });
 

    }

    componentDidUpdate() {
        
    }


    getCuentaInfo = async (
        page = this.state.currentPage,
        limit = this.state.limit,
        sort = this.state.sort,
        search = this.state.search,
    ) => {
        
        var cuentaId = this.props.match.params.id;

        axios({
            method: 'post',
            url: '/usuarios/cuentaInfo',
            headers: { Authorization: sessionStorage.getItem('token') },
            data: { cuentaId, page, limit, sort, search }
        })
            .then((response) => {
                if (response.data.success) {

                    let data_proyectos = response.data.data_proyectos;
                    let data_user = response.data.data_user;
                    let proyectosCount = response.data.proyectosCount;
                    let usuariosCount = response.data.usuariosCount;
                    let admin = "";
                    let activo = (data_user.status == 1);

                    if (data_user.admin != undefined) {
                        admin = data_user.admin.nombre;
                    }
                    let dataTable = data_proyectos.itemsList;
                    let paginator = response.data.pagination;

                    this.setState({
                        cuentaFechaInicio: data_user.createdAt,
                        cuentaAdmin: admin,
                        cuentaEstatus: activo,
                        cuentaNombre: data_user.nombre,


                        data_user: data_user,

                        proyectosCount: proyectosCount,
                        usuariosCount: usuariosCount,


                        dataProyectos: data_proyectos,
                        itemCount: paginator.itemCount,
                        currentPage: paginator.currentPage,
                        pageCount: paginator.pageCount,

                        loading: false,
                        filtroSearch: search,
                    })
                }
            })
            .catch((error) => {

                //  console.log("error  ", error.response);
                message.error("Error.");
            })
    }


    abrirModalPlanInfo = async (e) => {
        
        this.setState({
            proyectoSeleccionado : e.currentTarget.id,
            modalPlanInfo: true
        })
    }

    render() {
        let {
            loading,
            cuentaFechaInicio,
            cuentaAdmin,
            cuentaEstatus,
            cuentaNombre,
            dataProyectos, data_user, proyectosCount, usuariosCount,
            itemCount,
            currentPage,
            pageCount,
        } = this.state;


        return (
            <Layout className="layout-cuenta bg-white ">
                <Spin spinning={loading} >
                    <Content className="pd-1">
                        <Row align="center">
                            <Text className="textGray" title="Fecha de inicio">{(cuentaFechaInicio != "") ? moment(cuentaFechaInicio).format('DD/MM/YYYY') : "Fecha de Inicio"}</Text>
                        </Row>
                        <Row>
                            <PageHeader className="font_color" title={"Cuenta " + cuentaNombre} />
                        </Row>
                        <Row >
                            <Col span={24}>
                                <Card bordered={false} className="card-status-cuenta">
                                    {(cuentaAdmin != "") ? <Card.Grid hoverable={false} style={gridStyle}> <span> Admin    </span> <p>{cuentaAdmin}</p></Card.Grid> : null}
                                    <Card.Grid hoverable={false} style={gridStyle}> <span> Usuarios </span> <p>{usuariosCount}</p></Card.Grid>
                                    <Card.Grid hoverable={false} style={gridStyle}> <span> Proyectos</span> <p>{proyectosCount}</p></Card.Grid>
                                    <Card.Grid hoverable={false} style={gridStyle}> <span> Activa   </span> <p>
                                        {(cuentaEstatus) ? <Switch disabled key={1} defaultChecked className="input-box" /> : <Switch disabled key={2} className="input-box" />}
                                    </p></Card.Grid>
                                </Card>
                            </Col>
                        </Row>

                        <Row gutter={[16, 16]} className="pd-1 mt-10" >
                            <Col span={16}><h3 className="font_color">Proyectos</h3></Col>
                            <Col span={8}>
                                <Link to="#" title="Crear nuevo" >
                                    <PlusOutlined className="add-icon" ></PlusOutlined>
                                </Link>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={24}>
                                <List
                                    className="list-proyectos"
                                    itemLayout="vertical"
                                    size="large"
                                    pagination={false}
                                    dataSource={dataProyectos}
                                    loading={loading}
                                    locale={"Sin Cuentas"}

                                    renderItem={item => {
                                        
                                        return <List.Item key={item._id} >
                                            <Card bordered={false} className="list-proyecto-card">
                                                <Card.Grid hoverable={false} style={{ width: "16%" }}>
                                                    {(item.logo == "") ?
                                                        <Image className="img-proyecto" src={"/images/error/180x150.jpg"} width={100} />
                                                        :
                                                        <Image className="img-proyecto" src={axios.defaults.baseURL + 'upload/' + item.logo} width={100} />
                                                    }

                                                </Card.Grid>
                                                <Card.Grid hoverable={false} style={{ width: "16%" }}> <span> Proyecto  </span> <p>{item.nombre}</p></Card.Grid>
                                                <Card.Grid hoverable={false} style={{ width: "16%" }}> <span> Inicio    </span> <p>{moment(item.fechaCreacion).format('DD/MM/YYYY')}</p></Card.Grid>
                                                <Card.Grid hoverable={false} style={{ width: "16%" }}> <span> Plan      </span> <p>{item.plan}</p></Card.Grid>
                                                <Card.Grid hoverable={false} style={{ width: "16%" }}> <span> Prospectos   </span> <p>{item.prospectos}</p></Card.Grid>
                                                <Card.Grid hoverable={false} style={{ width: "16%" }}>
                                                    <span> Acciones </span>
                                                    <p>
                                                        <span className="spnAccionesUsu" >
                                                            <Button title="Ver" className="green-icon" id={item._id}
                                                            onClick={(e) => this.abrirModalPlanInfo(e)} 
                                                            icon={ <EyeOutlined />} ></Button>
                                                            <Button title="Editar" className="purple-icon" id={item._id} icon={<FormOutlined />} ></Button>
                                                            <Button title="Eliminar" className="red-icon" name={item.nombre} id={item._id} 
                                                            
                                                            icon={<DeleteOutlined />}></Button>
                                                        </span>
                                                    </p>
                                                </Card.Grid>
                                            </Card>
                                        </List.Item>
                                    }}>

                                </List>
                            </Col>


                        </Row>
                        <Row style={{ width: '100%', marginTop:"15px" }} className="">
                            <Pagination
                                current={currentPage}
                                total={itemCount}
                                defaultPageSize={10}
                                showSizeChanger={false}
                                onChange={(page) => {
                                    this.getCuentaInfo(page)
                                }}
                            />
                        </Row>

                    </Content>

                    <Modal
                        visible={this.state.modalPlanInfo}
                        onCancel={e => this.setState({ modalPlanInfo: false })}
                        footer={false}
                        className="mdl-crearUsuario box-table mdl-NuevoMiembro mdl-ajustes"
                    >
                        <Row>
                            <Col span={24}>
                                <Plan 
                                    proyecto_id = {this.state.proyectoSeleccionado}
                                />
                            </Col>
                        </Row>
                    </Modal>

                </Spin>
            </Layout>
        )
    }
}

export default S_Cuenta;