function isNumber(n) {
	return !isNaN(parseFloat(n)) && isFinite(n);
}

function pad(num, size) {
    let s = num+"";
    while (s.length < size) {
      s = "0" + s;
    } 
    return s;
}

/* Make sure all numbers in an array are between 0 and 360: */
function wrap(v) {
  	for (let i=0; i<v.length; i++) {
    	if (v[i]>360) { v[i]-=360; }
    	if (v[i]<0) { v[i]+=360; }
  	}
  	return v;
}

function wrapOne(v) {
    while (v < 0 || v > 360) {
        if (v>360) { v-=360; }
        if (v<0) { v+=360; }
    }
    return v;
}

function convertTo(type, num) {
    let result = null;
    if (type === "rads") {result = num*((Math.PI)/180);}
	if (type === "degs") {result = num*(180/(Math.PI));}
	return result;
}

/* Normalize random spacing values to sum to available space */
function calcSpacings(num, startAngle, minAngle_centers, option) {
    /*
    initially holds num random values (0 - 1), elements are later
    replaced by adjusted values added to the previous element angle
     */
    let curSpacings = [];
    /*
    sum of random values which are normalized to the available angular
    space
     */
    let curRandSum = 0;

    /* function is also used to generate non-random spacings for the preview */
    if (option === 'random') {
        /* calculate available space after removing minimum angles */
        let availableSpace = 360 - (minAngle_centers * num);
        /* load random values to associated element slots and increment the total */
        for(let i = 0; i<num; i++) {
            curSpacings.push(Math.random());
            curRandSum += curSpacings[i];
        }
        /*
        calculate the initial angle from the start angle, minimum angle offset,
        and normalized random value multiplied by the available space
         */
        curSpacings[0] = startAngle + minAngle_centers + (curSpacings[0]/curRandSum) * availableSpace;
        /* load the next angle values by adding on top of the previous value */
        for(let j = 1; j<num; j++) {
            curSpacings[j] = curSpacings[j - 1] + minAngle_centers + (curSpacings[j]/curRandSum) * availableSpace;
        }
    } else {
        /* if not random, simply calculate equal intervals */
        let interval = 360/num;
        for(let k = 0; k<num; k++) {
            curSpacings[k] = startAngle + Math.floor(interval * k);
        }
    }
    return curSpacings;
}

/* Convert spacing angles to x, y coordinates for element placement */
function toCoordinates(angleSpacings, eccenDist, itemRadius) {
    let coordX = 0;
    let coordY = 0;
    let curCoordinates = [];

    /* converts any overflow values within 360 degree space */
    angleSpacings = wrap(angleSpacings);
    /*
    each element is converted to an x, y coordinate from center and pushed to output,
    angle spacings converted to radians as math functions require
     */
    angleSpacings.forEach((element, index) => {
        coordX = Math.floor(Math.cos(convertTo("rads", element)) * eccenDist) - itemRadius;
        coordY = Math.floor(Math.sin(convertTo("rads", element)) * eccenDist) - itemRadius;
        curCoordinates.push({'x': coordX,
            'y': coordY});
    });
    return curCoordinates;
}

function genOrients(setSize) {
    let itemOrients = [];
    for (let i=0; i<setSize; i++) {
        itemOrients.push(Math.floor(Math.random()*360));
    }
    return itemOrients;
}

module.exports = {
    isNumber: isNumber,
    pad: pad,
    wrap: wrap,
    wrapOne: wrapOne,
    convertTo: convertTo,
    calcSpacings: calcSpacings,
    toCoordinates: toCoordinates,
    genOrients: genOrients
};