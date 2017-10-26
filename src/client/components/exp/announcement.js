/**
 * Created by williamju on 7/19/17.
 */

import React from 'react';
import ReactDOM from 'react-dom';

/*************************************************************************/

/*************************************************************************/

const previewAngle = 5.4;
const expAngle = 1.6;

export const Announcement = ({width, height, ppd, state, content}) => {
    let centerY = Math.floor(height/2);
    let textOffset = (state === 'preview') ? centerY + previewAngle * ppd:
        centerY + expAngle * ppd;
    const style = {
        position: 'absolute',
        textAlign: 'center',
        top: textOffset,
        fontSize: '10pt'
    };

    return (<div id='announcement' style={style}>{content}</div>);
};