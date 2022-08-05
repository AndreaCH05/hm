import React, { Component } from "react";
import { Layout, Col, Row, PageHeader, Form, Input, Button, Upload } from "antd";
import { DownloadOutlined,InboxOutlined } from '@ant-design/icons';

import './../../../../css/cuentas.css'

const { Content } = Layout;
const axios = require("axios").default;


class S_EditarProyecto extends Component {

    EditarProyecto = React.createRef();
    constructor(props) {
        super(props)
        this.state = {
            proyecto: [],
            id_proyecto: '',
            fileList: []
        }
    }

    componentDidMount() {
        // axios.defaults.headers.get['Authorization'] = sessionStorage.getItem('token');

        // const pid = this.props.match.params.id//
        // console.log("pid", pid);
        // if (pid != undefined) {
        //     console.log("editar anuncio");
        //     this.LoadData(pid);
    }
    /**
    * @memberof EditarProyecto
    *
    * @method handleSubmit
    * @description  Envia los datos del formulario al Servidor
    *
    * @param values (array)
    * Contiene los campos del formulario para registrar al usuario
    **/

    handleSubmit = values => {

    }



    render() {
        return (
            <Layout className="bg-white layout-cuenta-proyecto"  >
                <Content className="bg-white pd-1">
                    <div className="container-shadow pd-2" style={{ height: "95vh" }}>
                        <Row>
                            <PageHeader className="font_color " title="Cuentas" />
                        </Row>
                        <Row gutter={[16, 16]}>
                            <Col span={24} className="font_color up"> Editar -Proyecto-</Col>

                            <Col span={24} className="mt-10">
                                <Form initialValues={{ remember: true }} onFinish={this.handleSubmit} layout={"vertical"} ref={this.EditarProyecto} >
                                     <Row gutter={[16, 16]}>
                                        <Col xs={24} md={12} lg={12}>                                            
                                            <Col span={24} className="" style={{ color: "#492AF9", fontSize: 25, fontWeight: 700 }}> Nombre</Col>
                                            <Form.Item name="nombre"  rules={[{ required: true, message: 'Por favor ingresa el Nombre' }]}>
                                                <Input placeholder="Nombre" className="input-box" />
                                            </Form.Item>
                                        </Col>

                                        <Col xs={24} md={12} lg={12}>

                                        <Col span={24} className="" style={{ color: "#492AF9", fontSize: 25, fontWeight: 700 }}> Plan</Col>
                                            <Form.Item name="plan"  rules={[{ required: true, message: 'Por favor ingresa el Precio' }]}>
                                                <Input placeholder="Plan" className="input-box" />
                                            </Form.Item>

                                        </Col>
                                    </Row>


                                    <Row gutter={[16, 16]}>
                                        <Col span={24} className="" style={{ color: "#492AF9", fontSize: 25, fontWeight: 700 }}> Logo</Col>
                                        <Col span={24} className="center">

                                           
                                                <Form.Item 
                                                name="file" 
                                                defaultFileList={this.state.fileList}
                                                initialValue={this.state.fileList}
                                                style={{width:"100%"}}>

                                                    <Upload.Dragger>
                                                        <p className="ant-upload-drag-icon">
                                                            <InboxOutlined />
                                                        </p>
                                                        <p className="ant-upload-text" style={{color:"red"}}>Click or drag file to this area to upload</p>

                                                    </Upload.Dragger>
                                                </Form.Item>
                                        
                                        </Col>
                                    </Row>
                                    <Row gutter={[16, 16]}>
                                        <Col span={24} style={{textAlign:"right", bottom:"0"}}>
                                            <Form.Item >
                                                <Button type="primary" 
                                                    htmlType="submit" 
                                                    className="btn btn-primary btn-form"
                                                    style={{
                                                        background:"#492AF9",
                                                        minWidth:"200px"
                                                    }}
                                                    >
                                                    Guardar
                                                </Button>
                                            </Form.Item>
                                        </Col>
                                    </Row>

                                </Form>
                            </Col>
                        </Row>
                    </div>
                </Content>
            </Layout>
        )
    }
}

export default S_EditarProyecto;