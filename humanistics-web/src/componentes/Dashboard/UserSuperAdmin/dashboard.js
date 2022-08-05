import React, { Component } from 'react';
import { Layout, Card, Row, Col, PageHeader, Button, Typography, Space, Statistic, Select, Spin, message } from 'antd';

import { AppstoreOutlined, DownloadOutlined } from '@ant-design/icons';

import { FaListUl } from "react-icons/fa";

//componentes
import UltimasVentas from "../../Widgets/UltimasVentas";
import { Ventas_chart, Ingresos_chart } from '../../Widgets/graficas'
import { DownloadIcon } from '../../Widgets/Iconos'

//css
import './../../../css/style.css'

const { Option } = Select;
const axios = require('axios').default;
const { Content, Header } = Layout;

const { Title, Text } = Typography

class Dashboard extends Component {

    constructor(props) {
        super(props);
        this.state = {
            mesSeleccionado: new Date().getMonth(),

            dataGrafica: [],

            numProyectos: "ProyectosDePago",
            numProyectosCnt: "#",

            numUsuarios: "ProyectosDeUsuarios",
            numUsuariosCnt: "#",

            totalProyectos: "ProyectosTotal",
            totalProyectosCnt: "#",

            totalIngresosMes: "IngresosTotal",
            totalIngresosMesCnt: "#",

            current_project: null,
            stats: {
                cards: [],
                mensuales: [],
                ultimas: [],
            },
            loading: true,
        };
    }

    actualizandoProyecto = true;

    componentDidMount = async () => {
        axios.defaults.headers.common['Authorization'] = sessionStorage.getItem('token');

        this.getCardsInfo();

    }

    async componentDidUpdate() {
    }


    /**
    * @memberof Dashboard
    *
    * @method getCardsInfo
    * @description  consulta info cards
    *
    **/
    getCardsInfo = async () => {
        let mes = this.state.mesSeleccionado;
        axios({
            method: 'post',
            url: '/dashboard/superAdmin',
            headers: { Authorization: sessionStorage.getItem('token') },
            data: {
                mes: mes
            }
        })
            .then((response) => {
                if (response.data.success) {
                    let data = response.data.data;
                    this.setState({
                        numProyectosCnt: data.ProyectosPago,
                        totalProyectosCnt: data.ProyectosTotal,
                        numUsuariosCnt: data.UsuariosTotal,
                        totalIngresosMesCnt: data.IngresosTotal,
                        dataGrafica: data.grafica
                    })
                }
            })
            .catch((error) => {

                //  console.log("error  ", error.response);
                message.error("Error.");
            })
    };


    cambioMesSeleccionado = async(e) => {
        this.setState({mesSeleccionado : e});

        setTimeout(() => {
            this.getCardsInfo();
        }, 250);

        // this.formRef.current.setFieldsValue({ automatizacion: "0" });
        // this.getCountry(e)
    }


    render() {
        let content = null;
        const {
            numProyectos,
            numProyectosCnt,

            numUsuarios,
            numUsuariosCnt,

            totalProyectos,
            totalProyectosCnt,

            totalIngresosMes,
            totalIngresosMesCnt,

            mesSeleccionado
        } = this.state;

        return (
            <Layout className="dashboard bg-white" >
                <Header className="dashboard-header" style={{ marginBottom: "30px" }}>
                    <PageHeader
                        title="ANALYTICS"
                        className="title custom btns-proyectos"
                        extra={[
                            <div style={{ height: "55px", display: "flex", paddingTop: "3px" }}>
                                <Button
                                    htmlType="button"
                                    className="purple-icon "
                                    key="2"
                                    style={{ width: "38px", height: "37px", margin: "5px", paddingTop: "5px !important" }}
                                    title="" ><DownloadIcon />
                                </Button>
                            </div>
                        ]}
                    />
                </Header>

                <Content className={"content informative-cards"} style={{ padding: "15px 0px", marginBottom: "20px" }}>
                    <Row gutter={[24, 24]} className="pr-1 pl-1 cards-superAdmin">
                        <Col xs={24} md={12} xl={6} span={6} className={"informative-card"}>
                            <Card className="card card-A">
                                <Statistic titleStyle={{ color: '#FFFFFF' }} valueStyle={{ color: '#FFFFFF' }} value={numProyectosCnt} />
                                <p className="informative-card-text">{numProyectos}</p>
                            </Card>
                        </Col>
                        <Col xs={24} md={12} xl={6} span={6} className={"informative-card"}>
                            <Card className="card card-B">
                                <Statistic titleStyle={{ color: '#FFFFFF' }} valueStyle={{ color: '#FFFFFF' }} value={numUsuariosCnt} />
                                <p className="informative-card-text">{numUsuarios}</p>
                            </Card>
                        </Col>
                        <Col xs={24} md={12} xl={6} span={6} className={"informative-card"}>
                            <Card className="card card-C">
                                <Statistic titleStyle={{ color: '#FFFFFF' }} valueStyle={{ color: '#FFFFFF' }} value={totalProyectosCnt} />
                                <p className="informative-card-text">{totalProyectos}</p>
                            </Card>
                        </Col>
                        <Col xs={24} md={12} xl={6} span={6} className={"informative-card"}>
                            <Card className="card card-D">
                                <Statistic titleStyle={{ color: '#FFFFFF' }} valueStyle={{ color: '#FFFFFF' }} value={totalIngresosMesCnt} />
                                <p className="informative-card-text">{totalIngresosMes}</p>
                            </Card>
                        </Col>
                    </Row>


                    <Row gutter={[24, 24]} className="pr-1 pl-1" style={{ padding: "5px", paddingTop: "15px", marginBottom: "10px", width: "99.5%", marginLeft: "5px" }}>
                        <Col xs={24} style={{ width: "100%" }}>
                            <div className="contenedor" style={{ width: "100%", padding: "10px" }}>
                                <Row style={{ width: "100%" }}>
                                    <Col span={12}>
                                        <Title className="page-title"> VENTAS </Title>
                                    </Col>

                                    <Col span={12}>
                                        <Select placeholder="MES" className="input-box"
                                            defaultValue={mesSeleccionado}
                                            onChange={this.cambioMesSeleccionado}
                                            style={{ float: 'right', width: '100%', marginTop: '5px', maxWidth: "250px", marginRight: "5px" }}
                                        >
                                            <Option value={0}>Enero</Option>
                                            <Option value={1}>Febrero</Option>
                                            <Option value={2}>Marzo</Option>
                                            <Option value={3}>Abril</Option>
                                            <Option value={4}>Mayo</Option>
                                            <Option value={5}>Junio</Option>
                                            <Option value={6}>Julio</Option>
                                            <Option value={7}>Agosto</Option>
                                            <Option value={8}>Septiembre</Option>
                                            <Option value={9}>Octubre</Option>
                                            <Option value={10}>Noviembre</Option>
                                            <Option value={11}>Diciembre</Option>

                                        </Select>
                                    </Col>
                                </Row>
                                <Row>
                                    <Ventas_chart mes={this.state.mesSeleccionado} data={this.state.dataGrafica}  />
                                </Row>
                            </div>
                        </Col>
                    </Row>
                </Content>
            </Layout>
        )
    }
}




export default Dashboard;
