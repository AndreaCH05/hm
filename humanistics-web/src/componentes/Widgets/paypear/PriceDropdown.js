import React, {Component} from 'react';
import { Button, Dropdown,Menu } from 'antd';
import {ShoppingCartOutlined,DownOutlined  } from '@ant-design/icons';

import 'antd/dist/antd.css';



export default class extends Component{
    render(){
        return (
            <Button type="default" shape="round" icon={ <ShoppingCartOutlined />}  >${this.props.total} </Button>
        );
        // <DownOutlined />
            // <Dropdown overlay={
            //     <Menu>
            //         <Menu.Item>
            //             <a target="_blank" rel="noopener noreferrer" href="http://www.alipay.com/">
            //                 1st menu item
            //             </a>
            //         </Menu.Item>
            //         <Menu.Item>
            //             <a target="_blank" rel="noopener noreferrer" href="http://www.taobao.com/">
            //                 2nd menu item
            //             </a>
            //         </Menu.Item>
            //         <Menu.Item>
            //             <a target="_blank" rel="noopener noreferrer" href="http://www.tmall.com/">
            //                 3rd menu item
            //             </a>
            //         </Menu.Item>
            //     </Menu>
            // } placement="bottomLeft">
            //
            // </Dropdown>
    }
}
