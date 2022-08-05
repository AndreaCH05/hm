import React, { Component } from 'react';
import { render } from 'react-dom';

import { Layout, Row, Col, Spin, Typography } from 'antd'

import { Link, DirectLink, Element, Events, animateScroll as scroll, scrollSpy, scroller } from 'react-scroll'

import Bienvenido from '../componentes/Auth/Steps/Bienvenido'

import Avatar from '../componentes/Auth/Steps/avatar'

import Negocio from '../componentes/Auth/Steps/Proyecto/negocio'
import Configuracion from '../componentes/Auth/Steps/configuracion'
import Marketing from '../componentes/Auth/Steps/Marketing/marketing'

import Estatus from '../componentes/Auth/Steps/estatus'
import Planes from '../componentes/Auth/Steps/Prospectos/planes'
import Usuarios from '../componentes/Auth/Steps/Usuarios/usuarios'


import Wheel from '../componentes/Auth/Steps/Wheel/Wheel'

import '../css/Steps/index.css'

const axios = require("axios").default;


const { Title, Paragraph, Text, } = Typography;


export default class StepsRoutes extends Component {

  constructor(props) {
    super(props)

    this.state = {
      current_step: 0,
      steps: [
        {
          title: "Bienvenida",
          // description: "Sección Inicial"
        },
        {
          title: "Avatar",
          // description: "Seleccione el color o el avatar."
        },
        {
          title: "Proyecto",
          // description: "Proyecto general"
        },
        {
          title: "Empresa",
        },
        {
          title: "Marketing",
        },
        {
          title: "Estatus",
        },
        {
          title: "Prospectos",
        },
        {
          title: "Asesores",
        },
      ],
      selected: 0,


      loading: true,


      guardar: true,
      nuevoProyecto: true,
      dataStep1: null,
      proyecto_id: '',

      pr_nombre: '{{Proyecto}}',
      pr_logo: '',
      pr_pagado: false,


      data_nuevosEstatus: [],
      user: {},
      proyecto: {

        /** Información general del proycto (step 1) **/
        nombre: '',
        logo: '',
        producto_servicio: '',

        /** Información Especifica del proycto (step 2) **/
        industria_id: '',
        descripcion_general: '',
        prospectos_deseados: 0,

        /** Marketing  (step 3) **/
        pagina_web: '',
        facebook: '',
        instagram: '',
        activo: true
      }
    };

    this.scrollToTop = this.scrollToTop.bind(this);

    this.myRef = React.createRef();

  }

  general = React.createRef();
  refAvatar = React.createRef();
  refNegocio = React.createRef();
  refConfiguracion = React.createRef();
  refEstatus = React.createRef();
  refPlanes = React.createRef();
  refUsuarios = React.createRef();


  /**
 * @memberof StepsRoutes
 *
 * @method componentDidMount
 * @description 
 * Se cargan eventos scrolls
 * Se carga info de usuario logeado
 */
  componentDidMount() {

    axios.defaults.headers.common['Authorization'] = sessionStorage.getItem('token');

    scrollSpy.update();

    axios({
      method: 'get',
      url: '/user/logged',
    })
      .then((response) => {
        var dataUser = response.data.data;

        console.log('dataUserr', dataUser
        );
        this.setState({
          user: dataUser,
          loading: false
        });
      })

      .catch((error) => {
        console.log("error", error.response);
      });

  }

  /**
    * @memberof StepsRoutes
    *
    * @method scrollToTop
    * @description 
    * Se manda scroll a top
    */
  scrollToTop() {
    scroll.scrollToTop();
  }


  /**
  * @memberof StepsRoutes
  *
  * @method componentWillUnmount
  * @description 
  * Se ejecutan eventos de scroll
  */
  componentWillUnmount() {
    Events.scrollEvent.remove('begin');
    Events.scrollEvent.remove('end');
  }



  /**
  * @memberof StepsRoutes
  *
  * @method goTo
  * @description 
  * Se mueve scroll al elemento (i)
  */
  goTo = (i) => {
    this.setState({ selected: i })
    scroller.scrollTo(i, {
      duration: 500,
      smooth: true,
      ignoreCancelEvents: true,

      containerId: 'containerElement',
    })
  }


  /**
* @memberof StepsRoutes
*
* @method setProjectInfo
* @description 
* Se establece la información del proyecto dependiendo del elemento
*/
  setProjectInfo = async (data) => {
    if (data != undefined) {
      this.state.proyecto = data
    }
  }

  render() {

    const { current_step, steps, visibleStyleThreshold } = this.state
    const { determinePlacement, handleClick, setProjectInfo } = this

    return (
      <Layout className="steps">
        <Row className="steps-container">
          <Col span={8} className="steps-menu-container">

            <Row>
              <img src="/images/logo-h.png" className="step-logo" />
            </Row>
            <Row>
              <div className="container" style={{ width: '100%' }}>
                <section className="outer-container">
                  <Wheel onChange={element_id => this.goTo(element_id)} steps={this.state.steps} selected={this.state.selected} />
                </section>
              </div>
            </Row>
          </Col>

          <Col span={16} className="steps-form">
            <Element
              onClick={(e) => e.preventDefault()}
              name="containerElement"
              className="steps-form-container"
              id="containerElement">

              <Spin spinning={this.state.loading}>
                <Element name="0" key={0} className="step-form" id="bienvenido">
                  <Bienvenido
                    user={this.state.user}
                    onNext={() => this.goTo(1)} />
                </Element>
                <Element name="1" key={1} className="step-form">
                  <Avatar onNext={() => this.goTo(2)} ref={this.refAvatar} />
                </Element>
                <Element name="2" className="step-form" >
                  <Negocio onNext={() => this.goTo(3)} ref={this.refNegocio} setProjectInfo={(e) => this.setProjectInfo(e)} dataProject={this.state.proyecto} selected={this.state.selected} />
                </Element>
                <Element name="3" key={3} className="step-form border">
                  <Configuracion onNext={() => this.goTo(4)} ref={this.general} setProjectInfo={(e) => this.setProjectInfo(e)} dataProject={this.state.proyecto} />
                </Element>
                <Element name="4" key={4} className="step-form border" style={{ maxHeigth: '100vh', overflowX: 'auto' }}>
                  <Marketing onNext={() => this.goTo(5)} ref={this.general} setProjectInfo={(e) => this.setProjectInfo(e)} dataProject={this.state.proyecto} />
                </Element>

                <Element name="5" className="step-form">
                  <Estatus proyecto={this.state.proyecto} onNext={() => this.goTo(6)} ref={this.refEstatus} />
                </Element>W

                <Element name="6" className="step-form">
                  <Planes
                    ref={this.refPlanes}
                    proyecto={this.state.proyecto}
                    onNext={() => this.goTo(7)}
                  />
                </Element>


                <Element name="7" key={7} className="step-form">
                  <Usuarios
                    ref={this.refUsuarios}
                    onNext={() => this.goTo(8)}
                    setProjectInfo={(e) => this.setProjectInfo(e)}
                    dataProject={this.state.proyecto}
                    selected={this.state.selected}
                  />
                </Element>

              </Spin>
            </Element>

          </Col>
        </Row>
      </Layout>
    )
  }

};