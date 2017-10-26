/**
 * Created by williamju on 7/19/17.
 */
'use strict';


import React, { Component }     from 'react';
import ReactDOM from 'react-dom';
import io from 'socket.io-client';
import { Router, Route, IndexRoute, browserHistory }  from 'react-router'
import { Window } from '../exp/window';
import { instructions } from '../instructions'
import { pad, calcSpacings, toCoordinates, genOrients } from '../utils';
import { practiceGen, getTrial } from '../generation';

/*
let socket = io();

socket.on('connect', () => {
    let parameters = JSON.parse(localStorage.getItem('parameters'));
    socket.emit('WORKER:CONNECT', parameters);
});
*/

/*************************************************************************/

/*************************************************************************/

const test_num = 1;

/* Trial block settings */
const setSize_motor = 1;
const trials_motor = 5;
const setSize_prac2 = 2;
const trials_prac2 = 5;
const setSize_prac6 = 6;
const trials_prac6 = 10;
const trials = 106;
const stages = 4;
const block = 53;

const elementsPerTrial = 19;

/* Target location within eccentricity values */
/* minimum angle between element centers to avoid overlap */
const minAngle_centers = 38;
const center = {
    textAlign: 'center'
};

const trialsPerStage = new Map([['motor', trials_motor], ['prac2', trials_prac2],
    ['prac6', trials_prac6], ['exp', trials]]);
const trialSequence = ['fixation', 'array', 'delay', 'cue', 'probe'];
const stageSequence = ['motor', 'prac2', 'prac6', 'exp'];
const staticStates = new Map([['fixation', 'array'], ['array', 'delay'], ['delay', 'cue'], ['cue', 'probe'],
    ['instruction', 'blockStart'], ['subject', 'questionnaire'], ['request', 'instruction']]);
const responseStates = new Map([['blockStart', '0'], ['probe', '1'], ['blockEnd', '2']]);
let stateToTimeout = new Map([['fixation', 1000], ['array', 200], ['delay', 1000], ['cue', 500]]);

const getMessage = (score, type) => {
    let announcements =
        [
            (<div>
                <div className="alert alert-danger">
                    This is a sample display. If the red border rectangle is not encompassed within a
                    maximized browser window, go back and check that your visual setup inputs are accurate.
                    <br/><br/>
                    If the red border is still not completely within the browser window,
                    please return the HIT and contact: <mark>ftonglab@gmail.com</mark>
                </div>
            </div>)
        ];
    return announcements[0];
};

export class Experiment extends Component {
    constructor(props) {
        super(props);

        this.state = {
            accuracy: null,
            assignment: null,
            state: this.props.state,
            block: stageSequence[0],
            trialStruct: null,
            stateData: null,
            submitted: false,
            trial: 0,
        };

        this.handleKeyPress = this.handleKeyPress.bind(this);
        this.readConditions = this.readConditions.bind(this);
        this.processConditions = this.processConditions.bind(this);
        this.mergeTrials = this.mergeTrials.bind(this);
        this.nextState = this.nextState.bind(this);
        this.getNextState = this.getNextState.bind(this);
        this.displaySequence = this.displaySequence.bind(this);
        this.handleResponse = this.handleResponse.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    getNextState(state, block, trial) {
        if (staticStates.get(state)) {
            return staticStates.get(state);
        }

        switch (state){
            case 'probe':
                if (trial >= trialsPerStage.get(block)) {
                    return 'blockEnd';
                } else {
                    if (block === 'motor') {
                        return 'probe';
                    } else {
                        return 'fixation';
                    }
                }
                break;
            case 'blockStart':
                if (block === 'motor') {
                    return 'probe';
                } else {
                    return 'fixation';
                }
                break;
            case 'blockEnd':
                if (block === 'exp') {
                    return 'subject';
                } else {
                    return 'instruction';
                }
                break;
            default:
                break;
        }
    }

    nextState() {
        let nextState = this.getNextState(this.state.state, this.state.block, this.state.trial);
        let nextTrial = this.state.trial;
        let nextStateData = this.state.stateData;
        let nextBlock = this.state.block;

        if (this.state.state === 'blockEnd') {
            nextTrial = 1;
            nextBlock = (stageSequence.indexOf(this.state.block) + 1 < stageSequence.length) ?
                stageSequence[stageSequence.indexOf(this.state.block) + 1] : 'end';
            nextStateData = getTrial(this.state.trialStruct, stageSequence.indexOf(nextBlock), nextTrial);
        } else {
            if (this.state.state === 'probe' && nextState !== 'blockEnd') {
                nextTrial++;
                nextStateData = getTrial(this.state.trialStruct, stageSequence.indexOf(nextBlock), nextTrial);
            }
        }

        this.setState((prevState, props) => {
            return {trial: nextTrial,
                state: nextState, stateData: nextStateData, block: nextBlock};
        });
    }

    displaySequence() {
        if (stateToTimeout.get(this.state.state)) {
            setTimeout(() => {this.setState({state:
                    this.getNextState(this.state.state, this.state.block, this.state.trial)})},
                stateToTimeout.get(this.state.state));
        }
    }

    handleResponse(event, responseValue) {
        let nextTrialStruct = this.state.trialStruct;
        nextTrialStruct[stageSequence.indexOf(this.state.block)][this.state.trial-1].response = responseValue;
        this.setState({trialStruct: nextTrialStruct});
    }

    handleKeyPress(event) {
        if(event.code === 'Space' && responseStates.get(this.state.state)) {
            this.nextState();
        }
    }

    readConditions(assignment) {
        let subjID = assignment;
        let subjID_string = pad(subjID, 3);

        let pracfileLoc = `./assets/conditions/CounterBalance_prac/bar_SS6_10display_subj${subjID_string}.txt`;
        let fileLoc = `./assets/conditions/CounterBalance/bar_SS6_96display_subj${subjID_string}.txt`;

        let conditions_prac;
        let conditions;

        $.get(fileLoc, (data)=>{
            conditions = this.processConditions(data, trials);
            $.get(pracfileLoc, (data)=>{
                conditions_prac = this.processConditions(data, trials_prac6);
                let trialStruct = this.mergeTrials(conditions_prac, conditions);
                let trialModel = getTrial(trialStruct, 0, 1);
                this.setState({state: 'instruction', trialStruct: trialStruct, stateData: trialModel, trial: 1});

            })
                .fail((err) => {
                    console.log('Error: trial_prac');
                    this.setState({state: 'error'});
                });
        })
            .fail((err) => {
                console.log('Error: trial_prac');
                this.setState({state: 'error'});
            });
    }

    processConditions(data, numTrials) {
        let subjID;
        let prac;
        let trial;
        let stimtype;
        let setsize;
        let displayID;
        let target;
        let polar_orient = [];
        let polar_loc = [];
        let coordinate_loc = [];
        let trialArray = [];

        let conditionStream = data.split(/\s+/);
        let elementsPerTrial = (conditionStream.length - 1)/numTrials;
        for (let i = 0; i < numTrials; i++) {
            subjID = parseFloat(conditionStream[i * elementsPerTrial]);
            prac = parseFloat(conditionStream[i * elementsPerTrial + 1]);
            trial = parseFloat(conditionStream[i * elementsPerTrial + 2]);
            stimtype = parseFloat(conditionStream[i * elementsPerTrial + 3]);
            setsize = parseFloat(conditionStream[i * elementsPerTrial + 4]);
            displayID = parseFloat(conditionStream[i * elementsPerTrial + 5]);
            target = parseFloat(conditionStream[i * elementsPerTrial + 6]) - 1;
            for (let j = 0; j < setsize; j++) {
                polar_orient[j] = parseFloat(conditionStream[(i * elementsPerTrial) + j + 7]);
                polar_loc[j] = parseFloat(conditionStream[(i * elementsPerTrial) + j + 13]);
            }
            coordinate_loc = toCoordinates(polar_loc, this.props.eccenDist, this.props.itemRadius);
            trialArray.push({'subjID': subjID,
                'prac': prac,
                'trial': trial,
                'stimtype': stimtype,
                'setsize': setsize,
                'displayID': displayID,
                'target': target,
                'polar_orient': polar_orient,
                'polar_loc': polar_loc,
                'coordinate_loc': coordinate_loc
            });

            /* reset arrays for next iteration */
            polar_orient = [];
            polar_loc = [];
            coordinate_loc = [];
        }
        return trialArray;
    }

    mergeTrials(conditions_prac, conditions) {
        let conditions_prac_motor = practiceGen(trials_motor, setSize_motor, minAngle_centers,
            this.props.eccenDist, this.props.itemRadius);
        let conditions_prac2 = practiceGen(trials_prac2, setSize_prac2, minAngle_centers,
            this.props.eccenDist, this.props.itemRadius);
        return [conditions_prac_motor, conditions_prac2, conditions_prac, conditions];
    }

    componentWillMount() {
        $.ajax({
            url: "/v1/condition",
            method: "get",
            success: (data) => {
                console.log(data);
                this.setState({assignment: data});
            },
            error: (err) => {
                console.log(`Error retrieving condition assignment: ${JSON.stringify(err)}`)
            }
        });
        /* if user chooses to leave the assignment, server is notified to record the participant as incomplete */
        window.addEventListener('beforeunload', () => {
            // does not overwrite completion upon unload
            if (!this.state.submitted && this.state.assignment) {
                // calls script file to run on server
                $.ajax({
                    url: `/v1/condition/${this.state.assignment}`,
                    method: "put",
                    success: (data) => {
                        console.log(`Deleted condition: ${this.state.assignment}`);
                    },
                    error: (err) => {
                        console.log(`Error freeing condition: ${err.responseJSON.error}`);
                    }
                });
            }
            /*
            $.ajax({
                url: "/v1/session",
                method: "delete",
                success: (data) => {
                    console.log('Session deleted. Please open a new window to gain permissions to retrieve conditions.')
                },
                error: (err) => {
                    console.log('Error deleting session token!')
                }
            });
            */
        });
    };

    componentDidMount() {
        window.addEventListener('keypress', this.handleKeyPress);
        /*
        if (this.state.state === 'probe' || this.state.state === 'progress') {
            window.addEventListener('keypress', this.handleKeyPress);
        }
        */
    }

    componentWillUnmount() {
        window.removeEventListener('keypress', this.handleKeyPress);

        /* if user chooses to leave the assignment, server is notified to record the participant as incomplete */
        /* does not overwrite completion upon unload */
        if (!this.state.submitted && this.state.assignment) {
            /* calls script file to run on server */
            $.ajax({
                url: `/v1/condition/${this.state.assignment}`,
                method: "put",
                success: (data) => {
                    console.log(`Deleted condition: ${this.state.assignment}`);
                },
                error: (err) => {
                    console.log(`Error freeing condition: ${err.responseJSON.error}`);
                }
            });
        }
    }

    onSubmit(ev) {
        ev.preventDefault();
        let trialStruct = this.state.trialStruct;
        // can add additional data (will need to adjust Schema)
        let view_cond = localStorage.getItem('view_cond');
        //let parsed_view_cond = JSON.parse(view_cond);
        let parameters = localStorage.getItem('parameters');
        let parsed_parameters = JSON.parse(parameters);
        let newDate = new Date();
        let data = {
            assignment_id:          parsed_parameters.assignment_id,
            worker_id:              parsed_parameters.worker_id,
            current_date:           `${newDate.today()} @ ${newDate.timeNow()}`,
            user_agent:             navigator.userAgent,
            window_width:           window.innerWidth,
            window_height:          window.innerHeight,
            screen_width:           window.width,
            screen_height:          window.height,
            //total_time: Number,
            //comments: $('#comments').val(),
            generated_trials:       [trialStruct[0], trialStruct[1]],
            pre_generated_trials:   [trialStruct[2], trialStruct[3]]
        };
        $.ajax({
            url: '/v1/response',
            method: "post",
            data: data,
            success: (data) => {
                this.props.route.user.exit();
                document.forms[0].submit();
            },
            error: (err) => {
                let errorEl = document.getElementById('errorMsg');
                console.log(`Error: ${err.responseJSON.error}`);
                document.forms[0].submit();
            }
        });
    }

    render() {
        if (this.state.state === 'request' && this.state.assignment) {
            this.readConditions(this.state.assignment);
        }

        if (this.state.block !== 'motor') {
            this.displaySequence();
        }

        /*
        submit to turk
            https://workersandbox.mturk.com/mturk/externalSubmit
            https://www.mturk.com/mturk/externalSubmit
        */
        if (this.state.block === 'end') {
            return (<div className='container-fluid'>
                <form id="turkSubmit" action="https://www.mturk.com/mturk/externalSubmit" method="post">
                    <button type="button" className="btn btn-success" onClick={this.onSubmit}>Complete HIT</button>
                </form></div>);
        }

        if (this.state.state === 'instruction' || this.state.state === 'request' || this.state.state === 'error') {
            return instructions(this.state.block, this.state.state, this.nextState);
        } else {
            return (<div>
                <Window
                    width={this.props.width}
                    height={this.props.height}
                    ppd={this.props.ppd}
                    itemRadius={this.props.itemRadius}
                    eccenDist={this.props.eccenDist}
                    state={this.state.state}
                    block={this.state.block}
                    stateData={this.state.stateData}
                    src={this.props.src}
                    announcement={getMessage(0,0)}
                    onResponse={this.handleResponse}
                />
            </div>);
        }
    };
}