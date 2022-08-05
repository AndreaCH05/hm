import React, { Component } from 'react'
import { Row, Col, Form, Spin, Button, Radio, Input, Switch, InputNumber, Modal, message, Card, Typography, List, Statistic } from 'antd';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';


import ModalPago from './ModalPago.js';


import Logged from '../../../../Hooks/Logged';


import '../../../../css/Steps/Planes.css';

const { Title, Paragraph, Text, } = Typography;


const axios = require("axios").default;

function getContrastYIQ(hexcolor) {
    hexcolor = hexcolor.replace("#", "");
    var r = parseInt(hexcolor.substr(0, 2), 16);
    var g = parseInt(hexcolor.substr(2, 2), 16);
    var b = parseInt(hexcolor.substr(4, 2), 16);
    var yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
    return (yiq >= 128) ? 'black' : 'white';
}

function exists(element) {
    return (element !== undefined && element !== null && element !== "")
}



//planes
export default class Planes extends Component {

    static contextType = Logged

    constructor(props) {
        super(props);
        this.state = {
            planes: [],
            value: 1,
            visible: false,
            loading: false,
            valorRadio: '',
            userName: '',

            idProyecto: '',
            idPlanSel: '',
            costoPlanSel: 0,
            tipoPlanSel: 'Mensual',


            pago_id: '',
            pago_costo: '',
            pago_tipo: '',
            pago_planId: '',


            modalVisible: false,


            currentPayment: {
                plan_id: {}
            }

        }
    }

    //referencia
    paypear = React.createRef();
    formRefPlanes = React.createRef();
    modalPayment = React.createRef();

    componentDidMount() {
        const pid = this.props.proId;
        this.setState({ idProyecto: pid });
        this.loadPlan()
        this.getPlanes();


    }

    getPlanes = () => {
        axios.get('/planes', {
            params: {
                pagination: false
            }
        })
            .then(({ data }) => {
                this.setState({
                    planes: data.data,
                });
            })

            .catch((error) => {
                console.log("error", error.response);
            });
    }



    /**
     * @memberof Ajustes
     *
     * @method LoadDataPlan
     * @description  Si es una edicion de usuario se manda una peticion para traer la informacion del servidor
     *
     **/
    loadPlan = async (user = this.context) => {
        axios.post('/checkout/id', { user })
            .then((response) => {
                if (response.data.data !== null) {
                    this.state.currentPayment = response.data.data;
                }

            })
            .catch((error) => {
                if (error.status >= 300) {
                    Modal.info({
                        title: error.response.status,
                        content: error.response.data
                    })
                }
            })
            .finally(e => {
                this.setState({ spinning: false });
            });

    };


    getCosto = (tipo, plan) => {
        let costo;
        switch (tipo) {
            case 1:
                if (plan.personalizado == true) {
                    costo = plan.cantidad_prospectos * plan.costo_prospecto_mensual
                    costo = isNaN(costo) ? 0 : costo
                } else {
                    costo = plan.costo_mensual
                }


                break;
            case 2:
                if (plan.personalizado == true) {
                    costo = plan.cantidad_prospectos * plan.costo_prospecto_anual * 12
                    costo = isNaN(costo) ? 0 : costo
                } else {
                    costo = plan.costo_anual
                }
                break;
            default:
                if (plan.personalizado == true) {
                    costo = plan.cantidad_prospectos * plan.costo_prospecto_mensual
                    costo = isNaN(costo) ? 0 : costo
                } else {
                    costo = plan.costo_mensual
                }
                break;
        }

        return costo;
    }

    proceedPayment = (selected) => {


        return this.props.onNext();
        if (selected.total == 0) {
            if (selected.personalizado == true)
                return Modal.error({
                    title: "Debe de indicar un número mínimo de prospectos.",
                    content: "Para proceeder con un plan personalizado, debe de haber un número de prospectos."
                })

            this.props.onNext()
            // axios.post('/checkout', {
            //     plan: selected,
            //     proyecto_id: this.props.proyecto?._id,
            // })
            //     .then(({ data }) => {
            //         if (data.success == true) {
            //             this.props.success()
            //         } else {
            //             message.error(data.success)
            //         }
            //         
            //     })
            //     .catch(e => console.log('error error error error error error ', e))

        } else {
            this.setState({
                selected,
                modalVisible: true
            })
        }
    }

    render() {
        // this.props.pid
        return (
            <div className="welcome plans">
                <Row className="title-plans">

                    <Col xs={24} sm={24} md={24} lg={24} xl={24} className="center">
                        <h1 className="step-title">Prospectos</h1>
                    </Col>

                    <Col xs={24} sm={24} md={24} lg={24} xl={24} className="center">
                        <Paragraph className="parragraph step-subtitle">
                            Selecciona el numero de prospectos clientes que quieres recibir por mes en tu proyecto.
                        </Paragraph>
                    </Col>

                </Row>

                <Row style={{ width: '100%' }} gutter={[23, 16]}>
                    {this.state.planes.map((plan, index) => {
                        let tipo = null
                        let costo = 0
                        let prospectos = 0
                        switch (plan.tipo) {
                            case 1:
                                tipo = "Mensual"
                                if (plan.personalizado == true) {
                                    costo = plan.cantidad_prospectos * plan.costo_prospecto_mensual
                                    costo = isNaN(costo) ? 0 : costo
                                } else {
                                    costo = plan.costo_mensual
                                }
                                prospectos = plan.prospectos_mensuales

                                break;

                            case 2:
                                tipo = "Anual"
                                if (plan.personalizado == true) {
                                    costo = plan.cantidad_prospectos * plan.costo_prospecto_anual
                                    costo = isNaN(costo) ? 0 : costo
                                } else {
                                    costo = plan.costo_anual
                                }
                                prospectos = plan.prospectos_anuales
                                break;
                            case 3:


                                costo = this.getCosto(plan.plan_tipo, plan)
                                prospectos = (plan.plan_tipo == 1) ? plan.prospectos_mensuales : plan.prospectos_anuales//plan.prospectos_anuales
                                tipo = <Radio.Group
                                    lassName="radio-time"
                                    options={[
                                        { label: 'Mensual', value: 1, onClick: () => { console.log() } },
                                        { label: 'Anual', value: 2 }
                                    ]}
                                    value={(plan.plan_tipo) ? plan.plan_tipo : 1}
                                    onChange={(event) => this.setState(state => {
                                        state.planes[index].plan_tipo = event.target.value
                                        return state;
                                    })}
                                    defaultValue="mensual"
                                />
                                break;

                        }
                        if (plan.personalizado == true) {
                            prospectos = <InputNumber className="prospectos-input" defaultValue={0} placeholder="Cantidad de Prospectos" onChange={(value) => this.setState(state => {
                                state.planes[index].cantidad_prospectos = value
                                return state;
                            })} />
                        } else {
                            prospectos = <div className="prospecto">
                                {prospectos}
                            </div>
                        }


                        plan.total = costo;
                        return <Col span={8}>
                            <Card
                                className="plan-card"
                                title={plan.nombre}
                                hoverable
                                style={{ width: 240 }}
                                headStyle={{
                                    background: (exists(plan.color1) && exists(plan.color2)) ? `linear-gradient(223.7deg, #${plan.color1} 35.01%, #${plan.color2} 132.73%)` : "linear-gradient(223.7deg, #414141 35.01%, #000000 132.73%)",
                                    color: (exists(plan.color1) && exists(plan.color2)) ? getContrastYIQ(plan.color1) : "white"
                                }}
                            >
                                {(this.state.currentPayment?.plan_id?._id == plan?._id) ? <div className="selected-container">
                                    <span className="selected">Actual</span>
                                </div> : null}
                                {tipo}

                                <Statistic
                                    className="plan-cost"
                                    value={costo}
                                    precision={0}
                                    // valueStyle={{ color: '#3f8600' }}
                                    prefix={"$"}
                                    suffix={"MXN"}
                                />
                                {prospectos}
                                <p className="prospectos-mes">
                                    Prospectos humanistics por Mes
                                </p>
                                <List
                                    className="plan-list-descriptions"
                                    itemLayout="horizontal"
                                    dataSource={[<div><strong>{plan.usuarios}</strong> Usuarios</div>, ...plan.descripciones]}
                                    renderItem={item => (
                                        <List.Item>
                                            {item}
                                        </List.Item>
                                    )}
                                />
                                <Button className="btn-pay" type="primary" onClick={() => this.proceedPayment(plan)}  >Adquirir</Button>
                            </Card>
                        </Col>
                    })}
                </Row>

                <ModalPago
                    plan={this.state.selected}
                    proyecto={this.props.proyecto}
                    user={this.context}
                    visible={this.state.modalVisible}
                    hideModal={() => this.setState({ modalVisible: false })}
                    success={() => {
                        this.setState({ modalVisible: false })
                        try {
                            this.props.onNext()
                        } catch (error) {
                            console.log('error');
                        }
                    }}
                />
            </div>
        )
    }
}