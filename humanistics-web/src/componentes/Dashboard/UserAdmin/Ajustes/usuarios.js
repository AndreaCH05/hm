import React, { Component } from "react";
import { Table, Modal, Row, Col, Switch, Button, Form, Select, Input, Spin, message, Typography, List, Card } from 'antd';
import { FormOutlined, ExclamationCircleOutlined, DeleteOutlined, CloseOutlined } from '@ant-design/icons';
import { Redirect, Link } from "react-router-dom";
import { CloseIcon } from "./../../../Widgets/Iconos";
const axios = require("axios").default;

const { confirm } = Modal;
const { Option } = Select;
const { Text } = Typography


/**
 *
 *
 * @class ModalUsuarios
 * @extends {Component}
 */
class ModalUsuarios extends Component {

    UserForm = React.createRef();
    constructor(props) {
        super(props)
        this.state = {
            nombreVista: 'Nuevo Miembro',
            roles: [],
            usuario: [],
            id_usuario: '',
            loading: false,
            info: undefined,
            message: '',
            actualizado: false
        }
    }

    /**
     * @memberof ModalUsuarios
     *
     * @method componentDidMount
     * @description actualiza los datos de la vista segun si existe o no un usuario previamente seleccionado
     * @if la ruta tiene un parametro (id) manda a llamar a loadData para cargar los datos en el state.usuario
     * @else Asigna a la vista el nombre de Crear Usuario
     *
     **/
    componentDidMount() {
        axios.defaults.headers.get['Authorization'] = sessionStorage.getItem('token');
        this.GetRoles();
    }

    /**
     * @memberof ModalUsuarios
     *
     * @method componentDidUpdate
     * @description 
     *
     **/
    componentDidUpdate(prevProps) {
        if (this.props.id_user !== prevProps.id_user && this.props.id_user !== undefined) {
            this.loadData(this.props.id_user)
        }

    }




    /**
   * @memberof ModalUsuarios
   *
   * @method LoadData
   * @description  Si es una edicion de usuario se manda una peticion para traer la informacion del servidor
   *
   **/
    loadData = (user_id) => {

        axios.post('/usuarios/id', { id: user_id },
            { headers: { Authorization: sessionStorage.getItem('token') } })
            .then((response) => {
                this.setState({ usuario: response.data.data, id_usuario: user_id });

                this.UserForm.current.setFieldsValue({
                    nombre: response.data.data.nombre,
                    email: response.data.data.email,
                    rol: response.data.data.rol_id
                })

            })
            .catch((error) => {
                console.log("error", error.response);
                if (error.status >= 300) {
                    message.error("No se pudo cargar la informacion del usuario");
                }
            });
        this.setState({ nombreVista: 'Editar Miembro' });
    }


    /**
  * @memberof ModalUsuarios
  *
  * @method GetRoles
  * @description Obtiene todos los roles disponibles del sistema, a excepcion del Administrador y los asigna al state.roles
  *
  **/
    GetRoles = () => {
        axios.get("/roles",
            {
                headers: { Authorization: sessionStorage.getItem('token') },
            })
            .then(res => {
                this.setState({ roles: res.data.data });
            })
            .catch(error => {
                message.error("No se han podido cargar los roles");
            })
    }

    /**
   * @memberof ModalUsuarios
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

        var proyecto = JSON.parse(sessionStorage.getItem("proyecto_objeto"));

        axios.post("/usuarios/crear", {
            rol_id: sessionStorage.getItem("rol"),
            proyectos_id: proyecto._id,
            nombre: values.nombre,
            email: values.email,
            rol_id: values.rol,
            parent_user: proyecto.usuarios_id,
            telefono: '',
            status: 7
        },
            { headers: { Authorization: sessionStorage.getItem('token') } })
            .then(res => {
                message.success('Usuario creado exitosamente!')
                this.props.onCancel()
            })
            .catch(error => {
                console.log(error);
                message.error("No se ha podido crear registro, verifique que el email ingresado sea valido y no este registrado.");
            }).finally(() => {
                this.setState({ loading: false })
            })


    }

    /**
   * @memberof ModalUsuarios
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
        axios.put("/usuarios/update", {
            id: this.state.id_usuario,
            nombre: values.nombre,
            email: values.email,
            rol_id: values.rol
        },
            { headers: { Authorization: sessionStorage.getItem('token') } })
            .then(res => {
                message.success('Usuario actualizado con exito!')
                this.props.onCancel();
            })
            .catch(error => {
                message.error('No se ha podido actualizar el usuario')
            }).finally(() => {
                this.setState({ loading: false })
            })
    }


    /**
    * @memberof ModalUsuarios
    *
    * @method handleSubmit
    * @description  Envia los datos del formulario al Servidor
    *
    * @param values (array)
    * Contiene los campos del formulario para registrar al usuario
    **/
    handleSubmit = values => {
        this.setState({ loading: true });

        if (this.state.id_usuario.length > 0) {

            this.UpdateData(values);
        }
        else {
            this.NewData(values);
        }



    }

    ShowMessage() {
        return (
            <Row>
                <Col span={24} className="center">
                    <p className={this.state.info ? "modal-info-success" : "modal-info-error"}>{this.state.message}</p>
                </Col>
            </Row>
        )
    }


    render() {
        var roles = this.state.roles;
        return (
            <Modal
                visible={this.props.visible}
                className="modal-form modal-prospecto" //mdl-prospecto 
                closeIcon={<CloseOutlined height={20} width={20} />}
                title={this.state.nombreVista}
                onCancel={this.props.onCancel}
                footer={false}
                closeIcon={<CloseIcon />}
                destroyOnClose={true}
            >
                <Form layout={"vertical"} onFinish={this.handleSubmit} className="pd-1 " ref={this.UserForm}>
                    {this.ShowMessage()}
                    <Spin tip="Espere un momento por favor..." spinning={this.state.loading}>
                        <Form.Item label="Nombre" name="nombre" rules={[{ required: true, message: 'Por favor escribe un nombre' }]} >
                            <Input type="text" placeholder="Nombre" className="input-box"></Input>
                        </Form.Item>

                        <Form.Item label="Email" name="email" rules={[{ required: true, message: 'Por favor escribe un email' }]} >
                            <Input type="email" placeholder="Email" className="input-box"></Input>
                        </Form.Item>

                        <Form.Item label="Tipo de Usuario" name="rol" rules={[{ required: true, message: 'Por favor selecciona un perfil' }]} >
                            <Select placeholder="Seleccionar opción" className="input-box" >
                                <Option value="0" disabled>Seleccionar...</Option>
                                {roles.map(function (rol, index) {
                                    return <Option value={rol._id}>{rol.nombre}</Option>
                                })
                                }
                            </Select>
                        </Form.Item>

                        <Row>
                            <Col className="center pd-1" span={24}>
                                <Form.Item>
                                    <Button htmlType="submit" type="primary" className="btn-modal-morado">Guardar</Button>
                                </Form.Item>
                            </Col>
                        </Row>
                    </Spin>
                </Form>
            </Modal>
        )
    }
}


/**
 *
 *
 * @class UsuariosList
 * @extends {Component}
 */
class UsuariosList extends Component {

    constructor(props) {
        super(props)
        this.state = {
            visible: false,
            modalUsuarios: false,
            id_selected: undefined,
            redirect: false,
            loading: true,


            actualizado: false,

            dataUsuarios: [],

            currentPage: 1,
            itemCount: 0
        }

    }


    componentDidMount() {
        this.LoadUsers(1)
    }

    componentDidUpdate = async () => {
        if (this.props.reload && !this.state.actualizado) {
            this.LoadUsers(1);
        }
    }

    /**
    * @memberof UsuariosList
    *
    * @method   handlePageClick
    * @description  Metodo que asigna al state.id_selected el id del usuario seleccionado para mostrar el modal con los datos de ese usuario
    *
    **/
    GetUser = (item) => {
        const user_id = item.currentTarget.id;
        this.setState({ id_selected: user_id })

    }


    /**
    * @memberof UsuariosList
    *
    * @method   ModalPopUpHandler
    * @description  Metodo que manda a llamar al metodo GetUser y cambia el status del state.modalShowToogle para mostrar u ocultar el modal
    *
    **/
    ModalPopUpHandler = (item) => {
        this.GetUser(item);
        const changeModal = this.state.modalShowToggle;
        this.setState({ modalShowToggle: !changeModal });

        if (changeModal) {
            this.LoadUsers(1)
        }

    }

    LoadUsers = async (page) => {
        this.setState({ loading: true, actualizado: true });
        axios({
            method: 'get',
            url: '/usuarios',
            params: {
                page: page,
                limit: 10,
                proyecto_id: sessionStorage.getItem("proyecto"),
            }
        })
            .then((response) => {
                var data = response.data.data.itemsList;
                this.setState({
                    dataUsuarios: data,
                    loading: false,
                    actualizado: false,
                    currentPage: response.data.data.currentPage,
                    itemCount: response.data.data.itemCount,
                })
                //this.state.usuarios =   response.data.data.itemsList;
                setTimeout(() => {
                }, 250);
            })


            .catch((error) => {
                this.setState({ loading: false });

                console.log("error", error.response);
            });
    }


    /**
       * @memberof ModalUsuarios
       *
       * @method NewData
       * @description  Envia los datos del formulario al Servidor para actualizar un registro
       *
       * @param values (array)
       * Contiene los campos del formulario para registrar al usuario 
       *
       * @returns response (array)
       **/
    UpdateEstatus = (checked, user_id) => {
        let active = checked ? 1 : 0

        this.setState({ loading: true })
        axios.put("/usuarios/update", {
            id: user_id,
            status: active,
        }, { headers: { Authorization: sessionStorage.getItem('token') } })
            .then(res => {
                message.success('Usuario actualizado con exito!')
            })
            .catch(error => {
                message.error('No se ha podido actualizar el usuario')
            }).finally(() => {
                this.setState({ loading: false })
            })
    }

    render() {
        let { loading, dataUsuarios, currentPage, itemCount } = this.state;

        return (
            <div style={{ width: '100%' }}>
                {this.renderRedirect}

                <List
                    loading={loading}
                    dataSource={dataUsuarios}
                    size="small"
                    className="component-list"
                    bordered={false}
                    locale={"Sin Usuarios"}
                    pagination={{
                        onChange: page => {
                            this.LoadUsers(page)
                        },

                        pageSize: 10,
                        current: currentPage,
                        total: itemCount
                    }}

                    header={
                        <div>
                            <Row align="center" style={{ width: '100%', padding: "5px 15px" }} className="row-titleList" >
                                <Col span={{ span: 6, order: 1 }} xxl={{ span: 6, order: 1 }} xl={{ span: 6, order: 1 }} lg={{ span: 6, order: 1 }} md={{ span: 6, order: 1 }} sm={{ span: 6, order: 1 }} xs={{ span: 22, order: 1 }}>
                                    <Text>Nombre</Text>
                                </Col>
                                <Col span={{ span: 6, order: 2 }} xxl={{ span: 6, order: 2 }} xl={{ span: 6, order: 2 }} lg={{ span: 6, order: 2 }} md={{ span: 6, order: 2 }} sm={{ span: 6, order: 2 }} xs={{ span: 11, order: 2 }}>
                                    <Text>Email</Text>
                                </Col>
                                <Col span={{ span: 6, order: 2 }} xxl={{ span: 6, order: 2 }} xl={{ span: 6, order: 2 }} lg={{ span: 6, order: 2 }} md={{ span: 6, order: 2 }} sm={{ span: 6, order: 2 }} xs={{ span: 11, order: 2 }}>
                                    <Text>Tipo</Text>
                                </Col>

                                <Col span={{ span: 4, order: 3 }} xxl={{ span: 4, order: 3 }} xl={{ span: 4, order: 3 }} lg={{ span: 4, order: 3 }} md={{ span: 4, order: 3 }} sm={{ span: 4, order: 3 }} xs={{ span: 11, order: 3 }}>
                                    <Text>Estatus</Text>
                                </Col>

                                <Col span={{ span: 2, order: 6 }} xxl={{ span: 2, order: 6 }} xl={{ span: 2, order: 6 }} lg={{ span: 2, order: 6 }} md={{ span: 2, order: 6 }} sm={{ span: 2, order: 6 }} xs={{ span: 2, order: 4 }}>
                                    <Text>Acciones</Text>
                                </Col>
                            </Row>
                        </div>
                    }

                    renderItem={item => <List.Item className="component-list-item" key={item._id}>
                        <Card className="card-list">
                            <Row align="middle" style={{ width: '100%' }} >
                                <Col span={{ span: 6, order: 1 }} xxl={{ span: 6, order: 1 }} xl={{ span: 6, order: 1 }} lg={{ span: 6, order: 1 }} md={{ span: 6, order: 1 }} sm={{ span: 6, order: 1 }} xs={{ span: 22, order: 1 }}>
                                    <Text>{item.nombre}</Text>
                                </Col>
                                <Col span={{ span: 6, order: 2 }} xxl={{ span: 6, order: 2 }} xl={{ span: 6, order: 2 }} lg={{ span: 6, order: 2 }} md={{ span: 6, order: 2 }} sm={{ span: 6, order: 2 }} xs={{ span: 11, order: 2 }}>
                                    <Text>{item.email}</Text>
                                </Col>
                                <Col span={{ span: 6, order: 2 }} xxl={{ span: 6, order: 2 }} xl={{ span: 6, order: 2 }} lg={{ span: 6, order: 2 }} md={{ span: 6, order: 2 }} sm={{ span: 6, order: 2 }} xs={{ span: 11, order: 2 }}>
                                    <Text>{(Array.isArray(item.rol_id)) ? item.rol_id[0].nombre : ""}</Text>
                                </Col>
                                <Col span={{ span: 4, order: 3 }} xxl={{ span: 4, order: 3 }} xl={{ span: 4, order: 3 }} lg={{ span: 4, order: 3 }} md={{ span: 4, order: 3 }} sm={{ span: 4, order: 3 }} xs={{ span: 11, order: 3 }}>
                                    <Text><Switch className="input-box" defaultChecked onChange={(e) => { this.UpdateEstatus(e, item._id) }} /></Text>
                                </Col>

                                <Col className="center" xxl={{ span: 2, order: 6 }} xl={{ span: 2, order: 6 }} lg={{ span: 2, order: 6 }} md={{ span: 2, order: 6 }} sm={{ span: 2, order: 6 }} xs={{ span: 2, order: 4 }}>
                                    <Button title="Editar" className="purple-icon" onClick={() => { this.setState({ id_user: item._id, modalUsuarios: true }) }} icon={<FormOutlined />} ></Button>
                                    <Button title="Eliminar" className="red-icon" name={item.nombre} id={item._id} onClick={(e) => showDeleteConfirm(e, this)} icon={<DeleteOutlined />}></Button>
                                </Col>
                            </Row>
                        </Card>
                    </List.Item>}
                />


                <ModalUsuarios
                    id_user={this.state.id_user}
                    visible={this.state.modalUsuarios}
                    onCancel={() => {
                        this.setState({ modalUsuarios: false, id_user: undefined })
                        this.LoadUsers(1)
                    }}
                />

            </div>

        )
    }


}


/**
* @method showDeleteConfirm
* @description  Para cada row mostrar un modal de confirmacion para eliminar el registro, la eliminacion se realiza mediante una peticion al servidor
*
* @params item (row)
**/
const showDeleteConfirm = async (item, clase) => {

    const user_name = item.currentTarget.name;
    const user_id = item.currentTarget.id;

    confirm({
        title: 'Eliminar registro',
        icon: <ExclamationCircleOutlined />,
        content: '¿Estas seguro que deseas eliminar a ' + user_name + ' ?',
        okText: 'Continuar',
        okType: 'danger',
        cancelText: 'Cancelar',

        onOk() {
            axios.defaults.headers.get["Authorization"] = sessionStorage.getItem('token');

            axios({
                method: 'delete',
                url: '/usuarios/delete',
                headers: { Authorization: sessionStorage.getItem('token') },
                data: { id: user_id, status: 0 }
            })
                .then((response) => {
                    message.success(response.data.message);
        
                    clase.LoadUsers(1)
                })
                .catch((error) => {
                    console.log("error al borrar el usuario", error.response);
                })
        },
    });
}

export { ModalUsuarios, UsuariosList };