/**
 * Created by williamju on 7/19/17.
 */
'use strict';


import React, { Component }     from 'react';
import ReactDOM from 'react-dom';
import Slider, { Range } from 'rc-slider';
// We can just import Slider or Range to reduce bundle size
// import Slider from 'rc-slider/lib/Slider';
// import Range from 'rc-slider/lib/Range';
import 'rc-slider/assets/index.css';

/*************************************************************************/

/*************************************************************************/

const style = { margin: 'auto 5%' };
const src = './assets/images/card.png';

/* Default selections for screen size and resolution */
const cardLen = 85.6; // measurements in mm
const screens = ['11"', '12"', '13"', '15"', '17"', '21"', '27"'];
const screenDiag = [279.4, 304.8, 330.2, 381, 431.8, 533.4, 685.8]; // inches to mm diagonals (11, 12, 13, 15, 17, 21, 27)
const ratioAngle = (Math.PI/6);
const screenHorz = screenDiag.map((diag) => {
    return diag * Math.cos(ratioAngle);
});

export class Card extends Component {
    constructor(props) {
        super(props);

        let startValue = Math.floor($(window).width()/2);
        this.state = {
            min: Math.floor($(window).width()/10),
            max: $(window).width(),
            step: 1,
            defaultValue: startValue,
            marks: {}
        };
        this.handleChange = this.handleChange.bind(this);
    }

    componentWillMount() {
        this.setState({marks: this.calcMarks()})
    }

    calcMarks() {
        let horzRes = screen.width;
        let markerRes = screenHorz.map((length) => {
            let cardsPS = length/cardLen;
            return horzRes/cardsPS;
        });
        let marks = {};
        markerRes.forEach((res, index) => {
            if ($(window).width() > res) {
                marks[res] = screens[index];
            }
        });
        return marks;
    }

    handleChange(cardRes) {
        /*
        this.setState({
            cardRes,
        });
        */
        this.props.onCardChange(cardRes);
    }

    render() {
        return (
            <div>
                <div style={style}>
                    <Slider
                        min={this.state.min}
                        max={this.state.max}
                        marks={this.state.marks}
                        onChange={this.handleChange}
                        defaultValue={this.state.defaultValue}
                    />
                </div>
                <br/>
                <br/>
                <img
                    id={'card'}
                    style={{
                        width: this.props.cardRes,
                        opacity: 0.75
                    }}
                    src={src}
                />
            </div>
        );
    };
}