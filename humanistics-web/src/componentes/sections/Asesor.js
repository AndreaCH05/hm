import React, { Component } from "react";
import { Button } from 'antd';

import { RightOutlined, LeftOutlined,ReloadOutlined  } from '@ant-design/icons';

import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';


const responsive = {
    superLargeDesktop: {
        // the naming can be any, depends on you.
        breakpoint: { max: 4000, min: 3000 },
        items: 6
    },
    desktop: {
        breakpoint: { max: 3000, min: 1024 },
        items: 5
    },
    tablet: {
        breakpoint: { max: 1024, min: 464 },
        items: 3
    },
    mobile: {
        breakpoint: { max: 464, min: 0 },
        items: 1
    }
};


class AsesoresCarousel extends Component{

    constructor(props){
        super(props)
        this.state={
            asesores: [],
            asesores_selected: [],

        }
    }

    static getDerivedStateFromProps(props, current_state) {

        if ( props.asesores != undefined && current_state.asesores !== props.asesores ) {
       
            return {
                asesores:props.asesores,
                asesores_selected: props.asesores.map(asesor=> asesor._id),
            }
        }
        return null
    }


    updateAsesor = (asesor_id) => {
      
        let asesorSelected = this.state.asesores_selected;
      
        let index = asesorSelected.indexOf(asesor_id);

        if (index !== -1)
        asesorSelected.splice(index, 1);
        else
        asesorSelected.push(asesor_id);

        this.setState({
            asesores_selected: asesorSelected
        });
        this.props.onStatusSelected(asesorSelected);
    };


    asesorControl = () => {
    

        let asesorSelected = [];
      
        if (this.state.asesores_selected.length > 0)
        asesorSelected = [];
        else
        asesorSelected = this.state.asesores.map(asesor=> asesor._id);
        this.setState({ asesores_selected: asesorSelected });
        this.props.onStatusSelected(asesorSelected);
    };


    render(){
        return(
            <div className="carousel-container" style={{overflow:"auto"}}>
                <Carousel
                    responsive={responsive} centerMode={true} className="carousel-status carousel-asesor"
                    customRightArrow={
                        <Button type="dashed" shape="circle" icon={<RightOutlined />} style={{position: 'absolute', right: 0, top: '13px',}} />
                    }
                    customLeftArrow={
                        <Button type="dashed" shape="circle" icon={<LeftOutlined />} style={{position: 'absolute', left: 0, top: '13px',}} />
                    }
                >

                    <Button type="link" block className="box-prospectos" onClick={this.asesorControl}>
                        <div className={"box-prospectos-color " + ((this.state.asesores_selected.length != 0 )?'shadow':'')} style={{ backgroundColor: `#492AF9`}} >
                            <span className="box-prospectos-numero"><ReloadOutlined style={{fontSize:'20pt', fontWeight:'700', color:'white', marginTop:'5px'}}/>&nbsp;</span>
                        </div>
                        <div className="box-prospectos-data">
                            <span className="box-prospectos-status box-prospectos-asesor" style={{ marginTop:'25px'}}>{ ((this.state.asesores_selected.length != 0 )?'Limpiar':'Todos')}</span>
                        </div>
                        <div className="divider"/>
                    </Button>

                    {
                        this.state.asesores.map(asesor => {
                          
                            return (
                                <Button type="link" block className="box-prospectos" onClick={()=>this.updateAsesor(asesor._id)} style={{minWidth:'120px', marginRight:'10px'}}>
                                    <div className={"box-prospectos-color " + ((this.state.asesores_selected.indexOf(asesor._id) !== -1 )?'shadow':'')} style={{ backgroundColor: `${asesor.color}`}}></div>
                                    <div className="box-prospectos-data">
                                        <span className="box-prospectos-numero titulo">{asesor.cantidadProspectos}</span>
                                        <span className="box-prospectos-status box-prospectos-asesor">{asesor.nombre}</span>
                                    </div>
                                </Button>
                            );
                        })
                    }
                </Carousel>
            </div>

        )
    }
}

export default AsesoresCarousel;
