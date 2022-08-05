import React, { Component } from "react";
import { Row, Col, Layout, Select, Typography, Modal, Form, Input, Button, PageHeader, Tag, Tooltip, List, Card, message } from 'antd';
// import { SearchOutlined } from '@ant-design/icons';
import { RightOutlined, DownloadOutlined, AppstoreOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';
import 'react-multi-carousel/lib/styles.css';

import EstatusCarousel from '../../sections/Estatus'
import AsesoresCarousel from '../../sections/Asesor'

import ProspectoModal from './ProspectoModal';

const moment = require('moment');
const axios = require('axios');
const { Content } = Layout;
const { Option } = Select;
const { Text } = Typography


class ProspectosList extends Component {

    constructor(props) {
        super(props)
        this.state = {
            visible: false,
            data: [],
            estatus: [],

            asesores: [],
            filtroAsesores: false
        }
    }

    componentDidMount() {
        // var proyectoId = sessionStorage.getItem('proyecto');
        axios.defaults.headers.common['Authorization'] = sessionStorage.getItem('token');
        const pid = this.props;
        if (pid.filtroAsesor) {
            this.setState({ filtroAsesores: true });
        }
    }


    onChangeSearch = (event) => {
        this.props.onChangeSearch(event.target.value);
    };


    /**
     *
     * @function actualizarEstatusProspecto
     * @event
     *
     * @description Se ejecuta cuando se actualiza el dropdown de estatus prospecto. Acutualiza el prospecto
     * */
    actualizarEstatusProspecto = (prospecto_id, estatus) => {
        axios.put('prospectos/update', {
            id: prospecto_id,
            estatus: estatus
        }).then(response => {
            this.props.updateTable()
            message.success('Prospecto actualizado')
        }).catch(error => Modal.warning({
                title: 'Ha ocurrido un error al guardar',
                content: 'No es posible guardar la informacion del prospecto. Contacte a soporte tecnico.',
        }))
    }

    /**
     *
     * @function actualizarUsuarioProspecto
     * @event
     *
     * @description Se ejecuta cuando se actualiza el dropdown de usuario prospecto. Acutualiza el prospecto
     * */
    actualizarUsuarioProspecto = (prospecto_id, usuario_id) => {
        axios.put('prospectos/update', {
            id: prospecto_id,
            asignado_a: usuario_id
        }).then(response => {
            this.props.updateTable()
            message.success('Prospecto actualizado')
        }).catch(error => Modal.warning({
            title: 'Ha ocurrido un error al guardar',
            content: 'No es posible guardar la informacion del prospecto. Contacte a soporte tecnico.',
        }))
    }

    /**
     *
     * @function onChangeSelectMasRecientes
     * @event
     *
     * @description Se ejecuta cuando se cambia el Select de opciones de filtros. Se actualiza la tabla con el filtro seleccionado.
     * */
    onChangeDropdownFilter = (event) => {




        // field: "telefono"
        // order: "ascend"
        let sort;

        switch (parseInt(event)) {
            //mas recientes
            case 1:
                sort = {
                    field: "createdAt",
                    order: "descend"
                };
                break;
            //mas antiugos
            case 2:
                sort = {
                    field: "createdAt",
                    order: "ascend"
                };
                break;

            //mas AZ
            case 3:
                sort = {
                    field: "nombre",
                    order: "ascend"
                };
                break;

            //mas AZ
            case 4:
                sort = {
                    field: "nombre",
                    order: "descend"
                };
                break;
        }


        this.props.onChangeDropdownFilter(sort);


    }

    renderAsesor(text) {


        if (sessionStorage.getItem('rol') != 'Vendedor') {
            let record_id = false;
            let opciones = this.props.usuarios.map(grupo_usuarios => (

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
                    defaultValue={(record_id) ? text.asesor._id : 'Sin Asignar'}
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
        return text.asesor.nombre
    }

    
    render() {
        let filtroAsesor = this.state.filtroAsesores
        return (
            <Content className="pd-1">
                {(filtroAsesor) ?
                    <div>
                        <PageHeader
                            title="ASESORES"
                            className="title custom"
                            extra={[
                                <div style={{ height: "55px", display: "flex", paddingTop: "3px", }}>
                                    <Button key="add" type="ghost" onClick={this.props.new} icon={<PlusOutlined />} />
                                    <Button key="view" type="ghost" onClick={() => { this.props.changeView('Cards') }} icon={<AppstoreOutlined />} />
                                    <Button key="download" type="ghost" onClick={this.props.csv} icon={<DownloadOutlined />} />
                                </div>
                            ]}
                        />
                        <div className="status-prospectos">
                            <AsesoresCarousel
                                asesores={this.props.asesores}
                                onStatusSelected={this.props.onStatusSelected}
                            />
                        </div>
                    </div>
                    :
                    <div>
                        <PageHeader
                            title="ESTATUS"
                            className="title custom"
                            extra={[
                                <div key="estatus" style={{ height: "55px", display: "flex", paddingTop: "3px", }}>
                                    <Button key="add" type="ghost" icon={<PlusOutlined />} onClick={this.props.new} />
                                    <Button key="view" type="ghost" icon={<AppstoreOutlined />} onClick={() => { this.props.changeView('Cards') }} />
                                    <Button key="download" type="ghost" icon={<DownloadOutlined />} onClick={this.props.csv} />
                                </div>
                            ]}
                        />
                        <div className="status-prospectos ">
                            <EstatusCarousel
                                onStatusSelected={this.props.onStatusSelected}
                                estatus={this.props.estatus}
                            />
                        </div>
                    </div>
                }

                <Row className="mt-1" style={{ width: '100%' }} >
                    <Col xs={24} sm={{span: 8}} md={6}>
                        {(filtroAsesor) ? '' :
                            <Form.Item name="search" rules={[{ required: true },]}>
                                <Input prefix={<SearchOutlined />} placeholder="Buscar" className="input-box buscar" onChange={this.onChangeSearch} style={{ height: '25px!important' }} />
                            </Form.Item>
                        }
                    </Col>
                    <Col xs={24} sm={{span: 12, offset: 4}} md={{span: 12, offset: 6}} style={{ float: 'right' }} >
                        <Form.Item name="orderBy" rules={[{ required: true }]} >
                            <Select placeholder="Más recientes" className="input-box" style={{ float: 'right', width: '100%', marginTop: '0px' }} onChange={this.onChangeDropdownFilter}>
                                <Option value="1">Más recientes</Option>
                                <Option value="2">Más antiguos</Option>
                                <Option value="3">A - Z</Option>
                                <Option value="4">Z - A</Option>
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>
                
                <div className="container-scroll">
                    <div className="scroll-x">
                        <Row align="center" style={{ width: '100%' }} className="row-titleList pl-1 pr-1" >
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
                                <Text>Fecha</Text>
                            </Col>
                            <Col span={3}>
                                <Text>Asesor</Text>
                            </Col>
                            <Col span={4}>
                                <Text>Estatus</Text>
                            </Col>
                            <Col span={1}></Col>
                        </Row>
                        <List
                            loading={this.props.loading}
                            className="component-list"
                            bordered={false}
                            dataSource={this.props.data}
                            locale={"Sin Prospectos"}
                            pagination={{
                                onChange: page => {
                                    this.props.updateTable(page)
                                },
                                pageSize: 10,
                                current: this.props.pagination.currentPage,
                                total: this.props.pagination.itemCount,
                                pageSizeOptions: [10]
                            }}
                            renderItem={item => <List.Item className="component-list-item" key={item._id}>
                                <Card className="card-list">
                                    <Row align="middle" style={{ width: '100%' }} >
                                        <Col span={5}>
                                            <Text>{item.nombre}</Text>
                                        </Col>
                                        <Col span={5}>
                                            <Text>{item.email}</Text>
                                        </Col>
                                        <Col span={3}>
                                            <Text>{item.telefono}</Text>
                                        </Col>
                                        <Col span={3}>
                                            <Text>{moment(item.createdAt).format('DD/MM/YYYY')}</Text>
                                        </Col>
                                        <Col span={3}>
                                            <Text>{this.renderAsesor(item)}</Text>
                                        </Col>
                                        <Col span={ 4 }>
                                            <Select 
                                                key={item.estatus?._id} 
                                                className='estatus-select' 
                                                defaultValue={item.estatus?._id} 
                                                bordered={false} 
                                                showArrow={false} 
                                                onChange={value => this.actualizarEstatusProspecto(item._id, value)} >
                                                {this.props.estatus.map(estatus => (
                                                    <Option value={estatus._id}>
                                                        <Tooltip placement="topRight" title={`${estatus.nombre.toUpperCase()} ${estatus.ponderacion}%`}>
                                                            <Tag className="tag-estatus" color={'#' + estatus.color} key={estatus.nombre}>
                                                                {estatus.nombre.toUpperCase()} {estatus.ponderacion}%
                                                            </Tag>
                                                        </Tooltip>
                                                    </Option>
                                                ))}
                                            </Select>
                                        </Col>
                                        <Col span={1} >
                                            <Button className="purple-icon" icon={<RightOutlined />} onClick={() => this.props.setProspecto(item)} />
                                        </Col>
                                    </Row>
                                </Card>
                            </List.Item>}
                        />
                    </div>
                </div> 
            </Content>
        )
    }
}


export default ProspectosList;
