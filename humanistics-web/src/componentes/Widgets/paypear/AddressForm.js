
import React, {Component} from 'react';

import {default as axios} from 'axios';

import {
    Form,
    Input,
    Select,
    Button,
    Checkbox
} from 'antd';

import {
    MailOutlined,
    PhoneOutlined,
    MinusCircleOutlined, SafetyCertificateOutlined,
} from '@ant-design/icons';



import './AddressForm.css';

const { Option } = Select;


export default class AddressForm extends Component{

    addressForm = React.createRef();

    constructor(props) {
        super(props);
        this.state= {
            countries: [],
            states: [],
            success:false,
            values:null,
            password: false
        };

        this.getCountries = (this.props.getCountries !== undefined)?this.props.getCountries:this.getCountries;
        this.getStates = (this.props.getStates !== undefined)?this.props.getStates:this.getStates;
    }

    /**
     *
     *
     * @memberof AddressForm
     * @function countryChange
     * @description se declaran los estados en el formulario
     */
    countryChange = async (state) => {
        this.setState({
            states: await this.getStates(state)
        })
    };

    /**
     *
     *
     * @memberof AddressForm
     * @function getCountries
     * @description se obtiene los pases obtenidos
     */
    async getCountries(){
        return (await axios.get('https://bigcodders.com:4000/countries')).data.data;
    }

    /**
     *
     *
     * @memberof AddressForm
     * @function getStates
     * @description se obteiene los estados segun el pais indicado.
     */
    async getStates(state){
        this.addressForm.current.setFieldsValue({
            estado: null
        });
        return ((await axios.get('https://bigcodders.com:4000/countries/'+state)).data.data[0].states);
    }


    /**
     *
     *
     * @memberof AddressForm
     * @function componentDidMount
     * @description al montar el componente, se indican los paises
     */
    async componentDidMount() {
        this.setState({
            countries: await this.getCountries()
        })
    }

    /**
     *
     *
     * @memberof AddressForm
     * @function onFinish
     * @description al fin  alizar la direccion
     */
    onFinish = async values => {
        this.props.onAddressFormSubmit(values);
    };


    /**
     *
     *
     * @memberof AddressForm
     * @function onFinishFailed
     * @description en caso de que no pase losla validacion
     */
    onFinishFailed = async  errorInfo => {
        this.state.success = false;
        this.state.values = errorInfo;
    };

    passwordChange = () => {
        this.setState({password: !this.state.password}) ;
        this.addressForm.current.setFieldsValue({
            estado: null
        });
    };

    render(){

        const Languaje = this.props.languaje;

        const tailLayout = {
            wrapperCol: { offset: 8, span: 16 },
        };

        // {
        //     "nombre": "Administrador",
        //     "telefono": "6647900430",
        //
        //     "email": "av@iseeyoutech.com",
        //     "password":"123456789",
        //
        //     "password_confirmation":"123456789"
        // }

        return (
            <Form
                ref={this.addressForm}
                onFinish={this.onFinish}
                size='large'
            >
                <Form.Item className="form-item">
                    <Form.Item className="form-item-container" name="email" rules={[{
                        required: true,
                        message: Languaje.email.ValidationRules.isRequired
                    }]} >
                        <Input className="form-item-container-input" prefix={<MailOutlined />} placeholder={Languaje.email.name}/>
                    </Form.Item>
                    <Form.Item className="form-item-container" name="telefono" rules={[{
                        required: true,
                        message: Languaje.telefono.ValidationRules.isRequired
                    }]}>
                        <Input className="form-item-container-input" prefix={<PhoneOutlined />} placeholder={Languaje.telefono.name} />
                    </Form.Item>
                </Form.Item>
                <Form.Item className="form-item" name="crear-cuenta" >
                    <Checkbox onChange={this.passwordChange}>Crear una cuenta tambien</Checkbox>
                </Form.Item>
                <div className="form-item " style={{ display: (this.state.password)?'flex':'none', width: '100%!important' }}>
                    <Form.Item
                        name="password"
                        rules={[
                            {
                                required: this.state.password,
                                message: Languaje.password.ValidationRules.isRequired,
                            },
                        ]}
                        hasFeedback
                        className="form-item-container"
                    >
                        <Input.Password placeholder={Languaje.password.name} className="form-item-simple-input" />
                    </Form.Item>
                    <Form.Item
                        name="password_confirmation"
                        dependencies={['password']}
                        hasFeedback
                        rules={[
                            {
                                required: this.state.password,
                                message: Languaje.confirm_password.ValidationRules.isRequired,
                            },
                            ({ getFieldValue }) => ({
                                validator(rule, value) {
                                    if (!value || getFieldValue('password') === value) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(Languaje.confirm_password.ValidationRules.passwordNotMatch);
                                },
                            }),
                        ]}
                        className="form-item-container"
                    >
                        <Input.Password className="form-item-simple-input" placeholder="Confirmar Contraseña" />
                    </Form.Item>
                </div>
                <Form.Item className="form-item">
                    <Form.Item className="form-item-container w-100" name="nombre" rules={[{
                        required: true,
                        message: Languaje.nombre.ValidationRules.isRequired
                    }]} >
                        <Input className="form-item-simple-input" placeholder={Languaje.nombre.name} />
                    </Form.Item>
                </Form.Item>
                <Form.Item className="form-item">
                    <Form.Item style={{ width: '60%' }} className="form-item-container" name="direccion" rules={[{
                        required: true,
                        message: Languaje.direccion.ValidationRules.isRequired
                    }]} >
                        <Input className="form-item-simple-input" placeholder={Languaje.direccion.name} />
                    </Form.Item>
                    <Form.Item style={{ width: '40%' }} className="form-item-select form-item-container" name="pais" rules={[{ required: true }]} >
                        <Select
                            allowClear
                            className="select-simple"
                            placeholder={Languaje.pais.name}
                            onSelect={this.countryChange}
                            showSearch
                            filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                        >
                            {this.state.countries.map((T,number)=>
                                <Option key={number} value={T._id}>{T.name}</Option>)
                            }
                        </Select>
                    </Form.Item>
                </Form.Item>
                <Form.List name="direcciones">
                    {(fields, { add, remove }) => {
                        return (
                            <div>
                                {fields.map((field, index) => (
                                    <Form.Item
                                        required={false}
                                        key={field.key}
                                    >
                                        <Form.Item
                                            {...field}
                                            validateTrigger={['onChange', 'onBlur']}
                                            rules={[
                                                {
                                                    required: true,
                                                    whitespace: true,
                                                    message: Languaje.linea_direccion.ValidationRules.isRequired,
                                                },
                                            ]}
                                            className="form-item-container"

                                        >
                                            <Input className="form-item-simple-input" placeholder={Languaje.linea_direccion.name} style={{ width: '100%' }} />
                                        </Form.Item>
                                            <MinusCircleOutlined
                                                className="dynamic-delete-button"
                                                style={{ margin: '0 8px' }}
                                                onClick={() => {
                                                    remove(field.name);
                                                }}
                                            />
                                    </Form.Item>

                                ))}
                                <Form.Item>
                                    <Button type="link" onClick={() => {
                                        add();
                                    }}>{Languaje.direccion_add}</Button>
                                </Form.Item>
                            </div>
                        );
                    }}
                </Form.List>
                <Form.Item className="form-item">
                    <Form.Item style={{ width: '30%' }}  className="form-item-container" name="codigo_postal" rules={[{ required: true, message: Languaje.codigo_postal.ValidationRules.isRequired }]} >
                        <Input className="form-item-simple-input" placeholder={Languaje.codigo_postal.name} />
                    </Form.Item>
                    <Form.Item style={{ width: '40%' }}  className="form-item-container" name="ciudad" rules={[{ required: true, message: Languaje.ciudad.name }]} >
                        <Input className="form-item-simple-input" placeholder={Languaje.ciudad.name} />
                    </Form.Item>
                    <Form.Item style={{ width: '30%' }}  className="form-item-container" name="estado" rules={[{ required: true, message:Languaje.estado.ValidationRules.isRequired }]} >
                        <Select
                            className="select-simple"
                            allowClear
                            placeholder={Languaje.estado.name}
                            showSearch
                            filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                        >
                            {this.state.states.map( (T,number)=><Option key={number} value={T._id}>{T.name}</Option>)}
                        </Select>
                    </Form.Item>
                </Form.Item>
                <Form.Item>
                    <Button
                        id="paypear-submit"
                        type="primary"
                        htmlType="submit"
                        size="large"
                    >
                        <SafetyCertificateOutlined /> Continuar
                    </Button>
                </Form.Item>
            </Form>
        );
    }
}
