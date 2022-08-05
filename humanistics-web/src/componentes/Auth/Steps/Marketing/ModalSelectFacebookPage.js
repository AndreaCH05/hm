import React, { Component } from 'react'

import { Row, Col, Form, Spin, Button, Radio, Input, Switch, InputNumber, Modal, message, Card, Typography, List, Avatar, Statistic } from 'antd';
import { LeftOutlined, PlusOutlined, ArrowRightOutlined } from '@ant-design/icons';
import { Paypear } from '../../../Widgets/paypear/index'


import { PricingTable, PricingSlot, PricingDetail } from 'react-pricing-table';


const { Title, Paragraph, Text, } = Typography;


const axios = require("axios").default;


class ListaProyecto extends Component {


    state = {
        proyectos: []
    }
    
    componentDidMount() {
        this.getFacebookPagesList()
    }

    /**
     *
     *
     * @memberof ListaProyecto
     * @method getFacebookPagesList
     * 
     * @description Obtenemos la lista de páginas del usuario y la devolvemos. 
     * 
     */
    getFacebookPagesList = () => {
        this.setState({ loading: true })
        axios.get('/facebook/pages')
            .then(({ data }) => {
                this.setState({ proyectos: data.data, loading: false })
            })
            .catch(e => console.log('ee', e))
    }



    render() {
        return (
            <Spin spinning={this.state.loading}>
                <List
                    locale={{ emptyText: "No hay páginas." }}  
                    itemLayout="horizontal"
                    dataSource={this.state.proyectos}
                    renderItem={item => (
                        <List.Item
                            extra={[
                                <Button type="primary" onClick={() => this.props.setFacebookPage(item)}>
                                    Seleccionar <ArrowRightOutlined />
                                </Button>
                            ]}
                        >
                            <List.Item.Meta

                                avatar={<Avatar src={axios.defaults.baseURL + 'upload/' + item.avatar} />}
                                title={<a onClick={() => this.props.setFacebookPage(item)}>{item.name}</a>}
                                description={item.category}
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
        {...props}
        destroyOnClose={true}
        className="modal-list-projects"

    >
        <ListaProyecto {...props} />
    </Modal>
}