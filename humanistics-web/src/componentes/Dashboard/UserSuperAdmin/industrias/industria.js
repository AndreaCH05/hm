import React, { Component } from "react";
import { Form, Layout, Input, Button, Row, Col, message,Modal } from 'antd';
import { Redirect } from "react-router-dom";

const { Header, Content } = Layout;
const { TextArea } = Input;

const axios = require("axios").default;

class Industria extends Component {

    BusinnessForm = React.createRef();
    constructor(props) {
        super(props);
        this.state = {
            nombreVista: '',
            industria:[],
            id_industria:''
        }
    }

    componentDidMount() {
        axios.defaults.headers.get['Authorization'] = sessionStorage.getItem('token');
    
        const  pid  = this.props.match.params.id//
       
        if (pid != undefined) {
 
           this.LoadData(pid);

        }
        else {
      
            this.setState({ nombreVista: 'Crear Industria' });
        }
    }

   /**
   * @memberof Industria
   *
   * @method LoadData
   * @description  Si es una edicion de industrias se manda una peticion para traer la informacion del servidor
   *
   **/
    LoadData=(id)=>{
        axios.post('/industrias/id', 
          { id: id },
          {
            headers: { Authorization: sessionStorage.getItem('token') },   
          })
        .then((response) => {
        
            this.setState({ industria: response.data,id_industria:id });

            this.BusinnessForm.current.setFieldsValue({
                nombre:response.data.data.nombre,
                descripcion:response.data.data.descripcion
            })

        })
        .catch((error) => {
            console.log("error",error);
            if(error.status >= 300){
            Modal.info({
                title:  error.response.status,
                content: error.response.data
            })
         }
        });
        this.setState({ nombreVista: 'Editar Industria' });
    }

     /**
    * @memberof Industria
    *
    * @method NewData
    * @description  Envia los datos del formulario al Servidor para un nuevo registro
    *
    * @param values (array)
    * Contiene los campos del formulario para registrar al usuario 
    *
    * @returns response (array)
    **/

    NewData=(values)=>{
     
        axios.post('/industrias/add',
            {
                nombre: values.nombre,
                descripcion: values.descripcion,
            },
            {
                headers: { Authorization: sessionStorage.getItem('token') }
            })
            .then((response) => {
               
                    message.success("Industria creada!");
                    this.setState({ redirect: true });
               
            })
            .catch((error) => {
                console.log(error.response);
            })
    }

     /**
    * @memberof Industria
    *
    * @method NewData
    * @description  Envia los datos del formulario al Servidor para actualizar un registro
    *
    * @param values (array)
    * Contiene los campos del formulario para registrar al usuario 
    *
    * @returns response (array)
    **/
    UpdateData=(values)=>{
 
       
        axios.put('/industrias/update',
            {
                id:this.state.id_industria,
                nombre: values.nombre,
                descripcion: values.descripcion,
            },
            {
                headers: { Authorization: sessionStorage.getItem('token') }
            })
            .then((response) => {
                if (response.status == 200) {
                    message.success("Industria creada!");
                    this.setState({ redirect: true });
                }
            })
            .catch((error) => {
                console.log(error.response);
            })
    }

    /**
    * @memberof Industria
    *
    * @method handleSubmit
    * @description  Envia los datos del formulario al Servidor
    *
    * @param values (array)
    * Contiene los campos del formulario para registrar al usuario
    **/

    handleSubmit = values => {
 
        if(this.state.industria.length >0){
            this.UpdateData(values);
        }
        else{
            this.NewData(values);
        }
        
    }

    
    /**
   * @memberof Industria
   *
   * @method renderRedirect
   * @description  Activa el redireccionamiento si el formulario se envio con exito
   *
   **/
    renderRedirect = () => {
        if (this.state.redirect) {
            return <Redirect to="/admin/industrias" />;
        }
    };



    render() {
        return (
            <Layout>
                {this.renderRedirect()}
                <Header className="bg-white">
                    <h3>{this.state.nombreVista}</h3>
                </Header>
                <Content className="bg-white">
                 
                        <div className="div-contenedor" >
                           <Row>
                            <Col span={16} offset={4}>
                                <Form initialValues={{ remember: true }} onFinish={this.handleSubmit} layout={"vertical"}  ref={this.BusinnessForm} >
                                    <Form.Item
                                        name="nombre"
                                        label="Tamaño"
                                        rules={[{ required: true, message: 'Por favor ingresa el Nombre' }]}>
                                        <Input
                                            placeholder="Nombre"
                                            className="input-box"
                                        />
                                    </Form.Item>

                                    <Form.Item
                                        type='textarea'
                                        label="Descripción"
                                        name="descripcion"
                                        rules={[{ required: true, message: 'Por favor ingresa descripción' }]}>
                                        <TextArea
                                            placeholder="Descripción del tamaño"
                                            className="input-box"
                                            style={{ minHeight: '100px' }}
                                        />
                                    </Form.Item>
                                    <Form.Item>
                                        <Button
                                            type="primary"
                                            htmlType="submit"
                                            className="btn btn-primary btn-form"
                                        >
                                            Guardar
                                        </Button>
                                    </Form.Item>
                                </Form>
                            </Col>
                            </Row>
                        </div>
                    
                </Content>

            </Layout>
        )
    }
}

export default Industria;