import React, { Component } from 'react'
import { Avatar as ImageAvatar, Modal, Row, Col, Form, Input, Button, Steps, message, Select, Upload, Spin, Typography } from 'antd';
import { PlusOutlined, UserOutlined, LeftOutlined, LoadingOutlined, RightOutlined } from '@ant-design/icons';

import Texty from 'rc-texty';
import Animate from 'rc-animate';
import { Redirect } from 'react-router-dom'

//Redirect


import { CirclePicker } from "react-color";

import ModalListaProyecto from "./ModalListaProyecto";

import '../../../../css/Steps/Avatar.css';


const axios = require("axios").default;

const { Title, Paragraph, Text, } = Typography;

function beforeUpload(file) {
    try {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
            message.error('You can only upload JPG/PNG file!');
        }
        return isJpgOrPng;
    } catch (error) {
        console.log(error)

    }
}
export default class Negocio extends Component {

    constructor(props) {
        super(props);
        const pid = this.props.nuevoProyecto;

        this.state = {
            fileList: [],
            loading: false,
            nuevoProyecto: true,
            guardar: true,
            spinning: false,
            valores_form: {},
            proyecto_id: "",





            modalProyectos: false,
            modalProyectosAbierto: false
        }
    }


    componentDidUpdate() {
        if (this.state.modalProyectosAbierto == false && this.props.selected == 2) {
            this.state.modalProyectosAbierto = true
            this.getProyectosList()
        }
    }


    getProyectosList = () => {
        this.setState({ spinning: true })
        axios.get('/projects')
            .then(({ data }) => {
                if (data.data.itemCount > 0) {
                    setTimeout(() => {
                        this.setState({ modalProyectos: true, spinning: false })
                    }, 600)
                }


            })
            .catch(e => console.log('ee', e))
            .finally(e => setTimeout(() => {
                this.setState({ spinning: false })
            }, 600))
    }


    /**
   * @memberof Negocio
   *
   * @method handleSubmit 
   * @description 
   *  Se establecen valores de form y se envia a metodo de edición de proyecto
   */
    handleSubmit = (values) => {

        this.setState({ valores_form: values });

        if (this.state.guardar && (this.state.proyecto_id == "" || this.state.proyecto_id == null || this.state.proyecto_id == undefined)) {
            this.guardarProyecto();
        }
        else {
            this.editarProyecto();
        }
    };

    /**
     * @memberof Negocio
     *
     * @method guardarProyecto
     * @description 
     * Se  guarda nuevo proyecto campos nombre, producto_servicio y logo
     */
    guardarProyecto = async () => {
        axios({
            method: 'post',
            url: '/projects/add',
            headers: { Authorization: sessionStorage.getItem('token') },
            data: {
                activo: true,
                nombre: this.state.valores_form.name_empresa,
                producto_servicio: this.state.valores_form.name_proyecto,
                logo: this.state.image,
            }
        })
            .then((response) => {
                message.success("Proyecto creado!");
                this.setState({
                    guardar: false,
                    proyecto_id: response.data.proyecto._id
                });

                this.props.setProjectInfo(response.data.proyecto);
                this.props.onNext();

            })
            .catch((error) => {
                this.setState({ loading: false })
                console.log("error  ", error.response);
                message.error("Error.");
            })
    }


    /**
    * @memberof Negocio
    *
    * @method editarProyecto
    * @description 
    * Se  realiza la edición de proyecto campos nombre, producto_servicio y logo
    */
    editarProyecto = async () => {

        axios({
            method: 'put',
            url: '/projects/update',
            headers: { Authorization: sessionStorage.getItem('token') },
            data: {
                id: this.state.proyecto_id,
                nombre: this.state.valores_form.name_empresa,
                producto_servicio: this.state.valores_form.name_proyecto,
                logo: this.state.image,
            }
        })
            .then((response) => {
                message.success("Proyecto actualizado!");

                this.setState({
                    guardar: false,
                    proyecto_id: response.data.proyecto._id
                });

                this.props.setProjectInfo(response.data.proyecto);
                this.props.onNext();
            })

            .catch((error) => {
                this.setState({ loading: false })
                console.log("error  ", error.response);
                message.error("Error.");
            })
    }



    /**
    * @memberof Negocio
    *
    * @method handleChange
    * @description 
    * Se modifica el logo con archivo seleccionado
    */
    handleChange = info => {

        try {
            this.setState({ loading: true });

            if (info.file.status === 'uploading') {
                this.setState({
                    loading: true,
                    guardar: true,
                    spinning: true
                });
                return;
            }
            if (info.file.status === 'done') {
                this.setState({
                    image: info.file.response.filename,
                    loading: false,
                    spinning: false

                });
            }
        } catch (error) {

        }
    };


    setProyecto = async  (_id) => {
        if (_id !== null)
            await axios.post('/projects/id', {
                id: _id
            })
                .then(({ data }) => {
                    this.props.setProjectInfo(data.data);
                    this.setState({
                        fileList: [data.data.logo],
                        image: data.data.logo,
                        modalProyectos: false,
                        proyecto_id: data.data._id,
                    })
                    this.formNegocio.setFieldsValue({

                        name_empresa: data.data.nombre,
                        name_proyecto: data.data.producto_servicio,
                    })
                })

                .catch(error => {
                    message.error("No fue posible cargar el proyecto.")
                })

        else this.setState({
            modalProyectos: false,
            proyecto_id: null
        })
    }



    render() {

        const uploadButton = (
            <div>
                {this.state.loading ? <LoadingOutlined /> : <PlusOutlined />}
                <div className="ant-upload-text">Upload</div>
            </div>
        );
        const { imageUrl } = this.state;
        const { image } = this.state;

        let btnAtras = (this.state.nuevoProyecto) ?
            <Button type="primary"
                id="btn-negocioForm"
                htmlType="submit"
                className="btn btn-gral-morado nView"
                style={{
                    marginTop: "15px"
                }}
                onClick={this.props.back}> <LeftOutlined /> Atras</Button> : ''

        return (
            <div className="pd-3">
                <Spin spinning={this.state.spinning} delay={1000}>
                    <Row className="" >
                        <Col xs={24} sm={24} md={24} lg={24} xl={24} className="center">
                            <Title className="title center stepTitle" >Negocio </Title>
                        </Col>
                    </Row>

                    <Row>
                        <Col span={22} offset={1}>
                            <div className="">
                                <Form onFinish={this.handleSubmit} id="negocioForm" ref={e => this.formNegocio = e} layout={"vertical"} >
                                    <h3 className="sub-title  pd-1">¿Cómo se llama tu negocio, Marca o Empresa? </h3>
                                    <Form.Item name="name_empresa" rules={[{
                                        required: true,
                                        message: 'Por favor ingresa nombre de tu Empresa o Negocio'
                                    }]}>
                                        <Input placeholder="Nombre" className="input-box w100" />
                                    </Form.Item>
                                    <h3 className="sub-title  pd-1">Logo de tu Negocio, Marca o Empresa</h3>

                                    <Form.Item
                                        name="file"
                                        defaultFileList={this.state.fileList}
                                        initialValue={this.state.fileList}
                                        align="left"
                                        style={{ width: "150px" }}
                                    >
                                        <Upload
                                            name="file"
                                            listType="picture-card"
                                            className="avatar-uploader w100"
                                            showUploadList={false}
                                            action={axios.defaults.baseURL + 'upload/add'}
                                            beforeUpload={beforeUpload}
                                            onChange={this.handleChange}
                                            TextArea="Seleccionar"
                                            style={{ marginLeft: "0px" }}

                                        >
                                            {image ?
                                                <img src={axios.defaults.baseURL + 'upload/' + image} alt="avatar"
                                                    style={{ width: '100%' }} /> :
                                                <div>
                                                    {this.state.loading ? <PlusOutlined /> : <PlusOutlined />}
                                                    <div className="ant-upload-text">Seleccionar</div>
                                                </div>
                                            }
                                        </Upload>


                                    </Form.Item>
                                    <h3 className="sub-title  pd-1">¿Qué tipo de productos - servicios vendes?  </h3>
                             
                                    <Form.Item name="name_proyecto" rules={[{
                                        required: true,
                                        message: "Por favor ingresa el tipo de productos o servicios.",
                                    }]}>
                                        <Input.TextArea className="input-box" row={6} placeholder="Descripción" style={{ minHeight: "120px" }} />
                                    </Form.Item>


                                        <Row align="left" style={{ padding: "25px 0px" }}>
                                        {btnAtras}  
                                        <Form.Item>
                                            <Button type="primary"
                                                //onClick = {this.handleSubmit}
                                                id="btn-proyectoForm"
                                                onClick={() => {

                                                    this.formNegocio.submit()

                                                }}
                                                // htmlType="submit"
                                                className="btn-continue"
                                                style={{
                                                    marginTop: "15px",
                                                    margin: '0 auto', display: 'block'
                                                }}
                                            >AVANZAR
                                            </Button>
                                        </Form.Item>
                                    </Row>
                                </Form>
                            </div>
                        </Col>
                    </Row>



                    <Button
                        id="btn-negocioNext"
                        className="btn btn-gral-morado nView"
                        size="large"
                        type="submit"
                        onClick={this.props.onSubmitGeneral}
                    >Avanzar <RightOutlined />
                    </Button> 
                </Spin>


                <ModalListaProyecto
                    visible={this.state.modalProyectos}
                    hideModal={() => this.setState({ modalProyectos: false })}
                    setProyecto={this.setProyecto}
                />
            </div>
        )
    }
}

