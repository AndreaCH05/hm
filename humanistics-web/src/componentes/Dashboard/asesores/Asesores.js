import React, { Component } from "react";
import { Layout, PageHeader, Button, message, Row, Col, Empty, Spin, } from 'antd';
import { RightOutlined, SearchOutlined, AppstoreOutlined, DownloadOutlined, UnorderedListOutlined } from '@ant-design/icons';

import AsesoresLista from './AsesoresList';
import { AsesoresCards } from '../../Widgets/Cards/cards'
import Logged from '../../../Hooks/Logged'
const { Content } = Layout
const axios = require("axios").default;

/**
 *
 *
 * @class Asesores
 * @extends {Component}
 */
class Asesores extends Component {

    static contextType = Logged;
    constructor(props) {
        super(props);

        this.state = {
            loading: true,
            tipo: "list",
            current_project: '',

            // filtros
            sort: [],
            filter: '',
            filter_estatus: '',
            search: '',
            filter_asesores: '',

            dataAsesores: [],
            // paginator
            pagination: {
                currentPage: 1,
                itemCount: 1,
                pageCount: 10,
            }
        }
    }

    /**
     *
     * @methodOf Asesores
     *
     * @function componentDidMount
     * @description Se carga el componente con los datos de los asesores
     * */
    componentDidMount() {
        axios.defaults.headers.get['Authorization'] = sessionStorage.getItem('token');
        this.obtenerAsesores();

    }


    /**
      *
     * @function obtenerAsesores
     * @description Obtiene los asesores
     * */
    obtenerAsesores = (page, search, sort) => {
        axios.get('/usuarios/asesores',{
            params:{
                page: page,
                search: search,
                sort: sort,
            }
        })
            .then((response) => {
                var data = response.data.data.itemsList;

                this.setState({
                    dataAsesores: data,
                    pagination :{
                        currentPage: response.data.data.currentPage,
                        itemCount: response.data.data.itemCount,
                        pageCount: response.data.data.pageCount
                    }
                });
            })
            .catch((error) => {
                console.log('error ', error)
            })
            .finally(f => {
                this.setState({ loading: false })
            })


    };


    StatusAsesor(status) {
        let s_status = '';
        switch (status) {
            case 0:
                s_status = 'Desactivado';
                break;
            case 1:
                s_status = 'Registrado';
                break;
            default:
                s_status = 'Sin Status';
                break;
        }

        return s_status;
    }
    /**
    *
    * @methodOf Asesores
    *
    * @function onChangeTypeView
    * @description Si no se esta consultando, se cambia el modo de vista de registros
    * */
    onChangeTypeView() {
        if (!this.state.cargando) {
            var tipo = this.state.tipo;

            if (tipo == "cards") {
                this.setState({
                    tipo: "list",
                    cargando: true
                });
            }
            else {
                this.setState({
                    tipo: "cards",
                    cargando: true
                });
            }
            setTimeout(async () => {
                this.setState({
                    cargando: false,
                });
            }, 1500);
        }
        else {
            message.warning("Espere un momento.")
        }
    }


    render() {
        const user = this.context;

        const asesores = this.state.dataAsesores;
        const loading = this.state.loading;
        let tipo = this.state.tipo;

        if (asesores.length > 0) {
            return (
                <Layout className="bg-white">
                    <Content className="pd-1">
                        <PageHeader title="ASESORES" className="title custom"
                            extra={[
                                <div style={{ height: "55px", display: "flex", paddingTop: "3px", }}>
                                    <Button key="1" type="ghost" icon={tipo === "cards" ?  <UnorderedListOutlined /> : <AppstoreOutlined />} onClick={() => this.onChangeTypeView()} />
                                    <Button key="2" type="ghost" icon={<DownloadOutlined />} />
                                </div>
                            ]}
                        />
                        <Content>
                            <Spin spinning={loading} >
                                <Row gutter={[16, 16]}>
                                    {(tipo === "cards") ?
                                        this.state.dataAsesores.map(function (item, index) {
                                            return <AsesoresCards asesor={item} />
                                        })
                                        :
                                        <AsesoresLista 
                                            asesores={asesores} 
                                            obtenerAsesores={this.obtenerAsesores} 
                                            StatusAsesor={this.StatusAsesor}
                                            pagination={this.state.pagination}
                                            />
                                    }
                                </Row>
                            </Spin>
                        </Content>
                    </Content>
                </Layout>
            )

        }
        else {
            return (
                <Layout className="bg-white">
                    <Content className="pd-2">
                        <PageHeader title="ASESORES" className="title custom"
                            extra={[
                                <div style={{ height: "55px", display: "flex", paddingTop: "3px", }}>
                                    <Button key="1" type="ghost" icon={<AppstoreOutlined />} onClick={() => this.onChangeTypeView()} />
                                    <Button key="2" type="ghost" icon={<DownloadOutlined />} />
                                </div>
                            ]}
                        />
                        <Content>
                            <Spin spinning={loading} >
                                <Row>
                                    <Empty description={<span>Sin Asesores</span>} ></Empty>
                                </Row>
                            </Spin>
                        </Content>
                    </Content>
                </Layout>)
        }


    }
}







export default Asesores;

