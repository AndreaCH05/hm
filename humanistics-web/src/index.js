import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import "antd/dist/antd.css"
import * as serviceWorker from './serviceWorker';

import {     } from './Helper';

/** **** Configuración del Proyecto ***  **/
/* Axios */

const axios = require("axios").default;

// axios.defaults.baseURL = "https://humanistics.mx:4001/";
axios.defaults.baseURL = "https://humanistics.bigcodders.com:4001/";
// axios.defaults.baseURL = "http://localhost:4001/";

axios.defaults.headers.post["Content-Type"] = "application/json";

window.exists = function (element) {
    return (element !== undefined && element !== null && element !== "")
}



ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

