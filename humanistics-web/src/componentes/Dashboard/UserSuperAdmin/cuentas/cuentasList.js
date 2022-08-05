import React, { Component } from "react";
import { Select, Row, Col, Switch, message, Empty, Input, Form, Spin, Typography, Tag, Button, List, Card } from 'antd';
import { RightOutlined, SearchOutlined, } from '@ant-design/icons';


const axios = require("axios").default;
const moment = require('moment')
const { Option } = Select;
const { Text } = Typography


/**
 *
 *
 * @class CuentasList
 * @extends {Component}
 */
export default class CuentasList extends Component {
    constructor(props) {
        super(props)

        this.state = {


            loading: true,
            dataCuentas: [],
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

            example: [
                {
                    _id: 1,
                    nombre: 'nombre',
                    email: 'email@email.com',
                    telefono: '6641234567',
                    status: 1,
                    fecha: new Date()
                },
                {
                    _id: 2,
                    nombre: 'nombre',
                    email: 'email@email.com',
                    telefono: '6641234567',
                    status: 1,
                    fecha: new Date(),
                },
                {
                    _id: 3,
                    nombre: 'nombre',
                    email: 'email@email.com',
                    telefono: '6641234567',
                    status: 1,
                    fecha: new Date()
                }]

        }
    }

    componentDidUpdate() {
        if (this.state.loading) {
            this.setState({ loading: false })
        }
    }

    render() {
        let loading = this.state.loading;
        let cuentas = this.props.cuentas;
        let proyectos = this.props.proyectos;


        return (
            <Row justify="center" style={{ width: '100%' }}>
                <Col span={24} className="mt-10" >

                    <List

                        size="small"
                        className="component-list"
                        bordered={false}
                        dataSource={cuentas}
                        locale={"Sin Asesores"}
                        pagination={false}

                        header={
                            <div>
                                <Row align="center" style={{ width: '100%', padding: "5px 20px" }} className="row-titleList" >
                                    <Col span={5}>
                                        <Text>Nombre</Text>
                                    </Col>
                                    <Col span={5}>
                                        <Text>Email</Text>
                                    </Col>
                                    <Col span={3}>
                                        <Text>Teléfono</Text>
                                    </Col>
                                    <Col span={3}>
                                        <Text>Estatus</Text>
                                    </Col>
                                    <Col span={3}>
                                        <Text># Proyectos</Text>
                                    </Col>
                                    <Col span={3}>
                                        <Text>Fecha</Text>
                                    </Col>
                                    <Col span={2}>
                                        <Text>Acciones</Text>
                                    </Col>
                                </Row>
                            </div>
                        }


                        renderItem={item => {
                            let proyectosCount = 0;
                            var cuenta = item;

                            for (let index = 0; index < proyectos.length; index++) {
                                const p = proyectos[index];
                                if (p.user_id == item._id) {
                                    proyectosCount = p.proyectos.length;
                                    break;
                                }
                            }

                            return <List.Item className="component-list-item" key={cuenta._id}>
                                <Card className="card-list">
                                    <Row align="middle" style={{ width: '100%' }} >
                                        <Col span={5}>
                                            <Text>{cuenta.nombre}</Text>
                                        </Col>
                                        <Col span={5}>
                                            <Text>{cuenta.email}</Text>
                                        </Col>

                                        <Col span={3}>
                                            <Text>{cuenta.telefono}</Text>

                                        </Col>
                                        <Col span={3}>
                                            <Text>
                                                {(cuenta.status) ?
                                                    <Switch className="input-box" defaultChecked disabled />
                                                    :
                                                    <Switch className="input-box" disabled />
                                                }
                                            </Text>
                                        </Col>
                                        <Col span={3} style={{ paddingLeft: "3%" }}>
                                            <Text >{proyectosCount}</Text>
                                        </Col>

                                        <Col span={3}>
                                            <Text >{moment(cuenta.createdAt).format('DD/MM/YYYY')}</Text>
                                        </Col>
                                        <Col span={2}>
                                            <a title="Ver" href={`/superadmin/cuentas/cuenta_detalle/${cuenta._id}`} >
                                                <Button type="link" className="purple-icon" style={{ marginLeft: "10px", width:"35px" }} icon={<RightOutlined  style={{paddingLeft:"4px"}}/>}> </Button>
                                            </a>
                                        </Col>
                                    </Row>
                                </Card>
                            </List.Item>
                        }
                        }
                    />
                </Col>
            </Row>
        )
    }
}





