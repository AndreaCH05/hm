import React, { Component } from 'react';
import { Avatar, Row, Col, Button, Empty } from 'antd';
import { Link } from 'react-router-dom'
import  moment  from 'moment';
class UltimasVentas extends Component {
    constructor(props) {
        super(props);
        var fechaActual = new Date();
       
        fechaActual = fechaActual.toLocaleDateString();
        this.state = {
            ventas: [
            ]
        }
    }

    render() {
        return (
            <div className="card-chart card-list">
                <Row className="pd-1">
                    <h2 className="ant-page-header-heading-title"> Últimas Ventas</h2>
                </Row>
                {(this.props.data != undefined && this.props.data.length > 0) ? this.props.data.map((venta, index) => {
                    return <Row className="contenedor_row row-element" >
                        <Col span={12} className="center">
                            <label title="Clave de venta">
                                {venta.nombre}
                            </label>
                        </Col>
                        <Col span={12} className="center">
                            <label title="Fecha">
                                {moment(venta.fecha_completado).format('DD-MM-YYYY')}
                            </label>
                        </Col>
                    </Row>
                })
                    :
                    <Row className="contenedor_row row-element" >
                        <Empty style={{display:'block',margin:'auto'}} description={<span>Sin Ventas</span>} ></Empty>
                    </Row>
                }

            </div>

        )

    }



}

export default UltimasVentas;
