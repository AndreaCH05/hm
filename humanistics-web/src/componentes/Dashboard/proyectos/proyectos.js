import React, {Component} from "react";
import { Layout, Steps, Button, message, Row, PageHeader, Col, Form } from 'antd'
import { Redirect } from 'react-router-dom';
//componentes
import General from './General'
import Industria from './Industria'
import Web from './Web'
import Estatus from './Estatus'
//css
import '../../../css/proyectos.css'

const {Content} = Layout;
const { Step } = Steps;
const axios = require("axios").default;

class Proyectos extends Component {

    Form = React.createRef();

    constructor(props) {
        super(props)
        this.state = {
            loading: true,
            current: 0,
            datos:{
                logo: null
            },
            redirect: false
        }

    }


     /**
     *
     * @methodOf Industria
     *
     * @function componentDidMount
     * @description
     * */
    componentDidMount() {
        axios.defaults.headers.common['Authorization'] = sessionStorage.getItem('token');
        
    }

    next = (values,current) => {
        this.setState({current: current + 1, datos: {...this.state.datos,...values}})

    }

    prev = (current) => {
        this.setState({current: current - 1})
    }

    FinishForm = (values) => {
        this.setState({ datos: {...this.state.datos,...values}},() => {this.addProyecto()})
    }

    /**
     *
     * @methodOf Industria
     *
     * @function addProyecto
     * @description añade un proyecto
     * */
    addProyecto = () => {
        axios.post('/projects/add',{
            ...this.state.datos
        }).then(response => {
            message.success('Proyecto agregado')
            this.setState({redirect: true})
  
            this.props.setNewProject(response.data.proyecto._id)
        }).catch(error => {
            message.error('Error al crear el proyecto')
            console.log(error)
        })
    }

    /**
     *
     * @methodOf Industria
     *
     * @function setImag
     * @description añade un proyecto
     * */
    setImage = (logo) => {
        this.setState({datos:{ ...this.state.datos, logo}})
    }

    renderForm = (current)=> {
        switch(current){
            case 0:
                return <General next={this.next} values={this.state.datos} image={this.state.datos.logo} setImage={this.setImage}/>
            break;
            case 1:
                return <Industria next={this.next} prev={this.prev} values={this.state.datos}/>
            break;
            case 2:
                return <Estatus next={this.next} prev={this.prev} data={this.state.datos.estatus}/>
            break;
            case 3:
                return <Web FinishForm={this.FinishForm} prev={this.prev} values={this.state.datos}/>
            break; 
        }
    }

    render() {
        const {steps, current} = this.state

        if(this.state.redirect)
            return <Redirect to='/admin/dashboard'/>

        return (
            <Layout className="bg-white">
                <Content className="pd-1">
                    <Row>
                        <PageHeader className="font_color" title="Crear Nuevo Proyecto"/>
                    </Row>
                    <Row align="center">
                        <Col span={12} className="proyecto-content">
                            {this.renderForm(current)}
                        </Col>
                    </Row>
                </Content>
            </Layout>
        );
    }
}

export default Proyectos;
