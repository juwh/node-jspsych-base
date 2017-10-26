/**
 * Created by williamju on 7/19/17.
 */
'use strict';

import React, { Component }     from 'react';
import ReactDOM from 'react-dom';

import { Announcement } from './announcement';
import { Array } from './array';
import { Cue } from './cue';
import { Fixation } from './fixation';
import { Probe } from './probe';

/*************************************************************************/

/*************************************************************************/

const borderWidth = 4;

export class Window extends Component {
    constructor(props) {
        super(props);

        let itemRadius = this.props.itemRadius;
        let eccenDist = this.props.eccenDist;
        let windowDim = 2 * ((itemRadius + eccenDist) + 10);
        let top = Math.floor((this.props.height - windowDim)/2);
        let left = Math.floor((this.props.width - windowDim)/2);

        this.state = {
            width: windowDim,
            height: windowDim,
            top: top,
            left: left
        };

        this.genStyle = this.genStyle.bind(this);
        this.handleState = this.handleState.bind(this);
        this.border = this.border.bind(this);
    }

    genStyle() {
        return {
            position: 'absolute',
            width: this.state.width,
            height: this.state.height,
            top: Math.floor((this.props.height - this.state.height)/2),
            left: Math.floor((this.props.width - this.state.width)/2),
        };
    }

    border(state) {
        let border = '';
        if (state === 'preview') {
            let top = Math.floor((this.props.height - this.state.height)/2);
            let left = Math.floor((this.props.width - this.state.width)/2);

            let borderStyle = {
                position: 'absolute',
                width: this.state.width,
                height: this.state.height,
                top: top,
                left: left,
                border: `${borderWidth}px solid #3F729B`
            };

            border = (<div style={borderStyle}></div>);
        }
        return border;
    }

    handleState(state, block) {
        let content = [];
        let fixation = (<Fixation
            key={'fixation'}
            width={this.state.width}
            height={this.state.height}
            ppd={this.props.ppd}
        />);
        switch(state) {
            case 'preview':
                content.push(<Announcement
                    key={'announcement'}
                    width={this.state.width}
                    height={this.state.height}
                    ppd={this.props.ppd}
                    state={this.props.state}
                    content={this.props.announcement}
                />);
            case 'array':
                content.push(fixation);
                content.push(<Array
                    key={'array'}
                    width={this.state.width}
                    height={this.state.height}
                    ppd={this.props.ppd}
                    polar_orient={this.props.stateData.polar_orient}
                    coordinate_loc={this.props.stateData.coordinate_loc}
                    itemRadius={this.props.itemRadius}
                    src={this.props.src}
                />);
                break;

            case 'cue':
                content.push(fixation);
                content.push(<Cue
                    key={'cue'}
                    width={this.state.width}
                    height={this.state.height}
                    itemRadius={this.props.itemRadius}
                    stateData={this.props.stateData}
                />);
                break;

            case 'probe':
                if (block === 'motor') {
                    content.push(<Array
                        key={'array'}
                        width={this.state.width}
                        height={this.state.height}
                        ppd={this.props.ppd}
                        polar_orient={this.props.stateData.polar_orient}
                        coordinate_loc={this.props.stateData.coordinate_loc}
                        itemRadius={this.props.itemRadius}
                        src={this.props.src}
                    />);
                } else {
                    content.push(<Cue
                        key={'cue'}
                        width={this.state.width}
                        height={this.state.height}
                        itemRadius={this.props.itemRadius}
                        stateData={this.props.stateData}
                    />);
                }
                content.push(<Probe
                    key={'probe'}
                    width={this.state.width}
                    height={this.state.height}
                    ppd={this.props.ppd}
                    itemRadius={this.props.itemRadius}
                    src={this.props.src}
                    onResponse={this.props.onResponse}
                />);
                break;

            case 'progress':
                content.push(fixation);
                content.push(<Announcement
                    width={this.state.width}
                    height={this.state.height}
                    ppd={this.props.ppd}
                    content={this.props.announcements}
                />);
                break;

            default:
                content.push(fixation);
                break;
        }
        return (<div id="windowContent">
            {content}
        </div>);
    }

    render() {
        //console.log('render: '+this.props.state);
        let style = this.genStyle();
        let content = this.handleState(this.props.state, this.props.block);
        let border = this.border(this.props.state);

        return (<div id="windowContainer">
            <div id="window" style={style}>
            {content}
            </div>
            {border}
        </div>);
    };
}