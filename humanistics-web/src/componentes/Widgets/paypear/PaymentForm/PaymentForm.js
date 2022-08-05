
import React, {Component} from 'react';

import {default as axios} from 'axios';

import {
    Form,
    Table,
    Select,
    Button,
    Input,
    Typography
} from 'antd';

import {
    MailOutlined,
    PhoneOutlined,
    MinusCircleOutlined, SafetyCertificateOutlined,
} from '@ant-design/icons';


import {injectStripe, StripeProvider, CardElement, Elements} from 'react-stripe-elements';

import '../AddressForm.css';

const { Option } = Select;
const { Text } = Typography;


export default class PaymentFormComponent extends Component{

    paymentForm = React.createRef();


    /**
     *Creates an instance of PaymentForm.
     * @param {*} props
     * @memberof PaymentForm
     *
     */
    constructor(props) {
        super(props);
        this.additionalCharges = (this.props.additionalCharges == undefined)?[]:this.props.additionalCharges;
        this.buyList = this.props.buyList;
    }

    render(){
        const Languaje = this.props.languaje;
        const tailLayout = {
            wrapperCol: { offset: 8, span: 16 },
        };
        //Declararmos el subtotal
        let subtotal = parseFloat(0.0);
        //Declaramos el total
        let total = parseFloat(0.0);
        //Compiamos la lista de compras, aplicarla directamente falla
        let listaCompras = Object.assign([], this.props.buyList);
        //Obtenemos la seleccion elegida
        if (this.props.shippingOptions !== undefined){
            let selectedShippingOption = this.props.shippingOptions[this.props.indexSelectedShippingOptions];
            //Agregamos el metodo de envio seleccionado,
            listaCompras.push({
                name: selectedShippingOption.name,
                description: (selectedShippingOption.description == undefined)?"Servicio de Envio":selectedShippingOption.description,
                cost: selectedShippingOption.cost,
                quantity: 1
            });
        }

        return (
            <Form
                ref={this.paymentForm}
                // onSubmit={(this.props.handleSubmit!=undefined)?this.handleSubmit:this.props.handleSubmit}
                // onFinish={this.onFinish}
                // onFinishFailed={this.onFinishFailed}
                size='large'
                style={{marginTop:'3em'}}
            >
                <Form.Item>
                    <Table dataSource={listaCompras}
                           pagination={false}
                           columns={[
                        {
                            title: 'Nombre',
                            dataIndex: 'name',
                            render: (text,row)=> (row.link == undefined)?text:<a href={row.link} target='_blank'>{text}</a>,
                        },
                        {
                            title: 'Cantidad',
                            dataIndex: 'quantity',
                            key: 'quantity',
                        },
                        {
                            title: 'Costo',
                            dataIndex: 'cost',
                            render: text => {
                                let number = parseFloat(text).toFixed(2);
                                return '$' + ((number > 0)?number: "0.00")
                            },
                        },
                        {
                            title: 'Totales',
                            dataIndex: 'total',
                            render: (text,row) => {
                                let subtotal_products = parseFloat(parseFloat(row.quantity) * parseFloat((row.cost !== undefined)?parseFloat(row.cost).toFixed(2):0)).toFixed(2);
                                subtotal = parseFloat(subtotal) + parseFloat(subtotal_products);
                                return '$' + subtotal_products;
                            },

                        },
                    ]}
                           summary={pageData => {
                               total = subtotal;
                               return (
                                   <>
                                       <tr>
                                           <th colSpan={3}>Subtotal</th>
                                           <td>
                                               <Text type="primary">${parseFloat(subtotal).toFixed(2)}</Text>
                                           </td>
                                       </tr>
                                       {this.additionalCharges.map((T,number) => {
                                           let additionalCharge = T;
                                           let charge = 0;

                                           if (additionalCharge.type == 'percentage')
                                               charge = subtotal * (additionalCharge.quantity / 100);
                                           else
                                               charge = additionalCharge.quantity;

                                           if (additionalCharge.operation == "+")
                                               total = total + charge;
                                           else
                                               total = total - charge;

                                           return(
                                               <tr>
                                                   <th colSpan={2}>{additionalCharge.description}</th>
                                                   <td>
                                                       <Text>{additionalCharge.operation}${parseFloat(additionalCharge.quantity).toFixed(2) + ((additionalCharge.type == 'percentage')?'%':'')}</Text>
                                                   </td>
                                                   <td>
                                                       <Text>{additionalCharge.operation}${parseFloat(charge).toFixed(2)}</Text>
                                                   </td>
                                               </tr>);
                                       })}
                                       <tr>
                                           <th colSpan={3} align={"right"}>Total</th>
                                           <td>
                                               <Text type="primary">${parseFloat(total).toFixed(2)}</Text>
                                           </td>
                                       </tr>
                                   </>
                               );
                           }}
                    />
                </Form.Item>
            </Form>
        );
    }
}


// const PaymentForm = Form.create({ name: 'dynamic_form_item' })(injectStripe(PaymentFormComponent));
//  {PaymentFormComponent};
