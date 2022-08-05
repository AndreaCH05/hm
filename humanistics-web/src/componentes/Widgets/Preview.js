import React, {Component} from "react";
import Dropzone from "react-dropzone";
import {Button,Typography, Col, Divider, Form, Input, Layout, List, message, Modal, Row, Select, Spin, Switch} from "antd";
import { DeleteOutlined } from '@ant-design/icons';
import './Preview.css';

const axios = require('axios').default;




const  { Title } =  Typography;

const thumbsContainer = {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 16
};

const thumb = {
    display: 'inline-flex',
    borderRadius: 2,
    border: '1px solid #eaeaea',
    marginBottom: 8,
    marginRight: 8,

    padding: 4,
    boxSizing: 'border-box'
};

const thumbInner = {
    display: 'flex',
    minWidth: 0,
    overflow: 'hidden'
};

const img = {
    display: 'block',
    width: '100%',
    // height: '100%'
};



export default class Previews extends Component {


    constructor(props) {
        super(props);
        this.state = {
            files: [],
        };
    }

    componentDidMount(){
        this.showFiles();
    }

    onDrop = async acceptedFiles => {
        for (let x = 0; x < acceptedFiles.length ; x++){
            let formData = new FormData();
            formData.append("file", acceptedFiles[x]);
            let element = await axios.post('upload/add', formData,{
                    headers: {
                        'Content-Type': 'multipart/form-data;'
                    },
                }
            );
            if (element.status === 200){
                let imagen = element.data;
                let fileList = this.state.files;
                fileList[fileList.length] = {
                    lastModified: new Date().getMilliseconds(),
                    lastModifiedDate: new Date(),
                    name: imagen.filename,
                    path: imagen.filename,
                    preview:  axios.defaults.baseURL + 'upload/' + imagen.filename
                };
                this.setState({
                    files: fileList,
                })
            }else{
                Modal.error({
                    title:"No es posible subir la imagen",
                    content: "Ha ocurrido algun error al subir la iamgen."
                });
            }

        }
    };

    delete = async  (deletedFile) => {
        let fileList = this.deleteFromArray(deletedFile);

        await axios.post("/upload/delete", {filename: deletedFile.name});
        this.setState({
            files: fileList,
            loading: false
        });

    };

    deleteFromArray = (deletedFile) => {
        let fileList = this.state.files;
 
        for (let x = 0; x < fileList.length; x++)
            if (fileList[x].name == deletedFile.name)
                fileList.splice(x,1);

        return fileList;
    };

    showFiles=()=>{
       if  (this.state.files.length === 0 && this.props.value !== undefined  && Array.isArray(this.props.value))
              this.setState({
              files: this.props.value
          });
    }

    render() {

        return (
            <Dropzone onDrop={this.onDrop}>
                {({getRootProps, getInputProps}) => (
                    <section>
                        <div className='dropzone-container'>
                            <div {...getRootProps({className: 'dropzone'})}>
                                <input {...getInputProps()} />
                                <Title level={4} style={{ textAlign:"center" }} >Arrastra archivos aquí o haz click para subir archivos.</Title>
                            </div>
                        </div>
                        <Row>
                                {this.state.files.map((file,index) => (
                                    <Col key={'img-element' + index } m={24} md={12} lg={8} xl={6} >
                                        <div style={thumb} key={file.name}>
                                            <div style={thumbInner} className="thumb-container">
                                                <img
                                                    src={file.preview}
                                                    style={img} alt={file.name}
                                                    onError={(e)=>{
                                                        this.setState({
                                                            files: this.deleteFromArray(file)
                                                        })
                                                    }}
                                                />
                                            </div>
                                            <div key={file.name} className={'thumb-menu'}>
                                                <Button color={'white'} type="link" onClick={e => this.delete(file)}>
                                                    <DeleteOutlined style={{color: 'white'}} />
                                                </Button>
                                            </div>
                                        </div>
                                    </Col>
                                ))}
                        </Row>
                    </section>
                )}
            </Dropzone>
        )
    }
}



