import React, { useState, useEffect, useRef } from 'react';
import { Layout } from 'antd'
import { Route, useLocation, Switch } from 'react-router-dom';

import Dashboard from "../componentes/Dashboard/dashboard"
import { Sidebar } from '../componentes/Nav/nav'
import Prospectos from '../componentes/Dashboard/prospectos/prospectos'
import Asesores from '../componentes/Dashboard/asesores/Asesores'

import { Anuncios } from '../componentes/Dashboard/UserAdmin/anuncios/anuncios'
import AnuncioProyecto from '../componentes/Dashboard/UserAdmin/anuncios/anuncio_proyecto'

import Ajustes from '../componentes/Dashboard/UserAdmin/Ajustes/ajustes'
import FormAutomatizacion from '../componentes/Dashboard/UserAdmin/Ajustes/FormAutomatizacion'
import { Plan, PlanesList } from '../componentes/Dashboard/UserAdmin/Ajustes/plan'

import Proyectos from '../componentes/Dashboard/proyectos/proyectos'
import InformacionPersonal from '../componentes/Dashboard/AjustesUsuario/informacionPersonal'

import Logged from '../Hooks/Logged'

import ProyectoContext from '../Hooks/ProyectoContext'

import '../css/dashboard.css'
const { Content } = Layout;
function AdminRoutes() {

    /**
     * @state update
     *
     * Solamente para actualizar la vista actual en la que se encuentra el usuario.
     * */
    const location = useLocation();
    const [project, setProject] = useState({});
    const [update, setUpdate] = useState(true);

    let onProjectSelect = (project) => {
        setProject(project);
    };

    let context = React.useContext(Logged);

    const NavBar = useRef(null);

    /**
     *
     * Cuando se cambia de ruta, se renderiza el proyecto de nuevo para que el componenteDidUpdate
     * actualice la info de la vista
     *
     * */
    useEffect(() => {
        setUpdate(!update);
    }, [location]);

    let setNewProject = (project_id) => {
        NavBar.current.getProjects(project_id)
    }

    return (
        <Layout className="admin">
            <Logged.Consumer>
                {value => { context = value }}
            </Logged.Consumer>
            <Layout className="bg-white" >
                <Sidebar onProjectSelect={onProjectSelect} user={context} ref={NavBar} />
                <Switch>
                    <Content className="route-content" >
                        <Route exact path="/admin/dashboard"                    render={(props) => <Dashboard           {...props} user={context} isAuthed={true} project={project} />} />
                        <Route exact path="/admin/prospectos"                   render={(props) => <Prospectos          {...props} user={context} isAuthed={true} project={project} />} />
                        <Route exact path="/admin/asesores"                     render={(props) => <Asesores            {...props} user={context} isAuthed={true} project={project} />} />
                        <Route exact path="/admin/anuncios"                     render={(props) => <Anuncios            {...props} user={context} isAuthed={true} project={project} />} />
                        <Route exact path="/admin/producto/nuevo"               render={(props) => <AnuncioProyecto     {...props} user={context} isAuthed={true} project={project} />} />
                        <Route exact path="/admin/producto/editar/:id"          render={(props) => <AnuncioProyecto     {...props} user={context} isAuthed={true} project={project} />} />
                        <Route exact path="/admin/proyectos"                    render={(props) => <Proyectos           {...props} setNewProject={setNewProject} user={context} isAuthed={true} project={project} />} />
                        <Route exact path="/admin/proyectos/nuevo"              render={(props) => <Proyectos           {...props} user={context} isAuthed={true} project={project} />} />
                        <Route exact path="/admin/proyectos/editar/:id"         render={(props) => <Proyectos           {...props} user={context} isAuthed={true} project={project} />} />
                        <Route exact path="/admin/ajustes"                      render={(props) => <Ajustes             {...props} user={context} isAuthed={true} project={project} />} />
                        <Route exact path="/admin/ajustes/plan/:id"             render={(props) => <Plan                {...props} user={context} isAuthed={true} project={project} />} />
                        <Route exact path="/admin/ajustes/planes"               render={(props) => <PlanesList          {...props} user={context} isAuthed={true} project={project} />} />
                        <Route exact path="/admin/ajustes/crearAutomatizacion"  render={(props) => <FormAutomatizacion  {...props} user={context} isAuthed={true} project={project} />} />
                        <Route exact path="/admin/usuario"                      render={(props) => <InformacionPersonal />} />
                    </Content>
                </Switch>
            </Layout>
        </Layout>
    );

}

export default AdminRoutes;