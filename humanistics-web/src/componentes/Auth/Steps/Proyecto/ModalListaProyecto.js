import React, { Component } from 'react'

import { Row, Col, Form, Spin, Button, Radio, Input, Switch, InputNumber, Modal, message, Card, Typography, List, Avatar, Statistic } from 'antd';
import { LeftOutlined, PlusOutlined, ArrowRightOutlined } from '@ant-design/icons';
import { Paypear } from '../../../Widgets/paypear/index'


import { PricingTable, PricingSlot, PricingDetail } from 'react-pricing-table';


const { Title, Paragraph, Text, } = Typography;


const axios = require("axios").default;


class ListaProyecto extends Component {


    state = {
        proyectos: [
            {
                title: 'Ant Design Title 1',
            },
            {
                title: 'Ant Design Title 2',
            },
            {
                title: 'Ant Design Title 3',
            },
            {
                title: 'Ant Design Title 4',
            },
        ]
    }



    componentDidMount() {
        this.getProyectosList()
    }


    getProyectosList = () => {
        this.setState({ loading: true })
        axios.get('/projects')
            .then(({ data }) => {
                this.setState({ proyectos: data.data.itemsList, loading: false })
            })
            .catch(e => console.log('ee', e))
    }


    setProyecto


    render() {
          
        return (
            <Spin spinning={this.state.loading}>
                <List
                    itemLayout="horizontal"
                    dataSource={[{}, ...this.state.proyectos]}
                    renderItem={item => (
                        (item._id) ? <List.Item


                            extra={[
                                <Button type="primary" onClick={() => this.props.setProyecto(item._id)}>
                                    Seleccionar <ArrowRightOutlined />
                                </Button>
                            ]}
                        >
                            <List.Item.Meta

                                avatar={<Avatar src={axios.defaults.baseURL + 'upload/' + item.logo} />}
                                title={<a onClick={() => {
                                }}>{item.nombre}</a>}
                                description={item.descripcion_general}
                            />
                        </List.Item> : <List.Item
                            extra={[
                                <Button type="primary" onClick={() => this.props.setProyecto(null)} style={{
                                    width: '128px',
                                    position: 'relative',
                                    bottom: '10px'
                                }}>
                                    Nuevo <PlusOutlined />
                                </Button>
                            ]}
                        >
                            <List.Item.Meta

                            />
                        </List.Item>
                    )}
                />
            </Spin>
        )
    }
}


export default function (props) {

    return <Modal
        onCancel={props.hideModal}
        destroyOnClose={true}
        footer={null}
        visible={props.visible}
        className="modal-list-projects"
        title="Lista de Proyectos"
        closable={false}
    >
        <ListaProyecto {...props} />
    </Modal>
}