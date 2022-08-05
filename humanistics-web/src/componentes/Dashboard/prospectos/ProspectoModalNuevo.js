import React, { Component } from "react";
import { Select, Row, Col, Modal, Checkbox, Spin, PageHeader, Tag, Form, Input, Button, DatePicker, Popconfirm, message } from 'antd';
import { MailOutlined, PhoneOutlined, PlusOutlined, CloseOutlined  } from '@ant-design/icons';
//css
import '../../../css/modals.css'
//componenres
import { CloseIcon } from "./../../Widgets/Iconos";
const axios = require('axios').default;
const { Option } = Select;
const { TextArea } = Input;


export default class ProspectoModal extends Component {

    constructor(props){
        super(props)
        this.state = {
            loading: false
        }
    }


    componentDidMount(){

    }

    /**
     *
     * @methodOf ProspectoModal
     *
     * @function onValuesChange
     * @description agrega un prospecto
     * */
    onValuesChange = (values) => {
        this.setState({ loading: true })
        
        var pr_id = (this.props.proyecto_id != undefined) ?  this.props.proyecto_id  :  sessionStorage.getItem('proyecto');
         
        axios.post('prospectos/add', {
            ...values,
            proyectos_id: pr_id
        }, {
            headers: { Authorization: sessionStorage.getItem('token') }
        }).then(response => {
            message.success('Prospecto agregado')
            this.closeModal();
        }).catch(error => {
            this.setState({ loading: false })
            message.error('Error al agregar el prospecto')                
        })

    }

    /**
     *
     * @methodOf ProspectoModal
     *
     * @function closeModal
     * @description Cierra el modal
     * */
    closeModal = () => {
        this.props.onCancel();
        this.setState({loading: false})
    }

    render() {
        return (
            <Modal
                visible={this.props.visible}
                className="modal-form modal-prospecto"
                title={null}
                footer={null}
                title={"Añadir Prospecto"} 
                closeIcon={<CloseIcon/>} 
                destroyOnClose={true}
                onCancel={this.closeModal}
            >
                <Row>
                    <Col xs={24} lg={24}>
                        <Form
                            layout={"vertical"}
                            style={{ width: "100%" }}
                            ref={this.form}
                            name='main-info'
                            onFinish={this.onValuesChange}
                            initialValues={{
                                estatus: (this.props.estatus != undefined) ? this.props.estatus[0] ? this.props.estatus[0]._id : '' : "",
                            }}
                        >

                        <Spin spinning={this.state.loading}>
                            <Row>
                                <Col xs={24} md={15}>
                                    <Form.Item
                                        className="form-item"
                                        name="nombre"
                                        rules={[{
                                            required: true,
                                            message: 'Por favor, ingrese el nombre del prospecto.'
                                        }]}
                                    >
                                        <Input placeholder="Nombre del prospecto" className="input-box" size="large" />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} md={9} className="center">
                                    <Form.Item
                                        name="estatus"
                                        className="estatus-select form-item"
                                        rules={[{ required: true }]}  
                                    >
                                        <Select
                                            key={'modal-status'}
                                            bordered={false}
                                            showArrow={false}                                                            
                                            className="select-element"
                                        >
                                            {this.props.estatus?.map(estatus => (
                                                <Option value={estatus._id}>
                                                    <Tag className="tag-estatus"  color={'#' + estatus.color} key={estatus.nombre}>
                                                        {estatus.nombre.toUpperCase()} {estatus.ponderacion}%
                                                    </Tag>
                                                </Option>))}
                                            </Select>
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row align="center">
                                <Col xs={23}>
                                    <Form.Item
                                        className="form-item"
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
                            <h3 className="label" >Información prospecto</h3>  
                            <Row align="center">
                                <Col xs={24} md={11}>
                                    <Form.Item
                                        className="form-item"
                                        name="email"
                                        rules={[{
                                            required: true,
                                            message: 'Por favor ingrsa tu  correo'
                                        }]}
                                    >
                                        <Input
                                            prefix={<MailOutlined />}
                                            placeholder="E-mail"
                                            className="input-box"
                                        />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} md={{span: 11, offset: 1}}>
                                    <Form.Item
                                        className="form-item"
                                        name="telefono"
                                        rules={[{
                                            required: true,
                                            message: 'Por favor ingresa tu teléfono'
                                        }]}
                                    >
                                        <Input
                                            name="telefono"
                                            prefix={<PhoneOutlined />}
                                            placeholder="Teléfono"
                                            className="input-box"
                                        />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={24} className="form-list">
                                   <Form.List name="pasos">
                                        {(fields, { add, remove }) => {
                                            return (
                                                <div>
                                                    <PageHeader
                                                        className="form-list-title"
                                                        ghost={false}
                                                        title="Recordatorios"
                                                        extra={[
                                                            <Button type="ghost" className="btn-add" onClick={() => add()}>
                                                                <PlusOutlined />
                                                            </Button>
                                                        ]}
                                                    />
                                                        {fields.map((field, index) => (
                                                            <Row>
                                                                <Col className="center" span={2}>
                                                                    <Form.Item
                                                                        name={[field.name, 'hecho']}
                                                                        valuePropName="checked"
                                                                        className="to-do-check"
                                                                    >
                                                                        <Checkbox
                                                                            className="checkbox-element"
                                                                            size="large"
                                                                        />
                                                                    </Form.Item>
                                                                </Col>
                                                                <Col className="center" span={11}>
                                                                    <Form.Item
                                                                        className="form-list-item"
                                                                        name={[field.name, 'nombre']}
                                                                        rules={[{
                                                                            required: true,
                                                                            message: "Debe ingresar el nombre"
                                                                        }]}   
                                                                    >
                                                                        <Input placeholder="Nombre" className="input-box"/>
                                                                    </Form.Item>
                                                                </Col>
                                                                <Col className="center" offset={1} span={7}>
                                                                    <Form.Item
                                                                        name={[field.name, 'fecha_hasta']}
                                                                        rules={[{ required: true }]}
                                                                        className="form-list-item"
                                                                    >
                                                                        <DatePicker
                                                                            placeholder="Fecha"
                                                                            className="input-box"
                                                                           
                                                                        />
                                                                    </Form.Item>
                                                                </Col>
                                                                <Col className="center" span={3} style={{'paddingBottom': '24px'}}>
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
                                                )
                                            }}
                                    </Form.List> 
                                </Col>
                            </Row>
                            <Row>
                                <Col span={24} className="center mt-1">
                                    <Button className="btn-modal-rojo"   onClick={()=>{this.props.onCancel()}}>
                                        Cancelar
                                    </Button>
                                    <Form.Item
                                        className="form-item-btn"
                                    >
                                    <Button htmlType="submit" type="primary" className="btn-modal-morado">
                                        Guardar
                                    </Button>
                                     </Form.Item>
                                </Col>
                            </Row>
                        </Spin>
                        </Form>
                    </Col>
                </Row>
            </Modal>
        );
    }

};


