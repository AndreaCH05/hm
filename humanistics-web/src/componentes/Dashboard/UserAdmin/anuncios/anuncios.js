import React, { Component } from "react";
import { Table, Layout, Select, Row, Col, Spin, Card, Button, Modal, Skeleton, Space, Switch, message, Typography, List, PageHeader } from 'antd';
import { Link } from "react-router-dom";
import { PoweroffOutlined, FormOutlined, DeleteOutlined, ExclamationCircleOutlined, PlusOutlined } from '@ant-design/icons';



import Paginas from './Paginas';


const { Content } = Layout;
const { confirm } = Modal;
const { Text } = Typography

const axios = require("axios").default;

const FB = window.FB;
/**
 * @method showDeleteConfirm
 * @description  Para cada row mostrar un modal de confirmacion para eliminar el registro, la eliminacion se realiza mediante una peticion al servidor
 *
 * @params item (row)
 **/
const showDeleteConfirm = (item) => {
    const user_name = item.currentTarget.name;
    const user_id = item.currentTarget.id;

    confirm({
        title: 'Eliminar registro',
        icon: <ExclamationCircleOutlined />,
        content: '¿Estas seguro que deseas eliminar a ' + user_name + ' ?',
        okText: 'Continuar',
        okType: 'danger',
        cancelText: 'Cancelar',

        onOk() {
            axios.defaults.headers.get["Authorization"] = sessionStorage.getItem('token');
            axios({
                method: 'delete',
                url: '/productos/delete',
                headers: { Authorization: sessionStorage.getItem('token') },
                data: { id: user_id }
            })
                .then((response) => {

                    window.location.reload();
                })

                .catch((error) => {
                    console.log("error al borrar registro", error.response);
                })
        },
    });
}

const gridStyle = {
    width: '50%',
    textAlign: 'left',

};


class Anuncios extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: true,
            productos: [],
            proyecto: [],
            current_project: { _id: '' },
            tableLoading: true,
            data: [],
            pagination: {
                current: 1,
                pageSize: 10,
            }
        }
    }
    actualizandoProyecto = true;
    /**
     *
     * @memberof Anuncios
     *
     * @method componentDidUpdate
     * @description Actualizar los datos de la vista
     *
     */


    async componentDidUpdate() {
        /**localcompare
         * 0 = son iguales
         * -1 = no son iguales
         * 1 khe
         */
        if (this.actualizandoProyecto) {
            var actual = this.state.current_project;//proyecto cargado actualmente
            var comparar = sessionStorage.getItem('proyecto').localeCompare(actual._id)

            // var proyecto = JSON.parse(sessionStorage.getItem("proyecto_objeto"));
            if (this.state.current_project._id === '' || comparar != 0) {


                this.setState({ loading: true });
                this.actualizandoProyecto = false;

                let productos = await this.obtenerProductos();
                this.actualizandoProyecto = true;
                this.setState({
                    current_project: productos.data.proyecto,
                    productos: productos.data.data.itemsList,
                    estatus: productos.data.estatus,
                    loading: false,
                    tableLoading: false,
                    pagination: {
                        currentPage: productos.data.data.currentPage,
                        itemCount: productos.data.data.itemCount,
                    },
                });
            }

        }

    }

    /**
     *
     * @memberof Anuncios
     *
     * @method obtenerProductos
     * @description contiene la peticion del servidor de los productos
     *
     * @param images (string)
     * @param
     */
    obtenerProductos = async (page, limit) => {
        return axios.post(
            '/productos',
            {
                proyecto_id: sessionStorage.getItem("proyecto"),
                page: page,
                limit: limit
            },
            {
                headers: {
                    Authorization: sessionStorage.getItem('token')
                }
            });
    };


    addFacebookPage = () => {
        try {
            FB.login(function (response) {
                axios.put(
                    'projects/update',
                    {
                        proyecto_id: sessionStorage.getItem('proyecto'),

                        id: sessionStorage.getItem('proyecto'),
                        facebook_data: response
                    },
                    {
                        headers: {
                            Authorization: sessionStorage.getItem('token')
                        }
                    })
                    .then(e => {

                        Modal.success({
                            title: 'Debe seleccionar los formularios en cuestión.'
                        });

                    })
                    .catch(e => console.log('e', e));
            }, {
                scope: 'ads_management,leads_retrieval,pages_manage_metadata',
                return_scopes: true
            });
        } catch (e) {
            window.location.reload();
        }

    }


    render() {

        const { loading, proyecto } = this.state;
        if (loading)
            return (
                <Space size="middle" className="spin-loading">
                    <Spin size="large" />
                Cargando Proyecto ...
                </Space>
            );
        else
            return (
                <Layout className="bg-white">
                    <Content className="pd-1">
                        <PageHeader title="ANUNCIOS" className="title custom" />
                        <Row gutter={18}>
                            <Col xs={24} md={24} xl={12}>
                                <Paginas idProject={this.state.current_project?._id}/>
                            </Col>
                            <Col xs={24} md={24} xl={12} >
                                <Card title="Anuncios" bordered={false} className="card-anuncios">
                                    <Skeleton loading={loading} active>
                                        <Card.Grid hoverable={false} >Activo <Button type="button" icon={<PoweroffOutlined />} className="btn-anuncio anuncio-off" /></Card.Grid>
                                        <Card.Grid hoverable={false} >Inactivo <Button type="button" icon={<PoweroffOutlined />} className="btn-anuncio anuncio-on" /></Card.Grid>
                                    </Skeleton>
                                </Card>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={24} style={{ marginTop: "1rem" }} className="contenedor_item  pd-1">
                                <Row>
                                    <Col span={18}>
                                        <h3 className="font_color">Productos</h3>
                                    </Col>
                                    <Col span={6}>
                                        <Link to="/admin/producto/nuevo" title="Crear nuevo" >
                                            <PlusOutlined className="add-icon" ></PlusOutlined>
                                        </Link>
                                    </Col>
                                </Row>
                                <TableAnuncios
                                    productos={this.state.productos}
                                    pagination={this.state.pagination}
                                    loading={this.state.tableLoading}

                                    new={e => this.setState({
                                        visible: true,
                                        productos: null
                                    })}
                                    setProductos={(productos) => {
                                        this.setState({
                                            productos: productos,
                                            visible: true
                                        })
                                    }} />
                            </Col>
                        </Row>
                    </Content>
                </Layout>
            )
    }

}

class TableAnuncios extends Component {
    constructor(props) {
        super(props)
        this.state = {
            spinning: false

        }
    }


    CambioEstatusProducto = async (item) => {
        this.setState({ spinning: true });

        axios({
            method: 'post',
            url: '/productos/cambioEstatus',
            headers: { Authorization: sessionStorage.getItem('token') },
            data: { id: item }
        })
            .then((response) => {
                message.success("Estatus de producto actualizado");
                setTimeout(() => {
                    this.setState({ spinning: false });
                }, 2000);
            })

            .catch((error) => {
                console.log("error al cambiar estatus de registro", error.response);
            })
    }


    render() {



        return (


            <List
                loading={this.props.loading}
                size="small"
                className="component-list"
                bordered={false}
                dataSource={this.props.productos}
                locale={"Sin Productos"}
                pagination={{
                    onChange: page => {
                        this.props.LoadUserInfo(page)
                    },
                    pageSize: 10,
                    current: this.props.pagination.currentPage,
                    total: this.props.pagination.itemCount
                }}

                header={
                    <Row align="middle" className="pr-1 pl-1" style={{ width: '100%' }} className="row-titleList" >
                        <Col span={{ span: 6, order: 1 }} xxl={{ span: 6, order: 1 }} xl={{ span: 6, order: 1 }} lg={{ span: 6, order: 1 }} md={{ span: 6, order: 1 }} sm={{ span: 6, order: 1 }} xs={{ span: 22, order: 1 }}>
                            <Text>Nombre</Text>
                        </Col>
                        <Col span={{ span: 6, order: 2 }} xxl={{ span: 6, order: 2 }} xl={{ span: 6, order: 2 }} lg={{ span: 6, order: 2 }} md={{ span: 6, order: 2 }} sm={{ span: 6, order: 2 }} xs={{ span: 11, order: 2 }}>
                            <Text>Descripción</Text>
                        </Col>
                        <Col span={{ span: 6, order: 2 }} xxl={{ span: 6, order: 2 }} xl={{ span: 6, order: 2 }} lg={{ span: 6, order: 2 }} md={{ span: 6, order: 2 }} sm={{ span: 6, order: 2 }} xs={{ span: 11, order: 2 }}>
                            <Text>Precio</Text>
                        </Col>
                        <Col span={{ span: 4, order: 3 }} xxl={{ span: 4, order: 3 }} xl={{ span: 4, order: 3 }} lg={{ span: 4, order: 3 }} md={{ span: 4, order: 3 }} sm={{ span: 4, order: 3 }} xs={{ span: 11, order: 3 }}>
                            <Text>Activo</Text>
                        </Col>

                        <Col span={{ span: 2, order: 6 }} xxl={{ span: 2, order: 6 }} xl={{ span: 2, order: 6 }} lg={{ span: 2, order: 6 }} md={{ span: 2, order: 6 }} sm={{ span: 2, order: 6 }} xs={{ span: 2, order: 4 }}>
                            <Text>Acciones</Text>
                        </Col>
                    </Row>
                }
                renderItem={item => <List.Item className="component-list-item" key={item._id}>
                    <Card className="card-list">
                        <Row align="middle" style={{ width: '100%' }} >
                            <Col span={{ span: 6, order: 1 }} xxl={{ span: 6, order: 1 }} xl={{ span: 6, order: 1 }} lg={{ span: 6, order: 1 }} md={{ span: 6, order: 1 }} sm={{ span: 6, order: 1 }} xs={{ span: 22, order: 1 }}>
                                <Text>{item.nombre}</Text>
                            </Col>
                            <Col span={{ span: 6, order: 2 }} xxl={{ span: 6, order: 2 }} xl={{ span: 6, order: 2 }} lg={{ span: 6, order: 2 }} md={{ span: 6, order: 2 }} sm={{ span: 6, order: 2 }} xs={{ span: 11, order: 2 }}>
                                <Text>{item.descripcion}</Text>
                            </Col>
                            <Col span={{ span: 6, order: 2 }} xxl={{ span: 6, order: 2 }} xl={{ span: 6, order: 2 }} lg={{ span: 6, order: 2 }} md={{ span: 6, order: 2 }} sm={{ span: 6, order: 2 }} xs={{ span: 11, order: 2 }}>
                                <Text>{item.precio}</Text>
                            </Col>
                            <Col span={{ span: 4, order: 3 }} xxl={{ span: 4, order: 3 }} xl={{ span: 4, order: 3 }} lg={{ span: 4, order: 3 }} md={{ span: 4, order: 3 }} sm={{ span: 4, order: 3 }} xs={{ span: 11, order: 3 }}>
                                <Text>
                                {(item.activo) ? 
                                
                                <Switch className="input-box" id={item._id} onClick={() => this.CambioEstatusProducto(item._id)} defaultChecked />
                                : 
                                <Switch className="input-box" id={item._id} onClick={() => this.CambioEstatusProducto(item._id)} />
                                } 
                                
                                    
                                    </Text>
                            </Col>

                            <Col span={{ span: 2, order: 6 }} xxl={{ span: 2, order: 6 }} xl={{ span: 2, order: 6 }} lg={{ span: 2, order: 6 }} md={{ span: 2, order: 6 }} sm={{ span: 2, order: 6 }} xs={{ span: 2, order: 4 }}>
                                <Link title="Editar" to={`/admin/producto/editar/${item._id}`}>
                                    <Button title="Editar" className="purple-icon" id={item._id} onClick={this.ModalPopUpHandler} icon={<FormOutlined />} >
                                    </Button>
                                </Link>

                                <Button title="Eliminar" className="red-icon" name={item.nombre} id={item._id} onClick={showDeleteConfirm} icon={<DeleteOutlined />}></Button>
                            </Col>
                        </Row>
                    </Card>
                </List.Item>}
            />


        )
    }


}

export { Anuncios, TableAnuncios }
