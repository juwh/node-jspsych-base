/**
 * Created by williamju on 7/19/17.
 */
'use strict';

import React, { Component }     from 'react';
import ReactDOM from 'react-dom';
import { wrapOne } from '../utils';

/*************************************************************************/

/*************************************************************************/

export class Probe extends Component {
    constructor(props) {
        super(props);

        let initRotation = Math.floor(Math.random()*360);
        let top = Math.floor(this.props.height/2-this.props.itemRadius);
        let left = Math.floor(this.props.width/2-this.props.itemRadius);

        this.state = {
            rand: initRotation,
            rotation: initRotation,
            width: this.props.width,
            height: this.props.height,
            top: top,
            left: left
        };
        this.handleMouseMove = this.handleMouseMove.bind(this);
    }

    handleMouseMove(e) {
        let centerX = Math.floor(window.innerWidth/2);
        let centerY = Math.floor(window.innerHeight/2);

        let relX = e.clientX - centerX;
        let relY = e.clientY - centerY;
        let curAngle = Math.atan2(relY,relX);

        let angleDeg = (curAngle / Math.PI * 180.0);
        angleDeg = (angleDeg < 0) ? angleDeg+360 : angleDeg;

        this.props.onResponse(e, wrapOne(angleDeg + this.state.rand));
        this.setState({rotation: wrapOne(angleDeg + this.state.rand)});
    }

    componentDidMount() {
        window.addEventListener('mousemove', this.handleMouseMove);
        //window.addEventListener('keypress', this.handleResponse);
    }

    componentWillUnmount() {
        window.removeEventListener('mousemove', this.handleMouseMove);
        //window.removeEventListener('keypress', this.handleResponse);
    }

    render() {
        const style = {
            position: 'absolute',
            top: this.state.top,
            left: this.state.left,
            transform: `rotate(${this.state.rotation}deg)`
        };

        return (<div style={style}><img src={this.props.src} width={2*this.props.itemRadius}/></div>);
    };
}