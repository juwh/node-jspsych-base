/**
 * Created by williamju on 7/19/17.
 */

import React from 'react';
import ReactDOM from 'react-dom';
import {Layer, Circle, Stage, Group} from 'react-konva';

/*************************************************************************/

/*************************************************************************/

/* Cue design config */
const cueWidth = 1;
const cueMargin = 1;
const style = {position: 'absolute'};

export const Cue = ({width, height, itemRadius, stateData}) => {
    let target = stateData['target'];
    let x = stateData.coordinate_loc[target].x;
    let y = stateData.coordinate_loc[target].y;
    return (
        <div style={style}>
            <Stage width={width} height={height}>
                <Layer>
                    <Circle
                        x={width/2+x+itemRadius}
                        y={height/2-y-itemRadius}
                        radius={itemRadius}
                        stroke={'black'}
                        strokeWidth={cueWidth}
                    />
                </Layer>
            </Stage>
        </div>
    );
};