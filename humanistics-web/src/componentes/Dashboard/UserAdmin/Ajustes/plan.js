import React, { Component } from "react";
import { Layout, Col, Row, Tag, Table, Modal, Form, Radio, Switch, InputNumber, Spin, message, Button, Image } from "antd";
import moment from 'moment';
import { Redirect } from "react-router-dom";
import { Paypear } from './../../../Widgets/paypear/index'
import { DownloadOutlined, ExclamationCircleOutlined, } from '@ant-design/icons';


const { Content } = Layout;
const axios = require('axios').default;
const { confirm } = Modal;

const dateFormat = 'YYYY/MM/DD';
const columns = [
    {
        title: '#',
        dataIndex: 'index',
        key: 'index',

    },
    {
        title: 'Plan',
        dataIndex: 'plan',
        key: 'plan',
    },

    {
        title: 'Fecha',
        dataIndex: 'fecha',
        key: 'fecha',

    },
    {
        title: 'Estatus',
        dataIndex: 'estatus',
        key: 'estatus',
        render: (text, record) => (
            record ? <Tag color="#64FF00">Activo</Tag> : <Tag color="red">Inactivo</Tag>
        ),
    },
    {
        title: 'Acciones',
        key: 'actions',
        render: (text, record) => (
            <span className="spnAccionesUsu" >
                <a title="Editar" className="purple-icon"   ><DownloadOutlined /></a>
            </span>
        ),
    },
];

/**
 *
 *
 * @class Plan
 * @extends {Component}
 */
class Plan extends Component {
    constructor(props) {
        super(props)

        this.state = {
            loading: true,
            nombreProyecto: "",
            plan: [],
            usuario: [],
            pago: [],

        }
    }
    /**
    * @memberof Plan
    *
    * @method componentDidMount
    * @description  Al montar el componente trae los datos de los usuarios y los asigna al state.users
    *
    **/

    componentDidMount() {
        axios.defaults.headers.get['Authorization'] = sessionStorage.getItem('token');
        const user = {
            rol_id: {
                nombre: sessionStorage.getItem("rol")
            }

        }
   
        this.LoadData(user);

    }
    /**
   * @memberof CrearAutomatizacion
   *
   * @method LoadData
   * @description  Si es una edicion de usuario se manda una peticion para traer la informacion del servidor
   *
   **/
    LoadData = async (user) => {
        axios.post('/checkout/id',
            { user },
            {
                headers: { Authorization: sessionStorage.getItem('token') },
            })
            .then((response) => {
       
                this.setState({
                    plan: response.data.data.plan_id,
                    pago: response.data.data,
                    usuario: response.data.data.usuarios_id
                })

            })
            .catch((error) => {
                console.log("error pago", error);
                if (error.status >= 300) {
                    Modal.info({
                        title: error.response.status,
                        content: error.response.data
                    })
                }
            });
        this.setState({ loading: false });


    }

    render() {
        var pago = this.state.pago
        var usuario = this.state.usuario
        var plan = this.state.plan
        var loading = this.state.loading


        return (

            <Layout className="bg-white">
                <Content className="pd-1" >
                    <Row>
                        <h3 className="font_color up"  > Plan</h3>
                    </Row>
                    <div className="container-shadow pd-2" style={{ height: "100vh" }}>

                        <Row>
                            <Col span={24}><h3 className="font_color up" style={{ width: 'calc(100% - 50px)', color: '#a0a7ab' }}> Mi Plan </h3></Col>

                            <Col span={24} className="center" style={{ color: "#492AF9", fontSize: 25, fontWeight: 700 }}>{plan.nombre}</Col>
                            <Col span={8} className="center"><p className="cuenta-plan-info">Fecha Inicio       <span className="cuenta-plan-info-content">{moment(pago.createdAt).format(dateFormat)}</span> </p> </Col>
                            <Col span={8} className="center"><p className="cuenta-plan-info">Prospectos del Mes <span className="cuenta-plan-info-content">{plan.prospectos}</span></p> </Col>
                            <Col span={8} className="center"><p className="cuenta-plan-info">Siguiente Cobro    <span className="cuenta-plan-info-content">{moment(pago.fecha_vencimiento).format(dateFormat)}</span> </p> </Col>
                        </Row>
                        <Row>
                            <Col span={24}><h3 className="font_color up" style={{ width: 'calc(100% - 50px)', color: '#a0a7ab' }}>Historial</h3></Col>

                            <Col span={12} className="center"><p className="cuenta-plan-info">Usuario Desde
                            <span className="cuenta-plan-info-content">{moment((plan.createdAt)).format(dateFormat)}</span>

                            </p> </Col>
                            <Col span={12} className="center"><p className="cuenta-plan-info">Total Prospectos
                            <span className="cuenta-plan-info-content">{plan.prospectos}</span></p> </Col>

                        </Row>
                        <Row>
                            <Col span={24}><h3 className="font_color up" style={{ width: 'calc(100% - 50px)', color: '#a0a7ab' }}>Invoices</h3></Col>
                            <Col span={24}>
                                <InvoicesTable />
                            </Col>

                        </Row>
                    </div>

                </Content>
            </Layout>
        )
    }
}


/**
 *
 *
 * @class InvoicesTable
 * @extends {Component}
 */
class InvoicesTable extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: true,
            data: [],

            /**PAGINATION */
            itemCount: undefined,
            perPage: 10,
            pageCount: 1,
            currentPage: 1,
            slNo: 1,
            hasPrevPage: false,
            hasNextPage: false,
            prev: null,
            next: null,

        }
    }

    componentDidMount() {
        var proyecto = JSON.parse(sessionStorage.getItem("proyecto_objeto"));
        const user = {
            _id: proyecto.usuarios_id,
            rol_id: {
                nombre: sessionStorage.getItem("rol")
            }

        }
        this.receivedData(user, 1);
    }

    /**
    * @memberof InvocesTable
    *
    * @method   receivedData
    * @description  Metodo que realiza el paginado de los usuarios
    * @param values String de la barra de busqueda, por defecto vacio
    *
    **/
    receivedData = ({ user, values }) => {

        axios.get("checkout/list",
            {
                user,
                headers: {
                    Authorization: sessionStorage.getItem('token'),
                    params: {
                        page: values,
                        limit: 10
                    }
                },
            })
            .then(res => {

                var pagos = res.data.data.itemsList
                var pag = res.data.data.paginator

                this.setState({
                    currentPage: pag.currentPage,
                    hasPrevPage: pag.hasNextPage,
                    hasNextPage: pag.hasNextPage,
                    itemCount: pag.itemCount,
                    next: pag.next,
                    pageCount: pag.pageCount,
                    perPage: pag.perPage,
                    currentPage: pag.currentPage,
                    prev: pag.prev,
                    slNo: pag.slNo,

                    loading: false
                })

                this.FormatData(pagos);



            })
            .catch(error => {
                console.log("error lista de pagos", error);

            })
    }

    FormatData = (data) => {

        var data_pagos = [];
        for (let index = 0; index < data.length; index++) {
            const element = data[index];
            data_pagos.push({
                _id: element._id,
                plan: element.plan_id.nombre,
                fecha: moment(element.createdAt).format(dateFormat),
                estatus: element.status,
                index: (index + 1)
            });
        }
        this.setState({ data: data_pagos });

    }

    /**
      * @memberof InvocesTable
      *
      * @method   handlePageClick
      * @description  Metodo que manda a llamar al paginado al hacer click en el paginado de la tabla
      *
      **/
    handlePageClick = page => {
        var proyecto = JSON.parse(sessionStorage.getItem("proyecto_objeto"));
        const user = {
            _id: proyecto.usuarios_id,
            rol_id: {
                nombre: sessionStorage.getItem("rol")
            }
        }


        this.receivedData(user, page);
    };



    render() {
        var data = this.state.data;
        return (
            <Table dataSource={data} columns={columns} loading={this.state.loading} pagination={{ pageSize: 4 }} className="blankTheme"></Table>
        )
    }
}


/**
 *
 *
 * @class PlanesList
 * @extends {Component}
 */
class PlanesList extends Component {
    constructor(props) {
        super(props)
        this.state = {
            dataPlanes: [],
            nombreProyecto: "",

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

    paypear = React.createRef();
    formRefPlanes = React.createRef();
    modalPayment = React.createRef();


    componentDidMount() {

        axios.defaults.headers.common['Authorization'] = sessionStorage.getItem('token');
        this.InfoProyecto();
        this.InfoPlanes();

    }


    InfoProyecto = async () => {
        axios.post('/dashboard',
            { proyecto_id: sessionStorage.getItem('proyecto') })
            .then((response) => {
                this.state.nombreProyecto = response.data.proyecto.nombre;
                this.state.idProyecto = response.data.proyecto._id;
            })
            .catch((error) => {
                console.log("error", error.response);

            });


    }

    InfoPlanes = async () => {
        axios({
            method: 'get',
            url: '/planes',
        })
            .then((response) => {
                var array = response.data.data.itemsList;
                this.setState({
                    dataPlanes: response.data.data.itemsList,
                    valorRadio: array[0]._id
                });

                document.getElementById('planesForm');
            })

            .catch((error) => {
                console.log("error", error.response);
            });
    }


    handleSubmit = () => {
        let idRadio = this.state.valorRadio;
        let tipoSwt = document.getElementById('tipoSwt-' + idRadio);
        let inputNum = document.getElementById('inpNum-' + idRadio);
        let costo = document.getElementById("costo-" + idRadio);

        let tipoPlan = (tipoSwt == null) ? 'Anual' : (tipoSwt.className.includes('ant-switch-checked')) ? 'Anual' : 'Mensual';
        let numProspectos = inputNum.value;

        if (costo.textContent == '0') {
            this.setState({
                idPlanSel: idRadio,
                pago_id: 'Gratis'
            });
        }

        if (costo.textContent != '0' && this.state.pago_id == "") {
            this.setState({
                idPlanSel: idRadio,
                costoPlanSel: costo.textContent,
                tipoPlanSel: tipoPlan,
                visible: true,
            });
        }
        else {
            showDeleteConfirm(this.state);
            //document.getElementById('btn-planesNext').click();
        }


    }

    onChange = e => {
        this.setState({
            valorRadio: e.target.value,
        });
    };

    ValidarNumeros = (inp) => {
        var input = inp.currentTarget, id = inp.currentTarget.id;
        if (input.value == "") {
            document.getElementById(id).value = 0;
        }
    }

    ShowModal = () => {
        this.setState({ visible: true });
    }

    onCancel = () => {
        this.setState({ visible: false });
    }

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

        this.state.tipoPlanSel = tipoPlan;
    }


    render() {
        return (
            <Layout className="bg-white pd-1">
                <Row>
                    <Col span={24} ><p className="modal-title subtitle-section center">Plan de Prospectos  {this.state.nombreProyecto}</p></Col>
                    <Col span={24}><p className="center single-text">Selecciona el numero de prospectos clientes que quieres recibir por mes en tu proyecto. </p></Col>
                </Row>
                <Row justify="space-around" align="center" className=" row-group-planes">
                    <div className="step-radio-group-box">
                        <Row align="center" justify="space-around">
                            <Col span={24} className="text-center">
                                <h2 className="title text-gray"> Precios </h2>
                            </Col>
                            <Col span={24}>
                                <Form layout={"vertical"} onFinish={this.handleSubmit} id="planesForm" ref={this.formRefPlanes} className="w100">
                                    <Radio.Group className="w100" defaultValue="gratis" size="large" onChange={this.onChange} value={this.state.valorRadio}>
                                        <Row align="center" justify="cnenter" gutter={[30, 30]} >
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
                                                                    <Image className="img-center" src={"/images/planes/plan-" + index + ".png"} preview={false} />
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
                        </Row> <Row>
                            <Col span={24} className="center">
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    className="btn-guardar btn btn-gral-morado"
                                    style={{ minWidth: '120px', padding: '5px', height: '45px', fontSize: '13pt' }}
                                    onClick={this.handleSubmit}
                                >Listo
                                </Button>
                            </Col>
                        </Row>

                    </div>
                </Row>
                <Row align="" className="pd-1">


                </Row>


                <Modal
                    title='Pagar'
                    visible={this.state.visible}
                    onCancel={this.onCancel}
                    onOk={this.onOk}
                    okText="Guardar"
                    className="mdl-paypear"
                    okButtonProps={{ className: "btn-guardar" }}
                    cancelButtonProps={{ className: "btn-cancel" }}
                >

                    <Row >
                        <Spin spinning={this.state.loading}>
                            <Paypear
                                ref={this.paypear}
                                width="90%"
                                /*
                                Tipo de procesador de pago
                                * */

                                total={this.state.costoPlanSel}
                                type="stripe"
                                user={this.state.userName} // user={this.state.usuario}

                                /*
                                Lista de impuestos, promociones, etcetra a descontar.
                                Vienen en dos tipos, percetanje (que sera un suma o resta al subtotal de la lista de productos).
                                Decimal (es una cantidad absoluta, se le decuentan 10, 20, 30 pesos.)
                                * */
                                additionalCharges={[
                                    {
                                        type: 'percentage',
                                        operation: '+',
                                        quantity: 16,
                                        description: 'Impuesto IVA'
                                    },
                                ]}

                                paymentHandledSubmit={(token) => {
                                    this.setState({ loading: true });

                                    //Procedimiento de pago para stripe
                                    let datosPersonales = this.paypear.current.props;
                                    axios({
                                        method: 'post',
                                        url: '/checkout',
                                        headers: { Authorization: sessionStorage.getItem('token') },
                                        data: {
                                            temporalidad: this.state.tipoPlanSel,
                                            plan_id: this.state.idPlanSel,
                                            proyecto_id: this.state.idProyecto,
                                            token: token.token
                                        }
                                    })
                                        .then((response) => {

                                            this.setState({
                                                visible: false,
                                                loading: false,

                                                pago_id: response.data.data.id,
                                                pago_tipo: this.state.tipoPlanSel,
                                                pago_planId: this.state.idPlanSel,
                                                pago_costo: datosPersonales.total,
                                                visible: false

                                            });

                                            message.success('Pago realizado correctamente.');


                                            window.location.replace('/admin/ajustes')
                                            return <Redirect to="/admin/ajustes" />
                                            //document.getElementById('btn-planesNext').click();

                                        })

                                        .catch((error) => {
                                            this.setState({ loading: false });

                                            console.log("error", error.response);

                                        });
                                }}
                            />
                        </Spin>
                    </Row>
                </Modal>


            </Layout>
        )
    }
}

const showDeleteConfirm = (item) => {

    var valorSel = item.valorRadio
        , dataPlanes = item.dataPlanes
        , name = ""
        , temporalidad = item.tipoPlanSel
        , plan_id = item.idPlanSel
        , proyecto_id = item.idProyecto;


    for (let index = 0; index < dataPlanes.length; index++) {
        const element = dataPlanes[index];

        if (element._id == valorSel) {
            name = element.nombre;
            plan_id = element._id;
            break;
        }
    }

    confirm({
        title: 'Cambio de plan ',
        icon: <ExclamationCircleOutlined />,
        content: '¿Estas seguro que cambiar a ' + name + ' ?',
        okText: 'Continuar',
        okType: 'danger',
        cancelText: 'Cancelar',

        onOk() {
            axios.defaults.headers.get["Authorization"] = sessionStorage.getItem('token');


            axios({
                method: 'post',
                url: '/checkout',
                headers: { Authorization: sessionStorage.getItem('token') },
                data: {
                    temporalidad,
                    plan_id,
                    proyecto_id
                }
            })
                .then((response) => {
                    message.success('Cambio de plan realizado correctamente.');
                    window.location.replace('/admin/ajustes')
                    return <Redirect to="/admin/ajustes" />
                    //document.getElementById('btn-planesNext').click();
                })

                .catch((error) => {
                    console.log("error", error.response);
                });
        },
    });
}

export { Plan, PlanesList };