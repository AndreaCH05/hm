import React, { Component, useState, FC } from 'react'
import { Link } from 'react-router-dom'
import {
    Row,
    Col,
    Form,
    Input,
    Button,
    InputNumber,
    Tabs,
    Modal,
    Typography,
    Divider,
    Avatar,
    Space,
    Card,
    Popover,
    Empty,
    message

} from 'antd';
import {
    LeftOutlined,
    RightOutlined,
    PlusOutlined,
    MinusOutlined,
    LoadingOutlined,
    UserOutlined,
    MinusCircleOutlined,
    DeleteOutlined
} from '@ant-design/icons';

import reactCSS from 'reactcss'
import { CirclePicker, TwitterPicker } from "react-color";


import { ReactSortable } from "react-sortablejs";
import { CloseIcon } from "../../../Widgets/Iconos";

import { BsThreeDotsVertical } from 'react-icons/bs'
import "../../../../css/Steps/Estatus.css"


const axios = require("axios").default;
const { Title, Paragraph, Text, } = Typography;


const { TabPane } = Tabs;


//Variable de colores para generar una nueva linea con color random
let arrayColores =
    ['#FF6633', '#FFB399', '#FF33FF', '#FFFF99', '#00B3E6',
        '#E6B333', '#3366E6', '#999966', '#99FF99', '#B34D4D',
        '#80B300', '#809900', '#E6B3B3', '#6680B3', '#66991A',
        '#FF99E6', '#CCFF1A', '#FF1A66', '#E6331A', '#33FFCC',
        '#66994D', '#B366CC', '#4D8000', '#B33300', '#CC80CC',
        '#66664D', '#991AFF', '#E666FF', '#4DB3FF', '#1AB399',
        '#E666B3', '#33991A', '#CC9999', '#B3B31A', '#00E680',
        '#4D8066', '#809980', '#E6FF80', '#1AFF33', '#999933',
        '#FF3380', '#CCCC00', '#66E64D', '#4D80CC', '#9900B3',
        '#E64D66', '#4DB380', '#FF4D4D', '#99E6E6', '#6666FF']


/**
 *
 * @function exists
 * @description Verifica si existe el elemento enviado
 *
 * @param {*} element
 * @return {*} 
 */
function exists(element) {
    return (element !== undefined && element !== null && element !== "")
}


/**
 *
 *
 * @class StatusCard
 * @extends {Component}
 * 
 * @property onChange Cuando se cambia el color, el texto o el numerbo, se ejecuta este metodo que envia un valor con los valores actuales
 * @property onDelete Cuando se presiona el boton rojo de eliminar
 * @property index Posición actual del elemento
 * @property values Valores predipuestos del Status Card
 * 
 * @state color Color actual
 * @state text Texto, nombre acctual
 * @state number Ponderación actual
 */
class StatusCard extends Component {

    static defaultProps = {
        onChange: () => {
        },
        onDelete: () => {
        },
        index: "",
        values: { color: 'red', text: '', number: '' },
        error: false
    }


    /**
     * Creates an instance of StatusCard.
     * @param {*} props
     * @memberof StatusCard
     * 
     */
    constructor(props) {
        super(props);
        this.state = {
            color: 'red',
            text: '',
            number: 0
        }
    }


    /**
     *
     *
     * @static
     * @param {*} props Propiedades actuales
     * @param {*} state Estado actual
     * @return {*} 
     * @memberof StatusCard
     * 
     * @description Actualizamos los colores, el texto y el nnumero si alguno cambio de forma externa. Se actalizan al estado
     */
    static getDerivedStateFromProps(props, state) {
        if (props.values.color !== state.color || props.values.text !== state.text || props.values.number !== state.number || props.values._id !== state._id)
            return props.values
    }

    /**
     *
     *
     * @param {*} {text = this.state.text, color = this.state.color, number = this.state.number,}
     * @memberof StatusCard
     * 
     * @description Actualizamos los valores internos y ejecutamos el onChange para actualizar los externos
     */
    onValueChange = ({ text = this.state.text, color = this.state.color, number = this.state.number, }) => {

        this.setState({
            text, color, number
        })
        this.props.onChange({
            text, color, number , _id: this.state._id
        })
    }

    render() {

        const { onValueChange } = this
        const { text, number, color } = this.state
        const { index, onDelete } = this.props
        return <Row className="status-card-container" gutter={[16, 16]}>
            <Col span={19}>
                <Row className="status-card">
                    <Col span={2}>
                        <BsThreeDotsVertical className="icon" />
                    </Col>
                    <Col span={2}>
                        <Popover

                            trigger={["click"]}
                            content={<TwitterPicker colors={arrayColores} color={color}
                                onChange={(color) => onValueChange({ color: color.hex })} />}
                            title="Title">
                            <Avatar className="status-avatar" style={{ backgroundColor: color }} color={color} />
                        </Popover>
                    </Col>
                    <Col span={20}>
                        <Input
                            value={text}
                            placeholder={"Estatus " + index}
                            className="status-text"
                            onChange={(event) => onValueChange({ text: event.target.value })} />
                    </Col>
                </Row>
            </Col>
            <Col span={4}>
                <InputNumber
                    max={100}
                    min={0}
                    className="status-value"
                    onChange={(numberValue) => onValueChange({ number: numberValue })}
                    value={number} />
            </Col>
            <Col span={1}>
                <Button onClick={onDelete} type="primary" shape="circle" className="btn-delete-status"
                    icon={<DeleteOutlined className="icon" />} />
            </Col>

        </Row>
    }

}

/**
 *
 *
 * @class Estatus
 * @extends {Component}
 * 
 * @state isModalInforVisible Para el modal que explica que es esto
 * @state modalActive Para validar que el modal solo se abra una vez por sesión,1
 * @state activos Arreglo de estatus activos
 * @state terminados Arreglo de estatus terminados
 * @state perdidos Arreglo de estatus perdidos
 */
class Estatus extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isModalInfoVisible: false,
            modalActive: false,
            activos: [],
            terminados: [
                {
                    color: arrayColores[3],
                    text: '',
                    number: 100
                }
            ],
            perdidos: [{
                color: arrayColores[4],
                text: '',
                number: 0
            }],
            project_id: null
        };
    }

    /**
     *
     *
     * @param {*} prevProps
     * @memberof Estatus
     * 
     * @description Abrimos el modal si es la primera veez que se abre.
     */
    componentDidUpdate(prevProps) {
        axios.defaults.headers.common['Authorization'] = sessionStorage.getItem('token')

        if (this.props.proyecto._id !== undefined && (this.state.project_id?.toString() !== this.props.proyecto?._id?.toString())) {
            this.setState({project_id: this.props.proyecto._id})
      
        }

        if(this.state.project_id?.toString() === this.props.proyecto?._id?.toString() && prevProps.visible !== this.props.visible && this.props.visible === true){
    
        	this.getStatus()
        }
    }


    getStatus = (project_id = this.state.project_id) => {
      
        axios.get('/estatus/project/list', {
            params: {
                project_id
            }
        })
            .then(({ data }) => {
        
                let activos = []
                let terminados = []
                let perdidos = []

                for (const status of data.data) {

                    // * 0 -> Perdido
                    // * 1 -> Activo
                    // * 2-> Completado
                    switch (status.tipo) {
                        case 0:
                            perdidos.push({
                                _id: status._id,
                                color: "#" + status.color,
                                text: status.nombre,
                                number: status.ponderacion,
                                //...status
                            })
                            break;
                        case 1:
                            activos.push({
                                _id: status._id,
                                color:  `#${status.color}`,
                                text: status.nombre,
                                number: status.ponderacion,
                                //...status
                            })
                            break;
                        case 2:
                            terminados.push({
                                _id: status._id,
                                color: "#" + status.color,
                                text: status.nombre,
                                number: status.ponderacion,
                                //...status
                            })
                            break;

                    }

                }

     
                this.setState({ activos, terminados, perdidos   })

            })
    }

    /**
     *
     *
     * @memberof showModal
     * @function Abrimos el modal
     */
    showModal = () => {
        this.setState({ isModalInfoVisible: true })
    }

    /**
     *
     *
     * @memberof showModal
     * @function Cerramos el modal
     */
    handleCancel = () => {
        this.setState({ isModalInfoVisible: false })
    }

    /**
     *
     *
     * @param {*} status_type
     * @memberof Estatus
     * 
     * @description Agregamos un status a la lista de status correspondiente
     * 
     * @param status_type Para agregar al arreglo correspondiente
     */
    addStatus = (status_type) => {
        this.setState(state => {
            state[status_type].push({
                color: arrayColores[Math.floor(Math.random() * arrayColores.length)],
                text: '',
                number: (status_type == "terminados") ? 100 : 0
            })
            return state
        })
    }


    /**
     *
     *
     * @param {*} tipo Tipo de estatus
     * @param {*} index Posición
     * @param {*} values valores a actualizar
     * @memberof Estatus
     * 
     * @description Actualizamos un status de un arreglo
     */
    updateStatus = (tipo, index, values) => this.setState(state => {
        state[tipo][index] = values;
        return state;
    })


    /**
     *
     *
     * @param {*} tipo  Posición
     * @param {*} index Posición del elemento
     * @memberof Estatus
     * 
     * @description Eliminamos un status del arreglo
     */
    deleteStatus = (tipo, index) => this.setState(state => {
        state[tipo].splice(index, 1)
        return state;
    })



    /**
     *
     *
     * @param {*} elementArray
     * @param {*} tipo
     * @param {boolean} [salida=false]
     * @memberof Estatus
     * 
     * @description checkArray
     */
    checkArray = (elementArray, tipo, salida = false) => {
        let error = false
        let status = []
        for (let i = 0; i < elementArray.length; i++) {
            let element = elementArray[i];
            if (exists(element.color) && exists(element.text) && exists(element.number)) {
                status.push({
                	_id: element._id,
                    nombre: element.text,
                    color: element.color,
                    ponderacion: element.number,
                    tipo,
                    salida
                })
            } else {
                throw "";
            }
        }

        return status;
    }


    /**
     *
     * @memberof Estatus
     *
     * @function handleSubmit
     * @description Regitra los Estatus
     */
    handleSubmit = () => {
        const { activos, terminados, perdidos } = this.state;

        let status = []
        try {
            status = [...this.checkArray(activos, 1), ...this.checkArray(terminados, 2, true), ...this.checkArray(perdidos, 0)]
        } catch (e) {
            return Modal.error({
                title: "Algunos estatus no tienen nombre, color o ponderación.",
                content: "Algunos estatus no tienen nombre,colo o ponderación. Revise sus status por favor. "
            })
        }

        this.setState({ loading: true })
        axios.post('/estatus/project/upadate', {
            proyecto_id: this.props.proyecto._id,
            status,
        }).then(e => {
            message.success("¡Estatus registrados exitosamente!")
            //this.props.closeModal();
        }).catch(e => {
       
            message.error("No es posible guardar");
        })
    }


    render() {
        return (
        	<Modal
        		className="modal-form modal-estatus" 
        		title="Estatus" 
        		visible={this.props.visible}  
        		onCancel={this.props.closeModal}
        		destroyInClose={true}
        		footer={null}
        		closeIcon={<CloseIcon/>}
        	>
	                <Row className="list-container-row-title">
	                    <Row className="status-card-container" gutter={[16, 16]}>
	                        <Col span={20} className="flex-left" >
	                            <Title className="list-title">Estatus Activos </Title>
	                        </Col>
	                        <Col span={4} className="center">
	                            <Button onClick={() => this.addStatus('activos')} className="btn-add-status" type="primary"><PlusOutlined
	                                className="icon" /> </Button>
	                        </Col>
	                    </Row>
	                </Row>
	                <Row className="list-container-row">
	                    {(this.state.activos.length == 0) ?
	                        <Empty className="empty-state" image={Empty.PRESENTED_IMAGE_SIMPLE}
	                            description={<div> No hay Status Activos <a onClick={() => this.addStatus('activos')}>¡Agrega
	                                   uno!</a></div>} /> : null}
	                    <ReactSortable
	                        group="status"
	                        ghostClass="status-ghost"
	                        animation={150}
	                        className="status-list finished"
	                        list={this.state.activos}
	                        setList={activos => this.setState({ activos })}>
	                        {this.state.activos.map((item, index) => (<StatusCard
	                            values={item}
	                            key={item.id}
	                            index={parseInt(index) + 1}
	                            onDelete={() => this.deleteStatus('activos', index)}
	                            onChange={(values) => this.updateStatus('activos', index, values)}
	                        />))}
	                    </ReactSortable>
	                </Row>
	                <Divider />
	                <Row className="list-container-row-title">
	                    <Row className="status-card-container" gutter={[16, 16]}>
	                        <Col span={20}>
	                            <Title className="list-title">Estatus Terminados </Title>
	                        </Col>
	                        <Col span={4}>
	                            <Button onClick={() => this.addStatus('terminados')} className="btn-add-status"
	                                type="primary"><PlusOutlined className="icon" /> </Button>
	                        </Col>
	                    </Row>
	                </Row>
	                <Row className="list-container-row">
	                    {(this.state.terminados.length == 0) ?
	                        <Empty className="empty-state" image={Empty.PRESENTED_IMAGE_SIMPLE}
	                            description={<div> No hay Status Terminados <a
	                                onClick={() => this.addStatus('terminados')}>¡Agrega uno!</a></div>} /> : null}
	                    <ReactSortable
	                        group="status"
	                        ghostClass="status-ghost"
	                        animation={150}
	                        className="status-list finished"
	                        list={this.state.terminados}
	                        setList={terminados => this.setState({ terminados })}>
	                        {this.state.terminados.map((item, index) => (<StatusCard
	                            values={item}
	                            key={item.id}
	                            index={parseInt(index) + 1}
	                            onDelete={() => this.deleteStatus('terminados', index)}
	                            onChange={(values) => this.updateStatus('terminados', index, values)}

	                        />))}
	                    </ReactSortable>

	                </Row>
	                <Divider />
	                <Row className="list-container-row-title">
	                    <Row className="status-card-container" gutter={[16, 16]}>
	                        <Col span={20}>
	                            <Title className="list-title">Estatus Perdidos </Title>
	                        </Col>
	                        <Col span={4}>
	                            <Button onClick={() => this.addStatus('perdidos')} className="btn-add-status"
	                                type="primary"><PlusOutlined className="icon" /> </Button>
	                        </Col>
	                    </Row>
	                </Row>
	                <Row className="list-container-row">
	                    {(this.state.perdidos.length == 0) ?
	                        <Empty className="empty-state" image={Empty.PRESENTED_IMAGE_SIMPLE}
	                            description={<div> No hay Status de Perdidos <a
	                                onClick={() => this.addStatus('perdidos')}>¡Agrega uno!</a></div>} /> : null}
	                    <ReactSortable
	                        group="status"
	                        ghostClass="status-ghost"
	                        animation={150}
	                        className="status-list finished"
	                        list={this.state.perdidos}
	                        setList={perdidos => this.setState({ perdidos })}>
	                        {this.state.perdidos.map((item, index) => (<StatusCard
	                            error={item.error}
	                            values={item}
	                            key={item.id}
	                            index={parseInt(index) + 1}
	                            onDelete={() => this.deleteStatus('perdidos', index)}
	                            onChange={(values) => this.updateStatus('perdidos', index, values)}

	                        />))}
	                    </ReactSortable>
	                </Row>
	                <Row className="list-container-row">
	                    <Button className="btn-modal-morado" onClick={this.handleSubmit}>Guardar</Button>
	                </Row>
            </Modal>
        )
    }

}

export default Estatus;
