import React, { Component } from "react";
import { Row, Layout, Tabs } from 'antd';

import Nombre from './nombre'
import Contrasena from './contrasena'


const { Content } = Layout;
const { TabPane } = Tabs;


class InformacionPersonal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      usuario: ''
    }
  }

  /**
   * @memberof InformacionPersonal
   *
   * @method componentDidMount
   * @description  Envia los datos del formulario al Servidor
   *
   *
   **/

  componentDidMount() {
    if ((sessionStorage.getItem('token') != null)) {
      var proyecto = JSON.parse(sessionStorage.getItem("proyecto_objeto"));
      var id = proyecto.usuarios_id;
      this.setState({ usuario: id });

    }


  }

  render() {
    var user = this.state.usuario
    return (
      <Layout>
        <Content className="bg-white pd-2 ">
          <div >
            <div>
              <h1 className="text-green center title" style={{ fontSize: "20pt" }} >Información Personal</h1>
            </div>
            <Tabs defaultActiveKey="1" className=" center contenedor-shadow" >
              <TabPane tab="Nombre" key="1">
                <Nombre />
              </TabPane>

              <TabPane tab="Contraseña" key="2">
                <Contrasena />
              </TabPane>

            </Tabs>
          </div>

        </Content>
      </Layout>
    )
  }
}

export default InformacionPersonal;



