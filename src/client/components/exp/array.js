/**
 * Created by williamju on 7/19/17.
 */
'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import { Item } from './item';

/*************************************************************************/

/*************************************************************************/

const textAngle = 1;

export const Array = ({width, height, ppd, polar_orient, coordinate_loc, itemRadius, src}) => {
    let itemDim = 2 * itemRadius;
    let array = [];
    coordinate_loc.forEach((item, index) => {
        let top = Math.floor(height/2 - item.y - itemDim);
        let left = Math.floor(width/2 + item.x);
        array.push(<Item key={`item${index}`} dimensions={itemDim} top={top} left={left} rotation={polar_orient[index]}
                         src={src}/>)
    });
    return (<div id="array">{array}</div>);
};