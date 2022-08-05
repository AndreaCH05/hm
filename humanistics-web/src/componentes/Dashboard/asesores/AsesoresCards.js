import React, { Component } from "react";
import { Row, Col, Avatar, Progress, Card, Spin } from 'antd';



function AsesoresCards({ asesor }) {


    return (
        <Col xs={24} lg={12} xl={8} xxl={6} span={6}  className="border">
            <Card key={index} bordered={false} loading={false} hoverable className="card-cuenta" cover={
                <div className={clase} >
                    <Avatar style={{ width: 80, height: 80, marginLeft: "33%", marginTop: "20px" }} src={"/logo192.png"} />
                </div>}
            >
                <Card.Meta title={item.nombre}></Card.Meta>
                <div style={{ padding: '3px 8px' }}>
                    <p>Estatus hoverable</p>
                    <Progress percent={30} />
                    <p>Estatus</p>
                    <Progress percent={50} />
                    <p>Estatus</p>
                    <Progress percent={70} />
                </div>
            </Card>
        </Col>

    )

}

export default AsesoresCards;