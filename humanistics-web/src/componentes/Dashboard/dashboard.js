import React, { Component } from 'react';

import { Layout, Card, Row, Col, PageHeader, Space, Statistic, Select, Spin, message, Typography, Empty } from 'antd';

//componentes
import UltimasVentas from "../Widgets/UltimasVentas";
import { Ventas_prospectos, Estatus_chart, Ingresos_chart } from '../Widgets/graficas'
//css
import './../../css/style.css'
import moment from 'moment';

const { Option } = Select;
const axios = require('axios').default;
const { Content, Header } = Layout;

const { Title, Text } = Typography

class Dashboard extends Component {

    constructor(props) {
        super(props);
        this.state = {
            current_project: null,
            stats: {
                cards: [],
                mensuales: [],
                ultimas: [],
            },

            loading: false,

            mesSeleccionado: new Date().getMonth(),

            dataGrafica: [],

 
            proyecto_id: undefined

        };
    }

    async componentDidMount() {
        axios.defaults.headers.common['Authorization'] = sessionStorage.getItem('token');



        if (this.actualizandoProyecto && sessionStorage.getItem('proyecto') !== null && sessionStorage.getItem('proyecto') !== undefined) {
            if (this.state.current_project == null || this.state.current_project._id !== sessionStorage.getItem('proyecto')) {
             
                this.actualizandoProyecto = false;
             
                let dashboard = await axios.post(
                    '/dashboard',
                    { proyecto_id: sessionStorage.getItem('proyecto') },
                    {
                        headers: {
                            Authorization: sessionStorage.getItem('token')
                        }
                    });

                
                this.setState({
                    current_project: dashboard.data.proyecto,
                    loading: false,
                    stats: {
                        cards: dashboard.data.data.cards,
                        mensuales: dashboard.data.data.mensuales,
                        ultimas: dashboard.data.data.ultimas
                    },
                });
                this.actualizandoProyecto = true;
                this.getVentasProspectos();

            }
 
        if(this.props.project._id !== undefined){
            this.getInfo()
            this.getVentasProspectos();
        }
    } 

}


    actualizandoProyecto = true;

    async componentDidUpdate() { 

        if (this.actualizandoProyecto && sessionStorage.getItem('proyecto') !== null && sessionStorage.getItem('proyecto') !== undefined) {
            if (this.state.current_project == null || this.state.current_project._id !== sessionStorage.getItem('proyecto')) {
             
                this.actualizandoProyecto = false;
             
                let dashboard = await axios.post(
                    '/dashboard',
                    { proyecto_id: sessionStorage.getItem('proyecto') },
                    {
                        headers: {
                            Authorization: sessionStorage.getItem('token')
                        }
                    });
 
                this.setState({
                    current_project: dashboard.data.proyecto,
                    loading: false,
                    stats: {
                        cards: dashboard.data.data.cards,
                        mensuales: dashboard.data.data.mensuales,
                        ultimas: dashboard.data.data.ultimas
                    },
                });
                this.actualizandoProyecto = true;
                this.getVentasProspectos();

            }
 
 
        if(this.props.project._id !== undefined){
            this.getInfo()
            this.getVentasProspectos();
        }
    }

}


    componentDidUpdate(prevProps) {
        let proyecto_id = this.props.project._id

        if (proyecto_id !== undefined && proyecto_id !== prevProps.project._id && this.state.loading === false){

            this.getInfo()
 
        }
    }

    /**
    * @memberof Dashboard
    *
    * @method getInfo
    * @description  renderiza los card
    *
    **/
    getInfo = () => {
        // this.setState({ loading: true });
        axios.post('/dashboard',{ 
            proyecto_id: this.props.project._id 
        }).then(dashboard => {
            this.setState({
                proyecto_id: this.props.project._id ,
                current_project: dashboard.data.proyecto,
                stats: {
                    cards: dashboard.data.data.cards,
                    mensuales: dashboard.data.data.mensuales,
                    ultimas: dashboard.data.data.ultimas
                },

                loading : false
            });
        }).catch(error => {
            console.log(error)
            message.error('Error')
        }).finally(()=>{
            this.setState({loading: false})
        })
    }

    /**
    * @memberof Dashboard
    *
    * @method generateCards
    * @description  renderiza los card
    *
    **/
    generateCards = () => {
        let responsive;
        if (this.state.stats.cards.length < 1) return null;
        if (this.state.stats.cards.length >= 4) {
            responsive = { xs: 24, md: 12, xl: 6 }
        }
        else if (this.state.stats.cards.length === 3) {
            responsive = { xs: 24, md: 12, xl: 8 }
        }
        else if (this.state.stats.cards.length <= 2) {
            responsive = { xs: 24, md: 12, xl: 12 }
        }
        return <Row gutter={[16, 16]} className="pr-1 pl-1 pb-1">
            {this.state.stats.cards.map((element, index) => {
                if (index > 3) return null;
                return (
                    <Col {...responsive} className={"informative-card"}>
                        <Card className="card" style={{ backgroundColor: `#${element.color}` }}>
                            <Statistic titleStyle={{ color: '#FFFFFF' }} valueStyle={{ color: '#FFFFFF' }} value={element.count} />
                            <p className="informative-card-text">{element.nombre}</p>
                        </Card>
                    </Col>
                )

            })}
        </Row>
    };




    getVentasProspectos = async () => {
        let mes = (this.state.mesSeleccionado + 1);
 
        axios({
            method: 'post',
            url: '/dashboard/ventasProspecto',
            headers: { Authorization: sessionStorage.getItem('token') },
            data: {
                mes: mes,
                proyecto_id: sessionStorage.getItem('proyecto')
            }
        })
            .then((response) => {
     
                if (response.data.success) {
                    let data = response.data.data;
                    this.setState({
                        dataGrafica: data.grafica,
                        loading : false
                    })
                }
            })
            .catch((error) => {

                 console.log("error  ", error.response);
                message.error("Error al traer las ventas.");
            })
    };



    cambioMesSeleccionado = async (e) => {
 

        this.setState({ mesSeleccionado: e });

        setTimeout(() => {
            this.getVentasProspectos();
        }, 300);

        // this.formRef.current.setFieldsValue({ automatizacion: "0" });
        // this.getCountry(e)
    }



    render() {
        let content = null;
 
        const { current_project, mesSeleccionado,  proyecto_id } = this.state;
 

        if (this.state.loading || proyecto_id === undefined)
            return (
                <Space size="middle" className="spin-loading">
                    <Spin size="large" />
                    Cargando Dashboard ...
                </Space>
            );
        else
            return (
                <Layout className="dashboard bg-white" >
                    <Header className="dashboard-header">
                        <PageHeader
                            className="dashboard-page-header"
                     
                        // extra={(
                        //     <Select placeholder="Mes" className="month" >
                        //         <Option value="1">Enero</Option>
                        //         <Option value="2">Febrero</Option>
                        //         <Option value="3">Marzo</Option>
                        //         <Option value="4">Abril</Option>
                        //     </Select>
                        // )}
 
                            title={"Proyecto: " + current_project?.nombre}
                            // extra={(
                            //     <Select placeholder="Mes" className="month" >
                            //         <Option value="1">Enero</Option>
                            //         <Option value="2">Febrero</Option>
                            //         <Option value="3">Marzo</Option>
                            //         <Option value="4">Abril</Option>
                            //     </Select>
                            // )}
 
                        />
                    </Header>

                    <Content className={"content informative-cards"}>
                        {this.generateCards()}
                        <Row gutter={[16, 16]} className="pr-1 pl-1">
                            <Col xs={24} xl={16} >
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

                                        {(this.state.dataGrafica.length > 0) ?
                                            <Ventas_prospectos mes={this.state.mesSeleccionado} data={this.state.dataGrafica} />
                                            : <Empty style={{width:"100%", marginTop:"10%"}}  description="Sin ventas para el mes seleccionado" />
                                        }
                                    </Row>
                                </div>
                            </Col>
                            <Col xs={24} xl={8}>
                                <Row >
                                    <Col span={24} className="contenedor " style={{ marginBottom: 15 }}>
                                        <Estatus_chart data={this.state.stats.cards} />
                                    </Col>
                                    <Col span={24} className="contenedor contenedor-scroll">
                                        <UltimasVentas data={this.state.stats.ultimas} />
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    </Content>
                </Layout>
            )
    }
}




export default Dashboard;
