import React, { Component } from "react";
import {
    Layout, Card, List, Spin, Col, Row, PageHeader, Input, Button,
    message, Empty, Pagination,
    Progress, Avatar, Typography
} from "antd";

import {
    RightOutlined, SearchOutlined, AppstoreOutlined, DownloadOutlined
    , VerticalAlignBottomOutlined, PlusOutlined
} from '@ant-design/icons';

import { FaListUl } from "react-icons/fa";

import './../../../../css/cuentas.css'

import CuentasLista from './cuentasList';
import { CuentasCards } from './../../../Widgets/Cards/cards'

const { Content } = Layout;
const { Search } = Input;
const { Title, Text } = Typography;

const axios = require("axios").default;


export default class Cuentas extends Component {

    constructor(props) {
        super(props)
        this.state = {
            loading: true,
            tipo: "cards",

            data: [
                {
                    _id: 1,
                    name: "proyecto bauens"
                },
                {
                    _id: 2,
                    name: "proyecto bauens"
                },
                {
                    _id: 3,
                    name: "proyecto bauens"
                },
                {
                    _id: 4,
                    name: "proyecto bauens"
                }
            ],

            dataCuentas: [],
            dataProyectos: [],



            /* Paginado */
            itemCount: 0,
            pageCount: 1,
            currentPage: 1,
            page: 1,
            limit: 10,
            sort: { field: "createdAt", order: "descend" },
            filter: '',
            search: '',
        }

    }
    componentDidMount() {
        this.getCuentas();
    }


    getCuentas = async (
        page = this.state.currentPage,
        limit = this.state.limit,
        sort = this.state.sort,
        search = this.state.search,
    ) => {

        this.setState({ loading: true });

        axios({
            method: 'post',
            url: '/usuarios/cuentas',
            headers: { Authorization: sessionStorage.getItem('token') },
            data: { page, limit, sort, search }
        })
            .then((response) => {
                if (response.data.success) {
                    let dataTable = response.data.data.itemsList;
                    let paginator = response.data.data.paginator;

                    this.setState({
                        dataCuentas: dataTable,
                        dataProyectos: response.data.dataProyectos,

                        itemCount: paginator.itemCount,
                        currentPage: paginator.currentPage,
                        pageCount: paginator.pageCount,
                        loading: false,
                        filtroSearch: search,
                    })
                }
            })
            .catch((error) => {

                //  console.log("error  ", error.response);
                message.error("Error.");
            })
    }




    onChangeTypeView() {

        this.setState({
            loading: true
        });


        if (!this.state.cargando) {
            var tipo = this.state.tipo;

            if (tipo == "cards") {
                this.setState({
                    tipo: "list",
                    cargando: true
                });
            }
            else {
                this.setState({
                    tipo: "cards",
                    cargando: true
                });
            }
            setTimeout(async () => {
                this.setState({
                    cargando: false,
                    loading: false
                });
            }, 1500);
        }
        else {
            message.warning("Espere un momento.")
        }
    }


    onChangeSearch = async (search) => {
        this.setState({ search: search, loading: true });
        setTimeout(() => {
            this.getCuentas(1);
        }, 250);
    }

    render() {
        let { loading, tipo, dataCuentas, dataProyectos } = this.state;


        return <Layout className="bg-white layout-cuentas">
            <Content className="pd-1">

                <PageHeader title="CUENTAS" className="title custom"
                    extra={[
                        <Row>
                            <Col span={24}>
                                <Search
                                    className="input-box search-bar"
                                    placeholder="Buscar..."
                                    onSearch={value => console.log(value)}
                                    style={{ width: 200 }}
                                    onSearch={this.onChangeSearch}
                                />

                                <Button
                                    htmlType="button"
                                    className="purple-icon "
                                    disabled
                                >
                                    <PlusOutlined />
                                </Button>

                                <Button
                                    htmlType="button"
                                    className="purple-icon "
                                    title={(tipo != "list") ? "Ver como lista" : "Ver como cards"}
                                    onClick={() => this.onChangeTypeView()}
                                    icon={
                                        (tipo != "list") ?
                                            <FaListUl style={{ marginTop: "4px" }} />
                                            :
                                            <AppstoreOutlined style={{ margin: "0px" }} />}
                                />


                                <Button
                                    htmlType="button"
                                    className="purple-icon"
                                    disabled

                                >
                                    <VerticalAlignBottomOutlined />
                                </Button>
                            </Col>
                        </Row>

                    ]}
                />

                <Content>
                    <Spin spinning={loading} >
                        <Row gutter={[16, 16]} className="cnt-cards">
                            {(tipo === "cards") ?
                                dataCuentas.map(function (item, index) {
                                    let proyectos = [];

                                    for (let index = 0; index < dataProyectos.length; index++) {
                                        const element = dataProyectos[index];
                                        console.log(element)

                                        if (item._id === element.user_id) {
                                            proyectos = element.proyectos;
                                            break;
                                        }
                                    }

                                    return <CuentasCards
                                        cuenta={item}
                                        proyectos={proyectos} />
                                })

                                :
                                <CuentasLista
                                    cuentas={dataCuentas}
                                    proyectos={dataProyectos}
                                />
                            }
                        </Row>

                        <Row style={{ width: '100%' }} className="">
                            <Pagination
                                current={this.state.currentPage}
                                total={this.state.itemCount}
                                defaultPageSize={this.state.limit}
                                showSizeChanger={false}
                                onChange={(page) => {
                                    this.getProyectos(page)
                                }}
                            />
                        </Row>
                    </Spin>
                </Content>
            </Content>
        </Layout>
 
    }
}







/*    return (
              <Layout className="layout-cuentas">

                  <Content className="pd-1">
                      <Row gutter={[8, 8]}>
                          <Col span={16}><h3 className="up font_color">Cuentas</h3></Col>
                          <Col span={8}>
                              <Search
                                  className="input-box search-bar m-1"
                                  placeholder="Buscar..."
                                  onSearch={value => console.log(value)}
                                  style={{ width: 200 }}
                              />
                              <Button
                                  htmlType="button"
                                  className="purple-icon w10 m-1"
                              >
                                  <PlusOutlined />
                              </Button>
                              <Button
                                  htmlType="button"
                                  className="purple-icon w10 m-1 "
                              >
                                  <VerticalAlignBottomOutlined />
                              </Button>
                          </Col>
                      </Row>


                      <Row gutter={[16, 16]} className="cnt-cards">

                          {this.state.dataCards.map(card => {

                              return <Col span={6}>
                                  <Card bordered={false} loading={false} hoverable className="card-cuenta" cover={
                                      <div className={"card-cuenta-img card-f1"} >
                                          <Title level={1}>NombreCuenta</Title>
                                      </div>}
                                  >
                                      <List
                                          className="card-cuenta-list"
                                          dataSource={this.state.data}
                                          renderItem={item => (
                                              <List.Item key={item._id}>
                                                  <List.Item.Meta title={<a href="https://ant.design">{item.name}</a>} />
                                                  <div>  <a title="Editar" className="purple-icon"   ><RightOutlined /> </a></div>
                                              </List.Item>
                                          )}
                                      >

                                      </List>

                                  </Card>
                              </Col>
                          })}


                      </Row>

                  </Content>
              </Layout>
          )
          */