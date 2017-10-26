/**
 * Created by williamju on 7/19/17.
 */
'use strict';


import React, { Component }     from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, IndexRoute, browserHistory }  from 'react-router'
import { Card }        from './card';
import { convertTo } from '../utils';

require('./setup.css');

/*************************************************************************/

/*************************************************************************/

const cardLen = 85.6; // measurements in mm
const defaultVD = 600; // initial viewing distance state
const defaultSelection = 0;
const styles = {
    container: {
        padding: '5%',
        paddingTop: '4%'
    },
    center: {
        textAlign: 'center'
    }
};

export function visAngleCalc(cardRes, cardLen, distFromScreen) {
    let horzRes = screen.width;
    let horzLength = (horzRes/cardRes) * cardLen;
    let oppLength = horzLength/2;
    let totalVisAngle = 2 * convertTo("degs", Math.atan(oppLength/distFromScreen));
    return horzRes/totalVisAngle;
}

export class Setup extends Component {
    constructor(props) {
        super(props);

        this.state = {
            ppmmSub: false,
            cardRes: Math.floor($(window).width()/2),
            vdSelection: defaultSelection,
            distFromScreen: defaultVD
        };
        this.handleCardChange = this.handleCardChange.bind(this);
        this.handleSelection = this.handleSelection.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.clearSelection = this.clearSelection.bind(this);

        let data = localStorage.getItem('hitParams') ? localStorage.getItem('hitParams') : '';
        let parsedData = data ? JSON.parse(data) : {};

        localStorage.removeItem('hitParams');
    }

    clearSelection() {
        this.setState({vdSelection: defaultSelection})
    }

    handleCardChange(cardRes) {
        this.setState({cardRes});
    }

    handleSelection(e) {
        let viewDist = 10 * (36 + (10 * (e.target.value)));
        this.setState({vdSelection: e.target.value, distFromScreen: viewDist});
    }

    handleSubmit() {
        let parameters = {
            'cardRes': this.state.cardRes,
            'vdSelection': this.state.vdSelection,
            'distFromScreen': this.state.distFromScreen,
            'pixelsPerDegree': visAngleCalc(this.state.cardRes, cardLen, this.state.distFromScreen)
        };

        console.log(parameters);

        localStorage.setItem('view_cond', JSON.stringify(parameters));
        browserHistory.push(`/preview`);
    }

    render() {
        let setup = this.state.ppmmSub ?
            (<div style={styles.center}>
                <div id="viewD">
                    <p>Please choose your approximate viewing distance from the diagram. Do <b>NOT</b> select an option if you do not know.</p>

                    <button type="button" className="btn btn-secondary" onClick={this.clearSelection}>
                        Clear Selection
                    </button>

                    <table style={{maxWidth:'100%'}}>
                        <tbody>
                            <tr>
                                <td>
                                    <label htmlFor="VD18">
                                        <img src="./assets/images/VD18.png" className='imgVD'/>
                                    </label>
                                </td>
                                <td>
                                    <label htmlFor="VD22">
                                        <img src="./assets/images/VD22.png" className='imgVD'/>
                                    </label>
                                </td>
                                <td>
                                    <label htmlFor="VD26">
                                        <img src="./assets/images/VD26.png" className='imgVD'/>
                                    </label>
                                </td>
                            </tr>
                            <tr>
                                <td className='inputTD'>
                                    <input
                                        type="radio"
                                        id="VD18"
                                        value='1'
                                        checked={this.state.vdSelection === '1'}
                                        onChange={this.handleSelection}
                                    />
                                </td>
                                <td className='inputTD'>
                                    <input
                                        type="radio"
                                        id="VD22"
                                        value="2"
                                        checked={this.state.vdSelection === '2'}
                                        onChange={this.handleSelection}
                                    />
                                </td>
                                <td className='inputTD'>
                                    <input
                                        type="radio"
                                        id="VD26"
                                        value="3"
                                        checked={this.state.vdSelection === '3'}
                                        onChange={this.handleSelection}
                                    />
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>):

            (<div style={styles.center}>
                <div id="card" className="card">
                    <p>
                        Please use the slider to adjust the graphic dimensions to match the size of a credit/debit/gift card. You may also match set the slider to the tick that matches your display size.
                    </p>

                    <div>
                        <Card
                            cardRes={this.state.cardRes}
                            onCardChange={this.handleCardChange}
                        />
                    </div>
                </div>
            </div>);

        const right = this.state.ppmmSub ?
            <div className="col-xs-5 right-nav">
                <img
                    src="./assets/images/back.png"
                    onClick={()=>{document.body.style.cursor = 'default';this.setState({ppmmSub:false});}}
                    onMouseEnter={()=>{document.body.style.cursor = 'pointer'}}
                    onMouseLeave={()=>{document.body.style.cursor = 'default'}}
                    style={{height: '20px'}}/>
                <button type="button" className="btn btn-success" onClick={this.handleSubmit}>
                    Submit
                </button>
            </div>:
            <div className="col-xs-5 right-nav">
                <button type="button" className="btn btn-primary" onClick={()=> {this.setState({ppmmSub:true});}}>
                    Next
                </button>
            </div>;

        return (<div className="container" style={styles.container}>
            <nav className="navbar navbar-static-top">
                <div className="col-xs-7">
                    <h2>Viewing Condition Setup</h2>
                </div>
                {right}
            </nav>
            <hr/>
            {setup}
        </div>);
    };
}