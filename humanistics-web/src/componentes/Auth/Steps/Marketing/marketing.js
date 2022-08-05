import React, { Component } from 'react'
import { Row, Col, Form, Input, Select, Tooltip, Button, Avatar, Badge, Spin, message, Typography } from 'antd';
import { InfoCircleOutlined, LeftOutlined, } from '@ant-design/icons';
import { FaFacebook } from 'react-icons/fa';
import '../../../../css/Steps/marketing.css';


import ModalSelectFacebookPage from './ModalSelectFacebookPage';


const { Option } = Select;
const axios = require("axios").default;

const FormItem = Form.Item;

const { FB } = window;

const { Title, Paragraph, Text, } = Typography;

export default class Marketing extends Component {
    constructor(props) {
        super(props)
        this.state = {
            spinning: true,
            valores_form: {},

            pr_nombre: '',
            pr_logo: '',
            pr_id: '',

            visibleFacebookPages: false,


            facebookPage: null
        }
    }


    formRef = React.createRef();


    /**
    * @memberof Marketing
    *
    * @method componentDidMount
    * @description 
    * Se desactiva spinner
    */
    componentDidMount() {
        axios.defaults.headers.common['Authorization'] = sessionStorage.getItem('token');
        this.setState({
            spinning: false,
        });
    }


    /**
    * @memberof Marketing
    *
    * @method componentDidUpdate
    * @description 
    * Se actualiza info de proyecto desde propiedad dataProject
    */
    componentDidUpdate = async () => {
        const pid = this.props;
        if (pid.dataProject._id != undefined && (this.state.pr_id != pid.dataProject._id || this.state.pr_nombre != pid.dataProject.nombre || this.state.pr_logo != pid.dataProject.logo)) {
            this.setState({
                pr_id: pid.dataProject._id,
                pr_nombre: pid.dataProject.nombre,
                pr_logo: pid.dataProject.logo,
            });
            this.formRef.setFieldsValue({
                paginaWeb: pid.dataProject.pagina_web,
                paginaFacebook: pid.dataProject.facebook,
                perfilInstagram: pid.dataProject.instagram
            })


            this.getCurrentPage();
        }
    }


    /**
     *
     *
     * @memberof Marketing
     * @method getCurrentPage
     * 
     * @description Obtenemos la página del proyecto actual en caso de que haya.
     */
    getCurrentPage = () => {
        axios.get('/facebook/page', {
            params: {
                proyectos_id: this.props?.dataProject?._id
            }
        })
            .then(({ data }) => {
                this.setState({ facebookPage: data.data })
            })
            .catch(error => {
                message.error("No es posible obtener la página de facebook actual.")
            })

        // .get('/facebook/page',TokenVerifier, FacebookController.getFacebookPageByProject)
        // /facebook/page



    }


    /**
   * @memberof Marketing
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
    * @memberof Marketing
    *
    * @method editarProyecto
    * @description 
    * Se  realiza la edición de proyecto campos paginaWeb, facebook y instagram
    */
    editarProyecto = async () => {
        axios({
            method: 'put',
            url: '/projects/update',
            headers: { Authorization: sessionStorage.getItem('token') },
            data: {
                id: this.state.pr_id,

                pagina_web: this.state.valores_form.paginaWeb,
                facebook: this.state.valores_form.paginaFacebook,
                instagram: this.state.valores_form.perfilInstagram,
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
                message.error("Error.");
                console.log("error  ", error.response);
            })
    }



    /**
     *
     *
     * @memberof Marketing
     * @method connectFacebookPages
     * 
     * @description Obtenemos las páginas de facebook. Las ponemos en el modal.
     * 
     */
    connectFacebookPages = () => {
        FB.login(response => {
            switch (response.status) {
                case 'connected':
                    axios.post('/facebook/pages', {
                        response: response.authResponse
                    })
                        .then(response => {

                            this.setState({ visibleFacebookPages: true })
                        })
                        .catch(error => {
                            message.error("No es posible obtener las páginas de Facebook.")
                        })
                    break;
                default:
                    this.setState({ statusLoading: 0 })
                    break;
            }
        }, { scope: 'pages_show_list,pages_manage_metadata,pages_manage_ads,leads_retrieval' });
    }
    
    /**
     *
     *
     * @param {*} facebookPage
     * @memberof Marketing
     * 
     * @method setFacebookPage
     * @description Declaramos una pagina de facebook en el formulario y la actualizamos en el servidor. 
     */
    setFacebookPage = facebookPage => {
        this.setState({ spinning: true })
        this.formRef.setFieldsValue({
            paginaFacebook: 'https://www.facebook.com/' + facebookPage.id
        })
        axios.post('/facebook/proyectos/page', {
            facebookpage_id: facebookPage._id,
            proyecto_id: this.state.pr_id
        })
            .then(({ data }) => this.setState({ facebookPage: data.data }))
            .finally(e => this.setState({ spinning: false, visibleFacebookPages: false }))

    }


    render() {
        let pr_logo = this.state.pr_logo
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
                            <h1 className="step-title">Configuración {this.state.pr_nombre}</h1>
                        </Col>

                        <Col xs={24} sm={24} md={24} lg={24} xl={24} className="center">
                            <Paragraph className="parragraph step-subtitle">
                                Cuentanos un poco mas acerca de tus redes sociales
                    </Paragraph>
                        </Col>

                    </Row>

                    <Row align="center">
                        <Col span={24}>
                            <Form layout={"vertical"} onFinish={this.handleSubmit} id="marketingForm" ref={e => this.formRef = e}  >
                                <Row justify="center">
                                    <Col offset={1} xs={23} >
                                        <Form.Item
                                            name="paginaWeb"
                                            label={<h3 className="sub-title pd-1">Pagina Web <Tooltip title="Página web de la empresa">
                                                <InfoCircleOutlined style={{ marginLeft: "5px", color: '#492AF9' }} />
                                            </Tooltip> </h3>}
                                        >
                                            <Input className="input-box" placeholder="Página Web" />
                                        </Form.Item>
                                    </Col>
                                </Row>
                                <Row justify="center">
                                    <Col offset={1} xs={23}>

                                        <Form.Item
                                            name="paginaFacebook"
                                            label={<h3 className="sub-title pd-1">Página de Facebook <Tooltip title="Página de Facebook de la empresa">
                                                <InfoCircleOutlined style={{ marginLeft: "5px", color: '#492AF9' }} />
                                            </Tooltip> </h3>}
                                        >
                                            <Input className="input-box" placeholder="Página Facebook" suffix={
                                                (!(this.state.facebookPage) || this.state.facebookPage == null) ?
                                                    <a
                                                        className="connect-facebook-page"
                                                        onClick={() => this.connectFacebookPages()}>
                                                        <FaFacebook size={30} className="connect-facebook-page-icon" />
                                                        <span className="connect-facebook-page-divider" />
                                                        <span className="connect-facebook-page-text">Conectar con Página de Facebook</span>
                                                    </a>
                                                    :
                                                    <a
                                                        className="connect-facebook-page"
                                                        onClick={() => this.connectFacebookPages()}>
                                                        <FaFacebook size={15} className="connect-facebook-page-icon selected" />
                                                        <Avatar className="connect-facebook-page-avatar selected" src={axios.defaults.baseURL + 'upload/' + this.state.facebookPage.avatar} />
                                                        <span className="connect-facebook-page-text selected">{this.state.facebookPage.name}</span>
                                                    </a>

                                            } />
                                        </Form.Item>

                                    </Col>

                                </Row>
                                <Row justify="center">
                                    <Col offset={1} xs={23} >
                                        <Form.Item
                                            name="instagram"
                                            label={<h3 className="sub-title pd-1">Perfil de Instagram<Tooltip title="Perfil de Instagram de la empresa">
                                                <InfoCircleOutlined style={{ marginLeft: "5px", color: '#492AF9' }} />
                                            </Tooltip> </h3>}
                                        >
                                            <Input className="input-box" placeholder="Perfil Instagram" />
                                        </Form.Item>
                                    </Col>
                                </Row>

                                <Row style={{ padding: "15px 0px" }} >

                                    <Col offset={1} xs={23}>
                                        <Form.Item className="center">
                                            <Button
                                                type="primary"
                                                onClick={e => this.formRef.submit()}

                                                className="btn-continue"
                                                style={{ marginTop: "5px" }}
                                            >Avanzar
                                            </Button>
                                        </Form.Item>
                                    </Col>
                                </Row>
                            </Form>
                        </Col>
                    </Row>
                </Spin>
                <ModalSelectFacebookPage
                    title="Selecciona tu Página de Facebook"
                    visible={this.state.visibleFacebookPages}
                    onCancel={() => this.setState({ visibleFacebookPages: false })}

                    setFacebookPage={this.setFacebookPage}
                />
            </div>
        )
    }

}

