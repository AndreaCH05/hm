import React, { Component } from "react";
import Texty from 'rc-texty';
import Animate from 'rc-animate';
import { Button, Typography, Divider } from "antd";
import { RightOutlined } from '@ant-design/icons';

import { Link, DirectLink, Element, Events, animateScroll as scroll, scrollSpy, scroller } from 'react-scroll'


import '../../../css/Steps/Bienvenido.css'

const { Title, Paragraph, Text, } = Typography;


const axios = require("axios").default;




export default class Bienvenido extends Component {

    constructor(props) {
        super(props)
        this.state = {
            user: ""
        }
    }

    componentDidMount() {
        axios.defaults.headers.common['Authorization'] = sessionStorage.getItem('token');
    }

    static getDerivedStateFromProps(props, state) {
        return {
            user: props?.user?.nombre
        }
    }

    render() {
        return (
            <Typography className="welcome">
                <Title className="title">Bienvenido(a). {this.state.user} </Title>
                <Paragraph className="parragraph">
                    Nuestra Misión es crear el mejor entorno de trabajo para ti.
                </Paragraph>
                <Paragraph className="parragraph">
                    Esto solo tardara unos minutos
                </Paragraph>
                <Button className="btn-continue" onClick={this.props.onNext}>COMENZAR</Button>
            </Typography>
        );
    }
}


