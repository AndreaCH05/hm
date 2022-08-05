import React, { Component } from "react";
import { Layout, Button, Row, Col, message, Input, Form, Modal, InputNumber, Spin } from 'antd';
import { Redirect } from "react-router-dom";
import Previews from '../../../Widgets/Preview'
const { Content, Header } = Layout;
const { TextArea } = Input;

const axios = require("axios").default;

var img_uploaded = [];

/**
*
* @memberof CrearProducto
*
* @method addFile
* @description Sube un archivo al WebService.
*
*/
const addFile = {
    name: 'file',
    listType: "picture-card",
    action: 'http://localhost:4000/upload/add',
    multiple: true,

    onChange(img) {
        if (img.file.status === 'done') {
            img_uploaded.push(img.file.response.filename);
            message.success(`${img.file.name} Archivo subido con exito`);
        } else if (img.file.status === 'error') {
            message.error(`${img.file.name} El archivo no se ha podido subir.`);
        }
    },
};
class AnuncioProyecto extends Component {
    AnuncioForm = React.createRef();
    preview = React.createRef();
    constructor(props) {
        super(props);
        this.state = {
            nombreVista: 'Anuncio Editar Producto',
            productos: [],
            id_producto: '',
            loading: false,
            fileList: [],
            imagenes: [''],
        }
    }

    proyecto = JSON.parse(sessionStorage.getItem("proyecto_objeto"));
    /**
   * @memberof AnuncioProyecto
   *
   * @method componentDidMount
   * @description
   *
   **/
    async componentDidMount() {
        axios.defaults.headers.get['Authorization'] = sessionStorage.getItem('token');

        const pid = this.props.match.params.id
 
        if (pid != undefined) {
 
            this.LoadData(pid);

        }
        else {
     
            this.setState({ nombreVista: 'Anuncio para Nuevo Producto' });
        }
    }

    /**
    * @memberof AnuncioProyecto
    *
    * @method LoadData
    * @description  Si es una edicion de AnuncioProyectos se manda una peticion para traer la informacion del servidor
    *
    **/
    async LoadData(id) {
        this.setState({loading: true})
        await axios.post('/productos/id',
            { id: id },
            {
                headers: { Authorization: sessionStorage.getItem('token') },
            })
            .then(async response => {
 

                let fileArray = response.data.data.producto.imagenes.map((imagen, number) => new Object({
                    lastModified: new Date().getMilliseconds(),
                    lastModifiedDate: new Date(),
                    name: imagen,
                    path: imagen,
                    preview: axios.defaults.baseURL + 'upload/' + imagen
                }));

                this.setState({
                    fileList: fileArray,
                    productos: response.data.data.producto,
                    id_producto: id,
                    loading: false,
                })

                this.AnuncioForm.current.setFieldsValue({
                    nombre: response.data.data.producto.nombre,
                    precio: response.data.data.producto.precio,
                    descripcion: response.data.data.producto.descripcion,
                })
                this.preview.current.setState({
                    files: fileArray
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

    }


    /**
     * @memberof AnuncioProyecto
     *
     * @method onChangeActive
     * @description  Actualiza el valor del switch del input activo al state.prod_activo
     *
     **/
    onChangeActive = (checked) => {
 
        this.setState({ prod_activo: checked });
    };


    /**
     *
     * @memberof AnuncioProyecto
     *
     * @event normFile
     * @description Se ejecuta al actualizar el Dragger, solamente es necesario los eventos cuando se sube y cuando se elimina.
     *
     * @param event (event)
     * Datos del evento.
     */
    normFile = async (event) => {
 
        let update_fileList = false;
        let delete_file = false;
        /**
         * Cuando se sube un archivo, se debe actualizar la lista de imagenes, cuando se selecciona eliminar, se debe actualizar la lista una vez que se elimina
         */
        if (event.file.status == "done") {
            update_fileList = true;
        }
        if (event.file.status == "removed") {
            update_fileList = true;
            delete_file = true;
        }
        if (delete_file)
            this.removeFile((event.file.response.filename != undefined) ? event.file.response.filename : event.file.name);


        if (update_fileList) {
            let arrayList = [];
            for (let x = 0; x < event.fileList.length; x++) {
                try {
                   
                    arrayList.push(event.fileList[x].response.filename)
                } catch (e) {
                    console.log(e)
                }
            }

            this.setState({
                fileList: arrayList
            });
        }
        return event && event.fileList;
    };

    /**
    *
    * @memberof AnuncioProyecto
    *
    * @method removeFile
    * @description Elimina un archivo del WebService.
    *
    * @param images (string)
    * Recibe el nombre de la imagen.
    */
    removeFile = (image) => {
        axios.post("/upload/delete", {
            filename: image
        })
            .then(res => {
                console.log("imagen removida con exito", res);
            })
            .catch(res => {
                console.log("imagen no se puedo remover", res);
            })
    };

    /**
     *
     *
     * @memberof AnuncioProyecto
     * @description Genera un arreglo para que pueda ser leido por el Webservice
     *
     * @param fileList
     * Recibe la lista de archivos generada por el componente Upload.Dragger
     *
     * @returns array
     * Retorna el arreglo convertido para poder enviarlo al WS
     *
     */
    getImagesArray = (fileList) => {
        let array = [];
        for (let index = 0; index < fileList.length; index++)
            array.push(fileList[index].name);
        return array;
    }

    /**
   * @memberof AnuncioProyecto
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
        axios.post('/productos/add',
            {
                nombre: values.nombre,
                precio: values.precio,
                descripcion: values.descripcion,
                imagenes: this.getImagesArray(this.preview.current.state.files),
                proyecto_id: this.proyecto._id
            },
            {
                headers: { Authorization: sessionStorage.getItem('token') }
            })
            .then((response) => {

                message.success("¡Producto creado!");
                this.setState({ redirect: true });

            })
            .catch((error) => {
                console.log(error.response);
            })
    }

    /**
   * @memberof AnuncioProyecto
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
         
        let element = this.getImagesArray(this.preview.current.state.files);

        axios.put('/productos/update',
            {
                id: this.state.id_producto,
                nombre: values.nombre,
                precio: values.precio,
                descripcion: values.descripcion,
                imagenes: element,
            },
            {
                headers: { Authorization: sessionStorage.getItem('token') }
            })
            .then((response) => {
                if (response.status == 200) {
                    message.success("¡Producto actualizado!");
                    this.setState({ redirect: true });
                }
            })
            .catch((error) => {
                console.log(error.response);
            })
    }

    /**
    * @memberof AnuncioProyecto
    *
    * @method handleSubmit
    * @description  Envia los datos del formulario al Servidor
    *
    * @param values (array)
    * Contiene los campos del formulario para registrar al usuario
    **/

    handleSubmit = values => {
        if (parseFloat(values.precio) > 0) {
            const pid = this.props.match.params.id;
            if (pid !== undefined && pid !== '') {
                this.UpdateData(values);
            }
            else {
                this.NewData(values);
            }
        }
        else {
            message.error(`Ingrese precio de producto.`);
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
            return <Redirect to="/admin/anuncios" />;
        }
    };


    render() {

        return (
            <Layout>
                {this.renderRedirect()}
                <Header className="bg-white"> <h3>{this.state.nombreVista}</h3></Header>
                <Content className="bg-white">
                    <div className="div-contenedor" >
                        <Spin spinning={this.state.loading}>
                        <Row>
                            <Col span={16} offset={4} className="contenedor-shadow pd-2">
                                <Form
                                    initialValues={{ remember: true }}
                                    onFinish={this.handleSubmit}
                                    layout={"vertical"}
                                    ref={this.AnuncioForm} >
                                    <Row gutter={[16, 16]}>
                                        <Col xs={24} md={12} lg={12}>
                                            <Form.Item name="nombre" label="Nombre" rules={[{ required: true, message: 'Por favor ingresa el Nombre' }]}>
                                                <Input placeholder="Nombre" className="input-box" />
                                            </Form.Item>
                                        </Col>
                                        <Col xs={24} md={12} lg={12}>
                                            <Form.Item name="precio" label="Precio" rules={[{ required: true, message: 'Por favor ingresa el Precio' }]}>
                                                <InputNumber placeholder="Precio" className="input-box" type="number" min={0} />
                                            </Form.Item>

                                        </Col>
                                    </Row>
                                    <Row gutter={[16, 16]}>
                                        <Col xs={24} md={24} lg={24}>
                                            <Form.Item type='textarea' label="Descripción" name="descripcion" rules={[{ required: true, message: 'Por favor ingresa descripción' }]}>
                                                <TextArea placeholder="Descripción del tamaño" className="input-box" style={{ minHeight: '100px' }} />
                                            </Form.Item>

                                        </Col>
                                    </Row>
                                    <Row gutter={[16, 16]}>
                                        <Col span={24} className="center">
                                            <Form.Item label="Imagenes">
                                                <Form.Item
                                                    name="file"
                                                    defaultFileList={this.state.fileList}
                                                    initialValue={this.state.fileList}
                                                >
                                                    <Previews
                                                        ref={this.preview}
                                                    />
                                                </Form.Item>
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                    <Row gutter={[16, 16]}>
                                        <Col span={24} className="center">
                                            <Form.Item >
                                                <Button type="primary" htmlType="submit" className="btn btn-secondary btn-form">
                                                    Guardar
                                                </Button>
                                            </Form.Item>
                                        </Col>
                                    </Row>

                                </Form>
                            </Col>
                        </Row>
                        </Spin>
                    </div>
                </Content>
            </Layout>
        )
    }

}


export default AnuncioProyecto
