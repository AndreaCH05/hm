import React, { Component } from 'react'
import { Row, Col, Form, Spin, Button, Radio, Input, Switch, InputNumber, Modal, message, Card, Typography, List, Statistic } from 'antd';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import { Paypear } from '../../../Widgets/paypear/index'


import { PricingTable, PricingSlot, PricingDetail } from 'react-pricing-table';


const { Title, Paragraph, Text, } = Typography;


const axios = require("axios").default;


class FormularioPago extends Component {

    pay = (token) => {
        axios.post('/checkout', {
            plan: this.props.plan,
            proyecto_id: this.props.proyecto?._id,
            token
        })
            .then(({ data }) => {
                if (data.success == true) {
                    this.props.success()
                    message.success("¡Pagado exitosamente!")
                } else {
                    message.error(data.success)
                }
            })
            .catch(e => console.log('error error error error error error ', e))
    }

    render() {
        return (
            <Paypear
                user={{ nombre: this.props.user.nombre }}
                total={this.props.plan?.total}
                type="stripe"
                paymentHandledSubmit={this.pay}
            />
        )
    }
}


export default function (props) {

    return <Modal
        onCancel={props.hideModal}
        destroyOnClose={true}
        visible={props.visible}
        footer={null}
        className="modal-payment"
    >
        <FormularioPago {...props} />
    </Modal>
}