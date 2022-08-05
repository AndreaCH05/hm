import React, { Component } from "react";
import { Layout, Row, Col, Button, Card, List, PageHeader, Typography, Spin, Empty } from 'antd';
import { UnorderedListOutlined, VerticalAlignBottomOutlined, RightOutlined } from '@ant-design/icons';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import axios from 'axios'
//css
import '../../../css/prospectos.css'
const { Content } = Layout;
const { Text } = Typography;

const responsive = {
    superLargeDesktop: {
        // the naming can be any, depends on you.
        breakpoint: { max: 4000, min: 3000 },
        items: 5
    },
    desktop: {
        breakpoint: { max: 3000, min: 1024 },
        items: 4
    },
    tablet: {
        breakpoint: { max: 1024, min: 464 },
        items: 2
    },
    mobile: {
        breakpoint: { max: 464, min: 0 },
        items: 1
    }
};

class ProspectosCards extends Component {

    constructor(props) {
        super(props)
        this.state = {
            loading: true,
            visible: false,
            prospectos: [],
            asesores: [],

        }
    }

    componentDidMount() {
        axios.defaults.headers.common['Authorization'] = sessionStorage.getItem('token');
        this.setState({ loading: true });
        this.getProspectosByStatus();
    }

    getProspectosByStatus = () => {
        axios.get('prospectos/status', {
            params: {
                proyecto_id: sessionStorage.getItem('proyecto'),
            }
        }).then(response => {
         
            this.setState({
                prospectos: response.data.prospectos,

            })
        }).catch(error => {
            console.log(error)
        })
            .finally(f => {
                this.setState({ loading: false })
            })
    }

    render() {
        return (
            <Content className="pd-1" style={{ height: "100vh" }}>
                <PageHeader className="title custom " title="PROSPECTOS"
                    extra={[
                        <div style={{ height: "55px", display: "flex", paddingTop: "3px", }}>
                            <Button key="1" type="ghost" icon={<VerticalAlignBottomOutlined />} />
                            <Button key="1" type="ghost" icon={<UnorderedListOutlined />} onClick={() => this.props.changeView('List')} />
                        </div>
                    ]} />
                <Spin spinning={this.state.loading}>
                    {(this.state.prospectos.length > 0) ?
                        <Carousel responsive={responsive} centerMode={true} style={{ height: "100vh" }} >
                            {this.state.prospectos.map(prospecto => {
                                    return <div>
                                        <Col span={24} className="center">
                                            <Card bordered hoverable className="prospecto-card">
                                                <Row className="prospecto-card-header" style={{ background: '#' + prospecto.estatus?.color }}>
                                                    <Col span={15} className="center">
                                                        <Text strong>{prospecto.estatus?.nombre}</Text>
                                                    </Col>
                                                    <Col span={9} className="center">
                                                        <Text>{prospecto.num_prospectos}</Text>
                                                    </Col>
                                                </Row>
                                                <List
                                                    className="prospecto-card-list"
                                                    dataSource={prospecto.prospectos}
                                                    renderItem={item => (
                                                        <List.Item key={item._id}>
                                                            <List.Item.Meta title={<a href="#">{item.nombre}</a>} />
                                                            <div>  <a title="Editar" className="purple-icon"   ><RightOutlined /> </a></div>
                                                        </List.Item>
                                                    )}
                                                >
                                                </List>
                                            </Card>
                                        </Col>
                                    </div>
                                })
                            }
                        </Carousel>
                        :
                        <Row justify="center" align="middle">
                            <Empty imageStyle={{ height: 180 }} description={<span>Sin Prospectos</span>} ></Empty>
                        </Row>
                    }
                </Spin>
            </Content>

        )
    }
}



export default ProspectosCards;
