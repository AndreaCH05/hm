import React, { Component } from "react";
import Texty from 'rc-texty';
import Animate from 'rc-animate';
import { Avatar as ImageAvatar, Button, Col, Form, Row, Upload, message, Modal, Typography } from "antd";

import { UserOutlined, LeftOutlined, LoadingOutlined, RightOutlined } from '@ant-design/icons';


import { Redirect } from 'react-router-dom'

//Redirect

import '../../../css/Steps/Avatar.css';
import '../../../css/Steps/Bienvenido.css'

import { CirclePicker } from "react-color";

const axios = require("axios").default;
const { Title, Paragraph, Text, } = Typography;


function beforeUpload(file) {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
        message.error('You can only upload JPG/PNG file!');
    }
    return isJpgOrPng;
}


export default class Avatar extends Component {

    form = React.createRef();

    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            av_color: "#dadada",
            imageUrl: true,
            img: [],
            redirect: false,
            guardar: false
        }
    }


    /**
     *
     *
     * @memberof Avatar
     * @function componentDidMount
     * 
     * @description Obtenemos la infomración del usuario loggeado, especificamente el color y el avatar. 
     */
    componentDidMount() {
        axios({
            method: 'get',
            url: '/user/logged',
            headers: { Authorization: sessionStorage.getItem('token') },
        })
            .then((response) => {
 
                var dataUser = response.data.data;
        

                if (dataUser.color != undefined && dataUser.color != "") {
                    this.setState({ av_color: dataUser.color });
                }
                if (dataUser.avatar != undefined && dataUser.avatar != "") {
                    this.setState({ image: dataUser.avatar });
                }
                this.setState({ userName: response.data.data.nombre });
            })
            .catch((error) => {
                console.log("error", error.response);
            });

    }


    /**
     * @memberof SetUp2
     *
     * @method handleChangeColor
     * @description Actualiza el state.color con el valor seleccionado
     */
    handleChangeColor = (color, event) => {
        this.state.av_color = color.hex;
        this.handleSubmit()
    }

    /**
     *
     *
     * @memberof Avatar
     * @function handleSubmit
     * 
     * @description Obtenemos la infomración del usuario loggeado, especificamente el color y el avatar. 
     * 
     * @param image Imagen actual
     * @param color Color
     */
    handleSubmit = (image = this.state.image, color = this.state.av_color) => {
    
        this.setState({ guardar: !this.state.guardar })
        axios.post("/register/avatar", {
            avatar: image,
            color
        }, {
            headers: {
                Authorization: sessionStorage.getItem('token')
            }
        })
            .then(res => {
                this.setState({ guardar: false });
 
            })
            .catch(error => {
                Modal.error({
                    title: "No es posible actualizar.",
                    content: "Hubo un error al procesar la solicitud. Contacta al administrador."
                });
            })
    };

    /**
     *
     *
     * @memberof Avatar
     * @function handleChange
     * 
     * @description Cuando se actualiza el avatar y el archivo está en proceso. Cuando está arriba, se actualiza el estaod. 
     * 
     * @param image Imagen actual
     * @param color Color
     */
    handleChange = info => {
        if (info.file.status === 'uploading') {
            this.setState({ loading: true, guardar: true });
            return;
        }
        if (info.file.status === 'done') {
            this.state.image = info.file.response.filename;
            this.handleSubmit()
            this.setState({
                image: info.file.response.filename,
                loading: false,
            });
        }
    };


    render() {
        const { image } = this.state;
        return (
            <div className="welcome avatar">
                <Typography className="">
                    <Title className="title center">Selecciona tu Avatar </Title>
                </Typography>

                <Row justify="center">
                    <Col xs={20} xl={11} align="middle" justify="center">
                        <Paragraph className="parragraph center"> Sube tu logo o fotografia </Paragraph>
                        <Upload
                            name="file"
                            listType="picture-card"
                            className="avatar-uploader"
                            showUploadList={false}
                            action={axios.defaults.baseURL + 'upload/add'}
                            beforeUpload={beforeUpload}
                            onChange={this.handleChange}
                        >
                            {image ?
                                <div style={{
                                    backgroundImage: `url(${axios.defaults.baseURL + 'upload/' + image})`, backgroundPosition: 'center',
                                    backgroundSize: 'cover',
                                    backgroundRepeat: 'no-repeat', width: '100% ', height: '100%', position: 'relative', left: '1px', top: '1px', borderRadius: '100%'
                                }} /> :
                                <div>
                                    {this.state.loading ? <LoadingOutlined /> : <UserOutlined />}
                                    <div className="ant-upload-text">Subir imagen</div>
                                </div>
                            }
                        </Upload>
                    </Col>
                    <Col xs={20} xl={3} >
                        <Paragraph className="parragraph"> Ó </Paragraph>
                    </Col>
                    <Col xs={20} xl={10} >
                        <Paragraph className="parragraph">
                            Seleccióna un color
                        </Paragraph>
                        <div className="uploader-container">
                            <ImageAvatar size={100} icon={<UserOutlined />} style={{
                                background: this.state.av_color,
                                display: 'block',
                                margin: "0px auto",
                                marginBottom: '1em'
                            }} />
                            <CirclePicker onChange={this.handleChangeColor} className="color-picker" />
                        </div>
                    </Col>
                </Row>

                <Row align="center">

                    <Col span={24} className="center">
                        <Paragraph className="parragraph">
                            Puedes omitir este paso
                        </Paragraph>
                    </Col>

                    <Col span={24} className="center">
                        <Button className="btn-continue" onClick={this.props.onNext}>COMENZAR</Button>
                    </Col>
                </Row>
            </div>
        )
    }
}


