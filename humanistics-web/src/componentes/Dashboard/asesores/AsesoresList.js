import React, { Component } from "react";
import { Select, Row, Col, Empty, Input, Form, Spin, Typography, Tag, Button, List, Card } from 'antd';
import { RightOutlined, SearchOutlined, } from '@ant-design/icons';
import { Link } from "react-router-dom";
import { AsesoresCards } from "../../Widgets/Cards/cards";

import './../../../css/asesores.css'

const axios = require("axios").default;
const moment = require('moment')
const { Option } = Select;
const { Text, Title } = Typography



/**
 *
 *
 * @class AsesoresList
 * @extends {Component}
 */
class AsesoresList extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: false,
            search: undefined,
            sort:{}
        }
    }


    /**
     *
     * @methodOf ProspectoModal
     *
     * @function onChangeSearch
     * @description Cierra el modal
     * */
    onChangeSearch = (search) => {
        this.setState({search: search},()=>{
            this.props.obtenerAsesores(1,search,this.state.sort)
        })
    }

     /**
     *
     * @methodOf ProspectoModal
     *
     * @function onChangeDropdownFilter
     * @description Cierra el modal
     * */
    onChangeDropdownFilter = (sort) => {
        this.setState({sort: sort},()=>{
            this.props.obtenerAsesores(1,this.state.search,sort)
        })
    }

    

    render() {
        let loading = this.state.loading;
        let asesores = this.props.asesores
        return (
            <Row justify="center" style={{ width: '100%' }}>


                <Col span={24} className="mt-10" >
                    <List
                        loading={loading}
                        size="small"
                        className="component-list"
                        bordered={false}
                        dataSource={asesores}
                        locale={"Sin Asesores"}
                        pagination={{
                            onChange: page => {
                                this.props.obtenerAsesores(page)
                            },
                            current: this.props.pagination.currentPage,
                            total: this.props.pagination.itemCount
                        }}

                        header=
                        {<Row style={{ width: '100%' }} >

                            <Col xs={24} sm={12}>
                                <Input.Search
                                    placeholder="Buscar" 
                                    className="input-box input-search" 
                                    onSearch={this.onChangeSearch} style={{ height: '25px!important' }} />
                            </Col>
                            <Col xs={24} sm={12} style={{ float: 'right' }} >
                                <Form.Item name="orderBy" rules={[{ required: true }]} >
                                    <Select 
                                        placeholder="Más recientes" 
                                        className="input-box" style={{ float: 'right', width: '100%', marginTop: '0px', maxWidth: "250px" }} 
                                        onChange={this.onChangeDropdownFilter} >
                                        <Option value="1">Más recientes</Option>
                                        <Option value="2">Más antiguos</Option>
                                        <Option value="3">A - Z</Option>
                                        <Option value="4">Estatus</Option>
                                    </Select>
                                </Form.Item>
                            </Col>

                            <Col span={24}>
                                <Row align="center" style={{ width: '100%', padding: "5px 10px" }} className="center row-titleList" >
                                    <Col span={6}>
                                        <Text>Nombre</Text>
                                    </Col>
                                    <Col span={6} >
                                        <Text>Email</Text>
                                    </Col>
                                    <Col span={4} >
                                        <Text>Estatus</Text>
                                    </Col>
                                    <Col span={5} >
                                        <Text>Fecha</Text>
                                    </Col>
                                    <Col span={3} >
                                        <Text>Acciones</Text>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                        }
                        renderItem={item => <List.Item className="component-list-item" key={item._id}>
                            <Card className="card-list">
                                <Row align="center" style={{ width: '100%' }} className="center row-itemList" >
                                    <Col span={6}>
                                        <Text>{item.nombre}</Text>
                                    </Col>
                                    <Col span={6}>
                                        <Text>{item.email}</Text>
                                    </Col>
                                    <Col span={4}>
                                        <Text>{this.props.StatusAsesor(item.status)}</Text>
                                    </Col>
                                    <Col span={5}>
                                        <Text>{moment(item.createdAt).format('DD/MM/YYYY')}</Text>
                                    </Col>
                                    <Col span={3}>
                                        <Link to="/admin/ajustes" title="Prospectos" >
                                            <Button type="link" className="purple-icon" onClick={""} icon={<RightOutlined />}></Button>
                                        </Link>
                                    </Col>
                                </Row>
                            </Card>
                        </List.Item>}
                    />
                </Col>
            </Row>

        )

    }
}


export default AsesoresList;


