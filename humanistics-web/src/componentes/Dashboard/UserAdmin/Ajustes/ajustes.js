import React, { Component } from "react";
import { Layout, Modal, Row, Col, Button, Spin, Space, Empty, Typography, PageHeader } from 'antd';
import { PlusOutlined, SelectOutlined } from '@ant-design/icons';
import { Link } from "react-router-dom";
import moment from 'moment';
import { ModalUsuarios, UsuariosList } from "./usuarios"
import { AutomatizacionCard } from "../../../Widgets/Cards/cards";


import { Plan, PlanesList } from "./plan";

import Planes from "../../../Auth/Steps/Prospectos/planes";

import ModalAutomatizacion from "./ModalAutomatizacion";

//css
import '../../../../css/Ajustes.css';
//modal
import ModalEstatus from './ModalEstatus';

const { Content } = Layout;
const axios = require('axios').default;
const { Text } = Typography
const dateFormat = 'YYYY/MM/DD';


/**
 *
 *
 * @class Ajustes
 * @extends {Component}
 */
class Ajustes extends Component {
    constructor(props) {
        super(props);
        this.state = {
            current_project: null,
            modalUsuarios: false,
            visible: false,
            roles: [],
            id_user: undefined,


            spinning: true,
            plan: [],
            pago: [],

            usuarios: [],
            loading: true,
            tableLoading: true,


            modalAutomatizacion: false,
            modalEstatusVisible: false,
            modalPlan: false,
            modalPlanes: false,

            // 
            itemCount: 1,
            currentPage: 1,



            automatizaciones: [],
            modalAutomatizacionVisible: false,
        }
    }

    actualizandoProyecto = true;

    /**
     * @memberof Ajustes
     *
     * @method componentDidMount
     * @description  Carga la informacion del usuario y lo asigna a los states correspondientes
     */

    componentDidMount() {
        axios.defaults.headers.common['Authorization'] = sessionStorage.getItem('token');

        this.getAutomatizaciones()
    }



    async componentDidUpdate() {
        const actual = sessionStorage.getItem("proyecto");

        if (this.actualizandoProyecto) {
            if (this.state.current_project == null || this.state.current_project._id !== sessionStorage.getItem('proyecto')) {
                this.setState({ loading: true });
                this.actualizandoProyecto = false;
                let usuarios = await this.LoadUserInfo();

                this.actualizandoProyecto = true;

                this.setState({
                    current_project: usuarios.data.proyecto,
                    usuarios: usuarios.data.data.itemsList,
                    loading: false,
                    tableLoading: false,
                    pagination: {
                        currentPage: usuarios.data.data.currentPage,
                        itemCount: usuarios.data.data.itemCount,
                    },
                });

                this.state.spinning = true;
                await this.LoadDataPlan();
                await this.getAutomatizaciones();
                this.state.spinning = false;
            }

        }
    }

    /**
     * @memberof Ajustes
     *
     * @method LoadDataPlan
     * @description  Si es una edicion de usuario se manda una peticion para traer la informacion del servidor
     *
     **/
    LoadDataPlan = async (user) => {
        axios.post('/checkout/id', { user })
            .then((response) => {

                if (response.data.data !== null) {
                    this.state.pago = response.data.data;
                    this.state.plan = response.data.data.plan_id;
                }

            })
            .catch((error) => {
                if (error.status >= 300) {
                    Modal.info({
                        title: error.response.status,
                        content: error.response.data
                    })
                }
            })
            .finally(e => {
                this.setState({ spinning: false });
            });

    };

    /**
  * @memberof Ajustes
  *
  * @method LoadUserInfo
  * @description  carga la informacion del usuario
  *
  **/
    LoadUserInfo = async (page) => {
        return axios.get('/usuarios/',
            {
                params: {
                    page: page,
                    limit: 10,
                    proyecto_id: sessionStorage.getItem("proyecto"),
                }
            });
    }


    /**
     * @memberof Ajustes
     *
     * @method ModalPopUpHandler
     * @description  cambia el state para mostrar u ocultar el modal
     *
     **/
    ModalPopUpHandler = () => {
        const changeModal = this.state.modalUsuarios;
        this.setState({ modalUsuarios: !changeModal });
    }

    onClose = async () => {
        this.setState({
            modalUsuarios: false,
            reload: true,
        });

        setTimeout(() => {
            this.setState({
                reload: false,
            });
        }, 10);
    }


    actualizarListaUsuarios = async () => {


        this.setState({ loading: true });

        let usuarios = await this.LoadUserInfo(1);


        this.setState({
            usuarios: usuarios.data.data.itemsList,
            loading: false,
            tableLoading: false,
            pagination: {
                currentPage: usuarios.data.data.currentPage,
                itemCount: usuarios.data.data.itemCount,
            },
        });
    }


    /**
      * @memberof Ajustes
      *
      * @method openModal
      * @description  abre modal
      *
      **/

    openModal = () => this.setState({
        modalAutomatizacion: true
    })

    /**
     * @memberof Ajustes
     *
     * @method cerrarModal
     * @description  cierra modal
     *
     **/
    cerrarModal() {
        this.setState({
            modalAutomatizacion: false,
            modalPlan: false
        });
    }



    getAutomatizaciones = async () => {

        return axios.get('/automatizaciones/list')
            .then(({ data }) => {

                this.setState({
                    automatizaciones: data.data
                })

            })
    }

    deleteAutomatizacion  = async (id) => {

        return axios.delete('/automatizaciones/list',{
            params: {id}
        })
            .then(({ data }) => {
                this.getAutomatizaciones()

            })
    }

    render() {
        const {
            plan,
            pago,
            loading
        } = this.state;


        if (loading)
            return (
                <Space size="middle" className="spin-loading">
                    <Spin size="large" />
                    Cargando Ajustes del Proyecto ...
                </Space>
            );
        else
            return (
                <Layout className="bg-white">
                    <Content className="pd-1">
                        <PageHeader title="AJUSTES" className="title custom" />
                        <Row gutter={[16, 16]} justify="center">
                            <Col span={12}>
                                <div className="contenedor_item pd-1">
                                    <Row justify="left">
                                        <Col span={20}>
                                            <Text className="font_color subtitle-section up">Automatizaciones</Text>
                                        </Col>
                                        <Col span={4}>
                                            <a onClick={ () => this.setState({ modalAutomatizacionVisible: true, modalAutomatizacionId: null })}>
                                                <PlusOutlined className="add-icon" style={{ float: 'right' }}> </PlusOutlined>
                                            </a>
                                        </Col>
                                    </Row>
                                    <Row gutter={[24, 24]} justify="center" className="pd-1">
                                        {this.state.automatizaciones.map((automatizacion, index) => {
                                            return <AutomatizacionCard
                                                id={automatizacion._id}
                                                status={automatizacion.activo}
                                                automatizacion={automatizacion} 
                                                onEdit={() => {
                                                    this.setState({ 
                                                        modalAutomatizacionVisible: true,
                                                        modalAutomatizacionId: automatizacion._id 
                                                    })
                                                }} 
                                                onDelete={() =>  this.deleteAutomatizacion(automatizacion._id)} 
                                            />
                                        })}
                                    </Row>
                                </div>
                            </Col>
                            <Col span={6}>
                                {(this.state.plan != null) ?
                                    <div className="contenedor_item pd-1">
                                        <Spin spinning={this.state.spinning}>
                                            <Row>
                                                <Col span={20}>
                                                    <Text className="font_color subtitle-section up" >Mi Plan</Text>
                                                </Col>
                                                <Col span={4}>
                                                    <SelectOutlined className="add-icon" style={{ float: 'right' }} rotate={90} onClick={e => { this.setState({ modalPlan: true }) }}
                                                    />
                                                </Col>
                                            </Row>
                                            <Row className="center">
                                                <Col span={24} className="center" >{(plan.nombre) ? plan.nombre : 'Plan'}</Col>
                                                <Col span={24} className="center">
                                                    <p className="cuenta-plan-info">Fecha Inicio
                                                        <span>{(pago.createdAt != '') ? moment(pago.createdAt).format(dateFormat) : ''}</span>
                                                    </p>
                                                </Col>
                                                <Col span={24} className="center">
                                                    <p className="cuenta-plan-info">Prospectos del Mes <span>{plan.prospectos}</span>
                                                    </p>
                                                </Col>
                                                <Col span={24} className="center">
                                                    <Button type="button" className="btn btn-gral-morado"
                                                        onClick={e => { this.setState({ modalPlanes: true }) }}
                                                    >Cambiar de Plan</Button>
                                                    <Link to={'/admin/ajustes/planes'}>
                                                    </Link>
                                                </Col>
                                            </Row>
                                        </Spin>
                                    </div>
                                    :
                                    <div className="contenedor_item pd-1">
                                        <Row>
                                            <Col span={20}>
                                                <Text className="font_color subtitle-section up" >Mi Plan</Text>
                                            </Col>
                                            <Col span={4}>
                                                <SelectOutlined className="add-icon" style={{ float: 'right' }} rotate={90} onClick={e => { this.setState({ modalPlan: true }) }}
                                                />
                                            </Col>
                                        </Row>
                                        <Spin spinning={this.state.spinning}>
                                            <Empty
                                                image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
                                                imageStyle={{ height: 180, }}
                                                description={
                                                    <span>
                                                        No has elegido ningun <a href="#API" id="linkapi"> Plan</a>
                                                    </span>
                                                }
                                            >
                                                <Link to={'/admin/ajustes/planes'}>
                                                    <Button type="primary" className="btn btn-secondary">Elegir Plan</Button>
                                                </Link>
                                            </Empty>
                                        </Spin>
                                    </div>
                                }
                            </Col>
                            <Col span={6}>
                                <Row className="card-ajustes" style={{ marginTop: "0px", minHeight: "calc(100vh/2 - 4rem)" }}>
                                    <Col span={18}>
                                        <Text className="subtitle-ajustes">Estatus</Text>
                                    </Col>
                                    <Col span={6}>
                                        <Button className='btn-card' onClick={() => { this.setState({ modalEstatusVisible: true }) }}>
                                            <SelectOutlined className="add-icon" rotate={90} />
                                        </Button>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>

                        <Row>
                            <Col span={24} className="contenedor_item pd-1">
                                <Row>
                                    <Col span={18}>
                                        <Text className="font_color subtitle-section up ">Usuarios</Text>
                                    </Col>
                                    <Col span={6}>
                                        <a title="Crear nuevo" onClick={() => { this.setState({ modalUsuarios: true, id_user: undefined }) }}>
                                            <PlusOutlined className="add-icon"></PlusOutlined>
                                        </a>
                                    </Col>
                                </Row>

                                <Row>
                                    <UsuariosList
                                        pagination={this.state.pagination}
                                        reload={this.state.reload}
                                        new={e => this.setState({
                                            visible: true,
                                            usuarios: null
                                        })}
                                        setUsuarios={(usuarios) => {
                                            this.setState({
                                                usuarios: usuarios,
                                                visible: true
                                            })
                                        }}

                                    />
                                </Row>
                            </Col>
                        </Row>
                    </Content>


                    <ModalUsuarios
                        id_user={this.state.id_user}
                        visible={this.state.modalUsuarios}
                        onCancel={() => {
                            this.actualizarListaUsuarios();

                            this.setState({
                                modalUsuarios: false,
                                id_user: undefined
                            })
                        }}
                    />

                    <Modal
                        visible={this.state.modalPlan}
                        onCancel={e => this.setState({ modalPlan: false })}
                        footer={false}
                        className="mdl-crearUsuario box-table mdl-NuevoMiembro mdl-ajustes"
                    >
                        <Row>
                            <Col span={24}>
                                <Plan />
                            </Col>
                        </Row>
                    </Modal>
                    <Modal
                        visible={this.state.modalPlanes}
                        onCancel={e => this.setState({ modalPlanes: false })}
                        footer={false}
                        className="modal-planes"
                    >
                        <Row>
                            <Col span={24}>
                                <Planes onNext={() => { console.log('nn') }} proyecto={this.props.project} />
                            </Col>
                        </Row>
                    </Modal>
                    <ModalEstatus
                        visible={this.state.modalEstatusVisible}
                        proyecto={{ _id: sessionStorage.getItem("proyecto") }}
                        closeModal={() => { this.setState({ modalEstatusVisible: false }) }}
                    />
                    <ModalAutomatizacion 
                        visible={this.state.modalAutomatizacionVisible}
                        
                        onCancel={() => {
                            this.setState({ modalAutomatizacionVisible: false, modalAutomatizacionId: undefined})
                        }}

                        onOk={() => {
                            this.setState({ modalAutomatizacionVisible: false})
                            this.getAutomatizaciones()
                        }}
                        modalAutomatizacionId={this.state.modalAutomatizacionId}
                    />                    
                </Layout>
            );
    }
}

export default Ajustes;
