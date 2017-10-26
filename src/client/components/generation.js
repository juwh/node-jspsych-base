import { calcSpacings, genOrients, toCoordinates } from "./utils"

function practiceGen(numTrials, setSize, minAngleCenters, eccenDist, itemRadius) {
    const setsize = setSize;
    const prac = 1;
    const stimtype = 1;

    let genStruct = [];
    let polar_orient;
    let polar_loc;
    let coordinate_loc;
    let target;
    let startAngle;

    for (let i=1; i<=numTrials; i++) {
        startAngle = Math.floor(Math.random()*360);
        polar_orient = genOrients(setsize);
        polar_loc = calcSpacings(setsize, startAngle, minAngleCenters, 'random');
        coordinate_loc = toCoordinates(polar_loc, eccenDist, itemRadius);
        target = Math.floor(Math.random() * setsize);
        genStruct.push({'prac': prac,
            'trial': i,
            'stimtype': stimtype,
            'setsize': setsize,
            'target': target,
            'polar_orient': polar_orient,
            'polar_loc': polar_loc,
            'coordinate_loc': coordinate_loc
        });
    }
    return genStruct;
}

function getTrial(trialStruct, stage, trial) {
    return trialStruct[stage][trial-1];
}

module.exports = {
    practiceGen: practiceGen,
    getTrial: getTrial
};