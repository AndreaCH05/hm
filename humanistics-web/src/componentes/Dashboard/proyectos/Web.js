import React, {Component} from "react";
import { Layout, Steps, Row, Col, Form, Input, Select, Tooltip, Button, Avatar, Badge, Spin, message, Typography } from 'antd';
import { InfoCircleOutlined, LeftOutlined, PlusOutlined, LoadingOutlined} from '@ant-design/icons';
import { FaFacebook } from 'react-icons/fa';
//css
import '../../../css/proyectos.css'

const {Content} = Layout;
const { Step } = Steps;
const axios = require("axios").default;

class Web extends Component {


	constructor(props) {
		super(props)
		this.state = {
		}
	}

	/**
    * @memberof Web
    *
    * @method onFinish
    * @description Guarada los datos en el state del padre
    */
    onFinish = (values) => {
    	this.props.FinishForm(values)
    }



	render() {
		return (
			<Form 
				layout={"vertical"} 
				onFinish={this.onFinish}
				initialValues = {this.props.values}
				className="form-project"
			>
				<h3 className="pd-1"> 
					Pagina Web 
					<Tooltip title="Página web de la empresa"> 
						<InfoCircleOutlined style={{ marginLeft: "5px", color: '#492AF9' }} />
					</Tooltip> 
				</h3>
				<Form.Item
					name="pagina_web"
				>
					<Input className="input-box" placeholder="Página Web" />
				</Form.Item>

				<h3 className="sub-title pd-1">
					Página de Facebook 
					<Tooltip title="Página de Facebook de la empresa">
						<InfoCircleOutlined style={{ marginLeft: "5px", color: '#492AF9' }} />
					</Tooltip> 
				</h3>

				<Form.Item
					name="facebook"
				>
					<Input className="input-box" placeholder="Página Facebook" suffix={
						(!(this.state.facebookPage) || this.state.facebookPage == null) ?
							<a
								className="connect-facebook-page"
								onClick={() => this.connectFacebookPages()}>
								<FaFacebook size={30} className="connect-facebook-page-icon" />
								<span className="connect-facebook-page-divider" />
								<span className="connect-facebook-page-text">Conectar con Página de Facebook</span>
							</a>
							:
							<a
								className="connect-facebook-page"
								onClick={() => this.connectFacebookPages()}>
								<FaFacebook size={15} className="connect-facebook-page-icon selected" />
								<Avatar className="connect-facebook-page-avatar selected" src={axios.defaults.baseURL + 'upload/' + this.state.facebookPage.avatar} />
								<span className="connect-facebook-page-text selected">{this.state.facebookPage.name}</span>
							</a>

					} />
				</Form.Item>

				<h3 className="sub-title pd-1">
					Perfil de Instagram
					<Tooltip title="Perfil de Instagram de la empresa">
						<InfoCircleOutlined style={{ marginLeft: "5px", color: '#492AF9' }} />
					</Tooltip>
				</h3>
				<Form.Item
					name="instagram"
				>
					<Input className="input-box" placeholder="Perfil Instagram" />
				</Form.Item>

				<Form.Item className="center form-buttoms">
					<Button type="primary" htmlType="submit" className="btn-modal-morado">
						Aceptar
					</Button>
					<Button type="secondary" className="btn-anterior" onClick={()=>{this.props.prev(3)}}>
						Anterior
					</Button>
				</Form.Item>

			</Form>
		)
	}
}

export default Web;

