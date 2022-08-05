import React, { Component } from "react";
import { Layout, Space, Spin, } from 'antd';
import 'react-multi-carousel/lib/styles.css';


import ProspectosCards from './ProspectosCards';
import ProspectosList from './ProspectosList';
import ProspectoModal from "./ProspectoModal";
import ProspectoModalNuevo from "./ProspectoModalNuevo";

const axios = require('axios').default;

class Prospectos extends Component {

    state = {

        current_project: null,


        visible: false,
        loading: true,
        tableLoading: true,


        prospecto_id: undefined,
        projects: [],
        estatus: [],
        usuarios: [],
        prospecto: {},
        prospectos: [],
        asesores: [],

        // paginacion
        pagination: {
            currentPage: 1,
            itemCount: 1,
        },

        // filtros
        search: null,
        filter_estatus: null,
        sorter: {
            field: "createdAt",
            order: "descend"
        },

        update: false,
        updateProspecto: false,
        filter_asesores: null,
        view: 'List',
        ModalProspectoVisible: false,
        ModalProspectoNuevoVisible: false,
    }
    actualizandoProyecto = true;


    /**
     *
     * @methodOf Prospectos
     *
     * @function componentDidMount
     * @description
     * */
    componentDidMount(){
        axios.defaults.headers.common['Authorization'] = sessionStorage.getItem('token');
        this.listProspectos();
    }

    /**
     *
     * @methodOf Prospectos
     *
     * @function componentDidUpdate
     * @description Actualiza la lista de prospectos al cambiar de proyecto y limpia los filtros
     * */
    componentDidUpdate(prevProps) {
        if(this.props.project !== undefined && this.props.project._id !== prevProps.project?._id){
            this.setState({
                loading: true, page: 1, filter_estatus: null, filter: null, search: null
            },()=>{this.listProspectos()})
        }
    }

    /**
     * @methodOf Prospectos
     *
     * @function changeView
     * @description Cambia el state para camabiar de vista entre prospectos lista y cards, se pasa como props a los compoenetes
     * */
    changeView = (view) => {
        this.setState({ view: view })
    }

    /**
     *
     * @methodOf Prospectos
     *
     * @function listProspectos
     * @description Trae la informacion de los prospectos para la tabla,
     * */
    listProspectos = (page = 1) => {
        this.setState({tableLoading: true})
        axios.post('/prospectos',{
            proyecto_id: sessionStorage.getItem('proyecto'),
            page: page,
            limit: 10,
            filter_estatus: this.state.filter_estatus,
            filter: this.state.sorter,
            search: this.state.search,
        }).then(response => {
       
            this.setState({
                current_project: response.data.proyecto,
                estatus: response.data.estatus,
                prospectos: response.data.data.itemsList,
                usuarios: response.data.usuarios,
                asesores: response.data.asesores,
                tableLoading: false,
                pagination: {
                    currentPage: response.data.data.currentPage,
                    itemCount: response.data.data.itemCount, 
                },
                loading: false,
            })
        }).catch(error => {
            console.log('error',error)
        })
    }


   
    /**
     *
     * @methodOf Prospectos
     *
     * @function onChangeDropdownFilter
     * @description ordena la tabla, dependiendo del objeto orden que se manda
     * */
    onChangeDropdownFilter = (sort) => {
        this.setState({ sorter: sort, tableLoading: true },()=>{
            this.listProspectos()
        })
    }

    /**
     * @methodOf Prospectos
     *
     * @function onStatusSelected
     * @description Actualiza la tabla, con los prospectos cuyo estatus sea de los seleccionados
     * */
    onStatusSelected = (status_ids) => {
        this.setState({filter_estatus: status_ids, tableLoading: true},() => {
            this.listProspectos()
        })
    }

    /**
     * @methodOf Prospectos
     *
     * @function onChangeSearch
     * @description Se selecciona cuando se realiza una busqueda. Se declara en el obejto busqueda y se actualiza los filtros.
     * */
    onChangeSearch = async (search) => {
        this.setState({search: search, tableLoading: true},() => {
            this.listProspectos()
        })
    }

    /**
     *
     * @methodOf Prospectos
     *
     * @function onCancel
     * @description Cierra el modal
     * */
    onCancel = () => {
        this.setState({ ModalProspectoNuevoVisible: false, ModalProspectoVisible: false });
        this.listProspectos();
    };


    csv = () => {
        this.setState({ tableLoading: true });
        axios.post(
            '/prospectos/csv',
            {
                proyecto_id: sessionStorage.getItem('proyecto')
            },
            {
                headers: {
                    Authorization: sessionStorage.getItem('token')
                }
            })
            .catch((success) => {
     
                this.setState({ tableLoading: false });
            }).then((error) => {
                console.log(error)
                this.setState({ tableLoading: false });
            });
    };

    render() {
        if (this.state.loading)
            return (
                <Space size="center" className="spin-loading border">
                    <Spin size="large" />
                    Cargando Proyecto ...
                </Space>
            );
        else
            return (
                <Layout className="bg-white" style={{ maxWidth: "calc(99vw - 190px)", minWidth: "500px" }}>
                    { this.state.view === 'List' ? <ProspectosList
                        data        ={this.state.prospectos}
                        estatus     ={this.state.estatus}
                        usuarios    ={this.state.usuarios}
                        pagination  ={this.state.pagination}
                        loading     ={this.state.tableLoading}
                        asesores    ={this.state.asesores}
                        csv         ={this.csv}
                        onStatusSelected={this.onStatusSelected}
                        updateTable ={this.listProspectos}
                        onChangeDropdownFilter={this.onChangeDropdownFilter}
                        onChangeSearch={this.onChangeSearch}
                        changeView  ={this.changeView}
                        new={()=>{this.setState({ ModalProspectoNuevoVisible: true })}}
                        setProspecto={(prospecto) => {
                            this.setState({
                                prospecto_update: prospecto,
                                ModalProspectoVisible: true,
                            })
                        }}
                    />
                        : <ProspectosCards
                            changeView={this.changeView}
                        />

                    }
                    <ProspectoModal
                        onCancel={this.onCancel}
                        estatus={this.state.estatus}
                        visible={this.state.ModalProspectoVisible}
                        prospecto={this.state.prospecto_update}
                    />

                    <ProspectoModalNuevo
                        onCancel={this.onCancel}
                        estatus={this.state.estatus}
                        visible={this.state.ModalProspectoNuevoVisible}
                    />

                </Layout>
            )
    }
}

export default Prospectos;
