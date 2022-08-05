//Dependencias
import React, { Component } from 'react';
import { Layout, Menu, Button, Modal, Tooltip, Typography } from 'antd';
import {
    LogoutOutlined,
    UserOutlined,
    PlusOutlined

} from '@ant-design/icons';

import { FaPlus } from "react-icons/fa"
import { Link, Redirect } from 'react-router-dom';
import './nav.css'


const { Header, Footer, Sider } = Layout;
const { Title, Paragraph } = Typography;

const axios = require('axios').default;


/**
 * @class SiderAdmin
 * @description Es la barra de navegacion. Cuando se monta, obtiene los proyectos asignados segun el metodo sidebar en el webservice.
 * Obtiene el proyecto y ademas el estatus predominante para asignarle dicho color al proyecto.
 *
 * De esta manera, al establecer los proyectos en la vista, tambien se declara su color y el ToolTip con su descripcion.
 *
 * */
class Sidebar extends Component {


    /**
     * @param state.projects
     * @description Arreglo de proyectos
     *
     * @param state.current_project
     * @description Proyecto selecionado actualmente
     * */


    /**
     * @param permiso
     * @description Obtenemos el permiso del usuario
     * */
    permiso = sessionStorage.getItem('rol');


    constructor(props) {
        super(props);

        this.state = {
            actualizado: false,
            projects: [],
            current_project: null
        };

    }
    /**
     *
     * @memberof SiderAdmin
     * @function componetDidMount
     *
     *
     */
    componentDidMount() {
        if (sessionStorage.getItem('rol') !== "Administrador") {
            this.getProjects()
        }

    };


    /**
   *
   * @memberof Sidebar
   * @description Realiza una consulta
   * para obtener los proyectos y los declara el en estado "proyectos"
   * posteriormente, declara el primer proyecto, si mandamos un id pone el proyecto como sleccionado
   */
    getProjects = (project_id) => {
        axios.get('/dashboard/sidebar', {
            headers: { Authorization: sessionStorage.getItem("token") }
        }).then(e => {
            let project = e.data.data[0].proyecto;

            this.setProjectSession(project);

            this.setState({
                projects: e.data.data,
            });
        })
            .catch(e => {
                this.state.projects = [];
                Modal.warning({
                    title: "Error al obtener sus proyectos.",
                    content: "Hubo un error al procesar su solicitud"
                })
            })
    };


    /**
     *
     *
     * @memberof Sidebar
     */
    setProjectSession = async (project) => {
  

        let proyecto = JSON.stringify(project);
        sessionStorage.setItem('proyecto', project._id);
        sessionStorage.setItem('proyecto_objeto', proyecto);
        this.setState({
            current_project: project,
            actualizado: true
        });

        this.props.onProjectSelect(project);
 

        if (window.location.pathname !== "/admin/dashboard") {
            window.location.replace("/admin/dashboard");
            return <Redirect to="/admin/dashboard" />;
        }

    };




    /**
     *
     *
     * @returns
     * @memberof Sidebar
     */
    cerrarSession() {
        sessionStorage.clear();
        window.location.replace("/");
        return <Redirect to="/" />;
    };

    render() {
        let { permiso } = this;
        const { projects } = this.state;

        return (
            <Sider className="sidebar" >
                <div className="sidebar-content">
                    <div className="projects">
                        <div className="proyects-container">
                            {
                                (projects.length > 0) ?
                                    projects.map((itemProject, index) => {
                                        let project = itemProject.proyecto;
                                        let status = itemProject.estatus;

                                        var nombre = project.nombre;
                                        if (nombre != undefined) {
                                            let acronym = project.nombre[0].toUpperCase();
                                            acronym = (acronym.length > 2) ? acronym.substring(0, 2) : acronym;

                                            let isLogo = (project.logo !== undefined && project.logo !== null && project.logo !== "" && project.logo.length > 5);

                                            let logo = isLogo ?
                                                <img className="logo" src={axios.defaults.baseURL + 'upload/' + project.logo} alt={acronym} onError={i => i.target.style.display = 'none'} /> : acronym;

                                            return (
                                                <Tooltip
                                                    key={'project-sidebar-' + index}
                                                    placement="right"
                                                    title={(
                                                        <div className={'project-tooltip'}>
                                                            <Title level={4} style={{ color: "white" }}>{project.nombre}</Title>
                                                            {logo}
                                                            <Paragraph style={{ color: "white", paddingRight: "2em" }}>  {project.descripcion_general} </Paragraph>
                                                        </div>
                                                    )}
                                                    mouseEnterDelay="0.5"
                                                >
                                                    <Button className="button" type="primary" block style={{ backgroundColor: `#${(status !== null && status !== undefined && status.color !== undefined) ? status.color : "CED9D7"}` }} key={"projects-id-" + project._id} onClick={e => this.setProjectSession(project)}>
                                                        {
                                                            logo
                                                        }
                                                        {
                                                            (this.state.current_project._id === itemProject._id) ? <div className="line-button"></div> : null
                                                        }
                                                    </Button>
                                                </Tooltip>
                                            );
                                        }
                                    })
                                    : ''
                            }
                            <Button className="button" type="primary" block key={"projects-add"}>
                                <Link to="/admin/proyectos">
                                    <FaPlus style={{ marginTop: "5px" }} />
                                </Link>
                            </Button>
                        </div>
                    </div>
                    <div className="sider-menu">
                        <img src={"/images/Isotopo-Negro.svg"} width="100px" className="center"></img>
                        <Menu mode="vertical" className="menu" theme="dark"
                        >
                            <Menu.Item className="nav_item" key="general">
                                <Link to="/admin/dashboard">General </Link>
                            </Menu.Item>
                            {
                                (permiso == "Administrador") ? (
                                    <Menu.Item className="nav_item" key="proyectos">
                                        <Link to="/admin/proyectos">Proyectos</Link>
                                    </Menu.Item>
                                ) : null
                            }
                            {
                                (permiso == "Administrador") ? (
                                    <Menu.Item className="nav_item" key="prospectos">
                                        <Link to="/admin/prospectos">Prospectos</Link>
                                    </Menu.Item>
                                ) : null
                            }
                            <Menu.Item className="nav_item" key="prospectos">
                                <Link to="/admin/prospectos">Prospectos</Link>
                            </Menu.Item>
                            <Menu.Item className="nav_item" key="asesores">
                                <Link to="/admin/asesores">Asesores</Link>
                            </Menu.Item>
                            <Menu.Item className="nav_item" key="anuncios">
                                <Link to="/admin/anuncios">Anuncios</Link>
                            </Menu.Item>
                            <Menu.Item className="nav_item" key="ajustes">
                                <Link to="/admin/ajustes">Ajustes</Link>
                            </Menu.Item>
                            <Menu.Item className="nav_item li-logOut" title="Cerrar sesión" onClick={this.cerrarSession}>
                                <LogoutOutlined className="iconLogOut" />
                                Cerrar sesión
                            </Menu.Item>

                            <Menu.Item className="nav_item li-usuario">
                                <Link to="/admin/usuario" />
                                <UserOutlined className="iconUser" />
                                Usuario
                            </Menu.Item>
                        </Menu>
                    </div>
                </div>
            </Sider>
        )
    }
}

class SiderSuperAdmin extends Component {

    cerrarSession() {
        sessionStorage.clear();
        window.location.replace("/");
        return <Redirect to="/" />;
    };
    render() {

        return (
            <Sider className="sidebar" >
                <div className="sider-menu" style={{ width: "100%", height: "100vh", overflow: "auto" }}>

                    <img src={"/images/Isotopo-Negro.svg"} width="100px" className="center"></img>

                    <Menu mode="vertical" className="menu" theme="dark">
                        <Menu.Item className="nav_item" key="general">
                            <Link to="/superadmin/dashboard" />General
                        </Menu.Item>

                        <Menu.Item className="nav_item" key="prospectos">
                            <Link to="/superadmin/proyectos" />Proyectos
                        </Menu.Item>

                        <Menu.Item className="nav_item" key="asesores">
                            <Link to="/superadmin/cuentas" />Cuentas
                        </Menu.Item>

                        <Menu.Item className="nav_item" key="anuncios">
                            <Link to="/superadmin/accounting" />Accounting
                        </Menu.Item>

                        <Menu.Item className="nav_item" key="industrias">
                            <Link to="/superadmin/industrias" />industrias
                        </Menu.Item>

                        <Menu.Item className="nav_item li-logOut" title="Cerrar sesión" onClick={this.cerrarSession}>
                            <LogoutOutlined className="iconLogOut" />
                            Cerrar sesión
                        </Menu.Item>

                        <Menu.Item className="nav_item li-usuario">
                            <Link to="/superadmin/usuario" />
                            <UserOutlined className="iconUser" />
                            Usuario
                        </Menu.Item>
                    </Menu>
                </div>
            </Sider>
        )
    }

}



export {
    Sidebar,
    SiderSuperAdmin
};
