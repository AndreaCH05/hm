import React, { Component } from "react";
import { Table, Layout, Select, Row, Col,Spin } from 'antd';
import { RightOutlined } from '@ant-design/icons';


const { Option } = Select;
const {Content}= Layout;
const axios = require("axios").default;


const columns = [
    {
      title: 'Nombre', 
      dataIndex: 'nombre',
      key: 'nombre',
      width:"20%"
      
    },
    {
      title: 'Descripción',
      dataIndex: 'descripcion',
      key: 'descripcion',
      width:"70%"
    },
    {
      title: '',
      key: 'actions',
      dataIndex: '_id',
      width:"10%",
      render: (text, record) => (
        <span className="actions-col">
          <a title="Editar" className="purple-icon" href={`/admin/industrias/editar/${record._id}`} ><RightOutlined /> </a>
         
        </span>
      ),
    },
  ];




class Industrias extends Component {

    constructor(props) {
        super(props);
        this.state = {
          nombreVista: '',
          user: 'Administrador',
          industrias: [],
          loading:true
        }
      }
       /**
   * @memberof Industrias
   *
   * @method componentDidMount
   * @description manda a llamar a receiveData para cargar los datos en state.industrias
   *
   **/

  componentDidMount() {  
    axios.defaults.headers.get['Authorization'] = sessionStorage.getItem('token');
    
    this.setState({
      nombreVista: 'Industrias',
      isAdmin: true
    });
    this.receivedData();
  }

  /**
  * @memberof Industrias
  *
  * @method   receivedData
  * @description  Metodo que realiza la consulta de las industrias
  *
  **/
 receivedData = () => {
  
    axios.get('/industrias',
      {
        headers: { Authorization: sessionStorage.getItem('token') },
       
      })
      .then(res => {
           this.setState({ 
            industrias:  res.data.data,
            loading:false
          });
        
      })
      .catch(error=>{
          console.log(error);
      });
  }



    render() {
        var industrias =this.state.industrias;
        return (
            <Layout className="bg-white">
                <Content className="pd-1" >
                    <Row >
                        <Col span={18} >
                            <h3 className="up font_color">Industrias</h3>
                        </Col>
                        <Col span={4} offset={1} style={{float:'right'}} >
                            <Select placeholder="Más recientes" className="input-box" style={{float:'right', width:'100%', marginTop:'0px'}} >
                                <Option value="1">Más recientes</Option>
                                <Option value="2">Más antiguos</Option>
                                <Option value="3">A - Z</Option>
                            </Select>
                        </Col>
                    </Row>
                    <div className="divForm">
                        <div className="div-contenedor" style={{width:"100%"}}>
                            <Table columns={columns} dataSource={industrias}  loading={this.state.loading}  className="blankTheme" />
                        </div>
                    </div>

                </Content>
            </Layout>
        );
    }
}

export default Industrias;
