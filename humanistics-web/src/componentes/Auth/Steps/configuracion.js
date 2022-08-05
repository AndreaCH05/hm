import React, { Component } from 'react'
import { Row, Col, Form, Input, Select, Tooltip, Button, AutoComplete, InputNumber, Spin, message, Typography } from 'antd';
import { InfoCircleOutlined, LeftOutlined, RightOutlined } from '@ant-design/icons';
import Axios from 'axios';

const { Option } = Select;
const axios = require("axios").default;

const FormItem = Form.Item;


const { Title, Paragraph, Text, } = Typography;

export default class Configuracion extends Component {
    constructor(props) {
        super(props)
        this.state = {
            spinning: true,

            valores_form: {},
            dataIndustrias: [],

            pr_nombre: '',
            pr_logo: '',
            pr_id: '',
        }
    }

    formRef = React.createRef();

    /**
  * @memberof Configuracion
  *
  * @method componentDidMount
  * @description 
  * Se carga la lista de industrias
  */
    componentDidMount() {

        axios({
            method: 'get',
            url: '/industrias',
            headers: { Authorization: sessionStorage.getItem('token') },
        })
            .then((response) => {
                this.setState({
                    spinning: false,
                    dataIndustrias: response.data.data
                });
            })

            .catch((error) => {
                this.setState({
                    spinning: false,

                });
                message.error("No se pudieron cargar industrias");
                console.log("error", error.response);
            })
    }


    /**
    * @memberof Configuracion
    *
    * @method componentDidUpdate
    * @description 
    * Se actualiza info de proyecto desde propiedad dataProject
    */
    componentDidUpdate = async () => {
        const { dataProject } = this.props;
        const pid = this.props;

        if (dataProject._id != undefined && (this.state.pr_id?.toString() !== dataProject?._id?.toString())) {
            this.setState({
                pr_id: pid.dataProject._id,
                pr_nombre: pid.dataProject.nombre,
                pr_logo: pid.dataProject.logo,
            });

            this.formRef.setFieldsValue({
                industria: dataProject.industria_id,
                descripcion: dataProject.descripcion_general,
                prospectos: dataProject.prospectos_deseados,
            })
        }
    }


    /**
   * @memberof Configuracion
   *
   * @method handleSubmit
   * @description 
   * Se establecen valores de form y se envia a metodo de edición de proyecto
   */
    handleSubmit = (values) => {
        this.setState({ valores_form: values });

        this.editarProyecto();
    }


    /**
    * @memberof Configuracion
    *
    * @method editarProyecto
    * @description 
    * Se  realiza la edición de proyecto campos industria_id, descripcion_general y prospectos_deseados
    */
    editarProyecto = async () => {
        axios({
            method: 'put',
            url: '/projects/update',
            headers: { Authorization: sessionStorage.getItem('token') },
            data: {
                id: this.state.pr_id,
                industria_id: this.state.valores_form.industria,
                descripcion_general: this.state.valores_form.descripcion,
                prospectos_deseados: this.state.valores_form.prospectos
            }
        })
            .then((response) => {
                message.success("Proyecto actualizado!");
                this.setState({
                    pr_id: response.data.proyecto._id
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
    * @memberof Configuracion
    *
    * @method ValidarNumeros
    * @description 
    * Se valida campo numérico
    */
    ValidarNumeros = () => {
        var prospectos = document.getElementById('prospectos'), valor;
        if (prospectos != undefined) {
            valor = prospectos.value.replace(/[^0-9]/g, '');
            valor = (valor == "") ? 0 : valor;
            valor = (parseInt(valor) < 1) ? 1 : parseInt(valor);
            prospectos.value = valor;
            try {
                this.formRef.current.setFieldsValue({
                    prospectos: valor
                });
            } catch (error) {
                console.log('error');
            }
        }
    }

    render() {
        let { pr_logo, pr_nombre } = this.state;

        return (
            <div className="pd-1 cnt-step">
                <Spin spinning={this.state.spinning} delay={1000}>
                    <Row className="">
                        <Col xs={24} className="center pd-2">
                            <div className="contenedor-logo">
                                {(this.state.pr_logo != '') ?
                                    <img src={axios.defaults.baseURL + 'upload/' + pr_logo}
                                        alt="avatar" style={{
                                            width: 'auto',
                                            height: '100%',
                                            borderRadius: '10px'
                                        }} id="logo-empresa" /> :
                                    <h2 className="up center">LOGO EMPRESA</h2>
                                }
                            </div>

                        </Col>
                        <Col xs={24} sm={24} md={24} lg={24} xl={24} className="center">
                            <h1 className="step-title">Configuración {pr_nombre}</h1>
                        </Col>

                        <Col xs={24} sm={24} md={24} lg={24} xl={24} className="center">
                            <Paragraph className="parragraph step-subtitle" style={{ fontSize: '1.2em' }}>
                                Cuentanos un poco mas acerca de tu negocio/ marca. Entre mas
                                preciso seas con tus respuestas, mejores resultados tendras!
                            </Paragraph>
                        </Col>

                    </Row>


                    <Row align="center">
                        <Col span={24}>
                            <Form layout={"vertical"} onFinish={this.handleSubmit} id="configForm" ref={e => this.formRef = e}  >
                                <Row justify="center">
                                    <Col offset={1} xs={23} >
                                        <h3 className="sub-title pd-1">Industria<span className="cmp-required">*</span> </h3>
                                        <Form.Item
                                            name="industria"

                                            rules={[{ required: true, message: 'Por favor ingresa tu Industria!' }]}
                                        >
                                            <Select placeholder="Seleccionar industria" className="input-box">
                                                {
                                                    this.state.dataIndustrias.map((item, index) => { return <Option value={item._id}> {item.nombre} </Option> })
                                                }
                                            </Select>
                                        </Form.Item>
                                    </Col>
                                </Row>
                                <Row justify="center">
                                    <Col offset={1} xs={23}>
                                        <h3 className="sub-title pd-1">Descripción General<span className="cmp-required">*</span> </h3>
                                        <Form.Item
                                            name="descripcion"
                                            label=""
                                            rules={[{ required: true, message: 'Por favor ingresa tu Descripcion General!' }]}
                                        >
                                            <Input.TextArea className="input-box" placeholder="Descripción" style={{ minHeight: "120px !important" }} />
                                        </Form.Item>
                                    </Col>
                                </Row>
                                <Row justify="center">
                                    <Col offset={1} xs={23} >
                                        <h3 className="sub-title pd-1">¿Cuantós prospectos clientes quieres al mes?<span className="cmp-required">*</span> </h3>
                                        <Form.Item
                                            name="prospectos"
                                            label=""
                                            rules={[{ required: true, message: 'Por favor selecciona una opción!' }]}
                                            type={InputNumber}
                                        >
                                            <AutoComplete
                                                style={{ width: '100%' }}
                                                placeholder="0"
                                                className="input-box"
                                                onBlur={this.ValidarNumeros}
                                                options={[{ value: '500' }, { value: '1000' }, { value: '2000' }, { value: '5000' }]}
                                            />
                                        </Form.Item>
                                    </Col>
                                </Row>

                                <Row style={{ padding: "15px 0px" }} >

                                    <Col offset={1} xs={23}>
                                        <Form.Item className="center">
                                            <Button
                                                type="primary"
                                                id="btn-negocioConf"
                                                className="btn btn-gral-morado nView"
                                                style={{ minWidth: '120px', padding: '5px', height: '40px', fontSize: '12pt' }}
                                                onClick={this.props.back}
                                            >
                                                <LeftOutlined />
                                                Atras</Button>

                                            <Button
                                                type="primary"

                                                onClick={e => this.formRef.submit()}
                                                className="btn-continue"
                                                style={{ marginTop: "5px" }}
                                            > AVANZAR
                                            </Button>
                                        </Form.Item>
                                    </Col>
                                </Row>

                            </Form>
                        </Col>
                    </Row>
                </Spin>
            </div>
        )
    }

}


