import React, {Component} from "react";
import { Layout, Steps, Button, message, Row, PageHeader, Col, Form, Upload, Input } from 'antd'
import { PlusOutlined, UserOutlined, LeftOutlined, LoadingOutlined, RightOutlined } from '@ant-design/icons';
//css
import '../../../css/proyectos.css'

const {Content} = Layout;
const { Step } = Steps;
const axios = require("axios").default;

function beforeUpload(file) {
    try {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
            message.error('¡Solo archivos tipo jpeg y png!');
        }
        return isJpgOrPng;
    } catch (error) {
        console.log(error)

    }
}

class General extends Component {


	constructor(props) {
		super(props)
		this.state = {
		}

	}

	/**
    * @memberof Negocio
    *
    * @method handleChange
    * @description 
    * Se modifica el logo con archivo seleccionado
    */
    handleChange = info => {

        try {
            this.setState({ loading: true });

            if (info.file.status === 'uploading') {
                this.setState({
                    loading: true,
                    guardar: true,
                    spinning: true
                });
                return;
            }
            if (info.file.status === 'done') {
        
                this.setState({
                    image: info.file.response.filename,
                    loading: false,
                    spinning: false

                });
                this.props.setImage(info.file.response.filename)
            }
        } catch (error) {

        }
    };

    /**
    * @memberof General
    *
    * @method onFinish
    * @description Guarada los datos en el state del padre
    */
    onFinish = (values) => {
    
    	this.props.next(values,0)
    }


	render() {
		const {steps, current} = this.state
		const {image} = this.props
	
		return (
			<Form 
				layout={"vertical"} 
				onFinish={this.onFinish} 
				initialValues = {this.props.values}
				className="form-project"
			>
				<h3 className="pd-1">¿Cómo se llama tu negocio, Marca o Empresa? </h3>
				<Form.Item 
					name="nombre" 
					rules={[{
						required: true,
						message: 'Por favor ingresa nombre de tu Empresa o Negocio'
					}]}
				>
					<Input placeholder="Nombre" className="input-box" />
				</Form.Item>

				<h3 className="pd-1">Logo de tu Negocio, Marca o Empresa</h3>
				<Form.Item
					name="file"
					align="left"
					className="center"
				>
					<Upload
						listType="picture-card"
						className="avatar-uploader w100"
						showUploadList={false}
						action={axios.defaults.baseURL + 'upload/add'}
						beforeUpload={beforeUpload}
						onChange={this.handleChange}
						TextArea="Seleccionar"
					>
						{image ? <img src={axios.defaults.baseURL + 'upload/' + image} alt="avatar"
							style={{ width: '100%' }} /> :<div>
                                {this.state.loading ? <PlusOutlined /> : <PlusOutlined />}
                                <div className="ant-upload-text">Seleccionar</div>
                            </div>}
					</Upload>
				</Form.Item>

				<h3 className="pd-1">¿Qué tipo de productos - servicios vendes?  </h3>
				<Form.Item name="producto_servicio" rules={[{
					required: true,
					message: "Por favor ingresa su producto o servicios a vender.",
				}]}>
					<Input.TextArea className="input-box" row={6} placeholder="Descripción" style={{minHeight: '90px'}} />
				</Form.Item>


				<Form.Item className="center form-buttoms">
        			<Button type="primary" htmlType="submit" className="btn-modal-morado">
          				Aceptar
        			</Button>
      			</Form.Item>
			</Form>
		)
	}
}

export default General;

