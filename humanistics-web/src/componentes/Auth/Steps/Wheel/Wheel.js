

import React, { Component } from 'react'
import { Row, Col, Form, Input, Steps, Switch, Spin, Modal, Image, List } from 'antd';
import { UserOutlined, PhoneOutlined } from '@ant-design/icons';
import { Redirect } from "react-router-dom";

import './Wheel.css';
const { Step } = Steps;

export default class Bienvenido extends Component {



    
    static defaultProps = {
        steps: [],
        selected: null,
        onChange: () => {}
    }


    constructor(props) {
        super(props)
        this.state = {}
    }

    componentDidMount() {

    }

    render() {

        return (
            <Steps className="stepper" direction="vertical" current={this.props.selected} onChange={this.props.onChange}>
                {this.props.steps.map(({ title, description }) => <Step title={title} description={description} />)}
            </Steps>
        )
    }
}