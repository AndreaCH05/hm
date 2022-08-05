import React, { Component } from "react";
import { Table, Layout, Select, Row, Col, Spin, Card, Button, Modal, Skeleton, Space, Switch, message, Typography, List, Avatar } from 'antd';

import { FaPowerOff } from 'react-icons/fa';

import { ExclamationCircleOutlined } from '@ant-design/icons';

import '../../../../css/anuncios/paginas.css';


import ModalSelectFacebookPage from '../../../Auth/Steps/Marketing/ModalSelectFacebookPage';


const { Content } = Layout;
const { confirm } = Modal;
const { Title, Paragraph, Text } = Typography

const axios = require("axios").default;

const FB = window.FB;




class Paginas extends Component {

    constructor(props) {
        super(props)
        this.state = {


            idProject: null,
            project: {},
            facebookPage: null,


            visibleFacebookPages: false


        }
    }

    componentDidMount() {
        axios.defaults.headers.common['Authorization'] = sessionStorage.getItem('token');
        if (
            this.props.idProject !== '' &&
            this.props.idProject !== null &&
            this.props.idProject !== undefined &&
            this.props.idProject !== this.state.idProject &&
            typeof this.props.idProject != "object"  
            
        ) {
            this.state.idProject = this.props.idProject
            this.getProjectInformation()
        }


    }

    getProjectInformation = (project_id = this.props.idProject) => {

        this.setState({ loading: true })

        axios.post('/projects/id', {
            id: project_id
        })
            .then(({ data }) => this.setState({
                project: data.data,
                facebookPage: data.page,
            }))
            .catch(e => message.error("No es posible obtener el proyecto."))
            .finally( e => this.setState({ loading: false }))

    }





    /**
     *
     *
     * @memberof Marketing
     * @method connectFacebookPages
     * 
     * @description Obtenemos las páginas de facebook para guardarlas.
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
                    // this.setState({ statusLoading: 0 })
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
    unbindFacebookPage = () => {
        this.setState({ loading: true })
        axios.post('/facebook/proyectos/page', {
            facebookpage_id: this.state.facebookPage?._id,
            unset: true
        })
            .then(({ data }) => this.getProjectInformation())
            .finally(e => this.setState({ loading: false, visibleFacebookPages: false }))

    }


    /**
     *
     *
     * @memberof Paginas
     */
    facebookConnect = () => {
        const { loading, project, facebookPage } = this.state;
        if (facebookPage !== null && facebookPage !== undefined)

            Modal.confirm({
                title: <p>¿Estas seguro de deslindar la página <strong>{facebookPage.name}</strong> de el proyecto <strong>{project.nombre}</strong>?</p>,
                icon: <ExclamationCircleOutlined />,
                content: 'Se eliminaran todas las automatizaciones realizadas y se dejarán de recibir los prospectos de Facebook.',
                onOk: () => {
                    this.unbindFacebookPage();
                },
            })
        else
            this.connectFacebookPages();
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
        this.setState({ loading: true })
        axios.post('/facebook/proyectos/page', {
            facebookpage_id: facebookPage._id,
            proyecto_id: this.state.idProject
        })
            .then(({ data }) => {
                // this.setState({ facebookPage: data.data })
                this.getProjectInformation()
            })
            .finally(e => this.setState({ loading: false, visibleFacebookPages: false }))
    }


    render() {
        const { loading, project, facebookPage } = this.state;


        return <Spin spinning={loading}>
            <Card title="Cuenta" bordered={false} className="card-anuncios">
                <Row style={{ width: '100%', marginBottom: '1em' }} className="card-content">
                    <Col md={24} lg={12}>
                        <Title className="title-pagina">Página de Facebook</Title>
                        {(facebookPage !== null && facebookPage !== undefined) ?
                            <Row style={{ width: '100%' }}>
                                <Avatar src={axios.defaults.baseURL + 'upload/' + facebookPage.avatar} size="large" />
                                <Paragraph className="content-pagina" style={{ paddingLeft: '1em', lineHeight: '1.3em' }}>
                                    <span style={{ fontSize: '16px' }}>{facebookPage.name}</span>
                                    <br />
                                    <span style={{ fontSize: '14px', fontWeight: 'normal', }}>{facebookPage.category}</span>
                                </Paragraph>
                            </Row>
                            :
                            <Paragraph className="content-pagina"><a href={project.facebook} target="_blank">{project.facebook}</a></Paragraph >
                        }
                    </Col>
                    <Col md={24} lg={12}>
                        <Title className="title-pagina">Cuenta Conectada</Title>
                        <Paragraph className="content-pagina">
                            <Button type="text" className={"button-active-account " + ((facebookPage !== null && facebookPage !== undefined) ? "on" : "off")} onClick={this.facebookConnect}>
                                <FaPowerOff className={"button-active-account-icon "} size={20} />
                            </Button>
                            <Text className="button-text">{(facebookPage !== null && facebookPage !== undefined) ? "Si" : "No"}</Text>
                        </Paragraph >
                    </Col>
                </Row>
                <Row style={{ width: '100%' }} className="card-content">
                    <Col md={24} lg={12}>
                        <Title className="title-pagina">Página Web</Title>
                        <a className="content-pagina" href={project.pagina_web} target="_blank">{project.pagina_web}</a>
                    </Col>
                    <Col md={24} lg={12}>
                        <Title className="title-pagina">Cuenta Instagram</Title>
                        <a className="content-pagina" href={project.instagram} target="_blank"  >{project.instagram}</a>
                    </Col>
                </Row>
            </Card>


            <ModalSelectFacebookPage
                title="Selecciona tu Página de Facebook"
                visible={this.state.visibleFacebookPages}
                onCancel={() => this.setState({ visibleFacebookPages: false })}
                setFacebookPage={this.setFacebookPage}
                footer={null}
            />
        </Spin>

    }

}

export default Paginas
