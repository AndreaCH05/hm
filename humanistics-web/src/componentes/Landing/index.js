import React, { Component } from 'react';
import { Button, Row, Col, Carousel, Image, Form, Switch, InputNumber, Radio, Layout, Menu } from 'antd';
import { TwitterOutlined, GoogleOutlined, FacebookOutlined } from '@ant-design/icons';

import { Link } from "react-router-dom";
const axios = require("axios").default;

const { Header, Content, Footer } = Layout;

const styleButtons = {
    float: "right",
    display: "inline-flex",
    borderleft: "1px solid #e3e6f0 !important",
    margintop: "10px",
    height: "40px",
    lineheight: "3rem"
};
class Index extends Component {

    constructor(props) {
        super(props);
        this.state = {
            dataPlanes: [],
            value: 1,
            visible: false,
            loading: false,
            valorRadio: '',
            userName: '',

            idProyecto: '',
            idPlanSel: '',
            costoPlanSel: 0,
            tipoPlanSel: 'Mensual',


            pago_id: '',
            pago_costo: '',
            pago_tipo: '',
            pago_planId: '',

        }
    }

    carRef = React.createRef();

    /**
     * @memberof Index
     * @method componentDidMount
     * @description Iniciamos los valores de vista
     */
    componentDidMount() {

        this.calcularHash();
        var ft = document.getElementsByClassName("ant-layout-footer");


        ft[0].classList.add('nView');

        const pid = this.props.proId;
        this.setState({ idProyecto: pid });

        axios({
            method: 'get',
            url: '/user/logged',
            headers: { Authorization: sessionStorage.getItem('token') },
        })
            .then((response) => {
                this.setState({ userName: response.data.data.nombre });
            })

            .catch((error) => {
                console.log("error", error.response);
            });

        if (this.state.userName != "") {
            axios({
                method: 'get',
                url: '/planes',
                headers: { Authorization: sessionStorage.getItem('token') },
            })
                .then((response) => {

                    var array = response.data.data.itemsList;
                    if (array.length > 0) {
                        this.setState({
                            dataPlanes: response.data.data.itemsList,
                            valorRadio: array[0]._id
                        });
                    }
 
                    document.getElementById('planesForm');
                })

                .catch((error) => {
                    console.log("error", error.response);
                });
        }
        else {

            var dataArray = [{
                active: true,
                costo_anual: 900,
                costo_mensual: 900,
                createdAt: "2020-05-25",
                descripcion: "Plan General 1",
                nombre: "Basico",
                prospectos: 10,
                updatedAt: "2020-05-02",
                usuarios: 2,
                __v: 0,
                _id: "1"
            },
            {
                active: true,
                costo_anual: 3600,
                costo_mensual: 3600,
                createdAt: "2020-05-25",
                descripcion: "Plan Premium 1",
                nombre: "Premium",
                prospectos: 45,
                updatedAt: "2020-05-02",
                usuarios: 20,
                __v: 0,
                _id: "2"
            }
                ,
            {
                active: true,
                costo_anual: 1400,
                costo_mensual: 1400,
                createdAt: "2020-05-25",
                descripcion: "Plan Personalizado 1",
                nombre: "Personalizado",
                prospectos: 20,
                updatedAt: "2020-05-02",
                usuarios: 20,
                __v: 0,
                _id: "3"
            }
            ];

            this.setState({
                dataPlanes: dataArray,
                valorRadio: dataArray[0]._id
            });
        }
    }

    /**
     * @memberof Index
     * @method componentDidUpdate
     * @description Actualizamos los valores de vista
     */
    componentDidUpdate() {
        this.calcularHash();
    }

    /**
    * @memberof Index
    * @method calcularHash
    * @description Calcula el valor de scroll dependiendo del hash
    */
    calcularHash() {
        /* Calculo hash */
        var hash = window.location.hash.replace("#", "");
        if (hash != "") {
      
            if (hash == "secTabs") {
                var a = document.getElementById('secPrincipal').offsetHeight;
                var total = a + 40;
                document.getElementById('cntGeneral').scrollTo(0, total);
            }
            else if (hash == "secAplicaciones") {
                var a = document.getElementById('secPrincipal').offsetHeight;
                var b = document.getElementById('secTabs').offsetHeight;
                var c = document.getElementById('secMarketing').offsetHeight;
                var d = document.getElementById('secSolucion').offsetHeight;
                var total = a + b + c + d + 50;
                document.getElementById('cntGeneral').scrollTo(0, total);

            }


            else if (hash == "secPrecios") {
                var a = document.getElementById('secPrincipal').offsetHeight;
                var b = document.getElementById('secTabs').offsetHeight;
                var c = document.getElementById('secMarketing').offsetHeight;
                var d = document.getElementById('secSolucion').offsetHeight;
                var e = document.getElementById('secAplicaciones').offsetHeight;
                var f = document.getElementById('secClientes').offsetHeight;
                var g = document.getElementById('secOpiniones').offsetHeight;
                var total = a + b + c + d + e + f + g + 50;
                document.getElementById('cntGeneral').scrollTo(0, total);

            }
        }
        else {
            document.getElementById('cntGeneral').scrollTo(0, 0);
        }
    }

    /**
    * @memberof Index
    * @method onChange
    * @description Actualiza el valor del radio seleccionado
    */
    onChange = e => {
        this.setState({
            valorRadio: e.target.value,
        });
    };

    /**
    * @memberof Index
    * @method ValidarNumeros
    * @description Hace la validación del valor de un input sea numerica
    */
    ValidarNumeros = (inp) => {
        var input = inp.currentTarget, id = inp.currentTarget.id;
        if (input.value == "") {
            document.getElementById(id).value = 0;
        }
    }

    /**
    * @memberof Index
    * @method ShowModal
    * @description Muestra modal
    */
    ShowModal = () => {
  
        this.setState({ visible: true });
    }

    /**
    * @memberof Index
    * @method onCancel
    * @description Oculta modal
    */
    onCancel = () => {
        this.setState({ visible: false });
    }

    /**
    * @memberof Index
    * @method onChangeSwitch
    * @description Realiza calculos en cambios de plan
    */
    onChangeSwitch(item) {
        var dataPlanes = this.state.dataPlanes, costo_mensual = 0, costo_anual = 0;

        for (let index = 0; index < dataPlanes.length; index++) {
            var element = dataPlanes[index];
            if (element._id == item) {
                costo_mensual = element.costo_mensual;
                costo_anual = element.costo_anual;
                break;
            }
        }


        var tipoSwt = document.getElementById('tipoSwt-' + item);
        var costo = document.getElementById("costo-" + item);

        var tipoPlan = (tipoSwt == null) ? 'Anual' : (tipoSwt.className.includes('ant-switch-checked')) ? 'Mensual' : 'Anual';
        costo.textContent = (tipoPlan == 'Mensual') ? costo_mensual : costo_anual;


    }

    /**
     *
     *
     * @param {*} evt
     * @param {*} index
     * @memberof Index
     */
    openTab(evt, index) {
        var i, tabcontent, tablinks;
        tabcontent = document.getElementsByClassName("tabcontent");
        for (i = 0; i < tabcontent.length; i++) {
            tabcontent[i].style.display = "none";
        }
        tablinks = document.getElementsByClassName("tablinks");
        for (i = 0; i < tablinks.length; i++) {
            tablinks[i].className = tablinks[i].className.replace(" active", "");
        }
        document.getElementById(index).style.display = "block";
        evt.currentTarget.className += " active";
    }


    render() {


        var token = sessionStorage.getItem('token')

        return (
            <Layout className="landing-layout">
                <Header className="landing-header">
                    <Menu className="landing-menu" mode="horizontal" style={{ lineHeight: '100px' }}>
                        <Menu.Item style={{ opacity: 1, minHeight: "80px" }}>
                            <Link to="/">
                                <img src={"/images/Logo-R.png"} height={80} style={{ top: 2, position: "relative" }} />
                            </Link>
                        </Menu.Item>
                        <Menu.Item >
                            <Link to="/#secTabs">
                                ¿Qué es?
                        </Link>
                        </Menu.Item>
                        <Menu.Item >
                            <Link to="/#secAplicaciones">
                                Aplicaciones
                        </Link>
                        </Menu.Item>
                        <Menu.Item >
                            <Link to="/#secPrecios" >
                                Precios
                        </Link>
                        </Menu.Item>

                        <Menu.Item disabled style={{ cursor: "default", opacity: 1 }}>
                            <span style={{ paddingRight: "20px", borderRight: "solid 2.5px white", height: "50px", display: "inherit", marginBottom: "-18px" }}> </span>
                        </Menu.Item>

                        {token == null ?
                            <Menu.Item style={styleButtons} id="login-opc"  >
                                <Link to="/login" >
                                    <Button className="btn-login">Iniciar Sesión</Button>
                                </Link>
                            </Menu.Item>
                            :
                            <Menu.Item style={styleButtons}  >
                                <Link to="/admin/dashboard" >
                                    Dashboard
                                </Link>
                            </Menu.Item>
                        }

                        {token == null ?
                            <Menu.Item style={styleButtons}>
                                <Link to="/register">
                                    REGISTRARME
                        </Link>
                            </Menu.Item>
                            :
                            null}
                    </Menu>
                </Header>
                <Content className="bg-gradiant public-content" >
                    <div id="cntGeneral">
                        {/*Principal*/}
                        <section id="secPrincipal">
                            <Row>
                                <Col xs={24} md={12} lg={12} xl={12} className="pd-2">
                                    <hr className="text-white line line-white" ></hr>
                                    <div className="secheader" >
                                        <h1 className="title text-white">Aumenta tus Ventas <br></br>en Minutos</h1>
                                        <h3 className="sub-title text-white">Controla y aumenta tus ventas en un solo lugar.</h3>
                                        <Button type="primary" className="btn btn-prueba btn-white" href="/#">Prueba Gratis</Button>
                                        <Button type="primary" className="btn btn-demo btn-white-outline " href="/#">Ver Demo</Button>
                                    </div>

                                </Col>
                                <Col xs={24} md={12} lg={12} xl={12} className="img-center">
                                    <div className="img-center image-full-size">
                                        <img src={"images/bg.jpg"} className="landing-header-img" ></img>
                                    </div>
                                </Col>
                            </Row>
                        </section>
                        {/*Tabs*/}
                        <section className="bg-white" id="secTabs">
                            <Row>
                                <Col span={24} className="pd-2">
                                    <hr className="line line-gray img-center"></hr>
                                </Col>
                            </Row>
                            <Row className="pd-2">
                                <Col span={10} >
                                    <h3 className="text-purple" style={{ fontWeight: '800' }}> ¿QUÉ ES?</h3>
                                    <h2 className="title ">Este es el futuro<br></br>de las ventas.</h2>
                                    <div className="custom-tab ">
                                        <Button className="tablinks" onClick={event => this.openTab(event, 'tab1')}><span className="tab-index ">01</span>Titulo</Button><span className="custom-tab-selected"></span>
                                        <Button className="tablinks" onClick={event => this.openTab(event, 'tab2')}><span className="tab-index ">02</span>Titulo</Button><span className=""></span>
                                        <Button className="tablinks" onClick={event => this.openTab(event, 'tab3')}><span className="tab-index ">03</span>Titulo</Button><span className=""></span>
                                        <Button className="tablinks" onClick={event => this.openTab(event, 'tab4')}><span className="tab-index ">04</span>Titulo</Button><span className=""></span>
                                        <Button className="tablinks" onClick={event => this.openTab(event, 'tab5')}><span className="tab-index ">05</span>Titulo</Button><span className=""></span>
                                        <Button className="tablinks" onClick={event => this.openTab(event, 'tab6')}><span className="tab-index ">06</span>Titulo</Button><span className=""></span>
                                        <Button className="tablinks" onClick={event => this.openTab(event, 'tab7')}><span className="tab-index ">07</span>Titulo</Button><span className=""></span>
                                    </div>
                                </Col>
                                <Col span={14}>
                                    <div id="tab1" className="tabcontent active">
                                        <Col>
                                            <div className="img-center text-center"  >
                                                <div className="background-points"></div>
                                                <img src={"images/imagen-mails.png"} className="landing-header-img front-image" ></img>
                                            </div>
                                        </Col>

                                        <Col className="mt-20" >
                                            <h3 className='titulo-landing-tab'> TITULO 1</h3>
                                            <p className='texto-landing-tab' >
                                                Nosotros creamos y corremos anuncios digitales por medios digitales para entregarte prospectos
                                                clientes perfilados y segmentados para incrementar las ventas de tus productos/ servicios.
                                    </p>
                                        </Col>
                                    </div>
                                    <div id="tab2" className="tabcontent">
                                        <Col>
                                            <div className="img-center text-center"  >
                                                <div className="background-points"></div>
                                                <img src={"images/imagen-mails.png"} className="landing-header-img front-image" ></img>
                                            </div>
                                        </Col>

                                        <Col className="mt-20" >
                                            <h3 className='titulo-landing-tab'> TITULO 2</h3>
                                            <p className='texto-landing-tab' >
                                                Nosotros creamos y corremos anuncios digitales por medios digitales para entregarte prospectos
                                                clientes perfilados y segmentados para incrementar las ventas de tus productos/ servicios.
                                            </p>
                                        </Col>
                                    </div>
                                    <div id="tab3" className="tabcontent">
                                        <Col>
                                            <div className="img-center text-center"  >
                                                <div className="background-points"></div>
                                                <img src={"images/imagen-mails.png"} className="landing-header-img front-image" ></img>
                                            </div>
                                        </Col>

                                        <Col className="mt-20" >
                                            <h3 className='titulo-landing-tab'> TITULO 3</h3>
                                            <p className='texto-landing-tab' >
                                                Nosotros creamos y corremos anuncios digitales por medios digitales para entregarte prospectos
                                                clientes perfilados y segmentados para incrementar las ventas de tus productos/ servicios.
                                    </p>
                                        </Col>
                                    </div>
                                    <div id="tab4" className="tabcontent">
                                        <Col>
                                            <div className="img-center text-center"  >
                                                <div className="background-points"></div>
                                                <img src={"images/imagen-mails.png"} className="landing-header-img front-image" ></img>
                                            </div>
                                        </Col>

                                        <Col className="mt-20" >
                                            <h3 className='titulo-landing-tab'> TITULO 4</h3>
                                            <p className='texto-landing-tab' >
                                                Nosotros creamos y corremos anuncios digitales por medios digitales para entregarte prospectos
                                                clientes perfilados y segmentados para incrementar las ventas de tus productos/ servicios.
                                    </p>
                                        </Col>
                                    </div>
                                    <div id="tab5" className="tabcontent">
                                        <Col>
                                            <div className="img-center text-center"  >
                                                <div className="background-points"></div>
                                                <img src={"images/imagen-mails.png"} className="landing-header-img front-image" ></img>
                                            </div>
                                        </Col>

                                        <Col className="mt-20" >
                                            <h3 className='titulo-landing-tab'> TITULO 5</h3>
                                            <p className='texto-landing-tab' >
                                                Nosotros creamos y corremos anuncios digitales por medios digitales para entregarte prospectos
                                                clientes perfilados y segmentados para incrementar las ventas de tus productos/ servicios.
                                    </p>
                                        </Col>
                                    </div>
                                    <div id="tab6" className="tabcontent">
                                        <Col>
                                            <div className="img-center text-center"  >
                                                <div className="background-points"></div>
                                                <img src={"images/imagen-mails.png"} className="landing-header-img front-image" ></img>
                                            </div>
                                        </Col>

                                        <Col className="mt-20" >
                                            <h3 className='titulo-landing-tab'> TITULO 6</h3>
                                            <p className='texto-landing-tab' >
                                                Nosotros creamos y corremos anuncios digitales por medios digitales para entregarte prospectos
                                                clientes perfilados y segmentados para incrementar las ventas de tus productos/ servicios.
                                    </p>
                                        </Col>
                                    </div>
                                    <div id="tab7" className="tabcontent">
                                        <Col>
                                            <div className="img-center text-center"  >
                                                <div className="background-points"></div>
                                                <img src={"images/imagen-mails.png"} className="landing-header-img front-image" ></img>
                                            </div>
                                        </Col>

                                        <Col className="mt-20" >
                                            <h3 className='titulo-landing-tab'> TITULO 7</h3>
                                            <p className='texto-landing-tab' >
                                                Nosotros creamos y corremos anuncios digitales por medios digitales para entregarte prospectos
                                                clientes perfilados y segmentados para incrementar las ventas de tus productos/ servicios.
                                    </p>
                                        </Col>
                                    </div>
                                </Col>
                            </Row>
                        </section>

                        <section className="bg-white" id="secMarketing">
                            {/*Marketing*/}
                            <Row>
                                <Col xs={24} className="text-center">
                                    <h2 className="title text-purple" style={{ fontWeight: '900 !important' }}>Olvidate del Marketing</h2>
                                    <p className="texto-landing-tab">
                                        Nosotros creamos y corremos anuncios digitales por medios digitales para <br></br>
                                entregarte <label style={{ fontWeight: '800', color: "#000" }}>prospectos clientes</label> perfilados y segmentados para incrementar <br></br>
                                las ventas de tus productos/ servicios.
                            </p>
                                    <Button type="primary" className="mt-20 btn btn-purple up" href="/#">Aprende MáS</Button>
                                </Col>
                                <Col span={24} className="img-center">
                                    <div className="img-center img-full-size pd-2" >
                                        <div className="background-points-bottom-right"></div>
                                        <img src={"images/imagen-mails.png"} className="img-center front-image" ></img>
                                    </div>
                                </Col>
                            </Row>
                        </section>

                        <section className="bg-white" id="secSolucion">
                            {/*Solución*/}
                            <Row>
                                <Col span={24} className="text-center">
                                    <h2 className="title text-gray pd-2" >Solución Todo-En-Uno</h2>
                                    <div style={{ marginBottom: '45px', display: 'block' }}>
                                        <div className="img-center" style={{ width: '100%', margin: 'auto', textAlign: 'center', padding: '2px', verticalAlign: 'middle', height: '100%' }}>
                                            <div style={{ background: 'linear-gradient(193.25deg, #FF7D4B 0%, #FFBB4B 80%)', height: '10%', maxHeight: '330px', marginTop: '60px' }}>
                                                <img src={"images/imagen-mails.png"} className="" style={{ width: '98%', maxWidth: '1000px', padding: '5%', paddingTop: '0px', marginTop: '-50px' }} ></img>
                                            </div>
                                        </div>
                                    </div>
                                    <Col span={24} className="img-center mt-20  pd-2">
                                        <p className="texto-landing-tab mt-20">
                                            Controla y maneja los prospectos clientes de tu empresa, tus ventas y a tus <br></br>
                                    asesores de venta desde un mismo lugar. Centraliza tu información y <br></br>
                                            <label style={{ fontWeight: '800', color: "#000" }}> aumenta tus ingresos desde el primer mes. </label>
                                        </p>
                                        <Button type="primary" className="mt-20 btn btn-orange up" href="/#">Comenzar</Button>
                                    </Col>
                                </Col>

                            </Row>
                        </section>

                        <section className="bg-white" id="secAplicaciones">
                            <Row justify="center">
                                <Col span={24} className="text-center">
                                    <h2 className="title text-gray text-center"> Aplicaciones </h2>
                                </Col>
                                <Col span={24} className="text-center">
                                    <Carousel ref={this.carRef} arrows={true} centerMode={true} className="carousel-landing pd-1">
                                        <Row className="contenedor-card ">
                                            <div className="card-aplicaciones" >
                                                <div className="carousel-item-border-left"></div>
                                                <div >
                                                    <p className=" carousel-title text-purple" > <span>01</span> Inmobiliario</p>
                                                </div>


                                                <Row align="center">
                                                    <Col span={12}>
                                                        <div className="img-center" >
                                                            <img src={"images/imagen-mails.png"} width='90%' ></img>
                                                        </div>
                                                    </Col>
                                                    <Col span={12}>
                                                        <div className="img-center" >
                                                            <img src={"images/imagen-mails.png"} width='90%' maxWidth="500px" ></img>
                                                        </div>
                                                    </Col>
                                                </Row>
                                                <Row align="center">
                                                    <Col span={24}>
                                                        <p className="texto-landing-tab mt-20" style={{
                                                            FontSize: '20px',
                                                            TextAlign: 'center',
                                                            Float: 'left',
                                                            Width: '100%'
                                                        }} >
                                                            hdlkahbsoldhbaslkjdbhoalsbdcljkasb <br></br>
                                                bcdljkabsdljbcljksdbclabdcllscblhd <br></br>
                                                bsoldhbaslkjdbhoalsbdcljkasbclasbc <br></br>
                                                absdljbcljksdbclabdcllscbl
                                                </p>
                                                    </Col>

                                                    <Col span={24}>
                                                        <Button type="primary" className="mt-20 btn btn-purple" href="/#">Ver Casos</Button>
                                                    </Col>
                                                </Row>
                                            </div>
                                        </Row>
                                        <Row className="contenedor-card ">
                                            <div className="card-aplicaciones" >
                                                <div className="carousel-item-border-left"></div>
                                                <div >
                                                    <p className=" carousel-title text-purple" > <span>01</span> Inmobiliario</p>
                                                </div>
                                                <Row align="center">
                                                    <Col span={12}>
                                                        <div className="img-center" >
                                                            <img src={"images/imagen-mails.png"} width='90%' ></img>
                                                        </div>
                                                    </Col>
                                                    <Col span={12}>
                                                        <div className="img-center" >
                                                            <img src={"images/imagen-mails.png"} width='90%' maxWidth="500px" ></img>
                                                        </div>
                                                    </Col>
                                                </Row>
                                                <Row align="center">
                                                    <Col span={24}>
                                                        <p className="texto-landing-tab mt-20" style={{
                                                            FontSize: '20px',
                                                            TextAlign: 'center',
                                                            Float: 'left',
                                                            Width: '100%'
                                                        }} >
                                                            hdlkahbsoldhbaslkjdbhoalsbdcljkasb <br></br>
                                                bcdljkabsdljbcljksdbclabdcllscblhd <br></br>
                                                bsoldhbaslkjdbhoalsbdcljkasbclasbc <br></br>
                                                absdljbcljksdbclabdcllscbl
                                                </p>
                                                    </Col>

                                                    <Col span={24}>
                                                        <Button type="primary" className="mt-20 btn btn-morado" href="/#">Ver Casos</Button>
                                                    </Col>
                                                </Row>
                                            </div>
                                        </Row>
                                        <Row className="contenedor-card ">
                                            <div className="card-aplicaciones" >
                                                <div className="carousel-item-border-left"></div>
                                                <div >
                                                    <p className=" carousel-title text-purple"> <span>01</span> Inmobiliario</p>
                                                </div>
                                                <Row align="center">
                                                    <Col span={12}>
                                                        <div className="img-center" >
                                                            <img src={"images/imagen-mails.png"} width='90%' ></img>
                                                        </div>
                                                    </Col>
                                                    <Col span={12}>
                                                        <div className="img-center" >
                                                            <img src={"images/imagen-mails.png"} width='90%' maxWidth="500px" ></img>
                                                        </div>
                                                    </Col>
                                                </Row>
                                                <Row align="center">
                                                    <Col span={24}>
                                                        <p className="texto-landing-tab mt-20" style={{
                                                            FontSize: '20px',
                                                            TextAlign: 'center',
                                                            Float: 'left',
                                                            Width: '100%'
                                                        }} >
                                                            hdlkahbsoldhbaslkjdbhoalsbdcljkasb <br></br>
                                                bcdljkabsdljbcljksdbclabdcllscblhd <br></br>
                                                bsoldhbaslkjdbhoalsbdcljkasbclasbc <br></br>
                                                absdljbcljksdbclabdcllscbl
                                                </p>
                                                    </Col>

                                                    <Col span={24}>
                                                        <Button type="primary" className="mt-20 btn btn-morado" href="/#">Ver Casos</Button>
                                                    </Col>
                                                </Row>
                                            </div>
                                        </Row>

                                    </Carousel>
                                </Col>
                            </Row>
                        </section>

                        <section className="bg-white" id="secClientes">
                            {/*Clientes*/}
                            <Row justify="center">
                                <Col span={24} className="text-center">
                                    <h2 className="subtitle text-gray text-center">  Algunos de nuestros clientes  </h2>
                                </Col>
                                <Col span={24} className="center">
                                    <Row className="mt-20 " gutter={[16, 16]}>
                                        <Col md={12} xxl={6} xl={6} lg={6} className="mt-20">
                                            <div className="img-center" >
                                                <a href="#" target="blank">
                                                    <Image className="img-center" src={"images/clientes/cliente1.png"} width={'80%'} preview={false} />
                                                </a>
                                            </div>
                                        </Col>
                                        <Col md={12} xxl={6} xl={6} lg={6} className="mt-20">
                                            <div className="img-center" >
                                                <a href="#" target="blank">
                                                    <Image className="img-center" src={"images/clientes/cliente2.png"} width={'80%'} preview={false} />
                                                </a>
                                            </div>
                                        </Col>
                                        <Col md={12} xxl={6} xl={6} lg={6} className="mt-20">
                                            <div className="img-center" >
                                                <a href="#" >
                                                    <Image className="img-center" src={"images/clientes/cliente4.png"} width={'80%'} preview={false} />
                                                </a>
                                            </div>
                                        </Col>
                                        <Col md={12} xxl={6} xl={6} lg={6} className="mt-20">
                                            <div className="img-center" >
                                                <a href="#" target="blank">
                                                    <Image className="img-center" src={"images/clientes/cliente3.png"} width={'80%'} preview={false} />
                                                </a>
                                            </div>
                                        </Col>

                                    </Row>
                                </Col>

                            </Row>
                        </section>

                        <section className="bg-white" id="secOpiniones">
                            {/*Opiniones*/}
                            <Row className="pd-2 " align="center" >
                                <Col offset={1} xs={23} md={11} lg={7} className="mt-20 contenedor-opinion" >
                                    <div className="img-center" style={{ margin: '10px 0px', width: '100%' }} >
                                        <img src={"images/barra-comment.png"} width='90%' maxWidth='270px'></img>
                                    </div>
                                    <div className="pd-1">
                                        <p className="text-opinion"> “You made it so simple. My new <br />
                                site is so much faster and easier <br />
                                to work with than my old site. I  <br />
                                just choose the page, make the <br />
                                change and click save.”
                                </p>
                                    </div>
                                    <div className="contInfo-opinion">
                                        <img src={"images/opiniones/cameron.png"} className="img-opinion" width='65px'></img>
                                        <label className="autor-opinion">Cameron Anderson </label>
                                        <label className="fuente-opinion">From CrazyEggs.com </label>
                                    </div>
                                </Col>
                                <Col offset={1} xs={23} md={11} lg={7} className="mt-20 contenedor-opinion" >
                                    <div className="img-center" style={{ margin: '10px 0px', width: '100%' }} >
                                        <img src={"images/barra-comment.png"} className="" width='90%' maxWidth='270px'></img>
                                    </div>
                                    <div className="pd-1">
                                        <p className="text-opinion">
                                            “Simply the best. Better than all <br />
                                the rest. I’d recommend this<br />
                                product to beginners and <br />
                                advanced users.”
                                </p>
                                    </div>
                                    <div className="contInfo-opinion">
                                        <img src={"images/opiniones/ellen.png"} className="img-opinion" width='65px'></img>
                                        <label className="autor-opinion">Ellen Austin</label>
                                        <label className="fuente-opinion">From CrazyEggs.com </label>
                                    </div>
                                </Col>
                                <Col offset={1} xs={23} md={11} lg={7} className="mt-20 contenedor-opinion" >
                                    <div className="img-center" style={{ margin: '10px 0px', width: '100%' }} >
                                        <img src={"images/barra-comment.png"} className="" width='90%' maxWidth='280px' float="left" style={{ float: 'left' }}></img>
                                    </div>
                                    <div className="pd-1">
                                        <p className="text-opinion">“This is a top quality product.<br />
                                No need to think twice before<br />
                                purchasing, you simply could <br />
                                not go wrong” </p>
                                    </div>

                                    <div className="contInfo-opinion">
                                        <img src={"images/opiniones/cameron.png"} className="img-opinion" width='65px'></img>
                                        <label className="autor-opinion">Cameron Anderson </label>
                                        <label className="fuente-opinion">From CrazyEggs.com </label>
                                    </div>
                                </Col>
                            </Row>
                        </section>

                        <section className="bg-white " id="secPrecios" >
                            <Row align="center" justify="space-around">
                                <Col span={24} className="text-center">
                                    <h2 className="title text-gray"> Precios </h2>
                                </Col>
                                <Col span={24}>
                                    <Form layout={"vertical"} onFinish={this.handleSubmit} id="planesForm" ref={this.formRefPlanes} className="w100">
                                        <Radio.Group className="w100" defaultValue="gratis" size="large" onChange={this.onChange} value={this.state.valorRadio}>
                                            <Row align="center" justify="cnenter" gutter={[30, 30]} className="pd-2">
                                                {this.state.dataPlanes.map((plan, index) => {
                                                    if (plan.active) {
                                                        let idSwitch = "tipoSwt-" + plan._id;
                                                        let idInput = "inpNum-" + plan._id;
                                                        let idCosto = "costo-" + plan._id;
                                                        let claseRow = '';
                                                        switch (index) {
                                                            case 0:
                                                                claseRow = 'div-plan div-gratis'
                                                                break;
                                                            case 1:
                                                                claseRow = 'div-plan div-premium'
                                                                break;
                                                            case 2:
                                                                claseRow = 'div-plan div-personalizado'
                                                                break;
                                                            default:
                                                                break;
                                                        }

                                                        return <Col className={claseRow} xs={24} sm={18} md={11} lg={8} xl={8} xxl={8} >
                                                            <Radio.Button value={plan._id} className="radio-button-plan">
                                                                <div className={"pd-1 ", claseRow} >
                                                                    <div className="img-center text-center">
                                                                        <Image className="img-center" src={"images/planes/plan-" + index + ".png"} preview={false} />
                                                                    </div>
                                                                    <h1 style={{ textTransform: 'uppercase' }}>{plan.nombre}</h1>
                                                                    <div className="text-center div-plan-precio" >
                                                                        <p className="plan-precio-text" id={idCosto}> <sup>$ </sup>{plan.costo_mensual}  <small> MXN</small> </p>
                                                                    </div>
                                                                    <div className="text-center div-plan-switch">
                                                                        {(plan.costo == 0) ? '' : <p className="plan-switch-text">Mensual<Switch id={idSwitch} onChange={(e) => this.onChangeSwitch(plan._id)} />Anual</p>}
                                                                    </div>
                                                                    <div className="text-center div-plan-numero">
                                                                        <InputNumber placeholder="0" min={1} step={1} defaultValue={plan.prospectos} id={idInput} disabled readOnly onBlur={(e) => this.ValidarNumeros(e)} />
                                                                    </div>
                                                                    <Row className="text-center div-plan-informacion">
                                                                        <p>Prospectos Humanistics al Mes</p>
                                                                        <p><strong>{plan.usuarios}</strong> Usuarios</p>{(plan.descripciones != undefined) ? <p><strong>Anuncios </strong> Redes sociales</p> : ''}
                                                                    </Row>
                                                                    <Col span={24} style={{ textAlign: "center", margin: '10px' }}>
                                                                        <span className="spnAccionesUsu" >
                                                                            <a title="Editar" className="purple-icon" style={{ padding: '5px 10px', color: '#FFF' }}>
                                                                                Elegir Plan
                                                                                                </a>
                                                                        </span>

                                                                    </Col>
                                                                </div>
                                                            </Radio.Button>
                                                        </Col>
                                                    }
                                                })
                                                }
                                            </Row>
                                        </Radio.Group>
                                    </Form>
                                </Col>
                            </Row>
                        </section>

                        <section className="footer-landing pd-2 " id="secFooter" >
                            {/*Footer*/}
                            <Row id="footer-landing" >
                                <Row style={{ width: '100%' }}>
                                    <Col xs={24} md={12} >
                                        <div >
                                            <a href="/"> <img src={"images/logo-R.png"} width="70%" style={{ maxWidth: '380px' }}></img> </a>
                                        </div>

                                        <ol className="footer-links">
                                            <li><a>TEXTO</a></li>
                                            <li><a>TEXTO</a></li>
                                            <li><a>TEXTO</a></li>
                                        </ol>
                                    </Col>

                                    <Col xs={24} md={12} >
                                        <Row style={{ width: '100%', marginTop: '25px' }}>
                                            <Col xs={24} md={12} >
                                                <ol className="footer-links">
                                                    <label>Team</label>
                                                    <li><a>Catalog</a></li>
                                                    <li><a>Popular</a></li>
                                                    <li><a>Features</a></li>
                                                </ol>
                                            </Col>
                                            <Col xs={24} md={12} >
                                                <ol className="footer-links">
                                                    <label>Support</label>
                                                    <li><a>Catalog</a></li>
                                                    <li><a>Popular</a></li>
                                                    <li><a>Features</a></li>
                                                </ol>
                                            </Col>
                                        </Row>
                                    </Col>
                                </Row>

                                <Row style={{ width: '100%', marginTop: '20px' }}>
                                    <Col span={24} xs={6} xxl={10} style={{ textAlign: 'left' }}>
                                        <Col className="text-white">© 2020 Humanistics. Todos los Derechos Reservados.</Col>
                                    </Col>
                                    <Col span={24} xs={8} xxl={10} style={{ textAlign: 'left' }}>
                                        <Row style={{ width: '100%' }}>
                                            <Col xs={24} md={8} xl={7} className="text-white">Privacy Policy </Col>
                                            <Col xs={24} md={8} xl={7} className="text-white">Terms & Conditions </Col>
                                            <Col xs={24} md={8} xl={7} className="text-white">Site map </Col>
                                        </Row>

                                    </Col>
                                    <Col span={24} xs={8} xxl={4} className="center icons-redes" style={{ textAlign: 'center', marginTop: '0px' }}>
                                        <a> <TwitterOutlined /> </a>
                                        <a> <FacebookOutlined /> </a>
                                        <a> <GoogleOutlined />  </a>
                                    </Col>
                                </Row>
                            </Row>
                        </section>

                    </div>
                </Content>
                <Footer className="footer" style={{ textAlign: 'center', height: "20px", paddingTop: "12px" }}>Humanistics © 2020</Footer>
            </Layout>
        );
    }
}

export default Index;