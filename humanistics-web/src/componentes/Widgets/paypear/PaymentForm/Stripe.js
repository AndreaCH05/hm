
import React, {Component, useState } from 'react';

import {default as axios} from 'axios';

import {
    Form,
    Input,
    Select,
    Button,
    Table,
    Typography,
    Checkbox
} from 'antd';

import {
    MailOutlined,
    PhoneOutlined,
    MinusCircleOutlined, SafetyCertificateOutlined,
} from '@ant-design/icons';

import { loadStripe } from '@stripe/stripe-js';
import {
    CardElement,
    Elements,
    useElements,
    useStripe
} from '@stripe/react-stripe-js';


import PaymentForm from './PaymentForm';


import './Stripe.css';
import {Stripe} from "./index";

const { Option } = Select;
const { Text } = Typography;

const CARD_OPTIONS = {
    iconStyle: 'solid',
    style: {
        base: {
            iconColor: '#c4f0ff',
            color: 'black',
            fontFamily: 'Roboto, Open Sans, Segoe UI, sans-serif',
            fontSize: '16px',
            fontSmoothing: 'antialiased',
            ':-webkit-autofill': {color: '#e5edf5'},
            '::placeholder': {color: '#bfc0d2'},
        },
        invalid: {
            iconColor: '#bfc0d2',
            color: 'black',
        },
    },
};

const stripePromise =  loadStripe('pk_test_51ITHARLGHRnMCNIkYdxZKxj0NNz05BqXlPWuEKeeK9Kxyts9MpyDdilFlMFhxD1MPGj6hIsqSinFyrxsfMjwT2xT00129IvKtT');


const CheckoutForm = (props) => {
    const [error, setError] = useState(null);

    const [checkBox, setChecbox] = useState(false);
    const [message, setmessage] = useState('');
    const stripe = useStripe();
    const elements = useElements();
    const user = props.user;


    let textInput= null;

 

    const paymentHandledSubmit = props.paymentHandledSubmit;
    const handleChange = (event) => {
        if (event.error) {
            setError(event.error.message);
        } else {
            setError(null);
        }
    };

    // Handle form submission.
    const handleSubmit = async (event) => {
        event.preventDefault();
        const cardElement = elements.getElement(CardElement);
        let {token, error} = await stripe.createToken(cardElement,{name: user.nombre});


        try{
            if(checkBox && (textInput.state.value == null || textInput.state.value == "")){
                setmessage("Indique el código de promoción. Si no dispone de una, desmarque la casilla de promoción")
                return ;
            }

            paymentHandledSubmit({
                token: token,
                error:error,
                promo: textInput.state.value
            });

        }catch(e){
            setmessage("Indique el código de promoción. Si no dispone de una, desmarque la casilla de promoción")
        }

    };

    let form = React.createRef()
    return (
        <form onSubmit={handleSubmit} ref={e => form = e}>
            <div style={{marginBottom: '2em'}}>
                Indique su información para proceder al pago.
            </div>
            <fieldset className="FormGroup">
                <div className="FormRow">
                    <CardElement
                        options={CARD_OPTIONS}
                        id="card-element"
                        onChange={handleChange}
                    />
                </div>
            </fieldset>
            <fieldset>
                <div className="card-errors" role="alert">{error}</div>
            </fieldset>
            <div style={{ margin: "0 15px 20px" }}>
                <Checkbox
                    onChange={()=>{
                        setChecbox(!checkBox);
                    }}
                    checked={checkBox}

                >¡Tengo una promoción!</Checkbox>
            </div>
            <div style={{ margin: "0 15px 20px", display: (checkBox?"inline":"none")  }} >
                <Input 
                ref={(input) => textInput = input}
                onChange={e=>                        setmessage('')}
                className="form-item-container-input" req placeholder="Número de Promoción"/>
                <p style={{ padding: "0 15px 20px", display: (checkBox?"inline":"none"), color:"red"  }}>{ message }</p>
            </div>


            <fieldset>
                <Button
                    id="paypear-submit"
                    type="primary"
                    htmlType="submit"
                    size="large"

                    onClick={ e => {
                        handleSubmit(e)
                        
                    }}
                >
                    <SafetyCertificateOutlined/> Pagar
                </Button>
            </fieldset>
        </form>
    );
}

class StripeAdapter extends Component{


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
            <div>
                {
                    (this.props.total == undefined)?
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
                        :null
                }
                <Elements stripe={stripePromise}>
                    <CheckoutForm
                        user={this.props.user}
                        paymentHandledSubmit={this.props.paymentHandledSubmit}
                    />
                </Elements>
            </div>
    );
    }


    constructor(props) {
        super(props);
    }

    async componentDidMount() {

    }
}

export default (StripeAdapter);
