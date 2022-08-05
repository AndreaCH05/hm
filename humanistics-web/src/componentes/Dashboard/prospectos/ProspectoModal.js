import React, { Component } from "react";
import { Select, Row, Col, Modal, Avatar, Checkbox, Spin, PageHeader, Tag, Form, Input, Button, DatePicker, Popconfirm, Tooltip, message } from 'antd';
import { UserOutlined, MailOutlined, PhoneOutlined, PlusOutlined, SendOutlined, CloseOutlined, } from '@ant-design/icons';
import 'react-multi-carousel/lib/styles.css';
//componenres
import { CloseIcon } from "./../../Widgets/Iconos";
import SocketContext from '../../../Hooks/Socket';
//css
import '../../../css/modals.css'

import 'moment/locale/es';
const moment = require('moment');
moment.locale('es'); // aca ya esta en es


const axios = require('axios').default;
const { Option } = Select;
const { TextArea } = Input;


export default class ProspectoModal extends Component {

    prospectoForm = React.createRef();
    updateMessages = React.createRef();
    comment = React.createRef();
    static contextType = SocketContext;

    constructor(props) {
        super(props)
        this.state = {
            prospecto: {
                actividad: []
            },
            user_id: undefined,
            loading: false
        }

    }

    /**
     *
     * @methodOf ProspectoModal
     *
     * @function componentDidMount
     * @description
     * */
    componentDidMount() {
        axios.defaults.headers.common['Authorization'] = sessionStorage.getItem('token');
        //iniciamos una conexion con el servidor por medio de sockets
        this.context.emit('start', { token: sessionStorage.getItem('token') })
        this.context.removeListener('recived-msg-propspectos');
        this.context.removeListener('success');
        this.context.on('success', (data) => {
            this.setState({ user_id: data.user_id })
        })
        this.context.on('recived-msg-propspectos', (data) => {
            let prospecto = this.state.prospecto;
            prospecto.actividad.push({
                comment: true,
                entrada: data.msg,
                isUser: false,
                timestamp: new Date()
            });
            this.setState({
                prospecto: prospecto
            }, () => { this.scrollToBottom() })
        })
    }

    /**
     *
     * @methodOf ProspectoModal
     *
     * @function componentDidUpdate
     * @description Al ver el detalle de un  prospecto, busca el prospecto
     * */
    componentDidUpdate(prevProps) {
        if (this.props.prospecto !== undefined && this.props.prospecto !== prevProps.prospecto) {
            this.getProspecto(this.props.prospecto._id)
            this.context.emit('enter-prospecto', { prospecto_id: this.props.prospecto._id })
        }
    }



    /**
     *
     * @methodOf ProspectoModal
     *
     * @function hideModal
     * @description se ejecuta cuando se da en el botn de guardar
     * */
    hideModal = () => {
        this.props.onCancel()
        this.setState({ prospecto: { actividad: [] }, loading: false })
        this.context.emit('leave-prospecto', { prospecto_id: this.props.prospecto._id })
    }

    /**
     *
     * @methodOf ProspectoModal
     *
     * @function componentDidUpdate
     * @description se ejecuta cuando se da en el botn de guardar
     * */
    onFinish = (values) => {
        this.updateProspecto(values)
    }

    /**
     *
     * @methodOf ProspectoModal
     *
     * @function componentDidUpdate
     * @description se ejecuta cuando se da en el botn de guardar
     * */
    getProspecto = (prospecto_id) => {
        this.setState({ loading: true })
        axios.get('/prospectos/id', {
            params: {
                id: prospecto_id,
            }
        }).then(response => {
            this.prospectoForm.current.setFieldsValue({
                nombre: response.data.data.nombre,
                descripcion: response.data.data.descripcion,
                telefono: response.data.data.telefono,
                email: response.data.data.email,
                estatus: response.data.data.estatus._id,
                pasos: response.data.data.pasos.map(task => {
                    task.fecha_hasta = moment(task.fecha_hasta);
                    return task;
                })
            })
            this.setState({ prospecto: response.data.data, loading: false }, () => { this.scrollToBottom() })
        }).catch(error => {
            console.log(error);
            message.error('Error al Trae el Prospecto')
            this.setState({ loading: false })
        })

    }


    /**
     *
     * @methodOf ProspectoModal
     *
     * @function componentDidUpdate
     * @description se ejecuta cuando se da en el botn de guardar
     * */
    updateProspecto = (values) => {
        this.setState({ loading: true })
        axios.put('prospectos/update', {
            id: this.props.prospecto._id,
            ...values
        }).then(response => {
            message.success('Prospecto Actualizado')
            this.hideModal();
        }).catch(error => {
            console.log(error);
            message.error('Error al actualizar el Prospecto')
            this.setState({ loading: false })
        })

    }

    /**
     *
     * @methodOf ProspectoModal
     *
     * @function componentDidUpdate
     * @description se ejecuta cuando se da en el botn de guardar
     * */
    scrollToBottom = () => {
        if (this.updateMessages.current) {
            const scroll = this.updateMessages.current.scrollHeight - this.updateMessages.current.clientHeight;
            this.updateMessages.current.scrollTo(0, scroll);
        }
    }

    /**
     *
     * @methodOf ProspectoModal
     *
     * @function addUpdate
     * @description Añade nuevas actulizaciones a el arreglo de actividad del Prospecto
     * */
    addUpdate = (values) => {
        if (this.props.prospecto !== null && values.comment !== undefined) {

            this.context.emit('send-msg-prospecto', {
                prospecto_id: this.props.prospecto._id,
                msg: values.comment
            })

            let prospecto = this.state.prospecto;
            prospecto.actividad.push({
                comment: true,
                entrada: values.comment,
                isUser: true,
                timestamp: new Date()
            });

            this.setState({
                prospecto: prospecto
            }, () => { this.scrollToBottom() });
            this.comment.current.resetFields();


            axios.put('prospectos/update', {
                id: this.props.prospecto._id,
                ...values
            }).then(() => {
            })
                .catch(error => {
                    this.setState({ loading: false });
                    Modal.warning({
                        title: 'Ha ocurrido un error al enviar el mensaje',
                        content: 'No es posible guardar la informacion del prospecto. Contacte a soporte tecnico.',
                    })
                })
        }
    };


    render() {
        return (
            <Modal
                visible={this.props.visible}
                className="modal-form modal-prospecto modal-big" //mdl-prospecto 
                closeIcon={<CloseOutlined height={20} width={20} />}
                title={"Prospecto"}
                onCancel={this.hideModal}
                footer={false}
                closeIcon={<CloseIcon />}
                destroyOnClose={true}
            >
                <Row gutter={16}>
                    <Col xs={24} lg={12} className="gutter-row" >
                        <Form
                            layout={"vertical"}
                            ref={this.prospectoForm}
                            onFinish={this.onFinish}
                        >
                            <Spin className="spin" spinning={this.state.loading}>
                                <Row>
                                    <Col span={18}>
                                        <Form.Item
                                            name="nombre"
                                            rules={[{ required: true }]}
                                        >
                                            <Input
                                                placeholder="Nombre del prospecto"
                                                className="input-box"
                                            />
                                        </Form.Item>
                                    </Col>
                                    <Col span={6}>
                                        <Form.Item
                                            name="estatus"
                                            rules={[{ required: true }]}
                                            className="estatus-select"
                                        >
                                            <Select
                                                key={'modal-status'}
                                                bordered={false}
                                                showArrow={false}
                                                className="select-element"
                                                name="estatus"
                                            //onChange={e => this.onValuesChange({ estatus: e })}
                                            >
                                                {this.props.estatus?.map(estatus => (
                                                    <Option value={estatus._id}>
                                                        <Tooltip placement="topRight" title={`${estatus.nombre.toUpperCase()} ${estatus.ponderacion}%`}>
                                                            <Tag className="tag-estatus"
                                                                color={'#' + estatus.color}
                                                                key={estatus.nombre}>
                                                                {estatus.nombre.toUpperCase()} {estatus.ponderacion}%
                                                            </Tag>
                                                        </Tooltip>
                                                    </Option>))}
                                            </Select>
                                        </Form.Item>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                                        <Form.Item
                                            name="descripcion"
                                            label="Descripción"
                                            rules={[{
                                                required: true,
                                                message: 'Por favor ingresa tu Descripción'
                                            }]}
                                        >
                                            <Input.TextArea
                                                rows={6}
                                                style={{
                                                    minHeight: '7em',
                                                }}
                                                className="input-box"
                                            />
                                        </Form.Item>
                                    </Col>
                                </Row>
                                <h3 className="label">Información prospecto</h3>
                                <Row gutter={16}>
                                    <Col className="gutter-row" xs={24} sm={24} md={12}>
                                        <Form.Item
                                            name="email"
                                            rules={[{
                                                required: true,
                                                message: 'Por favor ingrsa un correo'
                                            }]}
                                        >
                                            <Input
                                                name="email"
                                                prefix={<MailOutlined />}
                                                placeholder="E-mail"
                                                className="input-box"
                                            //onBlur={this.updateContent}
                                            />
                                        </Form.Item>
                                    </Col>
                                    <Col className="gutter-row" xs={24} sm={24} md={12}>
                                        <Form.Item
                                            name="telefono"
                                            rules={[{
                                                required: true,
                                                message: 'Por favor ingresa un teléfono'
                                            }]}
                                        >
                                            <Input
                                                prefix={<PhoneOutlined />}
                                                placeholder="Teléfono"
                                                className="input-box"
                                            //onBlur={this.updateContent}
                                            />
                                        </Form.Item>
                                    </Col>
                                </Row>
                                <Row style={{ margin: "15px 0px" }}>
                                    <Col span={24} className="form-list">
                                        <Form.List name="pasos" >
                                            {(fields, { add, remove }) => {
                                                return (
                                                    <div>
                                                        <PageHeader
                                                            className="form-list-title"
                                                            ghost={false}
                                                            title="Recordatorios"
                                                            extra={[<Button type="ghost" className="btn-add" onClick={() => add()}>
                                                                <PlusOutlined />
                                                            </Button>]}
                                                        />
                                                        {fields.map(field => (
                                                            <Row className="form-list-body" gutter={16} key={field.key}>
                                                                <Col span={2} className="center">
                                                                    <Form.Item
                                                                        name={[field.name, 'hecho']}
                                                                        valuePropName="checked"
                                                                        className="to-do-check"
                                                                    >
                                                                        <Checkbox
                                                                            className="checkbox-element"
                                                                            size="large"
                                                                        //onBlur={this.updateTasks}
                                                                        />
                                                                    </Form.Item>
                                                                </Col>
                                                                <Col span={11} className="center gutter-row">
                                                                    <Form.Item
                                                                        className="form-list-item"
                                                                        name={[field.name, 'nombre']}
                                                                        rules={[{ required: true }]}
                                                                    >
                                                                        <Input
                                                                            placeholder="Recordatorio"
                                                                            className="input-box"
                                                                            style={{ margin: '3px' }}
                                                                        //onBlur={this.updateTasks}
                                                                        />
                                                                    </Form.Item>
                                                                </Col>
                                                                <Col span={8} className="center gutter-row">
                                                                    <Form.Item
                                                                        name={[field.name, 'fecha_hasta']}
                                                                        rules={[{ required: true }]}
                                                                        className="form-list-item"
                                                                    >
                                                                        <DatePicker
                                                                            placeholder="Fecha"
                                                                            className="input-box"
                                                                        //onBlur={this.updateTasks}
                                                                        />
                                                                    </Form.Item>
                                                                </Col>
                                                                <Col className="center" span={3}>
                                                                    <Popconfirm
                                                                        title="¿Eliminar este recordatorio?"
                                                                        okText="Si, seguro"
                                                                        cancelText="No"
                                                                        onConfirm={() => remove(field.name)}
                                                                    >
                                                                        <Button
                                                                            danger
                                                                            shape="circle"
                                                                            className="delete-to-do"
                                                                            size="small"
                                                                            onClick={e => e.stopPropagation()}
                                                                        >
                                                                            <CloseOutlined />
                                                                        </Button>
                                                                    </Popconfirm>

                                                                </Col>
                                                            </Row>
                                                        ))}
                                                    </div>
                                                );
                                            }}
                                        </Form.List>
                                    </Col>
                                </Row>
                            </Spin>
                        </Form>
                    </Col>
                    <Col xs={24} lg={12} className="gutter-row col-updates" style={{ borderLeft: 'solid 5px #f0f0f0' }}>
                        <h1 className="titulo-chat">Actualizaciones</h1>
                        <div className="updates-box">
                            <div className="updates-messages" ref={this.updateMessages}>
                                {
                                    this.state.prospecto.actividad.map((actividad, index) => {
                                
                                        if (actividad.comment) {
                                            if (actividad.isUser || actividad.usuario === this.state.user_id) return (
                                                <Row className="col-mensaje">

                                                    <Col span={24} style={{ textAlign: "right", float: "right" }}>
                                                        <strong>{actividad.usuario.nombre + "   "}</strong>
                                                        <label style={{ color: "#666" }}>
                                                            {(moment(actividad.timestamp).format('LLLL'))}
                                                        </label>
                                                    </Col>


                                                    <Col span={21}>
                                                        <div className="contenedor-mensaje contenedor-shadow">
                                                            {actividad.entrada}
                                                        </div>

                                                    </Col>
                                                    <Col span={3} className="center">
                                                        <Avatar shape="square" size="large" icon={<UserOutlined />} />
                                                    </Col>
                                                </Row>
                                            );

                                            else return (
                                                <Row className="col-respuesta">


                                                    <Col span={24} style={{ textAlign: "left", float: "left" }}>
                                                        <strong>{actividad.usuario.nombre + "   "}</strong>
                                                        <label style={{ color: "#666" }}>
                                                            {(moment(actividad.timestamp).format('LLLL'))}
                                                        </label>
                                                    </Col>

                                                    <Col span={3} className="center">
                                                        <Avatar shape="square" size="large" icon={<UserOutlined />} />
                                                    </Col>
                                                    <Col span={21}>
                                                        <div className="contenedor-mensaje contenedor-shadow">
                                                            {actividad.entrada}
                                                        </div>
                                                    </Col>
                                                </Row>
                                            );


                                        }
                                        return (
                                            <Row className="col-historial" style={{ borderTop: '1px solid rgba(0,0,0,0.06)' }}>

                                                <Col span={24}>
                                                    {actividad.entrada}<br />
                                                    <strong>{(moment(actividad.timestamp).format('LLLL'))}</strong>
                                                </Col>

                                            </Row>
                                        );
                                    })
                                }
                            </div>
                            <div className="updates-actions">
                                <Form
                                    ref={this.comment}
                                    onFinish={this.addUpdate}
                                >
                                    <Row>
                                        <Col span={21}>
                                            <Form.Item
                                                name="comment"
                                                className="update-text"
                                            >
                                                <Input className="input-box" />
                                            </Form.Item>
                                        </Col>
                                        <Col span={3}>
                                            <Form.Item className="center">
                                                <Button className="btn-update" type="primary" htmlType="submit">
                                                    <SendOutlined />
                                                </Button>
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                </Form>
                            </div>
                        </div>
                    </Col>
                </Row>
                <Row>
                    <Col span={24} className="center mt-1">
                        <Button className="btn-modal-rojo" onClick={() => { this.hideModal() }}>
                            Cancelar
                        </Button>
                        <Button htmlType="submit" type="primary" className="btn-modal-morado" onClick={() => { this.prospectoForm.current.submit() }}>
                            Guardar
                        </Button>
                    </Col>
                </Row>
            </Modal>
        );
    }

};

