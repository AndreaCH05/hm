//Dependencias
import React, { Component } from 'react';


import propTypes from 'prop-types';

import Loader from '../iOSLoader/iOSLoader';

import './FacebookLogin.css';


function FacebookLogo() {


        return <svg width="32" height="32" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" xmlSpace="preserve"  style={{
                // fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2;
                fillRule: "evenodd",
                clipRule: "evenodd",
                strokeLinejoin: "round",
                strokeMiterlimit: 2
        }}>
        <g id="Layer_x0020_1">
            <path d="M1024,511.999C1024,229.251 794.747,0 511.999,0C229.251,0 0,229.251 0,511.999C0,767.531 187.203,979.358 432.006,1017.81L432.006,660.033L301.972,660.033L301.972,511.999L432.006,511.999L432.006,399.174C432.006,270.868 508.471,199.947 625.401,199.947C681.418,199.947 740.026,209.955 740.026,209.955L740.026,335.957L675.441,335.957C611.865,335.957 591.992,375.413 591.992,415.95L591.992,511.999L733.978,511.999L711.298,660.033L591.992,660.033L591.992,1017.81C836.796,979.43 1024,767.603 1024,511.999Z" style={{ 
                fill: "white",
                fillRule: "nonzero"
                //     "fill:white;fill-rule:nonzero;"
             }}/>
        </g>
    </svg>
    
        // return <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" version="1">
        //         <path fill="#FFFFFF" d="M32 30a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h28a2 2 0 0 1 2 2v28z" />
        //         <path fill="#4267b2" d="M22 32V20h4l1-5h-5v-2c0-2 1.002-3 3-3h2V5h-4c-3.675 0-6 2.881-6 7v3h-4v5h4v12h5z" />
        // </svg>
}



/**
 *
 *
 * @export
 * @class Facebook
 * @extends {Component}
 * 
 * @description Boton de facebook para el login
 * @prop status Dependiendo del status es el texto y el logo. Si es 0, entonces es Login, si es 1, acceder al dashboard o a los steps, el 3 es el simbolo de loading.
 */
export default class Facebook extends Component {

        static propTypes = {

                status: propTypes.number,
                loadingText: propTypes.string,
                text: propTypes.string,
                onClick: propTypes.func,
        }


        static defaultProps = {
                status: 0,
                loginText: 'Continuar con Facebook',
                loadingText: 'Iniciando sesión...',
                accessText: 'Acceder a Humanistics',
        }


        /**
         * 
         * @method getIcon
         * @returns Renderiza el icono del boton de faceobook.
         */
        getIcon = () => {

                switch (this.props.status) {

                        //Iniciar Sesion
                        case 0:
                                return <img alt="Iniciar Sesión con Facebook" src="/images/f_logo_rgb_white_1024.png" style={{ width: '30px', position: 'relative', bottom: '5px'}}/>
                        
                        //Acceder
                        case 1:
                                return <img alt="Acceder con Facebook" src="/images/f_logo_rgb_white_1024.png" style={{ width: '30px', position: 'relative', bottom: '5px'}}/>

                        //Cargando
                        case 2:
                                return <Loader />
                }
        }



        /**
         * 
         * @description getTitle
         * @returns renderiza el texto del boton
         */
        getTitle = () => {

                switch (this.props.status) {
                        case 0:
                                return this.props.loginText
                        
                        //Acceder
                        case 1:
                                return this.props.accessText

                        //Cargando
                        case 2:
                                return this.props.loadingText
                }
        }



        render() {
                
                const { onClick } = this.props

                return (
                        <div className="facebook-button">
                                <a className="btn-fb" onClick={onClick}>
                                        <div className="fb-content">
                                                <div className="logo">
                                                        {this.getIcon()}
                                                </div>
                                                <p className="fb-text">{this.getTitle()}</p>
                                        </div>
                                </a>
                        </div>
                );
        }
}


