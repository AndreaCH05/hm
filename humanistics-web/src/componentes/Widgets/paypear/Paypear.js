import React, {Component} from 'react';
import {Tabs, Card, Form, Button, Checkbox} from 'antd';
import AddressForm from './AddressForm';
import PriceDropdown from './PriceDropdown';
import ShippingOptions from './ShippingOptions';
import { English, Espanol } from './translate';

import {Stripe} from './PaymentForm'


import './Paypear.css';
import 'antd/dist/antd.css';


const { TabPane } = Tabs;


export default class Paypear extends Component{

    addressForm = React.createRef();

    /**
     * Este objeto ira almacenando la informacion que se vaya recolectando de cada paso.
     * */
    info = {
        register: null,
        shipping: null,
        payment : null
    };

    /**
     *Creates an instance of Paypear.
     * @param {*} props
     * @memberof Paypear
     *
     * Inicializa ademas el tab inicial y el total actual con base a los productos indicaidos
     */
    constructor(props) {
        super(props);
        this.state= {
            width: (this.props.width === undefined)?'100%':'500px',
            activeKey: (this.props.user !== undefined)?"payform-tab-3":"payform-tab-1",
            total: this.updateTotal()
        };
    }


    // this.props.paymentHandledSubmit
    paymentHandledSubmit = (objectE) => {
        this.props.paymentHandledSubmit(objectE);
    }

    /**
     *
     *
     * @memberof Paypear
     * @function onAddressSubmit
     * @description Se ejecuta al llenar el formulario de direccion. Declara la direccion y pasa al siguiente paso, seleccion del envio
     *
     * @param addressValues
     * @description Los valores del formulario de direccion.
     */
    onAddressSubmit = (addressValues) => {
        this.info.addresss = addressValues;
        if  (this.props.onAddressSubmit !== undefined) this.props.onAddressSubmit(addressValues);
        this.setState({
            activeKey: (this.props.shippingOptions === undefined)?"payform-tab-3":"payform-tab-2",
            address: addressValues
        });
    };


    /**
     *
     *
     * @memberof Paypear
     * @function onShippingSubmit
     * @description se declara el metodo de envio seleccionado y se pasa al checkout, proceso de compra
     *
     */
    onShippingSubmit = (shippingValues) => {
        this.setState({activeKey: "payform-tab-3",});
        this.info.shipping = shippingValues;
    };


    /**
     *
     *
     * @param {*} buyList
     * @description Lista de compra
     *
     * @param {*} [shippingSelected=null]
     * @description Si hay un elemento de envio seleccionado, se envia

     * @returns subtotal: Subtotal, otenido de sumar la multiplicacion entre la cantidad y el costo de cada producto en la lista de la lista de compras
     * @memberof Paypear
     */
    getSubTotal(buyList,shippingSelected = null){
        let subtotal = 0;
        for (let x = 0; x < buyList.length; x++)
            subtotal = subtotal +  (((buyList[x].cost === undefined)?0:buyList[x].cost) *  buyList[x].quantity);
        return subtotal;
    }


    /**
     *
     *
     * @param {*} subtotal
     * @description Obtenido del metodo getSubTotal, resultado de la suma de productos de la lista de compras.
     *
     * @param {*} additionalCharges
     * @returns total: total obtenido.
     * @memberof Paypear
     */
    getAdditionalCharges(subtotal, additionalCharges){
        let total = 0;
        for (let x = 0; x < additionalCharges.length; x++) {
            let additionalCharge = additionalCharges[x];
            let charge = 0;

            if (additionalCharge.type == 'percentage')
                charge = subtotal * (additionalCharge.quantity / 100);
            else
                charge = additionalCharge.quantity;


            if (additionalCharge.operation == "+")
                total += charge;
            else
                total -= charge;
        }
        return total;
    }

    /**
     *
     *
     * @memberof Paypear
     * @function updateTotal
     * @description obtiene la cantidad total absoluta actual, con base a la lista de compras, los cargos adicionales y si hay un metodo de envio seleccionado.
     */
    updateTotal = (shippingOption) => {

        if (this.props.total !== undefined) return this.props.total;

        let newBuyList = Object.assign([], this.props.buyList);
        let newAdditionalCharges = Object.assign([], this.props.additionalCharges);
        let newShippingOptions = (this.props.shippingOptions !== undefined)?Object.assign([], this.props.shippingOptions):null;

        //Si hay un metodo de envio, se agrega como si fuese otro producto a la lista de productos.
        if (shippingOption !== undefined){
            this.info.shipping = shippingOption.target.value;
            let shippingSelectedOption = newShippingOptions[shippingOption.target.value];
            newBuyList.push({
                name: shippingSelectedOption.name,
                description: (shippingSelectedOption.description == undefined)?"Servicio de Envio":shippingSelectedOption.description,
                cost: shippingSelectedOption.cost,
                quantity: 1
            })
        }

        let subtotal = this.getSubTotal((newBuyList === undefined)?[]:newBuyList);
        let charges = this.getAdditionalCharges(subtotal,newAdditionalCharges);
        return (subtotal + charges);

    };

    /**
     *
     *
     * @memberof Paypear
     * @function updateShippingTotal
     * @description se actualizar el estado del total actual.
     *
     */
    updateShippingTotal = (element) => {
        this.setState({
            total: this.updateTotal(element)
        });
    };

    /**
     *
     *
     * @returns
     * @memberof Paypear
     *
     * @function render
     *
     * Se declara el tipo de lenguaje.
     */
    render(){

        let Languaje = null;
        switch (this.props.translate ) {
            case 'es':
                Languaje = Espanol;
                break;
            case 'en':
                Languaje = English;
                break;
            default:
                Languaje = Espanol;
                break;
        }

        return (
            <div className="Paypear">
                <Card id="payment-processor" size="small" extra={
                    <PriceDropdown total={parseFloat(this.state.total).toFixed(2)}/>
                } style={{ width:this.state.width }}>
                    <Tabs activeKey={this.state.activeKey} >
                        {
                            (this.props.user === undefined)?
                                <TabPane
                                    tab="INFORMACIÓN PERSONAL" key="payform-tab-1" disabled={true} style={{ color:"black!important" }}>
                                    <AddressForm
                                        ref={this.addressForm}
                                        onAddressFormSubmit={this.onAddressSubmit}
                                        // onSucess={this.onAddressSuccess}
                                        languaje={Languaje}
                                    />
                                </TabPane>
                                :null
                        }



                            {
                                (this.props.total === undefined && this.props.shippingOptions !== undefined)?
                                    <TabPane tab="MÉTODO DE ENVIO" key="payform-tab-2">
                                        <ShippingOptions
                                            //Arreglo con las opciones de envio
                                            shippingOptions={this.props.shippingOptions}

                                            //Accion que se ejecuta al seleccionar un metodo de envio y finzlizar
                                            onShippingSubmit={this.onShippingSubmit}

                                            //Accion cuando se cambia un metodo de envio
                                            onShippingChange={this.updateShippingTotal}
                                        />
                                    </TabPane>
                                :null
                            }

                        <TabPane tab="PAGO" key="payform-tab-3">
                            {
                                {
                                    'stripe':
                                        <Stripe
                                            languaje={Languaje}

                                            //Opciones de envio
                                            shippingOptions={this.props.shippingOptions}

                                            //Lista de productos a comprar
                                            buyList={this.props.buyList}

                                            //Indice del la opcion de envio seleccionada en la lista de envio
                                            indexSelectedShippingOptions={this.info.shipping}

                                            //Total
                                            paymentHandledSubmit={this.paymentHandledSubmit}

                                            //Lista Cargos adicinoales
                                            additionalCharges={this.props.additionalCharges}

                                            //Total
                                            total={this.state.total}

                                            //User
                                            user={(this.props.user !== undefined)?this.props.user:this.info.register}
                                        />,
                                    undefined: <p>Debe indicar un procesador de pago</p>
                                }[this.props.type]
                            }
                        </TabPane>
                    </Tabs>
                </Card>
            </div>
        );
    }
}

