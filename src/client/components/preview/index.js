'use strict';


import React, { Component }     from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, IndexRoute, browserHistory }  from 'react-router'
import { Window } from '../exp/window';
import { calcSpacings, toCoordinates, genOrients } from '../utils';

/*************************************************************************/

/*************************************************************************/

/* Target location within eccentricity values */
/* minimum angle between element centers to avoid overlap */
const minAngle_centers = 38;
const stimtype = 1;
const setSize = 6;
const target = 1;
const announcements = [
    (<div className="alert alert-info">
        If the issue remains unfixed, please return the HIT and contact: <mark>ftonglab@gmail.com</mark>
        <br/><br/>
        <strong>Press Space to Continue</strong>
    </div>),
    (<div className="alert alert-info">
        If the rectangle is only partially visible, please go back and check that your visual setup inputs are correct.
        <br/><br/>
        <strong>Press Space to Continue</strong>
    </div>),
    (<div className="alert alert-info">
        This is a <strong>sample display</strong>. The blue border rectangle should be fully visible within a maximized browser window.
        <br/><br/>
        <strong>Press Space to Continue</strong>
    </div>)
    ];

export class Preview extends Component {
    constructor(props) {
        super(props);

        let itemRadius = this.props.itemRadius;
        let eccenDist = this.props.eccenDist;
        let polar_orient = genOrients(setSize);
        let polar_loc = calcSpacings(setSize, Math.floor(Math.random()*360), minAngle_centers, 'preview');
        let coordinate_loc = toCoordinates(polar_loc, eccenDist, itemRadius);

        let trialModel =
            {
                'subjID': 0,
                'prac': 0,
                'trial': 1,
                'stimtype': stimtype,
                'setSize': setSize,
                'displayID': 0,
                'target': target,
                'polar_orient': polar_orient,
                'polar_loc': polar_loc,
                'coordinate_loc': coordinate_loc
            };

        this.state = {
            announcement: announcements.length - 1,
            stateData: trialModel
        };

        this.handleKeyPress = this.handleKeyPress.bind(this);
    }

    handleKeyPress(event) {
        if(event.code === 'Space') {
            if (!this.state.announcement) {
                browserHistory.push(`/exp`);
            } else {
                this.setState((prevState, props) => {
                    return {announcement: prevState.announcement - 1};
                });
            }
        }
    }

    componentDidMount() {
        window.addEventListener('keypress', this.handleKeyPress);
    }

    componentWillUnmount() {
        window.removeEventListener('keypress', this.handleKeyPress)
    }

    render() {
        return (
            <Window
                width={this.props.width}
                height={this.props.height}
                ppd={this.props.ppd}
                itemRadius={this.props.itemRadius}
                eccenDist={this.props.eccenDist}
                state={this.props.state}
                block={this.state.block}
                stateData={this.state.stateData}
                src={this.props.src}
                announcement={announcements[this.state.announcement]}
            />
        );
    };
}