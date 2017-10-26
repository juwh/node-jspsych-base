/**
 * Created by williamju on 7/19/17.
 */
'use strict';

import React, { Component }     from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, IndexRoute, browserHistory }  from 'react-router'

import { Preview } from '../preview/index'
import { Experiment } from '../exp/index';
import { visAngleCalc } from "../setup/index"

/*************************************************************************/

/*************************************************************************/

const src = './assets/images/bar.png';

const cardLen = 85.6; // measurements in mm
const len15 = 381; // 15 inches in mm
const defaultVD = 600; // initial viewing distance state
const defaultCardRes = window.innerWidth/(len15/cardLen);
const defaultSelection = 0;

/* Target location within eccentricity values */
/* minimum angle between element centers to avoid overlap */
const minAngle_centers = 38;
/* eccentricity distance visual angle */
const eccenAngle = 4;
const textAngle = 1;
// describes angle from center (radius)
const itemAngle = 1;
const stimtype = 1;
const setSize = 6;
const target = 1;

export class Container extends Component {
    constructor(props) {
        super(props);

        let data = localStorage.getItem('view_cond') ? localStorage.getItem('view_cond') : '';
        let parsedData = data ? JSON.parse(data):
            {
                'cardRes': defaultCardRes,
                'vdSelection': defaultSelection,
                'distFromScreen': defaultVD,
                'pixelsPerDegree': visAngleCalc(defaultCardRes, cardLen, defaultVD)
            };
        localStorage.setItem('view_cond', parsedData);

        console.log(parsedData);
        let itemRadius = parsedData.pixelsPerDegree * itemAngle;
        let eccenDist = eccenAngle * parsedData.pixelsPerDegree;

        this.state = {
            width: window.innerWidth,
            height: window.innerHeight,
            ppd: parsedData.pixelsPerDegree,
            itemRadius: itemRadius,
            eccenDist: eccenDist
        };

        this.handleResize = this.handleResize.bind(this);
    }

    handleResize() {
        this.setState(
            {
                width: window.innerWidth,
                height: window.innerHeight
            }
        );
    }

    componentDidMount() {
        this.handleResize();
        window.addEventListener('resize', this.handleResize);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.handleResize)
    }

    render() {
        let content = '';
        if (this.props.route.type === 'preview') {
            content = (<Preview
                    width={this.state.width}
                    height={this.state.height}
                    ppd={this.state.ppd}
                    itemRadius={this.state.itemRadius}
                    eccenDist={this.state.eccenDist}
                    state={'preview'}
                    src={src}
                />)
        }
        if (this.props.route.type === 'experiment') {
            content = (<Experiment
                width={this.state.width}
                height={this.state.height}
                ppd={this.state.ppd}
                itemRadius={this.state.itemRadius}
                eccenDist={this.state.eccenDist}
                state={'request'}
                src={src}
            />)
        }

        return (<div style={{backgroundColor: '#808080', width: '100%', height: '100%'}}>
            {content}
        </div>);
    };
}