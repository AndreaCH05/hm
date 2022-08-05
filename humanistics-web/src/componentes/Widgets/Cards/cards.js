import React, { Component } from "react";
import { Row, Col, Switch, Typography, Button, Avatar, Card, Progress, List } from 'antd';
import { FormOutlined, RightOutlined, DeleteOutlined } from '@ant-design/icons';


const { Title, Text } = Typography;

const axios = require("axios").default;
const moment = require('moment')

/**
 *
 *
 * @param {*} props
 * @returns
 */
 class AutomatizacionCard extends Component {


    constructor(props) {
        super(props)

        this.state = {
            status: this.props.status,
            id: null,
            update: false
        }
    }


    componentDidUpdate() {
        if (this.state.id?.toString() !== this.props.id?.toString()) {
            this.setState({
                status: this.props.status,
                id: this.props.id
            })
        }
    }



    /**
     * @methodOf CardEncuesta
     *
     * @function setStatus
     * @description Actualiza el estatus de la encuesta
     *
     * @param status
     * @description El status a actualizar.
     *
     * */
    setStatus = (status) => {
        console.log('status event', status);
        this.setState({ loading: true, status })
        setTimeout(() => {
            axios.put("automatizaciones/update", {
                id: this.props.id,
                activo: status
            })
                .then(e => {
                    this.setState({ loading: false })
                })
                .catch(e => {
                    this.setState({ loading: false, })
                })
        },500)
    }



    render() {


        const { automatizacion } = this.props;

        const { setStatus } = this
        return  <Col span={6} className="div_automatizacion " >
            <Row justify="center" align="middle" className="automatizacion-card ">
                <Col span={24}>
                    <Text className="automatizacion-nombre">{automatizacion.nombre}</Text>
                </Col>
        
                <Col span={18} className="mt-20">
                    <Switch
                        loading={this.state.loading}
                        checked={this.state.status}
                        onChange={setStatus}                        
                        className="input-box  item-center" />
                </Col>
                <Col span={3} className="mt-20">
                    <Button type="link" onClick={this.props.onEdit} ghost className="item-center" icon={<FormOutlined />} />
                </Col>
                <Col span={3} className="mt-20">
                    <Button type="link" onClick={this.props.onDelete} ghost className="item-center" icon={<DeleteOutlined />} />
                </Col>
            </Row>
        </Col>
    }
}
// function AutomatizacionCard({ automatizacion }) {
//     return (

//     )

// }


/**
 *
 *ss
 * @param {*} { asesor }
 * @returns
 */
function AsesoresCards({ asesor }) {
    let color = ['card-f1', 'card-f2', 'card-f3', 'card-f4'];
    return (
        <Col xs={24} md={12} lg={12} xl={8} xxl={6} span={6} className="center">
            <Card key={asesor._id} bordered={false} loading={false} hoverable className="card-cuenta" cover={
                <div className={"center card-cuenta-img " + color[Math.floor(Math.random(0, 3))]} >
                    <Avatar style={{ width: 80, height: 80 }} src={"/logo192.png"} />
                </div>}
            >
                <Card.Meta title={asesor.nombre}></Card.Meta>
                <div style={{ padding: '3px 8px', height: '60%' }} className="flex-around-column">
                    <p>Estatus: {(asesor.status == 0) ? 'Desactivado' : 'Registrado'}</p>
                    <p>Email: {asesor.email}</p>
                    <p>Creación: {moment(asesor.createdAt).format('DD / MM / YYYY')}</p>
                </div>
            </Card>
        </Col>
    )
}




/**
 *
 *
 * @param {*} { cuenta }
 * @param {*} { data }
 *d
 * @returns
 */
function CuentasCards({ cuenta, proyectos }) {

    return <Col xs={24} md={12} lg={12} xl={6}>
        <a title="Ver" href={`/superadmin/cuentas/cuenta_detalle/${cuenta._id}`} >
            <Card bordered={false} loading={false} hoverable className="card-cuenta" cover={
                <div className={"card-cuenta-img card-f1"} >
                    <Avatar style={{ width: 55, height: 55, marginLeft: "40%", marginTop: "10px", marginBottom: "10px" }}
                        src={(cuenta.avatar != undefined && cuenta.avatar != "") ? axios.defaults.baseURL + 'upload/' + cuenta.avatar : "/logo192.png"} />
                    <Title level={1} style={{ marginTop: "0px", paddingTop: "0px" }} >{cuenta.nombre}</Title>
                </div>}
            >
                <Row style={{ width: '100%' }} className="row-info-proyecto">
                    <Col span={24}>
                        <Text strong > Email: </Text>
                        <Text > {cuenta.email}</Text>
                    </Col>
                    <Col span={24}>
                        <Text strong >Teléfono: </Text>
                        <Text > {cuenta.telefono}</Text>
                    </Col>
                    <Col span={24} >
                        <Text strong >Fecha: </Text>
                        <Text >{moment(cuenta.createdAt).format('DD/MM/YYYY')}</Text>
                    </Col>

                    <Col span={24} >
                        <Text strong>Estatus: </Text>
                        <Text > {(cuenta.status == 1) ? "Activo" : "Inactivo"}</Text>
                    </Col>

                    <Col span={24} >
                        <Text strong>Proyectos: </Text>
                    </Col>
                </Row>

                <List
                    className="card-cuenta-list"
                    dataSource={proyectos}
                    renderItem={item => (
                        <List.Item key={item._id}>
                            <List.Item.Meta title={item.nombre} />
                            <div>  <a title="Editar" className="purple-icon"   ><RightOutlined /> </a></div>
                        </List.Item>
                    )}
                >
                </List>
            </Card>
        </a>
    </Col>
}


export {
    AutomatizacionCard,
    AsesoresCards,
    CuentasCards
}