import React, { Component, useState, FC } from 'react'
import { Link } from 'react-router-dom'
import {
    Row,
    Col,
    Form,
    Input,
    Button,
    InputNumber,
    Tabs,
    Modal,
    Typography,
    Divider,
    Avatar,
    Space,
    Card,
    Popover,
    Empty,
    message,
    Select,
    Spin,
    Checkbox,
    Radio
} from 'antd';
import {
    LeftOutlined,
    RightOutlined,
    PlusOutlined,
    MinusOutlined,
    LoadingOutlined,
    UserOutlined,
    MinusCircleOutlined,
    DeleteOutlined
} from '@ant-design/icons';

import reactCSS from 'reactcss'
import { CirclePicker, TwitterPicker } from "react-color";


import { ReactSortable } from "react-sortablejs";
import { CloseIcon } from "../../../Widgets/Iconos";

import { BsThreeDotsVertical } from 'react-icons/bs'
import "../../../../css/Steps/Estatus.css"
const axios = require("axios").default;
const { Title, Paragraph, Text, } = Typography;
const { Option } = Select;



class ModalAutomatizacionForm extends React.Component {


    constructor(props) {
        super(props)

        this.state = {
            usuarios: [],
            forms_ids: [],
            // campaigns_ids: [],


            add_account_id: null,
            usuariosDisabled: false
        }
    }

    componentDidMount() {
        this.getUsers()
        this.getForms()

        if (this.props.modalAutomatizacionId)
            this.getAutomatizacion()

    }

    getAutomatizacion = (id = this.props.modalAutomatizacionId) => {
        axios.get('/automatizaciones/id', {
            params: { id }
        })
            .then(({ data }) => {
                console.log('data', data);
                this.setState({ accion: data.data.accion })
                this.formModal.current.setFieldsValue(data.data)
            })
            .catch(() => {
                message.error("No es posible obtener la automatización.")
            })
    }

    getUsers = () => {
        axios.post('/usuarios', {
            paginate: false,
            proyecto_id: sessionStorage.getItem("proyecto"),
        })
            .then(({ data }) => {
                this.setState({ usuarios: data.data })
                console.log('A X S D data', data);
            })
            .catch(() => {
                message.error("No es posible obtener los usuarios.")
            })
    }


    // getAddAccounts = () => {
    //     axios.post('facebook/adaccounts', {})
    //         .then(({ data }) => {
    //             this.setState({ add_accounts_ids: data.adaccounts.data })
    //         })
    //         .catch(() => {
    //             message.error("No es posible las obtener las cuentas publicitarias.")
    //         })
    // }


    // getCampaigns = ({ add_account_id = this.state.add_account_id } = {}) => {
    //     this.setState({ add_account_id })
    //     axios.post('facebook/campaigns', {
    //         add_account_id
    //     })
    //         .then(({ data }) => {
    //             this.setState({ campaigns_ids: data.data })
    //         })
    //         .catch(() => {
    //             message.error("No es posible las obtener las campañas.")
    //         })
    // }


    getForms = () => {
        axios.post('facebook/forms', {
            proyecto_id: sessionStorage.getItem("proyecto"),
        })
            .then(({ data }) => {
                this.setState({ forms_ids: data.data })
            })
            .catch(() => {
                message.error("No es posible las obtener las campañas.")
            })
    }


    onValuesChange = () => {
        const values = this.formModal.current.getFieldsValue()

        if (values.todos_usuarios == undefined || typeof values.todos_usuarios == "boolean")
            this.setState({ usuariosDisabled: (typeof values.todos_usuarios == "boolean") ? values.todos_usuarios : false })
    }


    handleSubmit = (values) => {


        if (this.props.modalAutomatizacionId)
            return axios.put('automatizaciones/update', {
                ...values,
                proyecto_id: sessionStorage.getItem("proyecto"),
                id: this.props.modalAutomatizacionId,
            })
                .then(({ data }) => {
                    message.success("Automatización Actualizada")
                    this.props.onOk()
                })
                .catch(() => {
                    message.error("No es posible las obtener las campañas.")
                })

        axios.post('automatizaciones/add', {

            ...values,
            proyecto_id: sessionStorage.getItem("proyecto"),
        })
            .then(({ data }) => {
                message.success("Automatización Guardada")
                this.props.onOk()
            })
            .catch(() => {
                message.error("No es posible las obtener las campañas.")
            })

    }

    formModal = React.createRef()

    render() {

        return <div className="div-contenedor FormAutomatizacion" >
            <Form
                ref={this.formModal}
                onFinish={this.handleSubmit}

                onValuesChange={this.onValuesChange}
                layout={"vertical"}
            >

                <Form.Item name="nombre" label="Nombre" rules={[{ required: true, message: 'Por favor ingresa nombre' }]}>
                    <Input placeholder="Nombre" className="input-box" />
                </Form.Item>

                <Form.Item name="accion" label="Acción" rules={[{ required: true, message: 'Por favor selecciona accion' }]}>
                    <Select
                        placeholder="Selecciona acción"
                        className="input-box"
                        style={{ float: 'right', width: '100%', marginTop: '15px' }}
                        onSelect={(accion) => this.setState({ accion })}
                    >
                        <Option value={1}>Notificar</Option>
                        <Option value={2}>Asignar nuevo Lead Automatico</Option>
                    </Select>
                </Form.Item >
                {/* <Spin > */}


                {(this.state.accion === 1) ?
                    <Form.Item name="automatizacion" label="Automatización" rules={[{ required: true, message: 'Por favor definir automatizacion' }]}>
                        <Select placeholder="Selecciona acción" className="input-box" style={{ float: 'right', width: '100%', marginTop: '15px' }} >
                            <Option value={1}>Nuevo Lead</Option>
                            <Option value={2}>Cambio de Estatus</Option>
                            <Option value={3}>Venta Confirmada</Option>
                        </Select>
                    </Form.Item> : null}




                <Form.Item
                    className="form-item-user"
                    name="notificar_a"
                    label={[
                        "Personas",
                        <br />,
                        (this.state.accion === 2) ? <Form.Item
                            name="all_users"
                            style={{ textAlign: "start" }}
                            valuePropName="checked"
                        >
                            <Checkbox>Todos los usuarios</Checkbox>
                        </Form.Item> : null


                    ]}
                    rules={[
                        ({ getFieldValue }) => ({
                            validator: (_, value) => {
                                if (Array.isArray(value) && value.length === 0) {
                                    return Promise.reject(new Error('Debe ingesar los usuarios que desea incluir en la automatización.'))
                                }
                                return Promise.resolve()
                            },
                        }),
                    ]}
                    extra={
                        (this.state.accion === 2) ? <Form.Item
                            name="tipo_seleccion"
                            style={{ textAlign: "start" }}
                        // valuePropName="checked"
                        >
                            <Radio.Group
                            // onChange={onChange} value={value}
                            >
                                <Radio value={1}>Aleatorio</Radio>
                                <Radio value={2}>Uno a Uno</Radio>
                            </Radio.Group>
                            {/* <Checkbox>Aleatorio</Checkbox> */}
                        </Form.Item> : null
                    }
                >
                    <Select
                        disabled={this.state.usuariosDisabled && this.state.accion === 2}
                        mode="multiple"
                        placeholder="Selecciona acción"
                        className="input-box"
                        style={{ float: 'right', width: '100%', marginTop: '15px' }}>
                        {this.state.usuarios.map(usuario => <Option key={usuario.id} value={usuario._id}>{usuario.nombre}</Option>)}
                    </Select>
                </Form.Item>

                <Form.Item
                    name="fb_form_id"
                    label="Cuentas Publicitarias de Facebook"
                    rules={[{
                        required: true,
                        message: 'Por favor definir personas'
                    }]}
                    extra={
                        <Form.Item
                            name="leads_previos"
                            style={{ textAlign: "start" }}
                            valuePropName="checked"
                        >
                            <Checkbox>Cargar todos los leads previos de este formulario.</Checkbox>
                        </Form.Item>
                    }>
                    <Select
                        placeholder="Selecciona acción"
                        className="input-box"
                        style={{ float: 'right', width: '100%', marginTop: '15px' }}
                    >
                        {
                            (this.state.forms_ids.length > 0) ?
                                this.state.forms_ids.map(account => <Option value={account.id} key={account.id}>{account.name} </Option>)
                                :
                                <Option disabled>Esta cuenta de facebook no tiene cuentas de publicidad.</Option>
                        }
                    </Select>
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit" className="btn btn-primary" >Guardar</Button>
                </Form.Item>

            </Form>
        </div>

    }




}





export default function (props) {

    return <Modal
        className="modal-form modal-estatus"
        title="Estatus"
        visible={props.visible}
        onCancel={props.onCancel}
        destroyOnClose={true}
        footer={null}
        closeIcon={<CloseIcon />}
    >

        <ModalAutomatizacionForm {...props} />



    </Modal>


}


