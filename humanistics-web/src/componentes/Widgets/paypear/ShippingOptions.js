
import React, {Component} from 'react';

import {default as axios} from 'axios';

import {
    Form,
    Button,
    Select,
    Radio
} from 'antd';

import {
    MailOutlined,
    PhoneOutlined,
    MinusCircleOutlined,
    PlusOutlined, SafetyCertificateOutlined
} from '@ant-design/icons';



import './ShippingOptions.css';

const { Option } = Select;

export default class AddressForm extends Component{

    shipping = React.createRef();

    constructor(props) {
        super(props);
        this.shippingOptions = (this.props.shippingOptions !== undefined)?this.props.shippingOptions:[];
    }

    /**
     *
     *
     * @memberof AddressForm
     * @function onShippingSubmit
     * @description se ejecuta cuandl el usuario envia el formualrio.
     */
    onShippingSubmit = (values) => {
    };

    render(){

        const Languaje = this.props.languaje;
        const radioStyle = {
            display: 'block',
            height: '30px',
            lineHeight: '30px',
        };

        return (
            <Form
                ref={this.shipping}
                onFinish={(this.props.onShippingSubmit !== undefined)?this.props.onShippingSubmit:this.onShippingSubmit}
                size='large'
                className="shipping"
            >
                <Form.Item className="form-item">
                    <p>Seleccione su método de envío:</p>
                </Form.Item>
                <Form.Item className="form-item" name="shipping" rules={[{
                    required: true,
                    message: "Debe indicar un metodo de envio"
                }]} >
                    <Radio.Group className="form-item-shipping" onChange={(this.props.onShippingChange !== undefined)?this.props.onShippingChange:null}>
                        {this.shippingOptions.map((T,number)=>{
                            return (
                                <Radio key={"shipping-radio-" +number } className="shipping-information" style={radioStyle} value={number}>
                                    {T.name}
                                    {(T.description !== undefined)?(<small style={{fontStyle: "italic"}}> &nbsp; {T.description}</small>):null}
                                    <p className="cost">${(T.cost == undefined)?"0.00":T.cost}</p>
                                </Radio>);
                        })}
                    </Radio.Group>
                </Form.Item>
                <Form.Item className="form-item">
                    <Button
                        id="paypear-submit"
                        type="primary"
                        htmlType="submit"
                        size="large"
                    >
                        <SafetyCertificateOutlined /> Continuar
                    </Button>
                </Form.Item>
            </Form>

        );
    }
}
