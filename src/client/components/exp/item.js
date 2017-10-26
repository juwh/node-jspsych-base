/**
 * Created by williamju on 7/19/17.
 */

import React from 'react';
import ReactDOM from 'react-dom';

/*************************************************************************/

/*************************************************************************/

export const Item = ({dimensions, top, left, rotation, src}) => {
    const style = {
        position: 'absolute',
        top: top,
        left: left,
        transform: `rotate(${rotation}deg)`
    };

    return (<div style={style}><img src={src} width={dimensions}/></div>);
};