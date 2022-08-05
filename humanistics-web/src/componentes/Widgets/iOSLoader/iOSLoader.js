//Dependencias
import React, { Component } from 'react';


import './iOSLoader.css';

export default class iOSLoader extends Component {


        render() {
                return (
                        <div className='spinner center'>
                                <div className='spinner-blade'></div>
                                <div className='spinner-blade'></div>
                                <div className='spinner-blade'></div>
                                <div className='spinner-blade'></div>
                                <div className='spinner-blade'></div>
                                <div className='spinner-blade'></div>
                                <div className='spinner-blade'></div>
                                <div className='spinner-blade'></div>
                                <div className='spinner-blade'></div>
                                <div className='spinner-blade'></div>
                                <div className='spinner-blade'></div>
                                <div className='spinner-blade'></div>
                        </div>
                );
        }
}