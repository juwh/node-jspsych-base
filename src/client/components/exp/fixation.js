/**
 * Created by williamju on 7/19/17.
 */

import React from 'react';
import ReactDOM from 'react-dom';
import {Layer, Circle, Stage, Group} from 'react-konva';

/*************************************************************************/

/*************************************************************************/

/* Fixation visual angle degrees */
const outCircle = 0.2432;
const inCircle = 0.0541;
const outCircleWidth = 1;
const inCircleWidth = 1;
const style = {position: 'absolute'};

export const Fixation = ({width, height, ppd}) => {
    return (
        <div style={style}>
            <Stage width={width} height={height}>
                <Layer>
                    <Circle
                        x={width/2}
                        y={height/2}
                        radius={ppd * outCircle}
                        stroke={'black'}
                        strokeWidth={outCircleWidth}
                    />
                    <Circle
                        x={width/2}
                        y={height/2}
                        radius={ppd * inCircle}
                        stroke={'black'}
                        strokeWidth={inCircleWidth}
                    />
                </Layer>
            </Stage>
        </div>
    );
};