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
        items: 1
    },
    mobile: {
        breakpoint: { max: 464, min: 0 },
        items: 1
    }
};
class EstatusCarousel extends Component{

    constructor(props){
        super(props)
        this.state={
            estatus: [],
            estatus_selected: [],
        }
    }

    static getDerivedStateFromProps(props, current_state) {
        if (current_state.estatus !== props.estatus) {
            return {
                estatus: props.estatus,
                //estatus_selected: props.estatus.map(estatus=> estatus._id),
            }
        }
        return null

    }


    updateEstatus = (status_id) => {
        let estatusSelected = this.state.estatus_selected;
        // const estatus = estatusSelected.find(estatus => estatus == status_id);
        let index = estatusSelected.indexOf(status_id);

        if (index !== -1)
            estatusSelected.splice(index, 1);
        else
            estatusSelected.push(status_id);

        this.setState({
            estatus_selected: estatusSelected
        });
     
        this.props.onStatusSelected(estatusSelected);
    };


    estatusControl = () => {
        let estatusSelected = [];
     
        if (this.state.estatus_selected.length > 0)
            estatusSelected = [];
        else
            estatusSelected = this.state.estatus.map(estatus=> estatus._id);
        this.setState({ estatus_selected: estatusSelected });
 
        this.props.onStatusSelected(estatusSelected);
    };


    render(){
        return(
            <div className="carousel-container">
                <Carousel
                    responsive={responsive} centerMode={true} className="carousel-status"
                    customRightArrow={
                        <Button type="dashed" shape="circle" icon={<RightOutlined />} style={{position: 'absolute', right: 0, top: '13px',}} />
                    }
                    customLeftArrow={
                        <Button type="dashed" shape="circle" icon={<LeftOutlined />} style={{position: 'absolute', left: 0, top: '13px',}} />
                    }
                >
                    <Button type="link" className="box-prospectos" onClick={this.estatusControl}>
                        <div className={"box-prospectos-color " + ((this.state.estatus_selected.length != 0 )?'shadow':'')} style={{ backgroundColor: `#492AF9`}} >
                        </div>
                        <div className="box-prospectos-data">
                            <span className="box-prospectos-numero"><ReloadOutlined/>&nbsp;</span>
                            <span className="box-prospectos-status">{ ((this.state.estatus_selected.length != 0 )?'Limpiar':'Todas')}</span>
                        </div>
                        <div className="divider"/>
                    </Button>

                    {
                        this.state.estatus.map(estatus => {
                            return (
                                <Button type="link" className="box-prospectos" onClick={()=>this.updateEstatus(estatus._id)}>
                                    <div className={"box-prospectos-color " + ((this.state.estatus_selected.indexOf(estatus._id) !== -1 )?'shadow':'')} style={{ backgroundColor: `#${estatus.color}`}} />
                                    <div className="box-prospectos-data">
                                        <span className="box-prospectos-numero">{estatus.ponderacion}%</span>
                                        <span className="box-prospectos-status">{estatus.nombre}</span>
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

export default EstatusCarousel;
