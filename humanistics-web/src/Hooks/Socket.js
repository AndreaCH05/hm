import React from "react";
import {io} from "socket.io-client";

//url servidor
const URLDev = 'http://localhost:4001'

const socket = io(URLDev);
const SocketContext = React.createContext(socket);

export default SocketContext;