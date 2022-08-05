import React, {Component} from "react";
import { Layout, Steps, Button, message, Row, PageHeader, Col, Form, Upload, Input, AutoComplete, Select, InputNumber } from 'antd'
import { PlusOutlined, UserOutlined, LeftOutlined, LoadingOutlined, RightOutlined } from '@ant-design/icons';
//css
import '../../../css/proyectos.css'

const {Content} = Layout;
const { Option } = Select;
const { Step } = Steps;
const axios = require("axios").default;

class Industria extends Component {


	constructor(props) {
		super(props)
		this.state = {
			industrias: []
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
		this.getIndustrias();
	}

	/**
	 *
	 * @methodOf Industria
	 *
	 * @function getIndustrias
	 * @description trae la lsita de industrias disponibles
	 * */
	getIndustrias = () => {
		axios.get('/industrias',{})
			.then((response) => {
				this.setState({
					industrias: response.data.data
				});
			}).catch((error) => {
				message.error("No se pudieron cargar industrias");
				console.log("error", error.response);
			})
	}

	

	/**
    * @memberof Industria
    *
    * @method onFinish
    * @description Guarada los datos en el state del padre
    */
    onFinish = (values) => {

    	this.props.next(values,1)
    }


	render() {
		const {steps, current} = this.state

		return (
			<Form 
				layout={"vertical"} 
				onFinish={this.onFinish}
				initialValues = {this.props.values}
				className="form-project"
			>
				<h3 className="pd-1">Industria</h3>
				<Form.Item
					name="industria_id"
					rules={[{ required: true, message: 'Por favor ingresa tu Industria!' }]}
				>
					<Select placeholder="Seleccionar industria" className="input-box">
						{this.state.industrias.map(ind=> <Option value={ind._id}>{ind.nombre}</Option>)}
					</Select>
				</Form.Item>

				<h3 className="pd-1">Descripción General</h3>
				<Form.Item
					name="descripcion_general"
					rules={[{ required: true, message: 'Por favor ingresa tu Descripcion General!' }]}
				>
					<Input.TextArea className="input-box" placeholder="Descripción" style={{minHeight: '90px'}} />
				</Form.Item>

				<h3 className="pd-1">¿Cuantós prospectos clientes quieres al mes?</h3>
				<Form.Item
					name="prospectos_deseados"
					rules={[{ required: true, message: 'Por favor selecciona una opción!' }]}                
				>
					<InputNumber min={0} className="input-box"/>
				</Form.Item>


				<Form.Item className="center form-buttoms">
					<Button type="primary" htmlType="submit" className="btn-modal-morado">
						Aceptar
					</Button>
					<Button type="secondary" className="btn-anterior" onClick={()=>{this.props.prev(1)}}>
						Anterior
					</Button>
				</Form.Item>
			</Form>
		)
	}
}

export default Industria;

