import React, { Component } from 'react';
import { Avatar, Row, Col, Button, Result } from 'antd';
import { Link } from 'react-router-dom';
import { Redirect } from 'react-router-dom';


import './Maintenance.css';

class Maintenance extends Component {


    constructor(props) {
        super(props);

    }

    render() {

        return (
            <Result
                    status="500"
                    title="500"
                    subTitle="EL servidor esta bajo mantenimiento. Disculpe las molestias."
                    extra={<Button type="primary"><Link to={"/"} >Ir al inicio</Link></Button>}
                />

        )

    }



}

export default Maintenance;
