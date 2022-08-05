import React, { Component } from 'react'
import { Row, Col, Form, Input, Button, Layout, Select, Modal, Spin } from 'antd';


const { Option } = Select;
const { Header, Content } = Layout;
const axios = require("axios").default;

class FormAutomatizacion extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: true,
            automatizacion: [],
            id_automatizacion: '',
            nombreVista: 'Editar Automatizacion'
        }
    }


    /**
     * @memberof FormAutomatizacion
     *
     * @method componentDidMount
     * @description actualiza los datos de la vista segun si existe o no una automatizacion previamente seleccionada
     * @if la ruta tiene un parametro (id) manda a llamar a loadData para cargar los datos en el state.automatizacion
     * @else Asigna a la vista el nombre de Crear Automatizacion
     *
     **/
    componentDidMount() {
        axios.defaults.headers.get['Authorization'] = sessionStorage.getItem('token');
        const pid = this.props.id_user;

        if (pid != undefined) {
     
            this.LoadData(pid);

            this.setState({ loading: false });
        }
        else {
  
            this.setState({
                nombreVista: 'Crear Automatizacion',
                loading: false
            });
        }

    }
    /**
   * @memberof FormAutomatizacion
   *
   * @method LoadData
   * @description  Si es una edicion de usuario se manda una peticion para traer la informacion del servidor
   *
   **/
    LoadData = (id) => {
        axios.post('/automatizacion/id',
            { id: id },
            {
                headers: { Authorization: sessionStorage.getItem('token') },
            })
            .then((response) => {
      
                this.setState({ usuario: response.data, id_usuario: id });

                this.UserForm.current.setFieldsValue({
                    nombre: response.data.data.nombre,
                    acion: response.data.data.accion,
                    automatizacion: response.data.data.automatizacion,
                    persona: response.data.data.persona
                })

            })
            .catch((error) => {
                console.log("error", error);
                if (error.status >= 300) {
                    Modal.info({
                        title: error.response.status,
                        content: error.response.data
                    })
                }
            });
        this.setState({ nombreVista: 'Editar Miembro' });
    }


    /**
   * @memberof FormAutomatizacion
   *
   * @method NewData
   * @description  Envia los datos del formulario al Servidor para un nuevo registro
   *
   * @param values (array)
   * Contiene los campos del formulario para registrar al usuario
   *
   * @returns response (array)
   **/
    NewData = (values) => {

        axios.post("/automatizacion/crear", {
            nombre: values.nombre,
            accion: values.accion,
            automatizacion: values.automatizacion,
            persona: values.persona
        },
            { headers: { Authorization: sessionStorage.getItem('token') } })
            .then(res => {
                this.setState({ loading: false });
            })
            .catch(error => {
                console.log(error);
            })
    }


    /**
   * @memberof FormAutomatizacion
   *
   * @method NewData
   * @description  Envia los datos del formulario al Servidor para actualizar un registro
   *
   * @param values (array)
   * Contiene los campos del formulario para registrar al usuario
   *
   * @returns response (array)
   **/
    UpdateData = (values) => {
      
        axios.post("/automatizacion/update", {
            id: this.state.id_automatizacion,
            nombre: values.nombre,
            accion: values.accion,
            automatizacion: values.automatizacion,
            persona: values.persona
        },
            { headers: { Authorization: sessionStorage.getItem('token') } })
            .then(res => {
                this.setState({ loading: false });
            })
            .catch(error => {
                console.log(error);
            })
    }

    /**
    * @memberof FormAutomatizacion
    *
    * @method handleChangeAccion
    * @description  Al cambiar la accion seleccionada, se actualizan el state.estados para el  select estados
    *
    **/
    handleChangeAccion = e => {
 
        axios.defaults.headers.get["Authorization"] = sessionStorage.getItem('token');
        // this.formRef.current.setFieldsValue({ automatizacion: "0" });
        // this.getCountry(e)
    }

    /**
    * @memberof FormAutomatizacion
    *
    * @method handleSubmit
    * @description  Envia los datos del formulario al Servidor
    *
    * @param values (array)
    * Contiene los campos del formulario para registrar al usuario
    **/
    handleSubmit = values => {
        if (this.state.automatizacion.length > 0) {
            this.UpdateData(values);
        }
        else {
            this.NewData(values);
        }

    }


    render() {
        return (
            <Layout className="bg-white">
                <Header className="bg-white" style={{ height: 10 }}>
                    <h3 className="up font_color">Automatizaciones </h3>
                </Header>

                <Content className="pd-2 " style={{ marginTop: "25px", height: 'height: auto !important;' }}>
                    <div className="contenedor_item pd-1">
                        <Row>
                            <h4 className="up" style={{ width: 'calc(100% - 50px)', fontSize: '18pt', color: '#a0a7ab' }}  >Crear nueva</h4>
                        </Row>
                        <Row>
                            <Col span={8} offset={8}>
                                <div className="div-contenedor FormAutomatizacion" >
                                    <Form onFinish={this.handleSubmit} layout={"vertical"} >

                                        <Form.Item name="nombre" label="Nombre" rules={[{ required: true, message: 'Por favor ingresa nombre' }]}>
                                            <Input placeholder="Nombre" className="input-box" />
                                        </Form.Item>

                                        <Form.Item name="accion" label="Acción" rules={[{ required: true, message: 'Por favor selecciona accion' }]}>
                                            <Select placeholder="Selecciona acción" className="input-box" style={{ float: 'right', width: '100%', marginTop: '15px' }} onChange={this.handleChangeAccion}>
                                                <Option value="1">Notificar</Option>
                                                <Option value="2">Asignar</Option>
                                            </Select>
                                        </Form.Item >
                                        <Spin >
                                            <Form.Item>
                                                <label className="uo" style={{ width: 'calc(100% - 50px)', fontSize: '18pt', color: '#a0a7ab' }}>Automatización  <span>XXXXX</span></label>
                                            </Form.Item>
                                            <Form.Item name="automatizacion" label="Automatización" rules={[{ required: true, message: 'Por favor definir automatizacion' }]}>
                                                <Select placeholder="Selecciona acción" className="input-box" style={{ float: 'right', width: '100%', marginTop: '15px' }} >
                                                    <Option value="0">Seleccionar...</Option>
                                                </Select>
                                            </Form.Item>
                                            <Form.Item name="persona" label="Persona" rules={[{ required: true, message: 'Por favor definir personas' }]}>
                                                <Select placeholder="Selecciona acción" className="input-box" style={{ float: 'right', width: '100%', marginTop: '15px' }} >

                                                    <Option value="0">Seleccionar...</Option>
                                                </Select>
                                            </Form.Item>
                                            <Form.Item>
                                                <Button type="primary" htmlType="submit" className="btn btn-primary" >Guardar</Button>
                                            </Form.Item>
                                        </Spin>
                                    </Form>
                                </div>
                            </Col>
                        </Row>
                    </div>
                </Content>
            </Layout>

        )
    }
}

export default FormAutomatizacion;
